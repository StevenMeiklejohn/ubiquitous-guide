
exports.up = function(knex, Promise) {


	//
	// Set 'Price' for existing artworks - user upper bound of price band
	//
	return knex('Artworks').update({ Price: 100 }).where('PricebandID', 1)
		.then(function () {
			return knex('Artworks').update({ Price: 500 }).where('PricebandID', 2);
		})
		.then(function () {
			return knex('Artworks').update({ Price: 1000 }).where('PricebandID', 3);
		})
		.then(function () {
			return knex('Artworks').update({ Price: 3000 }).where('PricebandID', 4);
		})
		.then(function () {
			return knex('Artworks').update({ Price: 5000 }).where('PricebandID', 5);
		})
		.then(function () {
			return knex('Artworks').update({ Price: 10000 }).where('PricebandID', 6);
		})


		//
		// Add Purchasable flag to Artworks table
		//
		.then(function () {
			return knex.schema.hasColumn('Artworks', 'Purchasable');
		})
		.then(function (exists) {
			if (!exists) {
				return knex.schema.table('Artworks', function (t) {
					t.boolean('Purchasable').notNullable().defaultTo(1);
				})
			}
		})


		//
		// Set default artwork status to 'currently available'
		//
		.then(function () {
			return knex.raw('ALTER TABLE Artworks CHANGE COLUMN StatusID StatusID INT(11) NOT NULL DEFAULT 1;');
		})


		//
		// Create ArtistAwardTypes table
		//
		.then(function () {
			return knex.schema.hasTable('ArtistAwardTypes')
		})
		.then(function (exists) {
			if (!exists) {
				return knex.schema.createTable('ArtistAwardTypes', function (t) {
						t.increments('ID').primary();
						t.string('Name', 100).notNullable();
						t.boolean('Verified').notNullable().defaultTo(0);
						t.timestamps();
					})
					.then(function () {
						return knex.raw(
							'ALTER TABLE ArtistAwardTypes CHANGE COLUMN `created_at` created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, ' +
							'CHANGE COLUMN `updated_at` updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE NOW()'
						)
					});
			}
		})



		//
		// Create ArtistAwards table
		//
		.then(function () {
			return knex.schema.hasTable('ArtistAwards')
		})
		.then(function (exists) {
			if (!exists) {
				return knex.schema.createTable('ArtistAwards', function (t) {
						t.increments('ID').primary();
						t.integer('ArtistID').notNullable();
						t.integer('ArtistAwardTypeID').notNullable();
						t.timestamps();
					})
					.then(function () {
						return knex.raw(
							'ALTER TABLE ArtistAwards CHANGE COLUMN `created_at` created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, ' +
							'CHANGE COLUMN `updated_at` updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE NOW()'
						)
					});
			}
		})



		//
		// Create ArtistQualificationTypes table
		//
		.then(function () {
			return knex.schema.hasTable('ArtistQualificationTypes')
		})
		.then(function (exists) {
			if (!exists) {
				return knex.schema.createTable('ArtistQualificationTypes', function (t) {
						t.increments('ID').primary();
						t.string('Name', 100).notNullable();
						t.boolean('Verified').notNullable().defaultTo(0);
						t.timestamps();
					})
					.then(function () {
						return knex.raw(
							'ALTER TABLE ArtistQualificationTypes CHANGE COLUMN `created_at` created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, ' +
							'CHANGE COLUMN `updated_at` updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE NOW()'
						)
					});
			}
		})



		//
		// Create ArtistQualifications table
		//
		.then(function () {
			return knex.schema.hasTable('ArtistQualifications')
		})
		.then(function (exists) {
			if (!exists) {
				return knex.schema.createTable('ArtistQualifications', function (t) {
						t.increments('ID').primary();
						t.integer('ArtistID').notNullable();
						t.integer('ArtistQualificationTypeID').notNullable();
						t.timestamps();
					})
					.then(function () {
						return knex.raw(
							'ALTER TABLE ArtistQualifications CHANGE COLUMN `created_at` created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, ' +
							'CHANGE COLUMN `updated_at` updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE NOW()'
						)
					});
			}
		})


		//
		// Drop unused SocialMedia tables
		//
		.then(function () {
			return knex.schema.hasTable('SocialMedia')
		})
		.then(function (exists) {
			if (exists) {
				return knex.schema.dropTable('SocialMedia');
			}
		})
		.then(function () {
			return knex.schema.hasTable('ProfileSocialMedia')
		})
		.then(function (exists) {
			if (exists) {
				return knex.schema.dropTable('ProfileSocialMedia');
			}
		})


		//
		// Create SocialMediaServices table
		//
		.then(function () {
			return knex.schema.hasTable('SocialMediaServices')
		})
		.then(function (exists) {
			if (!exists) {
				return knex.schema.createTable('SocialMediaServices', function (t) {
						t.increments('ID').primary();
						t.integer('AuthenticationProviderID');
						t.string('Name').notNullable();
						t.string('URL').notNullable();
						t.string('ImageURI').notNullable();
						t.timestamps();
					})
					.then(function () {
						return knex.raw(
							'ALTER TABLE SocialMediaServices CHANGE COLUMN `created_at` created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, ' +
							'CHANGE COLUMN `updated_at` updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE NOW()'
						)
					})
					.then(function () {
						return knex('SocialMediaServices').insert([
							{ Name: 'Facebook', URL: 'https://www.facebook.com', ImageURI: '/img/auth/facebook-128.png', AuthenticationProviderID: 1 },
							{ Name: 'Google+', URL: 'https://plus.google.com', ImageURI: '/img/auth/google-128.png', AuthenticationProviderID: 2  },
							{ Name: 'Twitter', URL: 'https://twitter.com', ImageURI: '/img/auth/twitter-128.png'  }
						])
					})
			}
		})


		//
		// Create SocialMediaProfiles table
		//
		.then(function () {
			return knex.schema.hasTable('SocialMediaProfiles')
		})
		.then(function (exists) {
			if (!exists) {
				return knex.schema.createTable('SocialMediaProfiles', function (t) {
						t.increments('ID').primary();
						t.integer('ProfileID').notNullable();
						t.integer('ServiceID').notNullable();
						t.string('URL').notNullable();
						t.timestamps();
					})
					.then(function () {
						return knex.raw(
							'ALTER TABLE SocialMediaProfiles CHANGE COLUMN `created_at` created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, ' +
							'CHANGE COLUMN `updated_at` updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE NOW()'
						)
					});
			}
		})




};

