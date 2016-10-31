var tableConfig = {
	tableName: 'GalleryArtworks',
	build: function(table) {
    console.log('Creating GalleryArtworks');
		table.increments('ID').primary();
		table.integer('ProfileID').notNullable();
		table.integer('ArtworkID').notNullable();
		table.integer('StatusID').notNullable();
		table.dateTime('AquiredDate').notNullable();
		table.integer('PurchasePrice').notNullable().defaultTo(0);
		table.boolean('Deleted').notNullable().defaultTo(false);
	},
  populate: function(database) {
    console.log('Altering GalleryArtworks');
    return database.raw(
      'ALTER TABLE GalleryArtworks CHANGE COLUMN `created_at` created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP; '
    ).then(function() {
      return database.raw(
        'ALTER TABLE GalleryArtworks CHANGE COLUMN `updated_at` updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE now();'
      )
    });
  }
};

module.exports = dbManager.sync([tableConfig]).then(function() {
  // Populate is used here simply to add defaults to created_at/updated_at, use knex seed:run to actually seed the DB
  return dbManager.populate([tableConfig]);
});
