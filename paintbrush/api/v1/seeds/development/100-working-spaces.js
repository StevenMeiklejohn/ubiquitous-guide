
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('WorkingSpaces').del().then(function() {
    return Promise.join(
      // Inserts seed entries
      knex('WorkingSpaces').insert({ ID: 1, Description: 'Commercial galleries' }),
      knex('WorkingSpaces').insert({ ID: 2, Description: 'Arts/craft retailers' }),
      knex('WorkingSpaces').insert({ ID: 3, Description: 'Public Galleries' }),
      knex('WorkingSpaces').insert({ ID: 4, Description: 'Non-for profit galleries' }),
      knex('WorkingSpaces').insert({ ID: 5, Description: 'Commercial offices/spaces' }),
      knex('WorkingSpaces').insert({ ID: 6, Description: 'Hotels' }),
      knex('WorkingSpaces').insert({ ID: 7, Description: 'All/Any' }),
      knex('WorkingSpaces').insert({ ID: 8, Description: 'Group Exhibitions' }),
      knex('WorkingSpaces').insert({ ID: 9, Description: 'Solo Exhibitions' })
    );
  });
};
