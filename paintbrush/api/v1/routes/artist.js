var router = require('express').Router();

router

		.get('/age-brackets', function (req, res) {
			try {
				db('AgeBrackets')
					.select('ID', 'Description')
					.orderBy('Description')
					.then(function (data) {
						res.json(data)
					})
					.catch(function (err) {
						logError(err, req, function () {
							res.status(500).json({ Message: 'Unexpected error occurred' });
						});
					});
			}
			catch (err) {
				logError(err, req, function () {
					res.status(500).json({ Message: 'Unexpected error occurred' });
				});
			}
		})


		.get('/types', function (req, res) {
		try {
			db('ArtistTypes')
				.select('ID', 'Type', 'Description')
				.orderBy('Type')
				.then(function (data) {
					res.json(data)
				})
				.catch(function (err) {
					logError(err, req, function () {
						res.status(500).json({ Message: 'Unexpected error occurred' });
					});
				});
		}
		catch (err) {
			logError(err, req, function () {
				res.status(500).json({ Message: 'Unexpected error occurred' });
			});
		}
	})


		.get('/workspaces', function (req, res) {

			db('WorkingSpaces')
				.select('ID', 'Description')
				.orderBy('Description')
				.then(function (data) {
					res.json(data)
				})
				.catch(function (err) {
					logError(err, req, function () {
						res.status(500).json({ Message: 'Unexpected error occurred' });
					});
				});
		});


module.exports = router;
