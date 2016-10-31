var express = require('express'),
	path = require('path');


//
// Returns the main app.js file for web app with routes from the build.json file injected
//
var appJSRouter = express.Router().get(['/app/app.js', '/dist/app.min.js'], function (req, res) {
	require('./app').load(function (r) {
		if (r.status > 200) {
			res.sendStatus(r.status);
		}
		else {
			res.send(r.body)
		}
	});
});

//
// Returns the index html for the current web app
//
// - Injects all scripts and stylesheets defined in the web apps build.json file
// - Checks if the requested path is defined in web app routes, returns 404 if not found
//
var appRouter = express.Router().get('*', function (req, res) {
	require('./index').load(req.path, function (r) {
		res.status(r.status).send(r.body);
	});
});

//
// Returns template html for Angular components and directives
//
// - Injects template css into style block within template html
// - Strips out white space from html
//
var templateRouter = express.Router().get(['*/tpl.htm','*/view.htm'], function (req, res) {
	require('./template').load(req.originalUrl.split('?')[0], function (r) {
		res.status(r.status).send(r.body);
	});
});

//
// 404 handler for web app's static resources
//
var notFoundHandler = express.Router().get('*.*', function (req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;

	var p = req.originalUrl.split(/\/|\./g);
	if (!(['png', 'jpg', 'jpeg', 'gif', 'ico', 'css', 'js'].indexOf(p[p.length - 1].toLowerCase()) > -1)) {
		err.sendHtml = true;
	}
	next(err);
});


module.exports = function (app, rootPath) {
	app.use(rootPath, appJSRouter);
	app.use(rootPath + 'components', templateRouter);
	app.use(rootPath + 'controllers', templateRouter);
	app.use(rootPath + 'controllers', express.static(path.join(__dirname, '../src/controllers')));
	app.use(rootPath + 'components', express.static(path.join(__dirname, '../src/components')));
	app.use(rootPath + 'dist', express.static(path.join(__dirname, '../src/dist')));
	app.use(rootPath + 'fonts', express.static(path.join(__dirname, '../src/fonts')));
	app.use(rootPath + 'img', express.static(path.join(__dirname, '../src/img')));
	app.use(rootPath + 'lib', express.static(path.join(__dirname, '../src/lib')));
	app.use(rootPath + 'services', express.static(path.join(__dirname, '../src/services')));
	app.use(rootPath + 'app', express.static(path.join(__dirname, '../src/app')));
	app.use(rootPath + 'templates', express.static(path.join(__dirname, '../src/templates')));
	app.use(rootPath + 'uploads', express.static(path.join(__dirname, 'web/uploads')));
	app.use(rootPath, notFoundHandler);
	app.use(rootPath, appRouter);
};


