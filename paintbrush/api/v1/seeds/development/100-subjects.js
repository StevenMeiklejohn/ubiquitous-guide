
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('Subjects').del().then(function() {
    return Promise.join(
      // Inserts seed entries
      knex('Subjects').insert({ ID: 1, Subject: 'Nude' }),
      knex('Subjects').insert({ ID: 2, Subject: 'Portrait and People' }),
      knex('Subjects').insert({ ID: 3, Subject: 'Cityscape' }),
      knex('Subjects').insert({ ID: 4, Subject: 'Landscape' }),
      knex('Subjects').insert({ ID: 5, Subject: 'Botany' }),
      knex('Subjects').insert({ ID: 6, Subject: 'Animals' }),
      knex('Subjects').insert({ ID: 7, Subject: 'Seascape' }),
      knex('Subjects').insert({ ID: 8, Subject: 'Abstract' }),
      knex('Subjects').insert({ ID: 9, Subject: 'Mystical' }),
      knex('Subjects').insert({ ID: 10, Subject: 'Transport' }),
      knex('Subjects').insert({ ID: 11, Subject: 'Interiors and domestic scenes' }),
      knex('Subjects').insert({ ID: 12, Subject: 'Architecture' }),
      knex('Subjects').insert({ ID: 13, Subject: 'Religious' }),
      knex('Subjects').insert({ ID: 14, Subject: 'Pop culture and fashion' })
    );
  });
};
