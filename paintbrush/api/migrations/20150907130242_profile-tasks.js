
exports.up = function (knex, Promise) {

	//
	// Drop Unused Profile Task Tables
	//

	return knex.schema.hasTable('ProfileTasks')
		.then(function (exists) {
			if (exists) {
				return knex.schema.dropTable('ProfileTasks');
			}
		})
		.then(function () {
			return knex.schema.hasTable('ProfileTasksCompleted');
		})
		.then(function (exists) {
			if (exists) {
				return knex.schema.dropTable('ProfileTasksCompleted');
			}
		})

		//
		// Drop Task Tables (if present)
		//

		.then(function () {
			return knex.schema.hasTable('Tasks');
		})
		.then(function (exists) {
			if (exists) {
				return knex.schema.dropTable('Tasks')
			}
		})
		.then(function () {
			return knex.schema.hasTable('TasksCompleted');
		})
		.then(function (exists) {
			if (exists) {
				return knex.schema.dropTable('TasksCompleted');
			}
		})
		.then(function () {
			return knex.schema.hasTable('TaskGroups');
		})
		.then(function (exists) {
			if (exists) {
				return knex.schema.dropTable('TaskGroups');
			}
		})

		//
		// Create Task Tables
		//

		.then(function () {
			return knex.schema.hasTable('Tasks');
		})
		.then(function (exists) {
			if (!exists) {
				return knex.schema.createTable('Tasks', function (t) {
					t.increments('ID').primary();
					t.integer('TaskGroupID').notNullable();
					t.string('Description', 4000).notNullable();
					t.string('Key', 50).notNullable().unique();
					t.timestamps();
				});
			}
		})
		.then(function () {
			return knex.schema.hasTable('TasksCompleted');
		})
		.then(function (exists) {
			if (!exists) {
				return knex.schema.createTable('TasksCompleted', function (t) {
					t.increments('ID').primary();
					t.integer('ProfileID').notNullable();
					t.integer('TaskID').notNullable();
					t.timestamps();
				});
			}
		})
		.then(function () {
			return knex.schema.hasTable('TaskGroups');
		})
		.then(function (exists) {
			if (!exists) {
				return knex.schema.createTable('TaskGroups', function (t) {
					t.increments('ID').primary();
					t.string('Key', 50).notNullable().unique();
					t.string('Name', 100).notNullable();
					t.string('Description', 4000).notNullable();
					t.boolean('Artist').notNullable().defaultTo(false);
					t.boolean('Gallery').notNullable().defaultTo(false);
					t.boolean('Consumer').notNullable().defaultTo(false);
					t.timestamps();
				});
			}
		})

		//
		//	Fix Timestamp Columns
		//

		.then(function () {
			return knex.raw(
				'ALTER TABLE Tasks CHANGE COLUMN `created_at` created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, ' +
				'CHANGE COLUMN `updated_at` updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE NOW()'
			)
		})
		.then(function () {
			return knex.raw(
				'ALTER TABLE TasksCompleted CHANGE COLUMN `created_at` created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, ' +
				'CHANGE COLUMN `updated_at` updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE NOW()'
			)
		})
		.then(function () {
			return knex.raw(
				'ALTER TABLE TaskGroups CHANGE COLUMN `created_at` created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, ' +
				'CHANGE COLUMN `updated_at` updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE NOW()'
			)
		})

		//
		// Allow notifications to be linked to task groups
		//

		.then(function () {
			return knex.schema.hasColumn('Notifications', 'TaskGroupID')
		})
		.then(function (exists) {
			if (!exists) {
				return knex.schema.table('Notifications', function (t) {
					t.integer('TaskGroupID');
				})
			}
		})

		//
		// Allow registration records to be linked directly to a profile
		//

		.then(function () {
			return knex.schema.hasColumn('Registrations', 'ProfileID')
		})
		.then(function (exists) {
			if (!exists) {
				return knex.schema.table('Registrations', function (t) {
					t.integer('ProfileID');
				})
			}
		})

		//
		// Insert Initial Data
		//

		.then(function () {
			return knex('TaskGroups').insert({ ID: 1, Key: 'complete-profile', Name: 'Complete Profile', Description: 'Please complete your profile', Artist: true });
		})
		.then(function () {
			return knex('Tasks').insert([
				{ TaskGroupID: 1, Key: 'profile-image', Description: 'Upload your profile image' },
				{ TaskGroupID: 1, Key: 'first-artwork', Description: 'Upload your first piece of artwork' },
				{ TaskGroupID: 1, Key: 'artist-details', Description: 'Complete the artist details section of your profile' },
				{ TaskGroupID: 1, Key: 'biography-min', Description: 'Answer at least one question from each section of your biography' }
			]);
		})

};

exports.down = function (knex, Promise) {

	//
	//	Drop Tables
	//

	return knex.schema.hasTable('Tasks')
		.then(function (exists) {
			if (exists) {
				return knex.schema.dropTable('Tasks')
			}
		})
		.then(function () {
			return knex.schema.hasTable('TasksCompleted');
		})
		.then(function (exists) {
			if (exists) {
				return knex.schema.dropTable('TasksCompleted');
			}
		})
		.then(function () {
			return knex.schema.hasTable('TaskGroups');
		})
		.then(function (exists) {
			if (exists) {
				return knex.schema.dropTable('TaskGroups');
			}
		})

		//
		//	Remove TaskGroupID column from Notifications
		//

		.then(function () {
			return knex.schema.hasColumn('Notifications', 'TaskGroupID')
		})
		.then(function (exists) {
			if (exists) {
				return knex.schema.table('Notifications', function (t) {
					t.dropColumn('TaskGroupID');
				})
			}
		})

		//
		//	Remove ProfileID column from Registrations
		//

		.then(function () {
			return knex.schema.hasColumn('Registrations', 'ProfileID')
		})
		.then(function (exists) {
			if (exists) {
				return knex.schema.table('Registrations', function (t) {
					t.dropColumn('ProfileID');
				})
			}
		})

};
