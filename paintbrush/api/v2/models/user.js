var tableConfig = {
	tableName: 'Users',
	build: function(table) {
		table.increments('ID').primary();
		table.integer('RegistrationID');
		table.string('Email', 255).notNullable().unique();
		table.string('Password', 100);
		table.string('OldPassword', 32);
		table.string('PasswordReset', 64);
		table.string('EmailVerification', 64);
		table.boolean('EmailVerified').notNullable().defaultTo(false);
		table.boolean('Authorised').notNullable().defaultTo(true);
		table.boolean('Deleted').notNullable().defaultTo(false);
	},
  populate: function(database) {
    return database.raw(
      'ALTER TABLE Users CHANGE COLUMN `created_at` created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, ' +
      'CHANGE COLUMN `updated_at` updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE NOW()'
    )
  }
};

module.exports = dbManager.sync([tableConfig]).then(function() {
  // Populate is used here simply to add defaults to created_at/updated_at, use knex seed:run to actually seed the DB
  return dbManager.populate([tableConfig]);
});
