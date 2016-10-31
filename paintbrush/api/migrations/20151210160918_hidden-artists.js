
exports.up = function(knex, Promise) {
	return knex.schema.hasColumn('Artists', 'Private')
		.then(function (exists) {
			if (!exists) {
				return knex.schema.table('Artists', function (t) {
					t.boolean('Private').notNullable().defaultTo(0);
				});
			}
		})
};

exports.down = function(knex, Promise) {
	return knex.schema.hasColumn('Artists', 'Private')
		.then(function (exists) {
			if (exists) {
				return knex.schema.table('Artists', function (t) {
					t.dropColumn('Private');
				});
			}
		})
};
