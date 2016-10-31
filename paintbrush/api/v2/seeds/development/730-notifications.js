exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('Notifications').del().then(function() {
    return Promise.join(
      // Inserts seed entries
      knex('Notifications').insert({ ID: 1, ProfileID: 1, Subject: 'Test Subject 1', Body: 'Test Body 1', SentDate: knex.raw('NOW()'), PriorityID: 1, TypeID: 1 }),
      knex('Notifications').insert({ ID: 2, ProfileID: 1, Subject: 'Test Subject 2', Body: 'Test Body 2', SentDate: knex.raw('NOW()'), PriorityID: 1, TypeID: 1 }),
      knex('Notifications').insert({ ID: 3, ProfileID: 1, Subject: 'Test Subject 3', Body: 'Test Body 3', SentDate: knex.raw('NOW()'), PriorityID: 1, TypeID: 1 }),
      knex('Notifications').insert({ ID: 4, ProfileID: 1, Subject: 'Test Subject 4', Body: 'Test Body 4', SentDate: knex.raw('NOW()'), PriorityID: 1, TypeID: 1 }),
      knex('Notifications').insert({ ID: 5, ProfileID: 1, Subject: 'Test Subject 5', Body: 'Test Body 5', SentDate: knex.raw('NOW()'), PriorityID: 1, TypeID: 1 }),
      knex('Notifications').insert({ ID: 6, ProfileID: 1, Subject: 'Test Subject 6', Body: 'Test Body 6', SentDate: knex.raw('NOW()'), PriorityID: 1, TypeID: 1 }),
      knex('Notifications').insert({ ID: 7, ProfileID: 1, Subject: 'Test Subject 7', Body: 'Test Body 7', SentDate: knex.raw('NOW()'), PriorityID: 1, TypeID: 1 }),
      knex('Notifications').insert({ ID: 8, ProfileID: 1, Subject: 'Test Subject 8', Body: 'Test Body 8', SentDate: knex.raw('NOW()'), PriorityID: 1, TypeID: 1 }),
      knex('Notifications').insert({ ID: 9, ProfileID: 1, Subject: 'Test Subject 9', Body: 'Test Body 9', SentDate: knex.raw('NOW()'), PriorityID: 1, TypeID: 1 }),
      knex('Notifications').insert({ ID: 10, ProfileID: 1, Subject: 'Test Subject 10', Body: 'Test Body 10 +extra text', SentDate: knex.raw('NOW()'), PriorityID: 1, TypeID: 1 }),

      knex('Notifications').insert({ ID: 21, ProfileID: 2, Subject: 'Test Subject 21', Body: 'Test Body 21', SentDate: knex.raw('NOW()'), PriorityID: 1, TypeID: 1 }),
      knex('Notifications').insert({ ID: 22, ProfileID: 2, Subject: 'Test Subject 22', Body: 'Test Body 22', SentDate: knex.raw('NOW()'), PriorityID: 1, TypeID: 1 })
    );
  });
};
