exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('Connections').del().then(function() {
    return Promise.join(
      knex('Connections').insert({ ProfileID: 1, ConnectedProfileID: 2, Message: 'Seed test request (6>1)', Accepted: 1 }),
      knex('Connections').insert({ ProfileID: 1, ConnectedProfileID: 4, Message: 'Seed test request (6>1)', Accepted: 1 }),
      knex('Connections').insert({ ProfileID: 2, ConnectedProfileID: 1, Message: 'Seed test request (2>1)' }),
      knex('Connections').insert({ ProfileID: 2, ConnectedProfileID: 3, Message: 'Seed test request (2>3)' }),
      knex('Connections').insert({ ProfileID: 3, ConnectedProfileID: 1, Message: 'Seed test request (3>1)' }),
      knex('Connections').insert({ ProfileID: 4, ConnectedProfileID: 1, Message: 'Seed test request (4>1)', Accepted: 0 }),
      knex('Connections').insert({ ProfileID: 5, ConnectedProfileID: 1, Message: 'Seed test request (5>1)', Accepted: 0 }),
      knex('Connections').insert({ ProfileID: 6, ConnectedProfileID: 1, Message: 'Seed test request (6>1)', Accepted: 1 }),
      knex('Connections').insert({ ProfileID: 7, ConnectedProfileID: 1, Message: 'Seed test request (7>1)', Accepted: 1 }),
      knex('Connections').insert({ ProfileID: 8, ConnectedProfileID: 1, Message: 'Seed test request (8>1)', Accepted: -1 }),
      knex('Connections').insert({ ProfileID: 9, ConnectedProfileID: 1, Message: 'Seed test request (9>1)', Accepted: -1 })
    );
  });
};
