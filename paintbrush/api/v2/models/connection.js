var tableConfig = {
	tableName: 'Connections',
	build: function(table) {
    console.log('Creating Connections');
		table.increments('ID').primary();
		table.integer('ProfileID').notNullable();
		table.integer('ConnectedProfileID').notNullable();
		table.boolean('Accepted').notNullable().defaultTo(false);
		table.string('Message', 512).notNullable();
		table.dateTime('HoldDate');
	},
  populate: function(database) {
    console.log('Altering Connections');
    return database.raw(
      'ALTER TABLE Connections CHANGE COLUMN `created_at` created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP; '
    ).then(function() {
      return database.raw(
        'ALTER TABLE Connections CHANGE COLUMN `updated_at` updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE now();'
      )
    });
  }
};

module.exports = dbManager.sync([tableConfig]).then(function() {
  // Populate is used here simply to add defaults to created_at/updated_at, use knex seed:run to actually seed the DB
  return dbManager.populate([tableConfig]);
});
