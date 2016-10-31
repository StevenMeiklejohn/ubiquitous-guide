var tableConfig = {
	tableName: 'ArtistTypes',
	build: function(table) {
		console.log('Creating ArtistTypes');
		table.increments('ID').primary();
		table.string('Type', 100).notNullable();
		table.string('Description', 4000).notNullable();
		table.boolean('Deleted').notNullable().defaultTo(false);
	},
  populate: function(database) {
  	console.log('Altering ArtistTypes');
    return database.raw(
      'ALTER TABLE ArtistTypes CHANGE COLUMN `created_at` created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP; '
    ).then(function() {
      return database.raw(
        'ALTER TABLE ArtistTypes CHANGE COLUMN `updated_at` updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE now();'
      )
    });
  }
};

module.exports = dbManager.sync([tableConfig]).then(function() {
  // Populate is used here simply to add defaults to created_at/updated_at, use knex seed:run to actually seed the DB
  return dbManager.populate([tableConfig]);
});
