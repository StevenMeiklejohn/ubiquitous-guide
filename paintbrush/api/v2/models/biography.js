var tableConfig = {
	tableName: 'Biographies',
	build: function(table) {
    console.log('Creating Biographies');
		table.increments('ID').primary();
		table.integer('ProfileID').notNullable();
		table.string('Description', 8000);
	},
  populate: function(database) {
    console.log('Altering Biographies');
    return database.raw(
      'ALTER TABLE Biographies CHANGE COLUMN `created_at` created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP; '
    ).then(function() {
      return database.raw(
        'ALTER TABLE Biographies CHANGE COLUMN `updated_at` updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE now();'
      )
    });
  }
};

module.exports = dbManager.sync([tableConfig]).then(function() {
  // Populate is used here simply to add defaults to created_at/updated_at, use knex seed:run to actually seed the DB
  return dbManager.populate([tableConfig]);
});
