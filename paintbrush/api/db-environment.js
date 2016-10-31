//
// Set up global database connection for API (used by all versions)
//
if (!global.hasOwnProperty('db')) {

	var env = 'development';
	if (process.env.NODE_ENV !== null) {
		env = process.env.NODE_ENV;
	}
	console.log("Loading DB environment " + env);

	var db_connection = require('./knexfile')[env];
	console.log("DB connection is " + JSON.stringify(db_connection));

	var knex = require('knex')(db_connection);
	var Manager = require('knex-schema');

	// expose public database objects
	global.db = knex;
	global.dbNest = require('knexnest');
	global.dbManager = new Manager(knex);
}