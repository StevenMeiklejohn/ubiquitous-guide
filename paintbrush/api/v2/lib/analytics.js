var Promise = require('bluebird'),
	AccessToken = require('../../auth/access-token'),
	Device = require('./device');

var Analytics = {

	event: {

		add: function(req, eventID, data) {
			return new Promise(function (resolve, reject) {
				data = data || {};

				console.log('\x1b[33mANALYTICS\x1b[0m: \x1b[36mEVENT ' + eventID + '\x1b[0m: ' + JSON.stringify(data));

				var q = [],
					artwork, artist, profile, shortlist, video;

				if (data.ArtworkID) {
					q.push(db('Artworks').where('ID', data.ArtworkID).first().then(function(a) { artwork = a; }));
				}
				if (data.ArtistID) {
					q.push(db('Artists').where('ID', data.ArtistID).first().then(function(a) { artist = a; }));
				}
				if (data.ArtworkID && !data.ArtistID) {
					q.push(db('Artworks as aw').join('Artists as a', 'aw.ArtistProfileID', 'a.ProfileID').where('aw.ID', data.ArtworkID).first('a.*').then(function(a) { artist = a; data.ArtistID = a.ID; }));
				}
				if (data.ProfileID) {
					q.push(db('Profiles').where('ID', data.ProfileID).first().then(function(a) { profile = a; }));
				}
				if (data.ShortlistID) {
					q.push(db('Shortlists').where('ID', data.ShortlistID).first().then(function(a) { shortlist = a; }));
				}
				if (data.VideoID) {
					q.push(db('Videos').where('ID', data.VideoID).first().then(function(a) { video = a; }));
				}

				Promise.all(q)
					.then(function() {

						var valid = !(
							(data.ArtworkID && !artwork) ||
							(data.ArtistID && !artist) ||
							(data.ProfileID && !profile) ||
							(data.ShortlistID && !shortlist) ||
							(data.VideoID && !video)
						);

						if (valid) {

							var saveEvent = function (user, device) {
								db('AnalyticEvents').insert({
									EventID: eventID,
									UserID: user.UserID,
									UserProfileID: user.ProfileID,
									ClientID: user.ClientID,
									ArtworkID: data.ArtworkID,
									ArtistID: data.ArtistID,
									ProfileID: data.ProfileID
									|| (artist || {}).ProfileID
									|| (shortlist || {}).ProfileID
									|| (video || {}).ProfileID
									|| (artwork || {}).ArtistProfileID,
									ShortlistID: data.ShortlistID,
									VideoID: data.VideoID,
									DeviceBrowserID: (device || {}).BrowserID
								})
								.then(function() {

									switch (eventID) {
										//
										// Scanned artwork
										//
										case 2: return db('Artworks').where('ID', artwork.ID).update({ Scanned: artwork.Scanned + 1 }); break;
										//
										// Viewed artwork
										//
										case 7: return db('Artworks').where('ID', artwork.ID).update({ Views: artwork.Views + 1 }); break;
										//
										// Viewed artist info
										//
										case 8: return Analytics.event.add(req, 18, { ProfileID: artist.ProfileID }); break;
									}

								})
								.then(function() { resolve(); })
								.catch(reject);
							};

							//
							// Check if user is logged in
							//
							AccessToken.getUser(req).then(function(user) {
								if (!user) {
									saveEvent({ UserID: -1, ProfileID: -1, ClientID: 1 });
								}
								else {
									Device.current(req).then(function(device) {
										saveEvent(user, device);
									})
									.catch(reject);
								}
							});

						}
						else {
							console.log('\x1b[33mANALYTICS\x1b[0m: \x1b[33mEVENT ' + eventID + ' IGNORED\x1b[0m: ' + JSON.stringify(data));
						}

					})
					.catch(reject);

			});
		},


		list: function(autoRecorded) {
			return new Promise(function (resolve, reject) {
				db('AnalyticEventTypes')
					.select(
						'ID',
						'Description',
						'ArtworkID',
						'ArtistID',
						'ProfileID',
						'ShortlistID',
						'VideoID'
					)
					.whereRaw(autoRecorded === undefined ? '' : 'AutoRecorded = ' + autoRecorded)
					.then(function (data) {
						data.forEach(function(item) {
							item.ArtworkID = !!item.ArtworkID;
							item.ArtistID = !!item.ArtistID;
							item.ShortlistID = !!item.ShortlistID;
							item.VideoID = !!item.VideoID;
							item.ProfileID = !!item.ProfileID;
						});
						resolve(data);
					})
					.catch(reject);
			});
		}
	}

};


module.exports = Analytics;