
exports.up = function(knex, Promise) {

	var materials = ['Acrylic paint', 'Oil paint', 'Etching', 'Appropriation', 'Water colours', 'Gouache', 'Ink', 'Gel', 'Concrete', 'Glass', 'Cosmetics', 'Digital printing', 'Screen printing', '3D printing', 'Analogue film', 'Digital film', 'Acetate', 'Plastic', 'Transfer', 'Pastels', 'Chalk', 'Water', 'Paper', 'Canvas', 'Canvas board', 'Wood', 'Flora/Fauna', 'Perspex', 'Wire', 'Newspaper/print material', 'Found objects', 'Sand and/or soil', 'Plastic', 'Salts', 'Metal', 'Fibre', 'Artificial materials', 'Glue', 'Cardboard', 'Card', 'Fabric', 'Online content', 'Games console/material', 'Airbrush', 'Charcoal', 'Wax', 'Ceramics', 'Clay', 'Pencil', 'Pen', 'Crayon', 'Conté', 'Sound recording', 'Tape', 'Gold leaf', 'Mixed media', 'Bodily fluids', 'Chemicals', 'Video', 'Plaster', 'Glaze'];


	// tidy up duplicate user groups
	return knex.select(knex.raw(
		'u.ID, ' + 
		'(SELECT COUNT(ug.ID) FROM UserGroups as ug WHERE ug.UserID = u.ID and ug.GroupID = 1) AS c ' +
		'FROM Users as u '
	))
	.then(function (users) {
		
		var _users = [], _userGroups = [];
		users.forEach(function(user) {
			if (user.c > 1) {
				_users.push(user.ID);
				_userGroups.push({ UserID: user.ID, GroupID: 1 });
			}
		})

		if (_users.length) {
			return knex('UserGroups')
				.whereIn('UserID', _users).andWhere('GroupID', 1).del()
				.then(function () {
					return knex('UserGroups').insert(_userGroups);
				})
		}

	})

	// create admin users
	//.then(function () {
	//	return knex.select('ID')
	//		.from('Users').whereIn('Email', [
	//			'kris.mckernan@sellerdynamics.com',
	//			'jena@artretailnetwork.com',
	//			'jamie@artretailnetworks.com',
	//			'zach@artretailnetwork.com'
	//		])
	//})
	//.then(function (users) {

	//	if (users) {
	//		var userGroups = [];

	//		users.forEach(function (user) {
	//			userGroups.push({ UserID: user.ID, GroupID: 2 })
	//		})

	//		return knex('UserGroups').insert(userGroups);
	//	}

	//})


};

exports.down = function(knex, Promise) {
  
};
