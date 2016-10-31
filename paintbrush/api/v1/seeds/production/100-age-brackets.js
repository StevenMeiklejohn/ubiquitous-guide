
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('AgeBrackets').del().then(function() {
    return Promise.join(
      // Inserts seed entries
      knex('AgeBrackets').insert({ ID: 1, Description: 'Under 18' }),
      knex('AgeBrackets').insert({ ID: 2, Description: '18 - 25' }),
      knex('AgeBrackets').insert({ ID: 3, Description: '25 - 35' }),
      knex('AgeBrackets').insert({ ID: 4, Description: '35 - 45' }),
      knex('AgeBrackets').insert({ ID: 5, Description: '45 - 55' }),
      knex('AgeBrackets').insert({ ID: 6, Description: '55 - 65' }),
      knex('AgeBrackets').insert({ ID: 7, Description: 'Over 65' })
    );
  });
};
