
exports.up = function(knex, Promise) {

	//
	// Add new artwork fields
	//
	return knex.schema.hasColumn('Artworks', 'Price')
		.then(function (exists) {
			if (!exists) {
				return knex.schema.table('Artworks', function (t) {
					t.float('Price').notNullable().defaultTo(0);
					t.boolean('Shareable').notNullable().defaultTo(1);
				});
			}
		})


		//
		// Create AnalyticEventTypes Table
		//
		.then(function () {
			return knex.schema.hasTable('AnalyticEventTypes')
		})
		.then(function (exists) {
			if (!exists) {
				return knex.schema.createTable('AnalyticEventTypes', function (t) {
					t.increments('ID').primary();
					t.string('Description', 500).notNullable();
					t.boolean('AutoRecorded').notNullable().defaultTo(0);
					t.boolean('ArtworkID').notNullable().defaultTo(0);
					t.boolean('ArtistID').notNullable().defaultTo(0);
					t.boolean('ShortlistID').notNullable().defaultTo(0);
					t.boolean('VideoID').notNullable().defaultTo(0);
					t.timestamps();
				})
				.then(function () {
					return knex.raw(
						'ALTER TABLE AnalyticEventTypes CHANGE COLUMN `created_at` created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, ' +
						'CHANGE COLUMN `updated_at` updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE NOW()'
					)
				});
			}
		})


		//
		// Create AnalyticEvents Table
		//
		.then(function () {
			return knex.schema.hasTable('AnalyticEvents')
		})
		.then(function (exists) {
			if (!exists) {
				return knex.schema.createTable('AnalyticEvents', function (t) {
					t.increments('ID').primary();
					t.integer('UserID').notNullable();
					t.integer('ProfileID').notNullable();
					t.integer('ArtworkID');
					t.integer('ArtistID');
					t.integer('ShortlistID');
					t.integer('VideoID');
					t.timestamps();
				})
				.then(function () {
					return knex.raw(
						'ALTER TABLE AnalyticEvents CHANGE COLUMN `created_at` created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, ' +
						'CHANGE COLUMN `updated_at` updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE NOW()'
					)
				});
			}
		})




		//
		// Insert initial event types
		//
		.then(function () {
			return knex('AnalyticEventTypes').insert([
				{ Description: 'Initialised Scan' },
				{ Description: 'Scanned Artwork', ArtworkID: true },
				{ Description: 'Played Video', ArtworkID: true, VideoID: true },
				{ Description: 'Skipped Video', ArtworkID: true, VideoID: true },
				{ Description: 'Finished Video', ArtworkID: true, VideoID: true },
				{ Description: 'Shared Artwork', ArtworkID: true },
				{ Description: 'Viewed Artwork Information', ArtworkID: true },
				{ Description: 'Viewed Artist Information', ArtistID: true },
				{ Description: 'Dirty Buy', ArtworkID: true },
				{ Description: 'Enquire to Buy', ArtworkID: true },
				{ Description: 'Create Shortlist', AutoRecorded: true, ShortlistID: true },
				{ Description: 'Delete Shortlist', AutoRecorded: true, ShortlistID: true },
				{ Description: 'Viewed Shortlist', AutoRecorded: true, ShortlistID: true },
				{ Description: 'Viewed Shortlists', AutoRecorded: true },
				{ Description: 'Add Artwork to Shortlist', AutoRecorded: true, ShortlistID: true, ArtworkID: true },
				{ Description: 'Remove Artwork from Shortlist', AutoRecorded: true, ShortlistID: true, ArtworkID: true }
			])
		})




};

exports.down = function(knex, Promise) {

	//
	// Drop AnalyticEventTypes Table
	//
	return knex.schema.hasTable('AnalyticEventTypes')
		.then(function (exists) {
			if (exists) {
				return knex.schema.dropTable('AnalyticEventTypes');
			}
		})


		//
		// Drop AnalyticEvents Table
		//
		.then(function () {
			return knex.schema.hasTable('AnalyticEvents')
		})
		.then(function (exists) {
			if (exists) {
				return knex.schema.dropTable('AnalyticEvents');
			}
		})

};