exports.down = function(knex, Promise) {

	//
	// Drop ArtistAwardTypes table
	//
	return knex.schema.hasTable('ArtistAwardTypes')
		.then(function (exists) {
			if (exists) {
				return knex.schema.dropTable('ArtistAwardTypes');
			}
		})


		//
		// Drop ArtistAwards table
		//
		.then(function () {
			return knex.schema.hasTable('ArtistAwards')
		})
		.then(function (exists) {
			if (exists) {
				return knex.schema.dropTable('ArtistAwards');
			}
		})



		//
		// Drop ArtistQualificationTypes table
		//
		.then(function () {
			return knex.schema.hasTable('ArtistQualificationTypes')
		})
		.then(function (exists) {
			if (exists) {
				return knex.schema.dropTable('ArtistQualificationTypes');
			}
		})



		//
		// Drop ArtistQualifications table
		//
		.then(function () {
			return knex.schema.hasTable('ArtistQualifications')
		})
		.then(function (exists) {
			if (exists) {
				return knex.schema.dropTable('ArtistQualifications');
			}
		})


		//
		// Drop SocialMediaServices table
		//
		.then(function () {
			return knex.schema.hasTable('SocialMediaServices')
		})
		.then(function (exists) {
			if (exists) {
				return knex.schema.dropTable('SocialMediaServices');
			}
		})


		//
		// Drop SocialMediaProfiles table
		//
		.then(function () {
			return knex.schema.hasTable('SocialMediaProfiles')
		})
		.then(function (exists) {
			if (exists) {
				return knex.schema.dropTable('SocialMediaProfiles');
			}
		})

};
