
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('Styles').del().then(function() {
    return Promise.join(
      // Inserts seed entries
      knex('Styles').insert({ ID: 1, Style: 'Abstract' }),
      knex('Styles').insert({ ID: 2, Style: 'Graffiti' }),
      knex('Styles').insert({ ID: 3, Style: 'Graphic' }),
      knex('Styles').insert({ ID: 4, Style: 'Erotic' }),
      knex('Styles').insert({ ID: 5, Style: 'Impressionist' }),
      knex('Styles').insert({ ID: 6, Style: 'Expressionist' }),
      knex('Styles').insert({ ID: 7, Style: 'Cubist' }),
      knex('Styles').insert({ ID: 8, Style: 'Surreal' }),
      knex('Styles').insert({ ID: 9, Style: 'Minimalist' }),
      knex('Styles').insert({ ID: 10, Style: 'Conceptual' }),
      knex('Styles').insert({ ID: 11, Style: 'Photorealistic' }),
      knex('Styles').insert({ ID: 12, Style: 'Romantic' }),
      knex('Styles').insert({ ID: 13, Style: 'Modernist' }),
      knex('Styles').insert({ ID: 14, Style: 'Pop Art' }),
      knex('Styles').insert({ ID: 15, Style: 'Other' })
    );
  });
};
