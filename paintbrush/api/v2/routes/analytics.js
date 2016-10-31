var router = require('express').Router(),
	contract = require('../data-contracts/analytics');


router

	.get('/event/list', function (req, res) {
		contract.event.list(req).then(function (resp) {
			res.status(resp.status).json(resp.body);
		})
	})

	.post('/event', function (req, res) {
		contract.event.add(req).then(function (resp) {
			res.status(resp.status).json(resp.body);
		})
	})

	.get('/:profileID?/users/activity/summary', function (req, res) {
		contract.users.activity.summary(req).then(function (resp) {
			res.status(resp.status).json(resp.body);
		})
	})

	.post('/:profileID?/users/activity/search', function (req, res) {
		contract.users.activity.search(req).then(function (resp) {
			res.status(resp.status).json(resp.body);
		})
	})

	.get('/:profileID?/users/activity/:userProfileID?', function (req, res) {
		contract.users.activity.details(req).then(function (resp) {
			res.status(resp.status).json(resp.body);
		})
	});


module.exports = router;
