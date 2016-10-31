var express = require('express'),
	config = require('../config'),
	fs = require('fs'),
	im = require("imagemagick"),
	uuid = require('node-uuid'),
	AccessToken = require('../../auth/access-token'),
	ActivCanvas = require('../lib/activcanvas'),
	Promise = require('bluebird'),
	Analytics = require('../lib/analytics');



var addToActivCanvasQueue = function (artworkID, profileID) {

	return db.first().from('Profiles').where('ID', profileID)
		.then(function (profile) {

			return db('ArtworkVideos').where('ArtworkID', artworkID).orderBy('Priority', 'asc').first()
				.then(function (awv) {
					awv = awv || {};

					var queueEntry = { artworkID: artworkID };

					if (profile.ActivCanvasStatusID === 3) {
						queueEntry.priority = ActivCanvas.PRIORITY.HIGH;

						if (!awv.NoVideo) {
							queueEntry.videoID = awv.VideoID ? awv.VideoID : profile.VideoID;
						}
					}

					return ActivCanvas.queue(queueEntry);
				})
		})
};




module.exports = {

	list: {

		// returns a list of dimension units
		dimensionUnits: function() {
			return new Promise(function (resolve, reject) {
				db('DimensionUnits').select('ID', 'Name', 'Symbol', 'Ratio_MM')
					.then(resolve)
					.catch(reject);
			})
		},

		// returns a list of price bands
		priceBands: function() {
			return new Promise(function (resolve, reject) {
				db('Pricebands').select('ID', 'Min', 'Max').orderBy('Min')
					.then(resolve)
					.catch(reject);
			})
		},

		// returns a list of artwork statuses
		statuses: function() {
			return new Promise(function (resolve, reject) {
				db('ArtworkStatus').select('ID', 'Status').orderBy('Status')
				.then(resolve)
				.catch(reject);
			})
		},

		// returns a list of artwork styles
		styles: function(profileID) {
			return new Promise(function (resolve, reject) {
				var sql = 's.ID, s.Style FROM Styles s';
				if (profileID) {
					sql +=
						' JOIN ArtworkStyles as aws on s.ID = aws.StyleID' +
						' JOIN Artworks aw on aw.ID = aws.ArtworkID ' +
						' WHERE aw.ArtistProfileID ' + (Array.isArray(profileID) ? 'IN (' + profileID + ')' : '= ' + profileID) + ' AND aw.Deleted = 0';
				}

				db.distinct(db.raw(sql + ' ORDER BY Style'))
					.then(resolve)
					.catch(reject);
			})
		},

		// returns a list of artwork subject
		subjects: function(profileID) {
			return new Promise(function (resolve, reject) {
				var sql = 's.ID, s.Subject FROM Subjects s';
				if (profileID) {
					sql +=
						' JOIN ArtworkSubjects as aws on s.ID = aws.SubjectID' +
						' JOIN Artworks aw on aw.ID = aws.ArtworkID ' +
						' WHERE aw.ArtistProfileID ' + (Array.isArray(profileID) ? 'IN (' + profileID + ')' : '= ' + profileID) + ' AND aw.Deleted = 0';
				}

				db.distinct(db.raw(sql + ' ORDER BY Subject'))
					.then(resolve)
					.catch(reject);
			})
		},

		// returns a list of time spent on artwork options
		timeSpent: function() {
			return new Promise(function (resolve, reject) {
				db('ArtworkTimeSpent').select('ID', 'Description').orderBy('Description')
					.then(resolve)
					.catch(reject);
			})
		},

		// returns a list of artwork types
		types: function(profileID) {
			return new Promise(function (resolve, reject) {
				var sql = 't.ID, t.Type FROM ArtworkTypes t';
				if (profileID) {
					sql +=
						' JOIN Artworks aw on aw.ArtworkTypeID = t.ID ' +
						' WHERE aw.ArtistProfileID ' + (Array.isArray(profileID) ? 'IN (' + profileID + ')' : '= ' + profileID) + ' AND aw.Deleted = 0';
				}

				db.distinct(db.raw(sql + ' ORDER BY Type'))
					.then(resolve)
					.catch(reject);
			})
		}
	},


	//
	// Adds a new artwork record to the database
	//
	// Parameters:
	// 	* artwork		object (required) 	- artwork record to be saved
	// 	* profileID		int (required) 		- the profile id the artwork should be associated with
	//
	add: function(artwork, profileID) {
		return new Promise(function (resolve, reject) {
			var artworkID = -1;

			db.first().from('Profiles').where('ID', profileID)
				.then(function (profile) {

					if (!profile) {
						reject({ status: 404, message: 'Profile not found' });
					}
					else {

						// get dimensions of uploaded image file
						im.identify(artwork.ImageURI, function (err, features) {
							if (err) {
								reject({ status: 500, message: 'Error accessing uploaded image, image may be corrupt or the format is unsupported' });
							}
							else {
								db('Artworks').insert({
									ArtworkTypeID: artwork.ArtworkTypeID,
									ArtistProfileID: profileID,
									OwnerProfileID: profileID,
									Name: artwork.Name,
									ImageURI: artwork.ImageURI,
									ImageWidth: features.width,
									ImageHeight: features.height,
									Complete: 1,
									created_at: new Date(),
									updated_at: new Date()
								})
								.then(function (_id) {
									artworkID = _id[0];
								})
								.then(function () {
									if (artwork.ImageColours) {
										var colours = [];
										for (var i in artwork.ImageColours) {
											if (artwork.ImageColours[i]) {
												colours.push({
													ArtworkID: artworkID,
													R: artwork.ImageColours[i][0],
													G: artwork.ImageColours[i][1],
													B: artwork.ImageColours[i][2],
													Priority: (i * 1) + 1
												});
											}
										}
										return db('ArtworkColours').insert(colours);
									}
								})

								.then(function () {
									return addToActivCanvasQueue(artworkID, profileID);
								})
								.then(function () {
									resolve({ ID: artworkID, Message: 'Success' });
								})
								.catch(reject)
							}
						});
					}

				});

		});
	},


	//
	// Adds multiple artwork records to the database
	//
	// Parameters:
	// 	* artworks		array (required) 	- an array of artwork records to be saved
	// 	* profileID		int (required) 		- the profile id the artwork should be associated with
	//
	bulkAdd: function(artworks, profileID) {
		return new Promise(function (resolve, reject) {

			db.first().from('Profiles').where('ID', profileID)
				.then(function (profile) {

					if (!profile) {
						reject({ status: 404, message: 'Profile not found' });
					}
					else {
						var saveArtwork = function (artwork) {
							return new Promise(function (_resolve, _reject) {

								// get dimensions of uploaded image file
								im.identify(artwork.ImageURI, function (err, features) {
										if (err) {
											//reject({ status: 400, message: 'Error accessing uploaded image, image format may be unsupported' });
										}
										else {
											var artworkID = -1;

											db('Artworks').insert({
												ArtworkTypeID: artwork.ArtworkTypeID,
												StatusID: 1,
												ArtistProfileID: profileID,
												OwnerProfileID: profileID,
												Name: artwork.Name,
												Price: artwork.Price,
												Description: '',
												ImageURI: artwork.ImageURI,
												ImageWidth: features.width,
												ImageHeight: features.height,
												ActivCanvasEnabled: !!artwork.VideoID,
												Complete: true,
												created_at: new Date(),
												updated_at: new Date()
											})
											.then(function (result) {
												artworkID = result[0];

												if (artwork.ImageColours) {
													var colours = [];
													for (var i in artwork.ImageColours) {
														if (artwork.ImageColours[i]) {
															colours.push({
																ArtworkID: artworkID,
																R: artwork.ImageColours[i][0],
																G: artwork.ImageColours[i][1],
																B: artwork.ImageColours[i][2],
																Priority: (i * 1) + 1
															});
														}
													}
													return db('ArtworkColours').insert(colours);
												}
											})
											.then(function () {
												var queueEntry = { artworkID: artworkID },
														videoID = null,
														defaultVideo = false,
														noVideo = true;

												// if profile associated with artwork is ActivCanvas enabled check if we need to update vuforia
												if (profile.ActivCanvasStatusID === 3) {
													queueEntry.priority = ActivCanvas.PRIORITY.HIGH;
													noVideo = artwork.VideoID === undefined;
													defaultVideo = artwork.VideoID === 0;
													videoID = artwork.VideoID ? artwork.VideoID : noVideo ? null: profile.VideoID;
												}

												return db('ArtworkVideos').where('ArtworkID', artworkID).del()
													.then(function () {
														return db('ArtworkVideos').insert({
															ArtworkID: artworkID,
															VideoID: (noVideo || defaultVideo ? null : videoID),
															NoVideo: noVideo,
															Priority: 1
														});
													})
													.then(function () {
														if (videoID) {
															queueEntry.videoID = videoID;
															return ActivCanvas.queue(queueEntry);
														}
														else {
															return ActivCanvas.queue(queueEntry);
														}
													})
											})
											.then(function () {
												_resolve();
											})
											.catch(_reject);
										}
									});
							});
						};

						var queue = [];
						artworks.forEach(function (artwork) {
							queue.push(saveArtwork(artwork));
						});

						return Promise.settle(queue)
							.then(function () {
								return db('Artworks').where({ ArtistProfileID: profileID }).count('ID as total');
							})
							.then(function (result) {
								if (result[0].total > 1) {
									return require('../utils/tasks').complete(profileID, 'first-artwork');
								}
							})
							.then(function () {
								resolve({ Message: 'Success' });
							})
					}
				})
				.catch(reject);


		});
	},



	//
	// Returns a single artwork record
	//
	// Parameters:
	// 	* artworkID		int (required) - id of record to be returned
	// 	* profileID 	int (optional) - profile id of requesting user
	//
	get: function(artworkID, profileID) {
		return new Promise(function (resolve, reject) {

			dbNest(
				db.select(
					'a.ID as _ID',
					'a.ArtworkTypeID as _ArtworkTypeID',
					'aty.Type as _Type',
					'a.ArtistProfileID as _ArtistProfileID',
					'a.StatusID as _StatusID',
					'sta.Status as _Status',
					'a.PricebandID as _PricebandID',
					'a.TimeSpentID as _TimeSpentID',
					'a.PricebandCustom as _PricebandCustom',
					'a.Name as _Name',
					'p.Name as _ArtistName',
					'a.Description as _Description',
					'a.ImageURI as _ImageURI',
					'a.WidthMM as _WidthMM',
					'a.HeightMM as _HeightMM',
					'a.DepthMM as _DepthMM',
					'a.DimensionUnitID as _DimensionUnitID',
					'a.Complete as _Complete',
					'a.Featured as _Featured',
					'a.LimitedEdition as _LimitedEdition',
					'a.LimitedEditionDetails as _LimitedEditionDetails',
					'p.ImageURI as _ProfileImageURI',
					'am.MaterialID as _Materials__ID',
					'm.Name as _Materials__Name',
					'st.StyleID as _Styles__ID',
					'sty.Style as _Styles__Name',
					'su.SubjectID as _Subjects__ID',
					'sub.Subject as _Subjects__Name',
					'al.ID as _Liked',
					'at.Tag as _pTags__Tag',
					'ac.R as _pColours__R',
					'ac.G as _pColours__G',
					'ac.B as _pColours__B',
					'ac.Priority as _pColours__Priority',
					'v.ID as _VideoID',
					'av.VideoID as _avVideoID',
					'av.NoVideo as _NoVideo',
					'v.VideoURI as _VideoURI',
					'v.Name as _VideoName',
					'p.VideoID as _DefaultVideoID',
					db.raw('IF(vt.Active IS NULL, 0, vt.Active) AS _Activated'),
					'vt.TrackingRating as _TrackingRating',
					'vt.SyncRequired as _SyncRequired',
					'a.Price as _Price',
					'a.Shareable as _Shareable',
					'a.CustomShareURL as _CustomShareURL',
					'a.Purchasable as _Purchasable'
				)
				.from('Artworks as a')
				.leftJoin('ArtworkStatus as sta', 'a.StatusID', 'sta.ID')
				.leftJoin('ArtworkTypes as aty', 'a.ArtworkTypeID', 'aty.ID')
				.leftJoin('ArtworkMaterials as am', 'am.ArtworkID', 'a.ID')
				.leftJoin('Materials as m', 'am.MaterialID', 'm.ID')
				.leftJoin('ArtworkStyles as st', 'st.ArtworkID', 'a.ID')
				.leftJoin('Styles as sty', 'st.StyleID', 'sty.ID')
				.leftJoin('ArtworkSubjects as su', 'su.ArtworkID', 'a.ID')
				.leftJoin('Subjects as sub', 'su.SubjectID', 'sub.ID')
				.leftJoin(db.raw('ArtworkLikes as al on al.ArtworkID = a.ID and al.ProfileID = ' + profileID))
				.leftJoin('ArtworkTags as at', 'at.ArtworkID', 'a.ID')
				.leftJoin('ArtworkColours as ac', 'ac.ArtworkID', 'a.ID')
				.leftJoin('ArtworkVideos as av', 'av.ArtworkID', 'a.ID')
				.leftJoin('VuforiaTargets as vt', 'a.ID', 'vt.ArtworkID')
				.join('Profiles as p', 'a.ArtistProfileID', 'p.ID')
				.leftJoin('Videos as v', db.raw('coalesce(av.VideoID, p.VideoID)'), 'v.ID')
				.where('a.ID', artworkID)
			)
			.then(function (_data) {
				if (!_data) {
					reject({ status: 404, message: 'Artwork not found' });
				}
				else {
					var data = _data[0];

					data.Tags = (data.pTags || []).map(function (tag) { return tag.Tag; });
					delete data.pTags;

					data.Colours = [];
					for (var i in data.pColours || []) {
						data.Colours.push(data.pColours[i]);
					}
					delete data.pColours;

					data.Colours = data.Colours.sort(function (a, b) {
						var _a = a.Priority, _b = b.Priority;
						if (_a < _b) {
							return -1;
						}
						if (_a > _b) {
							return 1;
						}
						return 0;
					});

					data.NoVideo = !!data.NoVideo;
					data.DefaultVideo = data.avVideoID == null && !data.NoVideo;
					delete data.avVideoID;


					var queue = [];

					// get a list of any user shortlists this artwork is currently in
					queue.push(
						db.select('sl.ID')
						.from('ShortlistArtworks as sa')
						.join('Shortlists as sl', 'sa.ShortlistID', 'sl.ID')
						.where({'sl.ProfileID': profileID, 'sa.ArtworkID': data.ID})
						.then(function (_ids) {
							data.Shortlists = [];
							for (var i in _ids) {
								data.Shortlists.push(_ids[i].ID);
							}
						})
					);

					// get total number of times this artwork has been shortlisted by anyone
					queue.push(
						db.count('ID as total')
						.from('ShortlistArtworks')
						.where({ 'ArtworkID': data.ID})
						.then(function (shortlisted) {
							data.Shortlisted = shortlisted[0].total
						})
					);

					// get video transcodes if any for this artwork
					var vid = data.NoVideo ? false : data.VideoID || data.DefaultVideoID;
					delete data.DefaultVideoID;
					if (!vid) {
						data.VideoTranscodes = [];
					}
					else {
						queue.push(
							db.select('vt.VideoID', 'vt.VideoURI', 'vtt.Type')
							.from('VideoTranscodes as vt')
							.join('VideoTranscodeTypes as vtt', 'vt.TypeID', 'vtt.ID')
							.where({ 'vt.VideoID': vid, 'vt.Complete': 1 })
							.then(function(transcodes) {
								data.VideoTranscodes = transcodes;
							})
						);
					}

					return Promise.all(queue).then(function() {
						resolve(data);
					});
				}
			})
			.catch(reject);


		})
	},


	//
	// Likes an artwork
	//
	// 	* artworkID		int (required) 		- the id the artwork to be liked
	// 	* profileID		int (required) 		- the id the profile liking the artwork
	//
	like: function(artworkID, profileID) {
		return new Promise(function(resolve, reject) {

			db('Artworks').where({ ID: artworkID }).first('ID')
				.then(function (artwork) {
					if (!artwork) {
						reject({ status: 404, message: 'Artwork not found' });
					}
					else {
						return db('ArtworkLikes').first('ID')
							.where({ ArtworkID: artworkID, ProfileID: profileID})
							.then(function (data) {
								if (!data) {
									return db('ArtworkLikes').insert({
										ProfileID: profileID,
										ArtworkID: artworkID
									})
									.then(function () {
										return db('ArtworkLikes').count('ID as total').where('ArtworkID', artworkID);
									})
									.then(function (result) {
										return db('Artworks').where('ID', artworkID).update({ Likes: result[0].total });
									})
									.then(resolve)
								}
								else {
									reject({ status: 200, message: 'You\'ve already like this artwork' });
								}
							})
					}

				})
				.catch(reject)


		})
	},


	//
	// Marks a single artwork record as deleted
	//
	// Parameters:
	// 	* artworkID		int (required) - id of artwork record
	//
	remove: function(artworkID) {
		return new Promise(function (resolve, reject) {

			db('Artworks').where({ ID: artworkID }).first()
				.then(function(artwork) {

					if (!artwork) {
						reject({ status: 404, message: 'Artwork not found' });
					}
					else {
						return db('Artworks').where({ ID: artworkID }).update({ Deleted: 1 })
							.then(function () {
								return db.first().from('VuforiaTargets').where({ ArtworkID: artworkID });
							})
							.then(function (target) {
								if (target && target.TargetID) {
									ActivCanvas.queue({ artworkID: artworkID, deactivate: true });
								}
							})
							.then(resolve);
					}

				})
				.catch(reject);

		});
	},



	//
	// Searches artwork belonging to a specific profile
	//
	// Parameters:
	// 	*
	//
	search: function(profileID, filters, pagination, sort) {
		return new Promise(function (resolve, reject) {

			filters = filters || {};
			sort = sort || {};

			// set pagination defaults if no or partial values specified
			pagination = pagination || {};
			pagination.PageNumber = pagination.PageNumber || 0;
			pagination.PageSize = pagination.PageSize || 10;
			pagination.PageSize = pagination.PageSize > 100 ? 100 : pagination.PageSize < 1 ? 1 : pagination.PageSize;


			// construct base sql query
			var sql =
				'from Artworks a ' +
				'left join ArtworkTypes at on a.ArtworkTypeID = at.ID ' +
				'left join VuforiaTargets vt on a.ID = vt.ArtworkID ' +
				'left join ArtworkVideos av on av.ArtworkID = a.ID ' +
				'left join Videos v on av.VideoID = v.ID ' +
				'join Profiles p on a.ArtistProfileID = p.ID ',

			where =
				'where a.Deleted = 0 and ((a.Complete = 1 and a.ImageURI <> \'\' and a.ImageWidth > 0 and a.ImageHeight > 0) or a.OwnerProfileID = ' + profileID + ' or a.ArtistProfileID = ' + profileID + ') ',

			sortSql = '';

			// append filters to query
			if (Object.keys(filters).length) {
				if (filters.ArtistProfiles) {
					where += ' and a.ArtistProfileID in (' + filters.ArtistProfiles + ') ';
				}
				if (filters.ArtistProfileID) {
					where += ' and a.ArtistProfileID = ' + filters.ArtistProfileID;
				}
				if (filters.OwnerProfileID) {
					where += ' and a.OwnerProfileID = ' + filters.OwnerProfileID;
				}
				if (filters.ConnectedProfileID) {
					where += ' and a.OwnerProfileID in (select ProfileID from Connections where ConnectedProfileID =' + filters.ConnectedProfileID + ')';
				}
				if (filters.ConnectionsArt) {
					where += ' and (' +
						'(a.OwnerProfileID in (select ConnectedProfileID from Connections where Accepted = 1 and ProfileID =' + profileID + '))' +
						' or ' +
						'(a.OwnerProfileID in (select ProfileID from Connections where Accepted = 1 and ConnectedProfileID =' + profileID + '))' +
						' or ' +
						'(a.ArtistProfileID in (select ConnectedProfileID from Connections where Accepted = 1 and ProfileID =' + profileID + '))' +
						' or ' +
						'(a.ArtistProfileID in (select ProfileID from Connections where Accepted = 1 and ConnectedProfileID =' + profileID + '))' +
						')'
				}

				if (filters.Activated !== undefined) {
					where += ' and vt.TrackingRating IS ' + (filters.Activated ? 'NOT ' : '') + 'NULL';
				}
				if (filters.ArtistName) {
					where += ' and p.Name like \'%' + filters.ArtistName + '%\'';
				}
				if (filters.Name) {
					where += ' and a.Name like \'%' + filters.Name + '%\'';
				}
				if (filters.MaterialID) {
					sql += ' join ArtworkMaterials AS awmt ON a.ID = awmt.ArtworkID ';
					where += ' AND awmt.MaterialID =' + filters.MaterialID;
				}
				if (filters.Type) {
					where += ' and a.ArtworkTypeID IN (' + filters.Type.join() + ')';
				}
				if (filters.TypeID) {
					where += ' and a.ArtworkTypeID = ' + filters.TypeID;
				}
				if (filters.Style) {
					sql += ' join ArtworkStyles AS awSty ON a.ID = awSty.ArtworkID ';
					where += ' AND awSty.StyleID IN (' + filters.Style.join() + ')';
				}
				if (filters.StyleID) {
					sql += ' join ArtworkStyles AS awSty ON a.ID = awSty.ArtworkID ';
					where += ' AND awSty.StyleID =' + filters.StyleID;
				}
				if (filters.SubjectID) {
					sql += ' join ArtworkSubjects AS awSbj ON a.ID = awSbj.ArtworkID ';
					where += ' AND awSbj.SubjectID =' + filters.SubjectID;
				}
				if (filters.Price) {
					where += ' AND a.PricebandID IN (' + filters.Price.join() + ')';
				}

				if (filters.Colour) {
					var colours = filters.Colour, range = 25;
					sql += 'JOIN ArtworkColours as awCol ON a.ID = awCol.ArtworkID ';
					where += ' AND(';
					for (var i = 0; i < colours.length; i++) {
						if (i) where += ' OR ';
						where +=
							'(' +
								'awCol.R BETWEEN ' + Math.max(0, colours[i].R - range) + ' AND ' + Math.min(255, colours[i].R + range) + ' AND ' +
								'awCol.G BETWEEN ' + Math.max(0, colours[i].G - range) + ' AND ' + Math.min(255, colours[i].G + range) + ' AND ' +
								'awCol.B BETWEEN ' + Math.max(0, colours[i].B - range) + ' AND ' + Math.min(255, colours[i].B + range) +
							')';
					}
					where += ')';
					sortSql = 'awCol.Priority asc, ';
				}

				if (filters.VideoID) {
					where += ' AND (av.VideoID = ' + filters.VideoID + ' OR p.VideoID = ' + filters.VideoID + ') ';
				}
			}

			// set query sort parameters
			var direction = (sort.Direction || '').toLowerCase() === 'asc' ? 'ASC': 'DESC';
			switch (sort.Field) {
				case 'Activated':
					sortSql += ' Activated ' + direction + ', a.updated_at ' + direction;
					break;
				case 'ActivCanvasEnabled':
					sortSql += ' a.ActivCanvasEnabled ' + direction + ', a.updated_at ' + direction;
					break;
				case 'ArtistName':
					sortSql += ' p.Name ' + direction;
					break;
				case 'AvailableProducts':
					sortSql += ' AvailableProducts ' + direction + ', a.updated_at ' + direction;
					break;
				case 'Likes':
					sortSql += ' a.Likes ' + direction;
					break;
				case 'Name':
					sortSql += ' a.Name ' + direction;
					break;
				case 'Popular':
					sortSql += ' (a.Views + a.Likes + a.Shortlisted) ' + direction;
					break;
				case 'Shortlisted':
					sortSql += ' a.Shortlisted ' + direction;
					break;
				case 'Shareable':
					sortSql += ' a.Shareable ' + direction + ', a.updated_at ' + direction;
					break;
				case 'TrackingRating':
					sortSql += ' vt.TrackingRating ' + direction;
					break;
				case 'TotalProducts':
					sortSql += ' TotalProducts ' + direction + ', a.updated_at ' + direction;
					break;
				case 'Type':
					sortSql += ' at.Type ' + direction + ', a.updated_at ' + direction;
					break;
				case 'VideoName':
					sortSql += ' v.Name ' + direction + ', a.updated_at ' + direction;
					break;
				case 'Views':
					sortSql += ' a.Views ' + direction;
					break;
				default:
					sortSql += ' a.updated_at ' + direction + ', a.ID desc';
					break;
			}

			// execute query
			db.first(db.raw(
				'count(a.ID) as Results ' + sql + where
			))
			.then(function (total) {

				db.select(db.raw(
					'a.*, ' +
					'p.ImageURI as ProfileImageURI, ' +
					'p.Name as ArtistName, ' +
					'at.Type, ' +
					'IF(vt.Active IS NULL, 0, vt.Active) AS Activated, ' +
					'vt.TrackingRating, ' +
					'vt.SyncRequired, ' +
					'av.NoVideo, ' +
					'av.VideoID, ' +
					'v.Name as VideoName, ' +
					'(SELECT COUNT(pr.ID) FROM Products pr where pr.ArtworkID = a.ID) AS TotalProducts,' +
					'(SELECT COUNT(pr.ID) FROM Products pr where pr.ArtworkID = a.ID AND (pr.Quantity IS NULL OR pr.Quantity > 0)) AS AvailableProducts ' +
					sql + where +
					' order by ' + sortSql + ', a.created_at desc'
				))
				.offset(pagination.PageSize * pagination.PageNumber)
				.limit(pagination.PageSize)
				.then(function (data) {
					pagination.TotalResults = total.Results;

					var queue = [];

					data.forEach(function (item) {
						if (!item.ProfileImageURI) {
							item.ProfileImageURI = config.profile.defaultImage;
						}

						queue.push(db.select('R', 'G', 'B', 'Priority')
							.from('ArtworkColours')
							.where('ArtworkID', item.ID)
							.orderBy('Priority')
							.then(function (colours) {
								item.Colours = colours;
							})
						);

						queue.push(db.select('m.Name')
							.from('ArtworkMaterials as am')
							.join('Materials as m', 'm.ID', 'am.MaterialID')
							.where('am.ArtworkID', item.ID)
							.orderBy('Name')
							.then(function (materials) {
								item.Materials = materials.map(function (m) {
									return m.Name;
								});
							})
						);

						queue.push(db.select('s.Style')
							.from('ArtworkStyles as as')
							.join('Styles as s', 's.ID', 'as.StyleID')
							.where('as.ArtworkID', item.ID)
							.orderBy('Style')
							.then(function (styles) {
								item.Styles = styles.map(function (s) {
									return s.Style;
								});
							})
						);

						queue.push(db.select('s.Subject')
								.from('ArtworkSubjects as as')
								.join('Subjects as s', 's.ID', 'as.SubjectID')
								.where('as.ArtworkID', item.ID)
								.orderBy('Subject')
								.then(function (subjects) {
									item.Subjects = subjects.map(function (s) {
										return s.Subject;
									});
								})
						)

					});

					return Promise.all(queue).then(function () {
						resolve({
							Data: data,
							Pagination: pagination
						});
					});


				})
				.catch(reject);

			})
			.catch(reject);


		});
	},



	//
	// Unlikes an artwork
	//
	// 	* artworkID		int (required) 		- the id the artwork to be un-liked
	// 	* profileID		int (required) 		- the id the profile to un-liking this artwork
	//
	unlike: function(artworkID, profileID) {
		return new Promise(function(resolve, reject) {

			db('Artworks').where({ ID: artworkID }).first('ID')
				.then(function (artwork) {
					if (!artwork) {
						reject({ status: 404, message: 'Artwork not found' });
					}
					else {
						return db('ArtworkLikes').first()
							.where({ ArtworkID: artworkID, ProfileID: profileID })
							.then(function (data) {
								if (data) {
									return db('ArtworkLikes').where('ID', data.ID).delete()
										.then(function () {
											return db('ArtworkLikes').count('ID as total').where('ArtworkID', artworkID);
										})
										.then(function (result) {
											return db('Artworks').where('ID', artworkID).update({ Likes: result[0].total });
										})
								}
							})
							.then(resolve)
					}

				})
				.catch(reject)

		})
	},


	//
	// Updates an existing artwork record
	//
	update: {


		activCanvas: function(artworkID, artwork) {
			return new Promise(function (resolve, reject) {

				db.first().from('Artworks').where('ID', artworkID)
					.then(function (data) {
						if (!data) {
							reject({status: 404, message: 'Artwork not found'});
						}
						else {

							db('Artworks').where('ID', artworkID)
								.update({
									Shareable: artwork.Shareable !== undefined ? artwork.Shareable : data.Shareable,
									CustomShareURL: artwork.CustomShareURL !== undefined ? artwork.CustomShareURL : data.CustomShareURL,
									ActivCanvasEnabled: artwork.VideoID !== undefined ? !!artwork.VideoID : data.ActivCanvasEnabled,
									updated_at: new Date()
								})
								.then(function () {
									return db('ArtworkVideos').where('ArtworkID', artworkID).del();
								})
								.then(function () {
									var defaultVideo = artwork.VideoID === 0,
										noVideo = artwork.VideoID === undefined;

									return db('ArtworkVideos').insert({
										ArtworkID: artworkID,
										VideoID: (noVideo || defaultVideo ? null : artwork.VideoID),
										NoVideo: noVideo,
										Priority: 1
									});
								})
								.then(function () {
									return addToActivCanvasQueue(artworkID, data.ArtistProfileID);
								})
								.then(function () {
									resolve({
										ID: artworkID,
										Message: 'Success'
									});
								})
								.catch(reject);

						}

					})

			});
		},


		general: function(artworkID, artwork) {
			return new Promise(function (resolve, reject) {

				db.first().from('Artworks').where('ID', artworkID)
						.then(function (data) {
							if (!data) {
								reject({status: 404, message: 'Artwork not found'});
							}
							else {

								// this method will update the database once we have checked the image file if required
								// - check is below this method
								var updateArtwork = function (features) {
									var limitedEdition = artwork.LimitedEdition !== undefined ? artwork.LimitedEdition : data.LimitedEdition;

									db('Artworks')
											.where('ID', artworkID)
											.update({
												ArtworkTypeID: artwork.ArtworkTypeID || data.ArtworkTypeID,
												Name: artwork.Name || data.Name,
												Description: artwork.Description || data.Description,
												Price: artwork.Price !== undefined ? artwork.Price : data.Price,
												ImageURI: artwork.ImageURI || data.ImageURI,
												ImageWidth: features.width || data.ImageWidth,
												ImageHeight: features.height || data.ImageHeight,
												LimitedEdition: limitedEdition,
												LimitedEditionDetails: limitedEdition ? artwork.LimitedEditionDetails || data.LimitedEditionDetails : '',
												updated_at: new Date()
											})
											.then(function () {
												if (artwork.Styles) {
													return db('ArtworkStyles').where('ArtworkID', artworkID).del();
												}
											})
											.then(function () {
												if (artwork.Styles && artwork.Styles.length) {
													var styles = [];
													for (var i in artwork.Styles) {
														if (artwork.Styles[ i ]) {
															styles.push({
																ArtworkID: artworkID,
																StyleID: artwork.Styles[ i ]
															})
														}
													}
													return db('ArtworkStyles').insert(styles);
												}
											})
											.then(function () {
												if (artwork.Tags) {
													return db('ArtworkTags').where('ArtworkID', artworkID).del();
												}
											})
											.then(function () {
												if (artwork.Tags && artwork.Tags.length) {
													var tags = [];
													for (var i in artwork.Tags) {
														if (artwork.Tags[i]) {
															tags.push({
																ArtworkID: artworkID,
																Tag: artwork.Tags[i]
															});
														}
													}
													return db('ArtworkTags').insert(tags);
												}
											})
											.then(function () {
												if (artwork.ImageColours) {
													return db('ArtworkColours').where('ArtworkID', artworkID).del();
												}
											})
											.then(function () {
												if (artwork.ImageColours && artwork.ImageColours.length) {
													var colours = [];
													for (var i in artwork.ImageColours) {
														if (artwork.ImageColours[i]) {
															colours.push({
																ArtworkID: artworkID,
																R: artwork.ImageColours[i][0],
																G: artwork.ImageColours[i][1],
																B: artwork.ImageColours[i][2],
																Priority: (i * 1) + 1
															});
														}
													}
													return db('ArtworkColours').insert(colours);
												}
											})
											.then(function () {
												if (artwork.ImageURI && artwork.ImageURI !== data.ImageURI) {
													return db('VuforiaTargets').where('ArtworkID', artworkID).update({
														BadImage: 0,
														AdjustedContrast: 0
													})
													.then(function () {
														return addToActivCanvasQueue(artworkID, data.ArtistProfileID);
													})
												}
											})
											.then(function () {
												resolve({
													ID: artworkID,
													Message: 'Success'
												});
											})
											.catch(reject)
								};


								// check if image uri has been changed since the last save
								var _imgURI = artwork.ImageURI || data.ImageURI;
								if (_imgURI !== data.ImageURI) {

									// grab useful meta data from new image file
									im.identify(_imgURI, function (err, features) {
										if (err) {
											reject({ status: 500, message: 'Error accessing uploaded image, image may be corrupt or the format is unsupported' });
										}
										else {
											updateArtwork(features);
										}
									});
								}
								else {
									updateArtwork({});
								}

							}

						})

			});
		}

	},




	//
	// Returns the enquire to/dirty buy html page
	//
	// Parameters:
	// 	* artworkID		int (required) - id of artwork record
	// 	* token 		string (optional) - access token for requesting user
	//
	buy: function(artworkID, accessToken) {
		return new Promise(function (resolve, reject) {

			fs.readFile(__dirname + '/../static/artwork-buy.htm', 'utf8', function (err, contents) {
				if (err) {
					reject(err);
				}
				else {
					resolve(contents
							.replace(/\[CDV\]/g, 'cdv=' + clientDependencyVersion)
							.replace(/\[ARTWORKID\]/g, artworkID)
							.replace(/\[ACCESS_TOKEN\]/g, accessToken || '')
					);
				}
			})

		});
	},



	//
	// Returns the view artwork html page - used for share functionality within AC app
	//
	// Parameters:
	// 	* artworkID		int (required) - id of artwork record
	//
	view: function(artworkID, host, originalUrl) {
		return new Promise(function (resolve, reject) {

			db.first('aw.*', 'p.Name as ArtistName')
				.from('Artworks as aw')
				.join('Profiles as p', 'aw.ArtistProfileID', 'p.ID')
				.where({ 'aw.ID': artworkID })
				.then(function(artwork) {
					if (!artwork) {
						reject({ status: 404, message: 'Artwork not found' });
					}
					else if (artwork.CustomShareURL) {
						reject({ status: 302, url: artwork.CustomShareURL });
					}
					else {
						fs.readFile(__dirname + '/../static/artwork-view.htm', 'utf8', function (err, contents) {
							if (err) {
								reject(err);
							}
							else {
								resolve(contents
									.replace(/\[CDV\]/g, 'cdv=' + clientDependencyVersion)
									.replace(/\[ARTWORKID\]/g, artworkID)
									.replace(/\[CURRENT_URL\]/g, 'https://' + host + originalUrl)
									.replace(/\[HOST_URL\]/g, 'https://' + host)
									.replace(/\[ARTWORK_NAME\]/g, artwork.Name)
									.replace(/\[ARTWORK_ARTISTNAME\]/g, artwork.ArtistName)
									.replace(/\[ARTWORK_IMAGEURI\]/g, artwork.ImageURI)
									.replace(/\[ARTWORK_IMAGEURI_ENC\]/g, encodeURIComponent(artwork.ImageURI))
									.replace(/\[ARTWORK_DESCRIPTION\]/g, artwork.Description || (artwork.ArtistName + ' has not added a description yet'))
								);
							}
						});

					}
				})
				.catch(reject);

		});
	}



};


//
//		.get('/tag/autocomplete/:tag', function (req, res) {
//			try {
//				db('ArtworkTags')
//						.distinct('Tag')
//						.select()
//						.whereRaw('Tag LIKE ?', ['%' + req.params.tag + '%'])
//						.orderBy('Tag')
//						.limit(20)
//						.then(function (data) {
//							res.json(data)
//						})
//						.catch(function (err) {
//							logError(err, req, function () {
//								res.status(500).json({Message: 'Unexpected error occurred'});
//							});
//						});
//			}
//			catch (err) {
//				logError(err, req, function () {
//					res.status(500).json({Message: 'Unexpected error occurred'});
//				});
//			}
//		})
