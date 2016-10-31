
exports.up = function(knex, Promise) {
	return knex('AffiliateCodes').insert([{ Code: '1STMONTH', Discount: 81, DiscountDuration: 1 }, { Code: 'HOLIDAYSAVE10', Discount: 34, DiscountDuration: 6 }])
};

exports.down = function(knex, Promise) {
	return knex('AffiliateCodes').where('Code', '1STMONTH').orWhere('Code', 'HOLIDAYSAVE10').del();
};
