

angular.module('ARN')

.directive('artworkPanel', [function () {
	return {
		templateUrl: 'components/common/artwork/grid/',
		controllerAs: 'ctrl',
		bindToController: true,
		controller: ['$scope', function ($scope) {
			//console.info($scope);
		}]
	}
}]);

