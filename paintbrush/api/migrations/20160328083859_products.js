
var dropTable = function (knex, table) {
	return knex.schema.hasTable(table)
	  .then(function (exists) {
		  if (exists) {
			  return knex.schema.dropTable(table);
		  }
	  })
};

var createTable = function (knex, table, definition) {
	return dropTable(knex, table)
	  .then(function () {
		  return knex.schema.createTable(table, definition)
			.then(function() {
				return knex.schema.hasColumn(table, 'created_at')
			})
			.then(function (exists) {
				if (exists) {
					return knex.raw(
					  'ALTER TABLE ' + table + ' CHANGE COLUMN `created_at` created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, ' +
					  'CHANGE COLUMN `updated_at` updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE NOW()'
					)
				}
			});
	  })
};



exports.up = function(knex, Promise) {

	//
	// Create New Tables
	//
	return Promise.all([
		createTable(knex, 'ProductTypes', function (t) {
			t.increments('ID').primary();
			t.string('Type', 50).notNullable();
			t.integer('MaxQuantity');
			t.timestamps();
		}),
		createTable(knex, 'Products', function (t) {
			t.increments('ID').primary();
			t.integer('ArtworkID');
			t.integer('ProfileID').notNullable();
			t.integer('ProductTypeID').notNullable().defaultTo(1);
			t.decimal('Price', 12).notNullable().defaultTo(0);
			t.integer('Quantity');
			t.integer('WidthMM');
			t.integer('HeightMM');
			t.integer('DepthMM');
			t.bool('UseProfileVariants').notNullable().defaultTo(1);
			t.timestamps();
		}),
		createTable(knex, 'ProductVariantGroups', function (t) {
			t.increments('ID').primary();
			t.integer('ProductTypeID').notNullable();
			t.string('Name', 100).notNullable();
			t.integer('ProfileID');
			t.timestamps();
		}),
		createTable(knex, 'ProductVariants', function (t) {
			t.increments('ID').primary();
			t.integer('GroupID').notNullable();
			t.integer('ProductID');
			t.integer('ProfileID');
			t.decimal('AdditionalPrice').notNullable().defaultTo(0);
			t.bool('GroupDefault').notNullable().defaultTo(0);
			t.string('Value', 100).notNullable();
			t.string('ImageURI', 255);
			t.timestamps();
		})
	])


	//
	// Define product user preferences
	//
	.then(function () {
		return knex('UserPreferences').insert([
			{ Category: 'product', Key: 'showAdvanced', DataType: 'boolean', DefaultValue: 'false' }
		])
	})


	//
	// Insert initial data
	//

	.then(function () {
		return knex('ProductTypes').insert([
			{ ID: 1, Type: 'Painting', MaxQuantity: 1 },
			{ ID: 2, Type: 'Print' }
		])
	});


	//
	// Insert test data
	//
	//.then(function () {
	//	return knex('ProductVariantGroups').insert([
	//		{ ID: 1, ProfileID: 4589, ProductTypeID: 1, Name: 'Frame' },
	//		{ ID: 2, ProfileID: 4589, ProductTypeID: 2, Name: 'Frame' },
	//		{ ID: 3, ProfileID: 4589, ProductTypeID: 2, Name: 'Paper Weight' }
	//	])
	//})
	//.then(function () {
	//	return knex('ProductVariants').insert([
	//		{ GroupID: 1, ProfileID: 4589, Value: 'No Frame', GroupDefault: true },
	//		{ GroupID: 1, ProfileID: 4589, Value: 'Frame Style 1', AdditionalPrice: 35 },
	//		{ GroupID: 1, ProfileID: 4589, Value: 'Frame Style 2', AdditionalPrice: 45 },
	//		{ GroupID: 2, ProfileID: 4589, Value: 'No Frame', GroupDefault: true },
	//		{ GroupID: 2, ProfileID: 4589, Value: 'Frame Style 1', AdditionalPrice: 25 },
	//		{ GroupID: 2, ProfileID: 4589, Value: 'Frame Style 2', AdditionalPrice: 35 },
	//		{ GroupID: 3, ProfileID: 4589, Value: '80 gsm', AdditionalPrice: -10 },
	//		{ GroupID: 3, ProfileID: 4589, Value: '100 gsm', GroupDefault: true },
	//		{ GroupID: 3, ProfileID: 4589, Value: '120 gsm', AdditionalPrice: 10 },
	//		{ GroupID: 3, ProfileID: 4589, Value: '150 gsm', AdditionalPrice: 20 }
	//	])
	//})
	//.then(function () {
	//	return knex('Products').insert([
	//		{ ProfileID: 4589, ProductTypeID: 1, Price: 500, Quantity: 1, WidthMM: 1000, HeightMM: 600 },
	//		{ ProfileID: 4589, ProductTypeID: 2, Price: 50, Quantity: null, WidthMM: 100, HeightMM: 60 },
	//		{ ProfileID: 4589, ProductTypeID: 2, Price: 65, Quantity: null, WidthMM: 140, HeightMM: 84 },
	//		{ ProfileID: 4589, ProductTypeID: 2, Price: 75, Quantity: null, WidthMM: 200, HeightMM: 120 },
	//		{ ProfileID: 4589, ArtworkID: 7326, ProductTypeID: 1, Price: 1100, Quantity: 1, WidthMM: 1000, HeightMM: 600 },
	//		{ ProfileID: 4589, ArtworkID: 7326, ProductTypeID: 2, Price: 55, Quantity: null, WidthMM: 100, HeightMM: 60 },
	//		{ ProfileID: 4903, ArtworkID: 7017, ProductTypeID: 1, Price: 1100, Quantity: 1, WidthMM: 1000, HeightMM: 600 },
	//		{ ProfileID: 4903, ArtworkID: 7017, ProductTypeID: 2, Price: 55, Quantity: null, WidthMM: 100, HeightMM: 60 }
	//	])
	//})

};

exports.down = function(knex, Promise) {

	return Promise.all([
		dropTable(knex, 'ProductTypes'),
		dropTable(knex, 'Products'),
		dropTable(knex, 'ProductVariantGroups'),
		dropTable(knex, 'ProductVariants')
	])

};
