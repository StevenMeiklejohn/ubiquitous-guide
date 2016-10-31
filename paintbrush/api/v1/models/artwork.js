var tableConfig = {
	tableName: 'Artworks',
	build: function (table) {
		console.log('Creating Artworks');
		table.increments('ID').primary();
		table.integer('ArtistProfileID').notNullable();
		table.integer('OwnerProfileID').notNullable();
		table.integer('ArtworkTypeID').notNullable();
		table.integer('StatusID').notNullable();
		table.integer('TimeSpentID');
		table.integer('PricebandID');
		table.integer('PricebandCustom');
		table.string('Name').notNullable();
		table.string('Description', 4000);
		table.string('ImageURI', 256).notNullable();
		table.integer('WidthMM').notNullable().defaultTo(0);
		table.integer('HeightMM').notNullable().defaultTo(0);
		table.integer('DepthMM').notNullable().defaultTo(0);
		table.integer('DimensionUnitID').notNullable().defaultTo(1);
		table.boolean('Complete').notNullable().defaultTo(false);
		table.boolean('Featured').notNullable().defaultTo(false);
		table.boolean('Deleted').notNullable().defaultTo(false);
		table.boolean('LimitedEdition').notNullable().defaultTo(false);
		table.string('LimitedEditionDetails', 50);
		table.integer('ImageWidth').notNullable();
		table.integer('ImageHeight').notNullable();
		table.integer('Likes').notNullable().defaultTo(0);
		table.integer('Views').notNullable().defaultTo(0);
		table.integer('Shortlisted').notNullable().defaultTo(0);
		table.boolean('ActivCanvasEnabled').notNullable().defaultTo(false);
	},
	populate: function (database) {
		console.log('Altering Artworks');
		return database.raw(
		  'ALTER TABLE Artworks CHANGE COLUMN `created_at` created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP; '
		).then(function () {
			return database.raw(
			  'ALTER TABLE Artworks CHANGE COLUMN `updated_at` updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP;'
			)
		});
	}
};

module.exports = dbManager.sync([tableConfig]).then(function () {
	// Populate is used here simply to add defaults to created_at/updated_at, use knex seed:run to actually seed the DB
	return dbManager.populate([tableConfig]);
});
