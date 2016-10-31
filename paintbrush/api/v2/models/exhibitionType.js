var tableConfig = {
	tableName: 'ExhibitionTypes',
	build: function(table) {
    console.log('Creating ExhibitionTypes');
		table.increments('ID').primary();
		table.string('Type').notNullable();
		table.string('Description', 4000);
		table.boolean('Deleted').notNullable().defaultTo(false);
	},
  populate: function(database) {
    console.log('Altering ExhibitionTypes');
    return database.raw(
      'ALTER TABLE ExhibitionTypes CHANGE COLUMN `created_at` created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP; '
    ).then(function() {
      return database.raw(
        'ALTER TABLE ExhibitionTypes CHANGE COLUMN `updated_at` updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE now();'
      )
    });
  }
};

module.exports = dbManager.sync([tableConfig]).then(function() {
  // Populate is used here simply to add defaults to created_at/updated_at, use knex seed:run to actually seed the DB
  return dbManager.populate([tableConfig]);
});
