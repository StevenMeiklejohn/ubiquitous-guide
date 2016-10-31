var passport = require('passport'),
	config = require('../config'),
	ClientPWStrategy = require('passport-oauth2-client-password').Strategy,
	FacebookStrategy = require('passport-facebook').Strategy,
	GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
	BearerStrategy = require('passport-http-bearer').Strategy,
	Promise = require('promise'),
	AccessToken = require('./access-token');



var addSocialMediaProfile = function(userID, authenticationProviderID, providerID) {
	return db.first('p.ID')
		.from('Users as u')
		.leftJoin('Artists as a', 'a.UserID', 'u.ID')
		.leftJoin('GalleryUsers as gu', 'gu.UserID', 'u.ID')
		.leftJoin('Galleries as g', 'gu.GalleryID', 'g.ID')
		.leftJoin('Consumers as c', 'c.UserID', 'u.ID')
		.leftJoin('Profiles as p', db.raw('coalesce(a.ProfileID, g.ProfileID, c.ProfileID)'), 'p.ID')
		.where('u.ID', userID)
		.then(function(profile) {
			if (profile && profile.ID) {
				return db.first('smp.ID')
					.from('SocialMediaProfiles as smp')
					.join('SocialMediaServices as sms', 'sms.ID', 'smp.ServiceID')
					.where({ 'smp.ProfileID': profile.ID, 'sms.AuthenticationProviderID': authenticationProviderID })
					.then(function(smp) {
						if (!smp) {
							return db.first()
								.from('SocialMediaServices')
								.where({ AuthenticationProviderID: authenticationProviderID })
								.then(function(sms){
									return db('SocialMediaProfiles').insert({
										ProfileID: profile.ID,
										ServiceID: sms.ID,
										URL: sms.URL + '/' + providerID
									});
								})
						}
					})
			}
		});
};


passport.use(new ClientPWStrategy(
		function(clientId, clientSecret, done) {
			db.first('ID', 'Secret').from('Clients').where({ Login: clientId, Authorised: 1, Deleted: 0 }).asCallback(function(err, client){
				if (err) { return done(err) }
				if (!client) { return done(null, false) }
				if (client.Secret != clientSecret) { return done(null, false) }

				return done(null, client)
			})
		}
));

passport.use(new FacebookStrategy({
		clientID: config.facebook.clientID,
		clientSecret: config.facebook.clientSecret,
		callbackURL: config.facebook.completeURL
	},
	function (accessToken, refreshToken, profile, done) {
		process.nextTick(function () {

			db('AuthenticationProviderProfiles').where({ AuthenticationProviderID: 1, ProviderID: profile.id }).first('UserID')
				.then(function (user) {

					return new Promise(function (resolve) {

						if (user) {
							resolve(user);
						}
						else {
							//
							// Attempt to find user via email address instead
							//
							var FB = require('fb');
							FB.setAccessToken(accessToken);
							FB.api('me', {fields: ['email']}, function (u) {
								if (!u.email) {
									resolve();
								}
								else {
									profile.email = u.email;
									db('Users').where('Email', u.email).first('ID as UserID')
										.then(function(_user){

											if (!_user) {
												resolve();
											}
											else {

												//
												// Get profile picture if possible
												//
												FB.api(profile.id + '/picture', { redirect: 0, type: 'large' }, function(picture) {
													//
													// Create a new auth provider profile record for this user
													//
													var _profile = {
														AuthenticationProviderID: 1,
														ProviderID: profile.id,
														UserID: _user.UserID,
														Name: profile.displayName,
														OAuthToken: accessToken
													};

													if (!picture.error) {
														profile.imageURI = picture.data.url;
														_profile.ProfileImageURI = picture.data.url;
													}

													db('AuthenticationProviderProfiles').insert(_profile)
														.then(function() { resolve(_user); })
														.catch(function() { resolve(_user); });

												});
											}

										})
										.catch(function() { resolve(); });
								}
							});
						}

					});

				})
				.then(function (user) {

					if (!user) {
						done(null, {}, { message: 'Could not match Facebook ID with an existing user', profile: profile, oauthToken: accessToken }, {});
					}
					else {
						//
						// Create social media profile record if one doesn't currently exist
						//
						return addSocialMediaProfile(user.UserID, 1, profile.id)
							.then(function() {
								//
								// Fetch user record to check if user was in the process of registering
								//
								return db('Users').where('ID', user.UserID).first('ID', 'Email', 'RegistrationID')
									.then(function(_user) {
										return AccessToken.create(_user.ID)
											.then(function(token){
												token.profile = profile;
												token.oauthToken = accessToken;
												done(null, _user, token, { 'expires_in': config.auth.timeout })
											});
									});
							})

					}

				})
				.catch(function (err) {
					return done(err);
				})

		});
	}
));

