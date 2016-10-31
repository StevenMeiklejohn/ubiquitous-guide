var tableConfig = {
	tableName: 'GalleryUsers',
	build: function(table) {
    console.log('Creating GalleryUsers');
		table.increments('ID').primary();
		table.integer('UserID').notNullable();
		table.integer('GalleryID').notNullable();
		table.boolean('Deleted').notNullable().defaultTo(false);
	},
  populate: function(database) {
    console.log('Altering GalleryUsers');
    return database.raw(
      'ALTER TABLE GalleryUsers CHANGE COLUMN `created_at` created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP; '
    ).then(function() {
      return database.raw(
        'ALTER TABLE GalleryUsers CHANGE COLUMN `updated_at` updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE now();'
      )
    });
  }
};

module.exports = dbManager.sync([tableConfig]).then(function() {
  // Populate is used here simply to add defaults to created_at/updated_at, use knex seed:run to actually seed the DB
  return dbManager.populate([tableConfig]);
});
