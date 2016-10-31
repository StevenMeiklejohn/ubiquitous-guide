exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
	return knex('ActivCanvasStatus').del().then(function () {
    return Promise.join(
      // Inserts seed entries
      knex('ActivCanvasStatus').insert({ ID: 1, Description: 'Inactive' }),
      knex('ActivCanvasStatus').insert({ ID: 2, Description: 'Pending' }),
      knex('ActivCanvasStatus').insert({ ID: 3, Description: 'Activated' })

    );
  });
};
