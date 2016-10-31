var config = require('../config'),
	Promise = require('bluebird'),
	Task = require('../utils/tasks'),
	AccessToken = require('../../auth/access-token'),
	ActivCanvas = require('../lib/activcanvas'),
	Permission = require('../lib/permission'),
	Analytics = require('../lib/analytics');


var service = {
		
	get: {

		all: function (profileID) {
			return new Promise(function (resolve, reject) {

				service.get.base(profileID)
					.then(function(profile) {

						if (!profile) {
							resolve();
						}
						else {
							return Promise.all([

								service.get.artist(profileID).then(function (artist) {
									profile.Artist = artist;
								}),

								service.get.activCanvas(profileID).then(function (contact) {
									profile.ActivCanvas = contact;
								}),

								service.get.contact(profileID).then(function (contact) {
									profile.Contact = contact;
								}),

								service.get.consumer(profileID).then(function (consumer) {
									profile.Consumer = consumer;
								}),

								service.get.gallery(profileID).then(function (gallery) {
									profile.Gallery = gallery;
								}),

								service.get.socialMedia(profileID).then(function (socialMedia) {
									profile.SocialMedia = socialMedia;
								})

							])
							.then(function () {
								resolve(profile);
							})
						}
					})
					.catch(reject);

			})
		},

		base: function (profileID) {
			return new Promise(function (resolve, reject) {
				db.first(
					'ID',
					'Name',
					'ImageURI'
				)
				.from('Profiles')
				.where('ID', profileID)
				.then(function (profile) {
					if (profile) {
						profile.ImageURI = profile.ImageURI || config.profile.defaultImage;
					}
					resolve(profile);
				})
				.catch(reject);
			})
		},

		artist: function (profileID) {
			return new Promise(function (resolve, reject) {
				db.first(
					'a.ID',
					'a.AgeBracketID',
					'ab.Description as AgeBracket',
					'a.Nationality',
					'a.Location',
					'a.Private'
				)
				.from('Artists as a')
				.leftJoin('AgeBrackets as ab', 'a.AgeBracketID', 'ab.ID')
				.where('a.ProfileID', profileID)
				.then(function (artist) {
					if (!artist) {
						resolve();
					}
					else {
						var queue = [];

						queue.push(
							db.select(db.raw(
								'at.ID, at.Type ' +
								'from ArtistTypeMap as atm ' +
								'join ArtistTypes as at on atm.ArtistTypeID = at.ID ' +
								'where atm.ArtistID = ' + artist.ID + ' ' +
								'order by at.Type asc'
							))
							.then(function (types) {
								artist.Types = types;
							})
						);

						queue.push(
							db.select(db.raw(
								'ws.ID, ws.Description ' +
								'from ArtistWorkingSpaces as aws ' +
								'join WorkingSpaces as ws on aws.WorkingSpaceID = ws.ID ' +
								'where aws.ArtistID = ' + artist.ID + ' ' +
								'order by ws.Description asc'
							))
							.then(function (workingSpaces) {
								artist.WorkingSpaces = workingSpaces;
							})
						);

						queue.push(
							db.select(db.raw(
								'm.Name, count(*) as Count ' +
								'from Artworks as a ' +
								'join ArtworkMaterials as am on am.ArtworkID = a.ID ' +
								'join Materials as m on am.MaterialID = m.ID ' +
								'where a.ArtistProfileID = ' + profileID + ' and m.Deleted = 0 and a.Deleted = 0 ' +
								'group by m.ID ' +
								'order by Count desc, Name asc'
							))
							.then(function (artworkMaterials) {
								artist.ArtworkMaterials = artworkMaterials;
							})
						);

						queue.push(
							db.select(db.raw(
								's.Style, count(*) as Count ' +
								'from Artworks as a ' +
								'join ArtworkStyles as ast on ast.ArtworkID = a.ID ' +
								'join Styles as s on ast.StyleID = s.ID ' +
								'where a.ArtistProfileID = ' + profileID + ' and a.Deleted = 0 ' +
								'group by s.ID ' +
								'order by Count desc, Style asc'
							))
							.then(function (artworkStyles) {
								artist.ArtworkStyles = artworkStyles;
							})
						);

						queue.push(
							db.select(db.raw(
								's.Subject, count(*) as Count ' +
								'from Artworks as a ' +
								'join ArtworkSubjects as asb on asb.ArtworkID = a.ID ' +
								'join Subjects as s on asb.SubjectID = s.ID ' +
								'where a.ArtistProfileID = ' + profileID + ' and a.Deleted = 0 ' +
								'group by s.ID ' +
								'order by Count desc, Subject asc'
							))
							.then(function (artworkSubjects) {
								artist.ArtworkSubjects = artworkSubjects;
							})
						);

						queue.push(
							db.select(db.raw(
								'awt.Name ' +
								'from ArtistAwards as aa ' +
								'join ArtistAwardTypes as awt on aa.ArtistAwardTypeID = awt.ID ' +
								'where aa.ArtistID = ' + artist.ID + ' ' +
								'order by awt.Name asc'
							))
							.then(function (awards) {
								artist.Awards = awards.map(function (a) {
									return a.Name;
								})
							})
						);

						queue.push(
							db.select(db.raw(
								'aqt.Name ' +
								'from ArtistQualifications as aq ' +
								'join ArtistQualificationTypes as aqt on aq.ArtistQualificationTypeID = aqt.ID ' +
								'where aq.ArtistID = ' + artist.ID + ' ' +
								'order by aqt.Name asc'
							))
							.then(function (qualifications) {
								artist.Qualifications = qualifications.map(function (q) {
									return q.Name;
								})
							})
						);

						return Promise.all(queue).then(function () {
							resolve(artist);
						})
					}
				})
				.catch(reject);

			})
		},

		activCanvas: function (profileID) {
			return new Promise(function (resolve, reject) {
				db.first(
					'acs.ID as StatusID',
					'acs.Description as Status',
					'p.VideoID',
					'v.Name as VideoName',
					'p.ActivCanvasLink as Link',
					'p.ActivCanvasLinkText as LinkText',
					'ast.AutoPlay'
				)
				.from('Profiles as p')
				.leftJoin('ActivCanvasStatus as acs', 'p.ActivCanvasStatusID', 'acs.ID')
				.leftJoin('ActivCanvasSettings as ast', 'ast.ProfileID', 'p.ID')
				.leftJoin('Videos as v', 'v.ID', 'p.VideoID')
				.where('p.ID', profileID)
				.then(function (data) {
					if (data.AutoPlay === null) {
						data.AutoPlay = true;
					}
					resolve(data);
				})
				.catch(reject);
			})
		},

		consumer: function (profileID) {
			return new Promise(function (resolve, reject) {
				db.first(
					'ID'
				)
				.from('Consumers')
				.where('ProfileID', profileID)
				.then(resolve)
				.catch(reject);
			})
		},

		contact: function (profileID) {
			return new Promise(function (resolve, reject) {
				db.first(
					'c.Address1',
					'c.Address2',
					'c.Address3',
					'c.Town',
					'c.Postcode',
					'c.Country',
					'c.Website',
					'c.Landline',
					'c.Mobile'
				)
				.from('Profiles as p')
				.leftJoin('ContactInformation as c', 'p.ContactInformationID', 'c.id')
				.where('p.ID', profileID)
				.then(resolve)
				.catch(reject);
			})
		},

		gallery: function (profileID) {
			return new Promise(function (resolve, reject) {
				db.first(
					'ID'
				)
				.from('Galleries')
				.where('ProfileID', profileID)
				.then(function (gallery) {

					if (!gallery) {
						resolve();
					}
					else {

						// return list of artist profiles we currently have full control over
						// TODO: generate a list of profiles we have some form of permission to update
						return db('GalleryUsers').where('GalleryID', gallery.ID).first('UserID')
							.then(function(user) {
								return Permission.Profile.list('all', user.UserID).then(function(profiles) {

									// ensure these are all artist profiles
									return db('Artists').whereRaw('ProfileID IN (' + profiles.join(',') + ')').select('ProfileID')
										.then(function (artistProfiles) {
											gallery.Artists = artistProfiles.map(function (ap) {
												return ap.ProfileID;
											});
											resolve(gallery);
										})
								})
							})

					}

				})
				.catch(reject);
			})
		},

		socialMedia: function (profileID) {
			return new Promise(function (resolve, reject) {
				db.select(
					'smp.ServiceID',
					'smp.URL'
				)
				.from('Profiles as p')
				.join('SocialMediaProfiles as smp', 'p.ID', 'smp.ProfileID')
				.where('p.ID', profileID)
				.then(resolve)
				.catch(reject);
			})
		}

	},


	update: {

		base: function (profileID, data) {
			return new Promise(function (resolve, reject) {
				db('Profiles')
					.where('ID', profileID)
					.update({
						Name: data.Name,
						ImageURI: data.ImageURI
					})
					.then(resolve)
					.catch(reject);
			})
		},


		activcanvas: function (profileID, data) {
			return new Promise(function (resolve, reject) {

				// Keep a note of previous VideoID value
				service.get.activCanvas(profileID)
					.then(function (existing) {

						return db('Profiles')
							.where('ID', profileID)
							.update({
								VideoID: data.VideoID,
								ActivCanvasLink: data.Link,
								ActivCanvasLinkText: data.LinkText
							})
							.then(function() {
								return db('ActivCanvasSettings').where('ProfileID', profileID).first('ID')
							})
							.then(function(settings) {
								if (settings) {
									return db('ActivCanvasSettings').where('ID', settings.ID).update({ AutoPlay: data.AutoPlay });
								}
								else {
									return db('ActivCanvasSettings').insert({
										ProfileID: profileID,
										AutoPlay: data.AutoPlay,
										VideoID: data.VideoID,
										LinkURI: data.Link,
										LinkText: data.LinkText
									});
								}
							})
							.then(function() {

								var videoChanged = existing.VideoID != data.VideoID,
									linkChanged = existing.Link !== data.Link || existing.LinkText !== data.LinkText,
									autoPlayChanged = existing.AutoPlay !== data.AutoPlay;

								if (videoChanged || linkChanged || autoPlayChanged) {

									// find all artwork without an ArtworkVideo record
									db.select('aw.ID')
										.from('Artworks as aw')
										.leftJoin('ArtworkVideos as av', 'av.ArtworkID', 'aw.ID')
										.whereRaw('aw.ArtistProfileID = ' +  profileID + ' AND aw.Deleted = 0 AND av.VideoID IS NULL')
										.then(function (artworks) {

											// re-activate with current profile video settings
											if (videoChanged) {
												artworks.forEach(function (artwork) {
													ActivCanvas.queue({ artworkID: artwork.ID, videoID: data.VideoID });
												});
											}

											// re-activate everything with new link settings
											if (linkChanged || autoPlayChanged) {
												return db.select('aw.ID', db.raw('coalesce(av.VideoID, ' + data.VideoID + ') as VideoID'), 'av.NoVideo')
													.from('Artworks as aw')
													.leftJoin('ArtworkVideos as av', 'av.ArtworkID', 'aw.ID')
													.whereRaw(
														'aw.ArtistProfileID = ' +  profileID + ' AND aw.Deleted = 0' +
														(videoChanged && artworks.length ? ' AND aw.ID NOT IN (' +   artworks.map(function(a){ return a.ID }).join(',') + ')' : '')
													)
													.then(function (_artworks) {
														_artworks.forEach(function (artwork) {
															ActivCanvas.queue({ artworkID: artwork.ID, videoID: artwork.NoVideo ? undefined : artwork.VideoID });
														});
													})
											}

										});

								}

							})


					})
					.then(resolve)
					.catch(reject);
			})
		},


		artist: function (profileID, data) {
			return new Promise(function (resolve, reject) {
				db('Artists').where('ProfileID', profileID).first('ID')
					.then(function(artist) {
						if (artist) {

							var _data = {
								AgeBracketID: data.AgeBracketID,
								Location: data.Location,
								Nationality: data.Nationality
							};

							// update artist
							return db('Artists').where('ID', artist.ID).update(_data)

								// update artist types
								.then(function () {
									return db('ArtistTypeMap').where('ArtistID', artist.ID).delete();
								})
								.then(function () {
									if (data.Types) {
										var types = data.Types.map(function (typeID) {
											return { ArtistID: artist.ID, ArtistTypeID: typeID }
										});
										return db('ArtistTypeMap').insert(types);
									}
								})

								// update artist working spaces
								.then(function () {
									return db('ArtistWorkingSpaces').where('ArtistID', artist.ID).delete();
								})
								.then(function () {
									if (data.WorkingSpaces) {
										var spaces = data.WorkingSpaces.map(function (spaceID) {
											return { ArtistID: artist.ID, WorkingSpaceID: spaceID }
										});
										return db('ArtistWorkingSpaces').insert(spaces);
									}
								})
						}
					})
					.then(resolve)
					.catch(reject);
			})
		},


		awards: function (profileID, data) {
			return new Promise(function (resolve, reject) {
				db('Artists').where('ProfileID', profileID).first('ID')
					.then(function(artist) {
						if (artist) {

							// update artist awards
							return db('ArtistAwards').where('ArtistID', artist.ID).del()
								.then(function () {
									if (data.Awards) {
										var _queue = [];

										data.Awards.forEach(function(award) {
											_queue.push(
												db('ArtistAwardTypes').where('Name', award).first()
													.then(function(awardType) {
														if (!awardType) {
															return db('ArtistAwardTypes').insert({ Name: award })
																.then(function(result) {
																	return db('ArtistAwards').insert({ ArtistID: artist.ID, ArtistAwardTypeID: result[0] });
																})
														}
														else {
															return db('ArtistAwards').insert({ ArtistID: artist.ID, ArtistAwardTypeID: awardType.ID });
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
									if (data.Qualifications) {
										var _queue = [];

										data.Qualifications.forEach(function(qualification) {
											_queue.push(
												db('ArtistQualificationTypes').where('Name', qualification).first()
													.then(function(qualificationType) {
														if (!qualificationType) {
															return db('ArtistQualificationTypes').insert({ Name: qualification })
																.then(function(result) {
																	return db('ArtistQualifications').insert({ ArtistID: artist.ID, ArtistQualificationTypeID: result[0] });
																})
														}
														else {
															return db('ArtistQualifications').insert({ ArtistID: artist.ID, ArtistQualificationTypeID: qualificationType.ID	});
														}
													})
											);
										});
										return Promise.all(_queue);
									}

								})

						}
					})
					.then(resolve)
					.catch(reject);
			})
		},


		contact: function (profileID, data) {
			return new Promise(function (resolve, reject) {
				db.first(
					'c.ID'
				)
				.from('Profiles as p')
				.join('ContactInformation as c', 'p.ContactInformationID', 'c.ID')
				.where('p.ID', profileID)
				.then(function (contactInfo) {

					if (contactInfo) {
						return db('ContactInformation').where('ID', contactInfo.ID).update(data);
					}
					else {
						return db('ContactInformation').insert(data).then(function (cid) {
							return db('Profiles').where('ID', profileID).update({ ContactInformationID: cid})
						})
					}

				})
				.then(resolve)
				.catch(reject);
			})
		},

		social: function (profileID, data) {
			return new Promise(function (resolve, reject) {
				var profiles = data.map(function (p) {
					p.ProfileID = profileID; return p;
				});

				db('SocialMediaProfiles').where('ProfileID', profileID).del()
					.then(function() {
						if (profiles.length) {
							return db('SocialMediaProfiles').insert(profiles);
						}
					})
					.then(resolve)
					.catch(reject);
			})
		}

	}


	
};


module.exports = service;