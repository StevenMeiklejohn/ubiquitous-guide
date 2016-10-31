var Promise = require('bluebird'),
	Notification = require('../lib/notification'),
	extend = require('util')._extend;


var Task = {

	// checks if a profile has already completed the specifed task
	isComplete: function (profileID, key) {
		return new Promise(function (resolve, reject) {
			Task._isComplete(profileID, key)
				.then(function (result) {
					resolve(result[0]);
				})
				.catch(reject);
		});
	},

	_isComplete: function (profileID, key) {

		return new Promise(function (resolve, reject) {

			// check task exists
			dbNest(
				db.select(
					't.ID as _ID',
					't.TaskGroupID as _TaskGroupID',
					'tg.Artist as _Group_Artist',
					'tg.Gallery as _Group_Gallery',
					'tg.Consumer as _Group_Consumer'
				)
				.from('Tasks as t')
				.join('TaskGroups as tg', 't.TaskGroupID', 'tg.ID')
				.where({ 't.Key': key })
			)
			.then(function (_task) {
				var task = _task[0];

				if (!task) {
					reject({ Message: 'Task \'' + key + '\' was not found' });
				}
				else {

					// check profile exists
					return db.first(
						'p.ID',
						'a.ID as ArtistID',
						'g.ID as GalleryID'
					)
					.from('Profiles as p')
					.leftJoin('Artists as a', 'a.ProfileID', 'p.ID')
					.leftJoin('Galleries as g', 'g.ProfileID', 'p.ID')
					.where({ 'p.ID': profileID })
					.then(function (profile) {

						if (!profile) {
							reject({ Message: 'Profile not found' });
						}
						else {

							// check if the user has completed the task already
							return db.first('*')
							.from('TasksCompleted')
							.where({ ProfileID: profile.ID, TaskID: task.ID })
							.then(function (complete) {
								resolve([complete, profile, task])
							});
						}
					});
				}
			})
			.catch(reject);

		});

	},

	// marks a task as complete for the specified profile
	complete: function (profileID, key) {

		return new Promise(function (resolve, reject) {
			var profile, task;

			// check if profile has already completed the task
			Task._isComplete(profileID, key)
				.then(function (result) {

					profile = result[1];
					task = result[2];

					// mark task as completed
					if (!result[0]) {
						return db('TasksCompleted').insert({ ProfileID: profile.ID, TaskID: task.ID });
					}

				})
				.then(function () {

					var _where = {};
					if (profile.ArtistID) {
						_where.Artist = true;
					}
					if (profile.GalleryID) {
						_where.Gallery = true;
					}

					// get total number of tasks in the current task group
					return db.count('ID as total')
						.from('Tasks')
						.where(extend(_where, { TaskGroupID: task.TaskGroupID }))
						.then(function (tasks) {

							// get total number of completed tasks
							return db.count('tc.ID as total')
							.from('TasksCompleted as tc')
							.join('Tasks as t', 't.ID', 'tc.TaskID')
							.where(extend(_where, { 'tc.ProfileID': profile.ID, 't.TaskGroupID': task.TaskGroupID }))
							.then(function (completed) {

								// check if all tasks in group have been complete
								if (completed[0].total >= tasks[0].total) {

									// 'unstick' related notification 
									return db('Notifications')
									.where({ ProfileID: profile.ID, TaskGroupID: task.TaskGroupID })
									.update({ Sticky: false, ReadDate: new Date() })
									.then(function () {
										resolve();
									})

								}
								else {
									resolve();
								}

							})

						})

				})
				.catch(reject);

		});

	},


	// starts a new task group by creating a new task notification for the specified profile
	startGroup: function (profileID, key, sticky) {

		return new Promise(function (resolve, reject) {

			// check task group exists
			db.first('*')
			.from('TaskGroups')
			.where({ Key: key })
			.then(function (group) {
				if (!group) {
					reject({ Message: 'Group not found' });
				}
				else {

					// check if the specified profile exists and can start this group of tasks
					db.first(
						'a.ID as ArtistID',
						'g.ID as GalleryID'
					)
					.from('Profiles as p')
					.leftJoin('Artists as a', 'a.ProfileID', 'p.ID')
					.leftJoin('Galleries as g', 'g.ProfileID', 'p.ID')
					.where({ 'p.ID': profileID })
					.then(function (profile) {

						console.log(group)
						console.log(profile)

						if (!profile) {
							reject({ Message: 'Profile not found' });
						}
						else if ((group.Artist && profile.ArtistID) || (group.Gallery && profile.GalleryID)) {

							Notification.create(profileID, {
								subject: group.Name,
								body: group.Description,
								type: Notification.TYPE.TASK,
								sticky: sticky,
								priority: Notification.PRIORITY.HIGH,
								taskGroupID: group.ID
							})
							.then(resolve)
							.catch(reject);

						}
						else {
							reject({ Message: 'This profile is the incorrect type to start this group of tasks' })
						}

					})
					.catch(reject);
				}
			})
			.catch(reject);

		});

	}

}

module.exports = Task;
