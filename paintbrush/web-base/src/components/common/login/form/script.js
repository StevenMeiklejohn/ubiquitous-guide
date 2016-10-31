

angular.module('ARN')

.directive('loginForm', [function () {
	return {
		templateUrl: 'components/common/login/form/tpl.htm',
		controllerAs: 'ctrl',
		bindToController: true,
		controller: ['$scope', '$http', '$element', '$stateParams', '$location', 'profileService', function ($scope, $http, $element, $stateParams, $location, profileService) {

			var form,
				displayMessage = function (type, message) {
					form.find('.message').hide().remove();

					form.find('.messages').html('<div class="message error" style="display:none;">' + message + '</div>');

					var _msg = form.find('.message');
					_msg.fadeIn(250);

					setTimeout(function () {
						_msg.fadeOut(500, function () {
							$(this).remove();
						});
					}, 10000);

				};

			// check if the current user is logged in and there is a return url set
			if (localStorage['accessToken'] && localStorage['profileID'] != -1) {
				var _r = $stateParams.r;

				if (!_r || ['/', '#/', '#/login.htm', '/login'].indexOf(_r) > -1) {
					_r = '/dashboard';
				}

				$location.url(_r);
			}
			// check if forgot password view should be shown first
			else if ($stateParams.v === 'forgot') {
				$scope.$parent.view = 'forgot';
				$scope.$parent.email = decodeURIComponent($stateParams.e || '');
			}
			// check if user is resetting password
			else if ($stateParams.c) {
				$scope.$parent.reset_token = $stateParams.c;
				$scope.$parent.view = 'reset';
			}
			// otherwise wire up login form
			else {
				form = $element.find('form');

				var submitButton = form.find('.buttons > .submit'),
					email = form.find('#email'),
					password = form.find('#password'),
					messages = form.find('.messages');

				form.find('input').keypress(function (e) {
					if (e.which === 13) {
						submitButton.click();
					}
				});

				email.on('keyup change', function () {
					$scope.email = decodeURIComponent($(this).val() || '');
				});

				email.focus();

				submitButton.click(function () {
					var errors = [];

					// check fields are valid
					if (email[0].validity.valueMissing) {
						errors.push('Please enter an email address');
					}
					if (password[0].validity.valueMissing) {
						errors.push('Please enter a password');
					}

					if (errors.length) {
						displayMessage('error', errors.join('<br/>'));
					}
					else {

						var _email = email.val();

						$scope
						.authenticate(_email, password.val())
						.then(
							function (data) {

								// user must reset password before gaining access to the system
								if (data.reset_token) {
									$scope.view = 'reset';
									$scope.reset_token = data.reset_token;
									$scope.access_token = data.access_token;
									$scope.token_type = data.token_type;
									$scope.profileID = data.ProfileID || -1;
								}
									// user is fully authenticated
								else {
									localStorage['accessToken'] = data.access_token;
									localStorage['refreshToken'] = data.refresh_token;
									localStorage['tokenType'] = data.token_type;
									localStorage['profileID'] = data.ProfileID;
									localStorage['activeProfileID'] = data.ProfileID;


									// user is currently in the process of registering, force user to complete
									// - may have quit/timed out before completing the process
									if (data.RegistrationID) {
										sessionStorage['registrationEmail'] = _email;
										$location.url('/register');
									}

										// load the current users profile into the root scope
									else {
										profileService.get(data.ProfileID)
											.then(function (profile) {
												$scope.$root.activeProfile = { ID: -1 };
												$scope.$root.authenticated = true;

												$scope.$root.setUserProfile(profile, function () {
													var _uri = '/dashboard';
													if ($stateParams.r && $stateParams.r.indexOf('/register') < 0) {
														_uri = $stateParams.r;
													}
													$location.url(_uri);
												});
											});
									}
								}

							},
							function (resp) {
								displayMessage('error',
									resp.status === 403 ?
										'Either the email address or password entered was incorrect'
										: 'An unexpected error has occurred'
								);

							}
						);
					}

				});
			}

			$scope.go = function(path) {
				window.location.href = path;
			}

		}]
	}
}]);

