

angular.module('ARN')

.directive('termsAndConditions', [function () {
	return {
		templateUrl: 'components/common/terms/tpl.htm',
		controllerAs: 'ctrl',
		bindToController: true,
		controller: ['$scope', function ($scope) {


		}]
	}
}]);

