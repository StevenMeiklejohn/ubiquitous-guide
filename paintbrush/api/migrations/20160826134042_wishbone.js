
exports.up = function(knex, Promise) {

	return knex('Clients').insert({
		Name: 'Wishbone Interactive',
		Login: 'Wishbone',
		Secret: 'jvTb4sjZCF2AfPDwjTNxCd1hq5NXwFDXNQzgIm4526g4csHoG4t830oKme'
	})
	.then(function () {
	  	return knex.schema.hasColumn('DeviceBrowsers', 'OneSignalUserID')
	})
	.then(function (exists) {
		if (!exists) {
			return knex.schema.table('DeviceBrowsers', function (t) {
				t.bool('Latest').defaultTo(0);
				t.string('PushToken', 256);
				t.string('OneSignalUserID', 36);
				t.integer('ClientID').defaultTo(1);
			});
		}
	});
};

exports.down = function(knex, Promise) {
	return knex('Clients').where('Login', 'Wishbone').del()
	  .then(function () {
		  return knex.schema.hasColumn('DeviceBrowsers', 'OneSignalUserID')
	  })
	  .then(function (exists) {
		  if (exists) {
			  return knex.schema.table('DeviceBrowsers', function (t) {
				  t.dropColumn('Latest');
				  t.dropColumn('PushToken');
				  t.dropColumn('OneSignalUserID');
				  t.dropColumn('ClientID');
			  });
		  }
	  });
};
