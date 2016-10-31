var bcrypt = require('bcrypt-nodejs')


exports.seed = function(knex, Promise) {

  function insert_user(userID, email, password, is_admin) {
    return knex.first('ID')
              .from('Groups')
              .where({name: 'Registered Users'})
              .then(function(group) {
                return knex('Users')
                    .insert({ID: userID, Email: email, Password: password})
                    .then(function(user_id) {
                      return knex('UserGroups')
                                .insert({UserID: user_id, GroupID: group.ID})
                })
          });
  }

  function make_admin(user_id) {
    console.log(arguments);
    return knex.first('ID')
               .from('Groups')
               .where({name: 'Administrators'})
               .then(function(group) {
                 return knex('UserGroups')
                           .insert({UserID: user_id, GroupID: group.ID});
               });
  }

  // allow admin access to all API endpoints
  function add_admin_access () {
    // fetch the admin group ID
    return knex.first('ID').from('Groups').where({name: 'Administrators'})
    .then(function (group) {
      // add the admin endpoint to the admin group
      return knex('GroupEndpoints').insert({ GroupID: group.ID, EndpointID: 1 })
    })
  }

  // allow registered user access to all API endpoints
  function add_registered_user_access () {
    // fetch the admin group ID
    return knex.first('ID').from('Groups').where({name: 'Registered Users'})
    .then(function (group) {
      // add the user endpoint to the group
      return knex('GroupEndpoints').insert({ GroupID: group.ID, EndpointID: 2 })
    })
  }

  // Deletes ALL existing entries
  return knex('Users').del().then(function() {
    return knex('UserGroups').del();
  }).then(function() {
    return knex('Endpoints').del();
  }).then(function() {
    return knex('GroupEndpoints').del();
  }).then(function() {
    return Promise.join(
      add_admin_access(),
      add_registered_user_access()
    );
  });
};