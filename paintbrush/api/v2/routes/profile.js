var contract = require('../data-contracts/profile'),
	config = require('../config'),
	router = require('express').Router(),
	//passport = require('passport'),
	Promise = require('bluebird'),
	Task = require('../utils/tasks'),
	AccessToken = require('../../auth/access-token'),
	ActivCanvas = require('../lib/activcanvas'),
	Analytics = require('../lib/analytics');


router


	// returns the currently logged in profiles groups
	.get('/groups', function (req, res) {
		AccessToken.getUser(req).then(function (user) {
			res.json(user.Groups);
		});
	})

	.get('/:profileID', function(req, res) {
		contract.get.all(req).then(function (resp) {
			res.status(resp.status).json(resp.body);
		})
	})

	.get('/:profileID/all', function(req, res) {
		contract.get.all(req).then(function (resp) {
			res.status(resp.status).json(resp.body);
		})
	})

	.get('/:profileID/base', function(req, res) {
		contract.get.base(req).then(function (resp) {
			res.status(resp.status).json(resp.body);
		})
	})

	.get('/:profileID/contact', function(req, res) {
		contract.get.contact(req).then(function (resp) {
			res.status(resp.status).json(resp.body);
		})
	})

	.get('/:profileID/artist', function(req, res) {
		contract.get.artist(req).then(function (resp) {
			res.status(resp.status).json(resp.body);
		})
	})

	.get('/:profileID/activcanvas', function(req, res) {
		contract.get.activCanvas(req).then(function (resp) {
			res.status(resp.status).json(resp.body);
		})
	})

	.get('/:profileID/consumer', function(req, res) {
		contract.get.consumer(req).then(function (resp) {
			res.status(resp.status).json(resp.body);
		})
	})

	.get('/:profileID/gallery', function(req, res) {
		contract.get.gallery(req).then(function (resp) {
			res.status(resp.status).json(resp.body);
		})
	})

	.get('/:profileID/social-media', function(req, res) {
		contract.get.socialMedia(req).then(function (resp) {
			res.status(resp.status).json(resp.body);
		})
	})



	.put('/:profileID/base', function(req, res) {
		contract.update.base(req).then(function (resp) {
			res.status(resp.status).json(resp.body);
		})
	})

	.put('/:profileID/contact', function(req, res) {
		contract.update.contact(req).then(function (resp) {
			res.status(resp.status).json(resp.body);
		})
	})

	.put('/:profileID/activcanvas', function(req, res) {
		contract.update.activCanvas(req).then(function (resp) {
			res.status(resp.status).json(resp.body);
		})
	})

	.put('/:profileID/artist', function(req, res) {
		contract.update.artist(req).then(function (resp) {
			res.status(resp.status).json(resp.body);
		})
	})

	.put('/:profileID/awards', function(req, res) {
		contract.update.awards(req).then(function (resp) {
			res.status(resp.status).json(resp.body);
		})
	})

	.put('/:profileID/consumer', function(req, res) {
		contract.update.consumer(req).then(function (resp) {
			res.status(resp.status).json(resp.body);
		})
	})

	.put('/:profileID/gallery', function(req, res) {
		contract.update.gallery(req).then(function (resp) {
			res.status(resp.status).json(resp.body);
		})
	})

	.put('/:profileID/social-media', function(req, res) {
		contract.update.socialMedia(req).then(function (resp) {
			res.status(resp.status).json(resp.body);
		})
	})



	.get('/:profileID/answers', function (req, res) {

		if (isNaN(parseInt(req.params.profileID))) {
			res.status(400).json({ Message: 'Invalid Profile ID' })
		}
		else {

			db
			.first('a.ID as ArtistID', 'g.ID as GalleryID')
			.from('Profiles as p')
			.leftJoin('Artists as a', 'a.ProfileID', 'p.ID')
			.leftJoin('Galleries as g', 'g.ProfileID', 'p.ID')
			.where('p.ID', req.params.profileID)
			.then(function (profile) {
				
				if (!profile) {
					return res.status(400).json({ Message: 'The profile specified does not exist' })
				}
				else if (profile.ArtistID || profile.GalleryID) {
					
					var profileType = profile.ArtistID ? 'Artist' : 'Gallery';

					db
					.select('Answer', profileType + 'QuestionID as QuestionID')
					.from(profileType + 'Answers')
					.where(profileType + 'ID', profile.ArtistID || profile.GalleryID)
					.then(function (answers) {
						res.json(answers);
					})
					.catch(function(err) {
						logError(err, req, function () {
							res.status(500).json({ Message: 'An unexpected error occurred while contacting the database' });
						});
					})

				}
				else {
					return res.status(400).json({ Message: 'The profile specified is neither an artist or gallery'})
				}

			});


		}

	})








module.exports = router
