var Promise = require('bluebird'),
	AccessToken = require('../../auth/access-token'),
	Permission = require('../lib/permission'),
	is = require('../lib/validate').is,
	service = require('.../services/user');


module.exports = {

	list: {

		groups: function (req) {
			return new Promise(function (resolve) {
				var userID = req.params.userID;

				if (!userID) {
					resolve({ status: 400, body: { Message: 'Please specify a user ID' } });
				}
				else if (!is.int(userID, 1)) {
					resolve({ status: 400, body: { Message: 'User ID must be an integer greater than 0' } });
				}
				else {
					AccessToken.getUser(req).then(function (user) {

						Permission.User.check('groups.view', user.UserID, userID).then(function (allowed) {
							if (!allowed) {
								resolve({
									status: 403,
									body: { Message: 'You do not have permission to view this data' }
								});
							}
							else {
								service.list.groups(userID)
									.then(function(data) {
										resolve({ status: 200, body: data });
									})
									.catch(function (err) {
										processError(err, req, resolve, 'Error occurred while fetching user groups');
									});
							}
						})
					})
				}
			})
		}


	}
	
};
