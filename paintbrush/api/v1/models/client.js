var tableConfig = {
	tableName: 'Clients',
	build: function(table) {
    console.log('Creating Clients');
		table.increments('ID').primary();
		table.string('Name', 256).notNullable();
		table.string('Login', 100);
		table.string('Secret', 100);
		table.boolean('Authorised').notNullable().defaultTo(true);
		table.boolean('Deleted').notNullable().defaultTo(false);
	},
  populate: function(database) {
    console.log('Altering Clients');
    return database.raw(
      'ALTER TABLE Clients CHANGE COLUMN `created_at` created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, ' +
      'CHANGE COLUMN `updated_at` updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE NOW()'
    )
  }
};

module.exports = dbManager.sync([tableConfig]).then(function() {
  // Populate is used here simply to add defaults to created_at/updated_at, use knex seed:run to actually seed the DB
  return dbManager.populate([tableConfig]);
});
