
exports.up = function (knex, Promise) {

	return knex.schema.hasTable('ActivCanvasStatus').then(function (exists) {
		if (!exists) {
			return knex.schema.createTable('ActivCanvasStatus', function (table) {
				table.increments('ID').primary();
				table.string('Description', 20).notNullable();
			})
			.then(function () {
				return knex('ActivCanvasStatus').insert({ 'Description': 'Inactive' }, { 'Description': 'Pending' }, { 'Description': 'Activated' });
			})
			.then(function () {
				return knex.schema.hasColumn('Artists', 'ActivCanvasStatusID');
			})
			.then(function (_exists) {
				if (!_exists) {
					return knex.schema.table('Artists', function (_table) {
						_table.integer('ActivCanvasStatusID').notNullable().defaultTo(1);
					})
				}
			});
		}
	});
};

exports.down = function(knex, Promise) {
	return knex.raw('DROP TABLE IF EXISTS `ActivCanvasStatus`; ALTER TABLE `Artists` DROP COLUMN `ActivCanvasStatusID`;')
};
