var tableConfig = {
	tableName: 'ProfileSocialMedia',
	build: function(table) {
    console.log('Creating ProfileSocialMedia');
		table.increments('ID').primary();
    table.integer('ProfileID').notNullable();
		table.integer('SocialMediaID').notNullable();
    table.string('URL', 300).notNullable();
	},
  populate: function(database) {
    console.log('Altering ProfileSocialMedia');
    return database.raw(
      'ALTER TABLE ProfileSocialMedia CHANGE COLUMN `created_at` created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, ' +
      'CHANGE COLUMN `updated_at` updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE NOW()'
    )
  }
};

module.exports = dbManager.sync([tableConfig]).then(function() {
  // Populate is used here simply to add defaults to created_at/updated_at, use knex seed:run to actually seed the DB
  return dbManager.populate([tableConfig]);
});
