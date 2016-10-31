exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('ArtworkTypes').del().then(function() {
    return Promise.join(
      // Inserts seed entries
      knex('ArtworkTypes').insert({ ID: 1, Type: 'Digital Art', Description: 'Digital Art' }),
      knex('ArtworkTypes').insert({ ID: 2, Type: 'Fiber Art', Description: 'Fiber Art' }),
      knex('ArtworkTypes').insert({ ID: 3, Type: 'Glass', Description: 'Glass' }),
      knex('ArtworkTypes').insert({ ID: 4, Type: 'Installation', Description: 'Installation' }),
      knex('ArtworkTypes').insert({ ID: 5, Type: 'Mixed Media', Description: 'Mixed Media' }),
      knex('ArtworkTypes').insert({ ID: 6, Type: 'Other', Description: 'Other' }),
      knex('ArtworkTypes').insert({ ID: 7, Type: 'Painting', Description: 'Painting' }),
      knex('ArtworkTypes').insert({ ID: 8, Type: 'Performance', Description: 'Performance' }),
      knex('ArtworkTypes').insert({ ID: 9, Type: 'Photography', Description: 'Photography' }),
      knex('ArtworkTypes').insert({ ID: 10, Type: 'Screen Printing', Description: 'Screen Printing' }),
      knex('ArtworkTypes').insert({ ID: 11, Type: 'Sculpture', Description: 'Sculpture' })
    );
  });
};
