var router = require('express').Router(),
	AccessToken = require('../../auth/access-token'),
	UserPreferences = require('../lib/user-preference');

router

	//
	// Returns current user's preferences, can be filtered by category and key
	//
	.get('/:category?/:key?', function (req, res) {

		AccessToken.getUser(req).then(function(user) {

			UserPreferences.get(user.UserID, req.params.category, req.params.key)
				.then(function(value) {
					res.json(value);
				})
				.catch(function(err){
					console.error(err);
					res.status(400).json({ Message: err.message || err })
				});

		})


	})




	//
	// Updates current user's preferences
	//
	.put('/:category/:key?', function (req, res) {

		AccessToken.getUser(req).then(function(user) {

			UserPreferences.set(user.UserID, req.params.category, req.params.key, req.body)
				.then(function(value) {
					res.json(value);
				})
				.catch(function(err){
					console.error(err);
					res.status(400).json({ Message: err.message || err })
				});

		})


	});


module.exports = router;