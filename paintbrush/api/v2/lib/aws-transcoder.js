var config = require('../config'),
	AWS = require('aws-sdk'),
	Promise = require('bluebird'),
	http = require('http'),
	url = require('url');


AWS.config.update({
	accessKeyId: config.aws.key,
	secretAccessKey: config.aws.secret,
	signatureVersion: 'v4',
	region: config.aws.region
});

var elastictranscoder = new AWS.ElasticTranscoder({ apiVersion: '2012-09-25' });


var Transcoder = {

	//
	// Creates a new job
	//
	createJob: function (transcodeTypeID, inputFile, outputPrefix) {
		return new Promise(function (resolve, reject) {

			var params;

			switch (transcodeTypeID) {

				//
				// MP4 (low quality)
				//
				case 1:
					params = {
						Input: {
							Key: inputFile
						},
						PipelineId: config.aws.transcoder.pipelineId,
						OutputKeyPrefix: outputPrefix + '_mp4/',
						Output: {
							Key: '320.mp4',
							PresetId: '1444984739233-f6afjx',
							ThumbnailPattern: '320-{count}'
						}
					};
					break;

				//
				// HLS
				//
				case 2:
					params = {
						Input: {
							Key: inputFile
						},
						PipelineId: config.aws.transcoder.pipelineId,
						OutputKeyPrefix: outputPrefix + '_hls/',
						Outputs: [
							{
								Key: 'hls_400_',
								PresetId: '1351620000001-200050',
								SegmentDuration: '3.0'								
							},
							{
								Key: 'hls_600_',
								PresetId: '1351620000001-200040',
								SegmentDuration: '3.0'
							},
							{
								Key: 'hls_1000_',
								PresetId: '1444985038800-cz1z9j',
								SegmentDuration: '3.0',
								ThumbnailPattern: 'hls_1000_-{count}'
							}
						],
						Playlists: [{
							Format: 'HLSv3',
							Name: 'index',
							OutputKeys: [
								'hls_400_',
								'hls_600_',
								'hls_1000_',
							]
						}]
					};

					break;
			}

			if (!params) {
				reject('Invalid Type ID');
			}
			else {
				console.log(params)

				elastictranscoder.createJob(params, function (err, data) {
					if (err) {
						reject(err);
					}
					else {
						resolve(data.Job);
					}
				});
			}

		});
	},


	// 
	// Returns the specified job from AWS
	//
	getJob: function (jobID) {
		return new Promise(function (resolve, reject) {
			elastictranscoder.readJob({ Id: jobID }, function (err, data) {
				if (err) {
					reject(err);
				}
				else {
					resolve(data.Job)
				}
			});
		});
	},


	
	listJobs: function () {
		return new Promise(function (resolve, reject) {

			elastictranscoder.listPipelines(function (err, pipelines) {
				if (err) {
					reject(err);
				}
				else {

					console.log('PIPELINES:')
					console.log(pipelines)

					pipelines.Pipelines.forEach(function (pipeline, i) {
						
						var params = {
							PipelineId: pipeline.Id
						};

						console.log(params)
						console.log('JOBS:')

						elastictranscoder.listJobsByPipeline(params, function (err, jobs) {
							if (err) {
								reject(err);
							}
							else {
								console.log(jobs)

								if (i + 1 >= pipelines.length) {
									resolve({});
								}
							}
						});


					})


					
				}
			});


		});
	},



	listPresets: function () {
		return new Promise(function (resolve, reject) {

			elastictranscoder.listPresets(function (err, presets) {
				if (err) {
					reject(err);
				}
				else {

					console.log('PRESETS:')
					console.log(presets)

					resolve(presets)

				}
			});


		});
	},

	//
	// Searches for thumbnails for a specific transcode job
	//
	getThumbnails: function(transcodeID, typeID, baseURI) {
		return new Promise(function (resolve, reject) {
			
			var i = 0,
				thumbnailPattern,
				urlData = url.parse(baseURI),

				// pads a number with leading zeros
				pad = function(n, p, c) {
					var pad_char = typeof c !== 'undefined' ? c : '0';
					var pad = new Array(1 + p).join(pad_char);
					return (pad + n).slice(-pad.length);
				},

				// checks for the next thumbnail in the sequence
				next = function() {
					i++;

					if (i > 10) {
						resolve();
					}
					else {
						var fileName = thumbnailPattern.replace(/{count}/gi, pad(i, 5));
						var options = {
							method: 'HEAD', host: urlData.host, path: urlData.path + fileName
						};

						console.log(options)

						var req = http.request(options, function (res) {
							if (res.statusCode === 200) {
								console.info(urlData.href + fileName);

								// insert record into db
								db('VideoTranscodeThumbnails').insert({
									VideoTranscodeID: transcodeID,
									ImageURI: urlData.href + fileName,
									Order: i
								})
								.then(next)
								.catch(resolve);
							}
							else {
								resolve();
							}

						});
						req.on('error', function (err) {
							console.error(err);
							resolve();
						})
						req.end();
					}
					
				}
			
			// set pattern
			switch (typeID) {
				case 1: thumbnailPattern = '320-{count}.jpg'; break;
				case 2: thumbnailPattern = 'hls_1000_-{count}.jpg'; break;
			}

			console.log(arguments)
			console.log(urlData)
			console.log(thumbnailPattern)

			// delete any existing thumbnail records for this transcode job
			db('VideoTranscodeThumbnails').where({ VideoTranscodeID: transcodeID }).del().then(function () {

				// start checking for thumbnails
				if (!thumbnailPattern) {
					resolve();
				}
				else {
					next();
				}

			})

		});
	},

	//
	// Adds any missing transcodes for the specified video to the transcodes queue
	//
	queue: function(videoID) {
		
		return new Promise(function (resolve, reject) {

			db.select('ID')
			.from('VideoTranscodeTypes')
			.then(function (types) {

				return db.select('ID')
					.from('VideoTranscodes')
					.where({ VideoID: videoID })
					.then(function (transcodes) {
						
						if (transcodes.length < types.length) {

							var missingTypes = [];

							// work out missing transcodes
							types.forEach(function (type) {
								var found = transcodes.some(function (transcode) {
									return transcode.TypeID === type.ID;
								});
								if (!found) {
									missingTypes.push(type.ID);
								}
							});

							// create pending transcode records
							var transcodes = [];
							missingTypes.forEach(function (typeID) {
								transcodes.push({
									VideoID: videoID,
									TypeID: typeID
								});
							});
							
							return db('VideoTranscodes').insert(transcodes)
								.then(function () {
									resolve();
								})
								.catch(function() {
									// table has a unique constraint to prevent duplicates
									// - transcodes are queued async so it is possible multiple records could be created during a bulk upload
									// - resolve with no error on the assumption that the required records for this video have already been created
									resolve();
								})

						}
						else {
							resolve();
						}
					})

			})
			.catch(reject)
		
		});



	},


	//
	// Processes any pending transcode jobs
	//
	processQueue: function() {

		return new Promise(function (resolve, reject) {

			//
			// Create new transcode jobs for any unstarted items
			//
			db.select(
				'vtc.ID',
				'vtc.TypeID',
				'v.Name as VideoName',
				'v.VideoURI',
				'v.ID as VideoID',
				'p.Name'
			)
			.from('VideoTranscodes as vtc')
			.join('Videos as v', 'vtc.VideoID', 'v.ID')
			.join('Profiles as p', 'v.ProfileID', 'p.ID')
			.where({ Complete: false, JobID: null })
			.then(function (pending) {
			
				var jobs = [];
				pending.forEach(function (item) {
					var _inputFile = item.VideoURI.split('/').pop(),
						_outputPrefix = (item.Name + '_' + item.VideoName + '_' + item.VideoID).toLowerCase().replace(/\s/g, '-');

					jobs.push(
						Transcoder.createJob(item.TypeID, _inputFile, _outputPrefix)
						.then(function (job) {

							var _videoURI = 'https://s3-' 
								+ config.aws.region + '.amazonaws.com/' 
								+ config.aws.s3.videoBucketOut + '/' 
								+ _outputPrefix;

							switch (item.TypeID) {
								case 1: _videoURI += '_mp4/320.mp4'; break;
								case 2: _videoURI += '_hls/index.m3u8'; break;
							}

							console.log('VIDEOURI: ' + _videoURI)

							return db('VideoTranscodes').where('ID', item.ID)
								.update({
									JobID: job.Id,
									VideoURI: _videoURI
								});
						})
					)
				});


				if (jobs.length) {
					console.log('STARTING JOBS: ' + jobs.length);
					return Promise.settle(jobs);
				}
			})
			.then(function (results) {
				// TODO: record any errors
			})

			//
			// Check status of started/uncomplete jobs
			//
			.then(function () {
				return db.select(
					'vtc.ID',
					'vtc.TypeID',
					'vtc.JobID',
					'vtc.VideoURI'
				)
				.from('VideoTranscodes as vtc')
				.join('Videos as v', 'vtc.VideoID', 'v.ID')
				.join('Profiles as p', 'v.ProfileID', 'p.ID')
				.whereRaw('vtc.Complete = 0 AND vtc.JobID IS NOT NULL')
			})
			.then(function (pending) {

				var jobs = [];
				pending.forEach(function (item) {
					jobs.push(
						Transcoder.getJob(item.JobID)
						.then(function (job) {
							if (job.Status === 'Complete') {
								return db('VideoTranscodes').where('ID', item.ID).update({ Complete: true })
									.then(function () {
										console.log('CHECKING THUMBNAILS');

										var _uriParts = item.VideoURI.split('/');
										_uriParts.pop();
										return Transcoder.getThumbnails(item.ID, item.TypeID, _uriParts.join('/') + '/');
									})
							}
						})
					)
				});

				if (jobs.length) {
					console.log('CHECKING JOBS: ' + jobs.length);
					return Promise.settle(jobs);
				}

			})
			.then(function () {
				resolve();
			})

			.catch(reject);
		})

	}

}

module.exports = Transcoder;