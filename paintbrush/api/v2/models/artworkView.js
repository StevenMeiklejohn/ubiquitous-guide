var tableConfig = {
	tableName: 'ArtworkViews',
	build: function(table) {
    console.log('Creating ArtworkViews');
		table.increments('ID').primary();
		table.integer('ArtworkID').notNullable();
		table.integer('ViewerProfileID').notNullable();
	},
  populate: function(database) {
    console.log('Altering ArtworkViews');
    return database.raw(
      'ALTER TABLE ArtworkViews CHANGE COLUMN `created_at` created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP; '
    ).then(function() {
      return database.raw(
        'ALTER TABLE ArtworkViews CHANGE COLUMN `updated_at` updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE now();'
      )
    });
  }
};

module.exports = dbManager.sync([tableConfig]).then(function() {
  // Populate is used here simply to add defaults to created_at/updated_at, use knex seed:run to actually seed the DB
  return dbManager.populate([tableConfig]);
});
