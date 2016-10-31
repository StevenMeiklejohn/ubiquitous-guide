exports.seed = function(knex, Promise) {

  // Deletes ALL existing entries
  return knex('ClientAccessTokens').del().then(function() {
    return Promise.join(
      // Inserts seed entries
      knex('ClientAccessTokens').insert({ ID: 1, ClientID: 2, ClientName: 'ActivCanvas', Token: 'ac0074929c53c22e38fd98c4de1056099d2825b6c77a61d402bb2e74799b5a79' })
    );
  });
};
