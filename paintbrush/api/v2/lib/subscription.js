var config = require('../config'),
	Promise = require('bluebird'),
	Stripe = require('./subscription-stripe'),
	ActivCanvas = require('./activcanvas');


var STATUS = {
	PENDING: 1,
	ACTIVE: 2,
	EXPIRED: 3,
	CANCELLED: 4
};

var PROVIDER = {
	STRIPE: 1,
	PAYPAL: 2
};


//
// This class provides a standardised layer for managing subscriptions 
// across multiple payment providers
//

var Subscription = {

	// 
	// Expose status enums
	//
	STATUS: STATUS,


	//
	// Creates a new subscription for the specified profile
	//
	create: function (profileID, packageID, affiliateCodeID, opts) {
		return new Promise(function (resolve, reject) {

			db.first('p.*', db.raw('IF(a.ID IS null, 0, 1) as Artist'), db.raw('IF(g.ID IS null, 0, 1) as Gallery'))
			.from('Profiles as p')
			.leftJoin('Artists as a', 'a.ProfileID', 'p.ID')
			.leftJoin('Galleries as g', 'g.ProfileID', 'p.ID')
			.where({ 'p.ID': profileID, 'p.Deleted': 0 })
			.then(function (profile) {

				if (!profile) {
					reject('The specified profile was not found');
				}
				else{ 
					return db('SubscriptionPackages').first().where('ID', packageID).then(function (subPackage) {

						if (!subPackage) {
							reject('The specified subscription package was not found');
						}
						else if (profile.Artist && !subPackage.Artist) {
							reject('Subscription package \'' + subPackage.Name + '\' is not available to artists');
						}
						else if (profile.Gallery && !subPackage.Gallery) {
							reject('Subscription package \'' + subPackage.Name + '\' is not available to galleries');
						}
						else {

							// check if profile already has an active subscription for this package
							return db('Subscriptions').first()
							.where({ ProfileID: profileID, PackageID: packageID }).andWhere('StatusID', STATUS.ACTIVE)
							.then(function (existing) {
								existing = existing || {};

								//if (existing.StatusID === STATUS.PENDING) {
								//	reject('A subscription for package \'' + subPackage.Name + '\' is currently being processed');
								//}
								//else
								if (existing.StatusID === STATUS.ACTIVE) {
									reject('An active subscription for package \'' + subPackage.Name + '\' already exists');
								}
								else {

									// create a new Subscription record
									return db('Subscriptions').insert({
										ProfileID: profileID,
										PackageID: packageID,
										StatusID: STATUS.PENDING,
										AffiliateCodeID: affiliateCodeID
									})
									.then(function (result) {
										var subscriptionID = result[0];

										// call provider specific create method
										return Stripe.create(subscriptionID, opts)
											.then(function (result) {

												return db('Subscriptions').where({ ID: subscriptionID }).update({ StatusID: STATUS.ACTIVE, StartDate: new Date(), PaymentMethodID: result.PaymentMethodID })
													.then(function () {
														if (affiliateCodeID) {
															return db('Registrations').where('ProfileID', profileID).update({ AffiliateCodeID: null })
																.then(function() {
																	return db('AffiliateCodes').first().where('ID', affiliateCodeID);
																})
																.then(function(affiliateCode) {
																	if (affiliateCode && affiliateCode.UsesRemaining) {
																		return db('AffiliateCodes').where('ID', affiliateCodeID).update({ UsesRemaining: affiliateCode.UsesRemaining - 1 });
																	}
																})
														}
													})
													.then(function () {
														resolve({ ID: subscriptionID });
													})

											})
											.catch(function (err) {

												return db('Subscriptions').where('ID', subscriptionID).del()
												.then(function () {
													reject(err);
												})


											})

									})

								}

							})
						}

					})
				}
			})
			.catch(reject);
			
		});
	},



	//
	// Cancels a subscription
	//
	cancel: function (subscriptionID) {
		return new Promise(function (resolve, reject) {

			var subscription;

			db.first('s.*', 'pm.PaymentProviderID')
			.from('Subscriptions as s')
			.join('PaymentMethods as pm', 's.PaymentMethodID', 'pm.ID')
			.where('s.ID', subscriptionID)
			.then(function (s) {
				subscription = s;
				
				switch (subscription.PaymentProviderID) {
					case PROVIDER.STRIPE: return Stripe.cancel(subscriptionID); break;
					case PROVIDER.PAYPAL: reject('Payment provider not available'); break;
					default: reject('Unknown payment provider'); break;
				}

			})
			.then(function (cancelled) {
				if (cancelled) {

					// disable ActivCanvas functionality
					db('Profiles').where({ ID: subscription.ProfileID }).update({ ActivCanvasStatusID: 1 })
					.then(function () {

						// Update subscription status to cancelled
						return db('Subscriptions').where('ID', subscriptionID).update({ StatusID: STATUS.CANCELLED });
					})
					.then(function () {

						// Get a list of all art this user owns
						return db('Artworks').select('ID').where({ OwnerProfileID: subscription.ProfileID });
					})
					.then(function (artworks) {

						// Update all artworks to display the demo video
						var queue = [];
						artworks.forEach(function (a) {
							queue.push(ActivCanvas.queue(config.activCanvas.demoVideoID, a.ID))
						});

						if (queue.length) {
							return Promise.settle(queue);
						}
					})
					.then(function () {
						resolve();
					})
				}
				else {
					resolve();
				}
			})
			.catch(reject);

		});
	},




	//
	// Lists a profiles subscriptions (past and present)
	//
	list: function (profileID) {
		return new Promise(function (resolve, reject) {

			db('Profiles').first()
			.where({ ID: profileID, Deleted: 0 })
			.then(function (profile) {
				if (!profile) {
					reject('The specified profile was not found');
				}
				else{ 
					return db.select(
						's.*',
						'ss.Status',
						'sp.Name as Package',
						'sp.Price',
						'scc.Brand',
						'scc.Last4',
						'scc.ExpMonth',
						'scc.ExpYear',
						'ac.Code',
						'ac.Discount',
						'ac.DiscountDuration',
						'ac.TrialPeriod'
					)
					.from('Subscriptions as s')
					.join('SubscriptionStatus as ss', 's.StatusID', 'ss.ID')
					.join('SubscriptionPackages as sp', 's.PackageID', 'sp.ID')

					.leftJoin('AffiliateCodes as ac', 's.AffiliateCodeID', 'ac.ID')

					.leftJoin('PaymentProviders_Stripe_Subscriptions as ssn', 'ssn.SubscriptionID', 's.ID')
					.leftJoin('PaymentProviders_Stripe_CustomerCards as scc', 'ssn.CustomerCardID', 'scc.ID')

					.where({ 's.ProfileID': profileID })
					.orderBy('s.created_at', 'desc')
					.then(resolve);
				}
			})
			.catch(reject);

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
	// Returns a list of available subscription packages
	//
	// An optional type 'artist/gallery/consumer' can be provided
	//
	packages: function (type) {
		return new Promise(function (resolve, reject) {
			var c = {};
			switch (type) {
				case 'artist': c.Artist = 1; break;
				case 'gallery': c.Gallery = 1; break;
				case 'consumer': c.Consumer = 1; break;
			}

			db('SubscriptionPackages').select().where(c).then(resolve).catch(reject);
		});
	},




	//
	// Returns a list of avaliable payment providers
	//
	providers: function () {
		return new Promise(function (resolve, reject) {
			db('PaymentProviders').select().where({ Enabled: 1 }).then(resolve).catch(reject);
		});
	},




	//
	// Updates an existing subscription
	//
	update: function (subscriptionID) {
		return new Promise(function (resolve, reject) {



		});
	}

};

module.exports = Subscription;