var config = require('../config'),
	Promise = require('bluebird'),
	Transcode = require('./aws-transcoder'),
	Vuforia = require('./vuforia');


var PRIORITY = {
	BACKGROUND: 1,
	NORMAL: 2,
	HIGH: 3
};

var ActivCanvas = {

	//
	// Expose Enums
	//
	PRIORITY: PRIORITY,

	// 
	// Adds a video or artwork to the activation queue
	//
	// If VideoID is specified ArtworkID is optional, if not specified all artwork belonging to the video's profile will be activated
	//
	// If Priority is 'background' no notifications will be sent out while activating this content
	//
	queue: function (opts) { //videoID, artworkID, priority, deactivate) {
		return new Promise(function (resolve, reject) {

			console.log(opts)

			var videoID = opts.videoID,
				artworkID = opts.artworkID,
				priority = opts.priority || PRIORITY.NORMAL,
				deactivate = !!opts.deactivate;


			if (!videoID && !artworkID) {
				reject('Please specify either an ArtworkID or a VideoID');
			}
			else {

				// if this artwork has previously been activated blank tracking rating, set new activation priority
				db('VuforiaTargets').update({ TrackingRating: null, Priority: priority, Deactivate: deactivate }).where('ArtworkID', artworkID)
					 .then(function () {

						 // add missing video transcode records
						 if (videoID && !deactivate) {
							 return Transcode.queue(videoID)
						 }
					 })
					.then(function () {

						if (!artworkID && videoID) {
							return db('Videos').where('ID', videoID).first()
								.then(function(video) {

									if (!video) {
										reject('Video [ID: ' + videoID + '] not found');
									}
									else {

										return db.select('aw.ID')
											.from('Artworks as aw')
											.leftJoin('ArtworkVideos as av', 'aw.ID', 'av.ArtworkID')
											.whereRaw('aw.ArtistProfileID = ' + video.ProfileID + ' AND av.ID IS NULL AND aw.Deleted = 0')
											.then(function(data) {
												var q = [];

												data.forEach(function(aw) {
													q.push(
														db('ActivCanvasQueue')
															.insert({
																VideoID: videoID,
																ArtworkID: aw.ID,
																Transcoded: false,
																Priority: priority,
																Deactivate: deactivate
															})
													);
												});

												return Promise.all(q)
											});

									}

								});

						}
						else {

							return db('ActivCanvasQueue')
								.insert({
									VideoID: videoID,
									ArtworkID: artworkID,
									Transcoded: !videoID ? true : false,
									Priority: priority,
									Deactivate: deactivate
								})
						}

					})
					.then(function () {
						resolve();
					})
					.catch(function(e) {
						reject(e);
					});

			}

		});
	},



	//
	// Processes the ActivCanvas activation queue
	//
	processQueue: function () {
		return new Promise(function (resolve, reject) {

			// process pending transcodes
			Transcode.processQueue()

			// check if any transcodes have finished since last time
			.then(function () {
				var sql =
					'SELECT * FROM (' +
						'SELECT acq.ID, ' +
						'(SELECT COUNT(vtc.ID) FROM VideoTranscodes AS vtc WHERE vtc.VideoID = acq.VideoID AND vtc.Complete = 0 ) AS Pending ' +
						'FROM ActivCanvasQueue as acq ' +
						'WHERE Deactivate = 0 AND Transcoded = 0 ' +
					') AS t WHERE Pending = 0;';

				return db.raw(sql);
			})

			// set Transcoded flag to true for these queue entries 
			.then(function (_complete) {
				var complete = _complete[0];

				var items = [];
				complete.forEach(function (item) {
					items.push(db('ActivCanvasQueue').where({ ID: item.ID }).update({ Transcoded: true }));
				});

				if (items.length) {
					return Promise.settle(items);
				}
			})

			// de-activate targets
			.then(function() {
				return db.select('acq.ID as QueueID', 'acq.ArtworkID', 'acq.Priority', 'acq.UploadAttempts')
					.from('ActivCanvasQueue as acq')
					.join('VuforiaTargets as vt', 'vt.ArtworkID', 'acq.ArtworkID')
					.whereRaw('acq.UploadAttempts < ' + config.activCanvas.maxUploadAttempts + ' AND acq.Deactivate = 1 AND acq.SentToVuforia = 0 AND vt.TargetID IS NOT NULL')
					.orderBy('acq.Priority', 'desc')
					.limit(config.activCanvas.concurrentActivationLimit)
			})
			.then(function (targets) {
				if (targets.length) {
					console.log('\x1b[33mAC\x1b[0m: \x1b[36mDE-ACTIVATING TARGETS\x1b[0m: ' + JSON.stringify(targets));

					var q = [];
					targets.forEach(function(t) {
						q.push(
							db('ActivCanvasQueue').where('ID', t.QueueID).update({ UploadAttempts: t.UploadAttempts + 1 })
								.then(function() {
									Vuforia.deleteTarget(t.ArtworkID, t.Priority < 2)
										.then(function() {
											return db('ActivCanvasQueue').where('ID', t.QueueID).update({ SentToVuforia: true });
										})
								})
						);
					});

					return Promise.all(q);
				}
			})


			// check for previous vuforia targets that have finished processing
			.then(function () {
				var cutOffShort = (new Date(new Date().setSeconds(new Date().getSeconds() - 25))).toISOString(),
					cutOffLong = (new Date(new Date().setMinutes(new Date().getMinutes() - 3))).toISOString(),
					cutOffBackground = (new Date(new Date().setMinutes(new Date().getMinutes() - 10))).toISOString();

				return db.select('ArtworkID', 'Priority').from('VuforiaTargets')
					.whereRaw(
						'Deactivate = 0 AND SyncRequired = 1 AND TargetID IS NOT NULL AND ' +
						'(' +
							'(Priority > 1 AND (' +
								'(TrackingRating IS NULL AND LastUploaded < \'' + cutOffShort + '\') OR ' +
								'(LastUploaded < \'' + cutOffLong + '\')' +
							')) OR ' +
							'(Priority < 2 AND LastUploaded < \'' + cutOffBackground + '\')' +
						')'
					)
					.orderBy('Priority', 'desc');
			})
			.then(function (targets) {
				if (targets.length) {
					console.log('\x1b[33mAC\x1b[0m: \x1b[36mSYNC TARGETS\x1b[0m: ' + JSON.stringify(targets));

					var queue = [];
					targets.forEach(function (target) {
						queue.push(Vuforia.syncTargetStatus(target.ArtworkID, target.Priority));
					});

					return Promise.all(queue);
				}
			})


			// get queue items which are ready to create vuforia target records
			.then(function () {
				return db.select(
					'acq.ArtworkID as ID',
					'acq.ID as QueueID',
					'acq.Priority',
					'acq.VideoID',
					'acq.UploadAttempts'
				)
				.from('ActivCanvasQueue as acq')
				.leftJoin('VuforiaTargets as vt', 'acq.ArtworkID', 'vt.ArtworkID')
				.whereRaw(
					'acq.Transcoded = 1 AND acq.SentToVuforia = 0 AND acq.Deactivate = 0 ' +
					'AND UploadAttempts < ' + config.activCanvas.maxUploadAttempts + ' ' +
					'AND (vt.ID IS NULL or vt.SyncRequired = 0)'
				)
				.orderByRaw('Priority DESC, TargetCreatedDate ASC, ID ASC')
				.limit(config.activCanvas.concurrentActivationLimit)
				.then(function(items){

					// ensure artwork ids are distinct
					var _ids = {};
					return items.filter(function (item) {
						if (_ids[item.ID]) {
							return false;
						}
						_ids[item.ID] = 1;
						return true;
					})
				});
			})

			// create new/update existing vuforia targets
			.then(function (items) {

				if (items.length) {
					console.log('\x1b[33mAC\x1b[0m: \x1b[36mARTWORKS\x1b[0m: ' + JSON.stringify(items));
				}

				var queue = [];
				items.forEach(function (item) {

					queue.push(function() {

						return db('ActivCanvasQueue').where('ID', item.QueueID).update({
							TargetCreatedDate: new Date(),
							UploadAttempts: item.UploadAttempts + 1
						}).then(function () {
							return Vuforia.createTarget(item.ID, item.VideoID)
									.then(function (target) {
										console.log('\x1b[33mAC\x1b[0m: \x1b[36mTARGET ID\x1b[0m: ' + target.TargetID);

										return db('ActivCanvasQueue').where('ID', item.QueueID).update({ VuforiaTargetID: target.ID })
												.then(function() {

													var resetTargetData = function(target_id, reset_rating) {
														var data = {
															LastUploaded: new Date(),
															SyncRequired: true,
															Priority: item.Priority
														};
														if (reset_rating) {
															data.TrackingRating = null;
														}
														if (target_id) {
															data.TargetID = target_id;
														}
														return db('VuforiaTargets').update(data).where('ID', target.ID)
													};

													var addTarget = function () {
														return Vuforia.addTarget(target.Payload)
															.then(function (result) {
																return resetTargetData(result.target_id, true);
															})
															.catch(function (err) {
																var err = err || {};

																if (err.message === 'BadImage' && target.BadImage < 1) {
																	console.error('\x1b[33mAC TARGET ERROR\x1b[0m: BadImage - Will re-process image before next upload attempt');

																	return db('VuforiaTargets').update({ BadImage: target.BadImage + 1 }).where('ID', target.ID)
																		.then(function() {
																			return db('ActivCanvasQueue').where('ID', item.QueueID).update({ UploadAttempts: item.UploadAttempts });
																		})
																}
																else {
																	return db('ActivCanvasQueue').where('ID', item.QueueID).update({ SentToVuforia: true })
																		.then(function () {
																			return db('VuforiaTargets').update({ SyncRequired: false }).where('ID', target.ID);
																		})
																}
															})
													};



													if (target.TargetID) {
														return Vuforia.updateTarget(target.TargetID, target.Payload)
															.then(function () {
																return resetTargetData();
															})
															.catch(function (err) {
																if (err.message === 'UnknownTarget') {
																	return addTarget();
																}
																if (err.message === 'TargetNameExists') {
																	console.log('TargetNameExists:');
																	console.log(target);
																	return err;
																}
																else {
																	return err;
																}
															})
													}
													else {
														return addTarget();
													}
												})
									})
									.then(function () {
										return db('ActivCanvasQueue').where('ID', item.QueueID).update({ SentToVuforia: true });
									})
									.catch(function (err) {
										console.error('ERROR CREATING TARGET');
										throw err;
									})
						})

					});
				});

				if (queue.length) {
					console.log('\x1b[33mAC\x1b[0m: \x1b[36mCREATING TARGETS\x1b[0m: ' + queue.length);

					return Promise.map(queue, function (fn) { return fn(); }, { concurrency: 1 });
				}

			})

			.then(function () {
				resolve();
			})
			.catch(function (err) {
				reject(err);
			});

		});
	}




};


