var Promise = require('bluebird'),
	AccessToken = require('../../auth/access-token'),
	useragent = require('useragent'),
	maxmind = require('maxmind');


//
// Returns any devices matching parsed agent details
//
var getDevices = function(agent) {
	return db.select('d.*', 'db.ID as BrowserID', 'db.Name as BrowserName', 'db.Version as BrowserVersion')
		.from('Devices as d')
		.join('DeviceBrowsers as db', 'db.DeviceID', 'd.ID')
		.whereRaw(
			'd.UserID = ' + agent.userID + ' AND d.OS = \'' + agent.os + '\' AND d.OSVersion = \'' + agent.osVersion + '\'' +
			' AND d.Model = \'' + agent.model + '\''
		)
};



var filterDeviceBrowser = function(devices, agent) {
	var device;
	devices.some(function(d) {
		if (d.BrowserName === agent.browser && d.BrowserVersion === agent.browserVersion) {
			device = d;
			return true;
		}
	});
	return device;
};



var Device = {

	//
	// Returns the current device identified from an incoming request
	//
	current: function(req) {
		return new Promise(function (resolve, reject) {
			Device.parseAgent(req)
				.then(function(agent) {
					getDevices(agent)
						.then(function(devices) {
							if (devices.length) {
								var device = filterDeviceBrowser(devices, agent);

								if (device) {
									resolve(device);
								}
								else {
									Device._identify(req, null, function() {
										getDevices(agent).then(function(_devices) {
											resolve(filterDeviceBrowser(_devices, agent));
										});
									})
								}
							}
							else {
								Device._identify(req, null, function() {
									getDevices(agent).then(function(_devices) {
										resolve(filterDeviceBrowser(_devices, agent));
									});
								})
							}
						})
						.catch(function(err) {
							reject(err);
						});
				})
		});

	},


	//
	// Parses user ID and user agent details from an incoming request
	//
	parseAgent: function(req) {
		return new Promise(function (resolve) {
			var promiseQueue = [], userID;

			//
			// Work out user
			//

			// Check for 'username' in post body
			if (req.body && req.body.username) {
				promiseQueue.push(
					db('Users').first().where('Email', req.body.username)
						.then(function(user) {
							if (user) {
								userID = user.ID
							}
						})
				)
			}
			// Check for bearer token
			else if (req.headers.authorization) {
				promiseQueue.push(
					new Promise(function (_resolve) {
						AccessToken.getUser(req).then(function(user) {
							if (user) {
								userID = user.UserID;
							}
							_resolve();
						})
					})
				)
			}

			//
			// Work out device details
			//
			var userAgentString = req.headers['user-agent'],
				userAgent = useragent.lookup(userAgentString),
				os = userAgent.os.family,
				osVersion = userAgent.os.family,
				model = userAgent.device.family,
				browser = userAgent.family,
				browserVersion = userAgent.toVersion(),
				ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress,
				language = (req.headers['accept-language'] || '').replace(/ /g, '').split(/,|;/g)[0],
				typeID = 1;

			//console.log(req.connection);
			//console.log(req.headers);

			if (userAgentString.indexOf('Linux') > -1 && os !== 'Android') {
				os = 'Linux';
			}
			else if (userAgentString.indexOf('Windows') > -1) {
				os = 'Windows';
			}
			var acIdx = userAgentString.indexOf('ActivCanvas');
			if (acIdx > -1) {
				browser = 'ActivCanvas';
				browserVersion = userAgentString.slice(acIdx).split(/\/| /g)[1];
			}
			if (osVersion === 'iOS' && userAgent.os.major) {
				osVersion = 'iOS ' + userAgent.os.major;
			}

			switch(userAgent.device.family) {
				case 'Generic Smartphone':
				case 'iPhone':
					typeID = 2; break;
				case 'Generic Tablet':
				case 'iPad':
					typeID = 3; break;
				default:
					if (userAgentString.toLowerCase().indexOf('mobile') > -1) {
						typeID = 2;
					}
					break;
			}

			Promise.settle(promiseQueue)
				.then(function() {
					//console.log('USERID: ' + userID);
					//console.log('USERAGENT: ' + JSON.stringify(userAgent));
					//console.log('USERAGENTST: ' + userAgentString);
					//console.log('IP: ' + ip);

					if (!userID || !userAgent) {
						resolve();
					}
					else {
						resolve({
							userID: userID,
							os: os,
							osVersion: osVersion,
							model: model,
							browser: browser,
							browserVersion: browserVersion,
							ip: ip,
							language: language,
							typeID: typeID
						})
					}
				})

		});
	},

	//
	// Identifies device and user from incoming requests
	//
	identify: function (req, res, next) {
		Device._identify(req, res, next, false);
	},

	identifyLogin: function (req, res, next) {
		Device._identify(req, res, next, true);
	},

	//
	// Identifies device and user from incoming requests, logs details to database
	//
	_identify: function(req, res, next, isLogin) {

		Device.parseAgent(req)
			.then(function(agent) {

				if (!agent) {
					next();
				}
				else {

					var deviceID, deviceBrowserID;

					getDevices(agent)
						.then(function(devices) {

							//
							// Add new device
							//
							if (!devices.length) {
								return db('Devices').insert({
										UserID: agent.userID,
										TypeID: agent.typeID,
										OS: agent.os,
										OSVersion: agent.osVersion,
										Enabled: true,
										Locale: agent.language,
										Model: agent.model
									})
									.then(function(result) {
										deviceID = result[0];

										return db('DeviceBrowsers').insert({
											DeviceID: deviceID,
											Name: agent.browser,
											Version: agent.browserVersion
										})
									})
									.then(function(result) {
										deviceBrowserID = result[0];
									})
							}

							//
							// Work out if a different browser has been used
							//
							else {

								//
								// For the time being assume any device with the same OS/OS Version belonging to the same user is the same device
								//
								deviceID = devices[0].ID;

								var device = filterDeviceBrowser(devices, agent);
								deviceBrowserID = (device || {}).BrowserID;

								if (!deviceBrowserID) {
									return db('DeviceBrowsers').insert({
											DeviceID: deviceID,
											Name: agent.browser,
											Version: agent.browserVersion
										})
										.then(function(result) {
											deviceBrowserID = result[0];
										})
								}
							}

						})

						//
						// Record device login
						//
						.then(function() {

							var ip4 = agent.ip.length < 16 ? agent.ip : null,
								ip6 = agent.ip.length > 16 ? agent.ip : null,
								geo = {};

							try {
								if (ip4) {
									maxmind.init(__dirname + '/../../geo-db/GeoLiteCity.dat');
									geo = maxmind.getLocation(ip4);

									if (ip4 === '217.205.210.82') {	// TWB
										geo.city = 'Glasgow'
									}
								}
								else if (ip6) {
									maxmind.init(__dirname + '/../../geo-db/GeoLiteCityv6.dat');
									geo = maxmind.getLocation(ip6);
								}
							}
							catch(e) {}

							var addHistory = function () {
								return db('DeviceHistory').insert({
									DeviceID: deviceID,
									DeviceBrowserID: deviceBrowserID,
									LoginDate: new Date(),
									LastAccess: new Date(),
									Location: (geo || {}).city || '',
									Country: (geo || {}).countryName || '',
									IPv4: ip4,
									IPv6: ip6
								})
							};

							if (isLogin) {
								// insert new history record
								return addHistory();
							}
							// update LastAccess value for most recent history entry
							else {
								return db.first()
									.from('DeviceHistory')
									.where({DeviceID: deviceID, DeviceBrowserID: deviceBrowserID})
									.orderBy('LoginDate', 'desc').orderBy('LastAccess', 'desc')
									.then(function(entry) {
										if (entry) {
											return db('DeviceHistory').where('ID', entry.ID).update({ LastAccess: new Date() });
										}
										else {
											return addHistory();
										}
									})
							}

						})
						.then(function() {
							next();
						})
						.catch(function(err) {
							console.error(err);
							next();
						})


				}

			})

	}
};


module.exports = Device;