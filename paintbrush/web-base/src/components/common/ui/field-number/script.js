(function(){

angular.module('ARN')
	.directive('uiFieldNumber', ['ui', 'watchService', function (ui, watchService) {
		return {
			templateUrl: 'components/common/ui/field-number/tpl.htm',
			restrict: 'E',
			replace: true,
			scope: {
				config: '=',
				model: '=',
				value: '='
			},
			link: function ($scope) {

				watchService($scope).watch('config').then(function (config) {
					config.uid = (config.name || 'field') + '-' + ui.uid();
				});

			}
		}
	}])
})();