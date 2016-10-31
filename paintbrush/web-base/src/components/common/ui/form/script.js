(function(undefined){

angular.module('ARN')
	.directive('uiForm', ['$compile', 'watchService', function ($compile, watchService) {
		return {
			//templateUrl: 'components/common/ui/form/tpl.htm',
			template: '<form class="ui ui-form"></form>',
			restrict: 'E',
			replace: true,
			scope: {
				config: '='
			},
			link: function ($scope, $element) {

				var config,
					initialData,
					childScopes = [];


				//
				// Appends an array of fields to the specified container element
				//
				var appendFields = function (container, fields) {

					(fields || []).forEach(function (field) {
						var scope = $scope.$new(true),
							templateHtml;

						if (field.show === undefined) {
							field.show = true;
						}

						switch (field.type) {
							case 'message':
								scope.config = field.config;
								templateHtml = '<ui-message config="config"/>';
								break;

							case 'inline-wrap':
								scope.config = field;
								container.append($compile('<ui-field-inline-wrap config="config" />')(scope));

								watchService(scope).watch('config.wrapElement').then(function (element) {
									appendFields(element, field.fields);
								});
								break;

							default:

								if (field.value === undefined) {
									field.value = initialData[field.name || ''];
								}
								if (field.dataType === undefined) {
									var _dataType;

									switch (field.type) {
										case 'checkbox': _dataType = 'boolean'; break;
										case 'select':
											if (field.options && field.options[0]) {
												_dataType = typeof field.options[0 ].value;
											}
											break;
									}
									field.dataType = _dataType || field.type;
								}
								config.model[field.name] = field.value;
								scope.config = field;
								scope.config.model = config.model;
								scope.config.change = function () {

									// emit change event to
									scope.$emit('ui-change', {
										form: config,
										field: field.name,
										value: config.model[field.name]
									});

								};

								childScopes.push(scope);

								templateHtml = '<ui-field-' + (field.type || 'text') + ' config="config" value="config.value" model="config.model" />';
								break;
						}
						//console.info(scope);
						if (templateHtml) {
							container.append($compile(templateHtml)(scope));
						}
					})
				};

				//
				// Converts a string to a specific data type
				//
				var convert = function (value, dataType) {
					if (value) {
						console.log(value);
						console.log(dataType);

						switch (dataType) {
							case 'bool':
							case 'boolean':
								if (typeof value !== 'boolean') {
									value = (!value || value.toLowerCase() === 'false') ? false : true;
								}
								break;
							case 'number':
								value = isNaN(value * 1) ? null : value * 1;
								break;
							case 'json':
								value = JSON.parse(value);
								break;
						}
					}
					return value;
				};


				//
				// Returns the current data in the form
				//
				var getData = function () {
					var inputs = $element.find('input, select, textarea').not('.validation-shim');
					var data = inputs.serializeObject();

					//console.log($element);
					//console.log(inputs);
					//console.log(inputs.serializeObject());

					inputs.filter("[disabled]").each(function () {
						data[$(this).attr("name")] = $(this).val();
					});

					// include all checkboxes in data - browser's default behaviour will only serialize ticked checkboxes
					inputs.filter("[type=checkbox]").not('.multi-select .values input').each(function () {
						data[$(this).attr("name")] = $(this).prop("checked");
					});

					// build list of fields so we can check data types
					// - fields may be embedded inside other fields so recursively build list
					var fields = [],
						addFields = function(_fields) {
							_fields.forEach(function (field) {
								if (field.fields) {
									addFields(field.fields);
								}
								else {
									fields.push(field);
								}
							});
						};
					addFields(config.fields || []);


					// apply data types specified in config
					fields.forEach(function (field) {
						var value = data[field.name];

						if (field.isArray && !$.isArray(value)) {
							value = [value];
						}

						if ($.isArray(value)) {
							var unique = [];
							for (var j in value) {
								if (unique.indexOf(value[j]) < 0 && value[j] !== '') {
									unique.push(convert(value[j], field.dataType));
								}
							}
							value = unique;
						}
						else {
							value = convert(value, field.dataType);
						}

						data[field.name] = value;
					});

					return data;
				};


				//
				// Returns all validation errors present in the current form instance
				//
				var getErrors = function () {
					var inputs = $element.find('input, select, textarea'),
						validationErrors = [],
						processed = {};

					inputs.each(function () {
						var _name = $(this).attr('name');

						if (!this.validity.valid && !processed[_name]) {
							processed[_name] = 1;

							var _error = {
								element: $(this),
								Name: $element.find('[for="' + _name + '"]').text() || _name,	// attempt to use label text when referring to field
								Message: this.validationMessage
							};

							validationErrors.push(_error);
						}
					});

					return validationErrors;
				};


				//
				// Returns true if the current model has changed when compared to the initial form data
				//
				var hasChanged = function () {
					for (var prop in config.model) {
						if (
							initialData[prop]!== undefined &&	// ignore new values not defined in initial data
							config.model[prop] !== initialData[prop]
						) {
							return true;
						}
					}
					return false;
				};


				//
				// Returns true if form is currently valid
				//
				var isValid = function () {
					return getErrors().length < 1;
				};




				//
				// Updates a value in the form model and triggers a digest cycle
				//
				var updateModel = function (property, value) {
					config.model[property] = value;

					if (config.ready) {
						$scope.$applyAsync();
					}
				};


				var init = function () {

					$scope.data = initialData = config.data || {};
					$scope.model = config.model = {};

					if (config.fields) {
						appendFields($element, config.fields)
					}

					console.log($scope);

					config.ready = true;
					config.getData = getData;
					config.getErrors = getErrors;
					config.hasChanged = hasChanged;
					config.isValid = isValid;
					config.updateModel = updateModel;

					config.$on = function (name, listener) {
						$scope.$on(name, listener);
					};
				};


				watchService($scope).watch('config').then(function (data) {
					config = data;
					init();
				})

			}
		}
	}])
})();