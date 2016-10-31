
exports.up = function(knex, Promise) {


	return knex.schema.hasTable('ActivCanvasSettings')
		.then(function (exists) {
			if (!exists) {
				return knex.schema.createTable('ActivCanvasSettings', function (t) {
						t.increments('ID').primary();
						t.integer('ProfileID').notNullable();
						t.integer('StatusID').notNullable().defaultTo(1);
						t.integer('VideoID');
						t.string('LinkText', 40);
						t.string('LinkURI', 255);
						t.boolean('AutoPlay').notNullable().defaultTo(1);
						t.timestamps();
					})
					.then(function () {
						return knex.raw(
						'ALTER TABLE ActivCanvasSettings CHANGE COLUMN `created_at` created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, ' +
						'CHANGE COLUMN `updated_at` updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE NOW()'
						)
					});
			}
		})


};

exports.down = function(knex, Promise) {

	return knex.schema.hasTable('ActivCanvasSettings')
	  .then(function (exists) {
		  if (exists) {
			  return knex.schema.dropTable('ActivCanvasSettings');
		  }
	  })


};
