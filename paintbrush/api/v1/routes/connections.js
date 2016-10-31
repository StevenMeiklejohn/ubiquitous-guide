var config = require('../config'),
	router = require('express').Router(),
	AccessToken = require('../../auth/access-token'),
	SqlString = require('knex/lib/query/string');



router


// request connection
.post('/connect', function (req, res) {

	// check current user
	AccessToken.getUser(req).then(function (user) {

		if (!user) return res.status(500).json({ Message: 'Current user could not be determined' })

		// check the target profile
		var profileID = parseInt(req.body.ProfileID)
		if (isNaN(profileID)) {
			return res.status(400).json({ 'Message': 'Invalid profile id: ' + req.body.ProfileID })
		}

		// check the profile we are connecting to exists
		db.first(
			'ID',
			'Name'
		)
		.from('Profiles')
		.where('ID', profileID)
		.then(function (targetProfile) {

			if (!targetProfile) {
				res.status(404).json({ Message: 'The specified profile does not exist.' })
			}
			else {

				// check for a connection request from the target profile to the current users profile
				db.first(db.raw(
					'ID, ProfileID, ConnectedProfileID, Accepted, DATE_FORMAT(HoldDate, \'%d/%m/%Y\') AS HoldDate, HoldDate >= NOW() AS OnHold FROM Connections ' +
					'WHERE ProfileID = ? AND ConnectedProfileID = ?', [profileID, user.ProfileID]
				))
				.then(function (connectionTarget) {

					if (connectionTarget && connectionTarget.Accepted) {
						res.status(200).json({ Connected: true, Message: 'You have already successfully connected to this profile' })
					}
					else if (connectionTarget && connectionTarget.OnHold) {
						res.status(403).json({ Connected: false, Pending: true, Message: 'There is currently a pending connection request from this profile' })
					}
					else {

						// check for a connection request from the current users profile to the target profile
						db.first(db.raw(
							'ID, ProfileID, ConnectedProfileID, Accepted, DATE_FORMAT(HoldDate, \'%d/%m/%Y\') AS HoldDate, HoldDate >= NOW() AS OnHold FROM Connections ' +
							'WHERE ProfileID = ? AND ConnectedProfileID = ?', [user.ProfileID, profileID]
						))
						.then(function (connectionOwn) {

							// hold date updated to +30 days for subsequent requests to same profile
							var onHold = new Date(); onHold.setDate(30)

							// new connection request
							if (!connectionOwn) {
								var connectionID = null;

								db('Connections').insert({
									ProfileID: user.ProfileID,
									ConnectedProfileID: targetProfile.ID,
									Accepted: 0,
									Message: req.body.Message || '',
									HoldDate: onHold
								})
								.then(function (cid) {
									connectionID = cid;

									// create notification for current user
									return db('Notifications').insert({
										ProfileID: user.ProfileID,
										PriorityID: 2,	// Low
										TypeID: 4,		// Connection
										SentDate: new Date(),
										Subject: 'Connection Request',
										Body: '<p>You have successfully sent a connection request to ' + targetProfile.Name + ', you should recieve a notification if accepted.</p><p>You will not be able to make another request to this user until ' + onHold.toDateString() + '</p>'
									})

								})
								.then(function () {

									// create notification for target user
									return db('Notifications').insert({
										ProfileID: targetProfile.ID,
										PriorityID: 3,	// General
										TypeID: 4,		// Connection
										ConnectionID: connectionID,
										SentDate: new Date(),
										Subject: 'Connection Request',
										Body: '<p>You have recieved a connection request from ' + user.Name + '.</p><p><a href="/#/connections?pending=1">View Pending Request</a></p>'
									})

								})
								.then(function () {
									res.status(201).json({ 'Message': 'Success' })
								})
								.catch(function (err) {
									logError(err, req, function () {
										res.status(500).json({ 'Message': 'Error creating new connection request' });
									});
								})
							}
							else if (connectionOwn.Accepted) {
								res.status(200).json({ Connected: true, Message: 'You have already successfully connected to this profile' })
							}
							else if (connectionOwn.OnHold) {
								res.status(403).json({ Connected: false, Message: 'Another connection request can\'t be made to this profile until ' + connection.HoldDate })
							}
							else {
								// update the existing connection request
								db('Connections')
								.where({ ID: connection.ID })
								.update({ Accepted: 0, Message: req.body.Message || '', HoldDate: onHold.toISOString() })
								.then(function (update) {
									return res.json({ 'Message': 'Success' })
								})
								.catch(function (err) {
									logError(err, req, function () {
										return res.status(500).json({ 'Message': 'Error updating existing connection request' })
									});
								})
							}

						})
						.catch(function (err) {
							logError(err, req, function () {
								res.status(500).json({ 'Message': 'Error fetching connection data' });
							});
						})
					}

				})
				.catch(function (err) {
					logError(err, req, function () {
						res.status(500).json({ 'Message': 'Error fetching connection data' });
					});
				})
			}

		})
		.catch(function (err) {
			logError(err, req, function () {
				res.status(500).json({ 'Message': 'Error fetching connection data' });
			});
		})



	}) // current user

}) // request connection





