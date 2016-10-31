
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('Pricebands').del().then(function() {
    return Promise.join(
      // Inserts seed entries
      knex('Pricebands').insert({ ID: 1, Min: 0, Max: 100 }),
      knex('Pricebands').insert({ ID: 2, Min: 100, Max: 500 }),
      knex('Pricebands').insert({ ID: 3, Min: 500, Max: 1000 }),
      knex('Pricebands').insert({ ID: 4, Min: 1000, Max: 3000 }),
      knex('Pricebands').insert({ ID: 5, Min: 3000, Max: 5000 }),
      knex('Pricebands').insert({ ID: 6, Min: 5000, Max: 10000 }),
      knex('Pricebands').insert({ ID: 7, Min: 10000, Max: -1 })
    );
  });
};
