var config = require('../config'),
	Promise = require('bluebird'),
	stripe = require('stripe')(config.stripe.secretKey);

//
// Private Methods
//

// Adds a new payment source to an existing customer, sets it to the default method
var addSource = function (customer, card) {
	return new Promise(function (resolve, reject) {

		stripe.customers.createSource(customer.StripeID, {
			source: card.Token
		}, function (err, _card) {

			if (err) {
				reject(err);
			}
			else {
				stripe.customers.update(customer.StripeID, {
					default_source: card.StripeID || card.Token
				}, function (err, customer) {

					if (err) {
						reject(err);
					}
					else {
						resolve();
					}

				});
			}

		});

	});
},


// Creates a new stripe credit/debit card for a specific profile
createCard = function (profileID, opts) {
	return new Promise(function (resolve, reject) {

		if (!opts.number || !opts.expMonth || !opts.expYear || !opts.cvc) {
			reject('Please ensure a card number, expiry month/year and cvc are provided')
		}
		else {
			stripe.tokens.create({
				card: {
					number: opts.number,
					exp_month: opts.expMonth,
					exp_year: opts.expYear,
					cvc: opts.cvc
				}
			}, function (err, token) {

				if (err) {
					reject(err);
				}
				else {
					console.log('TOKEN:')
					console.log(token)

					db('PaymentMethods').insert({
						ProfileID: profileID,
						PaymentProviderID: 1,
						ValidTo: new Date(token.card.exp_year, token.card.exp_month - 1, 1, 12),
						LastUsed: new Date()
					})
					.then(function (result) {
						var paymentMethodID = result[0];

						return db('PaymentProviders_Stripe_CustomerCards').insert({
							Token: token.id,
							StripeID: token.card.id,
							Country: token.card.country,
							Currency: token.card.currency,
							CvcCheck: token.card.cvc_check,
							Brand: token.card.brand,
							Last4: token.card.last4,
							Funding: token.card.funding,
							ExpMonth: token.card.exp_month,
							ExpYear: token.card.exp_year,
							PaymentMethodID: paymentMethodID
						})
						.then(function (result) {
							resolve({
								ID: result[0],
								PaymentMethodID: paymentMethodID,
								Token: token.id,
								StripeID: token.card.id
							})

						});
					})
					.catch(reject);
				}
			});
		}

	});
},


// Creates new/returns existing discount coupon for a specific affiliate code
createCoupon = function (affiliateCodeID) {
	return new Promise(function (resolve, reject) {

		db.first('c.StripeID', 'ac.*')
		.from('AffiliateCodes as ac')
		.leftJoin('PaymentProviders_Stripe_Coupons as c', 'ac.ID', 'c.AffiliateCodeID')
		.where('ac.ID', affiliateCodeID)
		.then(function (affiliateCode) {

			if (!affiliateCode) {
				resolve({});
			}
			else if (affiliateCode.StripeID || !affiliateCode.Discount) {
				resolve(affiliateCode);
			}
			else {

				var params = {
					id: affiliateCode.Code,
					percent_off: affiliateCode.Discount,
					duration: 'forever'
				};
				
				if (affiliateCode.DiscountDuration) {
					params.duration = 'repeating';
					params.duration_in_months = affiliateCode.DiscountDuration;
				}

				if (affiliateCode.ExpiryDate) {
					params.redeem_by = Math.floor(affiliateCode.ExpiryDate * 0.001);
				}

				stripe.coupons.create(params, function (err, coupon) {

					if (err) {
						reject(err)
					}
					else {
						
						db('PaymentProviders_Stripe_Coupons').insert({
							AffiliateCodeID: affiliateCode.ID,
							StripeID: coupon.id
						})
						.finally(function () {
							affiliateCode.StripeID = coupon.id;
							resolve(affiliateCode);
						})
						
					}

				});
			}

		})
		.catch(reject);

	});
},

// Creates a new stripe customer with a default payment method
createCustomer = function (profileID, token, description) {
	return new Promise(function (resolve, reject) {

		console.log(arguments)

		//
		// create customer using token
		//
		stripe.customers.create({
			description: description,
			source: token
		}, function (err, customer) {

			if (err) {
				reject(err);
			}
			else {
				console.log('CUSTOMER:')
				console.log(customer)

				db('PaymentProviders_Stripe_Customers').insert({
					ProfileID: profileID,
					StripeID: customer.id
				})
				.then(function (result) {
					resolve({
						ID: result[0],
						StripeID: customer.id
					})
				})
				.catch(reject);
			}
		});

	});
},


// Creates a new stripe subscription for a stripe customer
createSubscription = function (customer, plan, coupon) {
	return new Promise(function (resolve, reject) {
		coupon = coupon || {};

		var params = { plan: plan.StripeID };

		if (coupon) {
			if (coupon.StripeID) {
				params.coupon = coupon.StripeID;
			}

			if (coupon.TrialPeriod) {
				var d = new Date();
				params.trial_end = Math.floor(d.setMonth(d.getMonth() + coupon.TrialPeriod, d.getDate() + 1) / 1000);
			}
		}

		stripe.customers.createSubscription(customer.StripeID, params, function (err, subscription) {

			if (err) {
				reject(err);
			}
			else {
				console.log('SUBSCRIPTION:')
				console.log(subscription)

				resolve({
					CustomerID: customer.ID,
					StripeID: subscription.id
				});
			}

		});

	});
},

// Returns an existing stripe card record if it is still valid for making payments
getCard = function (paymentMethodID) {
	return new Promise(function (resolve, reject) {

		db('PaymentProviders_Stripe_CustomerCards').first().where('PaymentMethodID', paymentMethodID).then(function (card) {
			if (!card) {
				reject('No stripe card found matching the specified payment method ID.');
			}
			else if (new Date(card.ExpYear, card.ExpMonth) < new Date()) {
				reject('This card has expired.');
			}
			else {
				resolve(card);
			}
		})
		.catch(reject)

	});
},

