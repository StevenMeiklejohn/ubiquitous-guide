var tableConfig = {
	tableName: 'Endpoints',
	build: function(table) {
	console.log('Creating Endpoints');
		table.increments('ID').primary();
		table.string('Pattern', 255).notNullable();
		table.string('Description', 512);
		table.boolean('Deleted').notNullable().defaultTo(false);
	},
	populate: function(database) {
		console.log('Altering Endpoints');
		return database.raw(
			'ALTER TABLE Endpoints CHANGE COLUMN `created_at` created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP; '
		).then(function() {
			return database.raw(
				'ALTER TABLE Endpoints CHANGE COLUMN `updated_at` updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE now();'
			)
		});
	}
};


module.exports = dbManager.sync([tableConfig]).then(function() {
	// Populate is used here simply to add defaults to created_at/updated_at, use knex seed:run to actually seed the DB
	return dbManager.populate([tableConfig]);
});
