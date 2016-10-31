var router = require('express').Router(),
	contract = require('../data-contracts/permissions');

router


	.get('/artwork/check/:artworkID/:action', function (req, res) {
		contract.artwork.check(req).then(function(resp) {
			res.status(resp.status).json(resp.body);
		})
	})

	.get('/profile/check/:profileID/:action', function (req, res) {
		contract.profile.check(req).then(function(resp) {
			res.status(resp.status).json(resp.body);
		})
	})

	.get('/clear-cache', function (req, res) {
		contract.clearCache(req).then(function(resp) {
			res.status(resp.status).json(resp.body);
		})
	});


module.exports = router;
