var tableConfig = {
	tableName: 'ArtworkVideos',
	build: function (table) {
		console.log('Creating ArtworkVideos');
		table.increments('ID').primary();
		table.integer('ArtworkID').notNullable();
		table.integer('VideoID').notNullable();
	},
	populate: function (database) {
		console.log('Altering ArtworkVideos');
		return database.raw(
		  'ALTER TABLE ArtworkVideos CHANGE COLUMN `created_at` created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP; '
		).then(function () {
			return database.raw(
			  'ALTER TABLE ArtworkVideos CHANGE COLUMN `updated_at` updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP;'
			)
		});
	}
};

module.exports = dbManager.sync([tableConfig]).then(function() {
  // Populate is used here simply to add defaults to created_at/updated_at, use knex seed:run to actually seed the DB
  return dbManager.populate([tableConfig]);
});
