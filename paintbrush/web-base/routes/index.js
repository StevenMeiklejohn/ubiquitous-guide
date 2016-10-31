var router = require('express').Router(),
	extend = require('extend'),
	fs = require('fs'),
	glob = require('glob');

var cache = {},
	debugMode = process.env.NODE_ENV === 'development';

//
// Creates a searchable map of the web apps routes so we can quickly determine if a route exists or not
//
var RouteMap = {
	
	build: function (routes) {
		var map = {};
		var append = function (parent, key, data) {
			if (!parent[key]) {
				parent[key] = data;
			}
			return parent[key];
		};

		for (var path in routes) {
			var parts = path.split('/');
			var node = map[parts[0]] || map;

			parts.shift();
			parts.forEach(function (part) {
				node = append(node, part, { param: part.indexOf(':') === 0 });
			});

		}

		this.map = map;
	},
	
	exists: function (routes, path) {
		if (!path) {
			return false;
		}
		if (path === '/') {
			return true;
		}
		if (!this.map) {
			this.build(routes);
		}

		var parts = path.split('/');

		var walk = function (parent, depth) {
			var key = parts[depth];

			if (depth === parts.length) {
				return true;
			}
			else if (parent[key]) {
				return walk(parent[key], depth + 1);
			}
			else {
				for (var _key in parent) {
					if (parent[_key].param && walk(parent[_key], depth + 1)) {
						return true;
					}
				}
			}

			return false;
		};

		return walk(this.map, 0);
	}
	
};




