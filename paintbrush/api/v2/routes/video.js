var router = require('express').Router(),
	contract = require('../data-contracts/video');


router

	.post('/add/:profileID?', function(req, res) {
		contract.create(req).then(function (resp) {
			res.status(resp.status).json(resp.body);
		})
	})

	.get('/:videoID', function (req, res) {
		contract.get(req).then(function(resp){
			res.status(resp.status).json(resp.body);
		})
	})

	.get('/:profileID/list', function (req, res) {
		contract.list(req).then(function(resp){
			res.status(resp.status).json(resp.body);
		})
	})

	.put('/:videoID/update', function (req, res) {
		contract.update(req).then(function(resp){
			res.status(resp.status).json(resp.body);
		})
	})

	.delete('/:videoID/remove', function (req, res) {
		contract.remove(req).then(function(resp){
			res.status(resp.status).json(resp.body);
		})
	});


module.exports = router;
