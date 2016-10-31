var express = require('express'),
	fs = require('fs'),
	mkdirp = require('mkdirp'),
	im = require("imagemagick"),
	uuid = require('node-uuid'),
	url = require('url'),
	AccessToken = require('../../auth/access-token'),
	ActivCanvas = require('../lib/activcanvas'),
	Promise = require('bluebird'),
	Analytics = require('../lib/analytics');


module.exports = {

	unauthenticated: express.Router()

		.get('/dimension-units', function (req, res) {
			try {
				db('DimensionUnits')
					.select('ID', 'Name', 'Symbol', 'Ratio_MM')
					.then(function (data) {
						res.json(data)
					})
					.catch(function (err) {
						logError(err, req, function () {
							res.status(500).json({Message: 'Unexpected error occurred'});
						});
					});
			}
			catch (err) {
				logError(err, req, function () {
					res.status(500).json({Message: 'Unexpected error occurred'});
				});
			}
		})

		.get('/pricebands', function (req, res) {
			try {
				db('Pricebands')
					.select('ID', 'Min', 'Max')
					.orderBy('Min')
					.then(function (data) {
						res.json(data)
					})
					.catch(function (err) {
						logError(err, req, function () {
							res.status(500).json({Message: 'Unexpected error occurred'});
						});
					});
			}
			catch (err) {
				logError(err, req, function () {
					res.status(500).json({Message: 'Unexpected error occurred'});
				});
			}
		})

		.get('/statuses', function (req, res) {
			try {
				db('ArtworkStatus')
					.select('ID', 'Status')
					.orderBy('Status')
					.then(function (data) {
						res.json(data)
					})
					.catch(function (err) {
						logError(err, req, function () {
							res.status(500).json({Message: 'Unexpected error occurred'});
						});
					});
			}
			catch (err) {
				logError(err, req, function () {
					res.status(500).json({Message: 'Unexpected error occurred'});
				});
			}
		})

		.get('/styles', function (req, res) {
			try {
				db('Styles')
					.select('ID', 'Style')
					.orderBy('Style')
					.then(function (data) {
						res.json(data)
					})
					.catch(function (err) {
						logError(err, req, function () {
							res.status(500).json({Message: 'Unexpected error occurred'});
						});
					});
			}
			catch (err) {
				logError(err, req, function () {
					res.status(500).json({Message: 'Unexpected error occurred'});
				});
			}
		})

		.get('/subjects', function (req, res) {
			try {
				db('Subjects')
					.select('ID', 'Subject')
					.orderBy('Subject')
					.then(function (data) {
						res.json(data)
					})
					.catch(function (err) {
						logError(err, req, function () {
							res.status(500).json({Message: 'Unexpected error occurred'});
						});
					});
			}
			catch (err) {
				logError(err, req, function () {
					res.status(500).json({Message: 'Unexpected error occurred'});
				});
			}
		})

		.get('/time-spent', function (req, res) {
			try {
				db('ArtworkTimeSpent')
					.select('ID', 'Description')
					.then(function (data) {
						res.json(data)
					})
					.catch(function (err) {
						logError(err, req, function () {
							res.status(500).json({Message: 'Unexpected error occurred'});
						});
					});
			}
			catch (err) {
				logError(err, req, function () {
					res.status(500).json({Message: 'Unexpected error occurred'});
				});
			}
		})

		.get('/types', function (req, res) {
				try {
					db('ArtworkTypes')
						.select('ID', 'Type', 'Description')
						.orderBy('Type')
						.then(function (data) {
							res.json(data)
						})
						.catch(function (err) {
							logError(err, req, function () {
								res.status(500).json({Message: 'Unexpected error occurred'});
							});
						});
				}
				catch (err) {
					logError(err, req, function () {
						res.status(500).json({Message: 'Unexpected error occurred'});
					});
				}
			})

		// returns the specified artwork
		.get('/:artworkID', function (req, res) {
			try {
				AccessToken.getUser(req).then(function (user) {

					if (!user) {
						user = { ProfileID: -1 }
					}
					dbNest(
						db.select(
							'a.ID as _ID',
							'a.ArtworkTypeID as _ArtworkTypeID',
							'aty.Type as _Type',
							'a.ArtistProfileID as _ArtistProfileID',
							'a.StatusID as _StatusID',
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
							'am.MaterialID as _pMaterials__ID',
							'm.Name as _pMaterialNames__Name',
							'st.StyleID as _pStyles__ID',
							'su.SubjectID as _pSubjects__ID',
							'al.ID as _Liked',
							'at.Tag as _pTags__Tag',
							'ac.R as _pColours__R',
							'ac.G as _pColours__G',
							'ac.B as _pColours__B',
							'ac.Priority as _pColours__Priority',
							'av.VideoID as _VideoID',
							'p.VideoID as _DefaultVideoID',
							'vt.TrackingRating as _TrackingRating',
							'vt.SyncRequired as _SyncRequired',
							'a.Price as _Price',
							'a.Shareable as _Shareable',
							'a.CustomShareURL as _CustomShareURL',
							'a.Purchasable as _Purchasable'
						)
						.from('Artworks as a')
						.leftJoin('ArtworkTypes as aty', 'a.ArtworkTypeID', 'aty.ID')
						.leftJoin('ArtworkMaterials as am', 'am.ArtworkID', 'a.ID')
						.leftJoin('Materials as m', 'am.MaterialID', 'm.ID')
						.leftJoin('ArtworkStyles as st', 'st.ArtworkID', 'a.ID')
						.leftJoin('ArtworkSubjects as su', 'su.ArtworkID', 'a.ID')
						.leftJoin(db.raw('ArtworkLikes as al on al.ArtworkID = a.ID and al.ProfileID = ' + user.ProfileID))
						.leftJoin('ArtworkTags as at', 'at.ArtworkID', 'a.ID')
						.leftJoin('ArtworkColours as ac', 'ac.ArtworkID', 'a.ID')
						.leftJoin('ArtworkVideos as av', 'av.ArtworkID', 'a.ID')
						.leftJoin('VuforiaTargets as vt', 'a.ID', 'vt.ArtworkID')
						.join('Profiles as p', 'a.ArtistProfileID', 'p.ID')
						.where('a.ID', req.params.artworkID)
					)
					.then(function (_data) {
						if (!_data) {
							res.status(404).json({Message: 'Artwork not found'});
						}
						else {
							var data = _data[0];

							data.Materials = [];
							for (var i in data.pMaterials || []) {
								data.Materials.push(data.pMaterials[i].ID);
							}
							delete data.pMaterials;

							data.MaterialNames = [];
							for (var i in data.pMaterialNames || []) {
								data.MaterialNames.push(data.pMaterialNames[i].Name);
							}
							delete data.pMaterialNames;

							data.Styles = [];
							for (var i in data.pStyles || []) {
								data.Styles.push(data.pStyles[i].ID);
							}
							delete data.pStyles;

							data.Subjects = [];
							for (var i in data.pSubjects || []) {
								data.Subjects.push(data.pSubjects[i].ID);
							}
							delete data.pSubjects;

							data.Tags = [];
							for (var i in data.pTags || []) {
								data.Tags.push(data.pTags[i].Tag);
							}
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

							data.Liked = !!data.Liked;
							data.Complete = !!data.Complete;
							data.Featured = !!data.Featured;
							data.SyncRequired = !!data.SyncRequired;
							data.LimitedEdition = !!data.LimitedEdition;
							data.Shareable = !!data.Shareable;
							data.Purchasable = !!data.Purchasable;

							var queue = [];

							// get a list of any user shortlists this artwork is currently in
							queue.push(
								db.select('sl.ID')
								.from('ShortlistArtworks as sa')
								.join('Shortlists as sl', 'sa.ShortlistID', 'sl.ID')
								.where({'sl.ProfileID': user.ProfileID, 'sa.ArtworkID': data.ID})
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
							var vid = data.VideoID || data.DefaultVideoID;
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
								res.json(data);
							});
						}
					})
					.catch(function (err) {
						logError(err, req, function () {
							res.status(500).json({Message: 'Error fetching artwork from database'});
						});
					});

				});
			}
			catch (err) {
				logError(err, req, function () {
					res.status(500).json({Message: 'Unexpected error occurred'});
				});
			}
		})


		.get('/:artworkID/buy', function(req, res) {
			fs.readFile(__dirname + '/../../v2/static/artwork-buy.htm', 'utf8', function (err, contents) {
				if (err) {
					res.sendStatus(500);
				}
				else {
					res.send(contents
						.replace(/\[CDV\]/g, 'cdv=' + clientDependencyVersion)
						.replace(/\[ARTWORKID\]/g, req.params.artworkID)
						.replace(/\[ACCESS_TOKEN\]/g, req.query.t || '')
					);
				}
			});
		})


		.get('/:artworkID/view', function(req, res) {

			db.first('aw.*', 'p.Name as ArtistName')
				.from('Artworks as aw')
				.join('Profiles as p', 'aw.ArtistProfileID', 'p.ID')
				.where({ 'aw.ID': req.params.artworkID })
				.then(function(artwork) {
					if (!artwork) {
						res.status(404).json({ Message: 'Artwork not found' });
					}
					else if (artwork.CustomShareURL) {
						res.redirect(artwork.CustomShareURL);
					}
					else {
						fs.readFile(__dirname + '/../static/artwork-view.htm', 'utf8', function (err, contents) {
							if (err) {
								res.sendStatus(500);
							}
							else {
								res.send(contents
									.replace(/\[CDV\]/g, 'cdv=' + clientDependencyVersion)
									.replace(/\[ARTWORKID\]/g, req.params.artworkID)
									.replace(/\[CURRENT_URL\]/g, 'https://' + req.get('host') + req.originalUrl)
									.replace(/\[HOST_URL\]/g, 'https://' + req.get('host'))
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
				.catch(function() {
					res.status(500).json({ Message: 'Unexpected error occurred' });
				});

		})

	,

	authenticated: express.Router()

		.get('/fix-image-dimensions-list', function (req, res) {

			db.select('ID').from('Artworks').where({
				'ImageWidth': 0,
				'ImageHeight': 0,
				'Deleted': 0
			}).andWhere('ImageURI', '<>', '').orderBy('created_at', 'desc')
					.then(function (artworks) {
						res.json(artworks);
					})
					.catch(function () {
						res.status(500).json({});
					})

		})

		.get('/fix-image-dimensions/:id/:width/:height', function (req, res) {

			db('Artworks')
					.where('ID', req.params.id)
					.update({
						ImageWidth: req.params.width,
						ImageHeight: req.params.height
					})
					.then(function () {
						res.json({});
					})
					.catch(function () {
						res.status(500).json({Message: 'Error occurred while updating artwork'})
					})

		})

		.get('/fix-image-dimensions/:id', function (req, res) {

			db.first('*').from('Artworks').where({'ID': req.params.id})
					.then(function (artwork) {
						if (artwork) {

							// check for relative url
							urlData = url.parse(artwork.ImageURI);
							if (!urlData.hostname && !urlData.protocol) {
								artwork.ImageURI = 'https://' + req.headers.host + '/' + artwork.ImageURI;
							}

							try {
								im.identify(artwork.ImageURI, function (err, features) {
									if (err) {

										db('Artworks')
												.where('ID', artwork.ID)
												.update({
													Deleted: 1
												})
												.then(function () {
													res.status(500).json({
														Message: 'Error accessing uploaded image',
														artwork: artwork
													});
												})
												.catch(function () {
													res.status(500).json({Message: 'Error occurred while updating artwork'})
												})

									}
									else {

										if (!features.width || !features.height) {
											res.status(500).json({
												Message: 'Unable to determin dimensions',
												CheckUsingClient: 1,
												ImageURI: artwork.ImageURI
											});
										}
										else {
											db('Artworks')
													.where('ID', artwork.ID)
													.update({
														ImageWidth: features.width,
														ImageHeight: features.height
													})
													.then(function () {
														res.json({});
													})
													.catch(function () {
														res.status(500).json({Message: 'Error occurred while updating artwork'})
													})
										}

									}
								});
							}
							catch (e) {
								res.status(500).json({Message: 'Error accessing uploaded image', artwork: artwork});
							}
						}

					})

		})

		.get('/fix-image-colour-list', function (req, res) {

			db.select('a.ID', 'a.ImageURI')
					.from('Artworks as a')
					.where(db.raw('(select count(ID) from ArtworkColours where ArtworkID = a.ID) < 6 and a.Deleted = 0 and a.ImageURI <> \'\''))
					.orderBy('a.updated_at', 'desc')
					.then(function (artworks) {
						res.json(artworks);
					})
					.catch(function (err) {
						console.error(err)
						res.status(500).json({})
					})

		})

		.post('/fix-image-colour/:id', function (req, res) {

			db.first('a.ID').from('Artworks as a').where({'a.ID': req.params.id})
					.then(function (artwork) {
						if (artwork) {
							return db('ArtworkColours').where({ArtworkID: artwork.ID}).del()
									.then(function () {

										var colours = [];
										for (var i in req.body.Colours) {
											if (req.body.Colours[i]) {
												colours.push({
													ArtworkID: artwork.ID,
													R: req.body.Colours[i][0],
													G: req.body.Colours[i][1],
													B: req.body.Colours[i][2],
													Priority: (i * 1) + 1
												});
											}
										}

										return db('ArtworkColours').insert(colours);

									})
						}
					})
					.then(function () {
						res.json({});
					})
					.catch(function (err) {
						console.log(err);

						res.status(500).json({})
					})

		})

		.get('/tag/autocomplete/:tag', function (req, res) {
			try {
				db('ArtworkTags')
						.distinct('Tag')
						.select()
						.whereRaw('Tag LIKE ?', ['%' + req.params.tag + '%'])
						.orderBy('Tag')
						.limit(20)
						.then(function (data) {
							res.json(data)
						})
						.catch(function (err) {
							logError(err, req, function () {
								res.status(500).json({Message: 'Unexpected error occurred'});
							});
						});
			}
			catch (err) {
				logError(err, req, function () {
					res.status(500).json({Message: 'Unexpected error occurred'});
				});
			}
		})


		.post('/add', function (req, res) {
			try {

				if (isNaN(req.body.ArtworkTypeID * 1)) {
					return res.status(400).json({Message: 'Artwork Type ID is required'});
				}
				if (!req.body.ImageURI) {
					return res.status(400).json({Message: 'ImageURI is required'});
				}

				AccessToken.getUser(req).then(function (user) {
					var id = -1,
							profileID = user.ProfileID;

					if ((user.memberOf('Administrators') || user.managesArtist(req.body.ProfileID)) && req.body.ProfileID) {
						profileID = req.body.ProfileID;
					}

					db.first().from('Profiles').where('ID', profileID)
							.then(function (profile) {

								if (!profile) {
									res.status(404).json({Message: 'Profile not found'});
								}
								else {

									// check for relative url
									var _imgURI = req.body.ImageURI,
											urlData = url.parse(_imgURI);
									if (!urlData.hostname && !urlData.protocol) {
										_imgURI = 'http://' + req.headers.host + '/' + _imgURI;
									}

									// get dimensions of uploaded image file
									im.identify(_imgURI, function (err, features) {
										if (err) {
											logError(err, req, function () {
												res.status(500).json({Message: 'Error accessing uploaded image, image format may be unsupported'});
											});
										}
										else {
											db('Artworks').insert({
												ArtworkTypeID: req.body.ArtworkTypeID,
												PricebandID: req.body.PricebandID,
												StatusID: req.body.StatusID || 1,
												TimeSpentID: req.body.TimeSpentID,
												ArtistProfileID: profileID,
												OwnerProfileID: profileID,
												Name: req.body.Name,
												Description: req.body.Description,
												ImageURI: req.body.ImageURI,
												ImageWidth: features.width,
												ImageHeight: features.height,
												WidthMM: req.body.WidthMM,
												HeightMM: req.body.HeightMM,
												DepthMM: req.body.DepthMM,
												DimensionUnitID: req.body.DimensionUnitID || 1,
												LimitedEdition: req.body.LimitedEdition || 0,
												LimitedEditionDetails: req.body.LimitedEditionDetails,
												Complete: req.body.Complete || 0,
												Shareable: req.body.Shareable || 0,
												Featured: req.body.Featured || 0,
												Price: req.body.Price || 0,
												ActivCanvasEnabled: req.body.VideoID !== undefined ? !!req.body.VideoID : false,
												CustomShareURL: req.body.CustomShareURL,
												created_at: new Date(),
												updated_at: new Date()
											})
											.then(function (_id) {
												id = _id[0];

												if (req.body.Materials) {
													var materials = [];
													for (var i in req.body.Materials) {
														materials.push({
															ArtworkID: id,
															MaterialID: req.body.Materials[i]
														})
													}
													return db('ArtworkMaterials').insert(materials);
												}
											})
											.then(function () {
												if (req.body.Styles) {
													var styles = [];
													for (var i in req.body.Styles) {
														if (req.body.Styles[i]) {
															styles.push({
																ArtworkID: id,
																StyleID: req.body.Styles[i]
															})
														}
													}
													return db('ArtworkStyles').insert(styles);
												}
											})
											.then(function () {
												if (req.body.Subjects) {
													var subjects = [];
													for (var i in req.body.Subjects) {
														if (req.body.Subjects[i]) {
															subjects.push({
																ArtworkID: id,
																SubjectID: req.body.Subjects[i]
															})
														}
													}
													return db('ArtworkSubjects').insert(subjects);
												}
											})
											.then(function () {
												if (req.body.Tags) {
													var tags = [];
													for (var i in req.body.Tags) {
														if (req.body.Tags[i]) {
															tags.push({
																ArtworkID: id,
																Tag: req.body.Tags[i]
															});
														}
													}
													return db('ArtworkTags').insert(tags);
												}
											})
											.then(function () {
												if (req.body.ImageColours) {
													var colours = [];
													for (var i in req.body.ImageColours) {
														if (req.body.ImageColours[i]) {
															colours.push({
																ArtworkID: id,
																R: req.body.ImageColours[i][0],
																G: req.body.ImageColours[i][1],
																B: req.body.ImageColours[i][2],
																Priority: (i * 1) + 1
															});
														}
													}
													return db('ArtworkColours').insert(colours);
												}
											})
											.then(function () {
												if (profile.ActivCanvasStatusID === 3 && req.body.VideoID) {
													return db('ArtworkVideos').insert({
														ArtworkID: id,
														VideoID: req.body.VideoID,
														Priority: 1
													});
												}
											})
											.then(function () {
												var queueEntry = { artworkID: id };

												if (profile.ActivCanvasStatusID === 3) {
													queueEntry.priority = ActivCanvas.PRIORITY.HIGH;

													if (req.body.VideoID) {
														queueEntry.videoID = req.body.VideoID;
														return ActivCanvas.queue(queueEntry);
													}
													else if (profile.VideoID) {
														queueEntry.videoID = profile.VideoID;
														return ActivCanvas.queue(queueEntry);
													}
													else {
														return ActivCanvas.queue(queueEntry);
													}
												}
												else {
													return ActivCanvas.queue(queueEntry);
												}
											})
											.then(function () {
												return db('Artworks').where({ArtistProfileID: profileID}).count('ID as total');
											})
											.then(function (result) {
												if (result[0].total > 0) {
													return require('../utils/tasks').complete(profileID, 'first-artwork');
												}
											})
											.then(function () {
												return res.status(201).json({ID: id, Message: 'Success'});
											})
											.catch(function (err) {
												logError(err, req, function () {
													res.status(500).json({Message: 'Error occurred while saving the artwork'});
												});
											})
										}
									});
								}

							});
				});
			}
			catch (err) {
				logError(err, req, function () {
					res.status(500).json({Message: 'Unexpected error occurred'});
				});
			}
		})

		.post('/bulk-add', function (req, res) {

			AccessToken.getUser(req).then(function (user) {
				var profileID = user.ProfileID;
				if ((user.memberOf('Administrators') || user.managesArtist(req.body.ProfileID)) && req.body.ProfileID) {
					profileID = req.body.ProfileID;
				}

				db.first().from('Profiles').where('ID', profileID)
						.then(function (profile) {

							if (!profile) {
								res.status(404).json({Message: 'Profile not found'});
							}
							else {

								var saveArtwork = function (artwork) {
									return new Promise(function (resolve, reject) {
										try {
											// check for relative image url
											var _imgURI = artwork.ImageURI, urlData = url.parse(_imgURI);
											if (!urlData.hostname && !urlData.protocol) {
												_imgURI = 'http://' + req.headers.host + '/' + _imgURI;
											}

											// get dimensions of uploaded image file
											im.identify(_imgURI, function (err, features) {
												if (err) {
													reject('Error accessing uploaded image');
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
																if (profile.ActivCanvasStatusID === 3 && artwork.VideoID) {
																	return db('ArtworkVideos').insert({
																		ArtworkID: artworkID,
																		VideoID: artwork.VideoID,
																		Priority: 1
																	});
																}
															})
															.then(function () {
																var queueEntry = { artworkID: artworkID };

																if (profile.ActivCanvasStatusID === 3) {
																	queueEntry.priority = ActivCanvas.PRIORITY.HIGH;

																	if (artwork.VideoID) {
																		queueEntry.videoID = artwork.VideoID;
																		return ActivCanvas.queue(queueEntry);
																	}
																	else if (profile.VideoID) {
																		queueEntry.videoID = profile.VideoID;
																		return ActivCanvas.queue(queueEntry);
																	}
																	else {
																		return ActivCanvas.queue(queueEntry);
																	}
																}
																else {
																	return ActivCanvas.queue(queueEntry);
																}
															})
															.then(function () {
																resolve();
															})
															.catch(reject);
												}
											});

										}
										catch (e) {
											reject(e);
										}
									});
								};

								var queue = [];
								req.body.Artworks.forEach(function (artwork) {
									queue.push(saveArtwork(artwork));
								});

								return Promise.settle(queue)
										.then(function () {
											return db('Artworks').where({ArtistProfileID: profileID}).count('ID as total');
										})
										.then(function (result) {
											if (result[0].total > 1) {
												return require('../utils/tasks').complete(profileID, 'first-artwork');
											}
										})
										.then(function () {
											res.json({Message: 'Success'});
										})
							}
						})
						.catch(function (err) {
							logError(err, req, function () {
								res.status(500).json({Message: 'Unexpected error occurred'});
							});
						});

			});

		})

		// handles async uploads of image files
		.post('/upload', function (req, res) {
			try {
				var name = req.query.qqfile,
						nameParts = name.split('.'),
						uniqueName = uuid.v4() + '.' + nameParts[nameParts.length - 1],
						path = __dirname + '/../../../web/uploads/';

				mkdirp(path, function (err) {

					if (err) {
						logError(err, req, function () {
							res.status(500).json({Message: 'Error creating upload directory for file'});
						});
					}
					else {
						var file = fs.createWriteStream(path + uniqueName);

						req.on('data', function (chunk) {
							file.write(chunk);
						})

						req.on('end', function () {
							file.end();
							res.json({
								Location: '/uploads/',
								Filename: uniqueName,
								OriginalFilename: name
							});
						})
					}
				});
			}
			catch (err) {
				logError(err, req, function () {
					res.status(500).json({Message: 'Unexpected error occurred'});
				});
			}
		})


		.put('/:artworkID/update', function (req, res) {
			try {
				AccessToken.getUser(req).then(function (user) {

					if (!user) {
						res.status(400).json({Message: 'Current user could not be determined'});
					}
					else {
						// check current user has permission to update artwork
						// - artwork must belong to users profile
						// - or user must be an admin
						// - or artist account is managed by a gallery
						db.first().from('Artworks').where('ID', req.params.artworkID)
								.catch(function (err) {
									logError(err, req, function () {
										res.status(500).json({Message: 'Error retrieving artwork from database'});
									});
								})
								.then(function (data) {

									if (!data) {
										res.status(404).json({Message: 'Artwork not found'});
									}
									else if (
										!(
											user.ProfileID === data.OwnerProfileID ||
											user.ProfileID === data.ArtistProfileID ||
											user.memberOf('Administrators') ||
											user.managesArtist(data.ArtistProfileID)
										)
									) {
										res.status(403).json({Message: 'You do not have permission to edit this artwork'})
									}
									else {

										db.first().from('Profiles').where('ID', data.ArtistProfileID)
												.then(function (profile) {

													if (!profile) {
														res.status(404).json({Message: 'Profile not found'});
													}
													else {


														// this method will update the database once we have checked the image file if required
														// - check is below this method
														var updateArtwork = function (features) {
															db('Artworks')
																	.where('ID', req.params.artworkID)
																	.update({
																		ArtworkTypeID: req.body.ArtworkTypeID || data.ArtworkTypeID,
																		PricebandID: req.body.PricebandID || data.PricebandID,
																		StatusID: req.body.StatusID || data.StatusID,
																		TimeSpentID: req.body.TimeSpentID || data.TimeSpentID,
																		Name: req.body.Name || data.Name,
																		Description: req.body.Description || data.Description,
																		ImageURI: req.body.ImageURI || data.ImageURI,
																		ImageWidth: features.width || data.ImageWidth,
																		ImageHeight: features.height || data.ImageHeight,
																		WidthMM: req.body.WidthMM || data.WidthMM,
																		HeightMM: req.body.HeightMM || data.HeightMM,
																		DepthMM: req.body.DepthMM || data.DepthMM,
																		DimensionUnitID: req.body.DimensionUnitID || data.DimensionUnitID,
																		LimitedEdition: req.body.LimitedEdition !== undefined ? req.body.LimitedEdition : data.LimitedEdition,
																		LimitedEditionDetails: req.body.LimitedEditionDetails || data.LimitedEditionDetails,
																		Complete: req.body.Complete !== undefined ? req.body.Complete : data.Complete,
																		Featured: req.body.Featured !== undefined ? req.body.Featured : data.Featured,
																		Shareable: req.body.Shareable !== undefined ? req.body.Shareable : data.Shareable,
																		CustomShareURL: req.body.CustomShareURL !== undefined ? req.body.CustomShareURL : data.CustomShareURL,
																		Price: req.body.Price !== undefined ? req.body.Price : data.Price,
																		ActivCanvasEnabled: req.body.VideoID !== undefined ? !!req.body.VideoID : data.ActivCanvasEnabled,
																		updated_at: new Date()
																	})
																	.then(function () {
																		if (!req.body.Materials) {
																			return;
																		}
																		return db('ArtworkMaterials').where('ArtworkID', req.params.artworkID).del();
																	})
																	.then(function () {
																		if (!req.body.Materials) {
																			return;
																		}
																		var materials = [];
																		for (var i in req.body.Materials) {
																			if (req.body.Materials[i]) {
																				materials.push({
																					ArtworkID: req.params.artworkID,
																					MaterialID: req.body.Materials[i]
																				})
																			}
																		}
																		return db('ArtworkMaterials').insert(materials);
																	})
																	.then(function () {
																		if (!req.body.Styles) {
																			return;
																		}
																		return db('ArtworkStyles').where('ArtworkID', req.params.artworkID).del();
																	})
																	.then(function () {
																		if (!req.body.Styles) {
																			return;
																		}
																		var styles = [];
																		for (var i in req.body.Styles) {
																			if (req.body.Styles[i]) {
																				styles.push({
																					ArtworkID: req.params.artworkID,
																					StyleID: req.body.Styles[i]
																				})
																			}
																		}
																		return db('ArtworkStyles').insert(styles);
																	})
																	.then(function () {
																		if (!req.body.Subjects) {
																			return;
																		}
																		return db('ArtworkSubjects').where('ArtworkID', req.params.artworkID).del();
																	})
																	.then(function () {
																		if (!req.body.Subjects) {
																			return;
																		}
																		var subjects = [];
																		for (var i in req.body.Subjects) {
																			if (req.body.Subjects[i]) {
																				subjects.push({
																					ArtworkID: req.params.artworkID,
																					SubjectID: req.body.Subjects[i]
																				})
																			}
																		}
																		return db('ArtworkSubjects').insert(subjects);
																	})
																	.then(function () {
																		if (!req.body.Tags) {
																			return;
																		}
																		return db('ArtworkTags').where('ArtworkID', req.params.artworkID).del();
																	})
																	.then(function () {
																		if (!req.body.Tags) {
																			return;
																		}
																		var tags = [];
																		for (var i in req.body.Tags) {
																			if (req.body.Tags[i]) {
																				tags.push({
																					ArtworkID: req.params.artworkID,
																					Tag: req.body.Tags[i]
																				});
																			}
																		}
																		return db('ArtworkTags').insert(tags);
																	})
																	.then(function () {
																		if (!req.body.ImageColours) {
																			return;
																		}
																		return db('ArtworkColours').where('ArtworkID', req.params.artworkID).del();
																	})
																	.then(function () {
																		if (req.body.ImageColours) {
																			var colours = [];
																			for (var i in req.body.ImageColours) {
																				if (req.body.ImageColours[i]) {
																					colours.push({
																						ArtworkID: req.params.artworkID,
																						R: req.body.ImageColours[i][0],
																						G: req.body.ImageColours[i][1],
																						B: req.body.ImageColours[i][2],
																						Priority: (i * 1) + 1
																					});
																				}
																			}
																			return db('ArtworkColours').insert(colours);
																		}
																	})
																	.then(function() {
																		if (req.body.ImageURI && req.body.ImageURI !== data.ImageURI) {
																			return db('VuforiaTargets').where('ArtworkID', req.params.artworkID).update({ BadImage: 0, AdjustedContrast: 0 });
																		}
																	})
																	.then(function () {
																		return db('ArtworkVideos').where('ArtworkID', req.params.artworkID).orderBy('Priority', 'asc').first();
																	})
																	.then(function (awv) {
																		awv = awv || {};

																		var queueEntry = { artworkID: req.params.artworkID };

																		// if profile associated with artwork is ActivCanvas enabled check if we need to update vuforia
																		if (profile.ActivCanvasStatusID === 3) {
																			queueEntry.priority = ActivCanvas.PRIORITY.HIGH;

																			return db('ArtworkVideos').where('ArtworkID', req.params.artworkID).del()
																					.then(function () {
																						if (req.body.VideoID) {
																							return db('ArtworkVideos').insert({
																								ArtworkID: req.params.artworkID,
																								VideoID: req.body.VideoID,
																								Priority: 1
																							});
																						}
																					})
																					.then(function () {
																						if (req.body.VideoID) {
																							if (req.body.VideoID !== awv.VideoID) {
																								queueEntry.videoID = req.body.VideoID;
																								return ActivCanvas.queue(queueEntry);
																							}
																						}
																						else if (profile.VideoID) {
																							queueEntry.videoID = profile.VideoID;
																							return ActivCanvas.queue(queueEntry);
																						}
																						else {
																							return ActivCanvas.queue(queueEntry);
																						}
																					})
																		}
																		// activate without video
																		else {
																			return ActivCanvas.queue(queueEntry);
																		}
																	})
																	.then(function () {
																		res.json({
																			ID: req.params.artworkID,
																			Message: 'Success'
																		});
																	})
																	.catch(function (err) {
																		logError(err, req, function () {
																			res.status(500).json({Message: 'Error occurred while updating the artwork'});
																		});
																	})
														};


														// check if image uri has been changed since the last save
														var _imgURI = req.body.ImageURI || data.ImageURI;
														if (_imgURI !== data.ImageURI) {

															// check for relative url
															urlData = url.parse(_imgURI);
															if (!urlData.hostname && !urlData.protocol) {
																_imgURI = 'http://' + req.headers.host + '/' + _imgURI;
															}

															// grab useful meta data from new image file
															im.identify(_imgURI, function (err, features) {
																if (err) {
																	logError(err, req, function () {
																		return res.status(500).json({Message: 'Error accessing uploaded image file'});
																	});
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

												});
									}

								})

					}

				})
			}
			catch (err) {
				logError(err, req, function () {
					res.status(500).json({Message: 'Unexpected error occurred'});
				});
			}
		})

		.get('/:artworkID/action/like', function (req, res) {
			try {
				AccessToken.getUser(req).then(function (user) {

					if (!user) {
						res.status(400).json({Message: 'Current user could not be determined'});
					}
					else {

						// check artwork exists
						db.first('*').from('Artworks').where({ID: req.params.artworkID})
							.catch(function (err) {
								logError(err, req, function () {
									res.status(500).json({Message: 'Error retrieving artwork from database'});
								});
							})
							.then(function (artwork) {

								if (!artwork) {
									res.status(404).json({Message: 'Artwork not found'});
								}
								else {

									db.first('ID').from('ArtworkLikes')
										.where({ArtworkID: artwork.ID, ProfileID: user.ProfileID})
										.then(function (data) {
											if (!data) {
												db('ArtworkLikes').insert({
													ProfileID: user.ProfileID,
													ArtworkID: artwork.ID
												})
												.then(function () {
													return db('ArtworkLikes')
														.count('ID as total')
														.where('ArtworkID', artwork.ID);
												})
												.then(function (result) {
													return db('Artworks')
														.where('ID', artwork.ID)
														.update({
															Likes: result[0].total
														});
												})
												.then(function () {
													res.json({Message: 'Success'});
												})
												.catch(function (err) {
													logError(err, req, function () {
														res.status(500).json({Message: 'Error updating your profile'});
													});
												})
											}
											else {
												res.json({Message: 'You\'ve already like this artwork'});
											}
										})
										.catch(function (err) {
											logError(err, req, function () {
												res.status(500).json({Message: 'Error updating your profile'});
											});
										});

								}

							})

					}

				})
			}
			catch (err) {
				logError(err, req, function () {
					res.status(500).json({Message: 'Unexpected error occurred'});
				});
			}
		})

		.get('/:artworkID/action/unlike', function (req, res) {
			try {
				AccessToken.getUser(req).then(function (user) {

					if (!user) {
						res.status(400).json({Message: 'Current user could not be determined'});
					}
					else {

						// check artwork exists
						db.first('*').from('Artworks').where({ID: req.params.artworkID})
								.catch(function (err) {
									logError(err, req, function () {
										res.status(500).json({Message: 'Error retrieving artwork from database'});
									});
								})
								.then(function (artwork) {

									if (!artwork) {
										res.status(404).json({Message: 'Artwork not found'});
									}
									else {

										db.first('ID').from('ArtworkLikes')
												.where({ArtworkID: artwork.ID, ProfileID: user.ProfileID})
												.then(function (data) {
													if (data) {
														db('ArtworkLikes').where({ID: data.ID}).delete()
																.then(function () {
																	return db('ArtworkLikes')
																			.count('ID as total')
																			.where('ArtworkID', artwork.ID);
																})
																.then(function (result) {
																	return db('Artworks')
																			.where('ID', artwork.ID)
																			.update({
																				Likes: result[0].total
																			});
																})
																.then(function () {
																	res.json({Message: 'Success'});
																})
																.catch(function (err) {
																	logError(err, req, function () {
																		res.status(500).json({Message: 'Error updating your profile'});
																	});
																})
													}
													else {
														res.json({Message: 'You\'ve already like this artwork'});
													}
												})
												.catch(function (err) {
													logError(err, req, function () {
														res.status(500).json({Message: 'Error updating your profile'});
													});
												});

									}

								})

					}

				})
			}
			catch (err) {
				logError(err, req, function () {
					res.status(500).json({Message: 'Unexpected error occurred'});
				});
			}
		})

		.get('/:artworkID/action/viewed', function (req, res) {

			Analytics.event.add(req, 7, { ArtworkID: req.params.artworkID })
				.then(function() {
					res.json({ Message: 'Success' });
				})
				.catch(function(e) {
					res.status(500).json({Message: 'Unexpected error occurred'});
				});

		})


		.post('/search', function (req, res) {
			try {
				AccessToken.getUser(req).then(function (user) {

					var filters = req.body.Filters,
						pagination = req.body.Pagination || {};

					pagination.PageNumber = pagination.PageNumber || 0;
					pagination.PageSize = pagination.PageSize || 10;
					pagination.PageSize = pagination.PageSize > 100 ? 100 : pagination.PageSize < 1 ? 1 : pagination.PageSize;

					// construct base sql query
					var sql =
						'from Artworks a ' +
						'left join ArtworkTypes at on a.ArtworkTypeID = at.ID ' +
						'left join VuforiaTargets vt on a.ID = vt.ArtworkID ' +
						'join Profiles p on a.ArtistProfileID = p.ID ',

					where =
						'where a.Deleted = 0 and ((a.Complete = 1 and a.ImageURI <> \'\' and a.ImageWidth > 0 and a.ImageHeight > 0) or a.OwnerProfileID = ' + user.ProfileID + ' or a.ArtistProfileID = ' + user.ProfileID + ') '

					sort = '';


					// append filters to query
					var filterCount = Object.keys(filters).length;
					if (filterCount) {
						if (filters.ArtistProfileID) {
							if (!parseInt(filters.ArtistProfileID)) return res.status(400).json({'Message': 'ArtistProfileID must be numeric and > 0'})
							where += ' and a.ArtistProfileID = ' + filters.ArtistProfileID;
						}
						if (filters.OwnerProfileID) {
							if (!parseInt(filters.OwnerProfileID)) return res.status(400).json({'Message': 'OwnerProfileID must be numeric and > 0'})
							where += ' and a.OwnerProfileID = ' + filters.OwnerProfileID;
						}
						if (filters.ConnectedProfileID) {
							if (!parseInt(filters.ConnectedProfileID)) return res.status(400).json({'Message': 'ConnectedProfileID must be numeric and > 0'})
							where += ' and a.OwnerProfileID in (select ProfileID from Connections where ConnectedProfileID =' + filters.ConnectedProfileID + ')';
						}
						if (filters.ConnectionsArt) {
							where += ' and (' +
								'(a.OwnerProfileID in (select ConnectedProfileID from Connections where Accepted = 1 and ProfileID =' + user.ProfileID + '))' +
								' or ' +
								'(a.OwnerProfileID in (select ProfileID from Connections where Accepted = 1 and ConnectedProfileID =' + user.ProfileID + '))' +
								' or ' +
								'(a.ArtistProfileID in (select ConnectedProfileID from Connections where Accepted = 1 and ProfileID =' + user.ProfileID + '))' +
								' or ' +
								'(a.ArtistProfileID in (select ProfileID from Connections where Accepted = 1 and ConnectedProfileID =' + user.ProfileID + '))' +
								')'
						}
						if (filters.Subject) {
							where += ' and a.Name like \'%' + filters.Subject + '%\'';
						}
						if (filters.Type) {
							if (!Array.isArray(filters.Type)) return res.status(400).json({'Message': 'Type filter: an array of types is required'})
							var types = filters.Type.filter(function (i) {
								return !isNaN(parseInt(i))
							})
							where += ' and a.ArtworkTypeID IN (' + types.join() + ')'
						}
						if (filters.Style) {
							if (!Array.isArray(filters.Style)) return res.status(400).json({'Message': 'Style filter: an array of styles is required'})
							sql += ' join ArtworkStyles AS awSty ON a.ID = awSty.ArtworkID '
							var styles = filters.Style.filter(function (i) {
								return !isNaN(parseInt(i))
							})
							where += ' AND awSty.StyleID IN (' + styles.join() + ')'
						}
						if (filters.Price) {
							if (!Array.isArray(filters.Price)) return res.status(400).json({'Message': 'Price filter: an array of price bands is required'})
							var pricebands = filters.Price.filter(function (i) {
								return !isNaN(parseInt(i))
							})
							where += ' AND a.PricebandID IN (' + pricebands.join() + ')'
						}

						if (filters.Colour) {
							if (!Array.isArray(filters.Colour)) return res.status(400).json({'Message': 'Colour filter: an array of colours is required'})
							var colours = filters.Colour.filter(function (item) {
								return Object.prototype.toString.call(item).slice(8, -1) == "Object" && !isNaN(parseInt(item.R)) && !isNaN(parseInt(item.G)) && !isNaN(parseInt(item.B))
							})
							var len
							if (len = colours.length) {
								var range = 25
								sql += 'JOIN ArtworkColours as awCol ON a.ID = awCol.ArtworkID '
								where += ' AND('
								for (i = 0; i < len; i++) {
									if (i) where += ' OR '
									where +=
										'(' +
											'awCol.R BETWEEN ' + Math.max(0, colours[i].R - range) + ' AND ' + Math.min(255, colours[i].R + range) + ' AND ' +
											'awCol.G BETWEEN ' + Math.max(0, colours[i].G - range) + ' AND ' + Math.min(255, colours[i].G + range) + ' AND ' +
											'awCol.B BETWEEN ' + Math.max(0, colours[i].B - range) + ' AND ' + Math.min(255, colours[i].B + range) +
										')'
								}
								where += ')';
								sort = 'awCol.Priority asc, '
							}
						}

					}

					// set query sort parameters
					var sortBy = req.body.Sort && req.body.Sort.Field ? req.body.Sort.Field : '';
					switch (sortBy) {
						case 'Popular':
							sort += ' (a.Views + a.Likes + a.Shortlisted) desc';
							break;
						case 'Views':
							sort += ' a.Views desc';
							break;
						case 'Likes':
							sort += ' a.Likes desc';
							break;
						case 'Shortlisted':
							sort += ' a.Shortlisted desc';
							break;
						default:
							sort += ' a.updated_at desc';
							break;	//Latest
					}

					// execute query
					db.first(db.raw(
						'count(distinct a.ID) as Results ' + sql + where
					))
					.then(function (total) {

						db.select(db.raw(
							'distinct a.*, ' +
							'p.ImageURI as ProfileImageURI, ' +
							'p.Name as ArtistName, ' +
							'at.Type, ' +
							'vt.TrackingRating, ' +
							'vt.SyncRequired ' +
							sql + where +
							' order by ' + sort + ', a.created_at desc'
						))
						.offset(pagination.PageSize * pagination.PageNumber)
						.limit(pagination.PageSize)
						.then(function (data) {
							pagination.TotalResults = total.Results;

							var c = 0,
								complete = function () {
									c++;
									if (c >= data.length) {
										res.json({
											Data: data,
											Pagination: pagination
										});
									}
								};

							if (!data.length) {
								complete()
							}
							else {
								for (var i = 0; i < data.length; i++) {
									(function (aw) {
										if (!aw.ProfileImageURI) {
											aw.ProfileImageURI = config.profile.defaultImage;
										}

										aw.Complete = !!aw.Complete;
										aw.Featured = !! aw.Featured;
										aw.Deleted = !!aw.Deleted;
										aw.LimitedEdition = !!aw.LimitedEdition;
										aw.ActivCanvasEnabled = !!aw.ActivCanvasEnabled;
										aw.Shareable = !!aw.Shareable;
										aw.Purchasable = !!aw.Purchasable;
										aw.SyncRequired = !!aw.SyncRequired;

										db.select('R', 'G', 'B', 'Priority')
											.from('ArtworkColours')
											.where('ArtworkID', aw.ID)
											.orderBy('Priority')
											.then(function (colours) {
												aw.Colours = colours;
											})
											.finally(complete);
									})(data[i]);
								}

							}

						})
						.catch(function (err) {
							logError(err, req, function () {
								res.status(500).json({Message: 'Unexpected error occurred while contacting the database'});
							});
						});

					})
					.catch(function (err) {
						logError(err, req, function () {
							res.status(500).json({Message: 'Unexpected error occurred while contacting the database'});
						});
					});

				});
			}
			catch (err) {
				logError(err, req, function () {
					res.status(500).json({Message: 'Unexpected error occurred'});
				});
			}

		})


		.delete('/:artworkID/remove', function (req, res) {
			AccessToken.getUser(req).then(function (user) {

				if (!user) return res.status(500).json({Message: 'Current user could not be determined'})

				var artworkID = parseInt(req.params.artworkID);
				if (!artworkID) return res.status(400).json({Message: 'Invalid artwork ID'});

				// check current user has permission to update artwork
				// - artwork must belong to users profile
				// - or user must be an admin
				db.first('OwnerProfileID', 'ArtistProfileID').from('Artworks').where('ID', artworkID)
						.catch(function (err) {
							logError(err, req, function () {
								return res.status(500).json({Message: 'Error retrieving artwork from database'})
							})
						})
						.then(function (data) {
							if (!data) {
								res.status(404).json({Message: 'Artwork not found'})
							}
							else if (!(user.ProfileID === data.OwnerProfileID || user.ProfileID === data.ArtistProfileID || user.memberOf('Administrators') || user.managesArtist(data.ArtistProfileID))) {
								res.status(403).json({Message: 'You do not have permission to remove this artwork'})
							}
							else {

								// remove : soft delete
								db('Artworks').where({ID: artworkID}).update({Deleted: 1})
										.then(function () {
											return db.first().from('VuforiaTargets').where({ ArtworkID: artworkID });
										})
										.then(function (target) {
											if (target && target.TargetID) {
												ActivCanvas.queue({ artworkID: artworkID, deactivate: true });
											}
										})
										.then(function () {
											res.sendStatus(204);
										})
										.catch(function (err) {
											logError(err, req, function () {
												res.status(500).json({ Message: 'Error removing artwork' });
											})
										})
							}


						})

			})
		})

};
