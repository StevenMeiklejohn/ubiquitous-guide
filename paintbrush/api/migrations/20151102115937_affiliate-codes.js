
exports.up = function(knex, Promise) {

	// Create Affiliate Codes Table
	return knex.schema.hasTable('AffiliateCodes')
		.then(function (exists) {
			if (!exists) {
				return knex.schema.createTable('AffiliateCodes', function (t) {
					t.increments('ID').primary();
					t.integer('ProfileID');
					t.integer('SubscriptionPackageID');
					t.string('Code', 20).notNullable().unique();
					t.integer('Discount').notNullable().defaultTo(0);
					t.integer('DiscountDuration');
					t.float('Commission').notNullable().defaultTo(0);
					t.integer('TrialPeriod').notNullable().defaultTo(0);
					t.datetime('ExpiryDate');
					t.timestamps();
				})
				.then(function () {
					return knex.raw(
						'ALTER TABLE AffiliateCodes CHANGE COLUMN `created_at` created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, ' +
						'CHANGE COLUMN `updated_at` updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE NOW()'
					)
				});
			}
		})


		// Create Stripe Coupons Table
		.then(function () {
			return knex.schema.hasTable('PaymentProviders_Stripe_Coupons')
		})
		.then(function (exists) {
			if (!exists) {
				return knex.schema.createTable('PaymentProviders_Stripe_Coupons', function (t) {
					t.increments('ID').primary();
					t.integer('AffiliateCodeID').notNullable();
					t.string('StripeID', 20).notNullable();
					t.timestamps();
				})
				.then(function () {
					return knex.raw(
						'ALTER TABLE PaymentProviders_Stripe_Coupons CHANGE COLUMN `created_at` created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, ' +
						'CHANGE COLUMN `updated_at` updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE NOW()'
					)
				});
			}
		})


		

		// Update Stripe Subscriptions Table
		.then(function () {
			return knex.schema.hasColumn('PaymentProviders_Stripe_Subscriptions', 'StripeID');
		})
		.then(function (exists) {
			if (!exists) {
				return knex.schema.table('PaymentProviders_Stripe_Subscriptions', function (t) {
					t.string('StripeID', 20);
				});
			}
		})



		// Update Subscriptions Table
		.then(function () {
			return knex.schema.hasColumn('Subscriptions', 'AffiliateCodeID');
		})
		.then(function (exists) {
			if (!exists) {
				return knex.schema.table('Subscriptions', function (t) {
					t.integer('AffiliateCodeID');
				});
			}
		})


		// Update Registrations Table
		.then(function () {
			return knex.schema.hasColumn('Registrations', 'AffiliateCodeID');
		})
		.then(function (exists) {
			if (!exists) {
				return knex.schema.table('Registrations', function (t) {
					t.integer('AffiliateCodeID');
				});
			}
		})



		// Update Subscription Packages Table
		.then(function () {
			return knex.schema.hasColumn('SubscriptionPackages', 'MaxActivatedVideos');
		})
		.then(function (exists) {
			if (!exists) {
				return knex.schema.table('SubscriptionPackages', function (t) {
					t.integer('MaxActivatedArtworks');
					t.integer('MaxActivatedVideos');
				})
				.then(function () {
					return knex('SubscriptionPackages').where('ID', 1).update({ MaxActivatedArtworks: 0, MaxActivatedVideos: 0 })
				})
				.then(function () {
					return knex('SubscriptionPackages').where('ID', 2).update({ MaxActivatedArtworks: 25, MaxActivatedVideos: 5 })
				})
				
			}
		})


		// Fix typo in bio question
		.then(function () {
			return knex('ArtistQuestions').where('ID', 4).update({ Text: 'Is there anything specific about the way you create your art that is unique to you?' })
		})



		// Insert Test Data
		.then(function () {
			return knex('AffiliateCodes').insert([
				{
					Code: 'TEST1',
					Discount: 50
				},
				{
					Code: 'TEST2',
					Discount: 25,
					TrialPeriod: 3
				},
				{
					Code: 'TEST3',
					Discount: 45,
					SubscriptionPackageID: 3
				},
				{
					Code: 'TEST4',
					Discount: 90,
					ExpiryDate: new Date('2015-01-01')
				},
				{
					Code: 'TEST5',
					Discount: 75,
					DiscountDuration: 6,
					ExpiryDate: new Date('2016-01-01')
				},
				{
					Code: 'TEST6',
					TrialPeriod: 6
				}
			]);
		})




};

exports.down = function (knex, Promise) {

	// Remove Affiliate Codes Table
	return knex.schema.hasTable('AffiliateCodes')
		.then(function (exists) {
			if (exists) {
				return knex.schema.dropTable('AffiliateCodes');
			}
		})


		// Update Subscriptions Table
		.then(function () {
			return knex.schema.hasColumn('Subscriptions', 'AffiliateCodeID');
		})
		.then(function (exists) {
			if (exists) {
				return knex.schema.table('Subscriptions', function (t) {
					t.dropColumn('AffiliateCodeID');
				});
			}
		})


		// Update Registrations Table
		.then(function () {
			return knex.schema.hasColumn('Registrations', 'AffiliateCodeID');
		})
		.then(function (exists) {
			if (exists) {
				return knex.schema.table('Registrations', function (t) {
					t.dropColumn('AffiliateCodeID');
				});
			}
		})


		// Update Stripe Subscriptions Table
		.then(function () {
			return knex.schema.hasColumn('PaymentProviders_Stripe_Subscriptions', 'StripeID');
		})
		.then(function (exists) {
			if (exists) {
				return knex.schema.table('PaymentProviders_Stripe_Subscriptions', function (t) {
					t.dropColumn('StripeID');
				});
			}
		})


};
