var Promise = require('bluebird'),
	AccessToken = require('../../auth/access-token'),
	Permission = require('../lib/permission'),
	is = require('../lib/validate').is,
	ERROR = require('../error-codes');


module.exports = {

	artwork: {

		check: function(req) {
			return new Promise(function(resolve) {

				var action = req.params.action,
					artworkID = req.params.artworkID;

				if (!action) {
					resolve({ status: 400, body: ERROR('MissingValue', { field: 'action' })});
				}
				if (!artworkID) {
					resolve({ status: 400, body: ERROR('MissingArtworkID') });
				}
				else if (!is.int(artworkID, 1)) {
					resolve({ status: 400, body: ERROR('InvalidArtworkID') });
				}
				else {
					AccessToken.getUser(req).then(function (user) {

						Permission.Artwork(action, user.UserID, artworkID)
							.then(function(allowed) {
								resolve({ status: 200, body: { allowed: allowed } } );
							})
							.catch(function (err) {
								processError(err, req, resolve, 'Error occurred while checking artwork permissions');
							})

					})
				}



			})
		}

	},


	profile: {

		check: function(req) {
			return new Promise(function(resolve) {

				var action = req.params.action,
					profileID = req.params.profileID;

				if (!action) {
					resolve({ status: 400, body: ERROR('MissingValue', { field: 'action' })});
				}
				if (!profileID) {
					resolve({ status: 400, body: ERROR('MissingProfileID') });
				}
				else if (!is.int(profileID, 1)) {
					resolve({ status: 400, body: ERROR('InvalidProfileID') });
				}
				else {
					AccessToken.getUser(req).then(function (user) {

						Permission.Profile.check(action, user.UserID, profileID)
							.then(function(allowed) {
								resolve({ status: 200, body: { allowed: allowed } } );
							})
							.catch(function (err) {
								processError(err, req, resolve, 'Error occurred while checking profile permissions');
							})

					})
				}

			})
		}

	},


	clearCache: function(req) {
		return new Promise(function(resolve) {

			AccessToken.getUser(req).then(function (user) {

				if (!user.memberOf('Administrators')) {
					resolve({ status: 403, body: { Message: 'You do not have permission to perform this action.'} });
				}
				else {
					Permission.clearCache();
					resolve({ status: 200, body: { Message: 'Success'} });
				}

			})

		})
	}


};