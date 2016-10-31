
exports.up = function(knex, Promise) {

	//
	// Create UserPreferences Table
	//
	return knex.schema.hasTable('UserPreferences')
		.then(function (exists) {
			if (!exists) {
				return knex.schema.createTable('UserPreferences', function (t) {
					t.increments('ID').primary();
					t.string('Category', 50).notNullable();
					t.string('Key', 100).notNullable();
					t.string('DataType', 10).notNullable().defaultTo('string');
					t.string('DefaultValue', 500).notNullable();
					t.boolean('Deleted').notNullable().defaultTo(false);
					t.timestamps();
				})
				.then(function () {
					return knex.raw(
						'ALTER TABLE UserPreferences CHANGE COLUMN `created_at` created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, ' +
						'CHANGE COLUMN `updated_at` updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE NOW()'
					)
				});
			}
		})


		//
		// Create UserPreferenceValues Table
		//
		.then(function () {
			return knex.schema.hasTable('UserPreferenceValues')
		})
		.then(function (exists) {
			if (!exists) {
				return knex.schema.createTable('UserPreferenceValues', function (t) {
					t.increments('ID').primary();
					t.integer('UserID').notNullable();
					t.integer('UserPreferenceID').notNullable();
					t.string('Value', 500).notNullable();
					t.timestamps();
				})
				.then(function () {
					return knex.raw(
						'ALTER TABLE UserPreferenceValues CHANGE COLUMN `created_at` created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, ' +
						'CHANGE COLUMN `updated_at` updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE NOW()'
					)
				});
			}
		})



		//
		// Insert default notification preferences
		//
		.then(function () {
			return knex('UserPreferences').insert([
				{ Category: 'notification', Key: 'desktop.enabled', DataType: 'boolean', DefaultValue: 'true' },
				{ Category: 'notification', Key: 'desktop.sound', DataType: 'boolean', DefaultValue: 'false' },
				{ Category: 'notification', Key: 'desktop.showAdvanced', DataType: 'boolean', DefaultValue: 'false' },
				{ Category: 'notification', Key: 'desktop.task.enabled', DataType: 'boolean', DefaultValue: 'true' },
				{ Category: 'notification', Key: 'desktop.task.threshold', DataType: 'integer', DefaultValue: '1' },
				{ Category: 'notification', Key: 'desktop.information.enabled', DataType: 'boolean', DefaultValue: 'true' },
				{ Category: 'notification', Key: 'desktop.information.threshold', DataType: 'integer', DefaultValue: '1' },
				{ Category: 'notification', Key: 'desktop.message.enabled', DataType: 'boolean', DefaultValue: 'true' },
				{ Category: 'notification', Key: 'desktop.message.threshold', DataType: 'integer', DefaultValue: '1' },
				{ Category: 'notification', Key: 'desktop.connection.enabled', DataType: 'boolean', DefaultValue: 'true' },
				{ Category: 'notification', Key: 'desktop.connection.threshold', DataType: 'integer', DefaultValue: '1' },
				{ Category: 'notification', Key: 'desktop.activcanvas.enabled', DataType: 'boolean', DefaultValue: 'true' },
				{ Category: 'notification', Key: 'desktop.activcanvas.threshold', DataType: 'integer', DefaultValue: '1' },
				{ Category: 'notification', Key: 'email.enabled', DataType: 'boolean', DefaultValue: 'true' },
				{ Category: 'notification', Key: 'email.address', DataType: 'string', DefaultValue: '' },
				{ Category: 'notification', Key: 'email.showAdvanced', DataType: 'boolean', DefaultValue: 'false' },
				{ Category: 'notification', Key: 'email.task.enabled', DataType: 'boolean', DefaultValue: 'true' },
				{ Category: 'notification', Key: 'email.task.threshold', DataType: 'integer', DefaultValue: '1' },
				{ Category: 'notification', Key: 'email.information.enabled', DataType: 'boolean', DefaultValue: 'true' },
				{ Category: 'notification', Key: 'email.information.threshold', DataType: 'integer', DefaultValue: '1' },
				{ Category: 'notification', Key: 'email.message.enabled', DataType: 'boolean', DefaultValue: 'true' },
				{ Category: 'notification', Key: 'email.message.threshold', DataType: 'integer', DefaultValue: '1' },
				{ Category: 'notification', Key: 'email.connection.enabled', DataType: 'boolean', DefaultValue: 'true' },
				{ Category: 'notification', Key: 'email.connection.threshold', DataType: 'integer', DefaultValue: '1' },
				{ Category: 'notification', Key: 'email.activcanvas.enabled', DataType: 'boolean', DefaultValue: 'true' },
				{ Category: 'notification', Key: 'email.activcanvas.threshold', DataType: 'integer', DefaultValue: '1' }
			])
		})

};

exports.down = function(knex, Promise) {

	//
	// Drop UserPreferences Table
	//
	return knex.schema.hasTable('UserPreferences')
		.then(function (exists) {
			if (exists) {
				return knex.schema.dropTable('UserPreferences');
			}
		})


		//
		// Drop UserPreferenceValues Table
		//
		.then(function () {
			return knex.schema.hasTable('UserPreferenceValues')
		})
		.then(function (exists) {
			if (exists) {
				return knex.schema.dropTable('UserPreferenceValues');
			}
		})


};
