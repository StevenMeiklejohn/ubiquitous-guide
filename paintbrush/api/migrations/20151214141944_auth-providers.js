
exports.up = function(knex, Promise) {

	//
	// Create AuthenticationProviders Table
	//
	return knex.schema.hasTable('AuthenticationProviders')
		.then(function (exists) {
			if (!exists) {
				return knex.schema.createTable('AuthenticationProviders', function (t) {
						t.increments('ID').primary();
						t.string('Name', 50).notNullable().unique();
						t.timestamps();
					})
					.then(function () {
						return knex.raw(
							'ALTER TABLE AuthenticationProviders CHANGE COLUMN `created_at` created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, ' +
							'CHANGE COLUMN `updated_at` updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE NOW()'
						)
					});
			}
		})


		//
		// Create AuthenticationProviderProfiles Table
		//
		.then(function () {
			return knex.schema.hasTable('AuthenticationProviderProfiles')
		})
		.then(function (exists) {
			if (!exists) {
				return knex.schema.createTable('AuthenticationProviderProfiles', function (t) {
					t.increments('ID').primary();
					t.integer('AuthenticationProviderID').notNullable();
					t.integer('UserID').notNullable();
					t.string('ProviderID', 250).notNullable().unique();
					t.string('OAuthToken', 250);
					t.string('Name', 150);
					t.string('ProfileImageURI', 250);
					t.boolean('Enabled').notNullable().defaultTo(1);
					t.datetime('LastChecked');
					t.timestamps();
				})
				.then(function () {
					return knex.raw(
						'ALTER TABLE AuthenticationProviderProfiles CHANGE COLUMN `created_at` created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, ' +
						'CHANGE COLUMN `updated_at` updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE NOW(), ' +
						'CHANGE COLUMN `LastChecked` LastChecked DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, ' +
						'ADD UNIQUE INDEX `IX_UNI_AuthenticationProviderProfiles` (`UserID` ASC, `AuthenticationProviderID` ASC);'
					)
				});
			}
		})

			//
			// Insert initial providers
			//
			.then(function() {
				return knex('AuthenticationProviders').insert([{ Name: 'Facebook'}, { Name: 'Google' }]);
			})



};

exports.down = function(knex, Promise) {


	//
	// Drop AuthenticationProviders Table
	//
	return knex.schema.hasTable('AuthenticationProviders')
		.then(function (exists) {
			if (exists) {
				return knex.schema.dropTable('AuthenticationProviders');
			}
		})


		//
		// Drop AuthenticationProviderProfiles Table
		//
		.then(function () {
			return knex.schema.hasTable('AuthenticationProviderProfiles')
		})
		.then(function (exists) {
			if (exists) {
				return knex.schema.dropTable('AuthenticationProviderProfiles');
			}
		})
};
