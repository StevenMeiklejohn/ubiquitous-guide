var tableConfig = {
	tableName: 'ErrorLog',
	build: function (table) {
		console.log('Creating ErrorLog');
		table.increments('ID').primary();
		table.string('Message');
		table.string('Request', 100000);
		table.string('StackTrace', 100000);
		table.string('ErrorObject', 1000000);
	},
	populate: function (database) {
		console.log('Altering ErrorLog');
		return database.raw(
		  'ALTER TABLE ErrorLog CHANGE COLUMN `created_at` created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP; '
		).then(function () {
			return database.raw(
				'ALTER TABLE ErrorLog CHANGE COLUMN `updated_at` updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE now();'
			)
		});
	}
};

module.exports = dbManager.sync([tableConfig]).then(function () {
	// Populate is used here simply to add defaults to created_at/updated_at, use knex seed:run to actually seed the DB
	return dbManager.populate([tableConfig]);
});
