var service = require('../services/dashboard'),
	AccessToken = require('../../auth/access-token'),
	Permission = require('../lib/permission'),
	Promise = require('bluebird'),
	is = require('../lib/validate').is;


module.exports = {

	artwork: {

		//
		// Returns a profiles most popular artwork
		//
		popular: function (req) {
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

						Permission.Profile.check('dashboard.artwork.popular', user.UserID, profileID).then(function(allowed) {
							if (!allowed) {
								resolve({ status: 403, body: { Message: 'You do not have permission to view this data'} });
							}
							else {
								service.artwork.popular(profileID)
									.then(function(isNew) {
										resolve({ status: (isNew ? 201 : 200), body: { Message: 'Success' } });
									})
									.catch(function (err) {
										processError(err, req, resolve, 'Error occurred while retrieving popular artwork');
									})
							}
						});

					})

				}

			})
		},

		count: {

			//
			// Returns a profiles total number artwork likes
			//
			likes: function (req) {
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

							var returnResults = function (p) {
								service.artwork.count.likes(p)
									.then(function(count) {
										resolve({ status: 200, body: { Count: count } });
									})
									.catch(function (err) {
										processError(err, req, resolve, 'Error occurred while retrieving artwork likes count');
									})
							};

							if (user.GalleryID && (profileID * 1) === user.ProfileID) {
								Permission.Profile.list('dashboard.artwork.likes', user.UserID).then(returnResults)
							}
							else {
								Permission.Profile.check('dashboard.artwork.likes', user.UserID, profileID).then(function(allowed) {
									allowed ? returnResults(profileID) : resolve({ status: 403, body: { Message: 'You do not have permission to view this data'} });
								});
							}

						})

					}
				})
			},

			//
			// Returns a profiles total number of AC scans
			//
			scans: function (req) {
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

							var returnResults = function (p) {
								service.artwork.count.scans(p)
									.then(function(count) {
										resolve({ status: 200, body: { Count: count } });
									})
									.catch(function (err) {
										processError(err, req, resolve, 'Error occurred while retrieving artwork scans count');
									})
							};

							if (user.GalleryID && (profileID * 1) === user.ProfileID) {
								Permission.Profile.list('dashboard.artwork.scans', user.UserID).then(returnResults)
							}
							else {
								Permission.Profile.check('dashboard.artwork.scans', user.UserID, profileID).then(function(allowed) {
									allowed ? returnResults(profileID) : resolve({ status: 403, body: { Message: 'You do not have permission to view this data'} });
								});
							}

						})

					}
				})
			},

			//
			// Returns a profiles total artworks that have been shortlisted
			//
			shortlisted: function (req) {
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

							var returnResults = function (p) {
								service.artwork.count.shortlisted(p)
									.then(function(count) {
										resolve({ status: 200, body: { Count: count } });
									})
									.catch(function (err) {
										processError(err, req, resolve, 'Error occurred while retrieving shortlisted artworks count');
									})
							};

							if (user.GalleryID && (profileID * 1) === user.ProfileID) {
								Permission.Profile.list('dashboard.artwork.shortlisted', user.UserID).then(returnResults)
							}
							else {
								Permission.Profile.check('dashboard.artwork.shortlisted', user.UserID, profileID).then(function(allowed) {
									allowed ? returnResults(profileID) : resolve({ status: 403, body: { Message: 'You do not have permission to view this data'} });
								});
							}

						})

					}
				})
			},

			//
			// Returns a profiles total number of artworks
			//
			total: function (req) {
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

							var returnResults = function (p) {
								service.artwork.count.total(p)
									.then(function(count) {
										resolve({ status: 200, body: { Count: count } });
									})
									.catch(function (err) {
										processError(err, req, resolve, 'Error occurred while retrieving total artworks count');
									})
							};

							if (user.GalleryID && (profileID * 1) === user.ProfileID) {
								Permission.Profile.list('dashboard.artwork.total', user.UserID).then(returnResults)
							}
							else {
								Permission.Profile.check('dashboard.artwork.total', user.UserID, profileID).then(function(allowed) {
									allowed ? returnResults(profileID) : resolve({ status: 403, body: { Message: 'You do not have permission to view this data'} });
								});
							}

						})

					}
				})
			},

			//
			// Returns a profiles total number artwork views
			//
			views: function (req) {
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

							var returnResults = function (p) {
								service.artwork.count.views(p)
									.then(function(count) {
										resolve({ status: 200, body: { Count: count } });
									})
									.catch(function (err) {
										processError(err, req, resolve, 'Error occurred while retrieving artwork views count');
									})
							};

							if (user.GalleryID && (profileID * 1) === user.ProfileID) {
								Permission.Profile.list('dashboard.artwork.views', user.UserID).then(returnResults)
							}
							else {
								Permission.Profile.check('dashboard.artwork.views', user.UserID, profileID).then(function(allowed) {
									allowed ? returnResults(profileID) : resolve({ status: 403, body: { Message: 'You do not have permission to view this data'} });
								});
							}

						})

					}
				})
			}

		},


		interval: {

			//
			// Returns a profiles total number artwork likes over a specific period
			//
			likes: function (req) {
				return new Promise(function (resolve) {
					var profileID = req.params.profileID,
						interval = req.params.interval,
						datapoints = parseInt(req.params.datapoints) || 15;

					if (!profileID) {
						resolve({ status: 400, body: { Message: 'Please specify a profile ID' } });
					}
					else if (!is.int(profileID, 1)) {
						resolve({ status: 400, body: { Message: 'Profile ID must be an integer greater than 0' } });
					}
					else if (!is.int(datapoints, 1, 100)) {
						resolve({ status: 400, body: { Message: 'Data points must be an integer greater than 0' } });
					}
					else if (['day', 'week', 'month'].indexOf(interval.toLowerCase()) < 0) {
						resolve({ status: 400, body: { Message: 'Interval must be one of day / week / month' } });
					}
					else {
						AccessToken.getUser(req).then(function (user) {

							var returnResults = function (p) {
								service.artwork.interval.likes(p, interval, datapoints)
									.then(function(data) {
										resolve({ status: 200, body: data });
									})
									.catch(function (err) {
										processError(err, req, resolve, 'Error occurred while retrieving artwork likes over time');
									})
							};

							if (user.GalleryID && (profileID * 1) === user.ProfileID) {
								Permission.Profile.list('dashboard.artwork.likes', user.UserID).then(returnResults)
							}
							else {
								Permission.Profile.check('dashboard.artwork.likes', user.UserID, profileID).then(function(allowed) {
									allowed ? returnResults(profileID) : resolve({ status: 403, body: { Message: 'You do not have permission to view this data'} });
								});
							}

						})

					}
				})
			},

			//
			// Returns a profiles total number of AC scans over a specific period
			//
			scans: function (req) {
				return new Promise(function (resolve) {
					var profileID = req.params.profileID,
						interval = req.params.interval,
						datapoints = parseInt(req.params.datapoints) || 15;

					if (!profileID) {
						resolve({ status: 400, body: { Message: 'Please specify a profile ID' } });
					}
					else if (!is.int(profileID, 1)) {
						resolve({ status: 400, body: { Message: 'Profile ID must be an integer greater than 0' } });
					}
					else if (!is.int(datapoints, 1, 100)) {
						resolve({ status: 400, body: { Message: 'Data points must be an integer greater than 0' } });
					}
					else if (['day', 'week', 'month'].indexOf(interval.toLowerCase()) < 0) {
						resolve({ status: 400, body: { Message: 'Interval must be one of day / week / month' } });
					}
					else {
						AccessToken.getUser(req).then(function (user) {

							var returnResults = function (p) {
								service.artwork.interval.scans(p, interval, datapoints)
										.then(function(data) {
											resolve({ status: 200, body: data });
										})
										.catch(function (err) {
											processError(err, req, resolve, 'Error occurred while retrieving artwork scans over time');
										})
							};

							if (user.GalleryID && (profileID * 1) === user.ProfileID) {
								Permission.Profile.list('dashboard.artwork.scans', user.UserID).then(returnResults)
							}
							else {
								Permission.Profile.check('dashboard.artwork.scans', user.UserID, profileID).then(function(allowed) {
									allowed ? returnResults(profileID) : resolve({ status: 403, body: { Message: 'You do not have permission to view this data'} });
								});
							}

						})

					}
				})
			},

			//
			// Returns a profiles total artworks that have been shortlisted over a specific period
			//
			shortlisted: function (req) {
				return new Promise(function (resolve) {
					var profileID = req.params.profileID,
						interval = req.params.interval,
						datapoints = parseInt(req.params.datapoints) || 15;

					if (!profileID) {
						resolve({ status: 400, body: { Message: 'Please specify a profile ID' } });
					}
					else if (!is.int(profileID, 1)) {
						resolve({ status: 400, body: { Message: 'Profile ID must be an integer greater than 0' } });
					}
					else if (!is.int(datapoints, 1, 100)) {
						resolve({ status: 400, body: { Message: 'Data points must be an integer greater than 0' } });
					}
					else if (['day', 'week', 'month'].indexOf(interval.toLowerCase()) < 0) {
						resolve({ status: 400, body: { Message: 'Interval must be one of day / week / month' } });
					}
					else {
						AccessToken.getUser(req).then(function (user) {

							var returnResults = function (p) {
								service.artwork.interval.shortlisted(p, interval, datapoints)
									.then(function(data) {
										resolve({ status: 200, body: data });
									})
									.catch(function (err) {
										processError(err, req, resolve, 'Error occurred while retrieving artworks shortlisted over time');
									})
							};

							if (user.GalleryID && (profileID * 1) === user.ProfileID) {
								Permission.Profile.list('dashboard.artwork.shortlisted', user.UserID).then(returnResults)
							}
							else {
								Permission.Profile.check('dashboard.artwork.shortlisted', user.UserID, profileID).then(function(allowed) {
									allowed ? returnResults(profileID) : resolve({ status: 403, body: { Message: 'You do not have permission to view this data'} });
								});
							}

						})

					}
				})
			},

			//
			// Returns a profiles total number of artworks over a specific period
			//
			total: function (req) {
				return new Promise(function (resolve) {
					var profileID = req.params.profileID,
						interval = req.params.interval,
						datapoints = parseInt(req.params.datapoints) || 15;

					if (!profileID) {
						resolve({ status: 400, body: { Message: 'Please specify a profile ID' } });
					}
					else if (!is.int(profileID, 1)) {
						resolve({ status: 400, body: { Message: 'Profile ID must be an integer greater than 0' } });
					}
					else if (!is.int(datapoints, 1, 100)) {
						resolve({ status: 400, body: { Message: 'Data points must be an integer greater than 0' } });
					}
					else if (['day', 'week', 'month'].indexOf(interval.toLowerCase()) < 0) {
						resolve({ status: 400, body: { Message: 'Interval must be one of day / week / month' } });
					}
					else {
						AccessToken.getUser(req).then(function (user) {

							var returnResults = function (p) {
								service.artwork.interval.total(p, interval, datapoints)
										.then(function(data) {
											resolve({ status: 200, body: data });
										})
										.catch(function (err) {
											processError(err, req, resolve, 'Error occurred while retrieving total artworks over time');
										})
							};

							if (user.GalleryID && (profileID * 1) === user.ProfileID) {
								Permission.Profile.list('dashboard.artwork.total', user.UserID).then(returnResults)
							}
							else {
								Permission.Profile.check('dashboard.artwork.total', user.UserID, profileID).then(function(allowed) {
									allowed ? returnResults(profileID) : resolve({ status: 403, body: { Message: 'You do not have permission to view this data'} });
								});
							}

						})

					}
				})
			},

			//
			// Returns a profiles total number artwork views over a specific period
			//
			views: function (req) {
				return new Promise(function (resolve) {
					var profileID = req.params.profileID,
						interval = req.params.interval,
						datapoints = parseInt(req.params.datapoints) || 15;

					if (!profileID) {
						resolve({ status: 400, body: { Message: 'Please specify a profile ID' } });
					}
					else if (!is.int(profileID, 1)) {
						resolve({ status: 400, body: { Message: 'Profile ID must be an integer greater than 0' } });
					}
					else if (!is.int(datapoints, 1, 100)) {
						resolve({ status: 400, body: { Message: 'Data points must be an integer greater than 0' } });
					}
					else if (['day', 'week', 'month'].indexOf(interval.toLowerCase()) < 0) {
						resolve({ status: 400, body: { Message: 'Interval must be one of day / week / month' } });
					}
					else {
						AccessToken.getUser(req).then(function (user) {

							var returnResults = function (p) {
								service.artwork.interval.views(p, interval, datapoints)
										.then(function(data) {
											resolve({ status: 200, body: data });
										})
										.catch(function (err) {
											processError(err, req, resolve, 'Error occurred while retrieving artwork views over time');
										})
							};

							if (user.GalleryID && (profileID * 1) === user.ProfileID) {
								Permission.Profile.list('dashboard.artwork.views', user.UserID).then(returnResults)
							}
							else {
								Permission.Profile.check('dashboard.artwork.views', user.UserID, profileID).then(function(allowed) {
									allowed ? returnResults(profileID) : resolve({ status: 403, body: { Message: 'You do not have permission to view this data'} });
								});
							}

						})

					}
				})
			}
		}


	},


	customers: {


		//
		// Returns the most active customers based on scans and shortlisting of the specified profiles artworks
		//
		mostActive: function (req) {
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

						Permission.Profile.check('dashboard.customers.activity', user.UserID, profileID).then(function(allowed) {
							if (!allowed) {
								resolve({ status: 403, body: { Message: 'You do not have permission to view this data'} });
							}
							else {

								var returnResults = function (p) {
									service.customers.mostActive(p)
											.then(function(data) {

												data.forEach(function(p) {
													if (p.Name.indexOf('@actemp') > -1) {
														p.Name = 'Guest Account (' + p.ID + ')';
													}
												});

												resolve({ status: 200, body: data });
											})
											.catch(function (err) {
												processError(err, req, resolve, 'Error occurred while retrieving active customers details');
											})
								};

								if (user.GalleryID && (profileID * 1) === user.ProfileID) {
									Permission.Profile.list('dashboard.customers.activity', user.UserID).then(returnResults)
								}
								else {
									Permission.Profile.check('dashboard.customers.activity', user.UserID, profileID).then(function(allowed) {
										allowed ? returnResults(profileID) : resolve({ status: 403, body: { Message: 'You do not have permission to view this data'} });
									});
								}

							}
						});

					})

				}
			})
		}



	},


	profile: {

		count: {

			//
			// Returns a profiles total views
			//
			views: function (req) {
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

							var returnResults = function (p) {
								service.profile.count.views(p)
									.then(function(count) {
										resolve({ status: 200, body: { Count: count } });
									})
									.catch(function (err) {
										processError(err, req, resolve, 'Error occurred while retrieving profile views count');
									})
							};

							if (user.GalleryID && (profileID * 1) === user.ProfileID) {
								Permission.Profile.list('dashboard.profile.views', user.UserID).then(returnResults)
							}
							else {
								Permission.Profile.check('dashboard.profile.views', user.UserID, profileID).then(function(allowed) {
									allowed ? returnResults(profileID) : resolve({ status: 403, body: { Message: 'You do not have permission to view this data'} });
								});
							}

						})

					}
				})
			}

		},

		interval: {

			//
			// Returns a profiles total views over a specific period
			//
			views: function (req) {
				return new Promise(function (resolve) {
					var profileID = req.params.profileID,
						interval = req.params.interval,
						datapoints = parseInt(req.params.datapoints) || 15;

					if (!profileID) {
						resolve({ status: 400, body: { Message: 'Please specify a profile ID' } });
					}
					else if (!is.int(profileID, 1)) {
						resolve({ status: 400, body: { Message: 'Profile ID must be an integer greater than 0' } });
					}
					else if (!is.int(datapoints, 1, 100)) {
						resolve({ status: 400, body: { Message: 'Data points must be an integer greater than 0' } });
					}
					else if (['day', 'week', 'month'].indexOf(interval.toLowerCase()) < 0) {
						resolve({ status: 400, body: { Message: 'Interval must be one of day / week / month' } });
					}
					else {
						AccessToken.getUser(req).then(function (user) {

							var returnResults = function (p) {
								service.profile.interval.views(p, interval, datapoints)
									.then(function(data) {
										resolve({ status: 200, body: data });
									})
									.catch(function (err) {
										processError(err, req, resolve, 'Error occurred while retrieving profile views over time');
									})
							};

							if (user.GalleryID && (profileID * 1) === user.ProfileID) {
								Permission.Profile.list('dashboard.profile.views', user.UserID).then(returnResults)
							}
							else {
								Permission.Profile.check('dashboard.profile.views', user.UserID, profileID).then(function(allowed) {
									allowed ? returnResults(profileID) : resolve({ status: 403, body: { Message: 'You do not have permission to view this data'} });
								});
							}

						})

					}
				})
			}

		},

		viewed: {

			//
			// Returns a details of profiles that have viewed a specific profile
			//
			details: function (req) {
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

							Permission.Profile.check('dashboard.profile.views', user.UserID, profileID).then(function(allowed) {
								if (!allowed) {
									resolve({ status: 403, body: { Message: 'You do not have permission to view this data'} });
								}
								else {
									service.profile.viewed.details(profileID)
										.then(function(data) {

											data.forEach(function(p) {
												if (p.Name.indexOf('@actemp') > -1) {
													p.Name = 'Unknown';
												}
											});

											resolve({ status: 200, body: data });
										})
										.catch(function (err) {
											processError(err, req, resolve, 'Error occurred while retrieving viewer details');
										})
								}
							});

						})

					}
				})
			}

		}



	},


	social: {

		count: {

			//
			// Returns a profiles total followers
			//
			followers: function (req) {
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

							Permission.Profile.check('dashboard.artwork.total', user.UserID, profileID).then(function(allowed) {
								if (!allowed) {
									resolve({ status: 403, body: { Message: 'You do not have permission to view this data'} });
								}
								else {
									service.social.count.followers(profileID)
										.then(function(count) {
											resolve({ status: 200, body: { Count: count } });
										})
										.catch(function (err) {
											processError(err, req, resolve, 'Error occurred while retrieving total followers count');
										})
								}
							});

						})

					}
				})
			}

		},

		interval: {

			//
			// Returns a profiles total followers over a specific period
			//
			followers: function (req) {
				return new Promise(function (resolve) {

				})
			}

		}

	},


	notifications: function (req) {
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

					Permission.Profile.check('dashboard.notifications', user.UserID, profileID).then(function(allowed) {
						if (!allowed) {
							resolve({ status: 403, body: { Message: 'You do not have permission to view this data'} });
						}
						else {
							service.notifications(profileID)
								.then(function(notifications) {
									resolve({ status: 200, body: notifications });
								})
								.catch(function (err) {
									processError(err, req, resolve, 'Error occurred while retrieving notifications');
								})
						}
					});

				})

			}

		})
	}

};