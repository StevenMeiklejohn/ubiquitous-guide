
exports.up = function(knex) {
	return knex('AffiliateCodes').insert([{ Code: 'REVIVE' }])
};

exports.down = function(knex) {
	return knex('AffiliateCodes').where('Code', 'REVIVE').del();
};