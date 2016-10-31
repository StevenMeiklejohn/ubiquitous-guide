var router = require('express').Router(),
	extend = require('extend'),
	fs = require('fs');

var appJS,
	debugMode = process.env.NODE_ENV === 'development';

module.exports = {

	load: function (complete) {

		if (appJS && !debugMode) {
			complete({ body: appJS, status: 200 });
		}
		else {
			var _appJSPath = __dirname + '/../src/' + (debugMode ? 'app/app' : 'dist/app.min') + '.js';

			//
			// Load app js file
			//
			fs.readFile(_appJSPath, 'utf8', function (err, contents) {
				if (err) {
					console.error(err);
					complete({ status: 500 });
				}
				else {
					appJS = contents;

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


								appJS = contents
									.replace(/('|")\[APP_ROUTES]('|")/, JSON.stringify(buildConf[ 'app-routes' ] || '{}'))
									.replace(/('|")\[APP_ROUTES_PREFIX]('|")/, '"' + (buildConf['app-routes-prefix'] || '') + '"');


								complete({ body: appJS, status: 200 });
							}
							catch (e) {
								console.error(e);
								complete({ status: 500 });
							}
						}

					});

				}
			});
		}

	}

};
