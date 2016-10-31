
exports.up = function(knex) {

	//
	// Create Devices Table
	//
	return knex.schema.hasTable('Devices')
		.then(function (exists) {
			if (!exists) {
				return knex.schema.createTable('Devices', function (t) {
					t.increments('ID').primary();
					t.integer('UserID').notNullable();
					t.string('Type', 50);
					t.string('OS', 50);
					t.string('Model', 50);
					t.string('AppVersion', 50);
					t.string('Locale', 50);
					t.string('TimeZone', 50);
					t.boolean('Enabled').notNullable().defaultTo(1);
					t.string('DeviceModel', 50);
					t.string('PushToken', 50);
					t.timestamps();
				})
				.then(function () {
					return knex.raw(
						'ALTER TABLE Devices CHANGE COLUMN `created_at` created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, ' +
						'CHANGE COLUMN `updated_at` updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE NOW()'
					)
				});
			}
		})


		//
		// Add GoogleID column to user table to enabled Google OAuth logins
		//
		.then(function() {
			return knex.schema.hasColumn('Users', 'GoogleID')
		})
		.then(function (exists) {
			if (!exists) {
				return knex.schema.table('Users', function (t) {
					t.string('GoogleID', 25).unique();
				});
			}
		})

};

exports.down = function(knex) {

	//
	// Remove Devices Table
	//
	return knex.schema.dropTableIfExists('Devices')

		//
		// Remove GoogleID column
		//
		.then(function() {
			return knex.schema.hasColumn('Users', 'GoogleID')
		})
		.then(function (exists) {
			if (exists) {
				return knex.schema.table('Users', function (t) {
					t.dropColumn('GoogleID');
				});
			}
		})

};
