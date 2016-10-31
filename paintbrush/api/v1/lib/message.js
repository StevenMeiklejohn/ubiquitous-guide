var Promise = require('bluebird'),
	Notification = require('./notification');


//
// Recursive get method, if an array is passed as the second argument
// then entire thread of messages will be returned
//
var get = function (messageID, trail) {
	return new Promise(function (resolve, reject) {
		db.first(
			'm.ID',
			'm.Body',
			'm.Subject',
			'm.SentDate',
			'm.ReadDate',
			'm.SenderProfileID',
			'sp.Name as SenderProfileName',
			'sp.ImageURI as SenderProfileImageURI',
			'm.PreviousMessageID'
		)
		.from('Messages as m')
		.join('Profiles as sp', 'm.SenderProfileID', 'sp.ID')
		.where('m.ID', messageID)
		.then(function(message) {

			if (trail) {
				trail.push(message);
			}
			if (message.PreviousMessageID && trail) {
				return get(message.PreviousMessageID, trail)
					.then(function(resp){
						resolve(resp);
					})
					.catch(reject);
			}
			else {
				resolve({ message: message, trail: trail });
			}

		})
		.catch(reject);
	});
};

//
// This class provides a simple way to send messages between users
//
var Message = {

	//
	// Returns the specified message
	//
	get: function (messageID) {
		return new Promise(function (resolve, reject) {
			get(messageID)
				.then(function(data) {
					resolve(data.message);
				})
				.catch(reject);
		});
	},

	//
	// Returns the specified message and any previous messages
	//
	loadThread: function (messageID) {
		return new Promise(function (resolve, reject) {
			get(messageID, [])
				.then(function(data) {
					resolve(data.trail);
				})
				.catch(reject);
		});
	},


	//
	// Creates a new message
	//
	send: function(senderProfileID, recipientProfileID, opts) {
		return new Promise(function (resolve, reject) {

			// check all required params
			if (!senderProfileID) {
				reject('SenderProfileID is required');
			}
			else if (!recipientProfileID) {
				reject('RecipientProfileID is required');
			}
			else if (!opts.subject) {
				reject('Subject is required');
			}
			else if (!opts.body) {
				reject('Body is required');
			}
			else {

				db('Profiles').where('ID', senderProfileID).first()
					.then(function(senderProfile){
						if (!senderProfile) {
							reject('Sender profile does not exist');
						}
						else {
							return db('Profiles').where('ID', recipientProfileID).first()
								.then(function(recipientProfile){
									if (!recipientProfile) {
										reject('Recipient profile does not exist');
									}
									else {
										var m = {
											SenderProfileID: senderProfileID,
											RecipientProfileID: recipientProfileID,
											Subject: opts.subject,
											Body: opts.body,
											PreviousMessageID: opts.previousMessageID,
											SentDate: new Date()
										};

										return db('Messages').insert(m)
											.then(function(result) {
												m.ID = result[0];

												var n = {
													type: Notification.TYPE.MESSAGE,
													priority: opts.priority || Notification.PRIORITY.HIGH,
													subject: opts.subject,
													body: opts.body2 || '<p>You have received a new message from ' + senderProfile.Name + '</p>',
													messageID: m.ID,
													replyTo: opts.replyTo,
													senderProfileID: senderProfileID
												};
												return Notification.create(recipientProfileID, n)
													.then(function() {
														resolve(m.ID);
													});
											});

									}
								})
						}
					})
					.catch(reject);

			}

		});
	},


	//
	// Replies to an existing message
	//
	reply: function(senderProfileID, messageID, opts) {
		return new Promise(function (resolve, reject) {

		});
	}

};

module.exports = Message;