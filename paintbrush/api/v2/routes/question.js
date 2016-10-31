var router = require('express').Router();

router

	// list artist question types
	.get('/artist/types', function (req, res) {
		try {
			db.select('ID', 'Type').from('ArtistQuestionTypes')
				.then(function (data) {
					res.json(data);
				})
				.catch(function (e) {
					logError(e, req, function () {
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


	// list artist questions of the specified type
	.get('/artist/list/:typeID/:max?/:offset?', function (req, res) {
		try {
			var typeID = req.params.typeID * 1,
				max = (req.params.max || 1000) * 1,
				offset = (req.params.offset || 0) * 1;

			if (isNaN(typeID)) {
				res.status(400).json({ Message: 'TypeID must be a numeric value' });
			}
			else if (isNaN(max)) {
				res.status(400).json({ Message: 'Max must be a numeric value' });
			}
			else if (isNaN(offset)) {
				res.status(400).json({ Message: 'Offset must be a numeric value' });
			}
			else {
				db.select('ID', 'Text', 'TypeID', 'Priority')
					.from('ArtistQuestions')
					.where('TypeID', typeID)
					.orderBy('Priority', 'desc')
					.limit(max)
					.offset(offset)
					.then(function (data) {
						res.json(data);
					})
					.catch(function (e) {
						logError(e, req, function () {
							res.status(500).json({ Message: 'Unexpected error occurred' });
						});
					});
			}

			
		}
		catch (err) {
			logError(err, req, function () {
				res.status(500).json({ Message: 'Unexpected error occurred' });
			});
		}
	})


	// list gallery question types
	.get('/gallery/types', function (req, res) {
		try {
			db.select('ID', 'Type').from('GalleryQuestionTypes')
				.then(function (data) {
					res.json(data);
				})
				.catch(function (e) {
					logError(e, req, function () {
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


	// list gallery questions of the specified type
	.get('/gallery/list/:typeID/:max?/:offset?', function (req, res) {
		try {
			var typeID = req.params.typeID * 1,
				max = (req.params.max || 1000) * 1,
				offset = (req.params.offset || 0) * 1;

			if (isNaN(typeID)) {
				res.status(400).json({ Message: 'TypeID must be a numeric value' });
			}
			else if (isNaN(max)) {
				res.status(400).json({ Message: 'Max must be a numeric value' });
			}
			else if (isNaN(offset)) {
				res.status(400).json({ Message: 'Offset must be a numeric value' });
			}
			else {
				db.select('ID', 'Text', 'TypeID', 'Priority')
					.from('GalleryQuestions')
					.where('TypeID', typeID)
					.orderBy('Priority', 'desc')
					.limit(max)
					.offset(offset)
					.then(function (data) {
						res.json(data);
					})
					.catch(function (e) {
						logError(e, req, function () {
							res.status(500).json({ Message: 'Unexpected error occurred' });
						});
					});
			}


		}
		catch (err) {
			logError(err, req, function () {
				res.status(500).json({ Message: 'Unexpected error occurred' });
			});
		}
	})




module.exports = router
