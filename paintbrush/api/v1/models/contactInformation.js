var tableConfig = {
	tableName: 'ContactInformation',
	build: function(table) {
    console.log('Creating ContactInformation');
		table.increments('ID').primary();
		table.string('Address1');
		table.string('Address2');
		table.string('Address3');
		table.string('Town');
		table.string('Postcode');
		table.string('Website');
		table.string('Landline');
		table.string('Mobile');
		table.boolean('Deleted').notNullable().defaultTo(false);
	},
  populate: function(database) {
    console.log('Altering ContactInformation');
    return database.raw(
      'ALTER TABLE ContactInformation CHANGE COLUMN `created_at` created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP; '
    ).then(function() {
      return database.raw(
        'ALTER TABLE ContactInformation CHANGE COLUMN `updated_at` updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE now();'
      )
    });
  }
};

module.exports = dbManager.sync([tableConfig]).then(function() {
  // Populate is used here simply to add defaults to created_at/updated_at, use knex seed:run to actually seed the DB
  return dbManager.populate([tableConfig]);
});
