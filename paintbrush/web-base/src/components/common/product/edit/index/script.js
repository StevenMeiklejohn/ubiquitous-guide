angular.module('ARN')

.directive('productEditIndex', ['$location', '$q', '$stateParams', 'productService', 'proxyService', 'watchService', '$compile', 'ui', 'userPreferencesService',
					function ($location, $q, $stateParams, productService, proxy, watchService, $compile, ui, preferencesService) {
window.$location = $location;
	var _dir = 'components/common/product/edit/index/';
	return {
		templateUrl: _dir + 'tpl.htm',
		//css: { href: _dir + 'styles.css', preload: true },
		restrict: 'E',
		replace: true,
		scope: {
			profile: '=',
			artwork: '=',
			config: '='
		},
		controller: function ($scope, $element) {

			var _watchService = watchService($scope);

			var profile, artwork,
				profileID,
				product,
				productTypes,
				productVariants,
				profileVariants,
				variantGroups,
				maxQuantity;

			var config = {},
				form,
				isNew = $stateParams.productID === 'add',
				showAdvanced;

			var init = function () {

				if (artwork) {
					$scope.artworkImageURI = proxy.image(artwork.ImageURI, 500);
				}

				product.LimitedQuantity = isNew ? maxQuantity !== null : product.Quantity !== null;
				product.Quantity = isNew && product.LimitedQuantity ? 1 : product.Quantity;
				product.WidthCM = product.WidthMM !== null ? product.WidthMM / 10 : null;
				product.HeightCM = product.HeightMM !== null ? product.HeightMM / 10 : null;

				form = $scope.form = {
					data: product,
					fields: [
						{ type: 'select', name: 'ProductTypeID', label: 'Product Type', options: productTypes, dataType: 'number', required: true, disabled: false },
						{ type: 'number', name: 'Price', label: 'Price (£)', min: 0 },
						{ type: 'checkbox', name: 'LimitedQuantity', label: 'Limited Quantity' },
						{ type: 'number', name: 'Quantity', min: 0, max: maxQuantity, show: 'model.LimitedQuantity', required: 'model.LimitedQuantity' },
						{ type: 'inline-wrap', name: 'Dimensions (cm)', divider: 'x',
							fields: [
								{ type: 'number', name: 'WidthCM', label: 'Width', min: 0, step: 0.1, placeholder: 'W' },
								{ type: 'number', name: 'HeightCM', label: 'Height', min: 0, step: 0.1, placeholder: 'H' }
							]},
						{ type: 'checkbox', name: 'ShowAdvanced', label: 'Advanced Settings', value: showAdvanced }
					]
				};


				//_watchService.watch('form.ready', 'prop', true).then(function () {
				//	form.$on('ui-change', function (event, eventData) {
				//		updateProductTypeLabel();
				//	})
				//});
				updateProductTypeLabel();

				$scope.formVariantPrefs = {
					data: { Method: product.UseProfileVariants ? 'profile': 'product' },
					fields: [
						{ type: 'radio', name: 'Method', label: 'Method', options: [
							{ value: 'profile', label: 'Use default for product type ' + $scope.productType },
							{ value: 'product', label: 'Use product specific variations' }
						]}
					]
				};

				$scope.$watch('form.model.ShowAdvanced', function (val) {
					if (val !== undefined && val !== showAdvanced) {
						preferencesService.set('product', 'showAdvanced', val);
					}
				});

				config.isNew = isNew;
				config.delete = $scope.delete;
				config.save = $scope.save;

				window.TEST = $scope;

				console.log($scope);

			};



			//
			// Private Methods
			//

			//
			// Handles cancel callback
			//
			var cancel = $scope.cancel = function () {
				switch (typeof config.returnURL) {
					case 'function': config.returnURL(); break;
					case 'string': $location.url(config.returnURL); break;
					default: console.warn('config.returnURL not defined');
				}
				$scope.$applyAsync();
			};

			//
			// Prompts user to select product type before initialising forms if this is a new product
			//
			var setProductType = function () {
				var d = $q.defer();

				var scope = $scope.$new(true);
				var html = '<ui-message class="static" config="message"></ui-message><ui-form config="form" />';

				scope.message = { message: 'Please specify the type of product you are adding.' };
				scope.form = {
					fields: [
						{ type: 'select', name: 'ProductTypeID', label: 'Product Type', options: productTypes, dataType: 'number', required: true, empty: false }
					]
				};

				new Dialog({
					title: ' ',
					template: $compile(html)(scope),
					buttons: [{
						text: 'Cancel',
						icon: { left: 'fa fa-fw fa-reply' },
						onclick: cancel
					},{
						text: 'Continue',
						icon: { right: 'fa fa-fw fa-arrow-right' },
						'class': 'green',
						onclick: function () {
							var data = scope.form.getData();
							product.ProductTypeID = data.ProductTypeID;

							productTypes.some(function (t) {
								if (product.ProductTypeID === t.value) {
									maxQuantity = t.maxQuantity;
									return true;
								}
							});

							d.resolve();
						}
					}]
				});

				return d.promise;
			};


			//
			// Updates the current product type label used throughout the UI
			//
			var updateProductTypeLabel = function() {
				$scope.productType = (productTypes.filter(function (type) {
					return type.value === product.ProductTypeID;
				})[0] || {}).label;
			};



			//
			// Product Methods
			//

			$scope.delete = function () {
				if (!product.ID) {
					console.warn('Cannot delete this product: product ID not set yet');
				}
				else {
					var scope = $scope.$new(true);
					scope.message = { type: 'question', message: 'Are you sure you want to delete this product?' };

					var d = new Dialog({
						title: ' ',
						template: $compile('<ui-message config="message"></ui-message>')(scope),
						autoClose: false,
						buttons: [{
							text: 'No',
							icon: { left: 'fa fa-reply fa-fw' },
							onclick: function() {
								d.tidy();
							}
						}, {
							text: 'Yes',
							'class': 'orange',
							icon: { left: 'fa fa-trash fa-fw' },
							onclick: function() {
								d.hide();
								var pd = new Dialog({ 'class': 'lightbox', html: '<div class="ajax-loader"></div>' });

								productService.remove(product.ID)
									.then(function() {
										pd.tidy();
										d.tidy();
										$location.url($scope.config.returnURL);
									})
									.catch(function(e) {
										pd.tidy();
										d.show();
										scope.message = { type: e.status === 403 ? 'warn' : 'error', message: e.data && e.data.Message ? e.data.Message : 'Unexpected error while deleting product.' };
									})
							}
						}]

					})
				}
			};

			$scope.save = function () {
				$scope.pendingChanges = true;

				//
				// Get product info
				//
				var data = form.getData();
				data.Quantity = data.LimitedQuantity ? data.Quantity : null;
				data.UseProfileVariants = $scope.formVariantPrefs.model.Method === 'profile';
				data.WidthMM = data.WidthCM * 10;
				data.HeightMM = data.HeightCM * 10;

				//
				// Get all changes to variants data
				//
				var deletedGroups = [],
					newVariants = [],
					deletedVariants = [],
					updatedVariants = [];

				variantGroups.forEach(function(group) {

					if (group.Deleted) {
						deletedGroups.push(group.ID);
					}

					var variants = $scope.formVariantPrefs.model.Method === 'profile' ? group.ProfileVariants : group.Variants;

					variants.forEach(function (variant) {
						var _form = $scope.variantForms[variant.ID];
						var _data = _form.getData();
						_data.GroupID = group.ID;
						_data.ID = variant.ID;

						if ((_data.ID + '').indexOf('new-') === 0) {
							_data.ID = undefined;
							newVariants.push(_data);
						}
						else if (_form.model.Deleted || group.Deleted) {
							deletedVariants.push(_data);
						}
						else if (_form.hasChanged()) {
							updatedVariants.push(_data);
						}
					})

				});

				//
				// Add/update product
				//
				(function() {
					if (!product.ID) {
						data.ProfileID = profileID;
						data.ArtworkID = (artwork || {}).ID;
						return productService.add(data)
							.then(function (resp) {
								isNew = false;
								product.ID = resp.ID;
							})
					}
					else {
						return productService.update(product.ID, data);
					}
				})()
				//
				// Update variants
				//
				.then(function () {
					var queue = [];

					newVariants.forEach(function (variant) {
						variant.ID = undefined;
						variant.ProfileID = profileID;
						variant.ProductID = product.ID;
						queue.push(
							productService.variant.add(variant)
								.then(function (resp) {
									// if error occurs elsewhere while saving ensure a duplicate
									// is not created for this record when re-saving
									variant.ID = resp.ID;
								})
								.catch(function (err) {
									// flag error on form...
									throw err;
								})
						)
					});

					deletedVariants.forEach(function (variant) {
						queue.push(
							productService.variant.remove(variant.ID)
								.catch(function (err) {
									// flag error on form...
									throw err;
								})
						)
					});

					updatedVariants.forEach(function (variant) {
						queue.push(
							productService.variant.update(variant.ID, variant)
								.catch(function (err) {
									// flag error on form...
									throw err;
								})
						)
					});

					if (queue.length) {
						return $q.all(queue);
					}
				})
				//
				// Remove deleted variant groups
				//
				.then(function () {

					var queue = [];

					deletedGroups.forEach(function (groupID) {
						queue.push(
								productService.variant.groups.remove(groupID)
										.catch(function (err) {
											// flag error on form...
											throw err;
										})
						)
					});

					if (queue.length) {
						return $q.all(queue);
					}
				})
				.then(cancel)
				.catch(function(err) {
					$scope.pendingChanges = false;
					//TODO
				});


			};





			//
			// Variant Methods
			//
			$scope.variantForms = {};

			//
			// Creates a new variant form then adds it to the model
			//
			$scope.createVariantForm = function (variant) {
				var container = $element.find('.variant[data-id=' + variant.ID + '] .form-wrap');

				if (!container.html()) {

					var scope = $scope.$new(true);
					var html = '<ui-form config="config" />';
					var _model = ($scope.variantForms[variant.ID] || {}).model || {};

					scope.config = $scope.variantForms[variant.ID] = {
						data: variant,
						fields: [
							{ type: 'text', name: 'Value', label: 'Value', value: _model.Value, required: true, disabled: 'config.model.Deleted' },
							{ type: 'number', name: 'AdditionalPrice', label: 'Additional Price (£)', value: _model.AdditionalPrice, disabled: 'config.model.Deleted' },
							{ type: 'checkbox', name: 'GroupDefault', label: 'Group Default', value: _model.GroupDefault, disabled: 'config.model.Deleted' }
						]
					};

					container.html($compile(html)(scope));
				}
			};

			//
			// Adds a new variant to the current model
			//
			$scope.addVariant = function(groupID, profileVariant) {

				var group = variantGroups.filter(function (group) {
					return group.ID === groupID;
				})[0];

				var variants = group[(profileVariant ? 'Profile' : '') + 'Variants'];

				var valid = !variants.some(function (variant) {
					return !$scope.variantForms[variant.ID ].isValid();
				});

				if (valid) {
					var id = 'new-' + ui.uid();
					variants.push({
						GroupID: groupID,
						ID: id,
						AdditionalPrice: 0
					});

					$scope.$applyAsync();
				}

				setTimeout(function() {
					$element.find('.group[data-id=' + groupID + '] input.ng-invalid:first').focus();
				}, 100);

			};

			//
			// Toggles deleted status for existing variants, calls removeVariant() on new variants
			//
			$scope.deleteVariant = function (variantID) {
				var form = $scope.variantForms[variantID];

				if ((form.data.ID + '').indexOf('new-') === 0) {
					$scope.removeVariant(variantID);
				}
				else {
					$scope.variantForms[variantID].updateModel('Deleted', !$scope.variantForms[variantID].model.Deleted)
				}

			};

			//
			// Removes a variant from the current model
			//
			$scope.removeVariant = function (variantID) {
				var form = $scope.variantForms[variantID];
				if (form) {

					variantGroups.some(function (group, gIndex) {
						if (group.ID === form.data.GroupID) {
							var prop = 'Variants';

							var comparer = function (variant, vIndex) {
								if (variant.ID === variantID) {

									variantGroups[gIndex][prop].splice(vIndex, 1);
									delete $scope.variantForms[variantID];
									$scope.$applyAsync();

									return true;
								}
							};

							if (!variantGroups[gIndex][prop].some(comparer)) {
								prop = 'Profile' + prop;
								variantGroups[gIndex][prop].some(comparer);
							}

							return true;
						}
					});
				}
			};




			//
			// Variant Group Methods
			//

			//
			// Adds/updates a variant group
			//
			$scope.editVariantGroup = function (group) {

				var scope = $scope.$new(true);
				var html = '<ui-message config="message"></ui-message><ui-form config="form" />';

				scope.form = {
					data: group,
					fields: [
						{ type: 'text', name: 'Name', label: 'Name',  required: true }
					]
				};

				var d = new Dialog({
					//title: '<h2>' + (group ? 'Edit' : 'Add') + ' Group</h2>',
					template: $compile(html)(scope),
					autoClose: false,
					buttons: [{
						text: 'Cancel',
						icon: { left: 'fa fa-fw fa-reply' },
						onclick: function() { d.tidy(); }
					},{
						text: 'Save',
						icon: { left: 'fa fa-fw fa-save' },
						'class': 'sky-blue',
						onclick: function () {
							var data = scope.form.getData();

							(function() {
								if (group) {
									return productService.variant.groups.update(group.ID, data);
								}
								else {
									data.ProductTypeID = $scope.form.model.ProductTypeID;
									data.ProfileID = profileID;
									return productService.variant.groups.add(data);
								}
							})().then(function (resp) {
								if (group) {
									variantGroups.some(function (_group) {
										if (_group.ID === group.ID) {
											_group.Name = data.Name;
											_group.NoVariantsMessage.message = 'No product variations defined for group ' + group.Name;
											return true;
										}
									})
								}
								else {
									data.ID = resp.ID;
									data.Variants = [];
									data.ProfileVariants = [];
									data.NoVariantsMessage = { type:'warn', message: 'No product variations defined for group ' + data.Name };
									variantGroups.push(data);
								}
								d.tidy();
								$scope.$applyAsync();
							}, function(e) {
								scope.message = { type: e.status === 403 ? 'warn' : 'error', message: e.data && e.data.Message ? e.data.Message : 'Unexpected error while saving.' };
							});

						}
					}]
				});
			};

			//
			// Removes a variant group
			//
			$scope.deleteVariantGroup = function (group) {
				group.Deleted = !group.Deleted;
				$scope.$applyAsync();
			};



			//
			// Wait for/load prerequisites then initialise
			//
			_watchService.watch('config').then(function(data) {
				config = data;
			});

			_watchService.any({ artwork: 'ID', profile: 'ID' }).then(function (data) {
				profile = data.profile;
				artwork = data.artwork;

				if (isNew) {
					product = $scope.product = { UseProfileVariants: true };
					productVariants = $scope.productVariants = [];
				}
				else {
					return productService.get($stateParams.productID).then(function (data) {
						product = $scope.product = data;

						return productService.variant.product($stateParams.productID).then(function (data) {
							productVariants = $scope.productVariants = data;
						})
					})
				}
			})
			.then(function() {
				profileID = product.ProfileID || (profile || {}).ID || (artwork || {}).ArtistProfileID;

				return productService.types().then(function (data) {
					productTypes = data.map(function (t) {
						if (product.ProductTypeID === t.ID) {
							maxQuantity = t.MaxQuantity;
						}
						return { label: t.Type, value: t.ID, maxQuantity: t.MaxQuantity };
					});

					// ask user to select type if creating new product
					if (isNew) {
						return setProductType();
					}
				})
				.then(function() {
					return $q.all([
						productService.variant.groups.profile(profileID).then(function (data) {
							variantGroups = $scope.variantGroups = data.filter(function (item) {
								return item.ProductTypeID === product.ProductTypeID;
							});
						}),
						productService.variant.profile(profileID).then(function (data) {
							profileVariants = $scope.profileVariants = data;
						}),
						preferencesService.get('product', 'showAdvanced')
							.then(function(data) {
								showAdvanced = data;
							})
					])
				})
				.then(function () {
					variantGroups.forEach(function(group) {
						group.Variants = productVariants.filter(function(variant) {
							return variant.GroupID === group.ID;
						});
						group.ProfileVariants = profileVariants.filter(function(variant) {
							return variant.GroupID === group.ID;
						});
						group.NoVariantsMessage = { type:'warn',message: 'No product variations defined for group ' + group.Name };
					})
				});

			})
			.then(init)
			.catch(function(err) {
				$scope.error = { type: 'error', message: err.data ? err.data.Message : 'Unexpected Error' };
			});

		}
	}
}]);