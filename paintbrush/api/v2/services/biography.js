var Promise = require('bluebird'),
	AccessToken = require('../../auth/access-token');



module.exports = {

	get: function (profileID) {
		return new Promise(function (resolve, reject) {
			db.first('Description').from('Biographies')
				.where('ProfileID', profileID)
				.then(resolve)
				.catch(reject);
		})
	},


	update: function (profileID, description) {
		return new Promise(function (resolve, reject) {
			var isNew = false;

			db.first('ID')
				.from('Biographies')
				.where('ProfileID', profileID)
				.then(function (biography) {
					isNew = !biography;

					if (isNew) {
						return db('Biographies').insert({
							ProfileID: profileID,
							Description: description
						})
					}
					else {
						return db('Biographies').where('ID', biography.ID).update({	Description: description })
					}
				})
				.then(function() {
					resolve(isNew);
				})
				.catch(reject);
		})
	}
};