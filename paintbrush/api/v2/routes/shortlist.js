var router = require('express').Router(),
	contract = require('../data-contracts/shortlist');

module.exports = router

	.post('/create/:profileID?', function (req, res) {
		contract.create(req).then(function (resp) {
			res.status(resp.status).json(resp.body);
		})
	})

	.get('/list/types', function (req, res) {
		contract.list.types(req).then(function (resp) {
			res.status(resp.status).json(resp.body);
		})
	})

	.get('/:profileID/list/active', function (req, res) {
		contract.list.active(req).then(function (resp) {
			res.status(resp.status).json(resp.body);
		})
	})

	.get('/:profileID/list/archived', function (req, res) {
		contract.list.archived(req).then(function (resp) {
			res.status(resp.status).json(resp.body);
		})
	})

	.get('/:shortlistID?', function (req, res) {
		contract.get(req).then(function (resp) {
			res.status(resp.status).json(resp.body);
		})
	})

	.post('/:shortlistID?/add', function (req, res) {
		contract.item.add(req).then(function (resp) {
			res.status(resp.status).json(resp.body);
		})
	})

	.put('/:shortlistID/archive', function (req, res) {
		contract.archive(req).then(function (resp) {
			res.status(resp.status).json(resp.body);
		})
	})

	.put('/:shortlistID/update', function (req, res) {
		contract.update(req).then(function (resp) {
			res.status(resp.status).json(resp.body);
		})
	})

	.delete('/:shortlistID?', function (req, res) {
		contract.remove(req).then(function (resp) {
			res.status(resp.status).json(resp.body);
		})
	})

	.delete('/:shortlistID/item/:itemID', function (req, res) {
		contract.item.remove(req).then(function (resp) {
			res.status(resp.status).json(resp.body);
		})
	});
