var contract = require('../data-contracts/dashboard'),
	router = require('express').Router();



router


	.get('/:profileID/artwork/popular', function (req, res) {
		contract.artwork.popular(req).then(function(resp) {
			res.status(resp.status).json(resp.body);
		})
	})

	.get('/:profileID/artwork/count/likes', function (req, res) {
		contract.artwork.count.likes(req).then(function(resp) {
			res.status(resp.status).json(resp.body);
		})
	})

	.get('/:profileID/artwork/count/scans', function (req, res) {
		contract.artwork.count.scans(req).then(function(resp) {
			res.status(resp.status).json(resp.body);
		})
	})

	.get('/:profileID/artwork/count/shortlisted', function (req, res) {
		contract.artwork.count.shortlisted(req).then(function(resp) {
			res.status(resp.status).json(resp.body);
		})
	})

	.get('/:profileID/artwork/count/total', function (req, res) {
		contract.artwork.count.total(req).then(function(resp) {
			res.status(resp.status).json(resp.body);
		})
	})

	.get('/:profileID/artwork/count/views', function (req, res) {
		contract.artwork.count.views(req).then(function(resp) {
			res.status(resp.status).json(resp.body);
		})
	})

	.get('/:profileID/artwork/interval/likes/:interval/:datapoints?', function (req, res) {
		contract.artwork.interval.likes(req).then(function(resp) {
			res.status(resp.status).json(resp.body);
		})
	})

	.get('/:profileID/artwork/interval/scans/:interval/:datapoints?', function (req, res) {
		contract.artwork.interval.scans(req).then(function(resp) {
			res.status(resp.status).json(resp.body);
		})
	})

	.get('/:profileID/artwork/interval/shortlisted/:interval/:datapoints?', function (req, res) {
		contract.artwork.interval.shortlisted(req).then(function(resp) {
			res.status(resp.status).json(resp.body);
		})
	})

	.get('/:profileID/artwork/interval/total/:interval/:datapoints?', function (req, res) {
		contract.artwork.interval.total(req).then(function(resp) {
			res.status(resp.status).json(resp.body);
		})
	})

	.get('/:profileID/artwork/interval/views/:interval/:datapoints?', function (req, res) {
		contract.artwork.interval.views(req).then(function(resp) {
			res.status(resp.status).json(resp.body);
		})
	})

	.get('/:profileID/customers/most-active', function (req, res) {
		contract.customers.mostActive(req).then(function(resp) {
			res.status(resp.status).json(resp.body);
		})
	})

	.get('/:profileID/profile/count/views', function (req, res) {
		contract.profile.count.views(req).then(function(resp) {
			res.status(resp.status).json(resp.body);
		})
	})

	.get('/:profileID/profile/interval/views/:interval/:datapoints?', function (req, res) {
		contract.profile.interval.views(req).then(function(resp) {
			res.status(resp.status).json(resp.body);
		})
	})

	.get('/:profileID/profile/viewed/details', function (req, res) {
		contract.profile.viewed.details(req).then(function(resp) {
			res.status(resp.status).json(resp.body);
		})
	})

	.get('/:profileID/social/count/followers', function (req, res) {
		contract.social.count.views(req).then(function(resp) {
			res.status(resp.status).json(resp.body);
		})
	})

	.get('/:profileID/social/interval/followers/:interval/:datapoints?', function (req, res) {
		contract.social.interval.likes(req).then(function(resp) {
			res.status(resp.status).json(resp.body);
		})
	})

	.get('/:profileID/notifications', function (req, res) {
		contract.notifications(req).then(function(resp) {
			res.status(resp.status).json(resp.body);
		})
	});



module.exports = router;