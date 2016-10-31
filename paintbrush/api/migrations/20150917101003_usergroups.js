
exports.up = function(knex, Promise) {
  

	//
	// Add registered user role to all users missing the role
	//

	return knex.select('u.ID').distinct()
		.from('Users as u')
		.leftJoin(knex.raw('UserGroups as ug on u.ID = ug.UserID and ug.GroupID = 1'))
		.where({ 'ug.ID': null })
		.then(function (users) {
			var userGroups = [];
			users.forEach(function (u) { userGroups.push({ UserID: u.ID, GroupID: 1 }) });

			if (userGroups.length) {
				return knex('UserGroups').insert(userGroups);
			}
		})


};

exports.down = function(knex, Promise) {
  
};
