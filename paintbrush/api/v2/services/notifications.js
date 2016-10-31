var	config = require('../config'),
	Promise = require('bluebird'),
	AccessToken = require('../../auth/access-token'),
	Notification = require('../lib/notification'),
	Message = require('../lib/message'),
	Permission = require('../lib/permission'),
	SqlString = require('knex/lib/query/string');


module.exports = {

	count: {

		unread: function (profileID) {
			return new Promise(function(resolve, reject) {
				db('Notifications').count('ID as total')
					.where({ ProfileID: profileID, Deleted: 0 }).whereNull('ReadDate')
					.then(function (data) {
						resolve(data[0].total);
					})
					.catch(reject)
			})
		}

	},


	get: function (notificationID) {
		return new Promise(function(resolve, reject) {

			// util method to load any associated additional records for each notification returned (e.g. list of tasks)
			var loadAssociatedRecords = function (notification) {
				return new Promise(function (_resolve, _reject) {
					switch (notification.Type) {
						case 'Task':

							var _where = { 't.TaskGroupID': notification.TaskGroupID };
							if (notification.ArtistID) {
								_where['t.Artist'] = true;
							}
							if (notification.GalleryID) {
								_where['t.Gallery'] = true;
							}

							db.select('t.Description', 'tc.ID', 'tc.created_at as CompleteDate')
							.from('Tasks as t')
							.leftJoin(db.raw('TasksCompleted as tc on t.ID = tc.TaskID and tc.ProfileID = ' + notification.ProfileID))
							.where(_where)
							.then(function (tasks) {
								if (tasks) {
									tasks.forEach(function (task) {
										task.Complete = !!task.ID;
										delete task.ID;
									});
								}
								notification.Tasks = tasks || [];
								_resolve(notification);
							})
							.catch(_reject);
							break;

						case 'Message':

							Message.loadThread(notification.MessageID)
								.then(function(thread) {
									notification.Messages = thread;
									_resolve(notification);
								})
								.catch(_reject);

							break;

						default: _resolve(notification); break;
					}

				});
			};

			db.first(
				'n.*',
				'nt.Type',
				'a.ID as ArtistID',
				'g.ID as GalleryID',
				'p.Name as ToProfile'
			)
			.from('Notifications as n')
			.join('NotificationTypes as nt', 'n.TypeID', 'nt.ID')
			.join('Profiles as p', 'n.ProfileID', 'p.ID')
			.leftJoin('Artists as a', 'a.ProfileID', 'n.ProfileID')
			.leftJoin('Galleries as g', 'g.ProfileID', 'n.ProfileID')
			.where({ 'n.ID': notificationID })
			.then(function (notification) {
				return loadAssociatedRecords(notification).then(resolve);
			})
			.catch(reject)
		})
	},


	list: {

		priorities: function () {
			return new Promise(function(resolve, reject) {
				db.select(
					'ID',
					'Description'
				)
				.from('NotificationPriority')
				.orderBy('ID', 'asc')
				.then(resolve)
				.catch(reject)
			})
		},

		types: function () {
			return new Promise(function(resolve, reject) {
				db.select(
					'ID',
					'Type'
				)
				.from('NotificationTypes')
				.orderBy('Type', 'asc')
				.then(resolve)
				.catch(reject)
			})
		},

		recipients: function (profileID) {
			return new Promise(function(resolve, reject) {
				db.first(db.raw('coalesce(a.UserID, gu.UserID, c.UserID) as UserID'))
					.from('Profiles as p')
					.leftJoin('Artists as a', 'a.ProfileID', 'p.ID')
					.leftJoin('Galleries as g', 'g.ProfileID', 'p.ID')
					.leftJoin('GalleryUsers as gu', 'gu.GalleryID', 'g.ID')
					.leftJoin('Consumers as c', 'c.ProfileID', 'p.ID')
					.where('p.ID', profileID)
					.then(function (user) {
						return Permission.Profile.list('notification.view', user.UserID).then(function (profiles) {
							return db.select('ID', 'Name')
								.from('Profiles')
								.whereIn('ID', profiles)
								.orderBy('Name')
								.then(resolve);
						});
					})
					.catch(reject);
			})
		}

	},


	markAsRead: function (notificationID) {
		return new Promise(function(resolve, reject) {
			db('Notifications').first('ProfileID').where({ ID: notificationID })
				.then(function(notification){
					return Notification.read(notification.ProfileID, notificationID).then(resolve);
				})
				.catch(reject)
		})
	},


	owner: function (notificationID) {
		return new Promise(function(resolve, reject) {
			db('Notifications').first('ProfileID').where({ ID: notificationID })
				.then(resolve)
				.catch(reject);
		})
	},

	remove: function (notificationID) {
		return new Promise(function(resolve, reject) {
			db('Notifications').where({ ID: notificationID }).update('Deleted', 1)
				.then(resolve)
				.catch(reject)
		})
	},


	search: function (profileID, filters, pagination, sort) {
		return new Promise(function(resolve, reject) {

			var sent = !!filters.Sent;

			// build SQL with filters
			var sql =
				'FROM Notifications n ' +
				'JOIN Profiles as p ON n.ProfileID = p.ID ' +
				'JOIN NotificationPriority as np ON n.PriorityID = np.ID ' +
				'JOIN NotificationTypes as nt ON n.TypeID = nt.ID ' +
				'LEFT JOIN Messages as m2 ON n.MessageID = m2.ID ' +
				'LEFT JOIN Profiles ps on m2.SenderProfileID = ps.ID ';

			if (sent) {
				sql += 'JOIN Messages as m ON n.MessageID = m.ID ' +
					'WHERE m.SenderProfileID ' + (Array.isArray(profileID) ? 'IN (' + profileID.join(',') + ')' : '=' + profileID) + ' ';
			}
			else {
				sql += 'WHERE n.ProfileID ' + (Array.isArray(profileID) ? 'IN (' + profileID.join(',') + ')' : '=' + profileID) + ' ';
			}
			sql += ' AND n.Deleted = 0 ';

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
			if (filters.TypeID) {
				sql += ' AND n.TypeID = ' + filters.TypeID;
			}
			if (filters.RecipientID) {
				sql += ' AND n.ProfileID = ' + filters.RecipientID;
			}
			if (filters.Priority) {
				sql += ' AND n.PriorityID = ' + filters.Priority;
			}
			else if (filters.Importance) {
				sql += ' AND n.PriorityID = ' + filters.Importance;
			}

			var direction = (sort.Direction || '').toLowerCase() === 'asc' ? 'ASC': 'DESC';

			// sort order
			switch (sort.Field) {
				case 'Priority':
					sql += ' ORDER BY np.ID ' + direction;
					break;
				case 'Recipient':
					sql += ' ORDER BY p.Name ' + direction;
					break;
				case 'PriorityDescription':
					sql += ' ORDER BY np.Description ' + direction;
					break;
				case 'Subject':
					sql += ' ORDER BY n.Subject ' + direction;
					break;
				case 'Type':
					sql += ' ORDER BY nt.Type ' + direction;
					break;
				default:
					sql += ' ORDER BY n.SentDate ' + direction;
					break;
			}
			sql += ', n.Subject ASC, n.SentDate DESC';

			// execute query
			db.first(db.raw(
				'COUNT(DISTINCT n.ID) AS results ' + sql
			))
			.then(function (total) {
				return db.select(db.raw(
					'n.ID, ' +
					'n.Subject, ' +
					'n.Body, ' +
					'n.PriorityID, ' +
					'n.TypeID, ' +
					'n.SentDate, ' +
					'n.ReadDate, ' +
					'np.ID as Priority, ' +
					'np.Description as PriorityDescription, ' +
					'nt.Type, ' +
					'p.Name as Recipient, ' +
					'p.ImageURI as RecipientImageURI, ' +
					'ps.Name as Sender, ' +
					'ps.ImageURI as SenderImageURI ' +
					sql
				))
				.offset(pagination.PageSize * pagination.PageNumber)
				.limit(pagination.PageSize)
				.then(function (data) {
					pagination.TotalResults = total.results;
					resolve({
						Data: (data || []).map(function(item){
							if (!item.Sender)
							{
								item.Sender = 'Art Retail Network';
								item.SenderImageURI = config.site.baseURL + '/img/logo-new-120-sq.png';
							}
							return item;
						}),
						Pagination: pagination
					})

				})
			})
			.catch(reject);

		})
	}

};