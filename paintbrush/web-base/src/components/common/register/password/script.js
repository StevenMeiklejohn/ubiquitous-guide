

angular.module('ARN')

.directive('registerPassword', [function () {
	return {
		templateUrl: 'components/common/register/password/tpl.htm',
		controllerAs: 'ctrl',
		bindToController: true,
		controller: ['$scope', '$http', '$element', function ($scope, $http, $element) {

			var form;
			var createUser = function(password) {

				// generate random password if user is using FB or Google for authentication
				if (!password) {
					password = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
						var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
						return v.toString(16);
					});
				}

				$http.post('/api/register/create-user', {
					Email: $scope.email,
					Password: password,
					AffiliateCodeID: $scope.affiliateCodeID
				})
				.success(function (resp) {

					$scope.setUserID(resp.UserID);
					$scope.setRegistrationID(resp.RegistrationID);

					$scope.authenticate($scope.email, password)
						.then(function (resp) {

							localStorage['accessToken'] = resp.access_token;
							localStorage['refreshToken'] = resp.refresh_token;
							localStorage['tokenType'] = resp.token_type;
							localStorage['profileID'] = resp.ProfileID || -1;

							$scope.nextStep();

							if ($scope.registrationProfile.provider) {
								var d, id = $scope.registrationProfile.id;
								switch ($scope.registrationProfile.provider) {
									case 'facebook': d = { FacebookID: id }; break;
									case 'google': d = { GoogleID: id }; break;
								}
								if (d) {
									d.Name = $scope.registrationProfile.displayName;
									if ($scope.registrationProfile.imageURI) {
										d.ProfileImageURI = $scope.registrationProfile.imageURI;
									}
									if ($scope.registrationProfile.oauthToken) {
										d.OAuthToken = $scope.registrationProfile.oauthToken;
									}

									$http.post('/api/auth/provider/link', d);
								}
							}

						})

					})

			};

			setTimeout(function () {
				form = new Form($element.find('form'), {
					errors: { inline: true }
				});

				// autofocus first field
				$element.find('[name=Password]').focus();

				$element.find('input').keypress(function (e) {
					if (e.which === 13) {
						$scope.next();
					}
				});

				if ($scope.skippingStep) {
					createUser();
				}

			}, 1);

			// if FB/Google registration profile is present skip this step
			$scope.skippingStep = !!$scope.registrationProfile.id;

			$scope.next = function () {

				if (!form.isValid()) {
					form.displayValidationErrors();
				}
				else {
					form.hideMessage();

					var data = form.getData();

					if (data.Password !== data.ConfirmPassword) {
						form.displayMessage('error', 'The passwords entered do not match.')
					}
					else {
						createUser(data.Password);
					}

				}

			};



			$scope.go = function(path) {
				window.location.href = path;
			};


		}]
	}
}]);

