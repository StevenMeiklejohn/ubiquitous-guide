var config = require('../config'),
	Promise = require('bluebird'),
	apn = require('apn'),
	gcm = require('node-gcm');


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

var gcmConnection = new gcm.Sender(config.google.cloudMessaging.keys.server);

var Push = {

	//
	// Sends a notification to all push registered devices belonging to a user
	//
	send: function (opts) {
		return new Promise(function (resolve, reject) {

			// check all required params...
			if (!opts.userID) {
				reject('Please specify a userID to send the push notification to');
			}
			else {

				//
				// Find all devices owned by this user set up to receive push notifications
				//
				db('Devices').whereRaw('UserID = ' + opts.userID + ' AND PushToken IS NOT NULL').select()
					.then(function(devices) {

						if (!devices.length) {
							resolve();
						}
						else {

							console.log('PUSHING TO DEVICES: ' + JSON.stringify(devices));

							var tokens = { apn: [], gcm: [] };
							devices.forEach(function(d) {
								if (d.OS === 'iOS') {
									tokens.apn.push(d.PushToken);
								}
								else {
									tokens.gcm.push(d.PushToken);
								}
							});

							//
							// Send using Google Cloud Messaging
							//
							if (tokens.gcm.length) {

								var message = new gcm.Message({
									//restrictedPackageName: "com.icmobilelab.artretailnetwork",
									notification: {
										title: opts.subject,
										//icon: "ic_launcher",
										body: opts.body
									}
								});


								gcmConnection.send(message, { registrationTokens: tokens.gcm }, function (err, response) {
									console.log('GCM: ');

									if (err) {
										console.error(err);
									}
									else {
										console.log(response);
									}
								});

							}

							//
							// Send using Apple Push Notification Service
							//
							if (tokens.apn.length) {

								tokens.apn.forEach(function(t) {
									var device = new apn.Device(t);
									var note = new apn.Notification();

									note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
									note.badge = 3;
									note.sound = "ping.aiff";
									note.alert = { title: opts.subject, body: opts.body };

									//apnConnection.pushNotification(note, device);
								})

							}

							resolve();
						}

					})
					.catch(reject);

			}

		});
	}

};


module.exports = Push;