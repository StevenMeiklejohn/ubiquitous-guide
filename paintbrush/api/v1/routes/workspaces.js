var router = require('express').Router();

router

		//
		// DEPRECATED
		//

		.get('/', function (req, res) {
			try {
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
			}
			catch (err) {
				logError(err, req, function () {
					res.status(500).json({ Message: 'Unexpected error occurred' });
				});
			}
		});



module.exports = router;
