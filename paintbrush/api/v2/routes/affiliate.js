var express = require('express'),
	contract = require('../data-contracts/affiliate');


module.exports = {

	//
	// Unauthenticated Calls
	//

	unauthenticated: express.Router()

		// checks if the specified code exists and is still valid
		.get('/check/:code?', function (req, res) {
			contract.checkCode(req).then(function (resp) {
				res.status(resp.status).json(resp.body);
			})
		})

	,
	//
	// Authenticated Calls
	//
	
	authenticated: express.Router()

		// returns any affiliate code entered during registration for the specified profile
		.get('/registration-code/:profileID?', function (req, res) {
			contract.registrationCode(req).then(function (resp) {
				res.status(resp.status).json(resp.body);
			})
		})

};

