exports.seed = function(knex, Promise) {

  // Deletes ALL existing entries
  return knex('Biographies').del().then(function() {
    return Promise.join(
      // Inserts seed entries
      knex('Biographies').insert({ ID: 1, ProfileID: 1, Description: 'Test biography for profile #1' }),
  	  knex('Biographies').insert({ ID: 2, ProfileID: 2, Description: 'Test biography for profile #2' })
    );
  });
}
