var Promise = require('bluebird'),
	AccessToken = require('../../auth/access-token');



module.exports = {

	// checks if the specified code exists and is still valid
	checkCode: function(code) {
		return new Promise(function (resolve, reject) {
			db('AffiliateCodes').first().where({ Code: code })
				.then(resolve)
				.catch(reject);
		})

	},



	// returns the affiliate code entered during registration for the current user
	registrationCode: function(profileID) {
		return new Promise(function (resolve, reject) {
			db.first('ac.ID', 'ac.Code')
				.from('Registrations as r')
				.join('AffiliateCodes as ac', 'r.AffiliateCodeID', 'ac.ID')
				.where({ 'r.ProfileID': profileID })
				.then(function (code) {
					resolve(code || {});
				})
				.catch(reject);
		})

	}

};


