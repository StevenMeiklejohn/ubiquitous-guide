var router = require('express').Router();

var routes = {
	auth: require('./auth'),
	artist: require('./artist'),
	artwork: require('./artwork'),
	biography: require('./biography'),
	question: require('./question'),
	groups: require('./groups'),
	profile: require('./profile'),
	materials: require('./materials'),
	workspaces: require('./workspaces'),
	social: require('./social'),
	users: require('./users'),
	proxy: require('./proxy'),
	video: require('./video'),
	marketplace: require('./marketplace'),
	shortlist: require('./shortlist'),
	connections: require('./connections'),
	notifications: require('./notifications'),
	dashboard: require('./dashboard'),
	register: require('./register'),
	crm: require('./crm'),
	s3: require('./amazon-s3'),
	subscriptions: require('./subscriptions'),
	enquiry: require('./enquiry'),
	demo: require('./demo'),
	device: require('./device'),
	affiliate: require('./affiliate'),
	userPreferences: require('./user-preferences'),
	analytics: require('./analytics'),
	messages: require('./messages'),
	permissions: require('./permissions'),
	products: require('./products')
};


// unauthenticated routes
router.use('/affiliate', routes.affiliate.unauthenticated);
router.use('/artist', routes.artist.unauthenticated);
router.use('/artwork', routes.artwork.unauthenticated);
router.use('/crm', routes.crm);
router.use('/proxy', routes.proxy);
router.use('/register', routes.register);
router.use('/analytics', routes.analytics);

// authenticated routes
router.use('/', routes.auth);
router.use('/profile', routes.profile);
router.use('/artist', routes.artist.authenticated);
router.use('/artwork', routes.artwork.authenticated);
router.use('/biography', routes.biography);
router.use('/question', routes.question);
router.use('/social', routes.social);
router.use('/materials', routes.materials);
router.use('/workspaces', routes.workspaces);
router.use('/video', routes.video);
router.use('/groups', routes.groups);
router.use('/users', routes.users);
router.use('/marketplace', routes.marketplace);
router.use('/shortlist', routes.shortlist);
router.use('/connections', routes.connections);
router.use('/notifications', routes.notifications);
router.use('/dashboard', routes.dashboard);
router.use('/s3', routes.s3);
router.use('/subscriptions', routes.subscriptions);
router.use('/enquiry', routes.enquiry);
router.use('/demo', routes.demo);
router.use('/device', routes.device);
router.use('/affiliate', routes.affiliate.authenticated);
router.use('/user-preferences', routes.userPreferences);
router.use('/message', routes.messages);
router.use('/permissions', routes.permissions);
router.use('/products', routes.products);


module.exports = router;