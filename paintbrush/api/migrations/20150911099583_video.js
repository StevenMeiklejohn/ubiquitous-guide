
exports.up = function(knex, Promise) {

	//
	// Create Video Tables
	//

	return knex.schema.hasTable('VideoTranscodeTypes')
		.then(function (exists) {
			if (!exists) {
				return knex.schema.createTable('VideoTranscodeTypes', function (t) {
					t.increments('ID').primary();
					t.string('Type', 20).notNullable().unique();
					t.timestamps();
				});
			}
		})
		.then(function () {
			return knex.schema.hasTable('VideoTranscodes');
		})
		.then(function (exists) {
			if (!exists) {
				return knex.schema.createTable('VideoTranscodes', function (t) {
					t.increments('ID').primary();
					t.integer('VideoID').notNullable();
					t.integer('TypeID').notNullable();
					t.string('VideoURI', 500).notNullable();
					t.integer('Width').notNullable().defaultTo(0);
					t.integer('Height').notNullable().defaultTo(0);
					t.timestamps();
				});
			}
		})
		.then(function () {
			return knex.schema.hasTable('ArtworkVideos');
		})
		.then(function (exists) {
			if (exists) {
				return knex.schema.dropTable('ArtworkVideos');
			}
		})
		.then(function () {
			return knex.schema.createTable('ArtworkVideos', function (t) {
				t.increments('ID').primary();
				t.integer('ArtworkID').notNullable();
				t.integer('VideoID').notNullable();
				t.integer('Priority').notNullable().defaultTo(1);
				t.timestamps();
			});
		})
		.then(function () {
			return knex.schema.hasTable('VuforiaTargets');
		})
		.then(function (exists) {
			if (!exists) {
				return knex.schema.createTable('VuforiaTargets', function (t) {
					t.increments('ID').primary();
					t.integer('ArtworkID').notNullable();
					t.string('TargetID', 64);
					t.string('Name', 256);
					t.integer('TrackingRating');
					t.integer('RecoRating').notNullable().defaultTo(0);
					t.float('Width');
					t.string('Metadata', 4000);
					t.string('LinkURL', 256);
					t.string('LinkText', 40);
					t.bool('Active').notNullable().defaultTo(false);
					t.bool('Deleted').notNullable().defaultTo(false);
					t.datetime('LastUploaded');
					t.timestamps();
				});
			}
		})



		//
		//	Fix Timestamp Columns
		//

		.then(function () {
			return knex.raw(
				'ALTER TABLE VideoTranscodeTypes CHANGE COLUMN `created_at` created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, ' +
				'CHANGE COLUMN `updated_at` updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE NOW()'
			)
		})
		.then(function () {
			return knex.raw(
				'ALTER TABLE VideoTranscodes CHANGE COLUMN `created_at` created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, ' +
				'CHANGE COLUMN `updated_at` updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE NOW()'
			)
		})
		.then(function () {
			return knex.raw(
				'ALTER TABLE ArtworkVideos CHANGE COLUMN `created_at` created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, ' +
				'CHANGE COLUMN `updated_at` updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE NOW()'
			)
		})
		.then(function () {
			return knex.raw(
				'ALTER TABLE VuforiaTargets CHANGE COLUMN `created_at` created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, ' +
				'CHANGE COLUMN `updated_at` updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE NOW(),' + 
				'AUTO_INCREMENT = 200;'
			)
		})


		//
		//	Update Videos Table
		//

		.then(function () {
			return knex.schema.hasColumn('Videos', 'FileSize')
		})
		.then(function (exists) {
			if (!exists) {
				return knex.schema.table('Videos', function (t) {
					t.integer('FileSize');
				})
			}
		})
		.then(function () {
			return knex.schema.hasColumn('Videos', 'FileName')
		})
		.then(function (exists) {
			if (!exists) {
				return knex.schema.table('Videos', function (t) {
					t.string('FileName', 256);
				})
			}
		})
		.then(function () {
			return knex.schema.hasColumn('Videos', 'ArtworkID')
		})
		.then(function (exists) {
			if (exists) {
				return knex.schema.table('Videos', function (t) {
					t.dropColumn('ArtworkID');
				})
			}
		})
		.then(function () {
			return knex.schema.hasColumn('Videos', 'Duration')
		})
		.then(function (exists) {
			if (exists) {
				return knex.schema.table('Videos', function (t) {
					t.dropColumn('Duration');
				})
			}
		})
		.then(function () {
			return knex.schema.table('Videos', function (t) {
				t.float('Duration').notNullable().defaultTo(0);
			})
		})


		//
		// Insert Initial Data
		//

		.then(function () {
			return knex('VideoTranscodeTypes').insert([
				{ Type: 'MP4' },
				{ Type: 'HLS'}
			]);
		})
		

};

exports.down = function(knex, Promise) {

	//
	// Drop Additional Video Tables
	//

	return knex.schema.hasTable('VideoTranscodeTypes')
		.then(function (exists) {
			if (exists) {
				return knex.schema.dropTable('VideoTranscodeTypes');
			}
		})
		.then(function () {
			return knex.schema.hasTable('VideoTranscodes');
		})
		.then(function (exists) {
			if (exists) {
				return knex.schema.dropTable('VideoTranscodes');
			}
		})
		.then(function () {
			return knex.schema.hasTable('ArtworkVideos');
		})
		.then(function (exists) {
			if (exists) {
				return knex.schema.dropTable('ArtworkVideos');
			}
		})
		.then(function () {
			return knex.schema.hasTable('VuforiaTargets');
		})
		.then(function (exists) {
			if (exists) {
				return knex.schema.dropTable('VuforiaTargets');
			}
		})


		//
		//	Revert Videos Table
		//

		.then(function () {
			return knex.schema.hasColumn('Videos', 'FileSize')
		})
		.then(function (exists) {
			if (exists) {
				return knex.schema.table('Videos', function (t) {
					t.dropColumn('FileSize');
				})
			}
		})
		.then(function () {
			return knex.schema.hasColumn('Videos', 'FileName')
		})
		.then(function (exists) {
			if (exists) {
				return knex.schema.table('Videos', function (t) {
					t.dropColumn('FileName');
				})
			}
		})

};
