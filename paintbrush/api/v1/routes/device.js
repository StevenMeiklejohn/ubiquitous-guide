var router = require('express').Router(),
	AccessToken = require('../../auth/access-token'),
	Device = require('../lib/device'),
	Promise = require('bluebird');


var update = function(id, req, res) {
	AccessToken.getUser(req).then(function(user) {

		db('Devices').where('ID', id).first()
			.then(function (device) {

				if (!device) {
					res.status(404).json({ Message: 'Device not found' })
				}
				else if (device.UserID !== user.UserID) {
					res.status(403).json({ Message: 'You do not have permission to update this device' })
				}
				else {
					return db('Devices').where('ID', id).update({
						TypeID: req.body.TypeID || device.TypeID,
						//OS: req.body.OS || device.OS,
						//Model: req.body.Model || device.Model,
						//AppVersion: req.body.AppVersion || device.AppVersion,
						Locale: req.body.Locale || device.Locale,
						TimeZone: req.body.TimeZone || device.TimeZone,
						Enabled: req.body.Enabled !== undefined ? req.body.Enabled : device.Enabled,
						DeviceModel: req.body.DeviceModel || device.DeviceModel,
						PushToken: req.body.PushToken || device.PushToken
					})
				}

			})
			.then(function() {
				res.json({ Message: 'Success' });
			})
			.catch(function (err) {
				logError(err, req, function () {
					res.status(500).json({ Message: 'Unexpected error occurred' });
				});
			});

	})
};


router

	.get('/current', Device.identify, function(req, res) {
		Device.current(req).then(function(device) {
			res.json(device || {});
		})
		.catch(function (err) {
			logError(err, req, function () {
				res.status(500).json({ Message: 'Unexpected error occurred' });
			});
		})
	})

	.get('/identify', Device.identify, function(req, res) {
		res.json({});
	})

	.get('/identify/login', Device.identifyLogin, function(req, res) {
		res.json({});
	})

	.put('/update', function (req, res) {
		Device.current(req).then(function(device) {
			if (!device) {
				console.log(req);
			}
			update(device.ID, req, res);
		})
	})

	.put('/update/:id', function (req, res) {
		update(req.params.id, req, res);
	})

	.delete('/remove/:id', function (req, res) {

		AccessToken.getUser(req).then(function(user) {

			db('Devices').where('ID', req.params.id).first()
				.then(function (device) {

					if (!device) {
						res.status(404).json({ Message: 'Device not found' })
					}
					else if (device.UserID !== user.UserID) {
						res.status(403).json({ Message: 'You do not have permission to remove this device' })
					}
					else {
						return db('DeviceHistory').where('DeviceID', req.params.id).del()
							.then(function () {
								return db('DeviceBrowsers').where('DeviceID', req.params.id).del()
							})
							.then(function () {
								return db('Devices').where('ID', req.params.id).del();
							})
					}

				})
				.then(function() {
					res.sendStatus(204);
				})
				.catch(function (err) {
					logError(err, req, function () {
						res.status(500).json({ Message: 'Unexpected error occurred' });
					});
				});

		})

	})


	.get('/list', Device.identify, function (req, res) {

		AccessToken.getUser(req).then(function(user) {

			var devices = [];

			db.select(
				'd.ID',
				'd.OS',
				'd.OSVersion',
				'd.Locale',
				'd.TimeZone',
				'd.Enabled',
				'd.Model',
				'd.PushToken',
				'd.TypeID',
				'dt.Type'
			)
			.from('Devices as d')
			.join('DeviceTypes as dt', 'd.TypeID', 'dt.ID')
			.where('UserID', user.UserID)
			.then(function (_devices) {
				var browserQueue = [];

				_devices.forEach(function(device) {
					device.Browsers = [];

					browserQueue.push(
						db.select(
							'ID',
							'Name',
							'Version',
							'Enabled'
						)
						.from('DeviceBrowsers')
						.where('DeviceID', device.ID)
						.then(function(browsers) {
							var historyQueue = [];

							browsers.forEach(function (browser) {
								historyQueue.push(
									db.select(
										'ID',
										'LoginDate',
										'LastAccess',
										'Location',
										'Country'
									)
									.from('DeviceHistory')
									.where('DeviceBrowserID', browser.ID)
									.orderBy('LastAccess', 'desc')
									.then(function(history) {
										if (history[0]){
											browser.LastLogin = history[0].LoginDate;
											browser.LastAccess = history[0].LastAccess;

											if (!device.LastLogin || device.LastLogin < history[0].LoginDate) {
												device.LastLogin = history[0].LoginDate;
											}
											if (!device.LastAccess  || device.LastAccess < history[0].LastAccess) {
												device.LastAccess = history[0].LastAccess;
											}
										}
										browser.History = history;
										device.Browsers.push(browser);
									})
								)
							});

							return Promise.settle(historyQueue)
								.then(function() {
									devices.push(device);
								})
						})

					);
				});
				return Promise.settle(browserQueue);
			})
			.then(function () {

				// Due to use of Promise.settle we need to manually sort the data
				var compare = function(a, b, prop) {
					var da = new Date(b[prop]), db = new Date(a[prop]);
					if (da < db) {
						return -1;
					}
					if (da > db) {
						return 1;
					}
					return 0;
				};

				devices.forEach(function(device) {
					device.Browsers = device.Browsers.sort(function(a, b) {
						return compare(a, b, 'LastAccess');
					});
					device.Browsers.forEach(function(browser) {
						browser.History = browser.History.sort(function(a, b){
							return compare(a, b, 'LastAccess');
						})
					})
				});

				devices = devices.sort(function(a, b) {
					return compare(a, b, 'LastAccess');
				});

				res.json(devices);

			})
			.catch(function (err) {
				logError(err, req, function () {
					res.status(500).json({ Message: 'Unexpected error occurred' });
				});
			})

		})

	})


	.get('/types', function (req, res) {

		db('DeviceTypes').select()
			.then(function (data) {
				res.json(data);
			})
			.catch(function (err) {
				logError(err, req, function () {
					res.status(500).json({ Message: 'Unexpected error occurred' });
				});
			})

	});



module.exports = router;
