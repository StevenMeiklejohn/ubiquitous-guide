(function(){

angular.module('ARN')
	.directive('uiFieldRepeater', ['ui', 'watchService', '$compile', function (ui, watchService, $compile) {
		return {
			templateUrl: 'components/common/ui/field-repeater/tpl.htm',
			restrict: 'E',
			replace: true,
			scope: {
				config: '=',
				model: '=',
				value: '='
			},
			link: function ($scope, $element) {

				var config,
					childScopes = [];


				//
				// Appends a new field to end of element wrap
				//
				var appendField = function (val) {
					var scope = $scope.$new(true),
						field = angular.extend({}, config.field);

					field.label = false;
					field.value = val;
					field.model = {};
					field.model[field.name] = val;
					field.modelOptions = { debounce: 50 };

					if (field.show === undefined) {
						field.show = true;
					}

					scope.config = field;
					scope.config.change = function () {

						syncModel();

						var totalFields = childScopes.length;
						var totalValues = config.model[config.name ].length;

						// check min fields requirement is met
						if (totalFields < config.minValues) {
							for (var i = totalFields; i < config.minValues; i++) {
								appendField('');
							}
						}

						// check if we have not reached max fields limit and there are no empty fields
						totalFields = childScopes.length;
						if (totalFields < config.maxValues && totalValues === totalFields) {
							appendField('');
						}
						// tidy up extra empty fields
						else if (totalFields - totalValues > 1) {
							removeField(scope);
						}

						// tell parent form to broadcast a change event
						config.change && config.change();
					};

					childScopes.push(scope);

					var templateHtml = '<ui-field-' + (field.type || 'text') + ' config="config" value="config.value" model="config.model" />';

					$element.find('.wrap-element').append($compile(templateHtml)(scope));
				};


				//
				// Removes a specific field from element wrap
				//
				var removeField = function (scope) {
					childScopes = childScopes.filter(function (s) {
						return s.$id !== scope.$id;
					});

					$element.find('.wrap-element > [data-uid=' + scope.config.uid + ']').remove();
				};


				//
				// Updates config.model to reflect values held in child scopes
				//
				var syncModel = function () {
					config.model[config.name] = childScopes
						.map(function (scope) {
							return scope.config.model[scope.config.name];
						})
						.filter(function (val) {
							return val !== '';
						});
				};


				var init = function () {
					config.uid = (config.name || 'field') + '-' + ui.uid();
					config.field.name = config.name;
					config.isArray = true;
					config.minValues = config.minValues || 1;
					config.maxValues = config.maxValues || 100;

					// ensure value is an array
					if (!Array.isArray(config.value)) {
						config.value = config.value === undefined ? []: [config.value];
					}

					config.value.forEach(function (val) {
						appendField(val);
					});

					// ensure there is at least one field
					var totalValues = config.value.length;
					if (totalValues < config.minValues) {
						for (var i = totalValues; i < config.minValues; i++) {
							appendField('');
						}
					}

					console.log('config')
					console.log(config)
				};


				watchService($scope).watch('config').then(function (val) {
					config = val;
					init();
				});

			}
		}
	}])
})();