//
// Scheduler
//
var timeout, monitor, lastCheckStart, lastCheckComplete,
	sleepUntil = new Date(); // do not process queue until after this date has passed

var Timeout = function(fn, interval) {
	var self = this;
	self.cleared = false;
	self.run = false;

	var id = setTimeout(function() {
		fn(); self.run = true;
	}, interval);

	self.clear = function () {
		self.cleared = true;
		clearTimeout(id);
	};
};

var scheduleNext = function() {
	if (timeout && timeout.clear && !timeout.run) {
		timeout.clear();
	}
	lastCheckComplete = new Date();
	timeout = new Timeout(checkQueue, config.activCanvas.cycleWaitPeriod * 1000);
};

var sleep = function(hours) {
	var d = new Date();
	if (hours) {
		sleepUntil = new Date(new Date().setHours(new Date().getHours() - hours))
	}
	else {
		sleepUntil = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1, 0, 5, 0 );
	}
	console.log('\x1b[33mAC SCHEDULER\x1b[0m: \x1b[36mSLEEPING UNTIL\x1b[0m: ' + sleepUntil);
};

var checkQueue = function () {
	lastCheckStart = new Date();

	if (sleepUntil > new Date()) {
		scheduleNext();
	}
	else {

		// Check if Vuforia's request limit has been reached for the day
		Vuforia.isThrottled()
			.then(function(throttled) {
				if (throttled) {
					sleep();
					scheduleNext();
				}
				else {
					ActivCanvas.processQueue().then(scheduleNext)
						.catch(function (err) {
							err = err || {};

							console.error('\x1b[33mAC ERROR\x1b[0m: ' + (err.message || JSON.stringify(err)));

							switch (err.message) {
								case 'RequestQuotaReached':
									sleep(4);
									break;
							}

							scheduleNext();
						});
				}
			})
			.catch(scheduleNext);

	}

};


