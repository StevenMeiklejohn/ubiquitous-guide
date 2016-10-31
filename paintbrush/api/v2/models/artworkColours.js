var tableConfig = {
	tableName: 'ArtworkColours',
	build: function(table) {
    console.log('Creating ArtworkColours');
		table.increments('ID').primary();
		table.integer('ArtworkID').notNullable();
		table.integer('Priority').notNullable().defaultTo(5);
		table.integer('R').notNullable();
		table.integer('G').notNullable();
		table.integer('B').notNullable();
	},
  populate: function(database) {
    console.log('Altering ArtworkColours');
    return database.raw(
      'ALTER TABLE ArtworkColours CHANGE COLUMN `created_at` created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP; '
    ).then(function() {
      return database.raw(
        'ALTER TABLE ArtworkColours CHANGE COLUMN `updated_at` updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE now();'
      )
    });
  }
};

module.exports = dbManager.sync([tableConfig]).then(function() {
  // Populate is used here simply to add defaults to created_at/updated_at, use knex seed:run to actually seed the DB
  return dbManager.populate([tableConfig]);
});
