var tableConfig = {
	tableName: 'Shortlists',
	build: function(table) {
    console.log('Creating Shortlists');
		table.increments('ID').primary();
		table.integer('ProfileID').notNullable();
		table.string('Name').notNullable();
		table.string('Description', 4000);
		table.integer('Target').notNullable().defaultTo(1);
		table.integer('TypeID').notNullable().defaultTo(1);
		table.boolean('Archived').notNullable().defaultTo(false);
		table.boolean('Deleted').notNullable().defaultTo(false);
	},
  populate: function(database) {
    console.log('Altering Shortlists');
    return database.raw(
      'ALTER TABLE Shortlists CHANGE COLUMN `created_at` created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP; '
    ).then(function() {
      return database.raw(
        'ALTER TABLE Shortlists CHANGE COLUMN `updated_at` updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE now();'
      )
    });
  }
};

module.exports = dbManager.sync([tableConfig]).then(function() {
  // Populate is used here simply to add defaults to created_at/updated_at, use knex seed:run to actually seed the DB
  return dbManager.populate([tableConfig]);
});
