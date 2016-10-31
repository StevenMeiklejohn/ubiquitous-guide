exports.seed = function(knex, Promise) {

  // Deletes ALL existing entries
  return knex('ShortlistTypes').del().then(function() {
    return Promise.join(
      // Inserts seed entries
      knex('ShortlistTypes').insert({ ID: 1, Description: 'Artist' }),
  	  knex('ShortlistTypes').insert({ ID: 2, Description: 'Artwork' })
    );
  });
}
