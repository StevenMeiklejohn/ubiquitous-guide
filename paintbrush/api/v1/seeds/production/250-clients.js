exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('Clients').del().then(function() {
    return Promise.join(
      // Inserts seed entries
      knex('Clients').insert({ ID: 1, Name: 'Members Portal', Login: 'MembersPortal', Secret: '828147bdf3b6a1880f394e960989a457' }),
      knex('Clients').insert({ ID: 2, Name: 'ActivCanvas App', Login: 'ActivCanvas', Secret: null })
    );
  });
};
