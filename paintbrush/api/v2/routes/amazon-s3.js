var config = require('../config'),
	router = require('express').Router(),
	aws = require('aws-sdk'),
	uuid = require('node-uuid'),
	url = require('url');


aws.config.update({
	accessKeyId: config.aws.key,
	secretAccessKey: config.aws.secret,
	signatureVersion: 'v4',
	region: config.aws.region
});

router

	.get(['/signed-url/:ext/:folder', '/signed-url/:ext'], function (req, res) {
		var folder = req.params.folder;

		var ext = (req.params.ext || '').toLowerCase();
		if (!/^[0-9A-Za-z]+$/.test(ext)) return res.status(400).json({ Message: 'File extension required' })

		var objectName = (folder ? folder + '/' : '') + uuid.v4() + '.' + ext;

		var bucket = config.aws.s3.bucket;

		if (['mp4', 'm4v', 'mov', 'avi', '3gp', 'mkv'].indexOf(ext) > -1) {
			bucket = config.aws.s3.videoBucketIn;
		}

		var s3 = new aws.S3();
		var s3_params = {
			Bucket: bucket,
			Key: objectName,
			Expires: 300,
			ACL: 'public-read'
		};
		s3.getSignedUrl('putObject', s3_params, function (err, signedUrl) {

			if (err) {
				logError(err, req, function () {
					res.status(500).json({ Message: 'Error creating signed URL' });
				});
			}
			else {
				var parsedUrl = url.parse(signedUrl);
				parsedUrl.search = null;
				var objectUrl = url.format(parsedUrl);
				res.json({ signedUrl: signedUrl, objectUrl: objectUrl })
			}

		})
	})

	.delete('/object/:objectUrl', function (req, res) {

		var objectUrl = req.params.objectUrl;

		if (!objectUrl.toLowerCase().indexOf(config.aws.region) < 0) {
			res.status(400).json({ Message: 'Url did not contain the expected AWS region: ' + config.aws.region });
		}
		else {
			var parsedUrl = url.parse(objectUrl),
				bucket = parsedUrl.hostname.split('.')[0],
				key = parsedUrl.pathname.slice(1);

			var s3 = new aws.S3();
			var params = {
				Bucket: bucket,
				Key: key
			};

			s3.deleteObject(params, function(err) {
				if (err) {
					logError(err, req, function () {
						res.status(500).json({ Message: 'Error deleting object' });
					});
				}
				else {
					res.json({ Message: 'Success' });
				}
			});

		}

	});


module.exports = router;
