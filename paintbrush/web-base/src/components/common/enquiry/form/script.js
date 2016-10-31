

angular.module('ARN')

.directive('enquiryForm', [function () {
	return {
		templateUrl: 'components/common/enquiry/form/tpl.htm',
		controller: ['$scope', '$http', '$element', function ($scope, $http, $element) {


			var form;

			setTimeout(function () {
				form = new Form($element.find('form'), {
					autoFocus: false
				});
			}, 150)

			$scope.send = function () {
				
				if (!form.isValid()) {
					form.displayValidationErrors();
				}
				else {
					var data = form.getData();

					$http.post('/api/enquiry/submit', data)
						.success(function() {
							$scope.sent = true;
						})
						.error(function(err) {
							form.displayMessage('error', err.Message)
						});

				}


			}

		}]
	}
}]);

