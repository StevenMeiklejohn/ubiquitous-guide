var router = require('express').Router(),
	AccessToken = require('../../auth/access-token'),
	Analytics = require('../lib/analytics'),
	Notification = require('../lib/notification');


// updates the shortlist count held against artwork records
var updateShortlistCount = function (items, _complete) {

	var c = 0,
	complete = function () {
		c++;
		if (c >= items.length) {
			_complete && _complete();
		}
	};

	for (var i in items) {
		(function (id) {

			db('ShortlistArtworks')
				.count('ShortlistID as total')
				.where('ArtworkID', id)
				.then(function (resp) {

					return db('Artworks')
						.where('ID', id)
						.update({
							Shortlisted: resp[0].total
						})
				})
				.finally(complete)

		})(items[i]);
	}

};


router


	// add shortlist
	.post('/add', function (req, res) {

		// check current user
		AccessToken.getUser(req).then(function (user) {

			if(!user) return res.status(500).json({ Message: 'Current user could not be determined' })

			var typeID = parseInt(req.body.TypeID || 0),
				name = req.body.Name || '',
				description = req.body.Description || '',
				target = req.body.Target || 10,
				shortlistID = -1;

			// check all parameters are present
			if ( !typeID || !name || !description ) {
				return res.status(400).json({ Message: 'Valid shortlist type, name and description are required' })
			}

			// check list type is valid
			if( typeID < 1 || typeID > 2 ) {
				return res.status(400).json({ Message: 'Shortlist type must be Artist (1) or Artwork (2)' })
			}

			// insert the shortlist
			db('Shortlists').insert({
				ProfileID: user.ProfileID,
				Name: name,
				Description: description,
				Target: target,
				TypeID: typeID,
				Archived: 0,
				Deleted: 0
			})
			.then(function(shortlist){
				shortlistID = shortlist[0];

				return res.status(201).json({ 'ID': shortlistID, Message: 'Success' })
			})
			.then(function() {
				Analytics.event.add(req, 11, { ShortlistID: shortlistID })
			})
			.catch(function(err){
				return res.status(500).json({ Message: 'Shortlist not added' })

			})

		})

	})

	// update shortlist
	.put('/:shortlistID/update', function (req, res) {

			// check current user
			AccessToken.getUser(req).then(function (user) {

				db('Shortlists').where('ID', req.params.shortlistID).first()
					.then(function(shortlist) {
						if (!shortlist) {
							res.status(404).json({ Message: 'Shortlist not found' });
						}
						else if (!(shortlist.ProfileID === user.ProfileID || user.memberOf('Administrators'))) {
							res.status(403).json({ Message: 'You do not have permission to update this shortlist' });
						}
						else {
							return db('Shortlists').where('ID', req.params.shortlistID)
								.update({
									Name: req.body.Name || shortlist.Name,
									Description: req.body.Description || shortlist.Description,
									Target: req.body.Target || shortlist.Target
								})
								.then(function() {
									res.json({ Message: 'Success' });
								})
						}
					})
					.catch(function() {
						res.status(500).json({ Message: 'An unexpected error occurred' });
					});

			})

		})


		// add items to shortlist
	.post('/:shortlistID/add', function (req, res) {

		// check arguments
		var shortlistID = parseInt(req.params.shortlistID);
		if(isNaN(shortlistID)){
			res.status(400).json({ 'Message': 'Invalid shortlist ID: ' + req.params.shortlistID })
		}
		else {

			AccessToken.getUser(req).then(function (user){

				if(!user) return res.status(500).json({ Message: 'Current user could not be determined' });

				// does shortlist exists and belong to user
				db('Shortlists').first('ID', 'ProfileID', 'TypeID').where({ ID: shortlistID })
				.then(function(shortlist) {

					if (!shortlist) {
						res.status(404).json({'Message': 'Not Found'})
					}
					else if (shortlist.ProfileID != user.ProfileID) {
						res.status(403).json({'Message': 'You do not have permission to add to this shortlist'})
					}
					else {
						var type = (shortlist.TypeID == 1) ? 'Artist' : 'Artwork',
							sourceTable = type + 's',
							typeIDField = type + 'ID',
							targetTable = 'Shortlist' + sourceTable,
							items = req.body[sourceTable];

						if (!Array.isArray(items)) {
							res.status(400).json({'Message': 'Please supply ' + sourceTable + ' to shortlist'})
						}
						else {
							// filter out any non numeric array values
							var filteredItems = items.filter(function (i) {
								return !isNaN(parseInt(i));
							});

							var newIDs = [];

							return db.raw(
									'SELECT ID AS ' + typeIDField + ' FROM ' + sourceTable + ' ' +
									'WHERE ID IN (' + filteredItems.join(',') + ')' +
									'AND ID NOT IN (SELECT ' + typeIDField + ' FROM ' + targetTable + ' WHERE ShortlistID = ' + shortlistID + ')'	// prevent duplicate entries
								)
								.then(function (result) {
									var newItems = result[0];
									newItems.forEach(function (item) {
										item.ShortlistID = shortlistID;
										newIDs.push(item[typeIDField]);
									});

									if (newItems.length) {
										return db(targetTable).insert(newItems)
												.then(function() {

													if (shortlist.TypeID === 2) {

														//
														// find all shortlists with one of these artwork id's
														//
														return db.distinct('s.ProfileID', 'aw.Name as ArtworkName', 'p.Name').select()
															.from('ShortlistArtworks as sa')
															.join('Shortlists as s', 'sa.ShortlistID', 's.ID')
															.join('Artworks as aw', 'sa.ArtworkID', 'aw.ID')
															.join('Profiles as p', 'aw.ArtistProfileID', 'p.ID')
															.whereIn('sa.ArtworkID', newIDs)
															.andWhere(function() {
																this.whereRaw('s.ProfileID <> ' + user.ProfileID + ' AND s.ID <> ' + shortlistID + ' AND s.TypeID = ' + 2);
															})
															.then(function(profiles) {
																//profiles.forEach(function(p) {
																//	Notification.create(p.ProfileID, {
																//		type: Notification.TYPE.INFORMATION,
																//		//subject: 'Artwork ' + p.ArtworkName + ' has been shortlisted by another user',
																//		subjectShort: 'Shortlist Alert',
																//		//body: 'An artwork you have shortlisted (' + p.ArtworkName + ' by ' + p.Name + ') has been shortlisted by another user.',
																//		bodyShort: 'An artwork you have shortlisted (' + p.ArtworkName + ' by ' + p.Name + ') has been shortlisted by another user.'
																//	});
																//})
															})

													}


												})
									}
								})
								.then(function () {
									var r = {'Message': 'Success'};
									r[sourceTable] = newIDs.length;
									r[sourceTable + 'Added'] = newIDs;
									r[sourceTable + 'Ignored'] = filteredItems.filter(function (i) {
										return newIDs.indexOf(i) === -1;
									});

									res.json(r);
								})
								.then(function () {
									if (type === 'Artwork') {
										for (var i in newIDs) {
											Analytics.event.add(req, 15, { ShortlistID: shortlistID, ArtworkID: newIDs[i] });
										}
										updateShortlistCount(newIDs);
									}
								})
						}

					}

				})
				.catch(function (err) {
					logError(err, req, function () {
						res.status(500).json({Message: 'Unexpected Error'});
					});
				});

			})

		}

	})


	// view shortlist
	.get('/:shortlistID/view', function (req, res) {

		// check arguments
		var shortlistID = parseInt(req.params.shortlistID);
		if(isNaN(shortlistID)){
			return res.status(400).json({ 'Message': 'Invalid shortlist ID: ' + req.params.shortlistID });
		}

		// check current user
		AccessToken.getUser(req).then(function (user){

			// user should only get here if authenticated
			if(!user) return res.status(500).json({ Message: 'Current user could not be determined' });

			// does shortlist exist and belong to user
			db.first('ID', 'TypeID', 'ProfileID', 'Name', 'Description', 'Target', 'Archived')
			.from('Shortlists')
			.where({ ID: shortlistID })
			.then(function(shortlist){

				// shortlist doesn't exist
				if (!shortlist) {
					return res.status(404).json({ 'Message': 'Shortlist not found' })
				}
				// check if user has permission to access this shortlist
				if (shortlist.ProfileID !== user.ProfileID && !user.memberOf('Administrators')) {
					return res.status(403).json({ 'Message': 'You do not have permission to view this shortlist' })
				}

				switch (shortlist.TypeID) {
					// artists
					case 1:
						db.select('*')	// TODO!
							.from('ShortlistArtists as sa')
							.join('Artists as ar', 'sa.ArtistID', 'ar.ID')
							.join('Profiles as p', 'ar.ProfileID', 'p.ID')
							.where('sa.ShortlistID', shortlist.ID)
							.orderBy('sa.updated_at', 'desc')
							.then(function (data) {
								shortlist.Items = data;
								return res.json(shortlist);
							})
							.then(function() {
								Analytics.event.add(req, 13, { ShortlistID: shortlistID });
							})
							.catch(function (err) {
								return res.status(500).json({ 'Message': 'Couldn\'t fetch shortlist items' })
							});
						break;
					
					// artwork
					default:
						dbNest(
							db.select(
								'aw.ID as _ID',
								'aw.Name as _Name',
								'aw.Description as _Description',
								'aw.ImageURI as _ImageURI',
								'aw.ImageHeight as _ImageHeight',
								'aw.ImageWidth as _ImageWidth',
								'p.ImageURI as _ProfileImageURI',
								'p.Name as _ArtistName',
								'ac.R as _Colours__R',
								'ac.G as _Colours__G',
								'ac.B as _Colours__B',
								'ac.Priority as _Colours__Priority'
							)
							.from('ShortlistArtworks as sa')
							.join(db.raw('Artworks as aw on sa.ArtworkID = aw.ID and aw.Deleted = 0'))
							.leftJoin('ArtworkColours as ac', 'sa.ArtworkID', 'ac.ArtworkID')
							.join('Profiles as p', 'aw.ArtistProfileID', 'p.ID')
							.where('sa.ShortlistID', shortlist.ID)
							.orderByRaw('sa.updated_at desc, ac.Priority')
						)
						.then(function (data) {
							(data || []).forEach(function(item) {
								item.ProfileImageURI = item.ProfileImageURI || config.profile.defaultImage;
							});
							shortlist.Items = data;
							return res.json(shortlist);
						})
						.then(function() {
							Analytics.event.add(req, 13, { ShortlistID: shortlistID });
						})
						.catch(function (err) {
							return res.status(500).json({ 'Message': 'Couldn\'t fetch shortlist items' })
						});
						break;
						
				}

			})
			.catch(function(err){
				return res.status(500).json({ 'Message': 'Couldn\'t fetch shortlist' })
			})

		})

	})


	// list active shortlists for user
	.get('/', function (req, res) {

		// check current user
		AccessToken.getUser(req).then(function (user){

			// user should only get here if authenticated
			if (!user) return res.status(500).json({ Message: 'Current user could not be determined' })

			db.select(
				's.ID',
				's.Name',
				's.Description',
				's.Target',
				's.TypeID',
				'st.Description as Type',
				db.raw(
					'IF(TypeID = 1, ' + 
					'(SELECT COUNT(ID) FROM ShortlistArtists WHERE ShortlistID = s.ID), ' + 
					'(SELECT COUNT(sa.ID) FROM ShortlistArtworks AS sa JOIN Artworks as aw on sa.ArtworkID = aw.ID and aw.Deleted = 0 WHERE sa.ShortlistID = s.ID)' +
					') AS Items'
				)
			)
			.from('Shortlists as s')
			.join('ShortlistTypes as st', 's.TypeID', 'st.ID')
			.where({ 's.ProfileID': user.ProfileID, 's.Archived': 0, 's.Deleted': 0 })
			.then(function (shortlists) {

				// most recent 5 artworks/artists
				var _c = 0;
				shortlists.forEach(function (shortlist) {
					shortlist.Images = [];

					// get the 5 most recently added artist profile images
					if (shortlist.TypeID === 1) {
						return db.select('aw.ImageURI')
							.from('ShortlistArtists as sa')
							.join('Artists as ar', 'sa.ArtistID', 'ar.ID')
							.join('Profiles as p', 'ar.ProfileID', 'p.ID')
							.where('sa.ShortlistID', shortlist.ID)
							.orderBy('sa.updated_at', 'desc')
							.limit(5)
							.asCallback(function (err, images) {
								if (!err) {
									for (var i in images) {
										shortlist.Images.push(images[i].ImageURI);
									}
								}

								_c++;
								if (_c >= shortlists.length) {
									res.json(shortlists)
								}
							})
					}
					// get the 5 most recently added artwork images
					else {
						return db.select('aw.ImageURI')
							.from('ShortlistArtworks as sa')
							.join(db.raw('Artworks as aw on sa.ArtworkID = aw.ID and aw.Deleted = 0'))
							.where('sa.ShortlistID', shortlist.ID)
							.orderBy('sa.updated_at', 'desc')
							.limit(5)
							.asCallback(function (err, images) {
								if (!err) {
									for (var i in images) {
										shortlist.Images.push(images[i].ImageURI);
									}
								}

								_c++;
								if (_c >= shortlists.length) {
									res.json(shortlists)
								}
							})
					}
					
				});

				if (!shortlists.length) {
					res.json(shortlists);
				}

			})
			//.then(function() {
			//	Analytics.event.add(req, 14);
			//})
			.catch(function(err){
				console.log(err);
				// error
				return res.status(500).json({ 'Message': 'Couldn\'t fetch shortlists' })

			})

		});

	}) // list active shortlists


	// archive shortlist
	.put('/:shortlistID/archive', function (req, res) {

		// check arguments
		var shortlistID = parseInt(req.params.shortlistID)
		if(isNaN(shortlistID)){
			res.status(400).json({ 'Message': 'Invalid shortlist ID: ' + req.params.shortlistID })
		}
		else {

			// check current user
			AccessToken.getUser(req).then(function (user){

				if(!user) return res.status(500).json({ Message: 'Current user could not be determined' });

				db('Shortlists').first('ID', 'ProfileID').where({ ID: shortlistID })
					.then(function(shortlist){

						if(!shortlist){
							res.status(404).json({ 'Message': 'Not Found' });
						}
						else if(shortlist.ProfileID != user.ProfileID){
							res.status(403).json({ 'Message': 'You do not have permission to archive this shortlist' })
						}
						else {

							db('Shortlists').where({ ID: shortlistID }).update({ Archived: 1 })
								.then(function(){
									res.json({ 'Message': 'Success' });
								})
								.then(function () {
									Analytics.event.add(req, 17, { ShortlistID: shortlistID });
								})

						}

					})
					.catch(function(err){
						res.status(500).json({ 'Message': 'Shortlist NOT archived' })
					})

			});

		}


	})


	// delete shortlist
	.delete('/:shortlistID/remove', function (req, res) {

		// check arguments
		var shortlistID = parseInt(req.params.shortlistID);
		if (isNaN(shortlistID)) {
			return res.status(400).json({ 'Message': 'Invalid shortlist ID: ' + req.params.shortlistID })
		}

		// check current user
		AccessToken.getUser(req).then(function (user) {

			// user should only get here if authenticated
			if (!user) return res.status(500).json({ Message: 'Current user could not be determined' });

			// does shortlist exists and belong to user
			db('Shortlists').first('ID', 'ProfileID').where({ ID: shortlistID })
			.then(function (shortlist) {

				if (!shortlist) {
					res.status(404).json({Message: 'Shortlist not found'});
				}
				else if (shortlist.ProfileID != user.ProfileID) {
					res.status(403).json({Message: 'You do not have permission to remove this shortlist'})
				}
				else {
					return db('Shortlists').where({ID: shortlistID}).update({Deleted: 1})
						.then(function () {
							res.json({Message: 'Success'})
						})
						.then(function () {
							Analytics.event.add(req, 12, {ShortlistID: shortlistID});
						})
				}

			})
			.catch(function (err) {
				logError(err, req, function () {
					res.status(500).json({ Message: 'Error removing shortlist from database' });
				});
			})

		})

	})


	// delete shortlist artwork
	.delete('/:shortlistID/artwork/:artworkID/remove', function (req, res) {

		// check arguments
		var shortlistID = req.params.shortlistID * 1;
		if (isNaN(shortlistID)) {
			return res.status(400).json({ 'Message': 'Invalid shortlist ID: ' + req.params.shortlistID })
		}

		var artworkID = req.params.artworkID * 1;
		if (isNaN(artworkID)) {
			return res.status(400).json({ 'Message': 'Invalid artwork ID: ' + req.params.artworkID })
		}

		// check current user
		AccessToken.getUser(req).then(function (user) {

			// user should only get here if authenticated
			if (!user) return res.status(500).json({ Message: 'Current user could not be determined' });

			// does shortlist exists and belong to user
			db('Shortlists').first('ID', 'ProfileID').where({ ID: shortlistID })
			.then(function (shortlist) {

				if (!shortlist) {
					return res.status(404).json({ Message: 'Shortlist not found' });
				}
				if (shortlist.ProfileID != user.ProfileID) {
					return res.status(403).json({ Message: 'You do not have permission to modify this shortlist' })
				}

				// remove shortlist artwork if it exists
				db('ShortlistArtworks').where({ ShortlistID: shortlistID, ArtworkID: artworkID }).del()
				.then(function () {
					res.json({ Message: 'Success' });
				})
				.then(function () {
					Analytics.event.add(req, 16, { ShortlistID: shortlistID, ArtworkID: artworkID });
				})
				.then(function () {
					updateShortlistCount([artworkID]);
				})
				.catch(function (err) {
					logError(err, req, function () {
						res.status(500).json({ Message: 'Error removing shortlisted artwork from database' });
					});
				})

			})
			.catch(function (err) {
				logError(err, req, function () {
					res.status(500).json({ Message: 'Error removing shortlisted artwork from database' });
				});
			})

		})

	})


	// shortlist types
	.get('/types', function(req, res){

		db('ShortlistTypes').select('ID', 'Description as Type')
			.where({ Deleted: 0 })
			.then(function (shortlistTypes) {
				res.json(shortlistTypes);
			})
			.catch(function () {
				res.status(500).json({ 'Message': 'Couldn\'t fetch shortlist types' })
			})
	
	});



module.exports = router;
