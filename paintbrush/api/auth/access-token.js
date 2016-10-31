var config = require('../config'),
	Promise = require('bluebird'),
	crypto = require('crypto'),
	base64url = require('base64url');

//
// Cache of all recently used tokens and the user data associated
//
var tokenCache = {};
var userCache = {};


//
// Returns general account data for the specified user
//
var getUserByID = function (id) {
	return new Promise(function (resolve, reject) {
		// adds util methods to user object
		var _extend = function (user) {

			// accepts either a group id or name as the first argument
			user.memberOf = function () {
				var _name = arguments[0], _id = _name * 1;

				for (var i in this.Groups) {
					if (isNaN(_id)) {
						if (this.Groups[i].Name === _name) {
							return true;
						}
					}
					else {
						if (this.Groups[i].ID === _id) {
							return true;
						}
					}
				}
				return false;
			};


			user.managesArtist = function (artistID) {
				var id = parseInt(artistID);
				if (!isNaN(id) && this.GalleryArtists) {
					return this.GalleryArtists.indexOf(id) > -1;
				}
				return false;
			};


			// return the updated user object
			return user;
		};

		if (userCache[id] && userCache[id].UserID) {
			resolve(userCache[id]);
		}
		else {
			db.first(
				'u.ID as UserID',
				//' as ClientID',
				'p.ID as ProfileID',
				'p.Name',
				'p.ActivCanvasStatusID',
				'a.ID as ArtistID',
				'g.ID as GalleryID',
				'u.Email',
				'ap_go.ProviderID as GoogleID',
				'ap_fb.ProviderID as FacebookID',
				db.raw('DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 24 HOUR) AS Expires')
			)
			.from('Users as u')
			.leftJoin('AuthenticationProviderProfiles as ap_fb', db.raw('ap_fb.UserID = u.ID AND ap_fb.AuthenticationProviderID = 1'))
			.leftJoin('AuthenticationProviderProfiles as ap_go', db.raw('ap_go.UserID = u.ID AND ap_go.AuthenticationProviderID = 2'))
			.leftJoin('Artists as a', 'a.UserID', 'u.ID')
			.leftJoin('GalleryUsers as gu', 'gu.UserID', 'u.ID')
			.leftJoin('Galleries as g', 'gu.GalleryID', 'g.ID')
			.leftJoin('Consumers as c', 'c.UserID', 'u.ID')
			.leftJoin('Profiles as p', db.raw('coalesce(a.ProfileID, g.ProfileID, c.ProfileID)'), 'p.ID')
			.where('u.ID', id)
			.then(function (data) {
				if (data) {
					var q = [];

					q.push(
						db.select('g.ID', 'g.Name')
							.from('UserGroups as ug')
							.join('Groups as g', 'ug.GroupID', 'g.ID')
							.where('ug.UserID', data.UserID)
							.then(function (groups) {
								data.Groups = groups;
							})
					);

					if (data.GalleryID) {
						q.push(
							db.select('ArtistProfileID')
								.from('GalleryArtists')
								.where('ProfileID', data.ProfileID)
								.orderBy('ArtistProfileID')
								.then(function (artists) {
									data.GalleryArtists = [];
									artists.forEach(function (a) {
										data.GalleryArtists.push(a.ArtistProfileID);
									})
								})
						)
					}

					Promise.all(q)
							.then(function () {
								if (data.ProfileID) {
									userCache[id] = data;
								}
								resolve(_extend(data));
							})
				}
				else {
					resolve(null);
				}
			})
			.catch(reject)
		}

	});
};


//
// Returns user data associated with an access token
//
var getUser = function(token) {
	return new Promise(function (resolve, reject) {

		// allow for a token or a request object containing a token to be passed in
		var _token = typeof token === 'string' ? token : AccessToken.extract(token);

		var _userID = tokenCache[_token] ? tokenCache[_token].UserID : 0;

		if (_userID && userCache[_userID]) {
			resolve(userCache[_userID]);
		}
		else {

			// check in database
			db.first(
				'at.UserID as UserID',
				'at.ClientID',
				db.raw('DATE_ADD(at.created_at, INTERVAL ' + config.auth.timeout + ' SECOND) AS Expires')
			)
			.from('AccessTokens as at')
			.where('at.Token', _token)
			.then(function (data) {

				if (data) {
					tokenCache[_token] = data;

					return getUserByID(data.UserID)
						.then(function(user) {
							if (user) {
								user.ClientID = data.ClientID;
							}
							resolve(user);
						});
				}
				else {
					resolve(null);
				}
			})
			.catch(reject)

		}

	});
};


//
// Refreshes user data stored in cache for the specified token
//
var refreshUser = function(token) {

	// allow for a token or a request object containing a token to be used
	var _token = (token.headers && token.headers['authorization'] || ' ' + token).split(' ')[1];

	// clear cached user data
	if (tokenCache[token]) {
		delete userCache[tokenCache[token].UserID];
	}
	delete tokenCache[_token];

	// load (and cache) user data from database
	return getUser(_token);
};


var AccessToken = {

	//
	// Creates a new access and refresh token for the specified user
	//
	create: function(userID, clientID) {
		return new Promise(function (resolve, reject) {

			var tokenValue = base64url(crypto.randomBytes(96)),
				refreshTokenValue = base64url(crypto.randomBytes(96));

			db('RefreshTokens').insert({ Token: refreshTokenValue, ClientID: clientID || 1, UserID: userID, created_at: new Date() })
				.then(function () {
					return db('AccessTokens').insert({ Token: tokenValue, ClientID: clientID || 1, UserID: userID, created_at: new Date() })
				})
				.then(function () {

					getUser(tokenValue).then(function (user) {
						resolve({
							access_token: tokenValue,
							refresh_token: refreshTokenValue,
							token_type: 'Bearer',
							ProfileID: user.ProfileID
						});
					})
					.catch(reject);

				})
				.catch(reject);

		});
	},


	//
	// Extracts a token from a request object
	//
	extract: function(req) {
		return (req.headers && req.headers['authorization'] || '').split(' ')[1];
	},


	//
	// Deletes expired tokens from the database and token cache
	//
	// Leaves old records for up to a week to allow token refreshing
	//
	tidy: function () {

		var now = new Date(),
			cacheCutOff = new Date(new Date().setDate(now.getDate() - 7)),
			// databaseCutOff = new Date(new Date().setSeconds(now.getSeconds() - config.auth.timeout - 604800));
			databaseCutOff = new Date(new Date().setDate(now.getDate() - 180));

		// Clean up database
		db('AccessTokens').where('created_at', '<', databaseCutOff).del()
			.then(function() {
				// Clean up cache
				for (var i in tokenCache) {
					if (tokenCache[i].Expires < cacheCutOff) {
						delete tokenCache[i];
					}
				}

				for (var i in userCache) {
					if (userCache[i].Expires < now) {
						delete userCache[i];
					}
				}
			})
			.then(function () {
				return db('RefreshTokens').where('created_at', '<', databaseCutOff).del();
			})
			.then(function () {
				return db('RefreshTokens').where('Used', '<', new Date(new Date().setSeconds(now.getSeconds() - 30))).del();
			})
			.catch(function (err) {
				console.error(err);
			})
	},


	//
	// Expose get/refresh user method
	//
	getUser: getUser,
	getUserByID: getUserByID,
	refreshUser: refreshUser

};


module.exports = AccessToken;