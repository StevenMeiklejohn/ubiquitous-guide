

angular.module('ARN')

.directive('profileInfo', [function () {
	return {
		templateUrl: 'components/common/profile/view/info/tpl.htm',
		controllerAs: 'ctrl',
		bindToController: true,
		controller: ['$scope', function ($scope) {

		}]
	}
}]);

