
exports.up = function(knex, Promise) {
	return knex.schema.hasColumn('Users', 'RegistrationID')
		.then(function (_exists) {
			if (!_exists) {
				return knex.schema.table('Users', function (_table) {
					_table.integer('RegistrationID');
				})
			}
		});
};

exports.down = function(knex, Promise) {
  
};
