
exports.up = function(knex, Promise) {

	return knex.schema.hasColumn('DeviceBrowsers', 'Enabled')
		.then(function (exists) {
			 if (!exists) {
				 return knex.schema.table('DeviceBrowsers', function (t) {
					 t.boolean('Enabled').notNullable().defaultTo(1);
				 });
			 }
		})
		.then(function () {
			return knex.schema.hasColumn('DeviceHistory', 'LastAccess')
		})
		.then(function (exists) {
			if (!exists) {
				return knex.schema.table('DeviceHistory', function (t) {
					t.datetime('LastAccess');
				});
			}
		})

};

exports.down = function(knex, Promise) {

	return knex.schema.hasColumn('DeviceBrowsers', 'Enabled')
		.then(function (exists) {
			 if (exists) {
				 return knex.schema.table('DeviceBrowsers', function (t) {
					 t.dropColumn('Enabled');
				 });
			 }
		})
		.then(function () {
			return knex.schema.hasColumn('DeviceHistory', 'LastAccess')
		})
		.then(function (exists) {
			if (exists) {
				return knex.schema.table('DeviceHistory', function (t) {
					t.dropColumn('LastAccess');
				});
			}
		})

};
