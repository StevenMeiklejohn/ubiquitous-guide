exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('Disciplines').del().then(function() {
    return Promise.join(
      // Inserts seed entries
      knex('Disciplines').insert({ ID: 1, Description: 'Painter' }),
      knex('Disciplines').insert({ ID: 2, Description: 'Sculptor' })
    );
  });
};
