var config = require('../config'),
	vuforia = require('vuforiajs'),
	im = require("imagemagick"),
	fs = require('fs'),
	url = require('url'),
	http = require('http'),
	uuid = require('node-uuid'),
	moment = require('moment'),
	Notification = require('./notification'),
	Permission = require('./permission'),
	Socket = require('./../../lib/websocket'),
	extend = require('extend'),
	Promise = require('bluebird');


// init client with valid credentials
var client = vuforia.client({
	accessKey: config.vuforia.accessKey,
	secretKey: config.vuforia.secretKey
});

// util for base64 encoding and decoding
var util = vuforia.util();

//
// Creates notifications for a handful of vuforia events
//
var notify = {

	//
	// Notify user that a target has been deleted/deactivated
	//
	deactivated: function(artworkID) {
		return db.first(
			'a.ID',
			'p.ID as ProfileID',
			'a.Name'
		)
		.from('Artworks as a')
		.join('Profiles as p', 'a.ArtistProfileID', 'p.ID')
		.where('a.ID', artworkID)
		.then(function(artwork) {
			return Notification.create(artwork.ProfileID, {
				subject: 'Artwork ' + artwork.Name + ' has been de-activated',
				body:
				'<p>One of your artworks has been de-activated for ActivCanvas.</p>' +
				'<h4>Details:</h4>' +
				'<div class="bullet-list">' +
					'<div class="list-item">' +
						'<span><span class="bullet green"></span></span>' +
						'<span class="text"><span class="label">Artwork:</span> ' + artwork.Name + '</span>' +
					'</div>' +
					'<div class="list-item">' +
						'<span><span class="bullet green"></span></span>' +
						'<span class="text"><span class="label">De-Activation Date:</span> ' + moment().format('Do MMM YYYY HH:mm') + '</span>' +
					'</div>' +
				'</div>',
				type: Notification.TYPE.ACTIVCANVAS,
				priority: Notification.PRIORITY.LOW
			})
		});
	},


	//
	// Notify user that one of their artworks is a duplicate target
	//
	duplicate: function(artworkID, targets) {

		//
		// Returns artwork details if known for the specified vuforia target id
		//
		var getTargetDetails = function(targetID) {
			return new Promise(function (resolve) {
				db.first(
					'a.ID',
					'a.Name',
					'p.ID as ProfileID',
					'p.Name as ProfileName'
				)
				.from('VuforiaTargets as vt')
				.join('Artworks as a', 'vt.ArtworkID', 'a.ID')
				.join('Profiles as p', 'a.ArtistProfileID', 'p.ID')
				.where('vt.TargetID', targetID)
				.then(resolve)
				.catch(function() { resolve(); });
			});
		};


		return new Promise(function (resolve, reject) {

			// Get artwork details for the target that was just created
			db.first(
				'a.ID',
				'a.Name',
				'p.ID as ProfileID',
				'p.Name as ProfileName'
			)
			.from('Artworks as a')
			.join('Profiles as p', 'a.ArtistProfileID', 'p.ID')
			.where('a.ID', artworkID)
			.then(function(artwork) {

				var queue = [];
				targets.forEach(function(targetID) {
					queue.push(getTargetDetails(targetID));
				});

				Promise.settle(queue)
					.then(function(results) {

						var body ='<p>A duplicate image was detected while trying to enable <strong><a mc:disable-tracking href="' + config.site.baseURL + '/artwork/' + artwork.ID + '">' + artwork.Name + '</a></strong> for ActivCanvas.</p>' +
							'<p>This artwork has been automatically deactivated to prevent a conflict with the existing artwork.</p>' +
							'<h4>Duplicate Details:</h4>' +
							'<div class="bullet-list">';

						results.forEach(function(result) {
							var _details = result._settledValue || {};

							body +=
								'<div class="list-item">' +
									'<span><span class="bullet green"></span></span>' +
									'<span class="text"><span class="label">Artwork Name:</span> ' +
										(_details.Name ? '<a mc:disable-tracking href="' + config.site.baseURL + '/artwork/' + _details.ID + '">' + _details.Name + '</a>' :  'Unknown') +
									'</span>' +
								'</div>' +
								'<div class="list-item">' +
									'<span><span class="bullet green"></span></span>' +
									'<span class="text"><span class="label">Artist Name:</span> ' +
										(_details.ProfileID ? '<a mc:disable-tracking href="' + config.site.baseURL + '/profile/' + _details.ProfileID + '">' + _details.ProfileName + '</a>' : 'Unkown') +
									'</span>' +
								'</div>';
						});

						body += '</div>' +
							'<h4>Common Causes:</h4>' +
							'<p><strong>Artwork is a duplicate</strong> - this image has already been activated before.</p>' +
							'<p><strong>Artwork is framed</strong> - if the artwork has been photographed with the outer frame visible this causes problems for the image recognition software.</p>' +
							'<p>Cropping your image to remove the frame will generally resolve this issue.</p>' +
							'<p><strong>Artwork is very similar</strong> - the image recognition software processes images in greyscale and works by identifying high contrast points.</p>' +
							'<p>If you have multiple images that are identical but only differ in colour it may not be possible to differentiate between the images.</p>' +
							'<h4>Need Assistance?</h4>' +
							'<p><strong>Please contact us at <a mc:disable-tracking href="mailto:hello@artretailnetwork.com">hello@artretailnetwork.com</a> if you are unsure how to resolve this issue.</strong></p>';

						return Notification.create(artwork.ProfileID, {
							subject: 'Artwork ' + artwork.Name + ' is a duplicate',
							body: body,
							type: Notification.TYPE.ACTIVCANVAS,
							priority: Notification.PRIORITY.HIGH
						})
						.then(resolve);
					})

			})
			.catch(reject);

		});

	},


	//
	// Notify user that a new target has been created
	//
	success: function(artworkID, trackingRating) {
		return db.first(
			'a.ID',
			'p.ID as ProfileID',
			'a.Name',
			'v.Name as VideoName',
			'vp.Name as DefaultVideoName'
		)
		.from('Artworks as a')
		.leftJoin('ArtworkVideos as av', 'av.ArtworkID', 'a.ID')
		.leftJoin('Videos as v', 'av.VideoID', 'v.ID')
		.join('Profiles as p', 'a.ArtistProfileID', 'p.ID')
		.leftJoin('Videos as vp', 'p.VideoID', 'vp.ID')
		.where('a.ID', artworkID)
		.then(function(artwork) {
			return Notification.create(artwork.ProfileID, {
				subject: 'Artwork ' + artwork.Name + ' has been activated',
				body:
					(
						trackingRating > 1 ?
							'<p>One of your artworks has been successfully enabled for ActivCanvas.</p>' :
						trackingRating > 0 ?
							'<p>One of your artworks has been successfully enabled for ActivCanvas but unfortunately has low tracking rating. This means it should still work but may be harder for the ActivCanvas app to recognise the artwork, particularly if the artwork is displayed in poor lighting conditions or has a highly reflective surface.</p>' :
							'<p>Unfortunately one of your artworks could not be enabled for ActivCanvas, the image did not contain enough track-able features (high contrast points) for our image recognition software to recognise.</p>'
					) +
					'<h4>Details:</h4>' +
					'<div class="bullet-list">' +
						'<div class="list-item">' +
							'<span><span class="bullet green"></span></span>' +
							'<span class="text"><span class="label">Artwork:</span> <a mc:disable-tracking href="' + config.site.baseURL + '/artwork/' + artwork.ID + '">' + artwork.Name + '</a></span>' +
						'</div>' +
						'<div class="list-item">' +
							'<span><span class="bullet green"></span></span>' +
							'<span class="text"><span class="label">Video:</span> ' + (artwork.VideoName || artwork.DefaultVideoName || 'None') + '</span>' +
						'</div>' +
						'<div class="list-item">' +
							'<span><span class="bullet ' + (trackingRating > 1 ? 'green': 'red') + '"></span></span>' +
							'<span class="text rating"><span class="label">Tracking Rating:</span><span class="number">' + trackingRating + '/5</span>' +
							'<i class="fa fa-star' + (trackingRating < 1 ? '-o': '') + '"></i>' +
							'<i class="fa fa-star' + (trackingRating < 2 ? '-o': '') + '"></i>' +
							'<i class="fa fa-star' + (trackingRating < 3 ? '-o': '') + '"></i>' +
							'<i class="fa fa-star' + (trackingRating < 4 ? '-o': '') + '"></i>' +
							'<i class="fa fa-star' + (trackingRating < 5 ? '-o': '') + '"></i>' +
							'</span>' +
						'</div>'  +
						'<div class="list-item">' +
							'<span><span class="bullet green"></span></span>' +
							'<span class="text"><span class="label">Activation Date:</span> ' + moment().format('Do MMM YYYY HH:mm') + '</span>' +
						'</div>' +
					'</div>',
				type: Notification.TYPE.ACTIVCANVAS,
				priority: trackingRating < 1 ? Notification.PRIORITY.HIGH : Notification.PRIORITY.LOW
			})
		});
	}

};

