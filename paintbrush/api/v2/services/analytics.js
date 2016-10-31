var Promise = require('bluebird'),
	Permission = require('../lib/permission'),
	config = require('../config');



module.exports = {

	users: {


		activity: {

			details: function (profileID, userProfileID) {
				return new Promise(function (resolve, reject) {
					var events = {
						'1': 'Opened App',
						'2': 'Scanned Artwork',
						'3': 'Played Video',
						'5': 'Finished Video',
						'6': 'Shared Artwork',
						'7': 'Viewed Artwork',
						'8': 'Viewed Artist',
						'9': 'Buy',
						'10': 'Enquiry',
						'15': 'Added Artwork to Shortlist',
						'18': 'Viewed Profile'
					};
					var eventIDs = Object.keys(events);

					db.select(
						'ae.ID',
						'ae.EventID',
						'ae.created_at as Date',
						'ae.ArtworkID',
						'aw.Name as ArtworkName',
						'aw.ImageURI as ArtworkImageURI',
						'ar.ID as ArtistProfileID',
						'ar.Name as ArtistName',
						'ar.ImageURI as ArtistImageURI',
						'p.ID as ProfileID',
						'p.Name as ProfileName',
						'p.ImageURI as ProfileImageURI',
						'db.Name as BrowserName',
						'db.Version as BrowserVersion',
						'dv.OS as DeviceOS',
						'dv.OSVersion as DeviceOSVersion',
						'dvt.Type as DeviceType'
					)
					.from('AnalyticEvents as ae')
					.leftJoin('Artworks as aw', 'ae.ArtworkID', 'aw.ID')
					.leftJoin('Profiles as ar', 'aw.ArtistProfileID', 'ar.ID')
					.leftJoin('Profiles as p', 'ae.ProfileID', 'p.ID')
					.leftJoin('DeviceBrowsers as db', 'ae.DeviceBrowserID', 'db.ID')
					.leftJoin('Devices as dv', 'db.DeviceID', 'dv.ID')
					.leftJoin('DeviceTypes as dvt', 'dv.TypeID', 'dvt.ID')
					.whereRaw('ae.UserProfileID = ' + userProfileID + ' AND ae.ProfileID ' + (Array.isArray(profileID) ? 'IN (' + profileID.join(',') + ')' : '=' + profileID) + ' AND ae.EventID IN (' + eventIDs.join(',') + ')')
					.orderBy('ae.created_at', 'desc')
					.then(function (data) {
						resolve(data.map(function (e) {
							e.Type = events[ e.EventID + '' ] || e.EventID;
							return e;
						}));
					})
					.catch(reject);
				})
			},


			summary: function (profileID) {
				return new Promise(function (resolve, reject) {
					var events = {
						'1': 'Opened App',
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

					Permission.getAdminProfileIDs().then(function (adminProfiles) {
						return db.distinct(
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
						.whereRaw(
							'ae.ProfileID ' + (Array.isArray(profileID) ? 'IN (' + profileID.join(',') + ')' : '=' + profileID) +
							' AND ae.EventID IN (' + eventIDs.join(',') + ')' +
							' AND ae.ProfileID <> ae.UserProfileID' +
							(adminProfiles.length ? ' AND ae.UserProfileID NOT IN (' + adminProfiles.join(',') + ')' : '')
						)
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
												Type: events[ t.EventID + '' ] || t.EventID,
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
								resolve(profiles.sort(function (a, b) {
									return a.TotalEvents > b.TotalEvents ? -1 : 1;
								}));
							})

						})

					})
					.catch(reject);

				})
			},


			search: function (profileID, filters, pagination, sort) {
				return new Promise(function (resolve, reject) {
					var events = {
						'1': 'Opened App',
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

					Permission.getAdminProfileIDs().then(function (adminProfiles) {

						var sql =
								'FROM AnalyticEvents as ae ' +
								'JOIN Profiles as p ON ae.UserProfileID = p.ID ' +
								'LEFT JOIN Galleries as g ON p.ID = g.ProfileID ' +
								'LEFT JOIN Artists as a ON p.ID = a.ProfileID ' +
								'LEFT JOIN Consumers as c ON p.ID = c.ProfileID ' +
								'WHERE ae.ProfileID ' + (Array.isArray(profileID) ? 'IN (' + profileID.join(',') + ')' : '=' + profileID) +
								' AND ae.EventID IN (' + eventIDs.join(',') + ') ' +
								' AND ae.ProfileID <> ae.UserProfileID ' +
								(adminProfiles.length ? ' AND ae.UserProfileID NOT IN (' + adminProfiles.join(',') + ')' : '');


						if (filters.Name) {
							sql += ' AND p.Name LIKE \'%' + filters.Name + '%\'';
						}
						if (filters.UserType) {
							switch (filters.UserType) {
								case 'Artist':
									sql += ' AND a.ID IS NOT NULL';
									break;
								case 'Consumer':
									sql += ' AND c.ID IS NOT NULL';
									break;
								case 'Gallery':
									sql += ' AND g.ID IS NOT NULL';
									break;
							}

						}


						var sortSql = ' ORDER BY ';
						var direction = (sort.Direction || '').toLowerCase() === 'asc' ? 'ASC': 'DESC';
						//
						//// sort order
						switch (sort.Field) {
							case 'Name':
								sortSql += ' Name ' + direction;
								break;
							case 'TotalEvents':
								sortSql += ' TotalEvents ' + direction;
								break;
							case 'LastActivity':
								sortSql += ' LastActivity ' + direction;
								break;
							default:
								sortSql += ' Name ASC ';
								break;
						}
						//sql += ' ORDER BY p.Name ASC ';

						// execute query
						db.first(db.raw(
										'COUNT(DISTINCT p.ID) AS results ' + sql
								))
								.then(function (total) {
									var eventsWhere =
											' WHERE ae.UserProfileID = pr.ID ' +
											' AND ae.ProfileID ' + (Array.isArray(profileID) ? 'IN (' + profileID.join(',') + ')' : '=' + profileID) +
											' AND ae.EventID IN (' + eventIDs.join(',') + ') ';

									return db.select(db.raw(
											' pr.*, ' +
											'(SELECT COUNT(ID) FROM AnalyticEvents as ae ' + eventsWhere + ') AS TotalEvents, ' +
											'(SELECT ae.created_at FROM AnalyticEvents as ae ' + eventsWhere + ' ORDER BY ae.created_at DESC LIMIT 1) AS LastActivity ' +
											'FROM (' +
												'SELECT DISTINCT p.ID, ' +
												'p.ImageURI, ' +
												'p.Name, ' +
												'IF (g.ID IS NOT NULL, \'Gallery\', IF (a.ID IS NOT NULL, \'Artist\', IF (c.ID IS NOT NULL, \'Consumer\', \'\'))) as Type ' +
												sql +
											') AS pr' +
											sortSql
										))
										.offset(pagination.PageSize * pagination.PageNumber)
										.limit(pagination.PageSize)
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
														p.Events = totalEvents.map(function (t) {
															return {
																Type: events[ t.EventID + '' ] || t.EventID,
																Total: t.Total
															};
														})
													})
												);
											});

											return Promise.all(queue).then(function () {
												pagination.TotalResults = total.results;
												resolve({
													Data: profiles || [],
													Pagination: pagination
												})
											})

										})
								})
								.catch(reject);

					})

				})
			}

		}

	}

};