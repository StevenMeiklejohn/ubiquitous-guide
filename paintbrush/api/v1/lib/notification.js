var Promise = require('bluebird'),
	Socket = require('./../../lib/websocket'),
	UserPreferences = require('./user-preference'),
	Email = require('./../../lib/email'),
	Push = require('./push-notification');

//
// Enums
//
var TYPE = {
	TASK: 1,
	INFORMATION: 2,
	MESSAGE: 3,
	CONNECTION: 4,
	ACTIVCANVAS: 5
};

var PRIORITY = {
	VERYLOW: 1,
	LOW: 2,
	NORMAL: 3,
	HIGH: 4,
	URGENT: 5
};

//
// Util function to return the name for a given enum value
//
var getEnumName = function(_enum, value, toLowerCase) {
	for (var i in _enum) {
		if (_enum[i] === value) {
			return toLowerCase ? i.toLowerCase() : i;
		}
	}
};



//
// This class provides a simple way to create notifications for users
// taking into account any user preferences for notifications
//
var Notification = {

	//
	// Expose enums
	//
	TYPE: TYPE,
	PRIORITY: PRIORITY,


	//
	// Creates a new notification
	//
	create: function(profileID, opts) {
		return new Promise(function (resolve, reject) {

			// check all required params
			if (!profileID) {
				reject('ProfileID is required');
			}
			else if (!opts.type) {
				reject('Notification type is required');
			}
			else if (!opts.subject) {
				reject('Subject is required');
			}
			else if (!opts.body) {
				reject('Body is required');
			}
			else {

				// check type specific required params
				switch (opts.type) {
					case TYPE.MESSAGE:
						if (!opts.messageID) {
							return reject('A message ID is required to create a message notification');
						}
						break;
					case TYPE.TASK:
						if (!opts.taskGroupID) {
							return reject('A task group ID is required to create a task notification');
						}
						break;
				}

				var n = {
					ProfileID: profileID,
					PriorityID: opts.priority || PRIORITY.NORMAL,
					TypeID: opts.type,
					Subject: opts.subject,
					Body: opts.body,
					Sticky: !!opts.sticky,
					SentDate: new Date(),
					TaskGroupID: opts.taskGroupID,
					MessageID: opts.messageID
				};

				db('Notifications').insert(n)
					.then(function(result) {
						n.ID = result[0];

						//
						// Get all users associated with this profile so we can check their individual preferences
						//
						return db.select('u.*').distinct()
							.from('Profiles as p')
							.leftJoin('Artists as a', 'a.ProfileID', 'p.ID')
							.leftJoin('Galleries as g', 'g.ProfileID', 'p.ID')
							.leftJoin('GalleryUsers as gu', 'gu.GalleryID', 'g.ID')
							.leftJoin('Consumers as c', 'c.ProfileID', 'p.ID')
							.leftJoin('Users as u', db.raw('coalesce(a.UserID, gu.UserID, c.UserID)'), 'u.ID')
							.where('p.ID', profileID)
							.then(function(users) {

								var q = [];

								users.forEach(function(user) {
									q.push(
										UserPreferences.get(user.ID, 'notification').then(function(prefs){

											return new Promise(function (resolve) { resolve(); })
												.then(function() {
													if (prefs.desktop.enabled) {
														var userOpts = prefs.desktop[getEnumName(TYPE, opts.type, 1)];

														if (!prefs.desktop.showAdvanced || (userOpts.enabled && opts.priority >= userOpts.threshold)) {
															return db('Notifications').where({ ProfileID: profileID, ReadDate: null, Deleted: 0 }).count('ID as total')
																.then(function(_result) {
																	Socket.emit('notification', { userID: user.ID }, n);
																	Socket.emit('notification/unread', { userID: user.ID}, _result[0].total);
																})
														}
													}
												})
												.then(function () {
													if (prefs.email.enabled) {

														var userOpts = prefs.email[getEnumName(TYPE, opts.type, 1)];
														if (!prefs.email.showAdvanced || (userOpts.enabled && opts.priority >= userOpts.threshold)) {

															// TODO: include notification type specific data (e.g. message body)!
															return Email.send({
																to: user.Email,
																replyTo: opts.replyTo,
																//bcc: 'kris@artretailnetwork.com',
																template: { profileID: opts.senderProfileID },
																subject: opts.subject,
																html: opts.body +
																	(opts.type === TYPE.MESSAGE ? '<p>To reply to this message please click here: <a mc:disable-tracking href="https://members.artretailnetwork.com/inbox/' + n.ID + '">members.artretailnetwork.com</a></p>' : '')
															})

														}

													}
												})
												.then(function () {
													//if (prefs.push && prefs.push.enabled) {

														//return Push.send({
														//	userID: user.ID,
														//	subject: opts.subjectShort || opts.subject,
														//	body: opts.bodyShort || opts.subject
														//});

													//}
												})

										})
									);
								});

								return Promise.all(q);
							})
							.then(function(){
								resolve(n.ID);
							});

					})
					.catch(reject);

			}

		});
	},


	//
	// Marks a notification as read
	//
	read: function(profileID, id) {
		return new Promise(function(resolve, reject) {

			db('Notifications').where({ ID: id }).update('ReadDate', new Date())
				.then(function (){
					return db('Notifications').where({ ProfileID: profileID, ReadDate: null, Deleted: 0 }).count('ID as total')
						.then(function(result){
							Socket.emit('notification/unread', { profileID: profileID }, result[0].total);
							resolve();
						});
				})
				.catch(reject);

		});
	},


	//
	// Marks some old notifications as read
	//
	tidy: function() {
		return new Promise(function(resolve, reject) {

			var week_1 = new Date(new Date().setHours(new Date().getHours() - (24 * 7)));

			db('Notifications')
				.whereRaw('ReadDate is null AND TypeID = ' + TYPE.ACTIVCANVAS)
				.andWhere('SentDate', '<', week_1)
				.update('ReadDate', new Date())
				.then(function (){
					resolve();
				})
				.catch(reject);

		});
	}


};

module.exports = Notification;