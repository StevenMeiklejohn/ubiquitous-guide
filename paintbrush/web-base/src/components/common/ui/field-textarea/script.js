(function(){

angular.module('ARN')
	.directive('uiFieldTextarea', ['ui', 'watchService', function (ui, watchService) {
		return {
			templateUrl: 'components/common/ui/field-textarea/tpl.htm',
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