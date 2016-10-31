(function(){

angular.module('ARN')
	.directive('uiFieldInlineWrap', ['ui', 'watchService', function (ui, watchService) {
		return {
			templateUrl: 'components/common/ui/field-inline-wrap/tpl.htm',
			restrict: 'E',
			replace: true,
			scope: {
				config: '='
			},
			link: function ($scope, $element) {

				console.warn($scope)

				watchService($scope).watch('config').then(function (config) {
					var element = $element.find('.wrap-element');

					config.uid = (config.name || 'field') + '-' + ui.uid();
					config.wrapElement = element;

					var total = config.fields.length;
					element.addClass(
						'fields-' + total +
						' fields-' + (total % 2 ? 'even' : 'odd')
					);

					setTimeout(function() {
						var fields = element.find('> .field');

						if (config.divider) {
							fields.not(':last').after('<div class="divider"><span class="v-align">' + config.divider + '</span></div>');
						}
						if (config.suffix) {
							fields.last().after('<div class="suffix"><span class="v-align">' + config.suffix + '</span></div>');
						}
					}, 10)


				});

			}
		}
	}])
})();