var router = require('express').Router(),
	contract = require('../data-contracts/notifications');

router

	.get('/list/priorities', function (req, res) {
		contract.list.priorities(req).then(function(resp){
			res.status(resp.status).json(resp.body);
		})
	})

	.get('/list/types', function (req, res) {
		contract.list.types(req).then(function(resp){
			res.status(resp.status).json(resp.body);
		})
	})

	.get('/:profileID/list/recipients', function (req, res){
		contract.list.recipients(req).then(function(resp){
			res.status(resp.status).json(resp.body);
		})
	})

	.put('/:notificationID/mark-as-read', function (req, res){
		contract.markAsRead(req).then(function(resp){
			res.status(resp.status).json(resp.body);
		})
	})

	.delete('/:notificationID/remove', function (req, res){
		contract.remove(req).then(function(resp){
			res.status(resp.status).json(resp.body);
		})
	})

	.get('/:notificationID', function (req, res) {
		contract.get(req).then(function(resp){
			res.status(resp.status).json(resp.body);
		})
	})

	.get('/:profileID/count/unread', function (req, res){
		contract.count.unread(req).then(function(resp){
			res.status(resp.status).json(resp.body);
		})
	})

	.post('/:profileID/search', function (req, res) {
		contract.search(req).then(function(resp){
			res.status(resp.status).json(resp.body);
		})
	});


module.exports = router;