
exports.up = function(knex, Promise) {

	// Subscriptions
	return knex.schema.hasTable('Subscriptions')
		.then(function (exists) {
			if (!exists) {
				return knex.schema.createTable('Subscriptions', function (t) {
					t.increments('ID').primary();
					t.integer('ProfileID').notNullable();
					t.integer('PaymentProviderID').notNullable();
					t.integer('PackageID').notNullable();
					t.integer('StatusID').notNullable();
					t.datetime('StartDate');
					t.datetime('EndDate');
					t.timestamps();
				});
			}
		})

		// SubscriptionStatus
		.then(function () {
			return knex.schema.hasTable('SubscriptionStatus')
		})
		.then(function (exists) {
			if (!exists) {
				return knex.schema.createTable('SubscriptionStatus', function (t) {
					t.increments('ID').primary();
					t.string('Status', 20).notNullable();
					t.timestamps();
				});
			}
		})

		// SubscriptionPackages
		.then(function () {
			return knex.schema.hasTable('SubscriptionPackages')
		})
		.then(function (exists) {
			if (!exists) {
				return knex.schema.createTable('SubscriptionPackages', function (t) {
					t.increments('ID').primary();
					t.string('Name', 25).notNullable();
					t.string('Description', 1000).notNullable();
					t.bool('Artist').notNullable().defaultTo(0);
					t.bool('Gallery').notNullable().defaultTo(0);
					t.bool('Consumer').notNullable().defaultTo(0);
					t.decimal('Price').notNullable().defaultTo(0);
					// interval?
					t.timestamps();
				});
			}
		})

		// PaymentProviders
		.then(function () {
			return knex.schema.hasTable('PaymentProviders')
		})
		.then(function (exists) {
			if (!exists) {
				return knex.schema.createTable('PaymentProviders', function (t) {
					t.increments('ID').primary();
					t.string('Name', 50).notNullable();
					t.bool('Enabled').notNullable().defaultTo(0);
					t.timestamps();
				});
			}
		})

		// PaymentProviders_Stripe_Customers
		.then(function () {
			return knex.schema.hasTable('PaymentProviders_Stripe_Customers')
		})
		.then(function (exists) {
			if (!exists) {
				return knex.schema.createTable('PaymentProviders_Stripe_Customers', function (t) {
					t.increments('ID').primary();
					t.integer('ProfileID').notNullable();
					t.string('StripeID', 64).notNullable();
					t.timestamps();
				});
			}
		})

		// PaymentProviders_Stripe_CustomerCards
		.then(function () {
			return knex.schema.hasTable('PaymentProviders_Stripe_CustomerCards')
		})
		.then(function (exists) {
			if (!exists) {
				return knex.schema.createTable('PaymentProviders_Stripe_CustomerCards', function (t) {
					t.increments('ID').primary();
					t.integer('CustomerID');
					t.string('Token', 64).notNullable();
					t.string('StripeID', 64);
					t.string('Country', 3);
					t.string('Currency', 3);
					t.string('CvcCheck', 10);
					t.string('Brand', 20);			// Visa/MasterCard
					t.string('Last4', 4);
					t.string('Funding', 10);		// credit/debit
					t.integer('ExpMonth');
					t.integer('ExpYear');
					t.timestamps();
				});
			}
		})

		// PaymentProviders_Stripe_Subscriptions
		.then(function () {
			return knex.schema.hasTable('PaymentProviders_Stripe_Subscriptions')
		})
		.then(function (exists) {
			if (!exists) {
				return knex.schema.createTable('PaymentProviders_Stripe_Subscriptions', function (t) {
					t.increments('ID').primary();
					t.integer('CustomerID').notNullable();
					t.integer('CustomerCardID').notNullable();
					t.integer('PlanID').notNullable();
					t.integer('SubscriptionID').notNullable();
					t.timestamps();
				});
			}
		})

		// PaymentProviders_Stripe_Plans
		.then(function () {
			return knex.schema.hasTable('PaymentProviders_Stripe_Plans')
		})
		.then(function (exists) {
			if (!exists) {
				return knex.schema.createTable('PaymentProviders_Stripe_Plans', function (t) {
					t.increments('ID').primary();
					t.integer('SubscriptionPackageID').notNullable();
					t.string('StripeID', 25).notNullable();
					t.timestamps();
				});
			}
		})

		// Profiles
		.then(function () {
			return knex.schema.hasColumn('Profiles', 'ActivCanvasLink');
		})
		.then(function (exists) {
			if (!exists) {
				return knex.schema.table('Profiles', function (t) {
					t.string('ActivCanvasLink', 255);
					t.string('ActivCanvasLinkText', 40);
				});
			}
		})



		//
		//	Fix Timestamp Columns
		//

		.then(function () {
			return knex.raw(
				'ALTER TABLE PaymentProviders_Stripe_Plans CHANGE COLUMN `created_at` created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, ' +
				'CHANGE COLUMN `updated_at` updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE NOW()'
			)
		})
		.then(function () {
			return knex.raw(
				'ALTER TABLE PaymentProviders_Stripe_Subscriptions CHANGE COLUMN `created_at` created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, ' +
				'CHANGE COLUMN `updated_at` updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE NOW()'
			)
		})
		.then(function () {
			return knex.raw(
				'ALTER TABLE PaymentProviders_Stripe_CustomerCards CHANGE COLUMN `created_at` created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, ' +
				'CHANGE COLUMN `updated_at` updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE NOW()'
			)
		})
		.then(function () {
			return knex.raw(
				'ALTER TABLE PaymentProviders_Stripe_Customers CHANGE COLUMN `created_at` created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, ' +
				'CHANGE COLUMN `updated_at` updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE NOW()'
			)
		})
		.then(function () {
			return knex.raw(
				'ALTER TABLE PaymentProviders CHANGE COLUMN `created_at` created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, ' +
				'CHANGE COLUMN `updated_at` updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE NOW()'
			)
		})
		.then(function () {
			return knex.raw(
				'ALTER TABLE SubscriptionPackages CHANGE COLUMN `created_at` created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, ' +
				'CHANGE COLUMN `updated_at` updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE NOW()'
			)
		})
		.then(function () {
			return knex.raw(
				'ALTER TABLE SubscriptionStatus CHANGE COLUMN `created_at` created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, ' +
				'CHANGE COLUMN `updated_at` updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE NOW()'
			)
		})
		.then(function () {
			return knex.raw(
				'ALTER TABLE Subscriptions CHANGE COLUMN `created_at` created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, ' +
				'CHANGE COLUMN `updated_at` updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE NOW()'
			)
		})



		//
		// Insert Initial Data
		//

		.then(function () {
			return knex('SubscriptionStatus').insert([
				{ ID: 1, Status: 'Pending' },
				{ ID: 2, Status: 'Active' },
				{ ID: 3, Status: 'Expired' },
				{ ID: 4, Status: 'Cancelled' }
			]);
		})

		.then(function () {
			return knex('SubscriptionPackages').insert([
				{ ID: 1, Name: 'The Apprentice', Price: 0, Description: 'Basic subscription tier', Artist: 1 },
				{ ID: 2, Name: 'Emerging Artist', Price: 29.95, Description: 'Middle subscription tier', Artist: 1 },
				{ ID: 3, Name: 'Master Artist', Price: 29.95, Description: 'Top subscription tier', Artist: 1 }
			]);
		})

		.then(function () {
			return knex('PaymentProviders_Stripe_Plans').insert([
				{ SubscriptionPackageID: 1, StripeID: 'free' },
				{ SubscriptionPackageID: 2, StripeID: 'emerging_artist' },
				{ SubscriptionPackageID: 3, StripeID: 'master_artist_promo' }
			]);
		})

		.then(function () {
			return knex('PaymentProviders').insert([
				{ ID: 1, Name: 'Stripe', Enabled: 1 },
				{ ID: 2, Name: 'PayPal', Enabled: 0 }
			]);
		})


	

	



};

