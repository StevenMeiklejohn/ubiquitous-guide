global.should = require('should');
global.expect = require('expect');
global.request = require('supertest');

global.endpoint = 'http://127.0.0.1:3000';
global.token = '1234567890';
global.token2 = '1122334455';
global.testUser = {};
global.testUser2 = {};

setupDB = function() {
  // Setup Database
  if (!global.hasOwnProperty('db')) {

    var knex = require('knex')(
      require('../knexfile').development
    );

    var Manager = require('knex-schema');

    // expose public database objects
    global.db = knex;
    global.dbNest = require('knexnest');
    global.dbManager = new Manager(knex);
  }

  return db('AccessTokens')
  //.where('Token', token)
  .del()
  .then(function() {
    // Get last user as that is an Admin in our test data
    return db('Users')
    .join('UserGroups', 'UserGroups.UserID', '=', 'Users.ID')
    .join('Groups', 'UserGroups.GroupID', '=', 'Groups.ID')
    .leftJoin('Artists as a', 'a.UserID', 'Users.ID')
    .leftJoin('GalleryUsers as gu', 'gu.UserID', 'Users.ID')
    .leftJoin('Galleries as g', 'gu.GalleryID', 'g.ID')
    .leftJoin('Profiles as p', db.raw('coalesce(a.ProfileID, g.ProfileID)'), 'p.ID')
    .where('Groups.Name', '=', 'Administrators')
    .select('Users.*', db.raw('coalesce(a.ProfileID, g.ProfileID) as ProfileID'))
    .first()
  })
  .then(function(user) {
    testUser = user;
    console.log('API requests admin user: ' + user.ID);
    return db('Clients').first()
  })
  .then(function(client) {
    return db('AccessTokens').insert({
      UserID: testUser.ID,
      ClientID: client.ID,
      Token: token
    })
  })
  .then(function() {
    // non admin user
    return db('Users')
    .join('UserGroups', 'UserGroups.UserID', '=', 'Users.ID')
    .join('Groups', 'UserGroups.GroupID', '=', 'Groups.ID')
    .leftJoin('Artists as a', 'a.UserID', 'Users.ID')
    .leftJoin('GalleryUsers as gu', 'gu.UserID', 'Users.ID')
    .leftJoin('Galleries as g', 'gu.GalleryID', 'g.ID')
    .leftJoin('Profiles as p', db.raw('coalesce(a.ProfileID, g.ProfileID)'), 'p.ID')
    .where('Users.ID', '=', '2')
    .select('Users.*', db.raw('coalesce(a.ProfileID, g.ProfileID) as ProfileID'))
    .first()
  })
  .then(function(user) {
    testUser2 = user;
    console.log('API requests non admin user: ' + user.ID);
    return db('Clients').first()
  })
  .then(function(client) {
    return db('AccessTokens').insert({
      UserID: testUser2.ID,
      ClientID: client.ID,
      Token: token2
    })
  })
}
exports.setupDB = setupDB;

cleanupDB = function() {
  return db('AccessTokens').where('Token', token).del();
}
exports.cleanupDB = cleanupDB;