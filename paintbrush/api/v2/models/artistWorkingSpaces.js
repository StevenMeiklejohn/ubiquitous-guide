var tableConfig = {
	tableName: 'ArtistWorkingSpaces',
	build: function(table) {
		console.log('Creating ArtistWorkingSpaces');
		table.increments('ID').primary();
		table.integer('ArtistID').notNullable();
		table.integer('WorkingSpaceID').notNullable();
		table.boolean('Deleted').notNullable().defaultTo(false);
	},
  populate: function(database) {
  	console.log('Altering ArtistWorkingSpaces');
    return database.raw(
      'ALTER TABLE ArtistWorkingSpaces CHANGE COLUMN `created_at` created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP; '
    ).then(function() {
      return database.raw(
        'ALTER TABLE ArtistWorkingSpaces CHANGE COLUMN `updated_at` updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE now();'
      )
    });
  }
};

module.exports = dbManager.sync([tableConfig]).then(function() {
  // Populate is used here simply to add defaults to created_at/updated_at, use knex seed:run to actually seed the DB
  return dbManager.populate([tableConfig]);
});