module.exports = {

	load: function (requestPath, complete) {

		if (cache[requestPath] && !debugMode) {
			complete(cache[requestPath]);
		}
		else {

			//
			// Load build config
			//
			fs.readFile(__dirname + '/../build.json', 'utf8', function (err, buildConfStr) {

				if (err) {
					console.error(err);
					complete({ status: 500 });
				}
				else {
					try {
						var buildConf = JSON.parse(buildConfStr);
						var template = buildConf.template || 'arn';
						var _indexPath = __dirname + '/../src/app/index-' + (!debugMode ? 'min' : 'dev') + '.htm';

						//
						// Load index file
						//
						fs.readFile(_indexPath, 'utf8', function (err, contents) {
							if (err) {
								complete({ status: 500 });
							}
							else {

								var tplPath = '/templates/' + template + '/',
									tplPathAds =  __dirname + '/../src' + tplPath,
									tplConfig = {
										'fav-icon': 'img/favicon.png',
										index: 'index.htm',
										scripts: [],
										stylesheets: []
									},
									tplScripts = '',
									tplStylesheets = '',
									libScripts = '',
									libStylesheets= '',
									angularScripts = '',
									appScripts = '';

								//
								// Load template config
								//
								fs.readFile(tplPathAds + 'conf.json', 'utf8', function (err, tplConfigStr) {

									try {
										tplConfig = extend(true, tplConfig, JSON.parse(tplConfigStr || '{}'));
									}
									catch (e) {}

									//
									// Load template html
									//
									fs.readFile(tplPathAds + tplConfig['index'], 'utf8', function (err, tplHtml) {

										if (err) {
											console.error(err);
											tplHtml = '<h1><strong>ERROR: Template HTML not found</strong></h1>';
										}

										//
										// Generate script and stylesheet includes
										//
										else {

											// check if app is running from root or is using a prefix for paths
											var pathPrefix = buildConf['app-routes-prefix'] || '';
											if (pathPrefix) {
												pathPrefix = '/' + pathPrefix;
											}


											var makeStylesheet = function(path, sheet) {
												switch(typeof sheet) {
													case 'string': return '<link href="' + pathPrefix + path + sheet + '?[CDV]" type="text/css" rel="stylesheet" />';
													case 'object':
														var str = '';
														sheet.href = pathPrefix + path + sheet.href;
														str += '<link';
														for (var key in sheet) { str += ' ' + key + '="' + sheet[key] + '"'; }
														str += '/>';
														return str;
												}
											};

											var makeScript = function(path, script) {
												switch(typeof script) {
													case 'string': return '<script src="' + pathPrefix + path + script + '?[CDV]"></script>';
													case 'object':
														var str = '';
														script.href = pathPrefix + path + script.href;
														str += '<script';
														for (var key in script) { str += ' ' + key + '="' + script[key] + '"'; }
														str += '></script>';
														return str;
												}
											};

											tplConfig.stylesheets.forEach(function(s) {
												tplStylesheets += makeStylesheet(tplPath, s);
											});

											tplConfig.scripts.forEach(function(s) {
												tplScripts += makeScript(tplPath, s);
											});


											//
											// Debug mode - output individual scripts
											//
											if (debugMode) {

												(buildConf['src-lib-css'] || []).forEach(function(s) {
													if (s.indexOf('*') > -1) {
														var _dir = __dirname.replace('/routes', '');
														glob.sync(_dir + s).forEach(function (f) {
															libStylesheets += makeStylesheet('', f.replace(_dir + '/src', ''));
														})
													}
													else {
														libStylesheets += makeStylesheet('', s.replace('/src', ''));
													}
												});


												(buildConf['src-lib-js'] || []).forEach(function(s) {
													if (s.indexOf('*') > -1) {
														var _dir = __dirname.replace('/routes', '');
														glob.sync(_dir + s).forEach(function (f) {
															libScripts += makeScript('', f.replace(_dir + '/src', ''));
														})
													}
													else {
														libScripts += makeScript('', s.replace('/src', ''));
													}
												});


												(buildConf['src-angular-js'] || []).forEach(function(s) {
													if (s.indexOf('*') > -1) {
														var _dir = __dirname.replace('/routes', '');
														glob.sync(_dir + s).forEach(function (f) {
															angularScripts += makeScript('', f.replace(_dir + '/src', ''));
														})
													}
													else {
														angularScripts += makeScript('', s.replace('/src', ''));
													}
												});


												(buildConf['src-app-js'] || []).forEach(function(s) {
													if (s.indexOf('*') > -1) {
														var _dir = __dirname.replace('/routes', '');
														glob.sync(_dir + s).forEach(function (f) {
															appScripts += makeScript('', f.replace(_dir + '/src', ''));
														})
													}
													else {
														appScripts += makeScript('', s.replace('/src', ''));
													}
												});


											}

											//
											// Production mode - output minified scripts
											//
											else {
												libStylesheets = makeStylesheet('', buildConf['dist-lib-css'].replace('/src', ''));
												libScripts = makeScript('', buildConf['dist-lib-js'].replace('/src', ''));
												angularScripts = makeScript('', buildConf['dist-angular-js'].replace('/src', ''));
												appScripts = makeScript('', buildConf['dist-app-js'].replace('/src', ''));
											}

										}

										var response = {
											status: RouteMap.exists(buildConf['app-routes'], requestPath) ? 200 : 404,
											body: contents
												.replace(/\[FAV_ICON]/g, tplPath + tplConfig['fav-icon'])
												.replace(/\[TEMPLATE_HTML]/g, tplHtml)
												.replace(/\[TEMPLATE_SCRIPTS]/g, tplScripts)
												.replace(/\[TEMPLATE_STYLESHEETS]/g, tplStylesheets)
												.replace(/\[LIBRARY_JS]/g, libScripts)
												.replace(/\[LIBRARY_STYLESHEETS]/g, libStylesheets)
												.replace(/\[APP_JS]/g, appScripts)
												.replace(/\[ANGULAR_JS]/g, angularScripts)
												.replace(/\[CDV]/g, 'cdv=' + clientDependencyVersion)
												.replace(/\[CDV_N]/g, clientDependencyVersion)
												.replace(/\[APP_VERSION_N]/g, buildConf['app-version'] || 1)
										};

										cache[requestPath] = response;
										complete(response);

									});

								});
							}
						});

					}
					catch (e) {
						console.error(e);
						complete({ status: 500 });
					}
				}

			});
		}

	}

};