// returns the current connection request status for the specified profile
.get('/:profileID/status', function (req, res) {

	// check current user
	AccessToken.getUser(req).then(function (user) {

		if (!user) return res.status(500).json({ Message: 'Current user could not be determined' })

		// check the target profile
		var profileID = parseInt(req.params.profileID)
		if (isNaN(profileID)) {
			return res.status(400).json({ 'Message': 'Invalid profile id: ' + req.params.profileID })
		}

		// check for a connection request from the specified profile id to the current users profile
		db.first(db.raw(
			'ID, ProfileID, ConnectedProfileID, Accepted, DATE_FORMAT(HoldDate, \'%d/%m/%Y\') AS HoldDate, HoldDate >= NOW() AS OnHold FROM Connections ' +
			'WHERE ProfileID = ? AND ConnectedProfileID = ?', [profileID, user.ProfileID]
		))
		.then(function (connectionTarget) {

			if (connectionTarget && connectionTarget.Accepted) {
				res.status(200).json({ Connected: true, Message: 'You have already successfully connected to this profile' })
			}
			else if (connectionTarget && connectionTarget.OnHold) {
				res.status(403).json({ Connected: false, Pending: true, Message: 'There is currently a pending connection request from this profile' })
			}
			else {

				// check for a connection request from the current users profile to the specified profile id
				return db.first(db.raw(
					'ID, ProfileID, ConnectedProfileID, Accepted, DATE_FORMAT(HoldDate, \'%d/%m/%Y\') AS HoldDate, HoldDate >= NOW() AS OnHold FROM Connections ' +
					'WHERE ProfileID = ? AND ConnectedProfileID = ?', [user.ProfileID, profileID]
				))
				.then(function (connectionOwn) {

					if (connectionOwn && connectionOwn.Accepted) {
						res.status(200).json({ Connected: true, Message: 'You have already successfully connected to this profile' })
					}
					else if (connectionOwn && connectionOwn.OnHold) {
						res.status(403).json({ Connected: false, Message: 'Another connection request can\'t be made to this profile until ' + connectionOwn.HoldDate })
					}
					else {
						res.status(200).json({ Connected: false, Message: 'You can connect to this profile' })
					}

				})

			}

		})
		.catch(function (err) {
			logError(err, req, function () {
				res.status(500).json({ Message: 'Error fetching connection data' });
			});
		})

	})

})








