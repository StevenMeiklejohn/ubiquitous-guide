
exports.up = function(knex) {

	//
	// Add DeviceBrowserID to AnalyticEvents
	//
	return knex.schema.hasColumn('AnalyticEvents', 'DeviceBrowserID')
		.then(function (exists) {
			if (!exists) {
				return knex.schema.table('AnalyticEvents', function (t) {
					t.integer('DeviceBrowserID');
				})
			}
		})


		//
		// Add 'Silent' activation flag to ActivCanvasQueue
		//
			.then(function() {
				return knex.schema.hasColumn('ActivCanvasQueue', 'Silent')
			})
			.then(function (exists) {
				if (!exists) {
					return knex.schema.table('ActivCanvasQueue', function (t) {
						t.boolean('Silent').notNullable().defaultTo(0);
					})
				}
			})


			//
			// Add 'Silent' activation flag to VuforiaTargets
			//
			.then(function() {
				return knex.schema.hasColumn('VuforiaTargets', 'Silent')
			})
			.then(function (exists) {
				if (!exists) {
					return knex.schema.table('VuforiaTargets', function (t) {
						t.boolean('Silent').notNullable().defaultTo(0);
					})
				}
			})


			.then(function() {
				return knex.raw('ALTER TABLE Devices CHANGE COLUMN PushToken PushToken VARCHAR(256) NULL DEFAULT NULL')
			});


};

exports.down = function(knex) {

};
