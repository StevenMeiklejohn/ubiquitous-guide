
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('DimensionUnits').del().then(function() {
    return Promise.join(
      // Inserts seed entries
      knex('DimensionUnits').insert({ ID: 1, Name: 'Millimetres', Symbol: 'mm', Ratio_MM: 1 }),
      knex('DimensionUnits').insert({ ID: 2, Name: 'Centimetres ', Symbol: 'cm', Ratio_MM: 10 }),
      knex('DimensionUnits').insert({ ID: 3, Name: 'Metres', Symbol: 'm', Ratio_MM: 1000 }),
      knex('DimensionUnits').insert({ ID: 4, Name: 'Inches', Symbol: '"', Ratio_MM: 25.4 }),
      knex('DimensionUnits').insert({ ID: 5, Name: 'Feet', Symbol: '\'', Ratio_MM: 304.8 })

    );
  });
};
