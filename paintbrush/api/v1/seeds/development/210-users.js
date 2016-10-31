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
      insert_user(1, 'artist1@test',   bcrypt.hashSync('a1')),
      insert_user(2, 'artist2@test',   bcrypt.hashSync('a2')),
      insert_user(3, 'artist3@test',   bcrypt.hashSync('a3')),
      insert_user(4, 'artist4@test',   bcrypt.hashSync('test')),
      insert_user(5, 'artist5@test',   bcrypt.hashSync('test')),
      insert_user(6, 'gallery1@test',  bcrypt.hashSync('g1')),
      insert_user(7, 'gallery2@test',  bcrypt.hashSync('g2')),
      insert_user(8, 'gallery3a@test', bcrypt.hashSync('g3a')),
      insert_user(9, 'gallery3b@test', bcrypt.hashSync('g3b')),
      insert_user(10, 'gallery4@test', bcrypt.hashSync('g4')),
      make_admin(1),
      add_admin_access(),
      add_registered_user_access()
    );
  });
};