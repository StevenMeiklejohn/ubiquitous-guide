
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('ArtistTypes').del().then(function() {
    return Promise.join(
      // Inserts seed entries
      knex('ArtistTypes').insert({ ID: 1, Type: 'Emerging', Description: 'Emerging' }),
      knex('ArtistTypes').insert({ ID: 2, Type: 'Student', Description: 'Student' }),
      knex('ArtistTypes').insert({ ID: 3, Type: 'Recent Graduate', Description: 'Recent Graduate' }),
      knex('ArtistTypes').insert({ ID: 4, Type: 'Established', Description: 'Established' }),
      knex('ArtistTypes').insert({ ID: 5, Type: 'Professional', Description: 'Professional' }),
      knex('ArtistTypes').insert({ ID: 6, Type: 'Hobbyist', Description: 'Hobbyist' }),
      knex('ArtistTypes').insert({ ID: 7, Type: 'Craftsperson', Description: 'Craftsperson' }),
      knex('ArtistTypes').insert({ ID: 8, Type: 'Self-trained', Description: 'Self-trained' }),
      knex('ArtistTypes').insert({ ID: 9, Type: 'Re-emerging', Description: 'Re-emerging' })

    );
  });
};
