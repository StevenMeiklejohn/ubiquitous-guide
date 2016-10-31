var router = require('express').Router(),
	AccessToken = require('../../auth/access-token'),
	Message = require('../lib/message');


router

	//
	// Sends a new message to a specific profile
	//
	.post('/send', function (req, res) {

		AccessToken.getUser(req).then(function (user) {
			if (!user) {
				res.status(400).json({ Message: 'Current user could not be determined' });
			}
			else if (isNaN(req.body.RecipientProfileID * 1)) {
				res.status(400).json({ Message: 'Please supply a numeric RecipientProfileID' });
			}
			else if (!req.body.Body) {
				res.status(400).json({ Message: 'Please supply a message body' });
			}
			else if (!req.body.Subject) {
				res.status(400).json({ Message: 'Please supply a message subject' });
			}
			else {

				//
				// Fetch recipient profile
				//
				db.first()
					.from('Profiles as p')
					.where({ 'ID': req.body.RecipientProfileID })
					.then(function(recipient) {
						if (!recipient) {
							res.status(400).json({ Message: 'Recipient not found' })
						}
						else {
							return Message.send(user.ProfileID, recipient.ID, {
								subject: req.body.Subject,
								body: req.body.Body,
								previousMessageID: req.body.PreviousMessageID
							})
							.then(function() {
								res.json({ Message: 'Success' });
							})
						}
					})
					.catch(function(e) {
						console.error(e);
						res.status(500).json({ Message: 'An unexpected error occurred' });
					})

			}
		});

	});


module.exports = router;
