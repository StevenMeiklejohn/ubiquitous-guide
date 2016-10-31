var service = require('../services/biography'),
	Promise = require('bluebird'),
	AccessToken = require('../../auth/access-token'),
	Permission = require('../lib/permission'),
	is = require('../lib/validate').is;


module.exports = {

	get: function (req) {
		return new Promise(function (resolve) {

			var profileID = req.params.profileID;

			if (!profileID) {
				resolve({ status: 400, body: { Message: 'Please specify a profile ID' } });
			}
			else if (!is.int(profileID, 1)) {
				resolve({ status: 400, body: { Message: 'Profile ID must be an integer greater than 0' } });
			}
			else {
				service.get(profileID)
					.then(function(biography) {
						if (!biography) {
							resolve({ status: 404, body: { Message: 'Biography not found' } });
						}
						else {
							resolve({ status: 200, body: biography });
						}
					})
					.catch(function (err) {
						processError(err, req, resolve, 'Error occurred while retrieving biography');
					})
			}
		})
	},

	update: function (req) {
		return new Promise(function (resolve) {

			var profileID = req.params.profileID,
				description = req.body.Description;

			if (!profileID) {
				resolve({ status: 400, body: { Message: 'Please specify a profile ID' } });
			}
			else if (!description) {
				resolve({ status: 400, body: { Message: 'Please specify a description' } });
			}
			else if (!is.int(profileID, 1)) {
				resolve({ status: 400, body: { Message: 'Profile ID must be an integer greater than 0' } });
			}
			else {

				AccessToken.getUser(req).then(function (user) {

					Permission.Profile.check('biography.update', user.UserID, profileID).then(function(allowed) {
						if (!allowed) {
							resolve({ status: 403, body: { Message: 'You do not have permission to update this profiles biography'} });
						}
						else {
							service.update(profileID, description)
								.then(function(isNew) {
									resolve({ status: (isNew ? 201 : 200), body: { Message: 'Success' } });
								})
								.catch(function (err) {
									processError(err, req, resolve, 'Error occurred while updating biography');
								})
						}
					});

				})

			}
		})
	}

};