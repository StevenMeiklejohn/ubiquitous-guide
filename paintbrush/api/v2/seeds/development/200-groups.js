
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('Groups').del().then(function() {
    return Promise.join(
      // Inserts seed entries
      knex('Groups').insert({ ID:1, Name: 'Registered Users', Description: 'General group applies to all users in the system' }),
      knex('Groups').insert({ ID:2, Name: 'Administrators', Description: 'Administrator group provides members with additional access within the system' }),
      knex('Groups').insert({ ID:3, Name: 'ActivCanvasApp', Description: 'ActivCanvas API access' })
    );
  });
};
