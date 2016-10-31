var express = require('express'),
	contract = require('../data-contracts/products');

module.exports = express.Router()

		.get('/types', function (req, res) {
			contract.types().then(function(resp) {
				res.status(resp.status).json(resp.body);
			});
		})


		//
		// Product Routes
		//

		.get('/:productID', function (req, res) {
			contract.get(req).then(function(resp) {
				res.status(resp.status).json(resp.body);
			});
		})
		.post('/add', function (req, res) {
			contract.add(req).then(function(resp) {
				res.status(resp.status).json(resp.body);
			});
		})
		.delete('/:productID', function (req, res) {
			contract.remove(req).then(function(resp) {
				res.status(resp.status).json(resp.body);
			});
		})
		.put('/:productID', function (req, res) {
			contract.update(req).then(function(resp) {
				res.status(resp.status).json(resp.body);
			});
		})
		.post('/search', function (req, res) {
			contract.search(req).then(function(resp) {
				res.status(resp.status).json(resp.body);
			});
		})


		//
		// Product Variant Routes
		//

		.get('/variant/:variantID', function (req, res) {
			contract.variant.get(req).then(function(resp) {
				res.status(resp.status).json(resp.body);
			});
		})
		.post('/variant/add', function (req, res) {
			contract.variant.add(req).then(function(resp) {
				res.status(resp.status).json(resp.body);
			});
		})
		.delete('/variant/:variantID', function (req, res) {
			contract.variant.remove(req).then(function(resp) {
				res.status(resp.status).json(resp.body);
			});
		})
		.put('/variant/:variantID', function (req, res) {
			contract.variant.update(req).then(function(resp) {
				res.status(resp.status).json(resp.body);
			});
		})


		.get('/variant/profile/:profileID', function (req, res) {
			contract.variant.profile.list(req).then(function(resp) {
				res.status(resp.status).json(resp.body);
			});
		})
		.get('/variant/product/:productID', function (req, res) {
			contract.variant.product.list(req).then(function(resp) {
				res.status(resp.status).json(resp.body);
			});
		})


		//
		// Product Variant Group Routes
		//

		.get('/variant/groups/:groupID', function (req, res) {
			contract.variant.groups.get(req).then(function(resp) {
				res.status(resp.status).json(resp.body);
			});
		})
		.post('/variant/groups/add', function (req, res) {
			contract.variant.groups.add(req).then(function(resp) {
				res.status(resp.status).json(resp.body);
			});
		})
		.delete('/variant/groups/:groupID', function (req, res) {
			contract.variant.groups.remove(req).then(function(resp) {
				res.status(resp.status).json(resp.body);
			});
		})
		.put('/variant/groups/:groupID', function (req, res) {
			contract.variant.groups.update(req).then(function(resp) {
				res.status(resp.status).json(resp.body);
			});
		})
		.get('/variant/groups/profile/:profileID', function (req, res) {
			contract.variant.groups.profile.list(req).then(function(resp) {
				res.status(resp.status).json(resp.body);
			});
		})
		//.get('/variant/groups/type/:typeID/list', function (req, res) {
		//	contract.variant.groups.type.list(req).then(function(resp) {
		//		res.status(resp.status).json(resp.body);
		//	})
		//})




;