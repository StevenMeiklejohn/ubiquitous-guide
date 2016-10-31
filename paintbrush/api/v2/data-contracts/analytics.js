var router = require('express').Router(),
	is = require('../lib/validate').is,
	AccessToken = require('../../auth/access-token'),
	Permission = require('../lib/permission'),
	Promise = require('bluebird'),
	Analytics = require('../lib/analytics'),
	service = require('../services/analytics');


module.exports = {

	event: {

		list: function () {
			return new Promise(function (resolve) {

				Analytics.event.list(false)
					.then(function (events) {
						resolve({ status: 200, body: events });
					})
					.catch(function (err) {
						processError(err, req, resolve, 'Error occurred while retrieving events list');
					})

			});
		},


		add: function(req) {
			return new Promise(function(resolve) {

				var event = req.body, eventID = req.body.EventID;

				if (!eventID) {
					resolve({ status: 400, body: { Message: 'Please specify an EventID' } });
				}
				else {

					console.log('\x1b[33mANALYTICS (M)\x1b[0m: \x1b[36mEVENT ' + eventID + '\x1b[0m: ' + JSON.stringify(event));

					db('AnalyticEventTypes').where('ID', req.body.EventID).first()
						.then(function(eventType){

							if (!eventType) {
								resolve({ status: 400, body: { Message: 'No event found with ID: ' + eventID } });
							}

							//
							// Check required fields are present
							//
							else if (eventType.AutoRecorded) {
								resolve({ status: 400, body: { Message: 'Event \'' + eventType.Description + '\' is recorded automatically' }});
							}
							else if (eventType.ArtworkID && !event.ArtworkID) {
								resolve({ status: 400, body: { Message: 'Event \'' + eventType.Description + '\' requires an ArtworkID' }});
							}
							else if (eventType.ArtistID && !event.ArtistID) {
								resolve({ status: 400, body: { Message: 'Event \'' + eventType.Description + '\' requires an ArtistID' }});
							}
							else if (eventType.ProfileID && !event.ProfileID) {
								resolve({ status: 400, body: { Message: 'Event \'' + eventType.Description + '\' requires a ProfileID' }});
							}
							else if (eventType.ShortlistID && !event.ShortlistID) {
								resolve({ status: 400, body: { Message: 'Event \'' + eventType.Description + '\' requires a ShortlistID' }});
							}
							else if (eventType.VideoID && !event.VideoID) {
								resolve({ status: 400, body: { Message: 'Event \'' + eventType.Description + '\' requires a VideoID' }});
							}

							//
							// Check data types
							//
							else if (event.ArtworkID !== undefined && !is.int(event.ArtworkID, 1)) {
								resolve({ status: 400, body: { Message: 'ArtworkID must be an integer greater than 0' }});
							}
							else if (event.ArtistID !== undefined  && !is.int(event.ArtistID, 1)) {
								resolve({ status: 400, body: { Message: 'ArtistID must be an integer greater than 0' }});
							}
							else if (event.ProfileID !== undefined  && !is.int(event.ProfileID, 1)) {
								resolve({ status: 400, body: { Message: 'ProfileID must be an integer greater than 0' }});
							}
							else if (event.ShortlistID !== undefined  && !is.int(event.ShortlistID, 1)) {
								resolve({ status: 400, body: { Message: 'ShortlistID must be an integer greater than 0' }});
							}
							else if (event.VideoID !== undefined  && !is.int(event.VideoID, 1)) {
								resolve({ status: 400, body: { Message: 'VideoID must be an integer greater than 0' }});
							}

							//
							// Record event
							//
							else {
								return Analytics.event.add(req, eventID, req.body)
									.then(function(){
										resolve({ status: 200, body: { Message: 'Success' }});
									})
							}

						})
						.catch(function (err) {
							processError(err, req, resolve, 'Error occurred while recording event');
						});
				}
			})

		}

	},

	users: {

		activity: {

			details: function (req) {
				return new Promise(function (resolve) {
					var profileID = req.params.profileID,
						userProfileID = req.params.userProfileID;

					if (!profileID) {
						resolve({ status: 400, body: { Message: 'Please specify a profile ID' } });
					}
					else if (!userProfileID) {
						resolve({ status: 400, body: { Message: 'Please specify a user profile ID' } });
					}
					else if (!is.int(profileID, 1)) {
						resolve({ status: 400, body: { Message: 'Profile ID must be an integer greater than 0' } });
					}
					else if (!is.int(userProfileID, 1)) {
						resolve({ status: 400, body: { Message: 'User Profile ID must be an integer greater than 0' } });
					}
					else {
						AccessToken.getUser(req).then(function (user) {

							Permission.Profile.check('analytics.users.activity.details', user.UserID, profileID).then(function(allowed) {
								if (!allowed) {
									resolve({ status: 403, body: { Message: 'You do not have permission to view this data'} });
								}
								else {
									var returnResults = function (p) {
										service.users.activity.details(p, userProfileID)
											.then(function(data) {

												data.forEach(function(p) {
													if (p.ProfileName.indexOf('@actemp') > -1) {
														p.ProfileName = 'Guest Account (' + p.ID + ')';
													}
												});

												resolve({ status: 200, body: data });
											})
											.catch(function (err) {
												processError(err, req, resolve, 'Error occurred while retrieving user activity details');
											})
									};

									if (user.GalleryID && (profileID * 1) === user.ProfileID) {
										Permission.Profile.list('analytics.users.activity.details', user.UserID).then(returnResults)
									}
									else {
										Permission.Profile.check('analytics.users.activity.details', user.UserID, profileID).then(function(allowed) {
											allowed ? returnResults(profileID) : resolve({ status: 403, body: { Message: 'You do not have permission to view this data'} });
										});
									}

								}
							});

						})

					}
				})
			},

			summary: function (req) {
				return new Promise(function (resolve) {
					var profileID = req.params.profileID;

					if (!profileID) {
						resolve({ status: 400, body: { Message: 'Please specify a profile ID' } });
					}
					else if (!is.int(profileID, 1)) {
						resolve({ status: 400, body: { Message: 'Profile ID must be an integer greater than 0' } });
					}
					else {
						AccessToken.getUser(req).then(function (user) {

							Permission.Profile.check('analytics.users.activity.summary', user.UserID, profileID).then(function(allowed) {
								if (!allowed) {
									resolve({ status: 403, body: { Message: 'You do not have permission to view this data'} });
								}
								else {

									var returnResults = function (p) {
										service.users.activity.summary(p)
												.then(function(data) {

													data.forEach(function(p) {
														if (p.Name.indexOf('@actemp') > -1) {
															p.Name = 'Guest Account (' + p.ID + ')';
														}
													});

													resolve({ status: 200, body: data });
												})
												.catch(function (err) {
													processError(err, req, resolve, 'Error occurred while retrieving user activity summary');
												})
									};

									if (user.GalleryID && (profileID * 1) === user.ProfileID) {
										Permission.Profile.list('analytics.users.activity.summary', user.UserID).then(returnResults)
									}
									else {
										Permission.Profile.check('analytics.users.activity.summary', user.UserID, profileID).then(function(allowed) {
											allowed ? returnResults(profileID) : resolve({ status: 403, body: { Message: 'You do not have permission to view this data'} });
										});
									}

								}
							});

						})

					}
				})
			},

			
			search: function (req) {
				return new Promise(function (resolve) {
					var profileID = req.params.profileID,
						filters = req.body.Filters || {},
						pagination = req.body.Pagination || {},
						sort = req.body.Sort || {};

					//
					// check data types
					//
					if (!profileID) {
						resolve({ status: 400, body: { Message: 'Please specify a profile ID' } });
					}
					else if (!is.int(profileID, 1)) {
						resolve({ status: 400, body: { Message: 'Profile ID must be an integer greater than 0' } });
					}
					else if (filters.UserType !== undefined && (!is.string(filters.UserType) || ['Artist', 'Consumer', 'Gallery'].indexOf(filters.UserType) < 0)) {
						resolve({ status: 400, body: { Message: 'UserType must be a string with a value of \'Artist\', \'Consumer\' or \'Gallery\''} });
					}
					else if (filters.Name !== undefined && !is.string(filters.Name)) {
						resolve({ status: 400, body: { Message: 'Name must be a string'} });
					}
					else if (pagination.PageNumber !== undefined && !is.int(pagination.PageNumber, 0)) {
						resolve({ status: 400, body: { Message: 'PageNumber must be an integer greater than or equal to 0'} });
					}
					else if (pagination.PageSize !== undefined && !is.int(pagination.PageSize, 1)) {
						resolve({ status: 400, body: { Message: 'PageSize must be an integer greater than 0'} });
					}
					else if (sort.Field !== undefined && typeof sort.Field !== 'string') {
						resolve({ status: 400, body: { Message: 'Sort field must be a string'} });
					}
					else if (sort.Direction !== undefined && (typeof sort.Direction !== 'string' || ['asc', 'desc'].indexOf(sort.Direction) < 0)) {
						resolve({ status: 400, body: { Message: 'Sort direction must be a string with a value of \'asc\' or \'desc\'' } });
					}

					//
					// Otherwise perform search query
					//
					else {
						AccessToken.getUser(req).then(function (user) {

							Permission.Profile.check('analytics.users.activity.summary', user.UserID, profileID).then(function(allowed) {
								if (!allowed) {
									resolve({ status: 403, body: { Message: 'You do not have permission to view this data'} });
								}
								else {

									var returnResults = function (p) {
										service.users.activity.search(p, filters, pagination, sort)
											.then(function(data) {

												data.Data.forEach(function(p) {
													if (p.Name.indexOf('@actemp') > -1) {
														p.Name = 'Guest Account (' + p.ID + ')';
													}
												});

												resolve({ status: 200, body: data });
											})
											.catch(function (err) {
												processError(err, req, resolve, 'Error occurred while retrieving user activity summary');
											})
									};

									if (user.GalleryID && (profileID * 1) === user.ProfileID) {
										Permission.Profile.list('analytics.users.activity.summary', user.UserID).then(returnResults)
									}
									else {
										Permission.Profile.check('analytics.users.activity.summary', user.UserID, profileID).then(function(allowed) {
											allowed ? returnResults(profileID) : resolve({ status: 403, body: { Message: 'You do not have permission to view this data'} });
										});
									}

								}
							});
						})

					}

				})
			}

		}


	}


};