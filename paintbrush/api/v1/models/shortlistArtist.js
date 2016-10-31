var tableConfig = {
	tableName: 'ShortlistArtists',
	build: function(table) {
    console.log('Creating ShortlistArtists');
		table.increments('ID').primary();
		table.integer('ShortlistID').notNullable();
		table.integer('ArtistID').notNullable();
	},
  populate: function(database) {
    console.log('Altering ShortlistArtists');
    return database.raw(
      'ALTER TABLE ShortlistArtists CHANGE COLUMN `created_at` created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, ' +
      'CHANGE COLUMN `updated_at` updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE NOW()'
    )
  }
};

module.exports = dbManager.sync([tableConfig]).then(function() {
  // Populate is used here simply to add defaults to created_at/updated_at, use knex seed:run to actually seed the DB
  return dbManager.populate([tableConfig]);
});