ActivCanvas.scheduler = {

	start: function() {
		if (!timeout) {
			console.log('\x1b[33mAC SCHEDULER\x1b[0m: \x1b[36mSTARTED AT\x1b[0m: ' + new Date());

			//
			// Start running scheduler
			//
			scheduleNext();

			//
			// Set up monitor to restart scheduler if it hasn't run recently and to tidy up old queue entries
			//
			monitor = setInterval(function() {
				var cutOff = new Date().setMinutes(new Date().getMinutes() - 30);

				if (lastCheckStart < cutOff) {
					console.log('\x1b[33mAC SCHEDULER\x1b[0m: \x1b[36mRESTARTED AT\x1b[0m: ' + new Date());
					scheduleNext();
				}

				//
				// Remove old entries
				//
				var cutOffDay = new Date(new Date().setHours(new Date().getHours() - 24));
				var cutOffWeek = new Date(new Date().setHours(new Date().getHours() - (24 * 7)));

				db('ActivCanvasQueue').where('SentToVuforia', true).andWhere('updated_at', '<', cutOffDay).del()
					.then(function(removed1) {
						return db('ActivCanvasQueue').where('updated_at', '<', cutOffWeek).del()
							.then(function(removed2) {
								var removed = removed1 + removed2;

								if (removed) {
									console.log('\x1b[33mAC SCHEDULER\x1b[0m: \x1b[32mCLEARED ' + removed + ' OLD ENTRIES AT\x1b[0m: ' + new Date());
								}
							});
					})

					//
					// Turn off demo video after 1 week
					//
					.then(function () {
						return db('ArtworkVideos').select('ID','ArtworkID')
							.where('VideoID', config.activCanvas.demoVideoID).andWhere('updated_at', '<', cutOffWeek)
							.then(function (artworks) {

								if (artworks.length) {
									console.log('\x1b[33mAC SCHEDULER\x1b[0m: \x1b[32mTURNING OFF DEMO FOR ' + artworks.length + ' ARTWORKS AT\x1b[0m: ' + new Date());

									Promise.all(artworks.map(function (a) {
										return db('ArtworkVideos').where('ID', a.ID).update({ NoVideo: true, VideoID: null })
											.then(function () {
												return ActivCanvas.queue({
													artworkID: a.ArtworkID,
													priority: PRIORITY.BACKGROUND
												})
											})
									}))
									.then(function () {
										console.log('\x1b[33mAC SCHEDULER\x1b[0m: \x1b[32mTURNED OFF DEMO FOR ' + artworks.length + ' ARTWORKS AT\x1b[0m: ' + new Date());
									});
								}


							})
					})
					.catch(function (err) {
						console.error(err);
					})

			}, 30 * 60 * 1000);	// run every 30 mins

		}
	}

};


module.exports = ActivCanvas;