var Promise = require('bluebird');


var service = {


	types: function() {
		return new Promise(function (resolve, reject) {
			db('ProductTypes').select('ID', 'Type', 'MaxQuantity').orderBy('Type')
				.then(resolve)
				.catch(reject);
		})
	},


	//
	// Products
	//

	get: function (productID) {
		return new Promise(function(resolve, reject) {
			db('Products').first().where('ID', productID)
				.then(resolve)
				.catch(reject);
		});
	},

	add: function(product) {
		return new Promise(function(resolve, reject) {
			db('Products')
				.insert({
					ArtworkID: product.ArtworkID,
					ProfileID: product.ProfileID,
					ProductTypeID: product.ProductTypeID,
					Price: product.Price,
					Quantity: product.Quantity,
					WidthMM: product.WidthMM,
					HeightMM: product.HeightMM,
					UseProfileVariants: product.UseProfileVariants
				})
				.then(function (id) {
					resolve(id[0]);
				})
				.then(function () {
					if (product.ArtworkID) {
						return db('Artworks').where('ID', product.ArtworkID).update({ updated_at: new Date() })
					}
				})
				.catch(reject);
		});
	},

	update: function (productID, product) {
		return new Promise(function(resolve, reject) {
			service.get(productID)
				.then(function (data) {
					return db('Products').first().where('ID', productID)
						.update({
							Price: product.Price !== undefined ? product.Price : data.Price,
							Quantity: product.Quantity !== undefined ? product.Quantity : data.Quantity,
							WidthMM: product.WidthMM !== undefined ? product.WidthMM : data.WidthMM,
							HeightMM: product.HeightMM !== undefined ? product.HeightMM : data.HeightMM,
							UseProfileVariants: product.UseProfileVariants !== undefined ? product.UseProfileVariants : data.UseProfileVariants
						})
						.then(function () {
							return db('Artworks').where('ID', data.ArtworkID).update({ updated_at: new Date() })
						})
				})
				.then(resolve)
				.catch(reject);

		});
	},


	remove : function (productID) {
		return new Promise(function(resolve, reject) {
			db('Products').first().where('ID', productID).del()
				.then(resolve)
				.catch(reject);
		});
	},


	search: function(filters, pagination, sort) {
		return new Promise(function (resolve, reject) {

			filters = filters || {};
			sort = sort || {};

			// set pagination defaults if no or partial values specified
			pagination = pagination || {};
			pagination.PageNumber = pagination.PageNumber || 0;
			pagination.PageSize = pagination.PageSize || 10;
			pagination.PageSize = pagination.PageSize > 100 ? 100 : pagination.PageSize < 1 ? 1 : pagination.PageSize;


			// construct base sql query
			var sql =
					'from Products p ' +
					'join ProductTypes pt on p.ProductTypeID = pt.ID ',

				where =
					'where',

				sortSql = '';


			// only return results if a profile or artwork ID was specified
			if (filters.ProfileID) {
				where += ' p.ProfileID = ' + filters.ProfileID + ' AND p.ArtworkID IS NULL';
			}
			else if (filters.ArtworkID) {
				where += ' p.ArtworkID = ' + filters.ArtworkID;
			}
			else {
				where += ' p.ID < 0';
			}


			// append additional filters to query
			if (filters.ProductTypeID) {
				where += ' and p.ProductTypeID =' + filters.ProductTypeID;
			}
			//
			//if (filters.Activated !== undefined) {
			//	where += ' and vt.TrackingRating IS ' + (filters.Activated ? 'NOT ' : '') + 'NULL';
			//}
			//if (filters.ArtistName) {
			//	where += ' and p.Name like \'%' + filters.ArtistName + '%\'';
			//}


			// set query sort parameters
			var direction = (sort.Direction || '').toLowerCase() === 'asc' ? 'ASC': 'DESC';
			switch (sort.Field) {
				case 'Area':
					sortSql += ' (p.WidthMM * p.HeightMM) ' + direction;
					break;
				case 'Price':
					sortSql += ' p.Price ' + direction;
					break;
				case 'ProductType':
					sortSql += ' pt.Type ' + direction;
					break;
				case 'Quantity':
					sortSql += ' p.Quantity ' + direction;
					break;
				default:
					sortSql += ' p.updated_at ' + direction;
					break;
			}

			// execute query
			db.first(db.raw(
				'count(p.ID) as Results ' + sql + where
			))
			.then(function (total) {

				return db.select(db.raw(
					'p.*, ' +
					'pt.Type as ProductType ' +
					sql + where +
					' order by ' + sortSql + ', p.updated_at desc'
				))
				.offset(pagination.PageSize * pagination.PageNumber)
				.limit(pagination.PageSize)
				.then(function (data) {
					pagination.TotalResults = total.Results;

					resolve({
						Data: data,
						Pagination: pagination
					});
				});

			})
			.catch(reject);

		});
	},



	//
	// Product Variants
	//

	variant: {

		get: function (variantID) {
			return new Promise(function(resolve, reject) {
				db('ProductVariants').where('ID', variantID).first()
					.then(resolve)
					.catch(reject);
			});
		},

		add: function(variant) {
			return new Promise(function(resolve, reject) {
				db('ProductVariants')
					.insert({
						GroupID: variant.GroupID,
						ProfileID: variant.ProfileID,
						ProductID: variant.ProductID,
						AdditionalPrice: variant.AdditionalPrice,
						GroupDefault: variant.GroupDefault,
						Value: variant.Value
					})
					.then(function (id) {
						resolve(id[0]);
					})
					.catch(reject);
			});
		},

		remove: function(variantID) {
			return new Promise(function(resolve, reject) {
				db('ProductVariants').where('ID', variantID).del()
					.then(resolve)
					.catch(reject);
			});
		},

		update: function (variantID, variant) {
			return new Promise(function(resolve, reject) {
				service.variant.get(variantID)
					.then(function (data) {
						return db('ProductVariants').where('ID', variantID)
							.update({
								AdditionalPrice: variant.AdditionalPrice !== undefined ? variant.AdditionalPrice : data.AdditionalPrice,
								GroupDefault: variant.GroupDefault !== undefined ? variant.GroupDefault : data.GroupDefault,
								Value: variant.Value !== undefined ? variant.Value : data.Value
							});
					})
					.then(resolve)
					.catch(reject);
			});
		},


		// lists all variants associated with a product
		product: {

			list: function (productID) {
				return new Promise(function (resolve, reject) {
					db.select()
						.from('ProductVariants as pv')
						.where({ 'pv.ProductID': productID })
						.orderByRaw('pv.GroupDefault desc, pv.AdditionalPrice asc')
						.then(resolve)
						.catch(reject);
				})
			}

		},

		// lists all variants associated with a profile
		profile: {

			list: function (profileID) {
				return new Promise(function (resolve, reject) {
					db.select()
						.from('ProductVariants as pv')
						.where({ 'pv.ProfileID': profileID })
						.orderByRaw('pv.GroupDefault desc, pv.AdditionalPrice asc')
						.then(resolve)
						.catch(reject);
				})
			}

		},


		//
		// Product Variant Groups
		//

		groups: {

			get: function (groupID) {
				return new Promise(function(resolve, reject) {
					db('ProductVariantGroups').first()
						.where('ID', groupID)
						.then(resolve)
						.catch(reject);
				});
			},

			add: function(group) {
				return new Promise(function(resolve, reject) {
					db('ProductVariantGroups').insert(group)
						.then(function (id) {
							resolve(id[0]);
						})
						.catch(reject);
				});
			},

			remove: function (groupID) {
				return new Promise(function(resolve, reject) {
					db('ProductVariants').where('GroupID', groupID).del()
						.then(function() {
							return db('ProductVariantGroups').where('ID', groupID).del()
						})
						.then(resolve)
						.catch(reject);
				});
			},

			update: function (groupID, data) {
				return new Promise(function(resolve, reject) {
					db('ProductVariantGroups')
						.update({ Name: data.Name })
						.where('ID', groupID)
						.then(resolve)
						.catch(reject);
				});
			},

			profile: {

				//
				// Lists all variant groups available to the specified profile
				//
				list: function (profileID) {
					return new Promise(function (resolve, reject) {
						db('ProductVariantGroups')
							.select('ID', 'Name', 'ProfileID', 'ProductTypeID')
							.whereRaw('ProfileID IS NULL OR ProfileID = ' + profileID)
							.orderBy('Name')
							.then(resolve)
							.catch(reject);
					})
				}
			},

			type: {
				list: function (typeID) {
					return new Promise(function (resolve, reject) {
						db('ProductVariantGroups')
							.select('ID', 'Name')
							.whereRaw('ProductTypeID = ' + typeID)
							.orderBy('Name')
							.then(resolve)
							.catch(reject);
					})
				}
			}

		}

	}


};


module.exports = service;