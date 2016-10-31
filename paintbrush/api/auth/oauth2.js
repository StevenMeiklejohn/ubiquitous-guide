var config = require('../config'),
	oauth2orize = require('oauth2orize'),
	passport = require('passport'),
	crypto = require('crypto'),
	uuid = require('node-uuid'),
	bcrypt = require('bcrypt-nodejs'),
 	AccessToken = require('./access-token');


var server = oauth2orize.createServer();


server.exchange(oauth2orize.exchange.password(function(client, username, password, scope, done) {
	var user, tokenValue, refreshTokenValue;
	var oldPassword, passwordResetToken, passwordResetRequired = false;

    return db.first('*').from('Users').where({ Email: username, Authorised: 1, Deleted: 0 })
    .then(function (result) {
    	if (result) {
    		bcrypt.compare(password, result.Password, function (err, matched) {
    			if (matched) user = result
    		})
    	}
    })
    .then(function(){
    	if (!user) {

            // check old password for migrated accounts
            oldPassword = crypto.createHash('md5').update(password).digest('hex')
            return db.first('*').from('Users').where({ Email: username, OldPassword: oldPassword, Authorised: 1, Deleted: 0 })
        }
    })
    .then(function(result){
    	if (result) {
    		passwordResetRequired = true;
    		user = result;
    	}

        // no account found for current / old credentials
        if(!user) throw('Bad Credentials')
    })
    .then(function(){
		return AccessToken.create(user.ID);
    })
    .then(function(token){
		tokenValue = token.access_token;
		refreshTokenValue = token.refresh_token;
    })
    .then(function(){
		if (passwordResetRequired) {
			passwordResetToken = (uuid.v4() + uuid.v4()).replace(/\-/g, '')
			return db('Users').where({ 'ID': user.ID }).update({ PasswordReset: passwordResetToken });
		}
	})
	.then(function() {
		// pass back the users profile id along with the token
		return db
			.first('a.ProfileID as ArtistProfileID', 'g.ProfileID as GalleryProfileID', 'c.ProfileID as ConsumerProfileID', 'u.RegistrationID')
			.from('Users as u')
			.leftJoin('Artists as a', 'a.UserID', 'u.ID')
			.leftJoin('GalleryUsers as gu', 'gu.UserID', 'u.ID')
			.leftJoin('Galleries as g', 'gu.GalleryID', 'g.ID')
			.leftJoin('Consumers as c', 'c.UserID', 'u.ID')
			.where('u.ID', user.ID)
	})
	.then(function(data){
		// cache ProfileID associated with this access token
		var _id = data.ArtistProfileID || data.GalleryProfileID || data.ConsumerProfileID;

		// return access/refresh tokens to client
		return done(null, tokenValue, refreshTokenValue, {
			expires_in: config.auth.timeout,
			reset_token: passwordResetToken,
			RegistrationID: data.RegistrationID,
			ProfileID: _id
		})
    })
    .catch(function(err){
        return err === 'Bad Credentials' ? done(null, false) : done(err)
    })
}));


server.exchange(oauth2orize.exchange.refreshToken(function(client, refreshToken, scope, done) {
    db.first('ID', 'UserID').from('RefreshTokens').where({ Token: refreshToken }).andWhere(function() {
			this.where('Used', '<', new Date(new Date().setSeconds(new Date().getSeconds() - 30))).orWhereNull('Used');
		})
		.then(function(_token) {
			if (!_token){
				done(null, false);
			}
			else {
				return db('RefreshTokens').where({ ID: _token.ID }).update({ Used: new Date() })
					.then(function() {
						return db.first('ID').from('Users').where({ ID: _token.UserID })
							.then(function(user){
								if (!user) {
									done(null, false);
								}
								else {
									return AccessToken.create(user.ID)
										.then(function(token){
											done(null, token.access_token, token.refresh_token, { 'expires_in': config.auth.timeout })
										});
								}
							})
				})

			}
		})
		.catch(function(err) {
			done(err);
		});

}));


exports.token = [
    passport.authenticate(['oauth2-client-password'], { session: false }),
    server.token(),
    server.errorHandler()
];
