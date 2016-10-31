var tableConfig = {
	tableName: 'DimensionUnits',
	build: function(table) {
		console.log('Creating DimensionUnits');
		table.increments('ID').primary();
		table.string('Name', 25).notNullable();
		table.string('Symbol', 5).notNullable();
		table.float('Ratio_MM').notNullable();
	},
  populate: function(database) {
  	console.log('Altering DimensionUnits');
    return database.raw(
      'ALTER TABLE DimensionUnits CHANGE COLUMN `created_at` created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP; '
    ).then(function() {
      return database.raw(
        'ALTER TABLE DimensionUnits CHANGE COLUMN `updated_at` updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE now();'
      )
    });
  }
};

module.exports = dbManager.sync([tableConfig]).then(function() {
  // Populate is used here simply to add defaults to created_at/updated_at, use knex seed:run to actually seed the DB
  return dbManager.populate([tableConfig]);
});
