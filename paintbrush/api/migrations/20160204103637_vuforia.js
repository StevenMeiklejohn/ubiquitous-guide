
exports.up = function(knex) {

	//
	// Create VuforiaRequests table
	//
	return knex.schema.hasTable('VuforiaRequests')
		.then(function (exists) {
			if (!exists) {
				return knex.schema.createTable('VuforiaRequests', function (t) {
					t.increments('ID').primary();
					t.date('Date').notNullable();
					t.integer('TotalRequests').notNullable().defaultTo(0);
					t.integer('FailedRequests').notNullable().defaultTo(0);
				})
			}
		})


		.then(function() {
			return knex.schema.hasColumn('ActivCanvasQueue', 'TargetCreatedDate')
		})
		.then(function (exists) {
			if (!exists) {
				return knex.schema.table('ActivCanvasQueue', function (t) {
					t.datetime('TargetCreatedDate');
					t.integer('UploadAttempts').notNullable().defaultTo(0);
					t.integer('VuforiaTargetID');
				})
			}
		})


		.then(function() {
			return knex.schema.hasColumn('VuforiaTargets', 'BadImage')
		})
		.then(function (exists) {
			if (!exists) {
				return knex.schema.table('VuforiaTargets', function (t) {
					t.integer('BadImage').notNullable().defaultTo(0);
					t.integer('AdjustedContrast').notNullable().defaultTo(0);
					t.integer('InitialTrackingRating');
				})
			}
		})

};

exports.down = function(knex) {

	//
	// Remove VuforiaRequests table
	//
	return knex.schema.hasTable('VuforiaRequests')
		.then(function (exists) {
			if (exists) {
				return knex.schema.dropTable('VuforiaRequests');
			}
		})
};
