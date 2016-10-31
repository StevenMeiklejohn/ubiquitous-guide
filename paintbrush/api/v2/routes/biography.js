var router = require('express').Router(),
	contract = require('../data-contracts/biography');

router

	.get('/:profileID?', function (req, res) {
		contract.get(req).then(function(resp) {
			res.status(resp.status).json(resp.body);
		})
	})

	.put('/:profileID?/update', function (req, res) {
		contract.update(req).then(function(resp) {
			res.status(resp.status).json(resp.body);
		})
	});

module.exports = router;
