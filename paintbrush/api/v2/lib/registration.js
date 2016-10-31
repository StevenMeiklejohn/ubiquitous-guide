var Promise = require('bluebird'),
	bcrypt = require('bcrypt-nodejs');



var Registration = {

	//
	// Creates a new consumer account
	//
	createConsumer: function(opts) {
		return new Promise(function (resolve, reject) {

			Registration.createUser(opts)
				.then(function (user) {

					var name = opts.Name || '';

					return db('Profiles').insert({
							Name: name,
							ImageURI: opts.ImageURI || ''
						})
						.then(function (profile) {
							return db('Consumers').insert({
									UserID: user.UserID,
									ProfileID: profile[0]
								})
								.then(function () {
									return db('Users').where({ ID: user.UserID }).update({ RegistrationID: null });
								})
								.then(function () {
									if (!name) {
										return db('Profiles').where({ ID: profile[0] }).update({ Name: 'Guest Account (' + profile[0] + ')' });
									}
								})
								.then(function () {
									resolve({ UserID: user.UserID, ProfileID: profile[0] });
								});
						})

				})
				.catch(reject)

		});
	},


	//
	// Creates a new user account
	//
	createUser: function (opts) {
		return new Promise(function (resolve, reject) {

			if (!opts.Email || !opts.Password) {
				reject({ Status: 400, Message: 'Email address and password required' });
			}
			else {
				bcrypt.hash(opts.Password, null, null, function (err, hash) {
					if (err) {
						reject({ Status: 500, Message: 'Error creating password hash' });
					}
					else {

						// quick check to see if email has already registered
						db.first('*')
							.from('Users')
							.where('Email', opts.Email)
							.then(function (user) {
								if (user) {
									reject({ Status: 400, Message: 'An account with the same email address already exists' });
								}
								else {
									// create a new registration record to track progress
									return db('Registrations')
										.insert({ AffiliateCodeID: opts.AffiliateCodeID })
										.then(function (result) {

											// create the new user account
											return db('Users')
												.insert({
													Email: opts.Email,
													Password: hash,
													RegistrationID: result[0]
												})
												.then(function (user) {
													// add registered users role to user
													return db('UserGroups').insert({ UserID: user[0], GroupID: 1 })
														.then(function () {

															// create 3rd party auth provider profiles
															var authProfiles = opts.AuthenticationProviderProfiles;
															if (authProfiles) {
																authProfiles.forEach(function(p){
																	p.UserID = user[0];
																});
																return db('AuthenticationProviderProfiles').insert(authProfiles);
															}
														})
														.then(function () {
															resolve({
																UserID: user[0],
																RegistrationID: result[0],
																Message: 'Success'
															})
														})
												})


										})

								}
							})
							.catch(reject)

					}

				})

			}



		});
	}


};


module.exports = Registration;