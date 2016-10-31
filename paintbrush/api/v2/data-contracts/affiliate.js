var Promise = require('bluebird'),
	AccessToken = require('../../auth/access-token'),
	Permission = require('../lib/permission'),
	service = require('../services/affiliate'),
	is = require('../lib/validate').is;


module.exports = {

	// checks if the specified code exists and is still valid
	checkCode: function(req) {
		return new Promise(function (resolve) {
			var code = req.params.code;

			if (!code) {
				resolve({ status: 400, body: { Message: 'Please supply an affiliate code to check' }});
			}
			else if (typeof code !== 'string') {
				resolve({ status: 400, body: { Message: 'Affiliate code must be a string' }});
			}
			else {
				service.checkCode(code)
					.then(function(_code) {
						if (_code) {
							resolve({ status: 200, body: _code });
						}
						else {
							resolve({ status: 404, body: { Message: 'Code \'' + code + '\' was not found' } });
						}
					})
					.catch(function (err) {
						processError(err, req, resolve, 'Error occurred while checking code');
					})
			}

		})
	},

	// returns the affiliate code entered during registration for the current user
	registrationCode: function(req) {
		return new Promise(function (resolve) {
			var profileID = req.params.profileID;

			if (profileID && is.int(profileID * 1, 1)) {
				resolve({ status: 400, body: { Message: 'ProfileID must be an integer greater than 0' }});
			}
			else {
				AccessToken.getUser(req).then(function (user) {
					profileID = profileID || user.ProfileID;

					Permission.Profile.check('registration.all', user.UserID, profileID).then(function(allowed) {
						if (!allowed) {
							resolve({ status: 403, body: { Message: 'You do not have permission view registration data associated with this profile (ID: ' + profileID + ')'} });
						}
						else {
							service.registrationCode(profileID)
								.then(function (code) {
									resolve({ status: 200, body: code });
								})
								.catch(function (err) {
									processError(err, req, resolve, 'Error occurred while retrieving registration affiliate code');
								})
						}
					});

				})
			}

		})

	}

};


