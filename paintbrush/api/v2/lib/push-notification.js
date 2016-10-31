var config = require('../config'),
	Promise = require('bluebird'),
	//apn = require('apn'),
	//gcm = require('node-gcm'),
	onesignal = require('node-opensignal-api/lib/client').createClient();


//var apnConnection = new apn.Connection({
//	cert: '../cert/aps_development.pem',
//	key: '../cert/aps_development.p12'
//});
//
//var apnFeedback = new apn.Feedback({
//	batchFeedback: true,
//	interval: 1800
//});
//apnFeedback.on("feedback", function(devices) {
//
//	console.log('APN FEEDBACK: ' + JSON.stringify(devices));
//
//	//devices.forEach(function(item) {
//	//	// Do something with item.device and item.time;
//	//});
//});

//var gcmConnection = new gcm.Sender(config.google.cloudMessaging.keys.server);

var Push = {

	//
	// Sends a notification to all push registered devices belonging to a user
	//
	send: function (opts) {
		return new Promise(function (resolve, reject) {

			// check all required params...
			if (!opts.userID && !opts.profileID) {
				reject('Please specify a userID or profileID to send the push notification to');
			}
			else {
				var sendToDevices = function(userIDs) {

					//
					// Find all devices owned by this user set up to receive push notifications
					//
					db('Devices').whereRaw('UserID IN (' + userIDs.join(',') + ') AND OneSignalUserID IS NOT NULL').select()
						.then(function(devices) {

							if (!devices.length) {
								resolve();
							}
							else {

								console.log('PUSHING TO DEVICES: ' + JSON.stringify(devices));

								var params = {
									app_id: config.onesignal.appID,
									headings: { en: opts.subject },
									contents: { 'en': opts.body.substring(0, 180) },
									include_player_ids: devices.map(function(d){
										return d.OneSignalUserID;
									}),
									data: { id: opts.id }
								};
								onesignal.notifications.create(config.onesignal.apiKey, params, function (err, response) {
									if (err) {
										console.log('Encountered error', err);
									} else {
										console.log(response);
									}
								});


								//var tokens = { apn: [], gcm: [] };
								//devices.forEach(function(d) {
								//	if (d.OS === 'iOS') {
								//		tokens.apn.push(d.PushToken);
								//	}
								//	else {
								//		tokens.gcm.push(d.PushToken);
								//	}
								//});
								//
								////
								//// Send using Google Cloud Messaging
								////
								//if (tokens.gcm.length) {
								//
								//	var message = new gcm.Message({
								//		//restrictedPackageName: "com.icmobilelab.artretailnetwork",
								//		notification: {
								//			title: opts.subject,
								//			//icon: "ic_launcher",
								//			body: opts.body
								//		}
								//	});
								//
								//
								//	gcmConnection.send(message, { registrationTokens: tokens.gcm }, function (err, response) {
								//		console.log('GCM: ');
								//
								//		if (err) {
								//			console.error(err);
								//		}
								//		else {
								//			console.log(response);
								//		}
								//	});
								//
								//}
								//
								////
								//// Send using Apple Push Notification Service
								////
								//if (tokens.apn.length) {
								//
								//	tokens.apn.forEach(function(t) {
								//		var device = new apn.Device(t);
								//		var note = new apn.Notification();
								//
								//		note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
								//		note.badge = 3;
								//		note.sound = "ping.aiff";
								//		note.alert = { title: opts.subject, body: opts.body };
								//
								//		//apnConnection.pushNotification(note, device);
								//	})
								//
								//}

								resolve();
							}

						})
						.catch(reject);

				};

				if (opts.userID) {
					sendToDevices([opts.userID]);
				}
				else {
					db.select(db.raw('coalesce(a.UserID, c.UserID, gu.UserID) as ID'))
						.from('Profiles as p')
						.leftJoin('Artists as a', 'a.ProfileID', 'p.ID')
						.leftJoin('Galleries as g', 'g.ProfileID', 'p.ID')
						.leftJoin('GalleryUsers as gu', 'gu.GalleryID', 'g.ID')
						.leftJoin('Consumers as c', 'c.ProfileID', 'p.ID')
						.where('p.ID', opts.profileID)
						.then(function (users) {
							sendToDevices(users.map(function(u) {
								return u.ID;
							}))
						})
				}
			}

		});
	}

};


module.exports = Push;