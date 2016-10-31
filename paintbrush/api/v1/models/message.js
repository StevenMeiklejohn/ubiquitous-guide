var tableConfig = {
	tableName: 'Messages',
	build: function(table) {
    console.log('Creating Messages');
		table.increments('ID').primary();
		table.integer('SenderProfileID').notNullable();
		table.integer('RecipientProfileID').notNullable();
		table.integer('MessageThreadID').notNullable();
		table.integer('PreviousMessageID').notNullable();
		table.string('Subject').notNullable();
		table.string('Body', 8000).notNullable();
		table.dateTime('SentDate').notNullable();
		table.dateTime('ReadDate');
		table.boolean('Deleted').notNullable().defaultTo(false);
	},
  populate: function(database) {
    console.log('Altering Messages');
    return database.raw(
      'ALTER TABLE Messages CHANGE COLUMN `created_at` created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP; '
    ).then(function() {
      return database.raw(
        'ALTER TABLE Messages CHANGE COLUMN `updated_at` updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE now();'
      )
    });
  }
};

module.exports = dbManager.sync([tableConfig]).then(function() {
  // Populate is used here simply to add defaults to created_at/updated_at, use knex seed:run to actually seed the DB
  return dbManager.populate([tableConfig]);
});
