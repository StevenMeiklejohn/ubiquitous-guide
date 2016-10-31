exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('ClientGroups').del().then(function() {
    return Promise.join(
      // Inserts seed entries
      knex('ClientGroups').insert({ ID: 1, ClientID: 2, GroupID: 3 })
    );
  });
};