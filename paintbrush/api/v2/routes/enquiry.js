var router = require('express').Router(),
	config = require('../config'),
	AccessToken = require('../../auth/access-token'),
	Analytics = require('../lib/analytics'),
	Message = require('../lib/message'),
	Email = require('../../lib/email');


router

	//
	// ActivCanvas Enquire To Buy
	//
	.post('/buy', function (req, res) {

		AccessToken.getUser(req).then(function (user) {
			if (!user) {
				res.status(400).json({ Message: 'Current user could not be determined' });
			}
			else if (isNaN(req.body.ArtworkID * 1)) {
				res.status(400).json({ Message: 'Please supply a numeric ArtworkID' });
			}
			else {

				//
				// Fetch recipient profile
				//
				db.first('aw.Name as ArtworkName', 'p.*')
					.from('Artworks as aw')
					.join('Profiles as p', 'aw.ArtistProfileID', 'p.ID')	// use OwnerID instead?
					.where({ 'aw.ID': req.body.ArtworkID })
					.then(function(recipient) {
						if (!recipient) {
							res.status(400).json({ Message: 'Recipient not found' })
						}
						else {
							return Message.send(user.ProfileID, recipient.ID, {
								subject: 'Enquiry To Buy ' + recipient.ArtworkName,
								replyTo: user.Email,
								body2:
									'<p>' + user.Name + ' has enquired to buy your artwork \'' + recipient.ArtworkName + '\'</p>' +
									'<p><strong>Enquiry:</strong></p>' +
									'<p>' + req.body.Enquiry.replace(/\n|\r/g, '<br/>') + '</p>' +
									'<p><strong>Email:</strong> ' + user.Email + '</p>',
								body:
									'<p>' + user.Name + ' has enquired to buy your artwork \'' + recipient.ArtworkName + '\'</p>' +
									'<p><strong>Enquiry:</strong></p>' +
									'<p>' + req.body.Enquiry.replace(/\n|\r/g, '<br/>') + '</p>' +
									'<p><strong>Email:</strong> ' + user.Email + '</p>'
							})
							.then(function() {
								res.json({ Message: 'Success' });
							})
							.then(function () {
								Analytics.event.add(req, 10, { ArtworkID: req.body.ArtworkID });
							})
						}
					})
					.catch(function(e) {
						console.error(e);
						res.status(500).json({ Message: 'An unexpected error occurred' });
					})

			}
		});

	})


	//
	// General Support Enquiry
	//
	.post('/submit', function (req, res) {

		AccessToken.getUser(req).then(function (user) {
			if (!user) {
				res.status(400).json({ Message: 'Current user could not be determined' });
			}
			else {
				try {
					Email.send({
						to: config.email.support,
						bcc: 'kris@artretailnetwork.com',
						subject: 'Website Enquiry (' + user.Name + ')',
						text: req.body.Enquiry,
						replyTo: user.Email
					});
					res.json({ Message: 'Success' });
				}
				catch (e) {
					res.status(500).json({ Message: 'An unexpected error occurred, if this problem persists please email us directly at ' + config.email.support });
				}

			}
		});

	});



module.exports = router;
