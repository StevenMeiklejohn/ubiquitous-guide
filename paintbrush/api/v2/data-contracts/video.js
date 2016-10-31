var Promise = require('bluebird'),
	AccessToken = require('../../auth/access-token'),
	Permission = require('../lib/permission'),
	service = require('../services/video'),
	is = require('../lib/validate').is;


module.exports = {


	//
	// Creates a new video for the specified profile
	//
	create: function (req) {
		return new Promise(function(resolve) {

			var profileID = req.params.profileID,
				data = req.body;

			if (profileID !== undefined && !is.int(profileID, 1)) {
				resolve({ status: 400, body: { Message: 'ProfileID must be an integer greater than 0' } });
			}
			else if (!data.Name) {
				resolve({ status: 400, body: { Message: 'Please specify a Name for the video'} });
			}
			else if (!data.VideoURI) {
				resolve({ status: 400, body: { Message: 'Please specify a Video URI for the video'} });
			}
			else if (!is.string(data.Name, 1, 255)) {
				resolve({ status: 400, body: { Message: 'Name must be string containing between 1 and 255 characters'} });
			}
			else if (data.Description !== undefined && !is.string(data.Description, 1, 4000)) {
				resolve({ status: 400, body: { Message: 'Description must be string containing between 1 and 4000 characters'} });
			}
			else {
				AccessToken.getUser(req).then(function (user) {
					profileID = profileID || user.ProfileID;

					Permission.Profile.check('video.add', user.UserID, profileID).then(function(allowed) {
						if (!allowed) {
							resolve({ status: 403, body: { Message: 'You do not have permission to add videos to this profile'} });
						}
						else {
							return service.create(profileID, data).then(function(id) {
								resolve({ status: 201, body: { ID: id, Message: 'Success' }} );
							})
						}
					})
					.catch(function (err) {
						processError(err, req, resolve, 'Error occurred while adding video');
					});
				})
			}

		})
	},




	//
	// Returns the specified video
	//
	get: function (req) {
		return new Promise(function(resolve) {

			var videoID = req.params.videoID;

			if (!videoID) {
				resolve({ status: 400, body: { Message: 'Please specify a video ID' } });
			}
			else if (videoID !== undefined && !is.int(videoID, 1)) {
				resolve({ status: 400, body: { Message: 'VideoID must be an integer greater than 0' } });
			}
			else {
				service.owner(videoID)
					.then(function (owner) {
						if (!owner) {
							resolve({ status: 404, body: { Message: 'Video not found' } });
						}
						else {
							return service.get(videoID).then(function(data) {
								resolve({ status: 200, body: data });
							});
						}
					})
					.catch(function (err) {
						processError(err, req, resolve, 'Error occurred while retrieving video');
					});
			}

		})
	},



	//
	// Returns all videos belonging to a specific profile
	//
	list: function (req) {
		return new Promise(function(resolve) {
			var profileID = req.params.profileID;

			if (!profileID) {
				resolve({ status: 400, body: { Message: 'Please specify a profile ID' } });
			}
			else if (profileID !== undefined && !is.int(profileID, 1)) {
				resolve({ status: 400, body: { Message: 'ProfileID must be an integer greater than 0' } });
			}
			else {
				service.list(profileID).then(function(data) {
					resolve({ status: 200, body: data });
				})
				.catch(function (err) {
					processError(err, req, resolve, 'Error occurred while retrieving videos');
				});
			}

		})
	},

	//
	// Removes the specified video
	//
	remove: function (req) {
		return new Promise(function(resolve) {

			var videoID = req.params.videoID,
					data = req.body;

			if (!videoID) {
				resolve({ status: 400, body: { Message: 'Please specify a video ID' } });
			}
			else if (videoID !== undefined && !is.int(videoID, 1)) {
				resolve({ status: 400, body: { Message: 'VideoID must be an integer greater than 0' } });
			}
			else {
				AccessToken.getUser(req).then(function (user) {

					service.owner(videoID)
						.then(function (owner) {
							if (!owner) {
								resolve({ status: 404, body: { Message: 'Video not found' } });
							}
							else {
								return Permission.Profile.check('video.remove', user.UserID, owner.ProfileID).then(function(allowed) {
									if (!allowed) {
										resolve({ status: 403, body: { Message: 'You do not have permission to remove this video'} });
									}
									else {
										return service.remove(videoID).then(function() {
											resolve({ status: 204, body: { Message: 'Success' }} );
										})
									}
								});
							}
						})
						.catch(function (err) {
							processError(err, req, resolve, 'Error occurred while removing video');
						});
				})
			}

		})
	},


	//
	// Updates the specified video
	//
	update: function (req) {
		return new Promise(function(resolve) {

			var videoID = req.params.videoID,
				data = req.body;

			if (!videoID) {
				resolve({ status: 400, body: { Message: 'Please specify a video ID' } });
			}
			else if (videoID !== undefined && !is.int(videoID, 1)) {
				resolve({ status: 400, body: { Message: 'VideoID must be an integer greater than 0' } });
			}
			else if (data.Name !== undefined && !is.string(data.Name, 1, 255)) {
				resolve({ status: 400, body: { Message: 'Name must be string containing between 1 and 255 characters'} });
			}
			else if (data.Description !== undefined && !is.string(data.Description, 1, 4000)) {
				resolve({ status: 400, body: { Message: 'Description must be string containing between 1 and 4000 characters'} });
			}
			else {
				AccessToken.getUser(req).then(function (user) {

					service.owner(videoID)
						.then(function (owner) {
							if (!owner) {
								resolve({ status: 404, body: { Message: 'Video not found' } });
							}
							else {
								return Permission.Profile.check('video.update', user.UserID, owner.ProfileID).then(function(allowed) {
									if (!allowed) {
										resolve({ status: 403, body: { Message: 'You do not have permission to view this video'} });
									}
									else {
										return service.update(videoID, data).then(function() {
											resolve({ status: 200, body: { Message: 'Success' }} );
										})
									}
								});
							}
						})
						.catch(function (err) {
							processError(err, req, resolve, 'Error occurred while retrieving video');
						});
				})
			}

		})
	}




};