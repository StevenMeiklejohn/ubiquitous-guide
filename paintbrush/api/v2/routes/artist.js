var express = require('express'),
	contract = require('../data-contracts/artist');

module.exports = {

	unauthenticated: express.Router()

			.get('/age-brackets', function (req, res) {
				contract.list.ageBrackets().then(function(resp) {
					res.status(resp.status).json(resp.body);
				})
			})

			.get('/types', function (req, res) {
				contract.list.types().then(function(resp) {
					res.status(resp.status).json(resp.body);
				})
			})

			.get('/workspaces', function (req, res) {
				contract.list.workSpaces().then(function(resp) {
					res.status(resp.status).json(resp.body);
				})
			}),

	authenticated: express.Router()

			.post('/search', function (req, res) {
				contract.search(req).then(function(resp) {
					res.status(resp.status).json(resp.body);
				})
			})

};
