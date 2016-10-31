var port			= 3000;
var express 		= require('express');
var path 			= require('path');
var logger 			= require('morgan');
var cookieParser 	= require('cookie-parser');
var bodyParser 		= require('body-parser');
var http          	= require('http');
var passport		= require('passport');
var compress		= require('compression');
var fs				= require('fs');


//
// Set up database connection
//
require('./api/db-environment');

//
// set up exception logger
//
require('./api/lib/logger');


// record start up time to use as a version number of static resources
// -- forces web browsers to reload cached files when updates are applied
global.clientDependencyVersion = new Date() * 1;

// expose current web app name globally to enabled API to access the correct build.json file if required
global.webAppName = 'web-' + (process.env.WEB_APP_NAME || 'arn');

// init express
var app = global._app = express();
app.use(passport.initialize());
app.use(compress());

// view engine setup
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());



//
// Init WebSocket server
//
setTimeout(function () {
	require('./api/lib/websocket');
}, 10000);


//
// Init Auth Strategies
//
require('./api/auth/passport-strategies');



//
// API Routing Table
//
app.use('/api/', require('./api/routes/index'));



// catch 404 for api calls
app.use('/api', function (req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});



//
// Web App Routing Table
//

// robots.txt
app.use('/robots.txt', function(req, res) {
	fs.readFile('./robots.txt', 'utf8', function (err, contents) {
		if (err) {
			res.sendStatus(500);
		}
		else {
			res.send(contents);
			console.log('ROBOT: ' + req.headers['user-agent'] || 'Unknown');
		}
	});
});

// handle requests for pages on the old site
app.use('*.php', function (req, res, next) {

	var url = require('url').parse(req.originalUrl);
	switch (url.pathname) {
		case '/get-started.php': res.redirect(301, '/register'); break;
		case '/gallery-get-started.php': res.redirect(301, '/register'); break;
		case '/help.php': res.redirect(301, '/help'); break;
		case '/index.php': res.redirect(301, '/'); break;
		case '/market.php': res.redirect(301, '/marketplace'); break;
		case '/marketView.php': res.redirect(301, '/marketplace'); break;
		case '/profile.php': res.redirect(301, '/profile'); break;
		case '/profileView.php': res.redirect(301, '/profile'); break;
		case '/resetPass.php': res.redirect(301, '/login?v=reset'); break;
		case '/support.php': res.redirect(301, '/help'); break;
		default:
			var err = new Error('Not Found');
			err.status = 404;
			next(err);
			break;
	}
});



//
// Skip loading web routes and scheduled tasks within test environment,
// define a simple error handler for test environment
//
if (process.env.NODE_ENV === 'test') {

	//
	// Basic error handler
	//
	app.use(function (err, req, res, next) {
		res.status(err.status || 500).json({ Message: err.message, profile: res.profile });
	});

}
else {


	//
	// Init web routes
	//
	require('./' + webAppName + '/routes/all')(app, '/');


	//
	// Error handler with html response support
	//
	app.use(function (err, req, res, next) {
		console.error(err);

		// send a pretty 404 page
		if (err.status === 404 && err.sendHtml) {
			require('./' + webAppName + '/routes/index').load('/', function (r) {
				if (r.status > 200) {
					res.sendStatus(r.status);
				}
				else {
					res.status(404).send(r.body)
				}
			})
		}
		else {
			var resp = { Message: err.message, profile: res.profile };
			res.status(err.status || 500).json(resp);
		}
	});


	//
	// Start ActivCanvas queue scheduler
	//
	require('./api/v2/lib/activcanvas').scheduler.start();


	// General maintenance tasks
	setInterval(function() {

		//
		// Clear out expired Access Tokens
		//
		require('./api/auth/access-token').tidy();

		//
		// Mark old unimportant notifications as read
		//
		require('./api/v2/lib/notification').tidy();

	}, 60*60*1000);

}


// prevent browser caching if running in dev mode
if (process.env.NODE_ENV === 'development') {
	setInterval(function(){
		global.clientDependencyVersion = new Date() * 1;
	}, 500)
}

module.exports = app;
