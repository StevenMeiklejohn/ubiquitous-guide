
exports.up = function(knex, Promise) {

	return knex.schema.hasColumn('Devices', 'AppVersion')
		.then(function (exists) {
			if (exists) {
				return knex.schema.table('Devices', function (t) {
					t.renameColumn('AppVersion', 'OSVersion');
				});
			}
		})


		//
		// Update Devices Table
		//
		.then(function() {
			return knex.schema.hasColumn('Devices', 'Type')
		})
		.then(function (exists) {
			if (exists) {
				return knex.schema.table('Devices', function (t) {
					t.dropColumn('Type');
					t.integer('TypeID').notNullable();
				});
			}
		})

};

exports.down = function(knex, Promise) {

	return knex.schema.hasColumn('Devices', 'OSVersion')
		.then(function (exists) {
			if (exists) {
				return knex.schema.table('Devices', function (t) {
					t.renameColumn('OSVersion', 'AppVersion');
				});
			}
		})

};
