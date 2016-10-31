

angular.module('ARN')

.directive('registerReauth', [function () {
	return {
		templateUrl: 'components/common/register/re-authenticate/tpl.htm',
		controllerAs: 'ctrl',
		bindToController: true,
		controller: ['$scope', '$http', '$element', '$stateParams', function ($scope, $http, $element, $stateParams) {


			var form;

			setTimeout(function () {
				form = new Form($element.find('form'), {
					errors: { inline: true }
				});
			}, 1)
			
		
			$scope.next = function () {

				if (!form.isValid()) {
					form.displayValidationErrors();
				}
				else {
					form.hideMessage();

					var data = form.getData();

					$scope.authenticate(sessionStorage['registrationEmail'], data.Password)
						.then(
							function (resp) {

								localStorage['accessToken'] = resp.access_token;
								localStorage['refreshToken'] = resp.refresh_token;
								localStorage['tokenType'] = resp.token_type;
								localStorage['profileID'] = resp.ProfileID || -1;

								$scope.$parent.reAuthenticate = false;
								$scope.forceDigest();
							}, function (err) {
								form.displayMessage('error', err.data.Message)
							}
						);

				}

			}
			


		}]
	}
}]);

