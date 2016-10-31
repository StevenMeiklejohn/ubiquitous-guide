(function(){

angular.module('ARN')
	.directive('uiFieldRadio', ['ui', 'watchService', function (ui, watchService) {
		return {
			templateUrl: 'components/common/ui/field-radio/tpl.htm',
			restrict: 'E',
			replace: true,
			scope: {
				config: '=',
				model: '=',
				value: '='
			},
			link: function ($scope) {

				watchService($scope).watch('config').then(function (config) {
					var idPrefix = (config.name || 'field') + '-';
					config.uid = idPrefix + ui.uid();

					(config.options || []).forEach(function (option) {
						option.uid = idPrefix + 'option-' + ui.uid();
					})
				});

			}
		}
	}])
})();