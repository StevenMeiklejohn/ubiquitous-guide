var Promise = require('bluebird'),
	Socket = require('./../../lib/websocket'),
	UserPreferences = require('./user-preference'),
	Permission = require('./permission'),
	Email = require('./../../lib/email'),
	Push = require('./push-notification'),
	striptags = require('striptags');

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
// Returns all users linked to the specified profile id
//
var getUsers = function (profileID) {
	return db.select('u.*', 'p.ID as ProfileID').distinct()
		.from('Profiles as p')
		.leftJoin('Artists as a', 'a.ProfileID', 'p.ID')
		.leftJoin('Galleries as g', 'g.ProfileID', 'p.ID')
		.leftJoin('GalleryUsers as gu', 'gu.GalleryID', 'g.ID')
		.leftJoin('Consumers as c', 'c.ProfileID', 'p.ID')
		.leftJoin('Users as u', db.raw('coalesce(a.UserID, gu.UserID, c.UserID)'), 'u.ID')
		.where('p.ID', profileID);
};


//
// Util function to send out notifications to user based on preferences & permissions
//
var sendNotification = function (user, notification, opts) {
	return new Promise(function (resolve, reject) {

		UserPreferences.get(user.ID, 'notification').then(function(prefs){

			return new Promise(function (r) { r(); })
					.then(function() {
						if (prefs.desktop.enabled) {
							var userOpts = prefs.desktop[getEnumName(TYPE, opts.type, 1)];

							if (!prefs.desktop.showAdvanced || (userOpts.enabled && opts.priority >= userOpts.threshold)) {
								return db('Notifications').where({ ProfileID: user.ProfileID, ReadDate: null, Deleted: 0 }).count('ID as total')
									.then(function(_result) {
										Socket.emit('notification', { userID: user.ID }, notification);
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
									(opts.type === TYPE.MESSAGE ?
										'<p>To reply to this message ' + (opts.replyTo ? 'just reply to this email or alternatively' : 'please') + ' click here: <a mc:disable-tracking href="https://members.artretailnetwork.com/inbox/' + notification.ID + '">members.artretailnetwork.com</a></p>'
									: '')
								})

							}

						}
					})
					.then(function () {
						//if (prefs.push && prefs.push.enabled) {

						return Push.send({
							id: notification.ID,
							userID: user.ID,
							subject: opts.subjectShort || opts.subject,
							body: opts.bodyShort || striptags(opts.body.replace(/<\/p>/gi, '</p>\n\n').replace(/<br\/>/gi, '\n'))
						});

						//}
					})

		})
		.then(resolve)
		.catch(reject);

	})
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
						return getUsers(profileID)
							.then(function(users) {

								var q = users.map(function (user) {
									return sendNotification(user, n, opts);
								});

								//
								// Also send notification to users that manage this profile
								//
								Permission.Profile.allowed('notification.all', profileID).then(function(profiles) {
									q.concat(profiles.map(function (profileID) {
										return getUsers(profileID).then(function(_users) {
											return Promise.all(_users.map(function (user) {
												return sendNotification(user, n, opts);
											}))
										})
									}))
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
	// Marks some old notifications as read/deleted
	//
	tidy: function() {
		return new Promise(function(resolve, reject) {

			var makeDate = function (days) {
				return new Date(new Date().setHours(new Date().getHours() - (24 * days)))
			};

			var day = makeDate(1),
				week = makeDate(7),
				month = makeDate(30),
				quarter = makeDate(90),
				where = 'TypeID = ' + TYPE.ACTIVCANVAS + ' ';

			Promise.all([
				db('Notifications').whereRaw(where + 'AND PriorityID < 3 AND ReadDate is null').andWhere('SentDate', '<', day).update('ReadDate', new Date()),
				db('Notifications').whereRaw(where + 'AND PriorityID < 3').andWhere('SentDate', '<', week).update('Deleted', 1),
				db('Notifications').where('Deleted', 1).andWhere('SentDate', '<', month).del(),
				db('Notifications').whereRaw(where).andWhere('SentDate', '<', quarter).del()
			])
			.then(function (){
				resolve();
			})
			.catch(reject);

		});
	}


};

module.exports = Notification;