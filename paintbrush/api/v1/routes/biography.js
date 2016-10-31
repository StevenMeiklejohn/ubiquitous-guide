var router = require('express').Router(),
	AccessToken = require('../../auth/access-token');

router

	// view biography
	.get('/:profileID', function (req, res) {
		profileID = parseInt(req.params.profileID);
		if(isNaN(profileID)) return res.status(400).json({ Message: 'Invalid biography ID' });

		try {
			db.first('Description').from('Biographies')
				.where('ProfileID', profileID)
				.then(function (data) {
					if (!data) {
						return res.status(404).json({ Message: 'Biography Not Found' });
					}
					return res.json(data);
				})
				.catch(function () {
					console.log(arguments);
					return res.status(500).json({ Message: 'Error fetching biography' });
				});
		}
		catch (err) {
			logError(err, req, function () {
				return res.status(500).json({ Message: 'Unexpected error occurred' });
			});
		}
	})

	// update biography
	.put('/:profileID/update', function (req, res) {
		profileID = parseInt(req.params.profileID);
		if(isNaN(profileID)) return res.status(400).json({ Message: 'Invalid biography ID' });

		try {
			AccessToken.getUser(req).then(function (user) {

				if (user === null) {
					res.status(500);
					return res.json({ Message: 'Current user could not be determined' });
				}

				if (user.ProfileID != profileID && !user.memberOf('Administrators')) {	// and user is not an admin
					res.status(403);
					return res.json({ Message: 'You do not have permission to update this profile' });
				}

				db.first('*')
					.from('Biographies')
					.where('ProfileID', profileID)
					.catch(function () {
						res.status(500);
						return res.json({ Message: "Error retrieving data from the database" });
					})
					.then(function (data) {

						if (!data) {
							db('Biographies')
								.insert({
									ProfileID: profileID,
									Description: req.body.Description,
									created_at: new Date(),
									updated_at: new Date()
								})
								.then(function () {
									res.status(201);
									return res.json({ Message: "Success" });
								})
								.catch(function () {
									res.status(500);
									return res.json({ Message: "Error adding record to the database" });
								})
						}
						else {
							db('Biographies').where('ID', data.ID)
								.update({
									Description: req.body.Description,
									updated_at: new Date()
								})
								.then(function () {
									res.status(200);
									return res.json({ Message: "Success" });
								})
								.catch(function () {
									res.status(500);
									return res.json({ Message: "Error updating record in the database" });
								})
						}
					});

			});
		}
		catch (err) {
			logError(err, req, function () {
				if(!res.headersSent) return res.status(500).json({ Message: 'Unexpected error occurred' });
			});
		}
	})


module.exports = router