// accept connection request
.get('/accept/:requestID', function (req, res) {

	// check current user
	AccessToken.getUser(req).then(function (user) {

		if (!user) return res.status(500).json({ Message: 'Current user could not be determined' })

		// check the requestID
		var requestID = parseInt(req.params.requestID)
		if (isNaN(requestID)) {
			return res.status(400).json({ 'Message': 'Invalid request id: ' + req.params.requestID })
		}


		// check that the request exists for the current user
		db('Connections').first('ID', 'ProfileID', 'ConnectedProfileID').where({ ID: requestID })
		.then(function (request) {

			if (!request) {
				res.status(404).json({ 'Message': 'Connection request not found' });
			}
			else if (request.ConnectedProfileID != user.ProfileID) {
				res.status(403).json({ 'Message': 'You do not have permission to update this item' });
			}
			else {
				return db('Connections').where({ ID: requestID }).update({ Accepted: 1 })
					.then(function () {

						// mark any related notification as read
						return db('Notifications').where({ ConnectionID: requestID }).update({ ReadDate: new Date() });

					})
					.then(function(){
						return db('Profiles').first('Name').where({ ID: request.ConnectedProfileID });
					})
					.then(function (targetProfile) {

						// create notification to inform requester
						return db('Notifications').insert({
							ProfileID: request.ProfileID,
							PriorityID: 2,	// Low
							TypeID: 4,		// Connection
							SentDate: new Date(),
							Subject: 'Connection Request',
							Body: '<p>' + targetProfile.Name + ' has accepted you connection request</p>'
						});

					})
					.then(function () {
						res.json({ 'Message': 'Success' })
					})
					.catch(function (err) {
						logError(err, req, function () {
							res.status(500).json({ 'Message': 'Error accepting connection request' });
						});
					})

			}

		})
		.catch(function (err) {
			logError(err, req, function () {
				res.status(500).json({ 'Message': 'Error fetching connection request data' });
			});
		})

	})

}) // accept connection request





// reject connection request
.get('/reject/:requestID', function (req, res) {

	// check current user
	AccessToken.getUser(req).then(function (user) {

		if (!user) return res.status(500).json({ Message: 'Current user could not be determined' })

		// check the requestID
		var requestID = parseInt(req.params.requestID)
		if (isNaN(requestID)) {

			// invalid requestID
			return res.status(400).json({ 'Message': 'Invalid request id: ' + req.params.requestID })

		}

		// check that the request exists for the current user
		db('Connections').first('ID', 'ConnectedProfileID').where({ ID: requestID })
		.then(function (request) {

			if (!request) return res.status(404).json({ 'Message': 'Not found - request id: ' + req.params.requestID })

			if (request.ConnectedProfileID != user.ProfileID) return res.status(403).json({ 'Message': 'You do not have permission to update this item' })

			// reject the request
			db('Connections').where({ ID: requestID }).update({ Accepted: -1 })
			.then(function (accepted) {

				// connection successful
				return res.json({ 'Message': 'Success' })

			})
			.catch(function (err) {

				return res.status(500).json({ 'Message': 'Error rejecting connection request' })

			})

		})
		.catch(function (err) {

			return res.status(500).json({ 'Message': 'Error fetching connection request data' })

		})

	}) // current user

}) // reject connection request





// list pending connections
.get('/pending', function (req, res) {

	// check current user
	AccessToken.getUser(req).then(function (user) {

		if (!user) return res.status(500).json({ Message: 'Current user could not be determined' })


		db.select(
			'c.ID',
			'a.ID as ArtistID',
			'g.ID as GalleryID',
			'p.Name',
			'p.ImageURI',
			'c.Message',
			'c.created_at',
			'a.Nationality',
			'a.Location',
			'ab.Description as AgeBracket',
			'ci.Town',
			'ci.Postcode',
			'ci.Website',
			'ci.Landline',
			db.raw('(SELECT COUNT(ID) FROM Artworks WHERE ArtistProfileID = a.ID) as Artworks')
		)
		.from('Connections as c')
		.join('Profiles as p', 'c.ProfileID', 'p.ID')
		.leftJoin('ContactInformation as ci', 'p.ContactInformationID', 'ci.ID')
		.leftJoin('Artists as a', 'a.ProfileID', 'p.ID')
		.leftJoin('AgeBrackets as ab', 'a.AgeBracketID', 'ab.ID')
		.leftJoin('Galleries as g', 'g.ProfileID', 'p.ID')
		.where({ 'c.ConnectedProfileID': user.ProfileID, 'c.Accepted': 0 })
		.then(function (requests) {

			requests.forEach(function (r) {
				r.ImageURI = r.ImageURI || config.profile.defaultImage;
			});

			return res.json(requests)

		})
		.catch(function (err) {
			logError(err, req, function () {
				res.status(500).json({ 'Message': 'Error fetching pending connection requests' });
			});
		})

	}) // current user

})





