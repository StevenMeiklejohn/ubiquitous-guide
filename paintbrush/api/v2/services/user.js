var Promise = require('bluebird');

module.exports = {

	list: {

		groups: function (userID) {
			return new Promise(function (resolve, reject) {
				db.select('g.ID', 'g.Name')
					.from('UserGroups as ug')
					.join('Groups as g', 'ug.GroupID', 'g.ID')
					.where('ug.UserID', userID)
					.then(resolve)
					.catch(reject);
			})
		}

	}
};
