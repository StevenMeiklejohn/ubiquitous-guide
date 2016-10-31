
exports.up = function(knex, Promise) {
	return knex.schema.hasColumn('VuforiaTargets', 'BufferExceeded')
	  .then(function (exists) {
		  if (!exists) {
			  return knex.schema.table('VuforiaTargets', function (t) {
				  t.bool('BufferExceeded').notNullable().defaultTo(0);
			  });
		  }
	  })
};

exports.down = function(knex, Promise) {
	return knex.schema.hasColumn('VuforiaTargets', 'BufferExceeded')
	  .then(function (exists) {
		  if (exists) {
			  return knex.schema.table('VuforiaTargets', function (t) {
				  t.dropColumn('BufferExceeded');
			  });
		  }
	  })
};
