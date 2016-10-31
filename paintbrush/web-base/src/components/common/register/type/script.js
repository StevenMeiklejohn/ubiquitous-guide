

angular.module('ARN')

.directive('registerType', [function () {
	return {
		templateUrl: 'components/common/register/type/tpl.htm',
		controllerAs: 'ctrl',
		bindToController: true,
		controller: ['$scope', function ($scope) {

			$scope._setType = function(type) {
				$scope.setType(type);
				$scope.nextStep();
			};

		}]
	}
}]);

