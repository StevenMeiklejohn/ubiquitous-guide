(function(){

angular.module('ARN')
	.directive('uiFieldHidden', ['ui', 'watchService', function (ui, watchService) {
		return {
			templateUrl: 'components/common/ui/field-hidden/tpl.htm',
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

					// if config.value and not config.model[config.name] the copy to model
				});

			}
		}
	}])
})();