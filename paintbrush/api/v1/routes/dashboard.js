var config = require('../config'),
	router = require('express').Router(),
	AccessToken = require('../../auth/access-token'),
	Promise = require('bluebird');



router




	// Most Popular Artwork
	.get('/popular/artwork', function (req, res) {

		// check current user
		AccessToken.getUser(req).then(function (user) {

			if (!user) return res.status(500).json({ Message: 'Current user could not be determined' })

			db.select(
				'a.ID',
				'a.Name',
				'a.ImageURI',
				'a.Views',
				'a.Likes',
				'a.ActivCanvasEnabled'
			)
			.from('Artworks as a')
			.whereRaw('(a.OwnerProfileID = ' + user.ProfileID + ' OR a.ArtistProfileID = ' + user.ProfileID + ') AND a.ImageURI <> \'\' AND a.Deleted = 0')
			.orderBy('a.Views')
			.limit(25)
			.then(function (data) {
				return res.json(data);
			})
			.catch(function (err) {
				logError(err, req, function () {
					res.status(500).json({ Message: 'Error fetching popular artwork' })
				});
			})

		})
	})



	// Total Artworks
	.get('/total/artwork', function (req, res) {

		// check current user
		AccessToken.getUser(req).then(function (user) {

			if(!user) return res.status(500).json({ Message: 'Current user could not be determined' });

			db.count('a.ID as total')
				.from('Artworks as a')
				.where({'a.ArtistProfileID': user.ProfileID, Deleted: 0 })
				.then(function (artworks){
					res.json({ 'Count': artworks[0].total })
				})
				.catch(function (err){
					res.status(500).json({ 'Message': 'Error fetching total artworks' })
				})
		})
	})



	// Total Artworks Over Time
	.get('/total/artwork/:interval/:datapoints?', function (req, res) {

		// check current user
		AccessToken.getUser(req).then(function (user) {

			if(!user) return res.status(500).json({ Message: 'Current user could not be determined' });

			var interval = req.params.interval,
				datapoints = Math.min( Math.max( 1, parseInt(req.params.datapoints) || 15 ), 100 );

			if(['day', 'week', 'month'].indexOf(interval) == -1) return res.status(400).json({ Message: 'Interval must be one of day / week / month' })

			var join = 'Artworks AS a ON a.ArtistProfileID = ' + user.ProfileID +
					' AND (a.Deleted = 0 OR DATE_SUB(NOW(), INTERVAL (i.ID - 1) ' + interval.toUpperCase() + ') < a.updated_at)' +
					' AND DATE_SUB(NOW(), INTERVAL (i.ID - 1) ' + interval.toUpperCase() + ') > a.created_at';

			db.select(db.raw('COUNT(a.ID) AS total'))
					.from('Integers AS i')
					.leftJoin(db.raw(join))
					.groupBy('i.ID')
					.limit(datapoints)
					.pluck(db.raw('total'))
					.then(function (views){
						return res.json( views.reverse() );
					})
					.catch(function (err){

						res.status(500).json({ 'Message': 'Error fetching artworks over time' });

					})

		})
	})



	//
	// Artwork Scans
	//
	.get('/scans/artwork', function (req, res) {

		AccessToken.getUser(req).then(function (user) {

			if (!user.ArtistID) {
				res.json({ Count: 0 })
			}
			else {
				db('AnalyticEvents').where({ EventID: 2, ArtistID: user.ArtistID }).count('ID as total')
					.then(function (result){
						res.json({ Count: result[0].total })
					})
					.catch(function (err){
						console.error(err);
						res.status(500).json({ Message: 'Error fetching artwork scans' })
					});
			}

		})

	})




	//
	// Artwork Scans Over Time
	//
	.get('/scans/artwork/:interval/:datapoints?', function (req, res) {

		// check current user
		AccessToken.getUser(req).then(function (user) {

			if(!user) return res.status(500).json({ Message: 'Current user could not be determined' })

			var interval = req.params.interval,
					datapoints = Math.min( Math.max( 1, parseInt(req.params.datapoints) || 15 ), 100 );

			if(['day', 'week', 'month'].indexOf(interval) == -1) return res.status(400).json({ Message: 'Interval must be one of day / week / month' });

			var join;
			switch (interval) {
				case 'day':
					join = 'AnalyticEvents AS av ON av.ArtistID = ' + user.ArtistID + ' AND DATE_FORMAT(DATE_SUB(NOW(), INTERVAL (i.ID - 1) DAY), \'%Y-%m-%d\') = DATE_FORMAT(av.created_at, \'%Y-%m-%d\')';
					break;

				case 'week':
					join = 'AnalyticEvents AS av ON av.ArtistID = ' + user.ArtistID + ' AND DATE_FORMAT(DATE_SUB(NOW(), INTERVAL (i.ID - 1) WEEK), \'%Y-%u\') = DATE_FORMAT(av.created_at, \'%Y-%u\')';
					break;

				case 'month':
					join = 'AnalyticEvents AS av ON av.ArtistID = ' + user.ArtistID + ' AND DATE_FORMAT(DATE_SUB(NOW(), INTERVAL (i.ID - 1) MONTH), \'%Y-%m\') = DATE_FORMAT(av.created_at, \'%Y-%m\')';
					break;
			}


			db.select(db.raw('COUNT(av.ID) AS total'))
					.from('Integers AS i')
					.leftJoin(db.raw(join))
					//.leftJoin('Artworks as aw', 'aw.ID', 'av.ArtworkID')
					.where('av.EventID', 2)
					.orWhereNull('av.ID')
					.groupBy('i.ID')
					.limit(datapoints)
					.pluck(db.raw('total'))
					.then(function (views){
						return res.json( views.reverse() )
					})
					.catch(function (err){
						res.status(500).json({ 'Message': 'Error fetching artwork views over time' })
					})

		})
	})







		// Artwork Views
	.get('/views/artwork', function (req, res) {

		AccessToken.getUser(req).then(function (user) {

			if (!user.ArtistID) {
				res.json({ Count: 0 })
			}
			else {
				db('AnalyticEvents').where({ EventID: 7, ArtistID: user.ArtistID }).count('ID as total')
					.then(function (views){
						res.json({ Count: views[0].total })
					})
					.catch(function (err){
						console.error(err)
						res.status(500).json({ Message: 'Error fetching artwork views' })
					});
			}

		})

	})





	// Artwork Views Over Time
	.get('/views/artwork/:interval/:datapoints?', function (req, res) {

		// check current user
		AccessToken.getUser(req).then(function (user) {

			if(!user) return res.status(500).json({ Message: 'Current user could not be determined' })

			var interval = req.params.interval,
				datapoints = Math.min( Math.max( 1, parseInt(req.params.datapoints) || 15 ), 100 );

			if(['day', 'week', 'month'].indexOf(interval) == -1) return res.status(400).json({ Message: 'Interval must be one of day / week / month' });

			var join;
			switch (interval) {
				case 'day':
					join = 'AnalyticEvents AS av ON av.ArtistID = ' + user.ArtistID + ' AND DATE_FORMAT(DATE_SUB(NOW(), INTERVAL (i.ID - 1) DAY), \'%Y-%m-%d\') = DATE_FORMAT(av.created_at, \'%Y-%m-%d\')';
					break;

				case 'week':
					join = 'AnalyticEvents AS av ON av.ArtistID = ' + user.ArtistID + ' AND DATE_FORMAT(DATE_SUB(NOW(), INTERVAL (i.ID - 1) WEEK), \'%Y-%u\') = DATE_FORMAT(av.created_at, \'%Y-%u\')';
					break;

				case 'month':
					join = 'AnalyticEvents AS av ON av.ArtistID = ' + user.ArtistID + ' AND DATE_FORMAT(DATE_SUB(NOW(), INTERVAL (i.ID - 1) MONTH), \'%Y-%m\') = DATE_FORMAT(av.created_at, \'%Y-%m\')';
					break;
			}


			db.select(db.raw('COUNT(av.ID) AS total'))
			.from('Integers AS i')
			.leftJoin(db.raw(join))
			//.leftJoin('Artworks as aw', 'aw.ID', 'av.ArtworkID')
			.where('av.EventID', 7)
			.orWhereNull('av.ID')
			.groupBy('i.ID')
			.limit(datapoints)
			.pluck(db.raw('total'))
			.then(function (views){
				return res.json( views.reverse() )
			})
			.catch(function (err){
				res.status(500).json({ 'Message': 'Error fetching artwork views over time' })
			})

		})
	})





	// Artwork Likes
	.get('/likes/artwork', function (req, res) {

		// check current user
		AccessToken.getUser(req).then(function (user) {

			if(!user) return res.status(500).json({ Message: 'Current user could not be determined' })

			db.count('al.ID as total')
			.from('ArtworkLikes as al')
			.leftJoin('Artworks as aw', 'al.ArtworkID', 'aw.ID')
			.where('aw.ArtistProfileID', '=', user.ProfileID)
			.then(function (likes){

				return res.json({ 'Count': likes[0].total })

			})
			.catch(function (err){

				res.status(500).json({ 'Message': 'Error fetching artwork likes' })

			})

		})
	}) // Artwork Likes





	// Artwork Likes Over Time
	.get('/likes/artwork/:interval/:datapoints?', function (req, res) {

		// check current user
		AccessToken.getUser(req).then(function (user) {

			if(!user) return res.status(500).json({ Message: 'Current user could not be determined' })

			var interval = req.params.interval,
				datapoints = Math.min( Math.max( 1, parseInt(req.params.datapoints) || 15 ), 100 )

			if(['day', 'week', 'month'].indexOf(interval) == -1) return res.status(400).json({ Message: 'Interval must be one of day / week / month' })

			var join
			switch (interval) {
				case 'day':
					join = 'ArtworkLikes AS al ON DATE_FORMAT(DATE_SUB(NOW(), INTERVAL (i.ID - 1) DAY), \'%Y-%m-%d\') = DATE_FORMAT(al.created_at, \'%Y-%m-%d\')'
					break

				case 'week':
					join = 'ArtworkLikes AS al ON DATE_FORMAT(DATE_SUB(NOW(), INTERVAL (i.ID - 1) WEEK), \'%Y-%u\') = DATE_FORMAT(al.created_at, \'%Y-%u\')'
					break

				case 'month':
					join = 'ArtworkLikes AS al ON DATE_FORMAT(DATE_SUB(NOW(), INTERVAL (i.ID - 1) MONTH), \'%Y-%m\') = DATE_FORMAT(al.created_at, \'%Y-%m\')'
			}

			db.select(db.raw('COUNT(al.ID) AS total'))
			.from('Integers AS i')
			.leftJoin(db.raw(join))
			.leftJoin('Artworks as aw', 'aw.ID', 'al.ArtworkID')
			.where('aw.ArtistProfileID', '=', user.ProfileID)
			.orWhereNull('al.ID')
			.groupBy('i.ID')
			.limit(datapoints)
			.pluck(db.raw('total'))
			.then(function (likes){

				return res.json( likes.reverse() )

			})
			.catch(function (err){

				res.status(500).json({ 'Message': 'Error fetching artwork likes over time' })

			})

		})
	}) // Artwork Likes Over Time





	// Artwork Shortlisted
	.get('/shortlisted/artwork', function (req, res) {

		// check current user
		AccessToken.getUser(req).then(function (user) {

			if(!user) return res.status(500).json({ Message: 'Current user could not be determined' })

			db.count('sa.ID as total')
			.from('ShortlistArtworks as sa')
			.leftJoin('Artworks as aw', 'sa.ArtworkID', 'aw.ID')
			.where({ 'aw.ArtistProfileID': user.ProfileID })
			.then(function (shortlisted){

				return res.json({ 'Count': shortlisted[0].total })

			})
			.catch(function (err){

				res.status(500).json({ 'Message': 'Error fetching artwork shortlisted' })

			})

		})
	}) // Artwork Shortlisted





	// Artwork Shortlisted Over Time
	.get('/shortlisted/artwork/:interval/:datapoints?', function (req, res) {

		// check current user
		AccessToken.getUser(req).then(function (user) {

			if(!user) return res.status(500).json({ Message: 'Current user could not be determined' })

			var interval = req.params.interval,
				datapoints = Math.min( Math.max( 1, parseInt(req.params.datapoints) || 15 ), 100 )

			if(['day', 'week', 'month'].indexOf(interval) == -1) return res.status(400).json({ Message: 'Interval must be one of day / week / month' })

			var join
			switch (interval) {
				case 'day':
					join = 'ShortlistArtworks AS sa ON DATE_FORMAT(DATE_SUB(NOW(), INTERVAL (i.ID - 1) DAY), \'%Y-%m-%d\') = DATE_FORMAT(sa.created_at, \'%Y-%m-%d\')'
					break

				case 'week':
					join = 'ShortlistArtworks AS sa ON DATE_FORMAT(DATE_SUB(NOW(), INTERVAL (i.ID - 1) WEEK), \'%Y-%u\') = DATE_FORMAT(sa.created_at, \'%Y-%u\')'
					break

				case 'month':
					join = 'ShortlistArtworks AS sa ON DATE_FORMAT(DATE_SUB(NOW(), INTERVAL (i.ID - 1) MONTH), \'%Y-%m\') = DATE_FORMAT(sa.created_at, \'%Y-%m\')'
			}

			db.select(db.raw('COUNT(sa.ID) AS total'))
			.from('Integers AS i')
			.leftJoin(db.raw(join))
			.leftJoin('Artworks as aw', 'aw.ID', 'sa.ArtworkID')
			.where('aw.ArtistProfileID', '=', user.ProfileID)
			.orWhereNull('sa.ID')
			.groupBy('i.ID')
			.limit(datapoints)
			.pluck(db.raw('total'))
			.then(function (shortlisted){

				return res.json( shortlisted.reverse() )

			})
			.catch(function (err){

				res.status(500).json({ 'Message': 'Error fetching artwork shortlisted over time' })

			})

		})
	}) // Artwork Shortlisted Over Time





	// Follower Stats
	.get('/followers', function (req, res) {

		// check current user
		AccessToken.getUser(req).then(function (user) {

			if(!user) return res.status(500).json({ Message: 'Current user could not be determined' })

			db.count('f.ID as total')
			.from('Followers as f')
			.where('f.FollowingProfileID', '=', user.ProfileID)
			.then(function (followers){

				return res.json({ 'Count': followers[0].total })

			})
			.catch(function (err){

				res.status(500).json({ 'Message': 'Error fetching follower stats' })

			})

		})
	}) // Follower Stats





	// Follower Stats Over Time
	.get('/followers/:interval/:datapoints?', function (req, res) {

		// check current user
		AccessToken.getUser(req).then(function (user) {

			if(!user) return res.status(500).json({ Message: 'Current user could not be determined' })

			var interval = req.params.interval,
				datapoints = Math.min( Math.max( 1, parseInt(req.params.datapoints) || 15 ), 100 )

			if(['day', 'week', 'month'].indexOf(interval) == -1) return res.status(400).json({ Message: 'Interval must be one of day / week / month' })

			var join
			switch (interval) {
				case 'day':
					join = 'Followers AS f ON DATE_FORMAT(DATE_SUB(NOW(), INTERVAL (i.ID - 1) DAY), \'%Y-%m-%d\') = DATE_FORMAT(f.created_at, \'%Y-%m-%d\')'
					break

				case 'week':
					join = 'Followers AS f ON DATE_FORMAT(DATE_SUB(NOW(), INTERVAL (i.ID - 1) WEEK), \'%Y-%u\') = DATE_FORMAT(f.created_at, \'%Y-%u\')'
					break

				case 'month':
					join = 'Followers AS f ON DATE_FORMAT(DATE_SUB(NOW(), INTERVAL (i.ID - 1) MONTH), \'%Y-%m\') = DATE_FORMAT(f.created_at, \'%Y-%m\')'
			}

			db.select(db.raw('COUNT(f.ID) AS total'))
			.from('Integers AS i')
			.leftJoin(db.raw(join))
			.where('f.FollowingProfileID', '=', user.ProfileID)
			.orWhereNull('f.ID')
			.groupBy('i.ID')
			.limit(datapoints)
			.pluck(db.raw('total'))
			.then(function (followers){

				return res.json( followers.reverse() )

			})
			.catch(function (err){

				res.status(500).json({ 'Message': 'Error fetching follower stats over time' })

			})

		})
	}) // Follower Stats Over Time




	// Connection Stats
	.get('/connections', function (req, res) {

		// check current user
		AccessToken.getUser(req).then(function (user) {

			if (!user) return res.status(500).json({ Message: 'Current user could not be determined' })

			db.count('c.ID as total')
			.from('Connections as c')
			.where(db.raw('c.Accepted = 1 and (c.ProfileID = ' + user.ProfileID + ' or c.ConnectedProfileID = ' + user.ProfileID + ')'))
			.then(function (connections) {
				res.json({ 'Count': connections[0].total })
			})
			.catch(function (err) {
				res.status(500).json({ 'Message': 'Error fetching connection stats' })
			})

		})
	})





	// Connection Stats Over Time
	.get('/connections/:interval/:datapoints?', function (req, res) {

		// check current user
		AccessToken.getUser(req).then(function (user) {

			if (!user) return res.status(500).json({ Message: 'Current user could not be determined' })

			var interval = req.params.interval,
				datapoints = Math.min(Math.max(1, parseInt(req.params.datapoints) || 15), 100)

			if (['day', 'week', 'month'].indexOf(interval) == -1) return res.status(400).json({ Message: 'Interval must be one of day / week / month' })

			var join
			switch (interval) {
				case 'day':
					join = 'Connections AS c ON DATE_FORMAT(DATE_SUB(NOW(), INTERVAL (i.ID - 1) DAY), \'%Y-%m-%d\') = DATE_FORMAT(c.created_at, \'%Y-%m-%d\')'
					break

				case 'week':
					join = 'Connections AS c ON DATE_FORMAT(DATE_SUB(NOW(), INTERVAL (i.ID - 1) WEEK), \'%Y-%u\') = DATE_FORMAT(c.created_at, \'%Y-%u\')'
					break

				case 'month':
					join = 'Connections AS c ON DATE_FORMAT(DATE_SUB(NOW(), INTERVAL (i.ID - 1) MONTH), \'%Y-%m\') = DATE_FORMAT(c.created_at, \'%Y-%m\')'
			}

			db.select(db.raw('COUNT(c.ID) AS total'))
			.from('Integers AS i')
			.leftJoin(db.raw(join))
			.where(db.raw('c.Accepted = 1 and (c.ProfileID = ' + user.ProfileID + ' or c.ConnectedProfileID = ' + user.ProfileID + ')'))
			.orWhereNull('c.ID')
			.groupBy('i.ID')
			.limit(datapoints)
			.pluck(db.raw('total'))
			.then(function (followers) {

				return res.json(followers.reverse())

			})
			.catch(function (err) {

				res.status(500).json({ 'Message': 'Error fetching connections stats over time' })

			})

		})
	}) 




	// Profile Views
	.get('/views/profile', function (req, res) {

		AccessToken.getUser(req).then(function (user) {

			db('AnalyticEvents').where({ EventID: 18, ProfileID: user.ProfileID }).count('ID as total')
				.then(function (views){
					res.json({ Count: views[0].total })
				})
				.catch(function (){
					res.status(500).json({ Message: 'Error fetching profile views' })
				});

		})

	})




	// Profile View Details
	.get('/views/profile/details', function (req, res) {

		AccessToken.getUser(req).then(function (user) {

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
				.where({ 'ae.EventID': 18, 'ae.ProfileID': user.ProfileID })
				.orderBy('ae.created_at', 'desc')
				.then(function (views) {

					views.forEach(function (v) {
						if (!v.ImageURI) {
							v.ImageURI = config.profile.defaultImage;
						}
					});

					return res.json(views)

				})
				.catch(function (err) {
					logError(err, req, function () {
						res.status(500).json({ 'Message': 'Error fetching profile views' })
					});
				});

		})
	})






	// Important Notifications
	.get('/notifications', function (req, res) {

		// check current user
		AccessToken.getUser(req).then(function (user) {

			console.log(user)

			if (!user) return res.status(500).json({ Message: 'Current user could not be determined' })

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
								if (user.ArtistID) {
									_where['t.Artist'] = true;
								}
								if (user.GalleryID) {
									_where['t.Gallery'] = true;
								}

								db.select('t.Description', 'tc.ID')
								.from('Tasks as t')
								.leftJoin(db.raw('TasksCompleted as tc on t.ID = tc.TaskID and tc.ProfileID = ' + user.ProfileID))
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
			db.select(
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
			.where({ 'n.ProfileID': user.ProfileID, 'n.Sticky' : true })
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
					.where({ 'n.ProfileID': user.ProfileID, 'n.Sticky': false, 'n.ReadDate': null })
					.orderBy('n.SentDate', 'desc')
					.limit(6 - sticky.length)
					.then(function (additional) {

						return loadAssociatedRecords(sticky.concat(additional))
							.then(function(notifications) {
								res.send(notifications);
							})
						
					})
				}
				else {

					return loadAssociatedRecords(sticky)
						.then(function (notifications) {
							res.send(notifications);
						})
				}
			})
			.catch(function (err) {
				logError(err, req, function () {
					res.status(500).json({ 'Message': 'Error fetching profile views' })
				});
			})

		})
	}) 









module.exports = router