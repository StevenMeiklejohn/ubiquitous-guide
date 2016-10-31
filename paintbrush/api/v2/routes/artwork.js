var express = require('express'),
	contract = require('../data-contracts/artwork');

module.exports = {

	unauthenticated: express.Router()

		.get('/dimension-units', function (req, res) {
			contract.list.dimensionUnits(req).then(function (resp) {
				res.status(resp.status).json(resp.body);
			});
		})

		.get('/pricebands', function (req, res) {
			contract.list.priceBands(req).then(function (resp) {
				res.status(resp.status).json(resp.body);
			});
		})

		.get('/statuses', function (req, res) {
			contract.list.statuses(req).then(function (resp) {
				res.status(resp.status).json(resp.body);
			});
		})

		.get('/styles', function (req, res) {
			contract.list.styles(req).then(function (resp) {
				res.status(resp.status).json(resp.body);
			});
		})

		.get('/styles/:profileID', function (req, res) {
			contract.list.styles(req).then(function (resp) {
				res.status(resp.status).json(resp.body);
			});
		})

		.get('/subjects', function (req, res) {
			contract.list.subjects(req).then(function (resp) {
				res.status(resp.status).json(resp.body);
			});
		})

		.get('/subjects/:profileID', function (req, res) {
			contract.list.subjects(req).then(function (resp) {
				res.status(resp.status).json(resp.body);
			});
		})

		.get('/time-spent', function (req, res) {
			contract.list.timeSpent(req).then(function (resp) {
				res.status(resp.status).json(resp.body);
			});
		})

		.get('/types', function (req, res) {
			contract.list.types(req).then(function (resp) {
				res.status(resp.status).json(resp.body);
			});
		})

		.get('/types/:profileID', function (req, res) {
			contract.list.types(req).then(function (resp) {
				res.status(resp.status).json(resp.body);
			});
		})

		.get('/:artworkID', function (req, res, next) {
			contract.get(req).then(function (resp) {
				res.status(resp.status).json(resp.body);
			});
		})

		.get('/:artworkID/buy', function(req, res) {
			contract.buy(req).then(function (resp) {
				res.status(resp.status)[resp.status === 200 ? 'send': 'json'](resp.body);
			});
		})

		.get('/:artworkID/view', function(req, res) {
			contract.view(req).then(function (resp) {
				if (resp.status === 302) {
					res.redirect(resp.url);
				}
				else {
					res.status(resp.status)[resp.status === 200 ? 'send': 'json'](resp.body);
				}
			});
		}),

	authenticated: express.Router()

		.post('/add', function (req, res) {
			contract.add(req).then(function (resp) {
				res.status(resp.status).json(resp.body);
			});
		})

		.post('/bulk-add', function (req, res) {
			contract.bulkAdd(req).then(function (resp) {
				res.status(resp.status).json(resp.body);
			});
		})

		.post('/search', function (req, res) {
			contract.search(req).then(function (resp) {
				res.status(resp.status).json(resp.body);
			});
		})

		.delete('/:artworkID/remove', function (req, res) {
			contract.remove(req).then(function (resp) {
				res.status(resp.status).json(resp.body);
			});
		})

		//.put('/:artworkID/update', function (req, res) {
		//	contract.update(req).then(function (resp) {
		//		res.status(resp.status).json(resp.body);
		//	});
		//})

			.put('/:artworkID/activcanvas', function(req, res) {
				contract.update.activCanvas(req).then(function (resp) {
					res.status(resp.status).json(resp.body);
				})
			})

			.put('/:artworkID/general', function(req, res) {
				contract.update.general(req).then(function (resp) {
					res.status(resp.status).json(resp.body);
				})
			})




		.get('/:artworkID/like/:profileID?', function (req, res) {
			contract.like(req).then(function (resp) {
				res.status(resp.status).json(resp.body);
			});
		})

		.get('/:artworkID/unlike/:profileID?', function (req, res) {
			contract.unlike(req).then(function (resp) {
				res.status(resp.status).json(resp.body);
			});
		})

		.get('/:artworkID/upload', function (req, res) {
			res.status(400).json({ Message: 'Deprecated' });
		})

		.get('/:artworkID/viewed', function (req, res) {
			res.status(400).json({ Message: 'Deprecated' });
		})

};