//
// Broadcasts an activation processing message via websocket
//
var broadcast = function (artworkID, data) {
	return new Promise(function (resolve) {
		var profileIDs = [];	// list of profiles to broadcast message to

		db('Artworks').first('ArtistProfileID', 'OwnerProfileID').where({ ID: artworkID })
			.then(function(artwork) {
				profileIDs = [ artwork.ArtistProfileID, artwork.OwnerProfileID ];

				Permission.Profile.allowed('artwork.add', artwork.ArtistProfileID).then(function(allowed) {
					profileIDs = profileIDs.concat(allowed);

					Permission.getAdminProfileIDs().then(function (admins) {
						profileIDs = profileIDs.concat(admins);

						db('VuforiaTargets').first('TrackingRating','InitialTrackingRating','AdjustedContrast','AdjustedContrastOverride')
							.where({ ArtworkID: artworkID })
							.then(function (target) {
								data.ArtworkID = artworkID;

								Socket.emit('artwork/activation', { profileID: profileIDs }, extend(true, (target || {}), data));
								resolve();
							})
					})
				})
			})
	})
};



//
// Keeps track of the request count for today
//
var RequestCount = {

	// request counters
	total: 0,
	errors: 0,

	// keep note of db records primary key and when we should renew this
	dbRecordID: -1,
	dbValidTo: new Date(),

	// increments count by 1
	increment: function(isError) {
		this.total += 1;
		if (isError) {
			this.errors += 1;
		}

		db('VuforiaRequests').where('ID', RequestCount.dbRecordID)
			.update({
				TotalRequests: RequestCount.total,
				FailedRequests: RequestCount.errors
			})
			.catch(function(e) {
				console.error(e);
			});
	},

	// returns today's record from db
	checkDbRecord: function () {
		return new Promise(function (resolve, reject) {

			var d = new Date();

			if (RequestCount.dbRecordID > -1 && RequestCount.dbValidTo > d) {
				resolve();
			}
			else {
				RequestCount.total = 0;
				RequestCount.errors = 0;

				//
				// Ensure there is a request count record defined for today
				//
				db('VuforiaRequests').orderBy('Date', 'desc').first()
					.then(function(exists) {
						if (!exists) {
							return db('VuforiaRequests').insert({ Date: d })
						}
						else {
							// check if same day
							if (!(exists.Date.getFullYear() === d.getFullYear() && exists.Date.getMonth() === d.getMonth() && exists.Date.getDate() === d.getDate() )) {
								return db('VuforiaRequests').insert({ Date: d });
							}
							else {
								RequestCount.total = exists.TotalRequests;
								RequestCount.errors = exists.FailedRequests;
								return [exists.ID];
							}

						}
					})
					.then(function(result) {
						RequestCount.dbRecordID = result[0];
						RequestCount.dbValidTo = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1, 0, 0, 0 );
						resolve();
					})
					.catch(reject);
			}

		});

	}

};

