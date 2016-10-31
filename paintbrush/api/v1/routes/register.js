var router = require('express').Router(),
	extend = require('util')._extend,
	Promise = require('bluebird'),
	Registration = require('../lib/registration');



router


	// returns the current registration progress for the specified email address
	.post('/check-status', function (req, res) {
		
		if (!req.body.Email) {
			res.status(400).json({ Message: 'Please specify an email address' });
		}
		else if (req.body.Email.indexOf('@') < 0) {
			res.status(400).json({ Message: 'Email address does not appear to be valid' });
		}
		else {

			db.first(
				'u.ID as UserID',
				'u.RegistrationID',
				'r.ProfileID',
				'r.Step',
				'r.Type',
				'r.TotalSteps',
				'r.CompletedSteps'
			)
			.from('Users as u')
			.leftJoin('Registrations as r', 'u.RegistrationID', 'r.ID')
			.where({ Email: req.body.Email })
			.then(function (data) {

				// no user exists yet with the specified email
				if (!data) {
					res.json({ Exists: 0 });
				}
				// registration is in progress or has been completed
				else {
					res.json(extend({ Exists: 1 }, data));
				}

			})
			.catch(function(err) {
				logError(err, req, function () {
					res.status(500).json({ Message: 'Unexpected error occurred' });
				});
			})
		}

	})


	// updates the current registration progress for the specified email address
	.post('/update-status', function (req, res) {

		var registrationID = req.body.RegistrationID * 1,
			userID = req.body.UserID * 1;

		if (isNaN(registrationID)) {
			res.status(400).json({ Message: 'Invalid RegistrationID' });
		}
		else if (isNaN(userID)) {
			res.status(400).json({ Message: 'Invalid UserID' });
		}
		else {
			db.first('r.*')
			.from('Registrations as r')
			.join('Users as u', 'r.ID', 'u.RegistrationID')
			.then(function (registration) {
				if (!registration) {
					res.status(404).json({ Message: 'Registration record not found or does not belong to the specified user.' })
				}
				else {
					db('Registrations')
					.where('ID', registrationID)
					.update({
						Step: req.body.Step,
						Type: req.body.Type,
						CompletedSteps: req.body.CompletedSteps,
						TotalSteps: req.body.TotalSteps
					})
					.then(function () {
						res.json({ Message: 'Success' })
					})
					
				}
			})
			.catch(function (err) {
				logError(err, req, function () {
					res.status(500).json({ Message: 'Unexpected error occurred' });
				});
			})
		}

	})


	// creates a new user account and registration record
	.post('/create-user', function (req, res) {
		Registration.createUser(req.body)
			.then(function (result) {
				res.json(result);
			})
			.catch(function (err) {
				if (err.Status) {
					res.status(err.Status).json({ Message: err.Message });
				}
				else {
					logError(err, req, function () {
						res.status(500).json({ Message: 'Unexpected error occurred' });
					});
				}
			})
	})

	// creates a new user account and registration record
	.post('/create-profile', function (req, res) {

		var registrationID = req.body.RegistrationID * 1,
			userID = req.body.UserID * 1;

		if (isNaN(registrationID)) {
			res.status(400).json({ Message: 'Invalid RegistrationID' });
		}
		else if (isNaN(userID)) {
			res.status(400).json({ Message: 'Invalid UserID' });
		}
		else if ((!req.body.Artist && !req.body.Gallery) || (req.body.Artist && req.body.Gallery)) {	
			res.status(400).json({ Message: 'Please specify either an artist or gallery profile to create.' })
		}
		else {

			db('ContactInformation').insert({ Website: req.body.Website || null, Address1: '', Address2: '', Address3: '', Town: '', Postcode: '', Mobile: '', Landline: '' })
				.then(function(contactInfo) {

					db('Profiles').insert({
						Name: req.body.Name,
						ImageURI: req.body.ImageURI,
						ActivCanvasStatusID: 1,
						ContactInformationID: contactInfo[0]
					})
					.then(function (profile) {
						var Task = require('../utils/tasks');

						// link registration record to profile
						return db('Registrations').where({ ID: registrationID }).update({ ProfileID: profile[0] })
							.then(function () {

								// create a new artist record
								if (req.body.Artist) {
									return db('Artists').insert({
										UserID: userID,
										ProfileID: profile[0],
										Location: req.body.Location
									})
								}
								// create a new gallery record
								else if (req.body.Gallery) {
									return db('Galleries').insert({
										ProfileID: profile[0]
									})
									.then(function (gallery) {
										return db('GalleryUsers').insert({
											UserID: userID,
											GalleryID: gallery[0]
										})
									})
								}
							})
							.then(function () {

								// create a new task notification to encourage the user to fill out the rest of their profile
								return Task.startGroup(profile[0], 'complete-profile', true);
							})
							.then(function () {

								// mark upload profile image task as completed
								if (req.body.ImageURI) {
									return Task.complete(profile[0], 'profile-image');
								}
							})
							.then(function () {
								res.json({ ProfileID: profile[0] });
							})

					})
					.catch(function (err) {
						logError(err, req, function () {
							res.status(500).json({ Message: 'Unexpected error occurred' });
						});
					})

				})

		}

		

	})




	// marks a specific registration as complete
	.post('/complete', function (req, res) {

		var registrationID = req.body.RegistrationID * 1,
			userID = req.body.UserID * 1;

		if (isNaN(registrationID)) {
			res.status(400).json({ Message: 'Invalid RegistrationID' });
		}
		else if (isNaN(userID)) {
			res.status(400).json({ Message: 'Invalid UserID' });
		}
		else {
			// check registration and user records exist
			db.first('r.*')
			.from('Registrations as r')
			.join('Users as u', 'r.ID', 'u.RegistrationID')
			.then(function (registration) {
				if (!registration) {
					res.status(404).json({ Message: 'Registration record not found or does not belong to the specified user.' })
				}
				else {

					// unlink user account from registration record so they are not forced to the registration form when they next log in
					return db('Users')
					.where({ ID: userID, RegistrationID: registrationID })
					.update({ RegistrationID: null })
					.then(function () {
						res.json({ Message: 'Success' });
					});

				}
			})
			.catch(function (err) {
				logError(err, req, function () {
					res.status(500).json({ Message: 'Unexpected error occurred' });
				});
			})
		}

	})



	// creates a new consumer user
	.post('/create-consumer', function (req, res) {

		Registration.createConsumer(req.body)
			.then(function (consumer) {
				res.json({ UserID: consumer.UserID, ProfileID: consumer.ProfileID, Message: 'Success' });
			})
			.catch(function (err) {
				if (err.Status) {
					res.status(err.Status).json({ Message: err.Message });
				}
				else {
					logError(err, req, function () {
						res.status(500).json({ Message: 'Unexpected error occurred' });
					});
				}
			})

	});




module.exports = router;
