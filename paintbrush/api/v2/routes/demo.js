var config = require('../config'),
	router = require('express').Router(),
	AccessToken = require('../../auth/access-token'),
	ActivCanvas = require('../lib/activcanvas');

router

	.get('/activate/:artworkID', function (req, res) {

		AccessToken.getUser(req).then(function(user) {
		
			// check current user has permission to activate this artwork
			// - artwork must belong to users profile
			// - or user must be an admin
			db.first().from('Artworks').where('ID', req.params.artworkID)
				.catch(function (err) {
					logError(err, req, function () {
						res.status(500).json({ Message: 'Error retrieving artwork from database' });
					});
				})
				.then(function (data) {

					if (!data) {
						res.status(404).json({ Message: 'Artwork not found' });
					}
					else if (!(user.ProfileID === data.OwnerProfileID || user.ProfileID === data.ArtistProfileID || user.memberOf('Administrators'))) {
						res.status(403).json({ Message: 'You do not have permission to activate this artwork' })
					}
					else {

						// check for existing artwork video record
						db('ArtworkVideos').where('ArtworkID', req.params.artworkID).first().orderBy('Priority', 'asc')
							.then(function (av) {

								// if artwork video record does not exist or is a different video from the demo video then activate
								if (!av || av.VideoID !== 43232) {// config.activCanvas.demoVideoID) {
									return db('ArtworkVideos').where('ArtworkID', req.params.artworkID).del()
										.then(function () {
											return db('ArtworkVideos').insert({ ArtworkID: req.params.artworkID, VideoID: config.activCanvas.demoVideoID, Priority: 1 });
										})
										.then(function () {
											return ActivCanvas.queue({ videoID: config.activCanvas.demoVideoID, artworkID: req.params.artworkID })
										})
								}

							})
							.then(function () {
								res.json({ Message: 'Success' });
							})
							.catch(function (err) {
								logError(err, req, function () {
									res.status(500).json({ Message: 'Unexpected error occurred' });
								});
							})

					}
				});

		})

	})


	.get('/status/:artworkID', function (req, res) {

		db.first().from('Artworks').where('ID', req.params.artworkID)
			.catch(function (err) {
				logError(err, req, function () {
					res.status(500).json({ Message: 'Error retrieving artwork from database' });
				});
			})
			.then(function (data) {

				if (!data) {
					res.status(404).json({ Message: 'Artwork not found' });
				}
				else {
					db.first(
						'vt.TrackingRating',
						'vt.SyncRequired'
					)
					.from('Artworks as a')
					.leftJoin('VuforiaTargets as vt', 'a.ID', 'vt.ArtworkID')
					.where('a.ID', req.params.artworkID)
					.then(function (data) {
						res.json(data);
					})
					.catch(function (err) {
						logError(err, req, function () {
							res.status(500).json({ Message: 'Unexpected error occurred' });
						});
					})
				}
			});
			
		
		
	});



module.exports = router;
