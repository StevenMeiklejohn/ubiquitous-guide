
exports.up = function(knex, Promise) {

		return knex.schema.hasColumn('Artworks', 'CustomShareURL')
			.then(function (exists) {
				if (!exists) {
					return knex.schema.table('Artworks', function (t) {
						t.string('CustomShareURL', 255);
					})
				}
			})

};

exports.down = function(knex, Promise) {
  
};
