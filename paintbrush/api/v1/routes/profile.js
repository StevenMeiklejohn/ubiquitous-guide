var config = require('../config'),
	router = require('express').Router(),
	//passport = require('passport'),
	Promise = require('bluebird'),
	Task = require('../utils/tasks'),
	AccessToken = require('../../auth/access-token'),
	ActivCanvas = require('../lib/activcanvas'),
	Analytics = require('../lib/analytics');


router


	// returns the currently logged in profiles groups
	.get('/groups', function (req, res) {
		AccessToken.getUser(req).then(function (user) {
			res.json(user.Groups);
		});
	})


		// fetch single profile
	.get('/:profileID', function(req, res){

		// expects an integer profile id
		var profileID = parseInt(req.params.profileID);
		if( isNaN(profileID) ){
			res.status(400).json({ Message: 'Invalid Profile ID: ' + req.params.profileID });
		}
		else {
			AccessToken.getUser(req).then(function (user) {

				if (!user) {
					res.status(500).json({ Message: 'Current user not found' });
				}
				else {
					var profile;

					db('Profiles').where('ID', profileID).first()
						.then(function(data) {
							if (!data) {
								res.status(404).json({Message: 'Profile Not Found'});
							}
							else {
								dbNest(
									db.select(
										'p.ID as _ID',
										'p.Name as _Name',
										'p.ImageURI as _ImageURI',
										'c.Address1 as _Contact_Address1',
										'c.Address2 as _Contact_Address2',
										'c.Address3 as _Contact_Address3',
										'c.Town as _Contact_Town',
										'c.Postcode as _Contact_Postcode',
										'c.Website as _Contact_Website',
										'c.Landline as _Contact_Landline',
										'c.Mobile as _Contact_Mobile',
										'g.ID as _Gallery_ID',
										'cu.ID as _Consumer_ID',
										'a.ID as _Artist_ID',
										'a.AgeBracketID as _Artist_AgeBracketID',
										'a.Nationality as _Artist_Nationality',
										'a.Location as _Artist_Location',
										'a.Private as _Artist_Private',
										'd.Description as _Artist_Discipline',
										'acs.ID as _ActivCanvas_StatusID',
										'acs.Description as _ActivCanvas_Status',
										'p.VideoID as _ActivCanvas_VideoID',
										'p.ActivCanvasLink as _ActivCanvas_Link',
										'p.ActivCanvasLinkText as _ActivCanvas_LinkText',
										'at.ID as _Artist_Types__ID',
										'at.Type as _Artist_Types__Type',
										'ws.ID as _Artist_WorkingSpaces__ID',
										'ws.Description as _Artist_WorkingSpaces__Description',
										'smp.ServiceID as _SocialMedia__ServiceID',
										'smp.URL as _SocialMedia__URL'
									)
									.from('Profiles as p')
									.leftJoin('ContactInformation as c', 'p.ContactInformationID', 'c.id')
									.leftJoin('Galleries as g', 'p.id', 'g.ProfileID')
									.leftJoin('Artists as a', 'p.id', 'a.ProfileID')
									.leftJoin('Consumers as cu', 'p.id', 'cu.ProfileID')
									.leftJoin('ActivCanvasStatus as acs', 'p.ActivCanvasStatusID', 'acs.ID')
									.leftJoin('Disciplines as d', 'd.id', 'a.DisciplineID')
									.leftJoin('ArtistTypeMap as atm', 'a.id', 'atm.ArtistID')
									.leftJoin('ArtistTypes as at', 'at.id', 'atm.ArtistTypeID')
									.leftJoin('ArtistWorkingSpaces as aws', 'a.id', 'aws.ArtistID')
									.leftJoin('WorkingSpaces as ws', 'ws.id', 'aws.WorkingSpaceID')
									.leftJoin('SocialMediaProfiles as smp', 'p.ID', 'smp.ProfileID')
									.where('p.id', '=', profileID)
								)
								.then(function(data) {

									profile = data[0]; // [0] since we can't use .first method above

									if (user.ProfileID === profile.ID) {
										profile.Email = user.Email;
									}

									if (!profile.ImageURI || profile.ImageURI === config.profile.defaultImage) {

										// check auth provider profile(s) for image
										return db.first('app.ProfileImageURI')
											.from('Profiles as p')
											.leftJoin('Artists as a', 'a.ProfileID', 'p.ID')
											.leftJoin('Consumers as c', 'c.ProfileID', 'p.ID')
											.leftJoin('Galleries as g', 'g.ProfileID', 'p.ID')
											.leftJoin('GalleryUsers as gu', 'gu.GalleryID', 'g.ID')
											.leftJoin('AuthenticationProviderProfiles as app', db.raw('coalesce(a.UserID, c.UserID, gu.UserID)'), 'app.UserID')
											.whereNotNull('app.ProfileImageURI')
											.andWhere('p.ID', profileID)
											.orderBy('app.ProviderID')
											.then(function(authProfile){
												profile.ImageURI = (authProfile || {}).ProfileImageURI || config.profile.defaultImage;
											})
									}
								})
								.then(function() {

									var queue = [];

									//
									// Load artists specific fields
									//
									if (profile.Artist) {
										queue.push(db.select(db.raw(
											'm.Name, count(*) as Count ' +
											'from Artworks as a ' +
											'join ArtworkMaterials as am on am.ArtworkID = a.ID ' +
											'join Materials as m on am.MaterialID = m.ID ' +
											'where a.ArtistProfileID = ' + profileID + ' and m.Deleted = 0 and a.Deleted = 0 ' +
											'group by m.ID ' +
											'order by Count desc, Name asc'
										))
										.then(function (artworkMaterials) {
											profile.Artist.ArtworkMaterials = artworkMaterials;
										}));

										queue.push(db.select(db.raw(
											's.Style, count(*) as Count ' +
											'from Artworks as a ' +
											'join ArtworkStyles as ast on ast.ArtworkID = a.ID ' +
											'join Styles as s on ast.StyleID = s.ID ' +
											'where a.ArtistProfileID = ' + profileID + ' and a.Deleted = 0 ' +
											'group by s.ID ' +
											'order by Count desc, Style asc'
										))
										.then(function (artworkStyles) {
											profile.Artist.ArtworkStyles = artworkStyles;
										}));

										queue.push(db.select(db.raw(
											's.Subject, count(*) as Count ' +
											'from Artworks as a ' +
											'join ArtworkSubjects as asb on asb.ArtworkID = a.ID ' +
											'join Subjects as s on asb.SubjectID = s.ID ' +
											'where a.ArtistProfileID = ' + profileID + ' and a.Deleted = 0 ' +
											'group by s.ID ' +
											'order by Count desc, Subject asc'
										))
										.then(function (artworkSubjects) {
											profile.Artist.ArtworkSubjects = artworkSubjects;
										}));


										queue.push(db.select(db.raw(
												'awt.Name ' +
												'from ArtistAwards as aa ' +
												'join ArtistAwardTypes as awt on aa.ArtistAwardTypeID = awt.ID ' +
												'where aa.ArtistID = ' + profile.Artist.ID + ' ' +
												'order by awt.Name asc'
										))
										.then(function (awards) {
											var a = [];
											awards.forEach(function(aw) {
												a.push(aw.Name);
											});
											profile.Artist.Awards = a;
										}));

										queue.push(db.select(db.raw(
											'aqt.Name ' +
											'from ArtistQualifications as aq ' +
											'join ArtistQualificationTypes as aqt on aq.ArtistQualificationTypeID = aqt.ID ' +
											'where aq.ArtistID = ' + profile.Artist.ID + ' ' +
											'order by aqt.Name asc'
										))
										.then(function (qualifications) {
											var q = [];
											qualifications.forEach(function(qf) {
												q.push(qf.Name);
											});
											profile.Artist.Qualifications = q;
										}));

									}

									//
									// Load gallery specific  fields
									//
									if (profile.Gallery) {
										profile.Gallery.Artists = user.GalleryArtists;
									}

									//
									// Profile does not belong to the current user...
									//
									if (user.ProfileID !== profile.ID) {

										// return following status
										queue.push(db.first('ID')
											.from('Followers')
											.where({ FollowingProfileID: profileID, ProfileID: user.ProfileID })
											.then(function (following) {
												profile.Following = !!following;
											})
										);

										// return connection status
										queue.push(db.first('ID')
											.from('Connections')
											.where(db.raw(
												'(ConnectedProfileID = ' + profileID + ' AND ProfileID = ' + user.ProfileID + ' AND Accepted = 1)' +
												' OR (ProfileID = ' + profileID + ' AND ConnectedProfileID = ' + user.ProfileID + ' AND Accepted = 1)'
											))
											.then(function (connected) {
												profile.Connected = !!connected;
											})
										);

										// record profile view if not an administrator
										if (!user.memberOf('Administrators')) {
											Analytics.event.add(req, 18, { ProfileID: profile.ID });
										}
									}

									return Promise.settle(queue);
								})
								.then(function() {
									res.json(profile);
								})
								.catch(function (err) {
									logError(err, req, function () {
										res.json(profile);	// just return profile anyway
									});
								})

							}
						})
						.catch(function (err) {
							logError(err, req, function () {
								res.status(500).json({ Message: 'Unexpected error occurred' });
							});
						});

				}
			})
		}
	})



	// fetch single profiles featured art
	.get('/:profileID/featured-art', function(req, res){
		// expects an integer profile id
		var profileID = parseInt(req.params.profileID)
		if( isNaN(profileID) ){
			res.status(400).json({ Message: 'Numeric profileID expected: ' + profileID })
		}
		else{

			db
				.select(
					'a.Name',
					'a.Description',
					'a.ImageURI',
					'a.WidthMM',
					'a.HeightMM',
					'a.DepthMM',
					//'a.SuggestedPrice',
					'at.Type'
				)
				.from('Artworks as a')
				.innerJoin('ArtworkTypes as at', 'a.ArtworkTypeID', 'at.ID')
				.orderBy('a.updated_at', 'desc')
				.where({
					'a.ArtistProfileID': profileID,
					'a.Complete': 1,
					'a.Featured': 1,
					'a.Deleted': 0
				})

			.then(function(data){
				res.json(data)
			})
		}
	})



	// start following a profile
	.get('/:profileID/action/follow', function (req, res) {

		AccessToken.getUser(req).then(function (user) {

			if (user === null) {
				return res.status(500).json({ Message: 'Current user not found' });
			}

			if (isNaN(req.params.profileID)) {
				return res.status(400).json({ Message: 'Invalid Profile ID' });
			}

			db.first('ID').from('Profiles').where({ ID: req.params.profileID }).asCallback(function (err, targetProfile){

				if (err) return res.status(500).json({ Message: 'Error verifying profile to follow' });
				if (!targetProfile) return res.status(404).json({ Message: 'Profile Not Found' });

				db.first('ID').from('Followers')
					.where({ FollowingProfileID: req.params.profileID, ProfileID: user.ProfileID })
					.then(function (data) {
						if (!data) {
							db('Followers').insert({
								ProfileID: user.ProfileID,
								FollowingProfileID: req.params.profileID,
								created_at: new Date(),
								updated_at: new Date()
							})
							.then(function () {
								res.json({ Message: 'Success' });
							})
							.catch(function () {
								res.status(500).json({ Message: 'Error updating your profile' });
							})
						}
						else {
							res.json({ Message: 'Already following profile' });
						}
					})
					.catch(function () {
						res.status(500).json({ Message: 'Error updating your profile' });
					});

			})

		})
		
	})


	// stop following a profile
	.get('/:profileID/action/unfollow', function (req, res) {

		AccessToken.getUser(req).then(function (user) {

			if (user === null) {
				res.status(500).json({ Message: 'Current user not found' });
			}

			if (isNaN(req.params.profileID)) {
				return res.status(400).json({ Message: 'Invalid Profile ID' });
			}

			db.first('ID').from('Profiles').where({ ID: req.params.profileID }).asCallback(function (err, targetProfile){

				if (err) return res.status(500).json({ Message: 'Error verifying profile to unfollow' });
				if (!targetProfile) return res.status(404).json({ Message: 'Profile Not Found' });

				db('Followers')
					.where({ FollowingProfileID: req.params.profileID, ProfileID: user.ProfileID }).del()
					.then(function (data) {
						return res.json({ Message: 'Success' });
					})
					.catch(function () {
						return res.status(500).json({ Message: 'Error updating your profile' });
					});
			})

		});

	})


	// update profile
	.put('/:profileID/update', function (req, res) {

		AccessToken.getUser(req).then(function (user) {

			var profileID = parseInt(req.params.profileID);

			if (!user) {
				res.status(400).json({ Message: 'Current user could not be determined' })
			}
			else if (isNaN(profileID)) {
				res.status(400).json({ Message: 'Invalid Profile ID' })
			}
			else if (
				user.ProfileID !== profileID &&
				!(user.memberOf('Administrators') || user.managesArtist(profileID))
			) {
				res.status(403).json({ Message: 'You do not have permission to update this profile' })
			}
			else {

				
				db.first('*')
				.from('Profiles')
				.where('ID', profileID)
				.then(function (profile) {

					if (!profile) {
						res.status(404).json({ Message: 'Profile not found' })
					}
					else {
						req.body.ActivCanvas = req.body.ActivCanvas || {};

						return db('Profiles')
							.where('ID', profileID)
							.update({
								Name: req.body.Name,
								ImageURI: req.body.ImageURI,
								VideoID: req.body.ActivCanvas.VideoID,
								ActivCanvasLink: req.body.ActivCanvas.Link,
								ActivCanvasLinkText: req.body.ActivCanvas.LinkText
							})
							.then(function (result) {
								if (!result) {
									res.status(404).json({ Message: 'Profile Not Found' })
								}
								else {
									// check if contact details already exists for this profile
									return db
										.first('c.ID')
										.from('Profiles as p')
										.join('ContactInformation as c', 'p.ContactInformationID', 'c.ID')
										.where('p.ID', profileID)
										.then(function (contactInfo) {

											var contactData = {
												Address1: req.body.Contact.Address1,
												Address2: req.body.Contact.Address2,
												Address3: req.body.Contact.Address3,
												Town: req.body.Contact.Town,
												Postcode: req.body.Contact.Postcode,
												Landline: req.body.Contact.Landline,
												Mobile: req.body.Contact.Mobile,
												Website: req.body.Contact.Website
											};

											// update existing record
											if (contactInfo) {
												return db('ContactInformation')
													.where('ID', contactInfo.ID)
													.update(contactData);
											}
											// create a new record
											else {

												return db('ContactInformation').insert(contactData)
													.then(function (cid) {
														return db('Profiles')
															.where('ID', profileID)
															.update({
																ContactInformationID: cid
															})
													})
											}
										})
										//
										// Artist Details
										//
										.then(function () {

											// skip next section if not an artist profile
											if (req.body.Artist) {
												return db
													.first('ID')
													.from('Artists')
													.where('ProfileID', profileID)
													.then(function (artist) {

														if (!artist) {
															res.status(400).json({ Message: 'Unable to update artist related fields, the specified profile is not an artist.' })
														}
														else {

															// update artist record
															return db('Artists')
																.where('ID', artist.ID)
																.update({
																	AgeBracketID: req.body.Artist.AgeBracketID,
																	Location: req.body.Artist.Location,
																	Nationality: req.body.Artist.Nationality
																})

																// update artist types
																.then(function () {
																	return db('ArtistTypeMap')
																		.where('ArtistID', artist.ID)
																		.delete();
																})
																.then(function () {
																	if (req.body.Artist.Types) {
																		var types = [];
																		req.body.Artist.Types.forEach(function (typeID) {
																			types.push({
																				ArtistID: artist.ID,
																				ArtistTypeID: typeID
																			})
																		});

																		return db('ArtistTypeMap').insert(types);
																	}
																})


																// update artist working spaces
																.then(function () {
																	return db('ArtistWorkingSpaces')
																		.where('ArtistID', artist.ID)
																		.delete();
																})
																.then(function () {
																	if (req.body.Artist.WorkingSpaces) {
																		var spaces = [];
																		req.body.Artist.WorkingSpaces.forEach(function (spaceID) {
																			spaces.push({
																				ArtistID: artist.ID,
																				WorkingSpaceID: spaceID
																			})
																		});

																		return db('ArtistWorkingSpaces').insert(spaces);
																	}

																})





																// update artist awards
																.then(function () {
																	return db('ArtistAwards').where('ArtistID', artist.ID).del();
																})
																.then(function () {
																	if (req.body.Artist.Awards) {

																		var _queue = [];

																		req.body.Artist.Awards.forEach(function(award) {
																			_queue.push(
																				db('ArtistAwardTypes').where('Name', award).first()
																					.then(function(awardType) {

																						if (!awardType) {
																							return db('ArtistAwardTypes').insert({ Name: award })
																								.then(function(result) {
																									return db('ArtistAwards').insert({
																										ArtistID: artist.ID,
																										ArtistAwardTypeID: result[0]
																									});
																								})
																						}
																						else {
																							return db('ArtistAwards').insert({
																								ArtistID: artist.ID,
																								ArtistAwardTypeID: awardType.ID
																							});
																						}


																					})
																			);
																		});

																		return Promise.all(_queue);
																	}

																})



																// update artist qualifications
																.then(function () {
																	return db('ArtistQualifications').where('ArtistID', artist.ID).del();
																})
																.then(function () {
																	if (req.body.Artist.Qualifications) {

																		var _queue = [];

																		req.body.Artist.Qualifications.forEach(function(qualification) {
																			_queue.push(
																				db('ArtistQualificationTypes').where('Name', qualification).first()
																					.then(function(qualificationType) {

																						if (!qualificationType) {
																							return db('ArtistQualificationTypes').insert({ Name: qualification })
																								.then(function(result) {
																									return db('ArtistQualifications').insert({
																										ArtistID: artist.ID,
																										ArtistQualificationTypeID: result[0]
																									});
																								})
																						}
																						else {
																							return db('ArtistQualifications').insert({
																								ArtistID: artist.ID,
																								ArtistQualificationTypeID: qualificationType.ID
																							});
																						}


																					})
																			);
																		});

																		return Promise.all(_queue);
																	}

																})



																// mark complete artist details task as complete
																.then(function () {
																	return require('../utils/tasks').complete(user.ProfileID, 'artist-details')
																})
														}


													});

											}

										})
										//
										// Gallery Details
										//
										.then(function () {

											// skip next section if not a gallery profile
											if (req.body.Gallery) {

											}

										})

										//
										// Social Media Details
										//
										.then(function () {

											if (req.body.SocialMedia) {
												var smp = [];
												req.body.SocialMedia.forEach(function(s) {
													if (s.URL) {
														// TODO: verify url goes to correct domain
														s.ProfileID = profileID;
														smp.push(s);
													}
												});

												return db('SocialMediaProfiles').where('ProfileID', profileID).del()
													.then(function() {
														if (smp.length) {
															return db('SocialMediaProfiles').insert(smp);
														}
													});
											}

										})

										//
										// ActivCanvas Details
										//
										.then(function () {

											if (profile.ActivCanvasStatusID === 3) {
												var _videoID = req.body.ActivCanvas.VideoID,
													_link = req.body.ActivCanvas.Link,
													_linkText = req.body.ActivCanvas.LinkText;

												var promiseQueue = [];

												// check if video has changed
												if (profile.VideoID !== _videoID) {

													if (!_videoID) {
														// deactivate all artwork using old video on vuforia
													}
													else {
														// transcode video if required
														// - video will be uploaded to vuforia once transcoded to the required formats
														promiseQueue.push(ActivCanvas.queue({ videoID: _videoID }));
													}
												}

												if (profile.ActivCanvasLink !== _link || profile.ActivCanvasLinkText !== _linkText) {

													promiseQueue.push(
														db.select('av.ArtworkID', 'av.VideoID')
														.from('Artworks as a')
														.join('ArtworkVideos as av', 'av.ArtworkID', 'a.ID')
														.where('a.ArtistProfileID', profile.ID)
														.then(function(items) {
															var _promiseQueue = [];
															items.forEach(function(item) {
																_promiseQueue.push(ActivCanvas.queue({ videoID: item.VideoID, artworkID: item.ArtworkID }));
															});
															return Promise.settle(_promiseQueue);
														})
													)

												}

												return Promise.settle(promiseQueue);
											}

										})
										.then(function () {
											return res.json({ Message: 'Success' });
										})

								}
							})
							.then(function() {
								// mark upload profile image task as completed
								if (req.body.ImageURI) {
									return Task.complete(profile.ID, 'profile-image');
								}
							})

					}


				})
				.catch(function (err) {
					logError(err, req, function () {
						res.status(500).json({ Message: 'Error occurred while updating profile' });
					});
				})

				
				

			}

		})

	})


	// requests ActivCanvas activation for the specified profile
	.get('/:profileID/activcanvas/request', function (req, res) {
		// expects an integer profile id
		var profileID = parseInt(req.params.profileID)
		if (isNaN(profileID)) {
			res.status(400).json({ Message: 'Numeric profileID expected: ' + profileID })
		}
		else {
			db('Profiles')
			.where('ID', profileID)
			.update({ ActivCanvasStatusID: 2 })
			.then(function (data) {
				res.json({ Message: 'Success' })
			})
			.catch(function (err) {
				logError(err, req, function () {
					res.status(500).json({ Message: 'An unexpected error occurred while updating the database' });
				});
			})

		}
	})





	.get('/:profileID/answers', function (req, res) {

		if (isNaN(parseInt(req.params.profileID))) {
			res.status(400).json({ Message: 'Invalid Profile ID' })
		}
		else {

			db
			.first('a.ID as ArtistID', 'g.ID as GalleryID')
			.from('Profiles as p')
			.leftJoin('Artists as a', 'a.ProfileID', 'p.ID')
			.leftJoin('Galleries as g', 'g.ProfileID', 'p.ID')
			.where('p.ID', req.params.profileID)
			.then(function (profile) {
				
				if (!profile) {
					return res.status(400).json({ Message: 'The profile specified does not exist' })
				}
				else if (profile.ArtistID || profile.GalleryID) {
					
					var profileType = profile.ArtistID ? 'Artist' : 'Gallery';

					db
					.select('Answer', profileType + 'QuestionID as QuestionID')
					.from(profileType + 'Answers')
					.where(profileType + 'ID', profile.ArtistID || profile.GalleryID)
					.then(function (answers) {
						res.json(answers);
					})
					.catch(function(err) {
						logError(err, req, function () {
							res.status(500).json({ Message: 'An unexpected error occurred while contacting the database' });
						});
					})

				}
				else {
					return res.status(400).json({ Message: 'The profile specified is neither an artist or gallery'})
				}

			});


		}

	})




	.post('/:profileID/answers/update', function (req, res) {
	 
		AccessToken.getUser(req).then(function (user) {

			if (!user) {
				res.status(400).json({ Message: 'Current user could not be determined' })
			}
			else if (isNaN(parseInt(req.params.profileID))) {
				res.status(400).json({ Message: 'Invalid Profile ID' })
			}
			else if (user.ProfileID != req.params.profileID && !user.memberOf('Administrators')) {
				res.status(403).json({ Message: 'You do not have permission to update this profile' })
			}
			else {

				// work out which type of profile we are updating
				db.first('p.ID', 'a.ID as ArtistID', 'g.ID as GalleryID')
				.from('Profiles as p')
				.leftJoin('Artists as a', 'a.ProfileID', 'p.ID')
				.leftJoin('Galleries as g', 'g.ProfileID', 'p.ID')
				.where('p.ID', req.params.profileID)
				.catch(function (err) {
					logError(err, req, function () {
						res.status(500).json({ Message: 'An unexpected error occurred while contacting the database' });
					});
				})
				.then(function (profile) {

					if (!profile) {
						return res.status(400).json({ Message: 'The profile specified does not exist' })
					}
					else if (profile.ArtistID || profile.GalleryID) {

						var Task = require('../utils/tasks'),
							questionIDs = [], answeredQuestionIDs = [], answers = [],
							profileType = profile.ArtistID ? 'Artist' : 'Gallery';

						req.body.forEach(function (answer) {
							questionIDs.push(answer.QuestionID);
							if (answer.Answer) {
								answeredQuestionIDs.push(answer.QuestionID);

								if (profile.ArtistID) {
									answer.ArtistID = profile.ArtistID;
								}
								else {
									answer.GalleryID = profile.GalleryID;
								}
								answer[profileType + 'QuestionID'] = answer.QuestionID;
								delete answer.QuestionID;

								answers.push(answer);
							}
						});

						// add/update answers
						db(profileType + 'Answers')
						.where(profileType + 'ID', profile.ArtistID || profile.GalleryID)
						.whereIn(profileType + 'QuestionID', questionIDs)
						.delete()
						.then(function () {
							return db(profileType + 'Answers').insert(answers);
						})
						.then(function () {
							return Task.isComplete(profile.ID, 'biography-min');
						})
						.then(function (complete) {
							if (!complete) {

								// count question types
								return db.count('ID as total')
								.from(profileType + 'QuestionTypes')
								.then(function (types) {

									// check if at least one question of each type has been answered
									return db.select('TypeID').distinct()
										.from(profileType + 'Questions')
										.whereIn('ID', answeredQuestionIDs)
										.then(function (answeredTypes) {

											if (types[0].total === answeredTypes.length) {
												return Task.complete(profile.ID, 'biography-min');
											}

										});

								})

							}
						})
						.then(function () {
							res.json({ Message: 'Success' });
						})
						.catch(function (err) {
							logError(err, req, function () {
								res.status(500).json({ Message: 'An unexpected error occurred while updating the database' });
							});
						})

					}
					else {
						res.status(400).json({ Message: 'The profile specified is neither an artist or gallery' })
					}

				})
				

			}

		})

	})









module.exports = router
