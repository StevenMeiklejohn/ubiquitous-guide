var Promise = require('bluebird'),
	AccessToken = require('../../auth/access-token'),
	Permission = require('../lib/permission'),
	PushNotification = require('../lib/push-notification'),
	is = require('../lib/validate').is;




var getRecentImages = function (shortlistID, typeID) {
	return new Promise(function(resolve, reject) {
		var sql = '';

		if (typeID === 1) {
			sql = 'from ShortlistArtists as sa ' +
				'join Artists as ar on sa.ArtistID = ar.ID ' +
				'join Profiles as p on ar.ProfileID = p.ID ';
		}
		else {
			sql = 'from ShortlistArtworks as sa ' +
				'join Artworks as aw on sa.ArtworkID = aw.ID and aw.Deleted = 0 ';
		}

		db.select(db.raw(
			'ImageURI ' + sql +
			'where sa.ShortlistID = ' + shortlistID + ' ' +
			'order by sa.updated_at desc limit 5'
		))
		.then(function(images) {
			resolve(images.map(function(i) {
				return i.ImageURI;
			}))
		})
		.catch(reject);
	})
};


var getShortlists = function (profileID, archived) {
	return new Promise(function(resolve, reject) {
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
		.where({ 's.ProfileID': profileID, 's.Archived': !!archived, 's.Deleted': 0 })
		.orderBy('s.updated_at', 'desc')
		.then(function (shortlists) {
			var queue = [];

			shortlists.forEach(function (shortlist) {
				queue.push(
					getRecentImages(shortlist.ID, shortlist.TypeID).then(function(images) {
						shortlist.Images = images;
					})
				)
			});

			if (!shortlists.length) {
				resolve(shortlists);
			}
			else {
				return Promise.all(queue).then(function() {
					resolve(shortlists);
				})
			}

		})
		.catch(reject)
	})
};



var updateArtworkShortlistCounts = function (artworkIDs) {
	artworkIDs.forEach(function (id) {
		db('ShortlistArtworks').where('ArtworkID', id).count('ShortlistID as total')
			.then(function (resp) {
				return db('Artworks').where('ID', id).update({ Shortlisted: resp[0].total })
			})
	});
};




module.exports = {


	//
	// Marks a shortlist as archived
	//
	archive: function (shortlistID) {
		return new Promise(function(resolve, reject) {
			db('Shortlists').where({ ID: shortlistID }).update({ Archived: 1 })
				.then(resolve)
				.catch(reject);
		})
	},



	//
	// Creates a new shortlist for the specified profile
	//
	create: function (profileID, shortlist) {
		return new Promise(function(resolve, reject) {
			db('Shortlists').insert({
				ProfileID: profileID,
				Name: shortlist.Name,
				Description: shortlist.Description || shortlist.Name,
				Target: shortlist.Target,
				TypeID: shortlist.TypeID
			})
			.then(function(result){
				resolve(result[0]);
			})
			.catch(reject);
		})
	},



	//
	// Returns the specified shortlist
	//
	get: function (shortlistID) {
		return new Promise(function(resolve, reject) {

			db.first('ID', 'TypeID', 'ProfileID', 'Name', 'Description', 'Target', 'Archived')
			.from('Shortlists')
			.where({ ID: shortlistID })
			.then(function(shortlist) {
				return dbNest(
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
					return resolve(shortlist);
				})
			})
			.catch(reject);
		})
	},



	list: {

		//
		// Lists all active shortlists for the specified profile
		//
		active: function (profileID) {
			return getShortlists(profileID, false);
		},

		//
		// Lists all archived shortlists for the specified profile
		//
		archived: function (profileID) {
			return getShortlists(profileID, true);
		},

		//
		// Returns a list of shortlist types
		//
		types: function () {
			return new Promise(function(resolve, reject) {
				db('ShortlistTypes').select('ID', 'Description as Type')
					.where({ Deleted: 0 })
					.then(resolve)
					.catch(reject)
			})
		}
	},


	//
	// Shortlist item methods
	//
	item: {

		//
		// Adds a new item to a shortlist
		//
		add: function (shortlistID, items) {
			return new Promise(function(resolve, reject) {
				db('Shortlists').where({ ID: shortlistID }).first('TypeID', 'ProfileID')
					.then(function (shortlist) {

						var type = (shortlist.TypeID == 1) ? 'Artist' : 'Artwork',
							sourceTable = type + 's',
							typeIDField = type + 'ID',
							targetTable = 'Shortlist' + sourceTable,
							newIds = [];

						// prevent duplicate entries
						return db.select(db.raw(
							'ID AS ' + typeIDField + ', ' + shortlistID + ' as ShortlistID ' +
							'FROM ' + sourceTable + ' ' +
							'WHERE ID IN (' + items.join(',') + ')' +
							'AND ID NOT IN (SELECT ' + typeIDField + ' FROM ' + targetTable + ' WHERE ShortlistID = ' + shortlistID + ')'
						))
						.then(function (newItems) {
							if (newItems.length) {
								newIds = newItems.map(function (item) {
									return item[typeIDField];
								});

								return db(targetTable).insert(newItems).then(function() {
									if (shortlist.TypeID === 2) {

										//
										// find all shortlists with one of these artwork id's
										//
										return db.distinct('s.ProfileID', 'aw.Name as ArtworkName', 'p.Name').select()
											.from('ShortlistArtworks as sa')
											.join('Shortlists as s', 'sa.ShortlistID', 's.ID')
											.join('Artworks as aw', 'sa.ArtworkID', 'aw.ID')
											.join('Profiles as p', 'aw.ArtistProfileID', 'p.ID')
											.whereIn('sa.ArtworkID', newIds)
											.andWhere(function() {
												this.whereRaw('s.ProfileID <> ' + shortlist.ProfileID + ' AND s.ID <> ' + shortlistID + ' AND s.TypeID = ' + 2);
											})
											.then(function(profiles) {
												profiles.forEach(function(p) {
													//PushNotification.send({
													//	profileID: p.ProfileID,
													//	subject: 'Shortlist Alert',
													//	body: 'An artwork you have shortlisted (' + p.ArtworkName + ' by ' + p.Name + ') has been shortlisted by another user.'
													//});

												})

											})

									}


								})
							}
						})
						.then(function () {
							var r = { 'Message': 'Success' };
							r[sourceTable] = newIds.length;
							r[sourceTable + 'Added'] = newIds;
							r[sourceTable + 'Ignored'] = items.filter(function (i) {
								return newIds.indexOf(i*1) === -1;
							});
							resolve(r);
							updateArtworkShortlistCounts(newIds);
						})

					})
					.catch(reject);
			})
		},


		//
		// Removes an item from a shortlist
		//
		remove: function (shortlistID, itemID) {
			return new Promise(function(resolve, reject) {
				db('Shortlists').where({ ID: shortlistID }).first('TypeID')
					.then(function (shortlist) {

						var type = (shortlist.TypeID == 1) ? 'Artist' : 'Artwork',
							targetTable = 'Shortlist' + type + 's',
							where = { ShortlistID: shortlistID };

						where[type + 'ID'] = itemID;

						return db(targetTable).where(where).del().then(function () {
							if (shortlist.TypeID === 2) {
								updateArtworkShortlistCounts([ itemID ]);
							}
						});
					})
					.then(resolve)
					.catch(reject);
			})
		}

	},



	//
	// Returns the profileID that owns the specified shortlist
	//
	owner: function (shortlistID) {
		return new Promise(function(resolve, reject) {
			db('Shortlists').where({ID: shortlistID, Deleted: 0}).first('ProfileID', 'TypeID')
				.then(resolve)
				.catch(reject);
		})
	},



	//
	// Removes/archives a shortlist
	//
	remove: function (shortlistID) {
		return new Promise(function(resolve, reject) {
			db('Shortlists').where({ ID: shortlistID }).update({ Deleted: 1 })
				.then(resolve)
				.catch(reject);
		})
	},


	//
	// Updates a shortlist
	//
	update: function (shortlistID, data) {
		return new Promise(function(resolve, reject) {
			db('Shortlists').where('ID', shortlistID).first()
				.then(function (shortlist) {
					return db('Shortlists').where('ID', shortlistID)
						.update({
							Name: data.Name || shortlist.Name,
							Description: data.Description || shortlist.Description,
							Target: data.Target || shortlist.Target
						})
				})
				.then(resolve)
				.catch(reject);
		})
	}



};