passport.use(new GoogleStrategy({
		clientID: config.google.clientID,
		clientSecret: config.google.clientSecret,
		callbackURL: config.google.completeURL
	},
	function(accessToken, refreshToken, profile, done) {
		process.nextTick(function () {

			db('AuthenticationProviderProfiles').where({ AuthenticationProviderID: 2, ProviderID: profile.id }).first('UserID')
				.then(function (user) {

					return new Promise(function (resolve) {

						if (user) {
							resolve(user);
						}
						else {
							//
							// Attempt to find user via email address instead
							//
							var email;
							if (profile.emails) {
								profile.emails.some(function(e) {
									if (e.type === 'account') {
										email = e.value;
										return email;
									}
								})
							}

							if (!email) {
								resolve();
							}
							else {
								profile.email = email;
								db('Users').where('Email', email).first('ID as UserID')
									.then(function(_user) {

										if (!_user) {
											resolve();
										}
										else {

											//
											// Create a new auth provider profile record for this user
											//
											var _profile = {
												AuthenticationProviderID: 2,
												ProviderID: profile.id,
												UserID: _user.UserID,
												Name: profile.displayName,
												OAuthToken: accessToken
											};

											if (profile.photos) {
												var uri = ((profile.photos[0] || {}).value || '').replace(/sz=\d+/gi,''); // remove max size param from google plus url's
												if (uri) {
													profile.imageURI = uri;
													_profile.ProfileImageURI = uri;
												}
											}

											db('AuthenticationProviderProfiles').insert(_profile)
												.then(function() { resolve(_user); })
												.catch(function() { resolve(_user); });

										}

									})
									.catch(function() { resolve(); });
							}

						}

					});

				})
				.then(function (user) {

					if (!user) {
						done(null, {}, { message: 'Could not match Google ID with an existing user', profile: profile, oauthToken: accessToken }, {});
					}
					else {
						//
						// Create social media profile record if one doesn't currently exist
						//
						return addSocialMediaProfile(user.UserID, 2, profile.id)
							.then(function() {
								//
								// Fetch user record to check if user was in the process of registering
								//
								return db('Users').where('ID', user.UserID).first('ID', 'Email', 'RegistrationID')
									.then(function(_user) {
										return AccessToken.create(_user.ID)
											.then(function(token){
												token.profile = profile;
												token.oauthToken = accessToken;
												done(null, _user, token, { 'expires_in': config.auth.timeout })
											});
									});
							});

					}

				})
				.catch(function (err) {
					return done(err);
				})
		});
	}
));



passport.serializeUser(function (user, done) {
	done(null, user);
});

passport.deserializeUser(function (user, done) {
	done(null, user);
});


passport.use(new BearerStrategy(
	function(accessToken, done) {

		// check access token cache
		var token = AccessToken.getUser(accessToken);

		// checks token is valid once retrieved from cache/database
		var validateToken = function() {
			if (!token) {
				done(null, false, { message: 'This endpoint requires authentication' });
			}
			else if (token.Expires < new Date()) {
				db('AccessTokens').where({ Token: accessToken }).del()
					.then(function() {
						done(null, false, { message: 'Token expired' });
					})
					.catch(function(err){
						done(err);
					});
			}
			else {
				done(null, { ID: token.UserID }, { scope: '*' })
			}
		};


		if (token && token.Expires) {
			validateToken();
		}
		else {
			db.first('UserID', db.raw('DATE_ADD(created_at, INTERVAL ' + config.auth.timeout + ' SECOND) AS Expires'))
				.from('AccessTokens').where({ Token: accessToken })
					.then(function(_token) {
						token = _token;
						validateToken();
					})
					.catch(function(err){
						done(err);
					})
		}
	}
));
