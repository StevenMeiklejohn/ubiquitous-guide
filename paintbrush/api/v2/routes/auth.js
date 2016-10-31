var config = require('../config'),
	router = require('express').Router(),
	fs = require('fs'),
	passport = require('passport'),
	oauth2 = require('../../auth/oauth2'),
	uuid = require('node-uuid'),
	Email = require('../../lib/email'),
	bcrypt = require('bcrypt-nodejs'),
	Promise = require('bluebird'),
	Device = require('../lib/device'),
	Registration = require('../lib/registration'),
	AccessToken = require('../../auth/access-token');


var updateSocialMediaProfile = function (profileID, authenticationProviderID, providerUserID) {
	return db.first('smp.ID')
		.from('SocialMediaProfiles as smp')
		.join('SocialMediaServices as sms', 'sms.ID', 'smp.ServiceID')
		.where({ 'smp.ProfileID': profileID, 'sms.AuthenticationProviderID': authenticationProviderID })
		.then(function(smp) {
			if (!smp) {
				return db.first()
					.from('SocialMediaServices')
					.where({ AuthenticationProviderID: authenticationProviderID })
					.then(function(sms){
						return db('SocialMediaProfiles').insert({
							ProfileID: profileID,
							ServiceID: sms.ID,
							URL: sms.URL + '/' + providerUserID
						});
					})
			}
		})
};