// list accepted connections
.get('/accepted', function (req, res) {

	// check current user
	AccessToken.getUser(req).then(function (user) {

		if (!user) return res.status(500).json({ Message: 'Current user could not be determined' })

		db.distinct(
			'p.ID',
			'p.Name',
			'p.ImageURI'
			//'c.created_at'
		)
		.select()
		.from('Connections as c')
		.join(db.raw('Profiles as p on ' +
			'(' +
				'(c.ConnectedProfileID = p.ID and c.ProfileID = ' + user.ProfileID + ') or ' +
				'(c.ProfileID = p.ID and c.ConnectedProfileID = ' + user.ProfileID + ')' +
			') ' +
			'and c.Accepted = 1'
		))
		.leftJoin('Artists as a', 'a.ProfileID', 'p.ID')
		.leftJoin('Galleries as g', 'g.ProfileID', 'p.ID')
		.then(function (accepted) {
			accepted.forEach(function (a) {
				a.ImageURI = a.ImageURI || config.profile.defaultImage;
			});

			res.json(accepted)
		})
		.catch(function (err) {
			res.status(500).json({ 'Message': 'Error fetching accepted connection requests' })
		})

	}) // current user

})





// list rejected connections
.get('/rejected', function (req, res) {

	// check current user
	AccessToken.getUser(req).then(function (user) {

		if (!user) return res.status(500).json({ Message: 'Current user could not be determined' })

		db('Connections').select('ID').where({ ConnectedProfileID: user.ProfileID, Accepted: -1 })
		.then(function (requests) {

			return res.json(requests)

		})
		.catch(function (err) {

			return res.status(500).json({ 'Message': 'Error fetching rejected connection requests' })

		})

	}) // current user

})





// connection search
.post('/search', function (req, res) {

	// check current user
	AccessToken.getUser(req).then(function (user) {

		if (!user) return res.status(500).json({ Message: 'Current user could not be determined' })

		var pagination = req.body.Pagination || {},
		filters = req.body.Filters || {},
		sort = req.body.Sort || {},
		validSortFields = { 'ConnectionID': 'c.ID', 'ProfileID': 'p.ID', 'Name': 'p.Name' },
		pageSize = Math.min(Math.max(1, parseInt(pagination.PageSize) || 10), 100),
		pageNum = parseInt(pagination.PageNumber) || 0,
		// send pagination data back with results
		pagination = { PageSize: pageSize, PageNumber: pageNum }

		// build SQL with filters
		var sql =
			'FROM Connections c ' +
			'LEFT JOIN Profiles p ON c.ConnectedProfileID = p.ID ' +
			'WHERE c.ProfileID = ' + user.ProfileID

		// search connections name
		if (filters.Name) sql += ' AND p.Name LIKE ' + SqlString.escape('%' + filters.Name + '%')
		// status : 0 = pending, 1 = accepted, -1 = rejected
		if (filters.Accepted !== undefined && filters.Accepted !== '') sql += ' AND c.Accepted = \'' + parseInt(filters.Accepted) + '\''

		// sort order - ascending by default
		if (sort.SortField && validSortFields[sort.SortField]) {
			sql += ' ORDER BY ' + validSortFields[sort.SortField]
			sql += sort.SortOrder ? " DESC" : " ASC"
		}

		// execute query
		db.first(db.raw(

			// total results
			'COUNT(DISTINCT c.ID) AS results ' + sql

		))
		.then(function (total) {

			dbNest(
				db.select(db.raw(
					'c.ID AS _ConnectionID, ' +
					'p.ID AS _ProfileID, ' +
					'p.Name AS _Name, ' +
					'p.ImageURI AS _ImageURI, ' +
					'c.Accepted AS _Accepted ' +
					sql
				))
				.offset(pageSize * pageNum)
				.limit(pageSize)
			)
			.then(function (data) {

				// success
				pagination.TotalResults = total.results
				res.json({
					Data: data,
					Pagination: pagination
				})

			})
			.catch(function () {

				// error fetching results
				res.status(500).json({ 'Error': 'Querying connections' })

			})

		})
		.catch(function () {

			// error querying total
			res.status(500).json({ 'Error': 'Querying connections total' })

		})

	}) // current user

})





module.exports = router