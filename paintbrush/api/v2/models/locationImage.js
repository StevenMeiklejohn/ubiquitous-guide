var tableConfig = {
	tableName: 'LocationImages',
	build: function(table) {
    console.log('Creating LocationImages');
		table.increments('ID').primary();
		table.integer('LocationID').notNullable();
		table.string('ImageURI', 256).notNullable();
		table.string('Description', 4000);
		table.boolean('Deleted').notNullable().defaultTo(false);
	},
  populate: function(database) {
    console.log('Altering LocationImages');
    return database.raw(
      'ALTER TABLE LocationImages CHANGE COLUMN `created_at` created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP; '
    ).then(function() {
      return database.raw(
        'ALTER TABLE LocationImages CHANGE COLUMN `updated_at` updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE now();'
      )
    });
  }
};

module.exports = dbManager.sync([tableConfig]).then(function() {
  // Populate is used here simply to add defaults to created_at/updated_at, use knex seed:run to actually seed the DB
  return dbManager.populate([tableConfig]);
});
