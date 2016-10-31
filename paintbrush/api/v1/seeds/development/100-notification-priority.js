
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('NotificationPriority').del().then(function() {
    return Promise.join(
      // Inserts seed entries
      knex('NotificationPriority').insert({ ID: 1, Description: 'Very Low' }),
      knex('NotificationPriority').insert({ ID: 2, Description: 'Low' }),
      knex('NotificationPriority').insert({ ID: 3, Description: 'General' }),
      knex('NotificationPriority').insert({ ID: 4, Description: 'Important' }),
      knex('NotificationPriority').insert({ ID: 5, Description: 'Urgent' })
    );
  });
};
