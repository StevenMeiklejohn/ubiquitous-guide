
exports.up = function(knex, Promise) {
	return knex('NotificationTypes').insert({ ID: 5, Type: 'ActivCanvas' });
};

exports.down = function(knex, Promise) {
	return knex('NotificationTypes').where({ ID: 5, Type: 'ActivCanvas' }).del();
};
