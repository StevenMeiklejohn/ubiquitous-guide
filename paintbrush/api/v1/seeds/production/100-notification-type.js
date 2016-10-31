
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
	return knex('NotificationTypes').del().then(function () {
    return Promise.join(
      // Inserts seed entries
      knex('NotificationTypes').insert({ ID: 1, Type: 'Task' }),
      knex('NotificationTypes').insert({ ID: 2, Type: 'Information' }),
      knex('NotificationTypes').insert({ ID: 3, Type: 'Message' }),
      knex('NotificationTypes').insert({ ID: 4, Type: 'Connection' })
    );
  });
};
