exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('ArtworkStatus').del().then(function() {
    return Promise.join(
      // Inserts seed entries
      knex('ArtworkStatus').insert({ ID: 1, Status: 'Currently available'}),
      knex('ArtworkStatus').insert({ ID: 2, Status: 'Currently in an exhibition'}),
      knex('ArtworkStatus').insert({ ID: 3, Status: 'Sold' })

    );
  });
};
