var config = require('../config'),
	router = require('express').Router(),
	fs = require('fs'),
	uuid = require('node-uuid'),
	url = require('url'),
	AccessToken = require('../../auth/access-token');





router


	// list current users video
	.get('/:profileID/list', function (req, res) {

		dbNest(
			db.select(
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
			.where({ ProfileID: req.params.profileID, 'v.Deleted': 0 })
			.orderBy('v.Name', 'asc')
		)
		.then(function (_videos) {
			var videos = _videos || [];

			videos.forEach(function (video) {
				if (!video.ProfileImageURI) {
					video.ProfileImageURI = config.profile.defaultImage;
				}
			});

			res.json(videos);
		})
		.catch(function (err) {
			logError(err, req, function () {
				res.status(500).json({ Message: 'Unexpected error occurred' });
			});
		})

	})




	// view video details
	.get('/:videoID', function (req, res) {

		var videoID = parseInt(req.params.videoID)
		if(isNaN(videoID)){

			// invalid video ID
			return res.status(400).json({ 'Message': 'Invalid video id: ' + req.params.videoID })

		}

		db.table('Videos').first('*').where({ ID: videoID, Deleted: 0 })
		.then(function(video){

			if(video){

				// success
				return res.json( video )

			}
			else{

				// video doesn't exist
				return res.status(404).json({ 'Message': 'Not Found' })

			}

		})

	}) // view video details





	// like video
	.get('/:videoID/like', function(req, res){

		// check current user
		AccessToken.getUser(req).then(function (user) {

			if(!user) return res.status(500).json({ Message: 'Current user could not be determined' })

			var videoID = parseInt(req.params.videoID)
			if(isNaN(videoID)){

				// invalid video ID
				return res.status(400).json({ 'Message': 'Invalid video ID: ' + req.params.videoID })

			}

			// check the video exists
			db('Videos').count('ID as total').where({ ID: videoID })
			.then(function(video){

				if(!video[0].total){

					// video doesn't exist
					return res.status(404).json({ 'Message': 'Video Not Found' })

				}

				// flag video as liked
				return db('UserVideoLikes').insert({ UserID: user.UserID, VideoID: videoID })
				.then(function(like){

					// success
					res.json({ 'Message': 'Success' })

				})
				.catch(function(err){

					// check if the user/video key exists
					if(err.code && err.code == 'ER_DUP_ENTRY'){

						// video already liked by this user - job's a goodun'
						return res.json({ 'Message': 'Success' })

					}

				})

			})
			.catch(function(err){

				// error
				return res.status(500).json({ 'Message': 'Video not liked' })

			})

		}) // current user

	}) // like video





	// unlike video
	.get('/:videoID/unlike', function(req, res){

		// check current user
		AccessToken.getUser(req).then(function (user) {

			if(!user) return res.status(500).json({ Message: 'Current user could not be determined' })

			var videoID = parseInt(req.params.videoID)
			if(isNaN(videoID)){

				// invalid video ID
				return res.status(400).json({ 'Message': 'Invalid video ID: ' + req.params.videoID })

			}

			// check the video exists
			db('Videos').count('ID as total').where({ ID: videoID })
			.then(function(video){

				if(!video[0].total){

					// video doesn't exist
					return res.status(404).json({ 'Message': 'Video Not Found' })

				}

				// unlike
				db('UserVideoLikes').where({ UserID: user.UserID, VideoID: videoID}).del()
				.then(function(unlike){

					// success
					return res.json({ 'Message': 'Success' })

				})
			})
			.catch(function(err){

				// error
				return res.status(500).json({ 'Message': 'Video not unliked' })

			})

		}) // current user

	})





	// add video
	.post('/add', function(req, res) {

		// check current user
		AccessToken.getUser(req).then(function (user) {

			if(!user) return res.status(500).json({ Message: 'Current user could not be determined' });

			// check arguments
			var name = req.body.Name,
				description = req.body.Description,
				videoURI = req.body.VideoURI || '',
				uriData = url.parse(videoURI),
				profileID = user.ProfileID,

				// optional
				filename = req.body.FileName,
				width = parseInt(req.body.Width) || 0,
				height = parseInt(req.body.Height) || 0,
				filesize = parseInt(req.body.FileSize) || 0,
				duration = parseFloat(req.body.Duration) || 0;

			if ((user.memberOf('Administrators') || user.managesArtist(req.body.ProfileID)) && req.body.ProfileID) {
				profileID = req.body.ProfileID;
			}

			if(!name || !description || !videoURI){
				return res.status(400).json({ Message: 'Please supply a name, description and URI' });
			}

			// use whitelisted video hosting sites
			var hostOK = config.video.whitelist.some(function (regex) {
				return regex.test(uriData.hostname)
			});

			if (!hostOK) {
				return res.status(400).json({ Message: uriData.hostname + ' is not an allowed video hosting site' });
			}

			// insert the video
			db('Videos').insert({
				ProfileID: profileID,
				Name: name,
				Description: description,
				VideoURI: videoURI,
				Width: width,
				Height: height,
				Duration: duration,
				FileName: filename,
				FileSize: filesize
			})
			.then(function(video){
				return res.status(201).json({ 'ID': video[0] });
			})
			.catch(function (err) {
				logError(err, req, function () {
					res.status(500).json({ Message: 'Unexpected error occurred' });
				});
			})

		})
		
	})





	// handles async uploads of video files
	.post('/upload', function (req, res) {

		var name = req.query.qqfile,
			nameParts = name.split('.'),
			uniqueName = uuid.v4() + '.' + nameParts[nameParts.length - 1],
			path = __dirname + '/../../web/uploads/';

		console.log('FILENAME: ' + name)
		console.log('UNIQUENAME: ' + uniqueName)

		var file = fs.createWriteStream(path + uniqueName);

		req.on('data', function (chunk) {
			file.write(chunk);
		})

		req.on('end', function () {
			file.end();
			res.json({
				Location: '/uploads/',
				Filename: uniqueName,
				OriginalFilename: name
			});
		})

	})





	// update video
	.put('/:videoID/update', function (req, res) {

		// check current user
		AccessToken.getUser(req).then(function (user) {

			// user should only get here if authenticated
			if (!user) return res.status(500).json({ Message: 'Current user could not be determined' })

			// check arguments
			var videoID = parseInt(req.params.videoID),
				name = req.body.Name,
				description = req.body.Description,
				videoURI = req.body.VideoURI,
				uriData = url.parse(videoURI),

				// optional
				filename = req.body.FileName,
				width = parseInt(req.body.Width),
				height = parseInt(req.body.Height),
				filesize = parseInt(req.body.FileSize),
				duration = parseFloat(req.body.Duration);


			if (isNaN(videoID)) {
				return res.status(400).json({ 'Message': 'Invalid video ID: ' + req.params.videoID })
			}
			
			// if updating video uri check domain is whitelisted
			if (videoURI) {
				var hostOK = config.video.whitelist.some(function (regex) {
					return regex.test(uriData.hostname)
				});
				if (!hostOK) {
					return res.status(400).json({ Message: uriData.hostname + ' is not an allowed video hosting site' });
				}
			}

		
			// check video exists and user has permission to update
			db('Videos').first('ID', 'ProfileID').where({ ID: videoID })
			.then(function(video){

				if(!video){
					res.status(404).json({ 'Message': 'Video Not Found' });
				}
				else if(video.ProfileID != user.ProfileID && !(user.memberOf('Administrators') || user.managesArtist(video.ProfileID))){
					res.status(403).json({ 'Message': 'You do not have permission to update this video' });
				}
				else {

					return db('Videos').where({ ID: videoID })
						.update({
							Name: name || video.Name,
							Description: description || video.Description,
							VideoURI: videoURI || video.VideoURI,
							Width: width || video.Width,
							Height: height || video.Height,
							Duration: duration || video.Duration,
							FileName: filename || video.FileName,
							FileSize: filesize || video.FileSize
						})
						.then(function () {
							res.json({ 'Message': 'Success' });
						})
				}

				
			})
			.catch(function (err) {
				logError(err, req, function () {
					res.status(500).json({ Message: 'Unexpected error occurred' });
				});
			})

		})

	})





	// remove video
	.delete('/:videoID/remove', function (req, res) {

		var videoID = parseInt(req.params.videoID);

		if(isNaN(videoID)){

			// invalid video ID
			return res.status(400).json({ 'Message': 'Invalid video id: ' + req.params.videoID })

		}

		// check current user
		AccessToken.getUser(req).then(function (user){

			// user should only get here if authenticated
			if(!user) return res.status(500).json({ Message: 'Current user could not be determined' });

			// check video exists and user has permission
			db('Videos').first('ID', 'ProfileID').where({ ID: videoID })
			.then(function(video){
				if(!video){

					// video doesn't exist
					return res.status(404).json({ 'Message': 'Not Found' })

				}
				else if(video.ProfileID != user.ProfileID && !(user.memberOf('Administrators') || user.managesArtist(video.ProfileID))){

					// user is not the owner and not admin
					return res.status(403).json({ 'Message': 'You do not have permission to remove this video' })

				}

				// flag video as deleted
				return db('Videos').where({ ID: videoID }).update({ Deleted: 1 })
			})
			.then(function(video){

				// success
				res.json({ 'Message': 'Success' })

			})
			.catch(function(err){

				// error 
				if(!res.headersSent) return res.status(500).json({ 'Message': 'Video NOT removed' })

			})

		});

	});





module.exports = router;
