var tableConfig = {
	tableName: 'ArtworkImages',
	build: function (table) {
		console.log('Creating ArtworkImages');
		table.increments('ID').primary();
		table.integer('ArtworkID').notNullable();
		table.string('Description', 4000);
		table.string('ImageURI', 256).notNullable();
		table.boolean('Deleted').notNullable().defaultTo(false);
		table.integer('ImageWidth').notNullable();
		table.integer('ImageHeight').notNullable();
	},
	populate: function (database) {
		console.log('Altering ArtworkImages');
		return database.raw(
		  'ALTER TABLE ArtworkImages CHANGE COLUMN `created_at` created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP; '
		).then(function () {
			return database.raw(
			  'ALTER TABLE ArtworkImages CHANGE COLUMN `updated_at` updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP;'
			)
		});
	}
};

module.exports = dbManager.sync([tableConfig]).then(function() {
  // Populate is used here simply to add defaults to created_at/updated_at, use knex seed:run to actually seed the DB
  return dbManager.populate([tableConfig]);
});
