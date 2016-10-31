
exports.up = function(knex, Promise) {

	//
	// Create Device Types Table
	//
	return knex.schema.hasTable('DeviceTypes')
		.then(function (exists) {
			if (!exists) {
				return knex.schema.createTable('DeviceTypes', function (t) {
					t.increments('ID').primary();
					t.string('Type', 50).unique().notNullable();
					t.timestamps();
				})
				.then(function () {
					return knex.raw(
						'ALTER TABLE DeviceTypes CHANGE COLUMN `created_at` created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, ' +
						'CHANGE COLUMN `updated_at` updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE NOW()'
					)
				});
			}
		})


		//
		// Insert default device types
		//
		.then(function() {
			return knex('DeviceTypes').insert([{ Type: 'Computer' }, { Type: 'Mobile' },{ Type: 'Tablet' }, { Type: 'TV' }]);
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


		//
		// Create Device Browsers Table
		//
		.then(function() {
			return knex.schema.hasTable('DeviceBrowsers')
		})
		.then(function (exists) {
			if (!exists) {
				return knex.schema.createTable('DeviceBrowsers', function (t) {
					t.increments('ID').primary();
					t.integer('DeviceID').notNullable();
					t.string('Name', 50).notNullable();
					t.string('Version', 50).notNullable();
					t.timestamps();
				})
				.then(function () {
					return knex.raw(
						'ALTER TABLE DeviceBrowsers CHANGE COLUMN `created_at` created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, ' +
						'CHANGE COLUMN `updated_at` updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE NOW()'
					)
				});
			}
		})


		//
		// Create Device History Table
		//
		.then(function() {
			return knex.schema.hasTable('DeviceHistory')
		})
		.then(function (exists) {
			if (!exists) {
				return knex.schema.createTable('DeviceHistory', function (t) {
					t.increments('ID').primary();
					t.integer('DeviceID').notNullable();
					t.integer('DeviceBrowserID');
					t.datetime('LoginDate');
					t.string('Location', 50);
					t.string('Country', 50);
					t.string('IPv4', 15);
					t.string('IPv6', 45);
					t.timestamps();
				})
				.then(function () {
					return knex.raw(
						'ALTER TABLE DeviceHistory CHANGE COLUMN `created_at` created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, ' +
						'CHANGE COLUMN `updated_at` updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE NOW()'
					)
				});
			}
		})

};

exports.down = function(knex, Promise) {

	//
	// Remove Device Types Table
	//
	return knex.schema.hasTable('DeviceTypes')
		.then(function (exists) {
			if (exists) {
				return knex.schema.dropTable('DeviceTypes');
			}
		})


		//
		// Remove Device History Table
		//
		.then(function () {
			return knex.schema.hasTable('DeviceHistory');
		})
		.then(function (exists) {
			if (exists) {
				return knex.schema.dropTable('DeviceHistory');
			}
		})


		//
		// Remove Device Browsers Table
		//
		.then(function () {
			return knex.schema.hasTable('DeviceBrowsers');
		})
		.then(function (exists) {
			if (exists) {
				return knex.schema.dropTable('DeviceBrowsers');
			}
		})


};
