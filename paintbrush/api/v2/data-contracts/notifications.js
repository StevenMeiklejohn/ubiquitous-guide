var	Promise = require('bluebird'),
	AccessToken = require('../../auth/access-token'),
	Permission = require('../lib/permission'),
	service = require('../services/notifications'),
	is = require('../lib/validate').is;


module.exports = {
	
	count: {

		//
		// Returns the current unread notifications count for a specific profile
		//
		unread: function (req) {
			return new Promise(function(resolve) {
				var profileID = req.params.profileID;

				if (!profileID) {
					resolve({ status: 400, body: { Message: 'Please specify a profile ID' } });
				}
				else if (!is.int(profileID, 1)) {
					resolve({ status: 400, body: { Message: 'Profile ID must be an integer greater than 0' } });
				}
				else {
					AccessToken.getUser(req).then(function (user) {

						Permission.Profile.check('notification.view', user.UserID, profileID).then(function(allowed) {
							if (!allowed) {
								resolve({ status: 403, body: { Message: 'You do not have permission to view notifications belonging to this profile (ID: ' + profileID + ')'} });
							}
							else {
								service.count.unread(profileID)
									.then(function(count) {
										resolve({ status: 200, body: { Count: count } });
									})
									.catch(function (err) {
										processError(err, req, resolve, 'Error occurred while fetching unread notifications count');
									})
							}
						})
					})
				}
			})
		}

	},

	//
	// Returns a single notification
	//
	get: function (req) {
		return new Promise(function(resolve) {
			var notificationID = req.params.notificationID;

			if (!notificationID) {
				resolve({ status: 400, body: { Message: 'Please specify a notification ID' } });
			}
			else if (!is.int(notificationID, 1)) {
				resolve({ status: 400, body: { Message: 'Notification ID must be an integer greater than 0' } });
			}
			else {
				AccessToken.getUser(req).then(function (user) {

					service.owner(notificationID).then(function(owner) {
						if (!owner) {
							resolve({ status: 404, body: { Message: 'Notification not found' }});
						}
						else {
							Permission.Profile.check('notification.view', user.UserID, owner.ProfileID).then(function (allowed) {
								if (!allowed) {
									resolve({ status: 403, body: { Message: 'You do not have permission to view this notification' }});
								}
								else {
									return service.get(notificationID).then(function (data) {
										resolve({ status: 200, body: data });
									})
								}
							})
						}
					})
					.catch(function (err) {
						processError(err, req, resolve, 'Error occurred while fetching notification');
					})

				})

			}

		})
	},


	list: {

		//
		// Returns a list of notification priorities
		//
		priorities: function (req) {
			return new Promise(function(resolve) {
				service.list.priorities()
					.then(function(data) {
						resolve({ status: 200, body: data });
					})
					.catch(function (err) {
						processError(err, req, resolve, 'Error occurred while fetching notifications priorities list');
					})
			})
		},

		//
		// Returns a list of notification types
		//
		types: function (req) {
			return new Promise(function(resolve) {
				service.list.types()
					.then(function(data) {
						resolve({ status: 200, body: data });
					})
					.catch(function (err) {
						processError(err, req, resolve, 'Error occurred while fetching notifications types list');
					})
			})
		},

		//
		// Returns the list of recipient profileID's a specific profile has permission to view
		//
		recipients: function (req) {
			return new Promise(function(resolve) {
				var profileID = req.params.profileID;

				if (!profileID) {
					resolve({ status: 400, body: { Message: 'Please specify a profile ID' } });
				}
				else if (!is.int(profileID, 1)) {
					resolve({ status: 400, body: { Message: 'Profile ID must be an integer greater than 0' } });
				}
				else {
					AccessToken.getUser(req).then(function (user) {

						Permission.Profile.check('notification.view', user.UserID, profileID).then(function(allowed) {
							if (!allowed) {
								resolve({ status: 403, body: { Message: 'You do not have permission to view this data'} });
							}
							else {
								service.list.recipients(profileID)
									.then(function(recipients) {
										resolve({ status: 200, body: recipients });
									})
									.catch(function (err) {
										processError(err, req, resolve, 'Error occurred while fetching recipients list');
									})
							}
						})
					})
				}
			})
		}

	},


	//
	// Marks a notification as read
	//
	markAsRead: function (req) {
		return new Promise(function(resolve) {
			var notificationID = req.params.notificationID;

			if (!notificationID) {
				resolve({ status: 400, body: { Message: 'Please specify a notification ID' } });
			}
			else if (!is.int(notificationID, 1)) {
				resolve({ status: 400, body: { Message: 'Notification ID must be an integer greater than 0' } });
			}
			else {
				AccessToken.getUser(req).then(function (user) {

					service.owner(notificationID).then(function(owner) {
						if (!owner) {
							resolve({ status: 404, body: { Message: 'Notification not found' }});
						}
						else {
							Permission.Profile.check('notification.view', user.UserID, owner.ProfileID).then(function(allowed) {
								if (!allowed) {
									resolve({ status: 403, body: { Message: 'You do not have permission to view notifications belonging to this profile' }});
								}
								else {
									return service.markAsRead(notificationID).then(function() {
										resolve({ status: 200, body: { Message: 'Success' } });
									})
								}
							})
						}
					})
					.catch(function (err) {
						processError(err, req, resolve, 'Error occurred while fetching notification');
					})

				})

			}
		})
	},


	//
	// Removes a notification
	//
	remove: function (req) {
		return new Promise(function(resolve) {
			var notificationID = req.params.notificationID;

			if (!notificationID) {
				resolve({ status: 400, body: { Message: 'Please specify a notification ID' } });
			}
			else if (!is.int(notificationID, 1)) {
				resolve({ status: 400, body: { Message: 'Notification ID must be an integer greater than 0' } });
			}
			else {
				AccessToken.getUser(req).then(function (user) {

					service.owner(notificationID).then(function(owner) {
						if (!owner) {
							resolve({ status: 404, body: { Message: 'Notification not found' }});
						}
						else {
							Permission.Profile.check('notification.remove', user.UserID, owner.ProfileID).then(function (allowed) {
								if (!allowed) {
									resolve({ status: 403, body: { Message: 'You do not have permission to remove this notification' }});
								}
								else {
									return service.remove(notificationID).then(function () {
										resolve({ status: 204, body: { Message: 'Success' } });
									})
								}
							})
						}
					})
					.catch(function (err) {
						processError(err, req, resolve, 'Error occurred while removing notification');
					})

				})

			}
		})
	},


	//
	// Searches notifications visible to the specified profile
	//
	search: function (req) {
		return new Promise(function(resolve) {

			var profileID = req.params.profileID,
				filters = req.body.Filters || {},
				pagination = req.body.Pagination || {},
				sort = req.body.Sort || {};

			//
			// check data types
			//
			if (!profileID) {
				resolve({ status: 400, body: { Message: 'Please specify a profile ID' } });
			}
			else if (!is.int(profileID, 1)) {
				resolve({ status: 400, body: { Message: 'Profile ID must be an integer greater than 0' } });
			}
			else if (filters.Read !== undefined && !is.bool(filters.Read)) {
				resolve({ status: 400, body: { Message: 'Read must be a boolean value'} });
			}
			else if (filters.Body !== undefined && !is.string(filters.Body)) {
				resolve({ status: 400, body: { Message: 'Body must be a string'} });
			}
			else if (filters.Search !== undefined && !is.string(filters.Search)) {
				resolve({ status: 400, body: { Message: 'Search must be a string'} });
			}
			else if (filters.Subject !== undefined && !is.string(filters.Subject)) {
				resolve({ status: 400, body: { Message: 'Subject must be a string'} });
			}
			else if (filters.TypeID !== undefined && !is.int(filters.TypeID, 1)) {
				resolve({ status: 400, body: { Message: 'TypeID must be an integer greater than 0'} });
			}
			else if (filters.RecipientID !== undefined && !is.int(filters.RecipientID, 1)) {
				resolve({ status: 400, body: { Message: 'RecipientID must be an integer greater than 0'} });
			}
			else if (pagination.PageNumber !== undefined && !is.int(pagination.PageNumber, 0)) {
				resolve({ status: 400, body: { Message: 'PageNumber must be an integer greater than or equal to 0'} });
			}
			else if (pagination.PageSize !== undefined && !is.int(pagination.PageSize, 1, 100)) {
				resolve({ status: 400, body: { Message: 'PageSize must be an integer within the range 1-100'} });
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

					var returnResults = function (p) {
						service.search(p, filters, pagination, sort)
							.then(function(results) {
								resolve({ status: 200, body: results });
							})
							.catch(function (err) {
								processError(err, req, resolve, 'Error occurred while fetching notifications');
							})
					};

					if (user.GalleryID && (profileID * 1) === user.ProfileID) {
						Permission.Profile.list('notification.view', user.UserID).then(function(profiles){
							profiles.push(user.ProfileID);
							returnResults(profiles);
						})
					}
					else {
						Permission.Profile.check('notification.view', user.UserID, profileID).then(function(allowed) {
							allowed ? returnResults(profileID) : resolve({ status: 403, body: { Message: 'You do not have permission to view notifications belonging to this profile'} });
						});
					}
				})

			}

		})
	}


};