

angular.module('ARN')

.directive('registerEmail', [function () {
	return {
		templateUrl: 'components/common/register/email/tpl.htm',
		controllerAs: 'ctrl',
		bindToController: true,
		controller: ['$scope', '$http', '$element', '$stateParams', '$location', '$q', function ($scope, $http, $element, $stateParams, $location, $q) {


			var form;

			setTimeout(function () {
				form = new Form($element.find('form'), {
					errors: { inline: true }
				});

				// autofocus email field
				$element.find('[name=Email]').focus().keypress(function (e) {
					if (e.which === 13) {
						$scope.next();
					}
				});

				//$element.find('[name=AffiliateCode]').keyup(checkAffiliateCode).keyup();
				if ($scope.registrationProfile.email) {
					$element.find('[name=Email]').val($scope.registrationProfile.email).change();
				}
			}, 1);
			
		
			$scope.next = function () {

				if (!form.isValid()) {
					form.displayValidationErrors();
				}
				else {
					form.hideMessage();

					var _data = form.getData();
					var _email = _data.Email;

					$scope.pendingRequest = true;
					
					$scope.checkStatus(_email).success(function (resp) {
							
						if (resp.Exists) {

							// already fully registered
							if (!resp.RegistrationID) {
								new Dialog({
									title: '<h4>Already Registered</h4>',
									html: '<div class="message">The email address entered already exists, please select an action:</div>',
									buttons: [{
										text: 'Cancel',
										icon: { left: 'fa fa-reply' }
									}, {
										text: 'Reset Password',
										icon: { left: 'fa fa-question' },
										'class': 'sky-blue',
										onclick: function () {
											$location.url('/login?v=forgot&e=' + encodeURIComponent(_email));
											$scope.forceDigest();
										}
									}, {
										text: 'Login',
										icon: { left: 'fa fa-lock' },
										'class': 'sky-blue',
										onclick: function () {
											$location.url('/login');
											$scope.forceDigest();
										}
									}]
								})
							}

							// resume existing registration
							else {
								$scope.setEmail(_email);
								$scope.resume(resp);
							}

						}

						// start new registration
						else {
							$scope.setEmail(_email);
							if (_data.AffiliateCodeID) {
								$scope.setAffiliateCodeID(_data.AffiliateCodeID);
							}
							$scope.nextStep();
						}

					})
					.error(function () {
						// TODO
					})
					.finally(function () {
						$scope.pendingRequest = false;
					})

				}

			};


			$scope.affiliateCode = { Code: $location.search().rc };

		}]
	}
}]);

