

angular.module('ARN')

.directive('artworkWizardStepProduct', [function () {
	var _dir = 'components/common/artwork/wizard/step/product/';
	return {
		templateUrl: _dir + 'tpl.htm',
		replace: true,
		restrict: 'E',
		scope: { config: '=' },
		controller: ['$scope', 'watchService', function ($scope, watchService) {

			var config;

			var init = function () {
				config = $scope.config;

				console.warn(config);

				config.complete = true;
				config.ready = true;
			};

			watchService($scope).watch('config').then(init);

		}]
	}
}]);

