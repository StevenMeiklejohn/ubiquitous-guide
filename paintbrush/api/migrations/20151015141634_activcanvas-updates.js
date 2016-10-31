
exports.up = function (knex, Promise) {

	return knex.schema.hasTable('VideoTranscodeThumbnails')
		.then(function (exists) {
			if (!exists) {
				return knex.schema.createTable('VideoTranscodeThumbnails', function (t) {
					t.increments('ID').primary();
					t.integer('VideoTranscodeID').notNullable();
					t.string('ImageURI', 500).notNullable();
					t.integer('Order').notNullable().defaultTo(1);
					t.timestamps();
				});
			}
		})



		//
		//	Fix Timestamp Columns
		//

		.then(function () {
			return knex.raw(
				'ALTER TABLE VideoTranscodeThumbnails CHANGE COLUMN `created_at` created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, ' +
				'CHANGE COLUMN `updated_at` updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE NOW()'
			)
		})


};

exports.down = function (knex, Promise) {

	return knex.schema.hasTable('VideoTranscodeThumbnails')
		.then(function (exists) {
			if (exists) {
				return knex.schema.dropTable('VideoTranscodeThumbnails');
			}
		})


};