exports.down = function(knex, Promise) {

	// Subscriptions
	return knex.schema.hasTable('Subscriptions')
		.then(function (exists) {
			if (exists) {
				return knex.schema.dropTable('Subscriptions');
			}
		})

		// SubscriptionStatus
		.then(function () {
			return knex.schema.hasTable('SubscriptionStatus')
		})
		.then(function (exists) {
			if (exists) {
				return knex.schema.dropTable('SubscriptionStatus');
			}
		})

		// SubscriptionPackages
		.then(function () {
			return knex.schema.hasTable('SubscriptionPackages')
		})
		.then(function (exists) {
			if (exists) {
				return knex.schema.dropTable('SubscriptionPackages');
			}
		})

		// PaymentProviders
		.then(function () {
			return knex.schema.hasTable('PaymentProviders')
		})
		.then(function (exists) {
			if (exists) {
				return knex.schema.dropTable('PaymentProviders');
			}
		})

		// PaymentProviders_Stripe_Customers
		.then(function () {
			return knex.schema.hasTable('PaymentProviders_Stripe_Customers')
		})
		.then(function (exists) {
			if (exists) {
				return knex.schema.dropTable('PaymentProviders_Stripe_Customers');
			}
		})

		// PaymentProviders_Stripe_CustomerCards
		.then(function () {
			return knex.schema.hasTable('PaymentProviders_Stripe_CustomerCards')
		})
		.then(function (exists) {
			if (exists) {
				return knex.schema.dropTable('PaymentProviders_Stripe_CustomerCards');
			}
		})

		// PaymentProviders_Stripe_Subscriptions
		.then(function () {
			return knex.schema.hasTable('PaymentProviders_Stripe_Subscriptions')
		})
		.then(function (exists) {
			if (exists) {
				return knex.schema.dropTable('PaymentProviders_Stripe_Subscriptions');
			}
		})

		// PaymentProviders_Stripe_Plans
		.then(function () {
			return knex.schema.hasTable('PaymentProviders_Stripe_Plans')
		})
		.then(function (exists) {
			if (exists) {
				return knex.schema.dropTable('PaymentProviders_Stripe_Plans');
			}
		})

		// Profiles
		.then(function () {
			return knex.schema.hasColumn('Profiles', 'ActivCanvasLink');
		})
		.then(function (exists) {
			if (exists) {
				return knex.schema.table('Profiles', function (t) {
					t.dropColumn('ActivCanvasLink');
					t.dropColumn('ActivCanvasLinkText');
				});
			}
		})


};
