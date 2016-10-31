exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('ArtistQuestionTypes').del().then(function() {
    return Promise.join(
      // Inserts seed entries
      knex('ArtistQuestionTypes').insert({ ID: 1, Type: 'Method/Practice' }),
      knex('ArtistQuestionTypes').insert({ ID: 2, Type: 'Passion/Inspiration' }),
      knex('ArtistQuestionTypes').insert({ ID: 3, Type: 'Audience' })
    );
  });
};
