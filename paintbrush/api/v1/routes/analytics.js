var router = require('express').Router(),
	Analytics = require('../lib/analytics');

router

	.get('/event/list', function (req, res) {

		Analytics.event.list(false)
			.then(function (data) {
				res.json(data)
			})
			.catch(function (err) {
				logError(err, req, function () {
					res.status(500).json({ Message: 'Unexpected error occurred' });
				});
			});

	})


	.post('/event', function (req, res) {

		if (!req.body.EventID) {
			res.status(400).json({ Message: 'Please specify an EventID' });
		}
		else {

			console.log('\x1b[33mANALYTICS (M)\x1b[0m: \x1b[36mEVENT ' + req.body.EventID + '\x1b[0m: ' + JSON.stringify(req.body));

			db('AnalyticEventTypes').where('ID', req.body.EventID).first()
				.then(function(eventType){

					if (!eventType) {
						res.status(400).json({ Message: 'No event found with ID: ' + req.body.EventID });
					}
					else if (eventType.AutoRecorded) {
						res.status(400).json({ Message: 'Event \'' + eventType.Description + '\' is recorded automatically' });
					}
					else if (eventType.ArtworkID && !req.body.ArtworkID) {
						res.status(400).json({ Message: 'Event \'' + eventType.Description + '\' requires an ArtworkID' });
					}
					else if (eventType.ArtistID && !req.body.ArtistID) {
						res.status(400).json({ Message: 'Event \'' + eventType.Description + '\' requires an ArtistID' });
					}
					else if (eventType.ProfileID && !req.body.ProfileID) {
						res.status(400).json({ Message: 'Event \'' + eventType.Description + '\' requires a ProfileID' });
					}
					else if (eventType.ShortlistID && !req.body.ShortlistID) {
						res.status(400).json({ Message: 'Event \'' + eventType.Description + '\' requires a ShortlistID' });
					}
					else if (eventType.VideoID && !req.body.VideoID) {
						res.status(400).json({ Message: 'Event \'' + eventType.Description + '\' requires a VideoID' });
					}
					else {
						return Analytics.event.add(req, req.body.EventID, req.body)
							.then(function(){
								res.json({ Message: 'Success' });
							})
					}

				})
				.catch(function (err) {
					logError(err, req, function () {
						res.status(500).json({ Message: 'Unexpected error occurred' });
					});
				});
		}

	});


module.exports = router;
