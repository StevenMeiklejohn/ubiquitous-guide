(function(){

angular.module('ARN')
	.directive('uiFieldSelect', ['ui', 'watchService', function (ui, watchService) {
		return {
			templateUrl: 'components/common/ui/field-select/tpl.htm',
			restrict: 'E',
			replace: true,
			scope: {
				config: '=',
				model: '=',
				value: '='
			},
			link: function ($scope, $element) {
				watchService($scope).watch('config').then(function (config) {
					config.uid = (config.name || 'field') + '-' + ui.uid();

					setTimeout(function () {
						$element.find('option[value="? undefined:undefined ?"]').remove();
					}, 1)
				});

			}
		}
	}])
})();