router

	.post('/auth', Device.identifyLogin, oauth2.token)

	.post('/auth/refresh', Device.identify, oauth2.token)

	.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }))

	.get('/auth/facebook/callback',
		passport.authenticate('facebook', {
			failureRedirect: '/api/auth/dummy-page'
		}),
		function (req, res) {

			if (req.authInfo.access_token) {
				var _req = { headers: res.req.headers, connection: res.req.connection };
				_req.headers['authorization'] = 'Bearer ' + req.authInfo.access_token;

				Device.identifyLogin(_req, res, function() {
					AccessToken.getUser(_req).then(function (user) {
						res.json({
							access_token: req.authInfo.access_token,
							refresh_token: req.authInfo.refresh_token,
							token_type: 'Bearer',
							ProfileID: user.ProfileID,
							RegistrationID: req.user.RegistrationID,
							RegistrationEmail: req.user.Email,
							profile: req.authInfo.profile,
							oauthToken: req.authInfo.oauthToken
						});
					})
				});
			}
			else if (req.authInfo.profile) {

				if (req.authInfo.profile.imageURI) {
					res.json(req.authInfo);
				}
				else {
					//
					// Get profile picture if possible
					//
					var FB = require('fb');
					FB.setAccessToken(req.authInfo.oauthToken);
					FB.api(req.authInfo.profile.id + '/picture', { redirect: 0, type: 'large' }, function(picture) {
						if (!picture.error) {
							req.authInfo.profile.imageURI = picture.data.url;
						}
						res.json(req.authInfo);
					});
				}

			}
			else {
				res.status(400).json({ Message: 'Error' });
			}

		}
	)

	.get('/auth/facebook/complete', function (req, res) {
		fs.readFile(__dirname + '/../static/login-oauth.htm', 'utf8', function (err, contents) {
			if (err) {
				res.sendStatus(500);
			}
			else {
				res.send(contents
					.replace(/\[CDV\]/g, 'cdv=' + clientDependencyVersion)
					.replace(/\[CALLBACK_URL\]/g, config.facebook.callbackURL)
					.replace(/\[PROVIDER_ID\]/g, 'FacebookID')
				);
			}
		});
	})


	.get('/auth/facebook/token/:token', function(req, res) {

		var FB = require('fb');
		FB.setAccessToken(req.params.token);

		//
		// Util function to look up FB profile pic
		//
		var getProfilePicture = function (profile) {
			return new Promise(function(resolve){
				FB.api(profile.id + '/picture', { redirect: 0, type: 'large' }, function(picture) {
					if (picture.data && picture.data.url) {
						resolve(picture.data.url);
					}
					else {
						resolve();
					}
				});
			});
		};

		//
		// Fetch FB profile using OAuth Token
		//
		FB.api('me', { fields: ['id', 'name', 'email'] }, function (profile) {

			if(!profile || profile.error) {
				res.status(500).json({
					Message: 'Facebook returned an error',
					Error: (profile || {}).error || 'Unknown error'
				});
			}
			else {

				//
				// Check for existing user via authentication provider profile
				//
				db('AuthenticationProviderProfiles').where({ 'ProviderID': profile.id, AuthenticationProviderID: 1 }).first()
					.then(function(user) {

						if (user) {
							//
							// Generate new Access Token for this user
							//
							return AccessToken.create(user.UserID, 2).then(function(token) {
								Device.identifyLogin(req, res, function () {
									res.json(token);
								});
							});
						}
						else {

							//
							// Check for existing user with email address
							//
							return db('Users').where('Email', profile.email || '').first()
								.then(function(_user) {

									return getProfilePicture(profile)
										.then(function(profileImageURI) {

											var providerProfile = {
												AuthenticationProviderID: 1,
												ProviderID: profile.id,
												Name: profile.name,
												OAuthToken: req.params.token,
												ProfileImageURI: profileImageURI
											};

											if (_user) {
												providerProfile.UserID = _user.ID;

												//
												// Check for existing AuthenticationProviderProfile record
												//
												return db('AuthenticationProviderProfiles').where({ UserID: _user.ID, AuthenticationProviderID: 1 }).first()
														.then(function (app) {
															if (app) {
																return db('AuthenticationProviderProfiles').where('ID', app.ID).update(providerProfile);
															}
															else {
																//
																// Create missing AuthenticationProviderProfile
																//
																return db('AuthenticationProviderProfiles').insert(providerProfile);
															}
														})
														.then(function() {
															//
															// Generate new Access Token for this user
															//
															return AccessToken.create(_user.ID, 2).then(function(token) {
																Device.identifyLogin(req, res, function () {
																	res.json(token);
																});
															});
														})

											}
											else {

												AccessToken.getUser(req).then(function(cUser){

													//
													// Check if user is currently logged in using temp account
													//
													if (cUser && cUser.Email.indexOf('@actemp') > -1) {
														providerProfile.UserID = cUser.UserID;

														//
														// Create missing AuthenticationProviderProfile
														//
														return db('AuthenticationProviderProfiles').insert(providerProfile)
															.then(function() {
																return db('Users').where('ID', cUser.UserID).update({ 'Email': profile.email });
															})
															.then(function() {
																return db('Profiles').where('ID', cUser.ProfileID).first().then(function(_data) {
																	var _profile = {};
																	if (_data.Name.indexOf('@actemp') > -1) {
																		_profile.Name = providerProfile.Name;
																	}
																	if (!_data.ImageURI) {
																		_profile.ImageURI = providerProfile.ProfileImageURI;
																	}
																	if (Object.keys(_profile).length) {
																		return db('Profiles').where('ID', cUser.ProfileID).update(_profile);
																	}
																})
															})
															.then(function() {
																//
																// Generate new Access Token for this user
																//
																return AccessToken.create(cUser.UserID, 2).then(function(token) {
																	Device.identifyLogin(req, res, function () {
																		res.json(token);
																	});
																});
															})

													}
													else {

														//
														// Create new consumer account linked to this Facebook ID
														//
														var account = {
															Name: profile.name,
															Email: profile.email || uuid.v4().replace(/\-/g, '') + '@actemp',
															ImageURI: providerProfile.ProfileImageURI,
															Password: uuid.v4(),
															AuthenticationProviderProfiles: [ providerProfile ]
														};

														return Registration.createConsumer(account)
															.then(function (consumer) {
																return AccessToken.create(consumer.UserID, 2).then(function(token) {
																	Device.identifyLogin(req, res, function () {
																		res.status(201).json(token);
																	});
																})

																.then(function() {
																	if (consumer.ProfileID) {
																		updateSocialMediaProfile(consumer.ProfileID, 1, profile.id);
																	}
																})
															})

													}

												});

											}
										});

								});

						}

					})
					.catch(function (err) {
						logError(err, req, function () {
							if (err.Status) {
								res.status(err.Status).json({ Message: err.Message || 'Unexpected error occurred' });
							}
							else {
								res.status(500).json({ Message: 'Unexpected error occurred' });
							}
						});
					});
			}
		});

	})

	.get('/auth/google', passport.authenticate('google', { scope: 'email https://www.googleapis.com/auth/plus.login' }))

	.get('/auth/google/callback',
		passport.authenticate('google', {
			failureRedirect: '/api/auth/dummy-page'
		}),
		function (req, res) {

			if (req.authInfo.access_token) {
				var _req = { headers: res.req.headers, connection: res.req.connection };
				_req.headers['authorization'] = 'Bearer ' + req.authInfo.access_token;

				Device.identifyLogin(_req, res, function() {
					AccessToken.getUser(_req).then(function (user) {
						res.json({
							access_token: req.authInfo.access_token,
							refresh_token: req.authInfo.refresh_token,
							token_type: 'Bearer',
							ProfileID: user.ProfileID,
							RegistrationID: req.user.RegistrationID,
							RegistrationEmail: req.user.Email,
							profile: req.authInfo.profile,
							oauthToken: req.authInfo.oauthToken
						});
					})
				});
			}
			else if (req.authInfo.profile) {

				if (req.authInfo.profile.photos  && !req.authInfo.profile.imageURI) {
					var uri = (req.authInfo.profile.photos[0] || {}).value;
					if (uri) {
						req.authInfo.profile.imageURI = uri.replace(/sz=\d+/gi,'');	// remove max size param from google plus url's
					}
				}

				res.json(req.authInfo);
			}
			else {
				res.status(400).json({ Message: 'Error' });
			}

		}
	)

	.get('/auth/google/complete', function (req, res) {
		fs.readFile(__dirname + '/../static/login-oauth.htm', 'utf8', function (err, contents) {
			if (err) {
				res.sendStatus(500);
			}
			else {
				res.send(contents
					.replace(/\[CDV\]/g, 'cdv=' + clientDependencyVersion)
					.replace(/\[CALLBACK_URL\]/g, config.google.callbackURL)
					.replace(/\[PROVIDER_ID\]/g, 'GoogleID')
				);
			}
		});
	})

	// return api docs if root url is requested
	.get('/', function (req, res) {
		res.sendFile('index.html', { root: __dirname + '/../docs/' })
	})


	// sends out a reset code via email
	.post('/auth/forgot', function (req, res) {
		var email = req.body.Email || ''
		if (!email) return res.status(400).json({ Message: 'Email address required' })

		// find user record and insert a reset code
		var resetCode = uuid.v4().replace(/\-/g, '') + uuid.v4().replace(/\-/g, '');
		return db('Users').where({ 'email': email }).update({ PasswordReset: resetCode })
		.then(function (updated) {
			if (!updated) return res.status(400).json({ Message: 'Email not found' });

			var subject = "Reset your ARN password"
			var body = "To reset your ARN password, please click the following link:<br/><br/>" +
				'<a mc:disable-tracking href="https://members.artretailnetwork.com/login?c=' + resetCode + '">Reset Password</a>';

			Email.send({ to: email, subject: subject, html: body });

			return res.json({ Message: 'Success' })
		})
		.catch(function (err) {
			if (!res.headersSent) return res.status(500).json({ Message: 'Error requesting password reset' });
		})
	})


	// resets a users password using a reset code
	.put('/auth/password/reset/:resetCode/:newPassword', function (req, res) {
		var resetCode = req.params.resetCode,
			newPassword = req.params.newPassword;
		
		if (!resetCode) {
			res.status(400).json({ Message: 'Invalid Reset Code' });
		}
		else {
			db('Users').where({ PasswordReset: resetCode }).first()
				.then(function(user) {
					if (!user) {
						res.status(404).json({ Message: 'Reset code not found' })
					}
					else if (!newPassword || newPassword === '-') {
						res.status(400).json({ Message: 'Invalid password' })
					}
					else {
						bcrypt.hash(newPassword, null, null, function (err, hash) {
							if (err) {
								res.status(500).json({ Message: 'Error creating password hash' });
							}
							else {
								return db('Users').where({ PasswordReset: resetCode }).update({ Password: hash, PasswordReset: '', OldPassword: '' })
									.then(function () {
										return res.json({ Message: 'Success', Email: user.Email })
									})
							}
						})
					}
				})
				.catch(function () {
					res.status(500).json({ Message: 'Error resetting password' });
				})

		}
	})



	// authorization check for protected endpoints
	.all('/*', passport.authenticate('bearer', { session: false }), function (req, res, next) {
		next();
		//AccessToken.getUser(req).then(function (user) {
		//	var sql
		//	if(user && user.UserID){
		//		if(user.UserID > 0){
		//			sql = 
		//				'SELECT COUNT(ge.ID) AS permission FROM GroupEndpoints ge, Groups g, Endpoints e, UserGroups ug, Users u ' +
		//				'WHERE ge.GroupID = g.ID AND ge.EndpointID = e.ID ' + 
		//				'AND ug.UserID = u.ID AND ug.GroupID = g.ID ' +
		//				'AND u.ID = ' + SqlString.escape(user.UserID) + ' ' +
		//				'AND ' + SqlString.escape(req.params[0]) + ' REGEXP e.Pattern'
		//		}
		//		else{
		//			sql =
		//				'SELECT COUNT(ge.ID) AS permission FROM GroupEndpoints ge, Groups g, Endpoints e, ClientGroups cg, Clients c ' +
		//				'WHERE ge.GroupID = g.ID AND ge.EndpointID = e.ID ' +
		//				'AND cg.ClientID = c.ID AND cg.GroupID = g.ID ' +
		//				'AND c.ID = ' + SqlString.escape(user.ClientID) + ' ' +
		//				'AND ' + SqlString.escape(req.params[0]) + ' REGEXP e.Pattern'
		//		}
		//		//console.log(sql)
		//		db.raw(sql).then(function(data){
		//			if(!data[0][0].permission){
		//				res.status(403)
		//				return res.json({ 'Unauthorised': 'You don\'t have permission to access the requested resource' })
		//			}
		//			else{
		//				next()
		//			}
		//		})
		//	}
		//	else{
		//		// no current user 
		//		return res.status(500).json({ Message: 'Current user could not be determined' })
		//	}
		//})
	})


	//
	// Links an external (e.g. Google/Facebook) account to the current users account
	//
	.post('/auth/provider/link', function (req, res) {
		AccessToken.getUser(req).then(function(user) {

			var providerID, authenticationProviderID;

			if (req.body.FacebookID) {
				providerID = req.body.FacebookID;
				authenticationProviderID = 1;
			}
			else if (req.body.GoogleID) {
				providerID = req.body.GoogleID;
				authenticationProviderID = 2;
			}

			if (!(providerID && authenticationProviderID)) {
				res.status(400).json({ Message: 'Please specify either a FacebookID or GoogleID' });
			}
			else {
				db('AuthenticationProviderProfiles').whereRaw('AuthenticationProviderID = ' + authenticationProviderID + ' AND ProviderID = ' + providerID).select('ID')
					.then(function(existing) {
						if (existing.length) {
							var q = [];
							existing.forEach(function(e) {
								q.push(db('AuthenticationProviderProfiles').where('ID', e.ID).del());
							});
							return Promise.all(q);
						}
					})
					.then(function() {
						return db('AuthenticationProviderProfiles').insert({
							AuthenticationProviderID: authenticationProviderID,
							ProviderID: providerID,
							UserID: user.UserID,
							Name: req.body.Name,
							OAuthToken: req.body.OAuthToken,
							ProfileImageURI: req.body.ProfileImageURI
						});
					})
					.then(function() {
						if (user.ProfileID) {
							return updateSocialMediaProfile(user.ProfileID, authenticationProviderID, providerID);
						}
					})
					.then(function() {
						AccessToken.refreshUser(req).then(function() {
							res.json({ Message: 'Success' });
						});
					})
					.catch(function(err) {
						logError(err, req, function () {
							res.status(500).json({ Message: 'Unexpected error occurred' });
						});
					});
			}


		})
	})



	// changes a users password
	.put('/auth/password/change/:oldPassword/:newPassword', function (req, res) {
		var oldPassword = req.params.oldPassword,
			newPassword = req.params.newPassword;

		if (!oldPassword) {
			res.status(400).json({ Message: 'Old password cannot be blank' });
		}
		else if (!newPassword) {
			res.status(400).json({ Message: 'New password cannot be blank' });
		}
		else if (oldPassword === newPassword) {
			res.status(400).json({ Message: 'Old and new passwords cannot be identical' });
		}
		else if (newPassword.length < config.password.minLength) {
			res.status(400).json({ Message: 'The new password must be at least ' + config.password.minLength + ' characters long' });
		}
		else {

			AccessToken.getUser(req).then(function (user) {

				// get existing password
				db.first('Password').from('Users').where({ ID: user.UserID })
				.then(function (result) {

					// verify old password matches existing password
					bcrypt.compare(oldPassword, result.Password, function (err, matched) {
						if (!matched) {
							res.status(400).json({ Message: 'Old password does not match the currently stored value' })
						}
						else {

							// update database with new password
							bcrypt.hash(newPassword, null, null, function (err, hash) {
								if (err) {
									res.status(500).json({ Message: 'Error creating password hash' });
								}
								else {
									db('Users').where({ ID: user.UserID })
									.update({ Password: hash, PasswordReset: '', OldPassword: '' })
									.then(function () {
										res.json({ Message: 'Success' });
									})
									.catch(function (err) {
										logError(err, req, function () {
											res.status(500).json({ Message: 'An unexpected error occurred while updating the database' });
										});
									})
								}
							})

						}
					});

				})
				.catch(function (err) {
					logError(err, req, function () {
						res.status(500).json({ Message: 'An unexpected error occurred while accessing the database' });
					});
				})
			});

		}
		
	})



	// burn active tokens
	.get('/auth/logout', Device.identify, function (req, res) {
		var authHeader = req.headers['authorization']
		if(authHeader && authHeader.length > 7){
			token = authHeader.substr(7)
			db('AccessTokens').where({ Token: token }).del().asCallback(function(err){
				if (err) return done(err)
			})
		}
		res.json({ Auth: 'Logged out' })
	})

	//
	// Returns the current user's ID
	//
	.get('/auth/current-user', Device.identify, function(req, res){
		AccessToken.getUser(req).then(function(user) {

			if (!user) {
				res.sendStatus(401);
			}
			else {
				db.select(
					'app.ProviderID',
					'app.Name',
					'app.ProfileImageURI',
					'ap.Name as ProviderName',
					'app.LastChecked',
					'app.Enabled'
					)
					.from('AuthenticationProviderProfiles as app')
					.join('AuthenticationProviders as ap', 'app.AuthenticationProviderID', 'ap.ID')
					.where('app.UserID', user.UserID)
					.then(function(profiles) {

						var auth = {};
						profiles.forEach(function(profile){
							auth[profile.ProviderName] = {
								ProviderID: profile.ProviderID,
								Name: profile.Name,
								ProfileImageURI: profile.ProfileImageURI,
								LastChecked: profile.LastChecked,
								Enabled: profile.Enabled
							}
						});

						res.json({ UserID: user.UserID, ProfileID: user.ProfileID, Auth: auth });
					})
					.catch(function() {
						res.status(500).json({ Message: 'Unexpected error' });
					});
			}


		})
	})


	//.post('/auth/register', function (req, res) {
	//	var email = req.body.Email || ''
	//	var pass = req.body.Password || ''
	//	if(!email || !pass) return res.status(400).json({ Message: 'Email address and password required' })
	//	if(!config.email.pattern.test(email)) return res.status(400).json({ Message: 'Invalid email address' })
	//
	//	// minimal user registration
	//	var verificationCode = uuid.v4().replace(/\-/g, '')
	//	bcrypt.hash(pass, null, null, function(err, hash){
	//		if(err) return res.status(500).json({ Message: 'Error creating password hash' })
	//
	//		return db('Users').insert({ Email: email, Password: hash, EmailVerification: verificationCode, EmailVerified: 0 })
	//		.then(function (result){
	//			console.log(result)
	//			var vUrl = config.email.verify.url + verificationCode
	//			sendMail(email, config.email.verify.subject, config.email.verify.body + vUrl, config.email.noReply)
	//			return res.json({ ID: result[0], Message: 'Success' })
	//		})
	//		.catch(function (err){
	//			// check for existing email
	//			if(err.code && err.code == 'ER_DUP_ENTRY') return res.status(400).json({ 'Message': 'Email already registered' })
	//
	//			if(!res.headersSent) return res.status(500).json({ Message: 'Error creating account' });
	//		})
	//	})
	//})

	// verify email address
	.put('/auth/verify/:verificationCode', function (req, res) {
		var verificationCode = req.params.verificationCode
		return db('Users').where({ EmailVerification: verificationCode }).update({ EmailVerified: 1 })
		.then(function (updated){
			if(!updated) return res.status(404).json({ Message: 'Verification code not found' });
			return res.json({ Message: 'Success' })
		})
		.catch(function (err){
			if(!res.headersSent) return res.status(500).json({ Message: 'Error verifying email' });
		})
	});


	// update plain text passwords
	//.get('/auth/passwordMigrate', function (req, res) {
	//	return db('Users').then(function (data){
	//		for(i = 0; i < data.length; i++){
	//			if(data[i].Password.length < 60){
	//				var hash = bcrypt.hashSync(data[i].Password)
	//				console.log('Updating user #' + data[i].ID + ' ... existing: ' + data[i].Password + ' ... hash: ' + hash)
	//				db('Users').where({ ID: data[i].ID }).update({ Password: hash }).then(function(updated){
	//					console.log('updated: ' + updated)
	//				})
	//			}
	//		}
	//		return res.status(200).json({ Message: "OK" })
	//	})
	//})


module.exports = router;
