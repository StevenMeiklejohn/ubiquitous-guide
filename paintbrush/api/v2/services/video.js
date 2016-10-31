var express = require('express'),
	config = require('../config'),
	fs = require('fs'),
	uuid = require('node-uuid'),
	AccessToken = require('../../auth/access-token'),
	ActivCanvas = require('../lib/activcanvas'),
	Promise = require('bluebird'),
	Analytics = require('../lib/analytics');



module.exports = {

	//
	// Creates a new video record
	//
	// Parameters:
	// 	* profileID		int (required) 		- id of profile record should be created for
	// 	* data			object (required) 	- video data
	//
	create: function(profileID, data) {
		return new Promise(function (resolve, reject) {
			db('Videos').insert({
				ProfileID: profileID,
				Name: data.Name,
				Description: data.Description || data.Name,
				VideoURI: data.VideoURI,
				Width: data.Width,
				Height: data.Height,
				Duration: data.Duration,
				FileName: data.FileName,
				FileSize: data.FileSize
			})
			.then(function(video){
				resolve(video[0]);
			})
			.catch(reject);
		})
	},


	//
	// Returns a single video record
	//
	// Parameters:
	// 	* videoID		int (required) - id of record to be returned
	//
	get: function(videoID) {
		return new Promise(function (resolve, reject) {
			db('Videos').where({ID: videoID, Deleted: 0}).first()
				.then(resolve)
				.catch(reject);
		})
	},


	//
	// Likes a video
	//
	// 	* videoID		int (required) 		- the id the artwork to be liked
	// 	* profileID		int (required) 		- the id the profile liking the video
	//
	like: function(videoID, profileID) {
		return new Promise(function(resolve, reject) {


		})
	},


	//
	// Lists all videos belonging to the specified profile
	//
	// Parameters:
	// 	* profileID		int (required) - id of record to be returned
	//
	list: function(profileID) {
		return new Promise(function (resolve, reject) {

			dbNest(db.select(
				'v.ID as _ID',
				'v.VideoURI as _VideoURI',
				'v.Name as _Name',
				'v.Duration as _Duration',
				'p.Name as _ProfileName',
				'p.ImageURI as _ProfileImageURI',
				'vtc.VideoURI as _Transcodes__VideoURI',
				'vtc.TypeID as _Transcodes__TypeID',
				'vtt.ImageURI as _Transcodes__Thumbnails__ImageURI',
				'vtt.Order as _Transcodes__Thumbnails__Order',
				db.raw('IF(v.ID = p.VideoID, 1, 0) as _ActivCanvasProfile'),
				db.raw('(SELECT COUNT(ID) FROM ArtworkVideos WHERE VideoID = v.ID) as _ActivCanvasArtwork')
			)
			.from('Videos as v')
			.join('Profiles as p', 'v.ProfileID', 'p.ID')
			.leftJoin('VideoTranscodes as vtc', 'vtc.VideoID', 'v.ID')
			.leftJoin('VideoTranscodeThumbnails as vtt', 'vtt.VideoTranscodeID', 'vtc.ID')
			.where({ 'v.ProfileID': profileID, 'v.Deleted': 0 })
			.orderBy('v.updated_at', 'desc'))
			.then(function (_videos) {
					var videos = _videos || [];

					videos.forEach(function (video) {
						if (!video.ProfileImageURI) {
							video.ProfileImageURI = config.profile.defaultImage;
						}

						video.Transcodes.forEach(function (tc) {
							tc.Thumbnails = tc.Thumbnails.sort(function(a, b) {
								return a.Order > b.Order ? -1 : 1;
							})
						});
					});

					resolve(videos);
				})
				.catch(reject);


		})
	},



	//
	// Returns the profileID that owns the specified video
	//
	owner: function (videoID) {
		return new Promise(function(resolve, reject) {
			db('Videos').where({ID: videoID, Deleted: 0}).first('ProfileID')
				.then(resolve)
				.catch(reject);
		})
	},




	//
	// Marks a single video record as deleted
	//
	// Parameters:
	// 	* videoID		int (required) - id of video record
	//
	remove: function(videoID) {
		return new Promise(function (resolve, reject) {
			db('Videos').where({ ID: videoID }).update({ Deleted: 1 })
				.then(resolve)
				.catch(reject);
		});
	},




	//
	// Unlikes a video
	//
	// 	* videoID		int (required) 		- the id the video to be un-liked
	// 	* profileID		int (required) 		- the id the profile to un-liking this video
	//
	unlike: function(videoID, profileID) {
		return new Promise(function(resolve, reject) {


		})
	},


	//
	// Updates an existing video record
	//
	// Parameters:
	// 	* videoID		int (required) 		- the id the video being updated
	// 	* data			object (required) 	- updated video data
	//
	update: function(videoID, data) {
		return new Promise(function (resolve, reject) {
			db('Videos').where({ ID: videoID })
				.update({
					Name: data.Name,
					Description: data.Description || data.Name,
					VideoURI: data.VideoURI,
					Width: data.Width,
					Height: data.Height,
					Duration: data.Duration,
					FileName: data.FileName,
					FileSize: data.FileSize
				})
				.then(resolve)
				.catch(reject);
		});
	}



};
