

angular.module('ARN')

.directive('registerTerms', [function () {
	return {
		templateUrl: 'components/common/register/terms/tpl.htm',
		controllerAs: 'ctrl',
		bindToController: true,
		controller: ['$scope', function ($scope) {

			$scope.next = function () {
				$scope.nextStep();
			}

		}]
	}
}]);

