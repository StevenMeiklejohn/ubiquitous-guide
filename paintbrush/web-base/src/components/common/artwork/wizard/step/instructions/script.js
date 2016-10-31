

angular.module('ARN')

.directive('artworkWizardStepInstructions', [function () {
	var _dir = 'components/common/artwork/wizard/step/instructions/';
	return {
		templateUrl: _dir + 'tpl.htm',
		replace: true,
		restrict: 'E',
		scope: { profile: '=' },
		controller: ['$scope', 'watchService', function ($scope, watchService) {
			//console.warn($scope);
			$scope.$parent.next();
		}]
	}
}]);

