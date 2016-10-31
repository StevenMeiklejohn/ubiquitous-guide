var path = require('path'),
	env = process.env.NODE_ENV;

var baseURL = 'https://' + (env === 'staging' ? 'staging' : 'members') + '.artretailnetwork.com';

//
// This file defines all shared configuration data for every version of the API
//
// NOTE: Different versions of the API may append to or overwrite these settings locally
//
module.exports = {
	auth: {
		timeout: 86400	// seconds
	},
	activCanvas: {
		demoVideoID: 8,
		concurrentActivationLimit: 2,	// max number of artworks to start activating within a single scheduler cycle
		maxUploadAttempts: 2,			// max number of failed vuforia upload attempts before giving up
		cycleWaitPeriod: 10				// number of seconds to wait until starting the next scheduler cycle
	},
	aws: {
		key: 'AKIAI3CTXLWBC6776F4A',
		secret: '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',
		region: 'eu-west-1',
		s3: {
			bucket: 'arn-resources' + (env === 'production' ? '' : '-' + env),
			videoBucketIn: 'arn-videos-in' + (env === 'production' ? '' : '-' + env),
			videoBucketOut: 'arn-videos' + (env === 'production' ? '' : '-' + env)
		},
		transcoder: {
			pipelineId: (env === 'production' ? '1440084090917-9vqqo5' : env === 'staging' ? '1446050366565-9juaku' : '1444732296731-eezp5r')
		}
	},
	crm: {
		ip: /109.233.115.218$/,
		api: 'http://crm.artretailnetwork.com/service/v4_1/rest.php',
		user: 'portal',
		pass: 'crmb0t'
	},
	email: {
		support: 'hello@artretailnetwork.com',
		noReply: 'no-reply@artretailnetwork.com',
		pattern: /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
		verify: {
			subject: 'Verify your Art Retail Network registration',
			body:'Your email was used to create an account with Art Retail Network' +
				'Please verify your email address by clicking the following link:\n\n',
			url: baseURL + '/verify?c='
		},
		defaultTemplate: 'ARN'
	},
	facebook: {
		clientID: (env === 'development' ? '859212844198513' : '857891294330668'),
		clientSecret: (env === 'development' ? 'a42be9385426ece7e5fccfe4969def16' : 'a15d4804fb6ea52a37ea0b6cafcdf76d'),
		callbackURL: '/api/auth/facebook/callback',
		completeURL: baseURL + '/api/auth/facebook/complete'
	},
	google: {
		clientID: '970982367961-352qcruuj69dq5649eiav9f5skd4bko0.apps.googleusercontent.com',
		clientSecret: 'wC3lqhzxGXfTsmdmro-XNZBF',
		callbackURL: '/api/auth/google/callback',
		completeURL: baseURL + '/api/auth/google/complete',

		cloudMessaging: {
			senderID: '970982367961',
			keys: {
				server: 'AIzaSyAsz2aDqlSC5gKdUJeYNJl5XBHIvPUM5eE',
				android: 'AIzaSyCIgzfvq7EAbk0yIep4XScgYB9c7jkldJE',
				iOS: 'AIzaSyAMl8AAXmws6AB5LJB046yY5iZnSWJVSY8'
			}
		}
	},
	onesignal: {
		apiKey: 'YjgwZDNhMDItOGIwZS00YjdiLThmZGUtYzJhNTEyYjY0ZmIw',
		appID: 'c1ec26f8-e6a3-4210-acbd-fa08559b9eb7'
	},
	password: {
		minLength: 7
	},
	profile: {
		defaultImage: 'img/profile-placeholder.png'
	},
	proxy: {
		cachePath: 'api/img-cache',
		cachePathAbs: path.resolve(__dirname + '/img-cache'),
		maxHeight: 2000,
		whitelist: [/\.gal-link\.com$/, /\.artretailnetwork\.com$/, /s3-eu-west-1\.amazonaws\.com$/, /fbcdn\.net$/, /googleusercontent\.com$/]
	},
	site:{
		baseURL: baseURL
	},
	smtp: {
		host: 'smtp.mailgun.org',
		secure: true,
		port: 465,
		user: 'postmaster@mg.artretailnetwork.com',
		pass: '7b062495b997ec8ae9208dfe3e08e138'
	},
	stripe:{
		secretKey: env === 'production' ? 'sk_live_JgpCJOamBnlPbeEkULooI5fN' : 'sk_test_Jh5IdSBaGeU5wGccSjqdVcxg',
		publicKey: env === 'production' ? 'pk_live_arxMz4UHgNXE33CzHlJOT16x' : 'pk_test_grmRG0E1N2OFIlkXF6gDY1um'
	},
	video: {
		whitelist: [/youtube\.com$/, /youtu\.be$/, /amazonaws\.com$/]
	},
	vuforia: {
		accessKey: '162a087fcfc2be968aad44295cbacfb4346a36e0',
		secretKey: '7f63aac5aefe115b465fd2709a75603402a90434',
		maxFileSize: 2 * 1024 * 1024,
		maxWidth: 1500,		// to improve scaling down speed limit width to this value
		maxHeight: 1500,
		maxRequestPerDay: 10000 * 0.99	// stop making new requests to vuforia if we hit this number in a single day
	}
};
