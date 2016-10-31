
angular.module('ARN')

.directive('loginForgotPassword', [function () {
	return {
		templateUrl: 'components/common/login/forgot-password/tpl.htm',
		controllerAs: 'ctrl',
		bindToController: true,
		controller: ['$scope', '$http', '$element', function ($scope, $http, $element) {

			var form;
			setTimeout(function () {
				form = new Form($element.find('form'));
			}, 1)

			$scope.sendResetLink = function () {

				if (!form.isValid()) {
					form.displayValidationErrors();
				}
				else {
					var _data = form.getData();

					$http.post('/api/auth/forgot', _data)
						.success(function () {
							$scope.email = _data.Email;
							$scope.sent = true;
						})
						.error(function (err) {
							form.displayMessage('error', err.Message);
						})
				}

				

			}
		}]
	}
}]);

