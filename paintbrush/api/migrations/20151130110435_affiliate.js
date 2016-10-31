
exports.up = function(knex, Promise) {

	return knex.schema.hasColumn('AffiliateCodes', 'UsesRemaining')
		.then(function (exists) {
			if (!exists) {
				return knex.schema.table('AffiliateCodes', function (t) {
					t.integer('UsesRemaining');
				});
			}
		})

};

exports.down = function(knex, Promise) {

	return knex.schema.hasColumn('AffiliateCodes', 'UsesRemaining')
		.then(function (exists) {
			if (exists) {
				return knex.schema.table('AffiliateCodes', function (t) {
					t.dropColumn('UsesRemaining');
				});
			}
		})

};