var Vuforia = {

	//
	// Determines if we have reached our request limit for the day
	//
	isThrottled: function () {
		return new Promise(function (resolve, reject) {

			RequestCount.checkDbRecord()
				.then(function() {
					resolve(RequestCount.total >= config.vuforia.maxRequestPerDay);
				})
				.catch(reject);

		});
	},

	//
	// Returns a base64 encoded copy of an image, the image will be scaled down if it is greater than 2Mb
	//
	getEncodedImage: function(uri, forceScale, adjustedContrast, lowMemoryMode) {
		return new Promise(function (resolve, reject) {

			try {
				var urlData = url.parse(uri);

				http.get({ host: urlData.host, port: urlData.port, path: urlData.path }, function (res) {
					var data = [];

					res.on('data', function (chunk) {
						data.push(chunk);
					}).on('end', function () {

						var buffer = Buffer.concat(data),
							size = buffer.length,
							limit = config.vuforia.maxFileSize;


						if (!forceScale && !adjustedContrast && size < limit) {
							resolve(buffer.toString('base64'));
						}
						else {

							// use imagemagick.identify to get image dimensions
							// - since identify only accepts a path write buffer to a temp file
							// - once identified delete temp file
							// pass buffer into imagemagick.resize

							var ext = urlData.path.split('.').pop().toLowerCase(),
								tempFileName = config.proxy.cachePath + '/' + uuid.v4(),
								tempFile = tempFileName + '.' + ext;


							// removes temp file
							var removeTempFile = function (path, complete) {
								fs.unlink(path, function () {
									complete();
								});
							};


							fs.writeFile(tempFile, buffer, 'binary', function () {

								var identify = function (path) {
									im.identify(path, function (err, features) {

										// recursively scales buffered images area by a specific percentage
										// resolves promise with encoded image once the filesize is below the limit
										var scaleImage = function (perc) {

											if (perc < 1) {
												reject(new Error('Cannot scale image to less than 1 percent of resolution'));
											}
											else {

												var newWidth = Math.round((features.width * Math.sqrt(perc / 100)));
												if (newWidth > config.vuforia.maxWidth) {
													newWidth = config.vuforia.maxWidth;
												}
												var opts = { width: newWidth, height: config.vuforia.maxHeight, quality: 0.8, srcData: buffer},
														cArgs = [];

												if (adjustedContrast) {
													cArgs = cArgs.concat(['-brightness-contrast', '5']);
												}
												switch(adjustedContrast) {
													case 1: cArgs = cArgs.concat(['-sigmoidal-contrast', '3x50%']); break;
													case 2: cArgs = cArgs.concat(['-sigmoidal-contrast', '4x50%']); break;
													case 3: cArgs = cArgs.concat(['-sigmoidal-contrast', '5x50%']); break;
													case 4: cArgs = cArgs.concat(['-sigmoidal-contrast', '6x50%']); break;
													case 5: cArgs = cArgs.concat(['-sigmoidal-contrast', '7x50%']); break;
													case 6: cArgs = cArgs.concat(['-sigmoidal-contrast', '8x50%']); break;
												}
												opts.customArgs = cArgs;

												try {
													im.resize(opts, function (err, stdout) {
														if (err) {
															reject(err);
														}
														else {
															if (stdout.length > limit) {
																scaleImage(perc - 5);
															}
															else {
																resolve(new Buffer(stdout, 'binary').toString('base64'));
															}
														}
													})
												}
												catch (e) {
													scaleImage(perc - 5);
												}

											}
										};

										removeTempFile(path, function () {
											if (err) {
												reject(err);
											}
											else {
												scaleImage(size < limit ? 100 : 90);
											}
										});

									});
								};


								// if imagemagicks memory buffer was exceeded last time scale down temp file then read into buffer
								if (lowMemoryMode) {
									console.log('LOW MEMORY MODE...')

									var tempFile2 = tempFileName + '_1.' + ext;

									var opts = {
										'width': 900,
										'height': 900,
										srcPath: tempFile,
										dstPath: tempFile2
									};
									try {
										im.resize(opts, function (err) {
											if (err) {
												reject(err);
											}
											else {
												fs.readFile(tempFile2, { encoding: 'binary' }, function (err, data ) {
													if (err) {
														reject(err);
													}
													else {
														buffer = data;
														size = buffer.length;

														removeTempFile(tempFile, function () {
															identify(tempFile2);
														});
													}
												});
											}
										})
									}
									catch (e) {
										reject(e);
									}
								}
								else {
									identify(tempFile);
								}

							})

						}

					});
				})
				.on('error', reject);

			}
			catch (e) {
				reject(e);
			}
			

		});
	},


	//
	// Generates a metadata package for the specified artwork
	//
	generateMetadata: function (artworkID, videoID) {
		return new Promise(function (resolve, reject) {

			// grab artwork from db
			// grab vuforia target record from db
			// grab transcode records
			// return metadata package

			db.first(
				'aw.*',
				'p.Name as ArtistName',
				'p.ActivCanvasLink as Link',
				'p.ActivCanvasLinkText as LinkText',
				'ast.AutoPlay'
			)
			.from('Artworks as aw')
			.join('Profiles as p', 'aw.ArtistProfileID', 'p.ID')
			.leftJoin('ActivCanvasSettings as ast', 'ast.ProfileID', 'p.ID')
			.where({ 'aw.ID': artworkID })
			.then(function (artwork) {

				if (!artwork) {
					reject('Artwork Not Found');
				}
				else {

					// default auto play to true
					if (artwork.AutoPlay === undefined) {
						artwork.AutoPlay = true;
					}

					var target;

					return db.first('*')
						.from('VuforiaTargets')
						.where({ ArtworkID: artworkID })
						.then(function (_target) {
							target = _target || {};

							// use passed in videoID if present
							if (videoID) {
								return { ID: videoID }
							}
							//
							//// try get artwork specific video
							//return db.first('VideoID as ID')
							//	.from('ArtworkVideos')
							//	.where({ 'ArtworkID': artworkID })
							//	.orderBy('Priority', 'asc')
							//	.then(function (video) {
							//
							//		// try get default profile video if artwork specific video is not defined
							//		if (!video) {
							//			return db.first('p.VideoID as ID')
							//				.from('Artworks as aw')
							//				.join('Profiles as p', 'aw.ArtistProfileID', 'p.ID')
							//				.where({ 'aw.ID': artworkID });
							//		}
							//		else {
							//			return video;
							//		}
							//
							//	})
		
						})

						// get transcode records for the current video
						.then(function (video) {

							if (!video || !video.ID) {
								//reject('Artwork has no video content associated.');

								resolve({
									title: artwork.Name + ' by ' + artwork.ArtistName,
									id: target.ID || -1,
									artworkID: artworkID,
									link_url: artwork.Link || target.Link || undefined,
									link_title: artwork.LinkText || target.LinkText || undefined,
									buttons: []
								});

							}
							else {
								return db.select('vt.VideoURI', 'vtt.Type')
								.from('VideoTranscodes as vt')
								.join('VideoTranscodeTypes as vtt', 'vt.TypeID', 'vtt.ID')
								.where({ VideoID: video.ID })
								.then(function (transcodes) {

									var url, hsl_url;
									transcodes.forEach(function (tc) {
										switch (tc.Type) {
											case 'HLS': hsl_url = tc.VideoURI; break;
											case 'MP4': url = tc.VideoURI; break;
										}
									});

									resolve({
										title: artwork.Name + ' by ' + artwork.ArtistName,
										id: target.ID || -1,
										artworkID: artworkID,
										link_url: artwork.Link || target.Link || undefined,
										link_title: artwork.LinkText || target.LinkText || undefined,
										buttons: [{
											type: 'video',
											videoID: video.ID,
											hls_url: hsl_url,
											url: url,
											title: 'Play',
											autotrigger: !!artwork.AutoPlay
										}]
									});

								})

							}

						});
					
				}

			})
			.catch(reject);

		});
	},


	//
	// Creates a target object for the specified artwork
	//
	createTarget: function (artworkID, videoID) {

		// lookup artwork

		// check if target record has already been created
		// - if not create one so we can reference the id

		// check image is within size limit
		// encode image
		// generate and encode metadata

		// returns { ID: 1, Payload: {} }

		return new Promise(function (resolve, reject) {

			db.first(
				'aw.*',
				'p.Name as ArtistName'
			)
			.from('Artworks as aw')
			.join('Profiles as p', 'aw.ArtistProfileID', 'p.ID')
			.where({ 'aw.ID': artworkID })
			.then(function (artwork) {

				if (!artwork) {
					reject('Artwork Not Found');
				}
				else {

					return db.first('*')
					.from('VuforiaTargets')
					.where({ ArtworkID: artworkID })
					.then(function (target) {

						var env = process.env.NODE_ENV;

						var name = (env === 'production' ? '' : env.toUpperCase().substr(0,3) + '_' )
								+ (artwork.ArtistName.substr(0, 20) + '_' + artwork.Name.substr(0, 25) + '_' + artworkID).replace(/ /g, '-').replace(/[^\x00-\x80]/g, '');

						if (target) {
							target.Name = name;
							return target;
						}
						else {
							target = {
								ArtworkID: artworkID,
								Name: name,
								Width: 200,
								BadImage: 0
							};

							return db('VuforiaTargets').insert(target)
							.then(function (result) {
								target.ID = result[0];
								return target;
							});
						}

					})
					.then(function (target) {
						return broadcast(artworkID, {
							SyncRequired: true,
							Activated: false,
							TargetStatus: 'processing'
						})
						.then(function () {
							return target;
						})
					})
					.then(function (target) {

						return Vuforia.generateMetadata(artworkID, videoID)
							.then(function (metadata) {
								target.Metadata = JSON.stringify(metadata);

								var adjustedContrastLevel = target.AdjustedContrastOverride !== null ? target.AdjustedContrastOverride : target.AdjustedContrast;

								return Vuforia.getEncodedImage(artwork.ImageURI, target.BadImage, adjustedContrastLevel, target.BufferExceeded)
									.then(function (image) {
										
										return db('VuforiaTargets').update(target)
											.where('ID', target.ID)
											.then(function () {

												resolve({
													ID: target.ID,
													TargetID: target.TargetID,
													BadImage: target.BadImage,
													Payload: {
														name: target.Name,
														width: target.Width,
														image: image,
														active_flag: true,
														application_metadata: util.encodeBase64(target.Metadata)
													}
												});

											});

										
									})
									.catch(function (err) {
										err = err || {};
										if (err.bufferExceeded) {
											console.error('BUFFER EXCEEDED');
											return db('VuforiaTargets').update({ BufferExceeded: true }).where('ID', target.ID)
												.then(function () {
													throw err;
												})
										}
										else {
											throw err;
										}
									})
							})
						

					})

				}

			})
			.catch(reject)
			

		});

	},


	//
	//	Adds a new target to vuforia
	//
	addTarget: function (target) {
		return new Promise(function (resolve, reject) {

			client.addTarget(target, function (error, result) {
				RequestCount.increment(error);
				
				if (error) {
					console.error(error);
					reject(error);
				} else {
					resolve(result);
				}
			});

		});
	},


	//
	//	Updates an existing target
	//
	updateTarget: function (targetID, target) {
		return new Promise(function (resolve, reject) {

			client.updateTarget(targetID, target, function (error, result) {
				RequestCount.increment(error);

				if (error) {
					console.error(error);
					reject(error);
				} else {
					resolve(result);
				}
			});

		});
	},


	//
	//	Removes a target from vuforia
	//
	deleteTarget: function (artworkID, silent) {
		return new Promise(function (resolve, reject) {

			db.first()
			.from('VuforiaTargets')
			.where({ ArtworkID: artworkID })
			.then(function (target) {

				if (!target || !target.TargetID) {
					reject('VuforiaTarget not found');
				}
				else {
					var tidyRecords = function() {
						return db('Artworks').where('ID', artworkID).update({ ActivCanvasEnabled: 0 })
							.then(function () {
								return db('VuforiaTargets').where('ArtworkID', artworkID).del();
							})
							.then(function () {
								return db('ArtworkVideos').where('ArtworkID', artworkID).del();
							})
							.then(function () {
								if (!silent) {
									return notify.deactivated(artworkID);
								}
							})
							.then(function () {
								resolve();
							})
							.catch(reject);
					};

					client.deleteTarget(target.TargetID, function (err) {
						RequestCount.increment(err);

						if (err) {
							console.error('\x1b[33mVUFORIA ERROR\x1b[0m: ' + err.message);

							if (err.message === 'UnknownTarget') {
								tidyRecords();
							}
							else {
								reject(err);
							}
						}
						else {
							tidyRecords();
						}

					});
				}

			})
			.catch(reject);

		});

	},


	//
	//	Retrieves a target from vuforia
	//
	getTarget: function (artworkID) {
		return new Promise(function (resolve, reject) {

			db.first('ID', 'TargetID', 'TrackingRating', 'InitialTrackingRating', 'AdjustedContrast', 'AdjustedContrastOverride')
			.from('VuforiaTargets')
			.where({ ArtworkID: artworkID })
			.then(function (target) {

				client.retrieveTarget(target.TargetID, function (error, result) {
					RequestCount.increment(error);

					if (error) {
						reject(error);
					} else {
						var _target = result.target_record;

						_target.id = target.ID;
						_target.status = result.status.toLowerCase();
						_target.previous_tracking_rating = target.TrackingRating;
						_target.initial_tracking_rating = target.InitialTrackingRating === null ? _target.tracking_rating : target.InitialTrackingRating;
						_target.adjusted_contrast = target.AdjustedContrast;
						_target.adjusted_contrast_override = target.AdjustedContrastOverride;

						resolve(_target);
					}

				});
				
			});

		});
	},



	//
	//	Updates database with the current vuforia status and rating of a target
	//
	syncTargetStatus: function (artworkID, priority) {
		return new Promise(function (resolve, reject) {
			var silent = priority < 2;

			Vuforia.getTarget(artworkID)
				.then(function (target) {

					return db('VuforiaTargets')
						.where({ ID: target.id })
						.update({
							Active: target.active_flag,
							TrackingRating: target.tracking_rating,
							InitialTrackingRating: target.initial_tracking_rating,
							RecoRating: target.reco_rating,
							Name: target.name,
							Width: target.width,
							SyncRequired: target.status === 'processing'
						})
						.then(function () {

							// if successful create notification
							if (target.status === 'success') {

								// check if this is a duplicate target
								// - yes: de-activate and warn user
								// - no: create success notification

								return Vuforia.duplicateTargets(target.target_id)
									.then(function(duplicates) {
										if (duplicates.similar_targets.length) {

											return broadcast(artworkID, {
												TrackingRating: null,
												InitialTrackingRating: null,
												SyncRequired: false,
												TargetStatus: 'duplicate',
												Activated: false
											})
											.then(function() {

												if (silent) {
													return Vuforia.deleteTarget(artworkID, silent);
												}
												else {
													return notify.duplicate(artworkID, duplicates.similar_targets)
														.then(function(){
															return Vuforia.deleteTarget(artworkID, true);
														});
												}

											});

										}
										else {

											// Reduces upload attempt count on queue entry by 1 to allow an additional contrast adjustment
											var resetQueueEntry = function() {
												return db('ActivCanvasQueue').first('ID', 'UploadAttempts')
													.where({ VuforiaTargetID: target.id })
													.orderBy('TargetCreatedDate', 'desc')
													.then(function(queue) {
														if (queue) {
															return db('ActivCanvasQueue').where('ID', queue.ID)
																.update({ SentToVuforia: false, UploadAttempts: queue.UploadAttempts - 1 });
														}
													})
											};

											//
											// Evaluate tracking rating from last target update
											//
											var initialRating = target.initial_tracking_rating,
												previousRating = target.previous_tracking_rating,
												currentRating = target.tracking_rating,
												adjusted = target.adjusted_contrast;

											//
											//	If current rating is lower than previous adjustment then set override to (adjusted - 1)
											//
											if (currentRating < previousRating && adjusted > 0) {
												return db('VuforiaTargets')
													.where({ ID: target.id })
													.update({ AdjustedContrastOverride: target.adjusted_contrast - 1, SyncRequired: false })
													.then(resetQueueEntry);
											}
											//
											//	Otherwise determine if we should try adjusting contrast an additional time
											//
											else if (
													(initialRating === 0 &&
															(adjusted < 2 && currentRating < 3) ||
															(adjusted < 3 && currentRating < 2) ||
															(adjusted < 4 && currentRating < 1)
													) ||
													(initialRating === 1 &&
															(adjusted < 2) ||
															(adjusted < 3 && currentRating < 2)
													) ||
													(initialRating === 2 &&
															(adjusted < 1) ||
															(adjusted < 2 && currentRating < 3)
													) ||
													(initialRating === 3 &&
															(adjusted < 1) ||
															(adjusted < 2 && currentRating < 4)
													) ||
													(initialRating === 4 &&
															(adjusted < 1) ||
															(adjusted < 2 && currentRating < 5)
													)
											) {
												return db('VuforiaTargets')
													.where({ ID: target.id })
													.update({ AdjustedContrast: target.adjusted_contrast + 1, SyncRequired: false })
													.then(resetQueueEntry);
											}

											//
											// Send success notification
											//
											else if (!silent) {
												return notify.success(artworkID, target.tracking_rating);
											}
										}
									});
							}

							// if failed
							else if (target.status === 'failed') {
								//TODO: work out why?, notify user...
							}
						})
						.then(function () {
							return broadcast(artworkID, {
								TrackingRating: target.tracking_rating,
								InitialTrackingRating: target.initial_tracking_rating,
								AdjustedContrast: target.adjusted_contrast,
								AdjustedContrastOverride: target.adjusted_contrast_override,
								SyncRequired: target.status === 'processing',
								TargetStatus: target.status,
								Activated: target.active_flag
							});
						})
						.then(function () {
							resolve();
						})

				})
				.catch(function (err) {
					console.error('\x1b[33mVUFORIA ERROR\x1b[0m: ' + (err.message || JSON.stringify(err)));

					if (err.message === 'UnknownTarget') {
						return db('VuforiaTargets').where({ ArtworkID: artworkID }).update({ TargetID: null, Active: false, SyncRequired: false })
							.then(function() {
								resolve();
							})
							.catch(reject);
					}
					else {
						reject(err);
					}
				})


		});
	},



	//
	// Checks for duplicates of a specific target
	//
	duplicateTargets: function (targetID) {
		return new Promise(function (resolve, reject) {
			client.checkForDuplicateTargets(targetID, function (error, result) {
				RequestCount.increment(error);

				if (error) {
					reject(error)
				}
				else {
					resolve(result)
				}
			
			});
		});

	}

	

};

module.exports = Vuforia;