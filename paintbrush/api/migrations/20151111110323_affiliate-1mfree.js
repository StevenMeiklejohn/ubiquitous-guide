
exports.up = function(knex, Promise) {
	return knex('AffiliateCodes').insert([{ Code: '1MFREE', TrialPeriod: 1 }, { Code: 'AVART123', TrialPeriod: 1 }, { Code: 'GWART123', TrialPeriod: 1 }])
};

exports.down = function(knex, Promise) {
	return knex('AffiliateCodes').where('Code', '1MFREE').orWhere('Code', 'AVART123').orWhere('Code', 'GWART123').del();
};
