
exports.up = function(knex, Promise) {

	return knex.schema.hasColumn('Users', 'FacebookID')
		.then(function (exists) {
			if (!exists) {
				return knex.schema.table('Users', function (t) {
					t.string('FacebookID', 25).unique();
				});
			}
		})

};

exports.down = function(knex, Promise) {

	return knex.schema.hasColumn('Users', 'FacebookID')
		  .then(function (exists) {
		  		if (exists) {
		  			return knex.schema.table('Users', function (t) {
		  				t.dropColumn('FacebookID');
		  			});
		  		}
		  })

};
