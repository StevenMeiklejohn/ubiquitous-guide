var router = require('express').Router(),
	SqlString = require('knex/lib/query/string'),
	Promise = require('bluebird'),
	AccessToken = require('../../auth/access-token'),
	Notification = require('../lib/notification'),
	Message = require('../lib/message');



router


	// list notification priorities
	.get('/priorities', function (req, res) {

		db.select(
			'ID',
			'Description'
		)
		.from('NotificationPriority')
		.orderBy('ID', 'asc')
		.then(function (data) {
			res.json(data);
		})
		.catch(function (err) {
			logError(err, req, function () {
				res.status(500).json({ 'Message': 'Error fetching notification priorities' });
			});
			
		})

	})


	// list notification types
	.get('/types', function (req, res) {

		db.select(
			'ID',
			'Type'
		)
		.from('NotificationTypes')
		.orderBy('Type', 'asc')
		.then(function (data) {
			res.json(data);
		})
		.catch(function (err) {
			logError(err, req, function () {
				res.status(500).json({ 'Message': 'Error fetching notification types' });
			});
		})

	})


	// unread notifications
	.get('/unread', function (req, res){

		// check current user
		AccessToken.getUser(req).then(function (user) {

			if(!user) return res.status(500).json({ Message: 'Current user could not be determined' })

			db('Notifications').count('ID as total').where({ ProfileID: user.ProfileID, Deleted: 0 }).whereNull('ReadDate')
			.then(function (data){
				return res.json({ 'Unread': data[0].total })
			})
			.catch(function (err) {
				logError(err, req, function () {
					res.status(500).json({ 'Message': 'Error fetching unread notification total' });
				});
			})

		})

	})





	// mark notifications as read
	.get('/:notificationID/read', function (req, res){

		AccessToken.getUser(req).then(function (user) {

			// check the notificationID
			var notificationID = parseInt(req.params.notificationID);
			if(isNaN(notificationID)){
				return res.status(400).json({ 'Message': 'Invalid notification id: ' + req.params.notificationID })
			}

			db('Notifications').first('ProfileID').where({ ID: notificationID })
				.then(function(notification){

					if (!notification) {
						res.status(404).json({ 'Message': 'Not Found' });
					}
					else if (notification.ProfileID != user.ProfileID) {
						res.status(403).json({ 'Message': 'You do not have permission to update this notification' })
					}
					else {
						return Notification.read(user.ProfileID, notificationID)
							.then(function () {
								res.json({ 'Message': 'Success' });
							});
					}

				})
				.catch(function (){
					res.status(500).json({ 'Message': 'Error updating notification' })
				})

		})

	})





	// mark notifications as hidden / deleted
	.get('/:notificationID/hide', function (req, res){

		// check current user
		AccessToken.getUser(req).then(function (user) {

			if(!user) return res.status(500).json({ Message: 'Current user could not be determined' })

			// check the notificationID
			var notificationID = parseInt(req.params.notificationID)
			if(isNaN(notificationID)){

				// invalid notificationID
				return res.status(400).json({ 'Message': 'Invalid notification id: ' + req.params.notificationID })

			}

			db('Notifications').first('ProfileID').where({ ID: notificationID })
			.then(function(notification){

				if(!notification){

					// notification doesn't exist
					return res.status(404).json({ 'Message': 'Not Found' })

				}
				else if(notification.ProfileID != user.ProfileID){

					// notification doesn't belong to user
					return res.status(403).json({ 'Message': 'You do not have permission to update this notification' })

				}

				// mark notification as hidden / deleted
				db('Notifications').where({ ID: notificationID }).update('Deleted', 1)
				.then(function (update){

					// success
					return res.json({ 'Message': 'Success' })

				})
				.catch(function (err){

					// something stinky
					return res.status(500).json({ 'Message': 'Error updating notification' })

				})
				

			})
			.catch(function (err){

				return res.status(500).json({ 'Message': 'Error fetching notification : ' + notificationID })

			})

		});

	})



	.get('/:notificationID', function (req, res) {

		// check current user
		AccessToken.getUser(req).then(function (user) {

			if (!user) return res.status(500).json({ Message: 'Current user could not be determined' })

			// check the notificationID
			var notificationID = parseInt(req.params.notificationID);
			if (isNaN(notificationID)) {
				return res.status(400).json({ 'Message': 'Invalid notification id: ' + req.params.notificationID })
			}


			// util method to load any associated additional records for each notification returned (e.g. list of tasks)
			var loadAssociatedRecords = function (notification) {
				return new Promise(function (resolve, reject) {
	
					switch (notification.Type) {
						case 'Task':

							var _where = { 't.TaskGroupID': notification.TaskGroupID };
							if (user.ArtistID) {
								_where['t.Artist'] = true;
							}
							if (user.GalleryID) {
								_where['t.Gallery'] = true;
							}

							db.select('t.Description', 'tc.ID', 'tc.created_at as CompleteDate')
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
								resolve(notification);
							})
							.catch(reject);
							break;

						case 'Message':

							Message.loadThread(notification.MessageID)
								.then(function(thread) {
									notification.Messages = thread;
									resolve(notification);
								})
								.catch(reject);

							break;

						default: resolve(notification); break;
					}

				});
			};



			db.first(
				'n.*',
				'nt.Type'
			)
			.from('Notifications as n')
			.join('NotificationTypes as nt', 'n.TypeID', 'nt.ID')
			.where({ 'n.ID': notificationID })
			.then(function (notification) {

				if (!notification) {
					return res.status(404).json({ 'Message': 'Not Found' })
				}
				else if (notification.ProfileID != user.ProfileID) {
					return res.status(403).json({ 'Message': 'You do not have permission to view this notification' })
				}
				else {
					return loadAssociatedRecords(notification)
						.then(function (notification) {
							res.json(notification);
						})
				}

			})
			.catch(function (err) {
				logError(err, req, function () {
					return res.status(500).json({ 'Message': 'Error fetching notification : ' + notificationID });
				});
			})

		})

	})




	// notification search
	.post('/search', function (req, res){

		// check current user
		AccessToken.getUser(req).then(function (user) {

			if(!user) return res.status(500).json({ Message: 'Current user could not be determined' })

			var pagination = req.body.Pagination || {},
			filters = req.body.Filters || {},
			sort = req.body.Sort || {},
			pageSize = Math.min( Math.max( 1, parseInt(pagination.PageSize) || 10 ), 100 ),
			pageNum = parseInt(pagination.PageNumber) || 0,
			// send pagination data back with results
			pagination = { PageSize: pageSize, PageNumber: pageNum }

			// build SQL with filters
			var sql =
				'FROM Notifications n ' +
				'JOIN NotificationPriority as np on n.PriorityID = np.ID ' +
				'JOIN NotificationTypes as nt on n.TypeID = nt.ID ' +
				'WHERE n.ProfileID = ' + user.ProfileID + ' ' +
				'AND n.Deleted = 0'
	
			if (filters.Subject) {
				sql += ' AND n.Subject LIKE ' + SqlString.escape('%' + filters.Subject + '%');
			}
			if (filters.Body) {
				sql += ' AND n.Body LIKE ' + SqlString.escape('%' + filters.Body + '%');
			}
			if (filters.Search) {
				sql += ' AND (n.Body LIKE ' + SqlString.escape('%' + filters.Search + '%') + ' OR n.Subject LIKE ' + SqlString.escape('%' + filters.Search + '%') + ')';
			}
			if (filters.Read !== undefined) {
				sql += ' AND n.ReadDate IS ' + (filters.Read ? 'NOT' : '') + ' NULL';
			}
			if (!isNaN(filters.Type)) {
				sql += ' AND n.TypeID = ' + filters.Type;
			}

			// sort order
			switch (sort.Field) {
				case 'Priority':
					sql += ' ORDER BY np.ID DESC';
					break;
				default:
					sql += ' ORDER BY n.SentDate DESC';
					break;
			}
			sql += ', n.Subject ASC'
			

			// execute query
			db.first(db.raw(

				// total results
				'COUNT(DISTINCT n.ID) AS results ' + sql

			))
			.then(function (total) {

				dbNest(
					db.select(db.raw(
						'n.ID AS _ID, ' +
						'n.Subject AS _Subject, ' +
						'n.Body AS _Body, ' +
						'n.PriorityID AS _PriorityID, ' +
						'n.TypeID AS _TypeID, ' +
						'n.SentDate AS _SentDate, ' +
						'n.ReadDate AS _ReadDate, ' +
						'np.ID as _Priority, ' +
						'np.Description as _PriorityDescription, ' +
						'nt.Type as _Type ' +
						//'DATE_FORMAT(n.SentDate, \'%d/%m/%Y %HH:%MM\') AS _SentDate, ' +
						//'DATE_FORMAT(n.ReadDate, \'%d/%m/%Y\') AS _ReadDate ' +
						sql
					))
					.offset(pageSize * pageNum)
					.limit(pageSize)
				)
				.then(function (data) {

					// success
					pagination.TotalResults = total.results
					res.json({
						Data: data || [],
						Pagination: pagination
					})

				})
				.catch(function (err) {
					logError(err, req, function () {
						res.status(500).json({ 'Message': 'Error retrieving notifications from database' });
					});
				})

			})
			.catch(function (err) {
				logError(err, req, function () {
					res.status(500).json({ 'Message': 'Error retrieving notifications from database' });
				});
			})

		}) // current user

	})





module.exports = router