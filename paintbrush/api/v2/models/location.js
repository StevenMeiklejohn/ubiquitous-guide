var tableConfig = {
	tableName: 'Locations',
	build: function(table) {
    console.log('Creating Locations');
		table.increments('ID').primary();
		table.string('Address1').notNullable();
		table.string('Address2');
		table.string('Address3');
		table.string('Town');
		table.string('Postcode');
		table.float('Latitude');
		table.float('Longitiude');
		table.boolean('Deleted').notNullable().defaultTo(false);
	},
  populate: function(database) {
    console.log('Altering Locations');
    return database.raw(
      'ALTER TABLE Locations CHANGE COLUMN `created_at` created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP; '
    ).then(function() {
      return database.raw(
        'ALTER TABLE Locations CHANGE COLUMN `updated_at` updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE now();'
      )
    });
  }
};

module.exports = dbManager.sync([tableConfig]).then(function() {
  // Populate is used here simply to add defaults to created_at/updated_at, use knex seed:run to actually seed the DB
  return dbManager.populate([tableConfig]);
});
