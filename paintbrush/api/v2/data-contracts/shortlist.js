var AccessToken = require('../../auth/access-token'),
	Analytics = require('../lib/analytics'),
	Promise = require('bluebird'),
	Permission = require('../lib/permission'),
	is = require('../lib/validate').is,
	service = require('../services/shortlist');



module.exports = {

	//
	// Marks a shortlist as archived
	//
	archive: function (req) {
		return new Promise(function(resolve) {
			var shortlistID = req.params.shortlistID;

			if (!shortlistID) {
				resolve({ status: 400, body: { Message: 'Please specify a shortlist ID' } });
			}
			else if (shortlistID !== undefined && !is.int(shortlistID, 1)) {
				resolve({ status: 400, body: { Message: 'ShortlistID must be an integer greater than 0' } });
			}
			else {
				AccessToken.getUser(req).then(function (user) {

					service.owner(shortlistID)
						.then(function (owner) {
							if (!owner) {
								resolve({ status: 404, body: { Message: 'Shortlist not found' } });
							}
							else {
								return Permission.Profile.check('shortlist.update', user.UserID, owner.ProfileID).then(function(allowed) {
									if (!allowed) {
										resolve({ status: 403, body: { Message: 'You do not have permission to update shortlists belonging to this profile' }});
									}
									else {
										return service.archive(shortlistID).then(function() {
											resolve({ status: 200, body: { Message: 'Success' }} );
											Analytics.event.add(req, 17, { ShortlistID: shortlistID });
										})
									}
								});
							}
						})
						.catch(function (err) {
							processError(err, req, resolve, 'Error occurred while archiving shortlist');
						});

				})
			}
		})
	},


	//
	// Creates a new shortlist for the specified profile
	//
	create: function (req) {
		return new Promise(function(resolve) {

			var profileID = req.params.profileID,
				shortlist = req.body;

			if (!shortlist.Name) {
				resolve({ status: 400, body: { Message: 'Please specify a shortlist name' } });
			}
			else if (!shortlist.TypeID) {
				resolve({ status: 400, body: { Message: 'Please specify a shortlist type' } });
			}
			else if (profileID !== undefined && !is.int(profileID, 1)) {
				resolve({ status: 400, body: { Message: 'ProfileID must be an integer greater than 0' } });
			}
			else if (!is.string(shortlist.Name, 1, 255)) {
				resolve({ status: 400, body: { Message: 'Name must be a string containing between 1 and 255 characters' } });
			}
			else if (shortlist.Description !== undefined && !is.string(shortlist.Description, 1, 4000)) {
				resolve({ status: 400, body: { Message: 'Description must be a string containing between 1 and 4000 characters' } });
			}
			else if (shortlist.Target !== undefined && !is.int(shortlist.Target, 1)) {
				resolve({ status: 400, body: { Message: 'Target must be an integer greater than 0' } });
			}
			else {
				AccessToken.getUser(req).then(function (user) {
					profileID = profileID || user.ProfileID;

					Permission.Profile.check('shortlist.create', user.UserID, profileID).then(function(allowed) {
						if (!allowed) {
							resolve({ status: 403, body: { Message: 'You do not have permission to create shortlists for this profile'} });
						}
						else {
							service.create(profileID, shortlist)
								.then(function(id) {
									resolve({ status: 201, body: { ID: id, Message: 'Success' }} );
									Analytics.event.add(req, 11, { ShortlistID: id });
								})
								.catch(function (err) {
									processError(err, req, resolve, 'Error occurred while creating shortlist');
								})
						}
					});

				})
			}

		})
	},


	//
	// Returns the specified shortlist
	//
	get: function (req) {
		return new Promise(function(resolve) {

			var shortlistID = req.params.shortlistID;

			if (!shortlistID) {
				resolve({ status: 400, body: { Message: 'Please specify a shortlist ID' } });
			}
			else if (shortlistID !== undefined && !is.int(shortlistID, 1)) {
				resolve({ status: 400, body: { Message: 'ShortlistID must be an integer greater than 0' } });
			}
			else {
				AccessToken.getUser(req).then(function (user) {

					service.owner(shortlistID)
						.then(function (owner) {
							if (!owner) {
								resolve({ status: 404, body: { Message: 'Shortlist not found' } });
							}
							else {
								return Permission.Profile.check('shortlist.view', user.UserID, owner.ProfileID).then(function(allowed) {
									if (!allowed) {
										resolve({ status: 403, body: { Message: 'You do not have permission to view shortlists belonging to this profile'} });
									}
									else {
										return service.get(shortlistID).then(function(data) {
											resolve({ status: 200, body: data} );
											Analytics.event.add(req, 13, { ShortlistID: shortlistID });
										})
									}
								});
							}
						})
						.catch(function (err) {
							processError(err, req, resolve, 'Error occurred while retrieving shortlist');
						});

				})
			}

		})
	},


	list: {

		//
		// Lists all active shortlists for the specified profile
		//
		active: function (req) {
			return new Promise(function(resolve) {
				var profileID = req.params.profileID;

				if (!profileID) {
					resolve({ status: 400, body: { Message: 'Please specify a profile id' } });
				}
				else if (!is.int(profileID, 1)) {
					resolve({ status: 400, body: { Message: 'ProfileID must be an integer greater than 0' } });
				}
				else {
					AccessToken.getUser(req).then(function (user) {

						Permission.Profile.check('shortlist.view', user.UserID, profileID).then(function(allowed) {
							if (!allowed) {
								resolve({ status: 403, body: { Message: 'You do not have permission to view shortlists belonging to this profile'} });
							}
							else {
								service.list.active(profileID)
									.then(function(data) {
										resolve({ status: 200, body: data} );
										Analytics.event.add(req, 14, { ProfileID: profileID });
									})
									.catch(function (err) {
										processError(err, req, resolve, 'Error occurred while fetching shortlists');
									})
							}
						});

					})
				}
			})
		},

		//
		// Lists all archived shortlists for the specified profile
		//
		archived: function (req) {
			return new Promise(function(resolve) {
				var profileID = req.params.profileID;

				if (!profileID) {
					resolve({ status: 400, body: { Message: 'Please specify a profile id' } });
				}
				else if (!is.int(profileID, 1)) {
					resolve({ status: 400, body: { Message: 'ProfileID must be an integer greater than 0' } });
				}
				else {
					AccessToken.getUser(req).then(function (user) {

						Permission.Profile.check('shortlist.view', user.UserID, profileID).then(function(allowed) {
							if (!allowed) {
								resolve({ status: 403, body: { Message: 'You do not have permission to view shortlists belonging to this profile'} });
							}
							else {
								service.list.archived(profileID)
									.then(function(data) {
										resolve({ status: 200, body: data} );
										Analytics.event.add(req, 14, { ProfileID: profileID });
									})
									.catch(function (err) {
										processError(err, req, resolve, 'Error occurred while fetching shortlists');
									})
							}
						});

					})
				}
			})
		},

		//
		// Returns a list of shortlist types
		//
		types: function (req) {
			return new Promise(function(resolve) {
				service.list.types()
					.then(function (data) {
						resolve({ status: 200, body: data} );
					})
					.catch(function (err) {
						processError(err, req, resolve, 'Error occurred while fetching shortlist types');
					})
			})
		}

	},


	//
	// Shortlist item methods
	//
	item: {

		//
		// Adds new items to a shortlist
		//
		add: function (req) {
			return new Promise(function(resolve) {
				var shortlistID = req.params.shortlistID,
					items = req.body;

				if (!shortlistID) {
					resolve({ status: 400, body: { Message: 'Please specify a shortlist ID' } });
				}
				else if (shortlistID !== undefined && !is.int(shortlistID, 1)) {
					resolve({ status: 400, body: { Message: 'ShortlistID must be an integer greater than 0' } });
				}
				else if (!Array.isArray(items) || !items.length || items.some(function (item) { return !is.int(item, 1) })) {
					resolve({ status: 400, body: { Message: 'Post body must contain an array of integers (each greater than 0)' } });
				}
				else {
					AccessToken.getUser(req).then(function (user) {

						service.owner(shortlistID)
							.then(function (owner) {
								if (!owner) {
									resolve({ status: 404, body: { Message: 'Shortlist not found' } });
								}
								else {
									return Permission.Profile.check('shortlist.item.add', user.UserID, owner.ProfileID).then(function(allowed) {
										if (!allowed) {
											resolve({ status: 403, body: { Message: 'You do not have permission to add items to this shortlist' }});
										}
										else {
											return service.item.add(shortlistID, items).then(function(result) {
												resolve({ status: 200, body: result });

												(result.ArtworksAdded || []).forEach(function (artworkID) {
													Analytics.event.add(req, 15, { ShortlistID: shortlistID, ArtworkID: artworkID });
												});
											})
											.then(function () {

											})
										}
									});
								}
							})
							.catch(function (err) {
								processError(err, req, resolve, 'Error occurred while deleting shortlist');
							});

					})
				}
			})
		},


		//
		// Removes an item from a shortlist
		//
		remove: function (req) {
			return new Promise(function(resolve) {

				var shortlistID = req.params.shortlistID,
					itemID = req.params.itemID;

				if (!shortlistID) {
					resolve({ status: 400, body: { Message: 'Please specify a shortlist ID' } });
				}
				else if (!itemID) {
					resolve({ status: 400, body: { Message: 'Please specify an item ID' } });
				}
				else if (shortlistID !== undefined && !is.int(shortlistID, 1)) {
					resolve({ status: 400, body: { Message: 'ShortlistID must be an integer greater than 0' } });
				}
				else if (itemID !== undefined && !is.int(itemID, 1)) {
					resolve({ status: 400, body: { Message: 'ItemID must be an integer greater than 0' } });
				}
				else {
					AccessToken.getUser(req).then(function (user) {

						service.owner(shortlistID)
							.then(function (owner) {
								if (!owner) {
									resolve({ status: 404, body: { Message: 'Shortlist not found' } });
								}
								else {
									return Permission.Profile.check('shortlist.item.remove', user.UserID, owner.ProfileID).then(function(allowed) {
										if (!allowed) {
											resolve({ status: 403, body: { Message: 'You do not have permission to remove this shortlist item' }});
										}
										else {
											return service.item.remove(shortlistID, itemID).then(function() {
												resolve({ status: 204, body: { Message: 'Success' }} );

												switch (owner.TypeID) {
													case 1: Analytics.event.add(req, 16, { ShortlistID: shortlistID, ArtistID: itemID }); break;
													case 2: Analytics.event.add(req, 16, { ShortlistID: shortlistID, ArtworkID: itemID }); break;
												}
											})
										}
									});
								}
							})
							.catch(function (err) {
								processError(err, req, resolve, 'Error occurred while deleting shortlist');
							});

					})
				}

				//
			})
		}

	},


	//
	// Marks a shortlist as deleted
	//
	remove: function (req) {
		return new Promise(function(resolve) {
			var shortlistID = req.params.shortlistID;

			if (!shortlistID) {
				resolve({ status: 400, body: { Message: 'Please specify a shortlist ID' } });
			}
			else if (shortlistID !== undefined && !is.int(shortlistID, 1)) {
				resolve({ status: 400, body: { Message: 'ShortlistID must be an integer greater than 0' } });
			}
			else {
				AccessToken.getUser(req).then(function (user) {

					service.owner(shortlistID)
						.then(function (owner) {
							if (!owner) {
								resolve({ status: 404, body: { Message: 'Shortlist not found' } });
							}
							else {
								return Permission.Profile.check('shortlist.remove', user.UserID, owner.ProfileID).then(function(allowed) {
									if (!allowed) {
										resolve({ status: 403, body: { Message: 'You do not have permission to delete shortlists belonging to this profile' }});
									}
									else {
										return service.remove(shortlistID).then(function() {
											resolve({ status: 204, body: { Message: 'Success' }} );
											Analytics.event.add(req, 12, {ShortlistID: shortlistID});
										})
									}
								});
							}
						})
						.catch(function (err) {
							processError(err, req, resolve, 'Error occurred while deleting shortlist');
						});

				})
			}
		})
	},


	//
	// Updates a shortlist
	//
	update: function (req) {
		return new Promise(function(resolve) {
			var shortlistID = req.params.shortlistID,
				shortlist = req.body;

			if (!shortlistID) {
				resolve({ status: 400, body: { Message: 'Please specify a shortlist ID' } });
			}
			else if (shortlistID !== undefined && !is.int(shortlistID, 1)) {
				resolve({ status: 400, body: { Message: 'ShortlistID must be an integer greater than 0' } });
			}
			else if (!is.string(shortlist.Name, 1, 255)) {
				resolve({ status: 400, body: { Message: 'Name must be a string containing between 1 and 255 characters' } });
			}
			else if (shortlist.Description !== undefined && !is.string(shortlist.Description, 1, 4000)) {
				resolve({ status: 400, body: { Message: 'Description must be a string containing between 1 and 4000 characters' } });
			}
			else if (shortlist.Target !== undefined && !is.int(shortlist.Target, 1)) {
				resolve({ status: 400, body: { Message: 'Target must be an integer greater than 0' } });
			}
			else {
				AccessToken.getUser(req).then(function (user) {

					service.owner(shortlistID)
						.then(function (owner) {
							if (!owner) {
								resolve({ status: 404, body: { Message: 'Shortlist not found' } });
							}
							else {
								return Permission.Profile.check('shortlist.update', user.UserID, owner.ProfileID).then(function(allowed) {
									if (!allowed) {
										resolve({ status: 403, body: { Message: 'You do not have permission to update shortlists belonging to this profile' }});
									}
									else {
										return service.update(shortlistID, shortlist).then(function() {
											resolve({ status: 200, body: { Message: 'Success' }} );
										})
									}
								});
							}
						})
						.catch(function (err) {
							processError(err, req, resolve, 'Error occurred while updating shortlist');
						});

				})
			}
		})
	}



};