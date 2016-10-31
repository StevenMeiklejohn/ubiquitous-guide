var tableConfig = {
	tableName: 'Exhibitions',
	build: function(table) {
    console.log('Creating Exhibitions');
		table.increments('ID').primary();
		table.integer('ProfileID').notNullable();
		table.integer('LocationID').notNullable();
		table.integer('TypeID').notNullable();
		table.dateTime('StartDate').notNullable();
		table.dateTime('EndDate').notNullable();
		table.boolean('Deleted').notNullable().defaultTo(false);
	},
  populate: function(database) {
    console.log('Altering Exhibitions');
    return database.raw(
      'ALTER TABLE Exhibitions CHANGE COLUMN `created_at` created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP; '
    ).then(function() {
      return database.raw(
        'ALTER TABLE Exhibitions CHANGE COLUMN `updated_at` updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE now();'
      )
    });
  }
};

module.exports = dbManager.sync([tableConfig]).then(function() {
  // Populate is used here simply to add defaults to created_at/updated_at, use knex seed:run to actually seed the DB
  return dbManager.populate([tableConfig]);
});
