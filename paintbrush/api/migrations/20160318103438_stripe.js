
exports.up = function(knex, Promise) {

	return knex.schema.hasColumn('AffiliateCodes', 'InitialFee')
	  .then(function (exists) {
		  if (!exists) {
			  return knex.schema.table('AffiliateCodes', function (t) {
				  t.integer('InitialFee');
				  t.integer('DiscountFixed');
			  });
		  }
	  })

	  .then(function() {
		  return knex('AffiliateCodes').where({ Code: 'ARTBNBFOUNDER' }).update({ Discount: 100, InitialFee: 2000 });
	  })

};

exports.down = function(knex, Promise) {

	return knex.schema.hasColumn('AffiliateCodes', 'FixedFee')
	  .then(function (exists) {
		  if (exists) {
			  return knex.schema.table('AffiliateCodes', function (t) {
				  t.dropColumn('InitialFee');
				  t.dropColumn('DiscountFixed');
			  });
		  }
	  })

};
