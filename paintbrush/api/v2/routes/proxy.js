var config = require('../config'),
	router = require('express').Router(),
	fs = require('fs'),
	mkdirp = require('mkdirp'),
	im = require("imagemagick"),
	url = require('url');


router.get('/image/:url/:width/:height?', function (req, res, next) {
	var img = req.params.url,
		width = parseInt(req.params.width),
		height = parseInt(req.params.height || config.proxy.maxHeight),
		urlData = url.parse(img);

	// check for relative url
	if (!urlData.hostname && !urlData.protocol) {
		img = 'http' + (['production', 'staging'].indexOf(process.env.NODE_ENV) > -1 || req.secure ? 's' : '') + '://' + req.headers.host + '/' + img;
	}
	else {

		// check for valid protocol
		if (urlData.protocol !== 'http:' && urlData.protocol !== 'https:') {
			return res.status(400).json({ Message: 'URI must be HTTP or HTTPS' })
		}

		//check for valid hostname
		var hostOK = config.proxy.whitelist.some(function (exp) {
			return exp.test(urlData.hostname);
		});

		if (!hostOK) {
			return res.status(400).json({ Message: 'Illegal host: ' + urlData.hostname })
		}
	}

	// create a specific key to use when generating a hash for the filename so we always generate the same hash for the same params
	var key = '04b6b962-8120-46d2-964b-5c80dc729361';

	// create the cache file name
	var cacheFile = require('crypto').createHmac('sha256', key).update(img + '/' + width + '/' + height).digest('hex') +
		'.' + urlData.pathname.split('.').pop();

	var cacheFilePath = config.proxy.cachePathAbs + '/' + cacheFile;

	// check if file exists already
	fs.exists(cacheFilePath, function (exists) {
		if (!exists) {

			// ensure cache directory exists
			mkdirp(config.proxy.cachePathAbs, function (err) {
				if (err) {
					res.status(500).json({ Message: 'Error creating cache directory' });
				}
				else {
					// create cache file
					var opts = {
						'width': width,
						'height': height,
						srcPath: img,
						dstPath: cacheFilePath
					};
					console.log(opts);
					try {
						im.resize(opts, function (err) {
							if (err) {
								res.status(500).json({ Message: 'Could not serve image' });
								console.log(err);
							}
							else {
								res.sendFile(cacheFilePath);
							}
						})
					}
					catch (e) {
						res.status(500).json({ Message: 'Unexpected error' });
					}
				}

			});

			
		}
		else {
			// serve file
			res.sendFile(cacheFilePath)
		}
	})
});


module.exports = router;
