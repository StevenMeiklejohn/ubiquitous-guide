var router = require('express').Router(),
	AccessToken = require('../../auth/access-token'),
	Subscription = require('../lib/subscription');



router

	.post('/create', function (req, res) {

		AccessToken.getUser(req).then(function (user) {
			if (!user) {
				res.status(400).json({ Message: 'Current user could not be determined' });
			}
			else {

				Subscription.create(user.ProfileID, req.body.PackageID, req.body.AffiliateCodeID, {
					number: req.body.Number,
					expMonth: req.body.ExpMonth,
					expYear: req.body.ExpYear,
					cvc: req.body.CVC
				})
				.then(function () {
					return db('Profiles').where('ID', user.ProfileID).update('ActivCanvasStatusID', 3);
				})
				.then(function () {
					AccessToken.refreshUser(req).then(function () {
						res.json({ Message: 'Success' });
					});
				})
				.catch(function (err) {
					logError(err, req, function () {
						if (typeof err === 'string') {
							res.status(400).json({ Message: err })
						}
						else if (err.message) {
							res.status(400).json({ Message: err.message });
						}
						else {
							res.status(500).json({ Message: 'Unexpected error occurred' });
						}
					});
				});

			}
		});




		
		//.then(function () {
		//	res.json({})
		//})
		//.catch(function (err) {
		//	console.log(err)

		//	if (typeof err === 'string') {
		//		res.status(400).json({ Message: err })
		//	}
		//	else {
		//		res.sendStatus(500);
		//	}
		//});



	})

	.put('/:subscriptionID/cancel', function (req, res) {

		AccessToken.getUser(req).then(function (user) {
			if (!user) {
				res.status(400).json({ Message: 'Current user could not be determined' });
			}
			else if (!user.memberOf('Administrators')) {
				res.status(403).json({ Message: 'You do not have permission to perform this action' });
			}
			else {

				db('Subscriptions').first().where('ID', req.params.subscriptionID).then(function (subscription) {
					
					if (!subscription) {
						res.status(404).json({ Message: 'Subscription not found' });
					}
					else if (subscription.StatusID !== Subscription.STATUS.ACTIVE) {
						res.status(400).json({ Message: 'Subscription is no longer active' });
					}
					else {
						return Subscription.cancel(subscription.ID).then(function () {
							AccessToken.refreshUser(req).then(function () {
								res.json({ Message: 'Success' });
							})
						})
					}

				})
				.catch(function (err) {
					logError(err, req, function () {
						if (typeof err === 'string') {
							res.status(400).json({ Message: err })
						}
						else if (err.message) {
							res.status(400).json({ Message: err.message });
						}
						else {
							res.status(500).json({ Message: 'Unexpected error occurred' });
						}
					});
				});

			}
		});

	})




	//
	// lists a specific profiles subscriptions
	//
	.get('/list/:profileID', function (req, res) {

		var profileID = req.params.profileID * 1;

		AccessToken.getUser(req).then(function (user) {
			if (!user) {
				res.status(400).json({ Message: 'Current user could not be determined' });
			}
			else if (isNaN(profileID)) {
				res.status(400).json({ Message: 'Invalid profileID specified' });
			}
			else if (!user.memberOf('Administrators') && user.ProfileID !== profileID) {
				res.status(403).json({ Message: 'You do not have permission to view this profiles subscriptions' });
			}
			else {

				Subscription.list(profileID)
					.then(function (subscriptions) {
						res.json(subscriptions);
					})
					.catch(function (err) {
						logError(err, req, function () {
							console.log(err);

							if (typeof err === 'string') {
								res.status(400).json({ Message: err })
							}
							else {
								res.status(500).json({ Message: 'Unexpected error occurred' });
							}
						});
					});

			}
		});

	})

	//
	// list the current users subscriptions
	//
	.get('/list', function (req, res) {

		AccessToken.getUser(req).then(function (user) {
			if (!user) {
				res.status(400).json({ Message: 'Current user could not be determined' });
			}
			else {

				Subscription.list(user.ProfileID)
					.then(function (subscriptions) {
						res.json(subscriptions);
					})
					.catch(function (err) {
						logError(err, req, function () {
							if (typeof err === 'string') {
								res.status(400).json({ Message: err })
							}
							else {
								res.status(500).json({ Message: 'Unexpected error occurred' });
							}
						});
					});

			}
		});

	})

	// lists packages available to the current user
	.get('/packages', function (req, res) {
		
		AccessToken.getUser(req).then(function (user) {
			if (!user) {
				res.status(400).json({ Message: 'Current user could not be determined' });
			}
			else {

				Subscription.packages(user.ArtistID ? 'artist': user.GalleryID ? 'gallery' : 'consumer')
					.then(function (packages) {
						res.json(packages);
					})
					.catch(function (err) {
						logError(err, req, function () {
							if (typeof err === 'string') {
								res.status(400).json({ Message: err })
							}
							else {
								res.status(500).json({ Message: 'Unexpected error occurred' });
							}
						});
					});

			}
		});

	})


	// lists available payment providers
	.get('/providers', function (req, res) {

		Subscription.providers()
			.then(function (providers) {
				res.json(providers);
			})
			.catch(function (err) {
				logError(err, req, function () {
					if (typeof err === 'string') {
						res.status(400).json({ Message: err })
					}
					else {
						res.status(500).json({ Message: 'Unexpected error occurred' });
					}
				});
			});


	})


	// lists subscription statuses
	.get('/statuses', function (req, res) {

		db('SubscriptionStatus').select()
			.then(function (statuses) {
				res.json(statuses);
			})
			.catch(function (err) {
				logError(err, req, function () {
					res.status(500).json({ Message: 'Unexpected error occurred' });
				});
			});

	});




module.exports = router;
