
exports.up = function(knex, Promise) {

	return knex.schema.hasColumn('Devices', 'OneSignalUserID')
		.then(function (exists) {
			if (!exists) {
				return knex.schema.table('Devices', function (t) {
					t.string('OneSignalUserID', 36);
				});
			}
		});

};
exports.down = function(knex, Promise) {

	return knex.schema.hasColumn('Devices', 'OneSignalUserID')
		.then(function (exists) {
			if (exists) {
				return knex.schema.table('Devices', function (t) {
					t.dropColumn('OneSignalUserID');
				});
			}
		});
};