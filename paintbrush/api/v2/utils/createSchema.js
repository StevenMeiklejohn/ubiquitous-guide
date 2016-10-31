try {

  // Setup Database
  if (!global.hasOwnProperty('db')) {
    // Support multiple DB environments (supports testing via www.codeship.com environment variables)
    node_env = 'development';
    if (process.env.NODE_ENV != null) {
      node_env = process.env.NODE_ENV;
    }

    console.log("Loading DB environment " + node_env);
    db_env = require('../knexfile')[node_env];
    console.log("DB env is " + JSON.stringify(db_env));
    var knex = require('knex')(db_env);
    var Manager = require('knex-schema');

    // expose public database objects
    global.db = knex;
    global.dbNest = require('knexnest');
    global.dbManager = new Manager(knex);

    if (node_env != 'test') {
      require('./loadModels').loadModels(function () {
        process.exit(0);
      })
    }
  }
} catch(e) {
  console.log(e);
  process.exit(1);
}