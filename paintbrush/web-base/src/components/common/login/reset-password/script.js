

angular.module('ARN')

.directive('loginResetPassword', [function () {
	return {
		templateUrl: 'components/common/login/reset-password/tpl.htm',
		controllerAs: 'ctrl',
		bindToController: true,
		controller: ['$scope', '$http', '$element', '$stateParams', '$location', function ($scope, $http, $element, $stateParams, $location) {

			// reference to form instance
			var form;

			// loads user profile into root scope once authenticated
			var loadProfile = function () {
				$http.get('/api/profile/' + localStorage['profileID'])
					.success(function (profile) {
						$scope.$root.setUserProfile(profile);
						$scope.$root.authenticated = true;

						var _r = $stateParams.r;

						if (!_r || ['/', '#/', '#/login.htm', '/login'].indexOf(_r) > -1) {
							_r = '/dashboard';
						}

						$location.url(_r);
					});
			};


			$scope.resetPassword = function() {

				var data = form.getData();

				if (data.NewPassword !== data.ConfirmPassword) {
					form.displayMessage('error', 'The passwords entered do not match.')
				}
				else {

					if (data.OldPassword) {
						$http({
							method: 'PUT',
							url: '/api/auth/password/change/' + data.OldPassword + '/' + data.NewPassword
						})
						.success(function () {
							// redirect?
						})
						.error(function (err) {
							form.displayMessage('error', err.Message);
						})

					}
					else {

						$http({
							method: 'PUT',
							url: '/api/auth/password/reset/' + $scope.reset_token + '/' + data.NewPassword,
							//headers: {'Authorization': 'Bearer ' + $scope.access_token }
						})
						.success(function (resp) {

							if ($scope.access_token) {
								localStorage['accessToken'] = $scope.access_token;
								localStorage['refreshToken'] = $scope.refresh_token;
								localStorage['tokenType'] = $scope.token_type;
								localStorage['profileID'] = $scope.profileID;
								loadProfile();
							}
							else {
								$scope.authenticate(resp.Email, data.NewPassword)
								.then(function (data) {
									localStorage['accessToken'] = data.access_token;
									localStorage['refreshToken'] = data.refresh_token;
									localStorage['tokenType'] = data.token_type;
									localStorage['profileID'] = data.ProfileID || -1;
									loadProfile();
								})

							}

						})
						.error(function (err) {
							form.displayMessage('error', err.Message);
						})

					}
					
				}

			};


			setTimeout(function(){
				form = new Form($element.find('form'));

				//
				// Check reset token exists, if not found offer to send a new one
				//
				if ($scope.reset_token) {
					$http({
						method: 'PUT',
						url: '/api/auth/password/reset/' + $scope.reset_token +'/-'
					})
					.catch( function(resp) {
						if (resp.status === 404 && resp.data && resp.data.Message && resp.data.Message === 'Reset code not found') {
							$scope.invalidResetToken = true;
						}
					})
				}
			}, 100);




		}]
	}
}]);

