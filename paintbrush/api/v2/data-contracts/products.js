var Promise = require('bluebird'),
	AccessToken = require('../../auth/access-token'),
	Permission = require('../lib/permission'),
	service = require('../services/products'),
	ERROR = require('../error-codes'),
	is = require('../lib/validate').is;


module.exports = {


	types: function() {
		return new Promise(function(resolve) {
			service.types()
				.then(function(types) {
					resolve({ status: 200, body: types });
				})
				.catch(function (err) {
					processError(err, req, resolve, 'Error occurred while fetching product types');
				})
		});
	},


	//
	// Products
	//

	get: function (req) {
		return new Promise(function(resolve) {
			var productID = req.params.productID;

			if (productID === undefined) {
				resolve({status: 400, body: ERROR('MissingProductID') });
			}
			else if (!is.int(productID, 1)) {
				resolve({status: 400, body: ERROR('InvalidProductID') });
			}
			else {
				service.get(productID)
					.then(function(data) {
						if (!data) {
							resolve({ status: 404, body: { Message: 'Product not found' } });
						}
						else {
							data.UseProfileVariants = !!data.UseProfileVariants;
							resolve({ status: 200, body: data });
						}

					})
					.catch(function (err) {
						processError(err, req, resolve, 'Error occurred while fetching product');
					})
			}
		});
	},

	add: function(req) {
		return new Promise(function(resolve) {

			var product = req.body;

			if (product.ProfileID === undefined) {
				resolve({ status: 400, body: ERROR('MissingProfileID') });
			}
			else if (product.ProductTypeID === undefined) {
				resolve({ status: 400, body: ERROR('MissingProductTypeID') });
			}
			else if (product.Quantity === undefined) {
				resolve({ status: 400, body: ERROR('MissingValue', { field: 'Quantity' }) });
			}
			else if (product.Price === undefined) {
				resolve({ status: 400, body: ERROR('MissingValue', { field: 'Price' }) });
			}
			else if (product.UseProfileVariants === undefined) {
				resolve({ status: 400, body: ERROR('MissingValue', { field: 'UseProfileVariants' }) });
			}
			else if (!is.int(product.ProfileID, 1)) {
				resolve({ status: 400, body: ERROR('InvalidProfileID') });
			}
			else if (product.ArtworkID !== undefined && !is.int(product.ArtworkID, 1)) {
				resolve({ status: 400, body: ERROR('InvalidArtworkID') });
			}
			else if (!is.int(product.ProductTypeID, 1)) {
				resolve({ status: 400, body: ERROR('InvalidProductTypeID') });
			}
			else if (!is.bool(product.UseProfileVariants)) {
				resolve({ status: 400, body: ERROR('InvalidBool', { field: 'UseProfileVariants' }) });
			}
			else if (!is.int(product.Price, 1)) {
				resolve({ status: 400, body: ERROR('IntBelowMin', { field: 'Price' }) });
			}
			else if (product.WidthMM !== undefined && !is.int(product.WidthMM, 1)) {
				resolve({ status: 400, body: ERROR('IntBelowMin', { field: 'WidthMM' }) });
			}
			else if (product.HeightMM !== undefined && !is.int(product.HeightMM, 1)) {
				resolve({ status: 400, body: ERROR('IntBelowMin', { field: 'HeightMM' }) });
			}
			else if (product.Quantity !== null && !is.int(product.Quantity, 0)) {
				resolve({ status: 400, body: ERROR('IntBelowMin', { field: 'Quantity', min: -1 }) });
			}
			else {

				AccessToken.getUser(req).then(function (user) {

					// TODO: check permissions

					service.add(product)
						.then(function(id) {
							resolve({ status: 200, body: { ID: id, Message: 'Success' } });
						})
						.catch(function (err) {
							processError(err, req, resolve, 'Error occurred while creating product');
						})

				})

			}

		});
	},

	update: function (req) {
		return new Promise(function(resolve) {

			var productID = req.params.productID,
				product = req.body;

			//		"UseProfileVariants": true

			if (productID === undefined) {
				resolve({ status: 400, body: ERROR('MissingProductID') });
			}
			else if (product.Price === undefined) {
				resolve({ status: 400, body: ERROR('MissingValue', { field: 'Price' }) });
			}
			else if (!is.int(productID, 1)) {
				resolve({ status: 400, body: ERROR('InvalidProductID') });
			}
			else if (!is.int(product.Price, 1)) {
				resolve({ status: 400, body: ERROR('IntBelowMin', { field: 'Price' }) });
			}
			else if (product.UseProfileVariants !== undefined && !is.bool(product.UseProfileVariants)) {
				resolve({ status: 400, body: ERROR('InvalidBool', { field: 'UseProfileVariants' }) });
			}
			else if (product.WidthMM !== undefined && !is.int(product.WidthMM, 1)) {
				resolve({ status: 400, body: ERROR('IntBelowMin', { field: 'WidthMM' }) });
			}
			else if (product.HeightMM !== undefined && !is.int(product.HeightMM, 1)) {
				resolve({ status: 400, body: ERROR('IntBelowMin', { field: 'HeightMM' }) });
			}
			else if (product.Quantity !== undefined && product.Quantity !== null && !is.int(product.Quantity, 0)) {
				resolve({ status: 400, body: ERROR('IntBelowMin', { field: 'Quantity', min: -1 }) });
			}
			else {

				AccessToken.getUser(req).then(function (user) {

					service.get(productID)
						.then(function (existingRecord) {

							if (!existingRecord) {
								resolve({ status: 404, body: { Message: 'Product not found' }})
							}
							else {

								// TODO: check user has permission to update product

								service.update(productID, product)
									.then(function() {
										resolve({ status: 200, body: { Message: 'Success' } });
									})
									.catch(function (err) {
										processError(err, req, resolve, 'Error occurred while updating product');
									})

							}
						});

				})

			}

		});
	},

	remove: function (req) {
		return new Promise(function(resolve) {
			var productID = req.params.productID;

			if (productID === undefined) {
				resolve({status: 400, body: ERROR('MissingProductID') });
			}
			else if (!is.int(productID, 1)) {
				resolve({status: 400, body: ERROR('InvalidProductID') });
			}
			else {
				service.remove(productID)
					.then(function() {
						resolve({ status: 200, body: { Message: 'Success' }});
					})
					.catch(function (err) {
						processError(err, req, resolve, 'Error occurred while deleting product');
					})
			}
		});
	},


	search: function(req) {
		return new Promise(function (resolve) {

			var filters = req.body.Filters || {},
				pagination = req.body.Pagination || {},
				sort = req.body.Sort || {};

			//
			// check data types
			//
			if (filters.ProfileID === undefined && filters.ArtworkID === undefined) {
				resolve({ status: 400, body: { Message: 'Please specify either an ArtworkID or ProfileID filter.'} });
			}
			else if (filters.ProfileID !== undefined && !is.int(filters.ProfileID, 1)) {
				resolve({ status: 400, body: ERROR('InvalidProfileID') });
			}
			else if (filters.ArtworkID !== undefined && !is.int(filters.ArtworkID, 1)) {
				resolve({ status: 400, body: ERROR('InvalidArtworkID') });
			}
			else if (filters.ProductTypeID !== undefined && !is.int(filters.ProductTypeID, 1)) {
				resolve({ status: 400, body: ERROR('InvalidProductTypeID') });
			}


			//
			// Otherwise perform search query
			//
			else {
				AccessToken.getUser(req).then(function (user) {

					// TODO: define permissions!!!

					service.search(filters, pagination, sort)
						.then(function(results) {

							// fix returned data types for bool properties
							results.Data.forEach(function(aw){
								aw.UseProfileVariants = !!aw.UseProfileVariants;
							});

							resolve({ status: 200, body: results });
						})
						.catch(function (err) {
							processError(err, req, resolve, 'Error occurred while performing search query');
						})


				})
			}

		});
	},




	//
	// Product Variants
	//

	variant: {

		get: function (req) {
			return new Promise(function(resolve) {

			});
		},

		add: function(req) {
			return new Promise(function(resolve) {

				var variant = req.body;

				if (variant.ProfileID === undefined) {
					resolve({status: 400, body: ERROR('MissingProfileID') });
				}
				else if (variant.GroupID === undefined) {
					resolve({status: 400, body: ERROR('MissingGroupID') });
				}
				else if (variant.ProductID === undefined) {
					resolve({status: 400, body: ERROR('MissingProductID') });
				}
				else if (!is.string(variant.Value, 1, 100)) {
					resolve({status: 400, body: ERROR('StringOutOfRange', { field: 'Value', min: 1, max: 100 }) });
				}
				else if (!is.int(variant.ProfileID, 1)) {
					resolve({status: 400, body: ERROR('InvalidProfileID') });
				}
				else if (!is.int(variant.GroupID, 1)) {
					resolve({status: 400, body: ERROR('InvalidGroupID') });
				}
				else if (!is.int(variant.ProductID, 1)) {
					resolve({status: 400, body: ERROR('InvalidProductID') });
				}
				else if (variant.GroupDefault !== undefined && !is.bool(variant.GroupDefault)) {
					resolve({ status: 400, body: ERROR('InvalidBool', { field: 'GroupDefault' }) });
				}
				else if (variant.AdditionalPrice !== undefined && !is.int(variant.AdditionalPrice)) {
					resolve({status: 400, body: ERROR('InvalidInt', { field: 'AdditionalPrice' }) });
				}
				else {

					// TODO: check current user has permission to add variants for specified profileID

					service.variant.add(variant)
						.then(function(id) {
							resolve({ status: 200, body: { ID: id, Message: 'Success' } });
						})
						.catch(function (err) {
							processError(err, req, resolve, 'Error occurred while adding variant');
						})
				}

			});
		},

		remove: function (req) {
			return new Promise(function(resolve) {
				var variantID = req.params.variantID;

				if (variantID === undefined) {
					resolve({status: 400, body: ERROR('MissingVariantID') });
				}
				else if (!is.int(variantID, 1)) {
					resolve({status: 400, body: ERROR('InvalidVariantID') });
				}
				else {
					// TODO: check current user has permission to remove variants for specified profileID
					service.variant.remove(variantID)
						.then(function(id) {
							resolve({ status: 200, body: { ID: id, Message: 'Success' } });
						})
						.catch(function (err) {
							processError(err, req, resolve, 'Error occurred while removing variant');
						})
				}
			});
		},

		update: function (req) {
			return new Promise(function(resolve) {

				var variantID = req.params.variantID,
					variant = req.body;

				if (variantID === undefined) {
					resolve({status: 400, body: ERROR('MissingVariantID') });
				}
				else if (!is.string(variant.Value, 1, 100)) {
					resolve({status: 400, body: ERROR('StringOutOfRange', { field: 'Value', min: 1, max: 100 }) });
				}
				else if (!is.int(variantID, 1)) {
					resolve({status: 400, body: ERROR('InvalidVariantID') });
				}
				else if (variant.GroupDefault !== undefined && !is.bool(variant.GroupDefault)) {
					resolve({ status: 400, body: ERROR('InvalidBool', { field: 'GroupDefault' }) });
				}
				else if (variant.AdditionalPrice !== undefined && !is.int(variant.AdditionalPrice)) {
					resolve({status: 400, body: ERROR('InvalidInt', { field: 'AdditionalPrice' }) });
				}
				else {

					// TODO: check current user has permission to update variants for specified profileID
					service.variant.update(variantID, variant)
						.then(function(id) {
							resolve({ status: 200, body: { ID: id, Message: 'Success' } });
						})
						.catch(function (err) {
							processError(err, req, resolve, 'Error occurred while updating variant');
						})
				}
			});
		},


		// lists all variants associated with a product
		product: {

			list: function (req) {
				return new Promise(function(resolve) {

					var productID = req.params.productID;

					if (productID === undefined) {
						resolve({status: 400, body: ERROR('MissingProductID') });
					}
					else if (!is.int(productID, 1)) {
						resolve({status: 400, body: ERROR('InvalidProductID') });
					}
					else {
						service.variant.product.list(productID)
							.then(function(data) {

								data.forEach(function (item) {
									item.GroupDefault = !!item.GroupDefault;
								});

								resolve({ status: 200, body: data });
							})
							.catch(function (err) {
								processError(err, req, resolve, 'Error occurred while fetching product variants');
							})
					}

				});
			}

		},

		// lists all variants associated with a profile
		profile: {

			list: function (req) {
				return new Promise(function(resolve) {

					var profileID = req.params.profileID;

					if (profileID === undefined) {
						resolve({status: 400, body: ERROR('MissingProfileID') });
					}
					else if (!is.int(profileID, 1)) {
						resolve({status: 400, body: ERROR('InvalidProfileID') });
					}
					else {
						service.variant.profile.list(profileID)
							.then(function(data) {

								data.forEach(function (item) {
									item.GroupDefault = !!item.GroupDefault;
								});

								resolve({ status: 200, body: data });
							})
							.catch(function (err) {
								processError(err, req, resolve, 'Error occurred while fetching profile variants');
							})
					}

				});
			}

		},


		//
		// Product Variant Groups
		//

		groups: {

			get: function (req) {
				return new Promise(function(resolve) {

				});
			},

			add: function(req) {
				return new Promise(function(resolve) {

					var group = req.body;

					if (group.ProfileID === undefined) {
						resolve({status: 400, body: ERROR('MissingProfileID') });
					}
					else if (group.ProductTypeID === undefined) {
						resolve({status: 400, body: ERROR('MissingProductTypeID') });
					}
					else if (!is.string(group.Name, 1, 100)) {
						resolve({status: 400, body: ERROR('StringOutOfRange', { field: 'Name', min: 1, max: 100 }) });
					}
					else if (!is.int(group.ProfileID, 1)) {
						resolve({status: 400, body: ERROR('InvalidProfileID') });
					}
					else if (!is.int(group.ProductTypeID, 1)) {
						resolve({status: 400, body: ERROR('InvalidProductTypeID') });
					}
					else {

						// TODO: check current user has permission to add groups for specified profileID

						service.variant.groups.add(group)
							.then(function(id) {
								resolve({ status: 200, body: { ID: id, Message: 'Success' } });
							})
							.catch(function (err) {
								processError(err, req, resolve, 'Error occurred while adding variant group');
							})
					}

				});
			},

			remove: function (req) {
				return new Promise(function(resolve) {
					var groupID = req.params.groupID;

					if (groupID === undefined) {
						resolve({status: 400, body: ERROR('MissingGroupID') });
					}
					else if (!is.int(groupID, 1)) {
						resolve({status: 400, body: ERROR('InvalidGroupID') });
					}
					else {
						// TODO: check current user has permission to remove variant groups for specified profileID
						service.variant.groups.remove(groupID)
							.then(function(id) {
								resolve({ status: 200, body: { ID: id, Message: 'Success' } });
							})
							.catch(function (err) {
								processError(err, req, resolve, 'Error occurred while removing variant group');
							})
					}
				});
			},

			update: function (req) {
				return new Promise(function(resolve) {

					var data = req.body,
						groupID = req.params.groupID;

					if (groupID === undefined) {
						resolve({status: 400, body: ERROR('MissingGroupID') });
					}
					else if (!is.int(groupID, 1)) {
						resolve({status: 400, body: ERROR('InvalidGroupID') });
					}
					else if (!is.string(data.Name, 1, 100)) {
						resolve({status: 400, body: ERROR('StringOutOfRange', { field: 'Name', min: 1, max: 100 }) });
					}
					else {

						service.variant.groups.get(groupID)
							.then(function (group) {

								// TODO: check current user has permission to update group

								return service.variant.groups.update(groupID, data)
									.then(function () {
										resolve({ status: 200, body: { Message: 'Success' } });
									})

							})
							.catch(function (err) {
								processError(err, req, resolve, 'Error occurred while updating variant group');
							})

					}
				});
			},

			profile : {

				list: function (req) {
					return new Promise(function(resolve) {

						var profileID = req.params.profileID;

						if (profileID === undefined) {
							resolve({status: 400, body: ERROR('MissingProfileID') });
						}
						else if (!is.int(profileID, 1)) {
							resolve({status: 400, body: ERROR('InvalidProfileID') });
						}
						else {
							service.variant.groups.profile.list(profileID)
								.then(function(groups) {
									resolve({ status: 200, body: groups });
								})
								.catch(function (err) {
									processError(err, req, resolve, 'Error occurred while fetching variant groups');
								})
						}

					});
				}

			},

			type: {

				list: function (req) {
					return new Promise(function(resolve) {

						var typeID = req.params.typeID;

						if (typeID === undefined) {
							resolve({status: 400, body: ERROR('MissingTypeID') });
						}
						else if (!is.int(typeID, 1)) {
							resolve({status: 400, body: ERROR('InvalidTypeID') });
						}
						else {
							service.variant.groups.type.list(typeID)
								.then(function(groups) {
									resolve({ status: 200, body: groups });
								})
								.catch(function (err) {
									processError(err, req, resolve, 'Error occurred while fetching variant groups');
								})
						}

					});
				}

			}

		}

	}



};