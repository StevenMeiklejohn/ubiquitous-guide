var tableConfig = {
	tableName: 'Profiles',
	build: function(table) {
    console.log('Creating Profiles');
		table.increments('ID').primary();
		table.integer('ContactInformationID').notNullable();
		table.integer('BiographyID').notNullable();
		table.string('Name').notNullable();
		table.string('ImageURI', 256).notNullable();
		table.string('CRMContactID', 36);
		table.boolean('Deleted').notNullable().defaultTo(false);
	},
  populate: function(database) {
    console.log('Altering Profiles');
    return database.raw(
      'ALTER TABLE Profiles CHANGE COLUMN `created_at` created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP; '
    ).then(function() {
      return database.raw(
        'ALTER TABLE Profiles CHANGE COLUMN `updated_at` updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE now();'
      )
    });
  }
};

module.exports = dbManager.sync([tableConfig]).then(function() {
  // Populate is used here simply to add defaults to created_at/updated_at, use knex seed:run to actually seed the DB
  return dbManager.populate([tableConfig]);
});