// Returns an existing stripe customer record
getCustomer = function (profileID) {
	return db('PaymentProviders_Stripe_Customers').first().where('ProfileID', profileID);
},

// Returns an existing stripe plan for a specific subscription package
getPlan = function (packageID) {
	return new Promise(function (resolve, reject) {
		db('PaymentProviders_Stripe_Plans').first().where('SubscriptionPackageID', packageID).then(function (plan) {
			if (!plan) {
				reject('No stripe plan found matching the specified subscription package ID.');
			}
			else {
				resolve(plan);
			}
		})
		.catch(reject)
	});
},



// Returns an existing subscription record 
getSubscription = function (subscriptionID) {
	return new Promise(function (resolve, reject) {

		db.first(
			's.*',
			'p.Name as ProfileName',
			db.raw('IF(a.ID IS null, 0, 1) as Artist'),
			db.raw('IF(g.ID IS null, 0, 1) as Gallery')
		)
		.from('Subscriptions as s')
		.join('Profiles as p', 'p.ID', 's.ProfileID')
		.leftJoin('Artists as a', 'a.ProfileID', 'p.ID')
		.leftJoin('Galleries as g', 'g.ProfileID', 'p.ID')
		.where('s.ID', subscriptionID)
		.then(function (subscription) {

			if (!subscription) {
				reject('Subscription not found');
			}
			else {
				resolve(subscription);
			}
		})
		.catch(reject)
	});
};


//
// Public Methods
//

var Stripe = {

	//
	// Creates a new stripe subscription for the specified subscription
	//
	create: function (subscriptionID, opts) {
		return new Promise(function (resolve, reject) {

			getSubscription(subscriptionID).then(function (subscription) {

				if (subscription.StatusID !== 1) {
					return reject('Subscription has already been created');
				}

				//
				// Lookup stripe plan linked to the specified subscription package
				//
				return getPlan(subscription.PackageID).then(function (plan) {

					//
					// Create a coupon if an affiliate code was used with this subscription
					//
					return createCoupon(subscription.AffiliateCodeID).then(function (coupon) {

						var existingMethod = !!opts.PaymentMethodID;

						//
						// Get/Create a valid stripe card object
						//
						return (existingMethod ? getCard(opts.PaymentMethodID) : createCard(subscription.ProfileID, opts)).then(function (card) {

							//
							// Check if customer record already exists for current profile
							//
							return getCustomer(subscription.ProfileID).then(function (existingCustomer) {

								//
								// Create a new subscription for existing customer
								//
								if (existingMethod && existingCustomer) {
									return createSubscription(existingCustomer, plan, coupon);
								}
								else if (!existingMethod && existingCustomer) {
									return addSource(existingCustomer, card).then(function () {
										return createSubscription(existingCustomer, plan, coupon);
									})
								}
								else {

									// 
									// Create a new customer and subscription
									//
									var description = subscription.ProfileName + ' [' + (subscription.Artist ? 'Artist' : subscription.Gallery ? 'Gallery' : 'Consumer') + ']';
									return createCustomer(subscription.ProfileID, card.Token, description).then(function (customer) {
										return db('PaymentProviders_Stripe_CustomerCards').where('ID', card.ID).update({ CustomerID: customer.ID }).then(function () {
											return createSubscription(customer, plan, coupon);
										});
									})
								}

							})
							.then(function (sub) {
								return db('PaymentProviders_Stripe_Subscriptions').insert({
									SubscriptionID: subscription.ID,
									CustomerID: sub.CustomerID,
									CustomerCardID: card.ID,
									StripeID: sub.StripeID,
									PlanID: plan.ID
								})
							})
							.then(function () {
								resolve({ PaymentMethodID: card.PaymentMethodID });
							})

						})

					})
					
				})

			})
			.catch(reject)

		});
	},



	//
	// Cancels a subscription
	//
	cancel: function (subscriptionID) {
		return new Promise(function (resolve, reject) {
			
			getSubscription(subscriptionID).then(function (subscription) {

				return getCustomer(subscription.ProfileID).then(function (customer) {

					if (!customer) {
						reject('Customer record not found')
					}
					else {

						return db('PaymentProviders_Stripe_Subscriptions').first().where('SubscriptionID', subscriptionID).then(function (stripeSub) {

							console.log(customer);
							console.log(subscription);
							console.log(stripeSub);

							stripe.customers.cancelSubscription(customer.StripeID, stripeSub.StripeID, function (err, confirmation) {

								if (err) {
									reject(err);
								}
								else {
									resolve(true);
								}

							});
						})

					}

				});

			})
			.catch(reject);

		});
	},




	//
	// Lists a profiles subscriptions (past and present)
	//
	list: function (profileID) {
		return new Promise(function (resolve, reject) {

			//stripe.plans.list({ }, function (err, plans) {
			//  	// asynchronously called

			//  	console.log(plans);
			//  	resolve();
			//  }
			//);


		});
	},



	//
	// Lists any existing payment methods configured for a specific profile
	//
	methods: function (profileID) {
		return new Promise(function (resolve, reject) {



		});
	},




	//
	// Returns a list of avaliable subscription packages
	//
	packages: function () {
		return new Promise(function (resolve, reject) {



		});
	},




	//
	// Returns a list of avaliable payment providers
	//
	providers: function () {
		return new Promise(function (resolve, reject) {



		});
	},




	//
	// Updates an existing subscription
	//
	update: function (subscriptionID) {
		return new Promise(function (resolve, reject) {



		});
	}

}

module.exports = Stripe;