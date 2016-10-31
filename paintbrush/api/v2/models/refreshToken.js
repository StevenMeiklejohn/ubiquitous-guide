var tableConfig = {
	tableName: 'RefreshTokens',
	build: function(table) {
    console.log('Creating RefreshTokens');
		table.increments('ID').primary();
		table.integer('UserID').notNullable();
		table.integer('ClientID').notNullable();
		table.string('Token', 256).notNullable();
	},
  populate: function(database) {
    console.log('Altering RefreshTokens');
    return database.raw(
      'ALTER TABLE RefreshTokens CHANGE COLUMN `created_at` created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP; '
    ).then(function() {
      return database.raw(
        'ALTER TABLE RefreshTokens CHANGE COLUMN `updated_at` updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE now();'
      )
    });
  }
};

module.exports = dbManager.sync([tableConfig]).then(function() {
  // Populate is used here simply to add defaults to created_at/updated_at, use knex seed:run to actually seed the DB
  return dbManager.populate([tableConfig]);
});
