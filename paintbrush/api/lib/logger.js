var util = require('util');

Object.defineProperty(global, '__stack', {
	get: function () {
		var orig = Error.prepareStackTrace;
		Error.prepareStackTrace = function (_, stack) {
			return stack;
		};
		var err = new Error;
		Error.captureStackTrace(err, arguments.callee);
		var stack = err.stack;
		Error.prepareStackTrace = orig;
		return stack;
	}
});

//
// Logs unexpected errors to database, records express request object and stack trace
//
global.logError = function (err, req, complete) {

	try {
		if (_app.get('env') === 'development') {
			console.error(err);
		}

		var stack = __stack, trace = '';
		for (var i = 1; i < stack.length; i++) {
			var item = stack[i];
			if (item) {
				trace +=
					(item.getFunctionName() || 'Anonymous') + '@ ' +
					item.getFileName() + ':' +
					item.getLineNumber() + ':' +
					item.getColumnNumber() +
					'\n';
			}
		}

		req = req || {};
		_req = {
			url: req.originalUrl,
			params: req.params,
			query: req.query,
			body: req.body,
			headers: req.headers
		};

		db('ErrorLog').insert({
			StackTrace: trace,
			ErrorObject: util.inspect(err),
			Request: JSON.stringify(_req)
		})
		.then(function () {
			complete && complete();
		})
		.catch(function () {
			complete && complete();
		})
	}
	catch (e) {
		complete && complete();
	}


};

//
// Util function to process errors within the data contract section of the API
//
// Returns a HTTP status code and error message to send back to the client
//
global.processError = function (err, req, complete, message) {
console.error(err);
	var defaultMessage = 'An unexpected error occurred';

	// if service code has returned an http status code do not log to database
	if (err.status) {
		complete({ status: err.status, body: { Message: err.message || err.Message || defaultMessage }, url: err.url });
	}
	// otherwise log to database and return a response
	else {
		logError(err, req, function () {
			complete({ status: 500, body: { Message: message || defaultMessage } });
		});
	}

};