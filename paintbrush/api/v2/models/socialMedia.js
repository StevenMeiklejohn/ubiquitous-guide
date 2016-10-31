var tableConfig = {
	tableName: 'SocialMedia',
	build: function(table) {
		console.log('Creating SocialMedia');
		table.increments('ID').primary();
		table.string('Name', 100).notNullable();
		table.string('URL', 300).notNullable();
		table.boolean('Deleted').notNullable().defaultTo(false);
	},
  populate: function(database) {
  	console.log('Altering SocialMedia');
    return database.raw(
      'ALTER TABLE SocialMedia CHANGE COLUMN `created_at` created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, ' +
      'CHANGE COLUMN `updated_at` updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE NOW()'
    )
  }
};

module.exports = dbManager.sync([tableConfig]).then(function() {
  // Populate is used here simply to add defaults to created_at/updated_at, use knex seed:run to actually seed the DB
  return dbManager.populate([tableConfig]);
});