//								.then(function () {
//									if (type === 'Artwork') {
//										for (var i in newIDs) {
//											Analytics.event.add(req, 15, { ShortlistID: shortlistID, ArtworkID: newIDs[i] });
//										}
//										updateShortlistCount(newIDs);

//
//	// delete shortlist artwork
//	.delete('/:shortlistID/artwork/:artworkID/remove', function (req, res) {
//
//		// check arguments
//		var shortlistID = req.params.shortlistID * 1;
//		if (isNaN(shortlistID)) {
//			return res.status(400).json({ 'Message': 'Invalid shortlist ID: ' + req.params.shortlistID })
//		}
//
//		var artworkID = req.params.artworkID * 1;
//		if (isNaN(artworkID)) {
//			return res.status(400).json({ 'Message': 'Invalid artwork ID: ' + req.params.artworkID })
//		}
//
//		// check current user
//		AccessToken.getUser(req).then(function (user) {
//
//			// user should only get here if authenticated
//			if (!user) return res.status(500).json({ Message: 'Current user could not be determined' });
//
//			// does shortlist exists and belong to user
//			db('Shortlists').first('ID', 'ProfileID').where({ ID: shortlistID })
//			.then(function (shortlist) {
//
//				if (!shortlist) {
//					return res.status(404).json({ Message: 'Shortlist not found' });
//				}
//				if (shortlist.ProfileID != user.ProfileID) {
//					return res.status(403).json({ Message: 'You do not have permission to modify this shortlist' })
//				}
//
//				// remove shortlist artwork if it exists
//				db('ShortlistArtworks').where({ ShortlistID: shortlistID, ArtworkID: artworkID }).del()
//				.then(function () {
//					res.json({ Message: 'Success' });
//				})
//				.then(function () {
//					Analytics.event.add(req, 16, { ShortlistID: shortlistID, ArtworkID: artworkID });
//				})
//				.then(function () {
//					updateShortlistCount([artworkID]);
//				})
//				.catch(function (err) {
//					logError(err, req, function () {
//						res.status(500).json({ Message: 'Error removing shortlisted artwork from database' });
//					});
//				})
//
//			})
//			.catch(function (err) {
//				logError(err, req, function () {
//					res.status(500).json({ Message: 'Error removing shortlisted artwork from database' });
//				});
//			})
//
//		})
//
//	})
//
