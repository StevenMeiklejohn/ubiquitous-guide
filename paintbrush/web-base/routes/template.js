var fs = require('fs');

var cache = {},
	debugMode = process.env.NODE_ENV === 'development';

module.exports = {

	load: function (requestPath, complete) {

		if (cache[requestPath] && !debugMode) {
			complete(cache[requestPath]);
		}
		else {

			var basePath = requestPath.replace(/(tpl|view)\.htm/gi, '');

			fs.readFile(__dirname + '/../src' + requestPath, 'utf8', function (err, contents) {

					if (err) {
						console.error(err);
						complete({ status: err.code === 'ENOENT' ? 404 : 500 });
					}
					else {

						//
						// CSS Injection Notes
						//
						// After some trial and error this appears to be the best way to handle controller & directive styles in a modular manner.
						//
						// - Putting all styles in a single file is messy to maintain.
						// - Packaging all individual stylesheets using gulp creates inheritance issues
						// - Using AngularCSS creates problems with 'flash of un-styled content' and doubles number of http requests per template
						// - Adding <style> blocks to templates manually is messy
						//

						fs.readFile(__dirname + '/../src' + basePath + 'styles.css', 'utf8', function (err, css) {

							if (css) {

								var tokenExp = /\[STYLES]/;

								//
								// Default behavior is to wrap template using an extra div, depending on the scope used Angular throws
								// an error if a directive has more than one root element.
								//
								// Since this can cause a problem in a small number of cases allow the template to specify where to
								// inject the style tag using the token [STYLES]
								//

								if (contents.match(tokenExp)) {
									contents = contents.replace(tokenExp, '<style>' + css + '</style>');
								}
								else {
									contents = '<div>' + contents + '<style>' + css + '</style></div>';
								}
							}

							var resp = { body: contents.replace(/(\t|\n|\r|<!--(.*)-->|\/\*(.*)\*\/)/g,''), status: 200 };
							cache[requestPath] = resp;
							complete(resp);

						});
					}

			});

		}

	}

};
