var tableConfig = {
	tableName: 'Followers',
	build: function(table) {
    console.log('Creating Followers');
		table.increments('ID').primary();
		table.integer('ProfileID').notNullable();
		table.integer('FollowingProfileID').notNullable();
	},
  populate: function(database) {
    console.log('Altering Followers');
    return database.raw(
      'ALTER TABLE Followers CHANGE COLUMN `created_at` created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP; '
    ).then(function() {
      return database.raw(
        'ALTER TABLE Followers CHANGE COLUMN `updated_at` updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE now();'
      )
    });
  }
};

module.exports = dbManager.sync([tableConfig]).then(function() {
  // Populate is used here simply to add defaults to created_at/updated_at, use knex seed:run to actually seed the DB
  return dbManager.populate([tableConfig]);
});
