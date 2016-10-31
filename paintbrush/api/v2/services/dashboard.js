var AccessToken = require('../../auth/access-token'),
	Promise = require('bluebird'),
	config = require('../config');



module.exports = {

	customers: {

		//
		// Returns the most active customers based on scans and shortlisting of the specified profiles artworks
		//
		mostActive: function (profileID) {
			return new Promise(function (resolve, reject) {
				var events = {
					'2': 'Scanned Artwork',
					'3': 'Played Video',
					'5': 'Finished Video',
					'6': 'Shared Artwork',
					'7': 'Viewed Artwork',
					'8': 'Viewed Artist',
					'9': 'Buy',
					'10': 'Enquiry',
					'15': 'Added Artwork to Shortlist'
				};
				var eventIDs = Object.keys(events);

				var cutOff = new Date(new Date().setDate(new Date().getDate() - 14));

				db.distinct(
					'p.ID',
					'p.ImageURI',
					'p.Name',
						//db.raw('IF (g.ID IS NOT NULL, \'Gallery\', IF (a.ID IS NOT NULL, \'Artist\', IF (c.ID IS NOT NULL, \'Consumer\', \'\'))) as Type')
					db.raw('\'Consumer\' as Type')
				)
				.from('AnalyticEvents as ae')
				.join('Profiles as p', 'ae.UserProfileID', 'p.ID')
				//.leftJoin('Galleries as g', 'p.id', 'g.ProfileID')
				//.leftJoin('Artists as a', 'p.id', 'a.ProfileID')
				//.leftJoin('Consumers as c', 'p.id', 'c.ProfileID')
				.join('Consumers as c', 'p.id', 'c.ProfileID')
				.whereRaw('ae.ProfileID ' + (Array.isArray(profileID) ? 'IN (' + profileID.join(',') + ')' : '=' + profileID) + ' AND ae.EventID IN (' + eventIDs.join(',') + ')')
				.andWhere('ae.created_at', '>', cutOff)
				.orderBy('ae.created_at', 'desc')
				.then(function (profiles) {
					var queue = [];

					profiles.forEach(function (p) {
						if (!p.ImageURI) {
							p.ImageURI = config.profile.defaultImage;
						}

						queue.push(
							db.select(db.raw(
								'ae.EventID, COUNT(ID) AS Total ' +
								'FROM AnalyticEvents as ae ' +
								'WHERE ae.UserProfileID = ' + p.ID +
									' AND ae.ProfileID ' + (Array.isArray(profileID) ? 'IN (' + profileID.join(',') + ')' : '=' + profileID) +
									' AND ae.EventID IN (' + eventIDs.join(',') + ') ' +
								'GROUP BY ae.EventID'
							))
							.then(function (totalEvents) {
								p.TotalEvents = 0;

								p.Events = totalEvents.map(function (t) {
									p.TotalEvents += t.Total;
									return {
										Type: events[t.EventID + ''] || t.EventID,
										Total: t.Total
									};
								})
							})
							.then(function () {
								return db.first(db.raw(
										'ae.created_at ' +
										'FROM AnalyticEvents as ae ' +
										'WHERE ae.UserProfileID = ' + p.ID +
										' AND ae.ProfileID ' + (Array.isArray(profileID) ? 'IN (' + profileID.join(',') + ')' : '=' + profileID) +
										' AND ae.EventID IN (' + eventIDs.join(',') + ') ' +
										'ORDER BY ae.created_at DESC'
								))
							})
							.then(function (latest) {
								p.LatestEvent = latest.created_at;
							})
						);
					});

					return Promise.all(queue).then(function () {
						resolve(profiles.sort(function(a, b) {
							return a.TotalEvents > b.TotalEvents ? -1 : 1;
						}));
					})

				})
				.catch(reject);
			})
		}

	},

	artwork: {

		//
		// Returns a profiles most popular artwork
		//
		popular: function (profileID) {
			return new Promise(function (resolve, reject) {

				db.select(
					'a.ID',
					'a.Name',
					'a.ImageURI',
					'a.Views',
					'a.Likes',
					'a.ActivCanvasEnabled'
				)
				.from('Artworks as a')
				.whereRaw('(a.OwnerProfileID = ' + profileID + ' OR a.ArtistProfileID = ' + profileID + ') AND a.ImageURI <> \'\' AND a.Deleted = 0')
				.orderBy('a.Views')
				.limit(25)
				.then(resolve)
				.catch(reject)

			})
		},

		count: {

			//
			// Returns a profiles total number artwork likes
			//
			// NOTE: Accepts single profile ID or array of Profile IDs
			//
			likes: function (profileID) {
				return new Promise(function (resolve, reject) {
					var where = 'aw.Deleted = 0 AND aw.ArtistProfileID ' + (Array.isArray(profileID) ? 'IN (' + profileID.join(',') + ')' : '=' + profileID);

					db.count('al.ID as total')
						.from('ArtworkLikes as al')
						.leftJoin('Artworks as aw', 'al.ArtworkID', 'aw.ID')
						.whereRaw(where)
						.then(function (likes) {
							resolve(likes[0].total);
						})
						.catch(reject);
				})
			},

			//
			// Returns a profiles total number of AC scans
			//
			// NOTE: Accepts single profile ID or array of Profile IDs
			//
			scans: function (profileID) {
				return new Promise(function (resolve, reject) {
					var where = 'EventID = 2 AND ProfileID ' + (Array.isArray(profileID) ? 'IN (' + profileID.join(',') + ')' : '=' + profileID);

					db('AnalyticEvents').count('ID as total').whereRaw(where)
						.then(function (result){
							resolve(result[0].total);
						})
						.catch(reject);
				})
			},

			//
			// Returns a profiles total artworks that have been shortlisted
			//
			// NOTE: Accepts single profile ID or array of Profile IDs
			//
			shortlisted: function (profileID) {
				return new Promise(function (resolve, reject) {
					var where = 'aw.Deleted = 0 AND aw.ArtistProfileID ' + (Array.isArray(profileID) ? 'IN (' + profileID.join(',') + ')' : '=' + profileID);

					db.count('sa.ID as total')
						.from('ShortlistArtworks as sa')
						.leftJoin('Artworks as aw', 'sa.ArtworkID', 'aw.ID')
						.whereRaw(where)
						.then(function (shortlisted) {
							resolve(shortlisted[0].total)
						})
						.catch(reject);
				})
			},

			//
			// Returns a profiles total number of artworks
			//
			// NOTE: Accepts single profile ID or array of Profile IDs
			//
			total: function (profileID) {
				return new Promise(function (resolve, reject) {
					var where = 'Deleted = 0 AND ArtistProfileID ' + (Array.isArray(profileID) ? 'IN (' + profileID.join(',') + ')' : '=' + profileID);

					db.count('a.ID as total')
						.from('Artworks as a')
						.whereRaw(where)
						.then(function (artworks) {
							resolve(artworks[0].total)
						})
						.catch(reject)
				})
			},

			//
			// Returns a profiles total number artwork views
			//
			// NOTE: Accepts single profile ID or array of Profile IDs
			//
			views: function (profileID) {
				return new Promise(function (resolve, reject) {
					var where = 'EventID = 7 AND ProfileID ' + (Array.isArray(profileID) ? 'IN (' + profileID.join(',') + ')' : '=' + profileID);

					db('AnalyticEvents').count('ID as total').whereRaw(where)
						.then(function (views){
							resolve(views[0].total)
						})
						.catch(reject);
				})
			}

		},


		interval: {

			//
			// Returns a profiles total number artwork likes over a specific period
			//
			likes: function (profileID, interval, datapoints) {
				return new Promise(function (resolve, reject) {
					interval = interval.toUpperCase();
					var dateFormat = interval === 'DAY' ? '%Y-%m-%d' : interval === 'WEEK' ? '%Y-%u' : '%Y-%m';

					var join = 'ArtworkLikes AS al ON ' +
							'DATE_FORMAT(DATE_SUB(NOW(), INTERVAL (i.ID - 1) ' + interval +
							'), \'' + dateFormat + '\') = DATE_FORMAT(al.created_at, \'' + dateFormat + '\')';

					var where = 'al.ID IS NULL OR (aw.Deleted = 0 AND aw.ArtistProfileID ' + (Array.isArray(profileID) ? 'IN (' + profileID.join(',') + ')' : '=' + profileID) + ')';

					db.select(db.raw('COUNT(al.ID) AS total'))
						.from('Integers AS i')
						.leftJoin(db.raw(join))
						.leftJoin('Artworks as aw', 'aw.ID', 'al.ArtworkID')
						.whereRaw(where)
						.groupBy('i.ID')
						.limit(datapoints)
						.pluck(db.raw('total'))
						.then(function (views){
							resolve( views.reverse() )
						})
						.catch(reject)
				})
			},

			//
			// Returns a profiles total number of AC scans over a specific period
			//
			scans: function (profileID, interval, datapoints) {
				return new Promise(function (resolve, reject) {
					interval = interval.toUpperCase();
					var dateFormat = interval === 'DAY' ? '%Y-%m-%d' : interval === 'WEEK' ? '%Y-%u' : '%Y-%m';

					var join = 'AnalyticEvents AS av ON av.ProfileID ' + (Array.isArray(profileID) ? 'IN (' + profileID.join(',') + ')' : '=' + profileID) + ' AND' +
							' DATE_FORMAT(DATE_SUB(NOW(), INTERVAL (i.ID - 1) ' + interval +'), \'' + dateFormat + '\')' +
							' = DATE_FORMAT(av.created_at, \'' + dateFormat + '\')';

					db.select(db.raw('COUNT(av.ID) AS total'))
						.from('Integers AS i')
						.leftJoin(db.raw(join))
						.where('av.EventID', 2)
						.orWhereNull('av.ID')
						.groupBy('i.ID')
						.limit(datapoints)
						.pluck(db.raw('total'))
						.then(function (views){
							resolve( views.reverse() )
						})
						.catch(reject)
				})
			},

			//
			// Returns a profiles total artworks that have been shortlisted over a specific period
			//
			shortlisted: function (profileID, interval, datapoints) {
				return new Promise(function (resolve, reject) {
					interval = interval.toUpperCase();
					var dateFormat = interval === 'DAY' ? '%Y-%m-%d' : interval === 'WEEK' ? '%Y-%u' : '%Y-%m';

					var join = 'AnalyticEvents AS av ON av.ProfileID ' + (Array.isArray(profileID) ? 'IN (' + profileID.join(',') + ')' : '=' + profileID) + ' AND' +
						' DATE_FORMAT(DATE_SUB(NOW(), INTERVAL (i.ID - 1) ' + interval +'), \'' + dateFormat + '\')' +
						' = DATE_FORMAT(av.created_at, \'' + dateFormat + '\')';

					db.select(db.raw('COUNT(av.ID) AS total'))
						.from('Integers AS i')
						.leftJoin(db.raw(join))
						.where('av.EventID', 15)
						.orWhereNull('av.ID')
						.groupBy('i.ID')
						.limit(datapoints)
						.pluck(db.raw('total'))
						.then(function (views){
							resolve( views.reverse() )
						})
						.catch(reject)
				})

			},

			//
			// Returns a profiles total number of artworks over a specific period
			//
			total: function (profileID, interval, datapoints) {
				return new Promise(function (resolve, reject) {
					var join = 'Artworks AS a ON a.ArtistProfileID ' + (Array.isArray(profileID) ? 'IN (' + profileID.join(',') + ')' : '=' + profileID) +
							' AND (a.Deleted = 0 OR DATE_SUB(NOW(), INTERVAL (i.ID - 1) ' + interval.toUpperCase() + ') < a.updated_at)' +
							' AND DATE_SUB(NOW(), INTERVAL (i.ID - 1) ' + interval.toUpperCase() + ') > a.created_at';

					db.select(db.raw('COUNT(a.ID) AS total'))
						.from('Integers AS i')
						.leftJoin(db.raw(join))
						.groupBy('i.ID')
						.limit(datapoints)
						.pluck(db.raw('total'))
						.then(function (views){
							return resolve( views.reverse() );
						})
						.catch(reject)
				})
			},

			//
			// Returns a profiles total number artwork views over a specific period
			//
			views: function (profileID, interval, datapoints) {
				return new Promise(function (resolve, reject) {
					interval = interval.toUpperCase();
					var dateFormat = interval === 'DAY' ? '%Y-%m-%d' : interval === 'WEEK' ? '%Y-%u' : '%Y-%m';

					var join = 'AnalyticEvents AS av ON av.ProfileID ' + (Array.isArray(profileID) ? 'IN (' + profileID.join(',') + ')' : '=' + profileID) + ' AND' +
							' DATE_FORMAT(DATE_SUB(NOW(), INTERVAL (i.ID - 1) ' + interval +'), \'' + dateFormat + '\')' +
							' = DATE_FORMAT(av.created_at, \'' + dateFormat + '\')';

					db.select(db.raw('COUNT(av.ID) AS total'))
						.from('Integers AS i')
						.leftJoin(db.raw(join))
						.where('av.EventID', 7)
						.orWhereNull('av.ID')
						.groupBy('i.ID')
						.limit(datapoints)
						.pluck(db.raw('total'))
						.then(function (views){
							resolve( views.reverse() )
						})
						.catch(reject)
				})
			}
		}


	},


	profile: {

		count: {

			//
			// Returns a profiles total views
			//
			views: function (profileID) {
				return new Promise(function (resolve, reject) {
					var where = 'EventID = 18 AND ProfileID ' + (Array.isArray(profileID) ? 'IN (' + profileID.join(',') + ')' : '=' + profileID);

					db('AnalyticEvents').whereRaw(where).count('ID as total')
						.then(function (views){
							resolve(views[0].total)
						})
						.catch(reject);
				})
			}

		},

		interval: {

			//
			// Returns a profiles total views over a specific period
			//
			views: function (profileID, interval, datapoints) {
				return new Promise(function (resolve, reject) {
					interval = interval.toUpperCase();
					var dateFormat = interval === 'DAY' ? '%Y-%m-%d' : interval === 'WEEK' ? '%Y-%u' : '%Y-%m';

					var join = 'AnalyticEvents AS av ON av.ProfileID ' + (Array.isArray(profileID) ? 'IN (' + profileID.join(',') + ')' : '=' + profileID) +
							' AND DATE_FORMAT(DATE_SUB(NOW(), INTERVAL (i.ID - 1) ' + interval +
							'), \'' + dateFormat + '\') = DATE_FORMAT(av.created_at, \'' + dateFormat + '\')';

					db.select(db.raw('COUNT(av.ID) AS total'))
						.from('Integers AS i')
						.leftJoin(db.raw(join))
						.where('av.EventID', 18)
						.orWhereNull('av.ID')
						.groupBy('i.ID')
						.limit(datapoints)
						.pluck(db.raw('total'))
						.then(function (views){
							resolve( views.reverse() )
						})
						.catch(reject)
				})
			}

		},

		viewed: {

			//
			// Returns a details of profiles that have viewed a specific profile
			//
			details: function (profileID) {
				return new Promise(function (resolve, reject) {
					db.distinct(
						'p.ID',
						'p.ImageURI',
						'p.Name',
						db.raw('IF (g.ID IS NOT NULL, \'Gallery\', IF (a.ID IS NOT NULL, \'Artist\', IF (c.ID IS NOT NULL, \'Consumer\', \'\'))) as Type')
					)
					.from('AnalyticEvents as ae')
					.join('Profiles as p', 'ae.UserProfileID', 'p.ID')
					.leftJoin('Galleries as g', 'p.id', 'g.ProfileID')
					.leftJoin('Artists as a', 'p.id', 'a.ProfileID')
					.leftJoin('Consumers as c', 'p.id', 'c.ProfileID')
					.where({ 'ae.EventID': 18, 'ae.ProfileID': profileID })
					.orderBy('ae.created_at', 'desc')
					.then(function (views) {
						views.forEach(function (v) {
							if (!v.ImageURI) {
								v.ImageURI = config.profile.defaultImage;
							}
						});
						resolve(views)
					})
					.catch(reject);
				})
			}

		}

	},


	social: {

		count: {

			//
			// Returns a profiles total followers
			//
			followers: function (profileID) {
				return new Promise(function (resolve, reject) {
					db.count('f.ID as total')
						.from('Followers as f')
						.where('f.FollowingProfileID', profileID)
						.then(function (followers){
							return resolve(followers[0].total);
						})
						.catch(reject);
				})
			}

		},

		interval: {

			//
			// Returns a profiles total followers over a specific period
			//
			followers: function () {
				return new Promise(function (resolve, reject) {
					//var interval = req.params.interval,
					//		datapoints = Math.min( Math.max( 1, parseInt(req.params.datapoints) || 15 ), 100 )
					//
					//if(['day', 'week', 'month'].indexOf(interval) == -1) return res.status(400).json({ Message: 'Interval must be one of day / week / month' })
					//
					//var join
					//switch (interval) {
					//	case 'day':
					//		join = 'Followers AS f ON DATE_FORMAT(DATE_SUB(NOW(), INTERVAL (i.ID - 1) DAY), \'%Y-%m-%d\') = DATE_FORMAT(f.created_at, \'%Y-%m-%d\')'
					//		break
					//
					//	case 'week':
					//		join = 'Followers AS f ON DATE_FORMAT(DATE_SUB(NOW(), INTERVAL (i.ID - 1) WEEK), \'%Y-%u\') = DATE_FORMAT(f.created_at, \'%Y-%u\')'
					//		break
					//
					//	case 'month':
					//		join = 'Followers AS f ON DATE_FORMAT(DATE_SUB(NOW(), INTERVAL (i.ID - 1) MONTH), \'%Y-%m\') = DATE_FORMAT(f.created_at, \'%Y-%m\')'
					//}
					//
					//db.select(db.raw('COUNT(f.ID) AS total'))
					//		.from('Integers AS i')
					//		.leftJoin(db.raw(join))
					//		.where('f.FollowingProfileID', '=', user.ProfileID)
					//		.orWhereNull('f.ID')
					//		.groupBy('i.ID')
					//		.limit(datapoints)
					//		.pluck(db.raw('total'))
					//		.then(function (followers){
					//
					//			return res.json( followers.reverse() )
					//
					//		})
					//		.catch(function (err){
					//
					//			res.status(500).json({ 'Message': 'Error fetching follower stats over time' })
					//
					//		})
				})
			}

		}

	},


	//
	// Returns important notifications for the specified profile
	//
	notifications: function (profileID) {
		return new Promise(function (resolve, reject) {

			db.first('a.ID as ArtistID', 'g.ID as GalleryID')
				.from('Profiles as p')
				.leftJoin('Artists as a', 'a.ProfileID', 'p.ID')
				.leftJoin('Galleries as g', 'g.ProfileID', 'p.ID')
				.where('p.ID', profileID)
				.then(function (profile) {

					// util method to load any associated additional records for each notification returned (e.g. list of tasks)
					var loadAssociatedRecords = function (notifications) {
						return new Promise(function (resolve, reject) {

							var checked = 0,
								complete = function () {
									checked += 1;
									if (checked >= notifications.length) {
										resolve(notifications);
									}
								};

							notifications.forEach(function (notification) {

								switch (notification.Type) {
									case 'Task':

										var _where = { 't.TaskGroupID': notification.TaskGroupID };
										if (profile.ArtistID) {
											_where['t.Artist'] = true;
										}
										if (profile.GalleryID) {
											_where['t.Gallery'] = true;
										}

										db.select('t.Description', 'tc.ID')
											.from('Tasks as t')
											.leftJoin(db.raw('TasksCompleted as tc on t.ID = tc.TaskID and tc.ProfileID = ' + profileID))
											.where(_where)
											.then(function (tasks) {
												if (tasks) {
													tasks.forEach(function (task) {
														task.Complete = !!task.ID;
														delete task.ID;
													});
												}
												notification.Tasks = tasks || [];
												complete();
											})
											.catch(reject);
										break;

									default: complete(); break;
								}


							});

							if (!notifications.length) {
								complete();
							}
						});
					};
			
					// get 'sticky' notifications first
					return db.select(
						'n.ID',
						'n.Subject',
						'n.Body',
						'n.Sticky',
						'n.ConnectionID',
						'n.MessageThreadID',
						'n.TaskGroupID',
						'np.ID as Priority',
						'np.Description as PriorityDescription',
						'nt.Type',
						'n.SentDate'
					)
					.from('Notifications as n')
					.join('NotificationTypes as nt', 'n.TypeID', 'nt.ID')
					.join('NotificationPriority as np', 'n.PriorityID', 'np.ID')
					.where({ 'n.ProfileID': profileID, 'n.Sticky' : true })
					.orderBy('n.SentDate', 'desc')
					.limit(4)
					.then(function (sticky) {

						// retrieve less important notifications if we don't have enough to return yet
						if (sticky.length < 6) {
							return db.select(
								'n.ID',
								'n.Subject',
								'n.Body',
								'n.Sticky',
								'n.ConnectionID',
								'n.MessageThreadID',
								'np.ID as Priority',
								'np.Description as PriorityDescription',
								'nt.Type',
								'n.SentDate'
							)
							.from('Notifications as n')
							.join('NotificationTypes as nt', 'n.TypeID', 'nt.ID')
							.join('NotificationPriority as np', 'n.PriorityID', 'np.ID')
							.where({ 'n.ProfileID': profileID, 'n.Sticky': false, 'n.ReadDate': null })
							.orderBy('n.SentDate', 'desc')
							.limit(6 - sticky.length)
							.then(function (additional) {
								return loadAssociatedRecords(sticky.concat(additional)).then(resolve)
							})
						}
						else {

							return loadAssociatedRecords(sticky)
									.then(resolve)
						}
					})

				})
				.catch(reject);
		})
	}

};