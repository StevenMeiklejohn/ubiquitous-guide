var Promise = require('bluebird'),
	AccessToken = require('../../auth/access-token'),
	Permission = require('../lib/permission'),
	Analytics = require('../lib/analytics'),
	is = require('../lib/validate').is,
	service = require('../services/profile'),
	ERROR = require('../error-codes');

//
// Generic wrapper for get requests
//
var get = function (req, type) {
	return new Promise(function (resolve) {
		var profileID = req.params.profileID;

		if (!profileID) {
			resolve({status: 400, body: ERROR('MissingProfileID') });
		}
		else if (!is.int(profileID, 1)) {
			resolve({status: 400, body: ERROR('InvalidProfileID') });
		}
		else {
			AccessToken.getUser(req).then(function (user) {

				service.get[type](profileID)
					.then(function (data) {
						if (data) {
							resolve({status: 200, body: data});
						}
						else {
							resolve({status: 404, body: {Message: 'Profile not found'}});
						}
					})
					.catch(function (err) {
						processError(err, req, resolve, 'Error occurred while fetching profile from database');
					});
			});
		}
	})
},


//
// Generic code for updates (after data has been parsed)
//
update = function (req, profileID, data, type) {
	return new Promise(function (resolve) {

		if (!profileID) {
			resolve({status: 400, body: ERROR('MissingProfileID') });
		}
		else if (!is.int(profileID, 1)) {
			resolve({status: 400, body: ERROR('InvalidProfileID') });
		}
		else {
			AccessToken.getUser(req).then(function (user) {

				Permission.Profile.check('profile.update.' + type, user.UserID, profileID).then(function (allowed) {
					if (!allowed) {
						resolve({ status: 403, body: { Message: 'You do not have permission to update this profile' } });
					}
					else {
						service.update[type](profileID, data)
							.then(function () {
								resolve({ status: 200, body: { Message: 'Success' } });
							})
							.catch(function (err) {
								processError(err, req, resolve, 'Error occurred while updating database');
							});
					}
				})
			})
		}
	})
};



module.exports = {

	get: {

		all: function (req) {
			return new Promise(function (resolve) {
				var profileID = req.params.profileID * 1;

				if (!req.params.profileID) {
					resolve({status: 400, body: ERROR('MissingProfileID') });
				}
				else if (!is.int(profileID, 1)) {
					resolve({status: 400, body: ERROR('InvalidProfileID') });
				}
				else {
					AccessToken.getUser(req).then(function (user) {

						service.get.all(profileID)
							.then(function (data) {
								if (data) {
									if (data.Name.indexOf('@actemp') > -1) {
										data.Name = 'Guest Account (' + data.ID + ')';
										data.GuestAccount = true;
									}
									resolve({status: 200, body: data});
								}
								else {
									resolve({status: 404, body: { Message: 'Profile not found' }});
								}
							})
							.then(function () {
								Permission.Profile.list('all', user.UserID).then(function(profiles) {
									if (!(user.memberOf('Administrators') || user.ProfileID === profileID || profiles.indexOf(profileID) > -1)) {
										Analytics.event.add(req, 18, { ProfileID: profileID });
									}
								})
							})
							.catch(function (err) {
								processError(err, req, resolve, 'Error occurred while fetching profile from database');
							})

					});
				}
			})
		},


		base: function (req) {
			return get(req, 'base');
		},


		artist: function (req) {
			return get(req, 'artist');
		},


		activCanvas: function (req) {
			return get(req, 'activCanvas');
		},


		contact: function (req) {
			return get(req, 'contact');
		},


		consumer: function (req) {
			return get(req, 'consumer');
		},


		gallery: function (req) {
			return get(req, 'gallery');
		},


		socialMedia: function (req) {
			return get(req, 'socialMedia');
		}

	},

	update: {

		activCanvas: function (req) {
			return update(req, req.params.profileID, req.body, 'activcanvas');
		},

		artist: function (req) {
			return update(req, req.params.profileID, req.body, 'artist');
		},

		awards: function (req) {
			return update(req, req.params.profileID, req.body, 'awards');
		},

		base: function (req) {
			return update(req, req.params.profileID, req.body, 'base');
		},

		contact: function (req) {
			return update(req, req.params.profileID, req.body, 'contact');
		},

		socialMedia: function (req) {
			return update(req, req.params.profileID, req.body, 'social');
		}

	}
};
