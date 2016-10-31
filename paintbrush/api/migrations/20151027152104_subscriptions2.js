
exports.up = function(knex, Promise) {
	
	// Create Payment Methods Table
	return knex.schema.hasTable('PaymentMethods')
		.then(function (exists) {
			if (!exists) {
				return knex.schema.createTable('PaymentMethods', function (t) {
					t.increments('ID').primary();
					t.integer('ProfileID').notNullable();
					t.integer('PaymentProviderID').notNullable();

					t.datetime('ValidTo');
					t.datetime('LastUsed');
					t.timestamps();
				});
			}
		})

		// Update Subscriptions Table
		.then(function () {
			return knex.schema.hasColumn('Subscriptions', 'PaymentMethodID');
		})
		.then(function (exists) {
			if (!exists) {
				return knex.schema.table('Subscriptions', function (t) {
					t.integer('PaymentMethodID').notNullable();
					t.dropColumn('PaymentProviderID');
				});
			}
		})



		// Update Subscriptions Table
		.then(function () {
			return knex.schema.hasColumn('PaymentProviders_Stripe_CustomerCards', 'PaymentMethodID');
		})
		.then(function (exists) {
			if (!exists) {
				return knex.schema.table('PaymentProviders_Stripe_CustomerCards', function (t) {
					t.integer('PaymentMethodID');
				});
			}
		})




		//
		//	Fix Timestamp Columns
		//
		.then(function () {
			return knex.raw(
				'ALTER TABLE PaymentMethods CHANGE COLUMN `created_at` created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, ' +
				'CHANGE COLUMN `updated_at` updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE NOW()'
			)
		})




		.then(function () {
			return knex('Videos').insert({
				ProfileID: 4535,
				Name: 'ActivCanvas Highlights',
				Description: 'ActivCanvas Highlights',
				VideoURI: 'https://arn-videos-in-development.s3-eu-west-1.amazonaws.com/6f316968-e53a-46ef-9013-22e18941bcfe.mov',
				Width: 1920,
				Height: 1080,
				Deleted: 0,
				FileSize: 121038358,
				FileName: 'ActivCanvas Launch Highlights.mov',
				Duration: 118.49
			});
		})


		.then(function (result) {
			var id = result[0];

			return knex('VideoTranscodes').insert([{
				VideoID: id,
				TypeID: 1,
				VideoURI: 'https://s3-eu-west-1.amazonaws.com/arn-videos-development/test_activcanvas-highlights_mp4/320.mp4',
				Width: 0,
				Height: 0,
				Complete: 1,
				JobID: '1445351814607-wrxhg5'
			}, {
				VideoID: id,
				TypeID: 2,
				VideoURI: 'https://s3-eu-west-1.amazonaws.com/arn-videos-development/test_activcanvas-highlights_hls/index.m3u8',
				Width: 0,
				Height: 0,
				Complete: 1,
				JobID: '1445351814773-fojm1k'
			}]);
		})



};

exports.down = function (knex, Promise) {

	// Remove Payment Methods Table
	return knex.schema.hasTable('PaymentMethods')
		.then(function (exists) {
			if (exists) {
				return knex.schema.dropTable('PaymentMethods');
			}
		})

		// Update Subscriptions Table
		.then(function () {
			return knex.schema.hasColumn('Subscriptions', 'PaymentMethodID');
		})
		.then(function (exists) {
			if (exists) {
				return knex.schema.table('Subscriptions', function (t) {
					t.dropColumn('PaymentMethodID').notNullable();
					t.integer('PaymentProviderID').notNullable();
				});
			}
		})

};
