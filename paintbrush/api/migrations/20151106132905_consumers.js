
exports.up = function(knex, Promise) {

	// Create Consumers Table
	return knex.schema.hasTable('Consumers')
		.then(function (exists) {
			if (!exists) {
				return knex.schema.createTable('Consumers', function (t) {
					t.increments('ID').primary();
					t.integer('ProfileID');
					t.integer('UserID');
					t.timestamps();
				})
				.then(function () {
					return knex.raw(
						'ALTER TABLE Consumers CHANGE COLUMN `created_at` created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, ' +
						'CHANGE COLUMN `updated_at` updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE NOW()'
					)
				});
			}
		})




};

exports.down = function (knex, Promise) {

	// Remove Consumers Table
	return knex.schema.hasTable('Consumers')
		.then(function (exists) {
			if (exists) {
				return knex.schema.dropTable('Consumers');
			}
		})

};
