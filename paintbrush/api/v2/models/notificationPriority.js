var tableConfig = {
	tableName: 'NotificationPriority',
	build: function(table) {
		console.log('Creating NotificationPriority');
		table.increments('ID').primary();
		table.string('Description').notNullable();
	},
	populate: function(database) {
		console.log('Altering NotificationPriority');
		return database.raw(
			'ALTER TABLE NotificationPriority CHANGE COLUMN `created_at` created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, ' +
			'CHANGE COLUMN `updated_at` updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE NOW()'
		)
	}
};

module.exports = dbManager.sync([tableConfig]).then(function() {
	// Populate is used here simply to add defaults to created_at/updated_at, use knex seed:run to actually seed the DB
	return dbManager.populate([tableConfig]);
});
