
exports.up = function (knex, Promise) {

	return knex.schema.hasColumn('Artists', 'ActivCanvasStatusID')
		.then(function (exists) {
			if (exists) {
				return knex.schema.table('Artists', function (t) {
					t.dropColumn('ActivCanvasStatusID');
				})
			}
		})
		.then(function () {
			return knex.schema.hasColumn('Profiles', 'ActivCanvasStatusID');
		})
		.then(function (exists) {
			if (!exists) {
				return knex.schema.table('Profiles', function (t) {
					t.integer('ActivCanvasStatusID').notNullable().defaultTo(1);
					t.integer('VideoID');
				})
			}
		})
		.then(function () {
			return knex.schema.hasColumn('VideoTranscodes', 'Complete');
		})
		.then(function (exists) {
			if (!exists) {
				return knex.schema.table('VideoTranscodes', function (t) {
					t.bool('Complete').notNullable().defaultTo(false);
				});
			}
		})
		.then(function () {
			return knex.schema.hasColumn('VideoTranscodes', 'JobID');
		})
		.then(function (exists) {
			if (!exists) {
				return knex.schema.table('VideoTranscodes', function (t) {
					t.string('JobID', 32);
				});
			}
		})
		.then(function () {
			return knex.schema.hasTable('ActivCanvasQueue');
		})
		.then(function (exists) {
			if (!exists) {
				return knex.schema.createTable('ActivCanvasQueue', function (t) {
					t.increments('ID').primary();
					t.integer('VideoID').notNullable();
					t.integer('ArtworkID');
					t.bool('Transcoded').notNullable().defaultTo(false);
					t.bool('SentToVuforia').notNullable().defaultTo(false);
					t.timestamps();
				});
			}
		})
		.then(function () {
			return knex.schema.hasColumn('VuforiaTargets', 'SyncRequired');
		})
		.then(function (exists) {
			if (!exists) {
				return knex.schema.table('VuforiaTargets', function (t) {
					t.bool('SyncRequired').notNullable().defaultTo(false);
				});
			}
		})
	


		//
		//	Fix Timestamp Columns
		//

		.then(function () {
			return knex.raw(
				'ALTER TABLE ActivCanvasQueue CHANGE COLUMN `created_at` created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, ' +
				'CHANGE COLUMN `updated_at` updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE NOW()'
			)
		})


};

exports.down = function (knex, Promise) {

	return knex.schema.hasColumn('Profiles', 'ActivCanvasStatusID')
		.then(function (exists) {
			if (exists) {
				return knex.schema.table('Profiles', function (t) {
					t.dropColumn('ActivCanvasStatusID');
					t.dropColumn('VideoID');
				})
			}
		})
		.then(function () {
			return knex.schema.hasColumn('Artists', 'ActivCanvasStatusID');
		})
		.then(function (exists) {
			if (!exists) {
				return knex.schema.table('Artists', function (t) {
					t.integer('ActivCanvasStatusID').notNullable().defaultTo(1);
				})
			}
		})
		.then(function () {
			return knex.schema.hasColumn('VideoTranscodes', 'Complete');
		})
		.then(function (exists) {
			if (exists) {
				return knex.schema.table('VideoTranscodes', function (t) {
					t.dropColumn('Complete');
				});
			}
		})
		.then(function () {
			return knex.schema.hasColumn('VideoTranscodes', 'JobID');
		})
		.then(function (exists) {
			if (exists) {
				return knex.schema.table('VideoTranscodes', function (t) {
					t.dropColumn('JobID');
				});
			}
		})
		.then(function () {
			return knex.schema.hasTable('VideoTranscodeQueue');
		})
		.then(function (exists) {
			if (exists) {
				return knex.schema.dropTable('VideoTranscodeQueue');
			}
		})
		.then(function () {
			return knex.schema.hasTable('ActivCanvasQueue');
		})
		.then(function (exists) {
			if (exists) {
				return knex.schema.dropTable('ActivCanvasQueue');
			}
		})


};
