var tableConfig = {
	tableName: 'AgeBrackets',
	build: function(table) {
		console.log('Creating AgeBrackets');
		table.increments('ID').primary();
		table.string('Description', 100).notNullable();
		table.boolean('Deleted').notNullable().defaultTo(false);
	},
  populate: function(database) {
  	console.log('Altering AgeBrackets');
    return database.raw(
      'ALTER TABLE AgeBrackets CHANGE COLUMN `created_at` created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP; '
    ).then(function() {
      return database.raw(
        'ALTER TABLE AgeBrackets CHANGE COLUMN `updated_at` updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE now();'
      )
    });
  }
};

module.exports = dbManager.sync([tableConfig]).then(function() {
  // Populate is used here simply to add defaults to created_at/updated_at, use knex seed:run to actually seed the DB
  return dbManager.populate([tableConfig]);
});
