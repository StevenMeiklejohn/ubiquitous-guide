var tableConfig = {
	tableName: 'Artists',
	build: function(table) {
    console.log('Creating Artists');
		table.increments('ID').primary();
		table.integer('UserID').notNullable();
		table.integer('ProfileID').notNullable();
		table.integer('DisciplineID').notNullable();
		table.integer('PricebandID').notNullable();
		table.integer('AgeBracketID').notNullable();
		table.integer('ActivCanvasStatusID').notNullable().defaultTo(1);
		table.string('Nationality');
		table.string('Location');
		table.boolean('Deleted').notNullable().defaultTo(false);
	},
  populate: function(database) {
    console.log('Altering Artists');
    return database.raw(
      'ALTER TABLE Artists CHANGE COLUMN `created_at` created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP; '
    ).then(function() {
      return database.raw(
        'ALTER TABLE Artists CHANGE COLUMN `updated_at` updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE now();'
      )
    });
  }
};

module.exports = dbManager.sync([tableConfig]).then(function() {
  // Populate is used here simply to add defaults to created_at/updated_at, use knex seed:run to actually seed the DB
  return dbManager.populate([tableConfig]);
});
