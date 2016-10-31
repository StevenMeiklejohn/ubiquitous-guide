var Promise = require('bluebird'),
	AccessToken = require('../../auth/access-token'),
	Permission = require('../lib/permission'),
	url = require('url'),
	service = require('../services/artwork'),
	is = require('../lib/validate').is,
	ERROR = require('../error-codes');


module.exports = {

	list: {

		//
		// Returns a list of dimension units
		//
		dimensionUnits: function (req) {
			return new Promise(function (resolve) {
				service.list.dimensionUnits()
					.then(function (units) {
						resolve({status: 200, body: units});
					})
					.catch(function (err) {
						processError(err, req, resolve, 'Error occurred while fetching dimension units');
					})

			})
		},

		//
		// Returns a list of price bands
		//
		priceBands: function (req) {
			return new Promise(function (resolve) {
				service.list.priceBands()
					.then(function (bands) {
						resolve({status: 200, body: bands});
					})
					.catch(function (err) {
						processError(err, req, resolve, 'Error occurred while fetching price bands');
					})
			})
		},

		//
		// Returns a list of artwork statuses
		//
		statuses: function () {
			return new Promise(function (resolve) {
				service.list.statuses()
					.then(function (statuses) {
						resolve({status: 200, body: statuses});
					})
					.catch(function (err) {
						processError(err, req, resolve, 'Error occurred while fetching list of artwork statuses');
					})
			})
		},

		//
		// Returns a list of artwork styles
		//
		styles: function (req) {
			return new Promise(function (resolve) {
				var profileID = req.params.profileID;

				if (profileID !== undefined && !is.int(profileID, 1)) {
					resolve({ status: 400, body: ERROR('InvalidProfileID') });
				}
				else {
					AccessToken.getUser(req).then(function (user) {
						var run = function (p) {
							service.list.styles(p)
								.then(function (styles) {
									resolve({ status: 200, body: styles });
								})
								.catch(function (err) {
									processError(err, req, resolve, 'Error occurred while fetching list of artwork styles');
								})
						};

						if (user && user.GalleryID && user.ProfileID == profileID) {
							Permission.Profile.list('artwork.update', user.UserID).then(run);
						}
						else {
							run(profileID)
						}
					})
				}
			})
		},

		//
		// Returns a list of artwork subject
		//
		subjects: function (req) {
			return new Promise(function (resolve) {
				var profileID = req.params.profileID;

				if (profileID !== undefined && !is.int(profileID, 1)) {
					resolve({ status: 400, body: ERROR('InvalidProfileID')});
				}
				else {
					AccessToken.getUser(req).then(function (user) {
						var run = function (p) {
							service.list.subjects(p)
								.then(function (subjects) {
									resolve({ status: 200, body: subjects });
								})
								.catch(function (err) {
									processError(err, req, resolve, 'Error occurred while fetching list of artwork subjects');
								})
						};

						if (user && user.GalleryID && user.ProfileID == profileID) {
							Permission.Profile.list('artwork.update', user.UserID).then(run);
						}
						else {
							run(profileID)
						}
					})
				}
			})
		},

		//
		// Returns a list of time spent on artwork options
		//
		timeSpent: function () {
			return new Promise(function (resolve) {
				service.list.timeSpent()
					.then(function (timeSpent) {
						resolve({status: 200, body: timeSpent});
					})
					.catch(function (err) {
						processError(err, req, resolve, 'Error occurred while fetching list of time spent on artwork options');
					})
			})
		},

		//
		// Returns a list of artwork types
		//
		types: function (req) {
			return new Promise(function (resolve) {

				var profileID = req.params.profileID;

				if (profileID !== undefined && !is.int(profileID, 1)) {
					resolve({ status: 400, body: ERROR('InvalidProfileID') });
				}
				else {
					AccessToken.getUser(req).then(function (user) {
						var run = function (p) {
							service.list.types(p)
								.then(function (types) {
									resolve({ status: 200, body: types });
								})
								.catch(function (err) {
									processError(err, req, resolve, 'Error occurred while fetching list of artwork types');
								})
						};

						if (user && user.GalleryID && user.ProfileID == profileID) {
							Permission.Profile.list('artwork.update', user.UserID).then(run);
						}
						else {
							run(profileID)
						}
					})
				}
			})
		}

	},


	//
	// Adds a new artwork record to the database
	//
	add: function(req) {
		return new Promise(function (resolve) {

			var artwork = req.body,
				profileID = artwork.ProfileID,
				typeID = artwork.ArtworkTypeID,
				imageURI = artwork.ImageURI;

			//
			// check required fields
			//
			if (!typeID) {
				resolve({ status: 400, body: ERROR('MissingArtworkTypeID') });
			}
			else if (!imageURI) {
				resolve({ status: 400, body: ERROR('MissingValue', { field: 'ImageURI' }) });
			}
			else if (!artwork.Name) {
				resolve({ status: 400, body: ERROR('MissingValue', { field: 'Name' }) });
			}

			//
			// check data types
			//
			else if (!is.int(typeID, 1)) {
				resolve({ status: 400, body: ERROR('InvalidArtworkTypeID') });
			}
			else if (profileID !== undefined && !is.int(profileID, 1)) {
				resolve({ status: 400, body: ERROR('InvalidProfileID') });
			}

			//
			// call service
			//
			else {

				// check for relative image url - prefix with current host
				var urlData = url.parse(imageURI);
				if (!urlData.hostname && !urlData.protocol) {
					artwork.ImageURI = 'http://' + req.headers.host + '/' + imageURI;
				}

				AccessToken.getUser(req).then(function (user) {
					profileID = profileID || user.ProfileID;

					Permission.Profile.check('artwork.add', user.UserID, profileID).then(function(allowed) {
						if (!allowed) {
							resolve({ status: 403, body: { Message: 'You do not have permission to add artwork to this profile (ID: ' + profileID + ')'} });
						}
						else {
							service.add(artwork, profileID)
								.then(function(body) {
									resolve({ status: 201, body: body } );
								})
								.catch(function (err) {
									processError(err, req, resolve, 'Error occurred while adding artwork record to database');
								})
						}
					});


				})
			}

		})
	},


	//
	// Adds a new artwork record to the database
	//
	bulkAdd: function(req) {
		return new Promise(function (resolve) {

			var artworks = req.body.Artworks;

			//
			// Check artworks is an array of objects
			//
			if (!artworks || !Array.isArray(artworks) || artworks.some(function (artwork) { return typeof artwork !== 'object' })) {
				resolve({ status: 400, body: { Message: 'An array of artwork objects is required' } });
			}
			else {
				var errorMessage, index = 1;

				//
				// Check required fields and data types within array of artworks
				//
				artworks.some(function (artwork) {
					var imageURI = artwork.ImageURI;

					if (!artwork.ArtworkTypeID) {
						resolve({ status: 400, body: { Message: 'Please specify an ArtworkTypeID for artwork #' + index } });
					}
					else if (!imageURI) {
						resolve({ status: 400, body: { Message: 'Please specify an ImageURI for artwork #' + index} });
					}
					else if (!artwork.Name) {
						resolve({ status: 400, body: { Message: 'Please specify a Name  for artwork #' + index} });
					}

					//
					// check data types
					//
					else if (!is.int(artwork.ArtworkTypeID, 1)) {
						resolve({ status: 400, body: { Message: 'ArtworkTypeID must be an integer greater than 0 (artwork #' + index + ')'} });
					}
					else if (artwork.Price !== undefined && !is.int(artwork.Price, 0)) {
						resolve({ status: 400, body: { Message: 'Price must be an integer of value 0 or greater (artwork #' + index + ')'} });
					}
					else if (artwork.VideoID && !is.int(artwork.VideoID, 0)) {
						resolve({ status: 400, body: { Message: 'VideoID must be an integer greater than -1 (artwork #' + index + ')'} });
					}
					else {
						// prefix image uri with current host if a relative url was specified
						var urlData = url.parse(imageURI);
						if (!urlData.hostname && !urlData.protocol) {
							artwork.ImageURI = 'http://' + req.headers.host + '/' + imageURI;
						}
					}

					index++;
					return errorMessage;	// stop processing on error
				});

				if (errorMessage) {
					resolve({ status: 400, body: { Message: errorMessage } });
				}

				//
				// call service
				//
				else {

					AccessToken.getUser(req).then(function (user) {
						var profileID = req.body.ProfileID || user.ProfileID;

						Permission.Profile.check('artwork.add', user.UserID, profileID).then(function(allowed) {
							if (!allowed) {
								resolve({ status: 403, body: { Message: 'You do not have permission to add artwork to this profile (ID: ' + profileID + ')'} });
							}
							else {
								service.bulkAdd(artworks, profileID)
									.then(function() {
										resolve({ status: 200, body: { Message: 'Success' }} );
									})
									.catch(function (err) {
										processError(err, req, resolve, 'Error occurred while adding artwork record(s) to database');
									})
							}
						});


					})

				}
			}

		})
	},


	//
	// Returns a single artwork record
	//
	get: function(req) {
		return new Promise(function (resolve) {

			var artworkID = req.params.artworkID;

			if (!artworkID) {
				resolve({ status: 400, body: ERROR('MissingArtworkID') });
			}
			else if (!is.int(artworkID, 1)) {
				resolve({ status: 400, body: ERROR('InvalidArtworkID') });
			}
			else {
				AccessToken.getUser(req).then(function (user) {

					service.get(artworkID, (user || {}).ProfileID || -1)
						.then(function(artwork) {

							artwork.Liked = !!artwork.Liked;
							artwork.Complete = !!artwork.Complete;
							artwork.Featured = !!artwork.Featured;
							artwork.SyncRequired = !!artwork.SyncRequired;
							artwork.LimitedEdition = !!artwork.LimitedEdition;
							artwork.Shareable = !!artwork.Shareable;
							artwork.Purchasable = !!artwork.Purchasable;

							resolve({ status: 200, body: artwork });
						})
						.catch(function (err) {
							processError(err, req, resolve, 'Error occurred while fetching artwork record');
						})
				})
			}

		})
	},


	//
	// Likes an artwork
	//
	like: function(req) {
		return new Promise(function(resolve) {

			var artworkID = req.params.artworkID,
				profileID = req.params.profileID;

			if (!artworkID) {
				resolve({ status: 400, body: { Message: 'Please specify an artworkID' } });
			}
			else if (!is.int(artworkID, 1)) {
				resolve({ status: 400, body: { Message: 'ArtworkID must be an integer greater than 0' } });
			}
			else if (profileID !== undefined && !is.int(profileID, 1)) {
				resolve({ status: 400, body: { Message: 'ProfileID must be an integer greater than 0' } });
			}
			else {
				AccessToken.getUser(req).then(function (user) {
					profileID = profileID || user.ProfileID;

					Permission.Profile.check('all', user.UserID, profileID).then(function(allowed) {
						if (!allowed) {
							resolve({ status: 403, body: { Message: 'You do not have permission to like this artwork (ID: ' + artworkID + ')'} });
						}
						else {
							service.like(artworkID, profileID)
								.then(function() {
									resolve({ status: 200, body: { Message: 'Success' }} );
								})
								.catch(function (err) {
									processError(err, req, resolve, 'Error occurred while liking artwork');
								})
						}
					});

				})
			}

		})
	},


	//
	// Removes an artwork
	//
	remove: function(req) {
		return new Promise(function(resolve) {

			var artworkID = req.params.artworkID;

			if (!artworkID) {
				resolve({ status: 400, body: { Message: 'Please specify an artworkID' } });
			}
			else if (!is.int(artworkID, 1)) {
				resolve({ status: 400, body: { Message: 'ArtworkID must be an integer greater than 0' } });
			}
			else {
				AccessToken.getUser(req).then(function (user) {

					Permission.Artwork('remove', user.UserID, artworkID).then(function(allowed) {
						if (!allowed) {
							resolve({ status: 403, body: { Message: 'You do not have permission to remove this artwork (ID: ' + artworkID + ')'} });
						}
						else {
							service.remove(artworkID)
								.then(function() {
									resolve({ status: 204, body: { Message: 'Success' }} );
								})
								.catch(function (err) {
									processError(err, req, resolve, 'Error occurred while removing artwork');
								})
						}
					});

				})
			}
		})
	},


	//
	// Searches artwork
	//
	search: function(req) {
		return new Promise(function (resolve) {

			var filters = req.body.Filters || {},
				pagination = req.body.Pagination || {},
				sort = req.body.Sort || {};

			//
			// check data types
			//
			if (filters.ArtistProfileID !== undefined && !is.int(filters.ArtistProfileID, 1)) {
				resolve({ status: 400, body: { Message: 'ArtistProfileID must be an integer greater than 0'} });
			}
			else if (filters.OwnerProfileID !== undefined && !is.int(filters.OwnerProfileID, 1)) {
				resolve({ status: 400, body: { Message: 'OwnerProfileID must be an integer greater than 0'} });
			}
			else if (filters.ConnectedProfileID !== undefined && !is.int(filters.ConnectedProfileID, 1)) {
				resolve({ status: 400, body: { Message: 'ConnectedProfileID must be an integer greater than 0'} });
			}
			else if (filters.GalleryProfileID !== undefined && !is.int(filters.GalleryProfileID, 1)) {
				resolve({ status: 400, body: { Message: 'GalleryProfileID must be an integer greater than 0'} });
			}
			else if (filters.ArtistName !== undefined && typeof filters.ArtistName !== 'string') {
				resolve({ status: 400, body: { Message: 'ArtistName must be a string'} });
			}
			else if (filters.MyArtists !== undefined && !is.bool(filters.MyArtists)) {
				resolve({ status: 400, body: { Message: 'MyArtists must be a boolean'} });
			}
			else if (filters.Name !== undefined && typeof filters.Name !== 'string') {
				resolve({ status: 400, body: { Message: 'Name must be a string'} });
			}
			else if (filters.Subject !== undefined && typeof filters.Subject !== 'string') {
				resolve({ status: 400, body: { Message: 'Subject must be a string'} });
			}
			else if (filters.Type !== undefined && (!Array.isArray(filters.Type) || filters.Type.some(function (typeID) { return !is.int(typeID, 1) }))) {
				resolve({ status: 400, body: { Message: 'Type must be an array integers with each value greater than 0'} });
			}
			else if (filters.Style !== undefined && (!Array.isArray(filters.Style) || filters.Style.some(function (styleID) { return !is.int(styleID, 1) }))) {
				resolve({ status: 400, body: { Message: 'Style must be an array integers with each value greater than 0'} });
			}
			else if (filters.Price !== undefined && (!Array.isArray(filters.Price) || filters.Price.some(function (bandID) { return !is.int(bandID, 1) }))) {
				resolve({ status: 400, body: { Message: 'Price must be an array integers with each value greater than 0'} });
			}
			else if (filters.Colour !== undefined && (!Array.isArray(filters.Colour) ||
					filters.Colour.some(function (colour) {
						return typeof colour !== 'object' || !is.int(colour.R, 0, 255) || !is.int(colour.G, 0, 255) || !is.int(colour.B, 0, 255)
					})
				)
			) {
				resolve({ status: 400, body: { Message: 'Colour must be an array objects representing the RGB values of the colour e.g. {R:0, G:50, B:255}'} });
			}
			else if (pagination.PageNumber !== undefined && !is.int(pagination.PageNumber, 0)) {
				resolve({ status: 400, body: { Message: 'PageNumber must be an integer greater than or equal to 0'} });
			}
			else if (pagination.PageSize !== undefined && !is.int(pagination.PageSize, 1)) {
				resolve({ status: 400, body: { Message: 'PageSize must be an integer greater than 0'} });
			}
			else if (sort.Field !== undefined && typeof sort.Field !== 'string') {
				resolve({ status: 400, body: { Message: 'Sort field must be a string'} });
			}
			else if (sort.Direction !== undefined && (typeof sort.Direction !== 'string' || ['asc', 'desc'].indexOf(sort.Direction) < 0)) {
				resolve({ status: 400, body: { Message: 'Sort direction must be a string with a value of \'asc\' or \'desc\'' } });
			}

			//
			// Otherwise perform search query
			//
			else {
				AccessToken.getUser(req).then(function (user) {

					var run = function() {
						service.search(user.ProfileID, filters, pagination, sort)
							.then(function(results) {

								// fix returned data types for bool properties
								results.Data.forEach(function(aw){
									aw.Activated = !!aw.Activated;
									aw.Complete = !!aw.Complete;
									aw.Featured = !! aw.Featured;
									aw.Deleted = !!aw.Deleted;
									aw.LimitedEdition = !!aw.LimitedEdition;
									aw.ActivCanvasEnabled = !!aw.ActivCanvasEnabled;
									aw.Shareable = !!aw.Shareable;
									aw.Purchasable = !!aw.Purchasable;
									aw.NoVideo = !!aw.NoVideo;
									aw.SyncRequired = !!aw.SyncRequired;
								});

								resolve({ status: 200, body: results });
							})
							.catch(function (err) {
								processError(err, req, resolve, 'Error occurred while performing search query');
							})
					};

					if (filters.MyArtists) {
						if (user.memberOf('Administrators')) {
							run();
						}
						else {
							Permission.Profile.list('artwork.update', user.UserID).then(function(profiles) {
								filters.ArtistProfiles = profiles;
								run();
							})
						}
					}
					else if (filters.GalleryProfileID) {
						Permission.Profile.listProfile('artwork.update', filters.GalleryProfileID).then(function(profiles) {
							filters.ArtistProfiles = profiles;
							run();
						})
					}
					else {
						run();
					}

				})
			}

		});
	},


	//
	// Un-likes an artwork
	//
	unlike: function(req) {
		return new Promise(function(resolve) {

			var artworkID = req.params.artworkID,
				profileID = req.params.profileID;

			if (!artworkID) {
				resolve({ status: 400, body: { Message: 'Please specify an artworkID' } });
			}
			else if (!is.int(artworkID, 1)) {
				resolve({ status: 400, body: { Message: 'ArtworkID must be an integer greater than 0' } });
			}
			else if (profileID !== undefined && !is.int(profileID, 1)) {
				resolve({ status: 400, body: { Message: 'ProfileID must be an integer greater than 0' } });
			}
			else {
				AccessToken.getUser(req).then(function (user) {
					profileID = profileID || user.ProfileID;

					Permission.Profile.check('all', user.UserID, profileID).then(function(allowed) {
						if (!allowed) {
							resolve({ status: 403, body: { Message: 'You do not have permission to un-like this artwork (ID: ' + artworkID + ')'} });
						}
						else {
							service.unlike(artworkID, profileID)
								.then(function() {
									resolve({ status: 200, body: { Message: 'Success' }} );
								})
								.catch(function (err) {
									processError(err, req, resolve, 'Error occurred while un-liking artwork');
								})
						}
					});

				})
			}

		})
	},


	//
	// Updates an artwork record
	//
	//update: function(req) {
	//	return new Promise(function (resolve) {
	//
	//		var artwork = req.body,
	//			artworkID = req.params.artworkID;
	//
	//		//
	//		// check data types
	//		//
	//		if (!is.int(artworkID, 1)) {
	//			resolve({ status: 400, body: { Message: 'ArtworkID must be an integer greater than 0'} });
	//		}
	//		else if (artwork.ArtworkTypeID !== undefined && !is.int(artwork.ArtworkTypeID, 1)) {
	//			resolve({ status: 400, body: { Message: 'ArtworkTypeID must be an integer greater than 0'} });
	//		}
	//		else if (artwork.PricebandID !== undefined && !is.int(artwork.PricebandID, 1)) {
	//			resolve({ status: 400, body: { Message: 'PricebandID must be an integer greater than 0'} });
	//		}
	//		else if (artwork.StatusID !== undefined && !is.int(artwork.StatusID, 1)) {
	//			resolve({ status: 400, body: { Message: 'StatusID must be an integer greater than 0'} });
	//		}
	//		else if (artwork.TimeSpentID !== undefined && !is.int(artwork.TimeSpentID, 1)) {
	//			resolve({ status: 400, body: { Message: 'TimeSpentID must be an integer greater than 0'} });
	//		}
	//		else if (artwork.DimensionUnitID !== undefined && !is.int(artwork.DimensionUnitID, 1)) {
	//			resolve({ status: 400, body: { Message: 'DimensionUnitID must be an integer greater than 0'} });
	//		}
	//		else if (artwork.WidthMM !== undefined && !is.int(artwork.WidthMM, 1)) {
	//			resolve({ status: 400, body: { Message: 'WidthMM must be an integer greater than 0'} });
	//		}
	//		else if (artwork.HeightMM !== undefined && !is.int(artwork.HeightMM, 1)) {
	//			resolve({ status: 400, body: { Message: 'HeightMM must be an integer greater than 0'} });
	//		}
	//		else if (artwork.DepthMM !== undefined && !is.int(artwork.DepthMM, 0)) {
	//			resolve({ status: 400, body: { Message: 'DepthMM must be an integer greater than or equal to 0'} });
	//		}
	//
	//		//
	//		// call service
	//		//
	//		else {
	//
	//			// check for relative image url - prefix with current host
	//			if (artwork.ImageURI) {
	//				var urlData = url.parse(artwork.ImageURI);
	//				if (!urlData.hostname && !urlData.protocol) {
	//					artwork.ImageURI = 'http://' + req.headers.host + '/' + artwork.ImageURI;
	//				}
	//			}
	//
	//			AccessToken.getUser(req).then(function (user) {
	//
	//				Permission.Artwork('update', user.UserID, artworkID).then(function(allowed) {
	//					if (!allowed) {
	//						resolve({ status: 403, body: { Message: 'You do not have permission to update this artwork (ID: ' + artworkID + ')'} });
	//					}
	//					else {
	//						service.update(artworkID, artwork)
	//							.then(function(body) {
	//								resolve({ status: 200, body: body } );
	//							})
	//							.catch(function (err) {
	//								processError(err, req, resolve, 'Error occurred while updating artwork record');
	//							})
	//					}
	//				});
	//
	//			})
	//		}
	//
	//	})
	//},


	update: {

		activCanvas: function(req) {
			return new Promise(function (resolve) {

				var artwork = req.body,
					artworkID = req.params.artworkID;

				//
				// check data types
				//
				if (!is.int(artworkID, 1)) {
					resolve({ status: 400, body: ERROR('InvalidArtworkID') });
				}
				else if (artwork.VideoID !== undefined && !is.int(artwork.VideoID, 0)) {
					resolve({ status: 400, body: ERROR('InvalidVideoID', { min: -1 }) });
				}

				//
				// call service
				//
				else {

					AccessToken.getUser(req).then(function (user) {

						Permission.Artwork('update', user.UserID, artworkID).then(function(allowed) {
							if (!allowed) {
								resolve({ status: 403, body: { Message: 'You do not have permission to update this artwork (ID: ' + artworkID + ')'} });
							}
							else {
								service.update.activCanvas(artworkID, artwork)
									.then(function(body) {
										resolve({ status: 200, body: body } );
									})
									.catch(function (err) {
										processError(err, req, resolve, 'Error occurred while updating artwork record');
									})
							}
						});

					})
				}

			})
		},


		general: function(req) {
			return new Promise(function (resolve) {

				var artwork = req.body,
					artworkID = req.params.artworkID;

				//
				// check data types
				//
				if (!is.int(artworkID, 1)) {
					resolve({ status: 400, body: ERROR('InvalidArtworkID') });
				}
				else if (artwork.ArtworkTypeID !== undefined && !is.int(artwork.ArtworkTypeID, 1)) {
					resolve({ status: 400, body: ERROR('InvalidArtworkTypeID') });
				}

				//
				// call service
				//
				else {

					// check for relative image url - prefix with current host
					if (artwork.ImageURI) {
						var urlData = url.parse(artwork.ImageURI);
						if (!urlData.hostname && !urlData.protocol) {
							artwork.ImageURI = 'http://' + req.headers.host + '/' + artwork.ImageURI;
						}
					}

					AccessToken.getUser(req).then(function (user) {

						Permission.Artwork('update', user.UserID, artworkID).then(function(allowed) {
							if (!allowed) {
								resolve({ status: 403, body: { Message: 'You do not have permission to update this artwork (ID: ' + artworkID + ')'} });
							}
							else {
								service.update.general(artworkID, artwork)
									.then(function(body) {
										resolve({ status: 200, body: body } );
									})
									.catch(function (err) {
										processError(err, req, resolve, 'Error occurred while updating artwork record');
									})
							}
						});

					})
				}

			})
		}


	},


	//
	// Returns the enquire to/dirty buy html page
	//
	buy: function(req) {
		return new Promise(function (resolve) {

			var artworkID = req.params.artworkID,
				accessToken = req.params.t;

			if (!artworkID) {
				resolve({ status: 400, body: { Message: 'Please specify an artworkID' } });
			}
			else if (!is.int(artworkID, 1)) {
				resolve({ status: 400, body: { Message: 'ArtworkID must be an integer greater than 0' } });
			}
			else {

				service.buy(artworkID, accessToken)
					.then(function(html) {
						resolve({ status: 200, body: html });
					})
					.catch(function (err) {
						processError(err, req, resolve, 'Error occurred while fetching page');
					})
			}

		});
	},



	//
	// Returns the view artwork html page - used for share functionality within AC app
	//
	view: function(req) {
		return new Promise(function (resolve) {

			var artworkID = req.params.artworkID;

			if (!artworkID) {
				resolve({ status: 400, body: { Message: 'Please specify an artworkID' } });
			}
			else if (!is.int(artworkID, 1)) {
				resolve({ status: 400, body: { Message: 'ArtworkID must be an integer greater than 0' } });
			}
			else {

				service.view(artworkID, req.get('host'), req.originalUrl)
					.then(function(html) {
						resolve({ status: 200, body: html });
					})
					.catch(function (err) {
						processError(err, req, resolve, 'Error occurred while fetching page');
					})
			}

		});
	}


};