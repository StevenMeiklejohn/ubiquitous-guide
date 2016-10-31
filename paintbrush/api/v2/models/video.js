var tableConfig = {
	tableName: 'Videos',
	build: function(table) {
    console.log('Creating Videos');
		table.increments('ID').primary();
		table.integer('ProfileID').notNullable();
		table.integer('ArtworkID');
		table.string('Name');
		table.string('Description', 4000);
		table.string('VideoURI', 256).notNullable();
		table.integer('Width').notNullable().defaultTo(0);
		table.integer('Height').notNullable().defaultTo(0);
		table.integer('Duration').notNullable().defaultTo(0);
		table.boolean('Deleted').notNullable().defaultTo(false);
	},
  populate: function(database) {
    console.log('Altering Videos');
    return database.raw(
      'ALTER TABLE Videos CHANGE COLUMN `created_at` created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP; '
    ).then(function() {
      return database.raw(
        'ALTER TABLE Videos CHANGE COLUMN `updated_at` updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE now();'
      )
    });
  }
};

module.exports = dbManager.sync([tableConfig]).then(function() {
  // Populate is used here simply to add defaults to created_at/updated_at, use knex seed:run to actually seed the DB
  return dbManager.populate([tableConfig]);
});
