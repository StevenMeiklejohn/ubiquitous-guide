exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('Clients').del().then(function() {
    return Promise.join(
      // Inserts seed entries
      knex('Clients').insert({ ID: 1, Name: 'Dev', Login: 'Dev', Secret: '12345' }),
      knex('Clients').insert({ ID: 2, Name: 'ActivCanvas App', Login: 'ActivCanvas', Secret: 'ac0074929c53c22e38fd98c4de1056099d2825b6c77a61d402bb2e74799b5a79' })
    );
  });
};
