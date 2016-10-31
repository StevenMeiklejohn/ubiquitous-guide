var express = require('express'),
	AccessToken = require('../../auth/access-token');


module.exports = {

	//
	// Unauthenticated Calls
	//

	unauthenticated: express.Router()

		// checks if the specified code exists and is still valid
		.get('/check/:code', function (req, res) {

			db('AffiliateCodes').first().where({ Code: req.params.code })
				.then(function (code) {
					res.json(code);
				})
				.catch(function (err) {
					logError(err, req, function () {
						res.status(500).json({ Message: 'Error occurred while updating the artwork' });
					});
				})

		})

	,
	//
	// Authenticated Calls
	//
	
	authenticated: express.Router()

		// returns any affiliate code entered during registration for the current user
		.get('/registration-code', function (req, res) {

			AccessToken.getUser(req).then(function (user) {

				db.first('ac.ID', 'ac.Code')
					.from('Registrations as r')
					.join('AffiliateCodes as ac', 'r.AffiliateCodeID', 'ac.ID')
					.where({ 'r.ProfileID': user.ProfileID })
					.then(function (code) {
						res.json(code || {});
					})
					.catch(function (err) {
						logError(err, req, function () {
							res.status(500).json({ Message: 'Error occurred while updating the artwork' });
						});
					})


			})


		})

};

