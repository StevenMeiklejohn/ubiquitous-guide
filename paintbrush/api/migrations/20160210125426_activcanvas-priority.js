
exports.up = function(knex) {

		return knex.schema.hasTable('ActivCanvasQueuePriority')
			.then(function (exists) {
				if (!exists) {
					return knex.schema.createTable('ActivCanvasQueuePriority', function (t) {
						t.increments('ID').primary();
						t.string('Description', 100).notNullable();
					})
					.then(function() {
						return knex('ActivCanvasQueuePriority').insert([
							{ ID: 1, Description: 'Background - No notifications' },
							{ ID: 2, Description: 'Normal' },
							{ ID: 3, Description: 'High - Premium users' }
						])
					})

				}
			})

			.then(function() {
				return knex.schema.hasColumn('ActivCanvasQueue', 'Priority')
			})
			.then(function (exists) {
				if (!exists) {
					return knex.schema.table('ActivCanvasQueue', function (t) {
						t.integer('Priority').notNullable().defaultTo(2);
					})
				}
			})

			.then(function() {
				return knex.schema.hasColumn('ActivCanvasQueue', 'Silent');
			})
			.then(function(exists) {
				if (exists) {
					return knex.raw('UPDATE ActivCanvasQueue SET Priority = 1 WHERE Silent = 1')
						.then(function() {
							return knex.schema.table('ActivCanvasQueue', function (t) {
								t.dropColumn('Silent');
							})
						})
				}
			})


			.then(function() {
				return knex.schema.hasColumn('VuforiaTargets', 'Priority')
			})
			.then(function (exists) {
				if (!exists) {
					return knex.schema.table('VuforiaTargets', function (t) {
						t.integer('Priority').notNullable().defaultTo(2);
					})
				}
			})
			.then(function() {
				return knex.schema.hasColumn('ActivCanvasQueue', 'Silent');
			})
			.then(function(exists) {
				if (exists) {
					return knex.raw('UPDATE VuforiaTargets SET Priority = 1 WHERE Silent = 1')
						.then(function() {
							return knex.schema.table('ActivCanvasQueue', function (t) {
								t.dropColumn('Silent');
							})
						})
				}
			})


			.then(function() {
				return knex.schema.hasColumn('ActivCanvasQueue', 'Deactivate');
			})
			.then(function(exists) {
				if (!exists) {
					return knex.schema.table('ActivCanvasQueue', function (t) {
						t.boolean('Deactivate').notNullable().defaultTo(false);
					})
				}
			})

			.then(function() {
				return knex.schema.hasColumn('VuforiaTargets', 'Deactivate');
			})
			.then(function(exists) {
				if (!exists) {
					return knex.schema.table('VuforiaTargets', function (t) {
						t.boolean('Deactivate').notNullable().defaultTo(false);
					})
				}
			})


			.then(function() {
				return knex.schema.hasColumn('VuforiaTargets', 'AdjustedContrastOverride');
			})
			.then(function(exists) {
				if (!exists) {
					return knex.schema.table('VuforiaTargets', function (t) {
						t.integer('AdjustedContrastOverride');
					})
				}
			})

};

exports.down = function(knex) {

};
