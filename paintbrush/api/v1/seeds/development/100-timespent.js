
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('ArtworkTimeSpent').del().then(function() {
    return Promise.join(
      // Inserts seed entries
      knex('ArtworkTimeSpent').insert({ ID: 1, Description: 'Under 24 hours' }),
      knex('ArtworkTimeSpent').insert({ ID: 2, Description: '24 - 50 hours' }),
      knex('ArtworkTimeSpent').insert({ ID: 3, Description: '50 - 150 hours' }),
      knex('ArtworkTimeSpent').insert({ ID: 4, Description: '150 - 300 hours' }),
      knex('ArtworkTimeSpent').insert({ ID: 5, Description: 'Over 300 hours' })
    );
  });
};
