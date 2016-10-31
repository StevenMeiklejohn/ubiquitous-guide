var tableConfig = {
	tableName: 'Registrations',
	build: function(table) {
		table.increments('ID').primary();
		table.integer('Step').notNullable().defaultTo(0);
		table.string('Type', 20);
		table.integer('TotalSteps');
		table.integer('CompletedSteps');
	},
  populate: function(database) {
    return database.raw(
      'ALTER TABLE Registrations CHANGE COLUMN `created_at` created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, ' +
      'CHANGE COLUMN `updated_at` updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE NOW()'
    )
  }
};

module.exports = dbManager.sync([tableConfig]).then(function() {
  // Populate is used here simply to add defaults to created_at/updated_at, use knex seed:run to actually seed the DB
  return dbManager.populate([tableConfig]);
});
