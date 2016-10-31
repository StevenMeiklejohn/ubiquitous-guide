var tableConfig = {
	tableName: 'Notifications',
	build: function(table) {
		console.log('Creating Notifications');
		table.increments('ID').primary();
		table.integer('ProfileID').notNullable();
		table.integer('PriorityID').notNullable().defaultTo(1);
		table.integer('TypeID').notNullable();
		table.integer('ConnectionID');
		table.integer('MessageThreadID');
		table.integer('TaskGroupID');
		table.string('Subject').notNullable();
		table.string('Body', 8000).notNullable();
		table.dateTime('SentDate').notNullable();
		table.dateTime('ReadDate');
		table.boolean('Sticky').notNullable().defaultTo(false);
		table.boolean('Deleted').notNullable().defaultTo(false);
	},
	populate: function(database) {
		console.log('Altering Notifications');
		return database.raw(
			'ALTER TABLE Notifications CHANGE COLUMN `created_at` created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, ' +
			'CHANGE COLUMN `updated_at` updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE NOW()'
		)
	}
};

module.exports = dbManager.sync([tableConfig]).then(function() {
	// Populate is used here simply to add defaults to created_at/updated_at, use knex seed:run to actually seed the DB
	return dbManager.populate([tableConfig]);
});
