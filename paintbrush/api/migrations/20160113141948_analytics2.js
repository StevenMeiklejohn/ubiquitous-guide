
exports.up = function(knex, Promise) {

	//
	// Add ClientID to AnalyticEvents table
	//
	return knex.schema.hasColumn('AnalyticEvents', 'ClientID')
		.then(function (exists) {
			if (!exists) {
				return knex.schema.table('AnalyticEvents', function (t) {
					t.integer('EventID').notNullable();
					t.integer('ClientID').notNullable().defaultTo(1);
				})
				.then(function () {
					return knex('AnalyticEventTypes').insert({ Description: 'Archived Shortlist', ShortlistID: true, AutoRecorded: true })
				})
			}
		})



};

exports.down = function(knex, Promise) {

};
