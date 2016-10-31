var engine = require('engine.io'),
	http = require('http'),
	fs = require('fs'),
	AccessToken = require('../auth/access-token');

// Custom event listeners
var listeners = {};

// Map of all connected clients to corresponding user/profile id's
var clients = {
	profileID: {},
	userID: {},
	ids: {}
};

// Tidies up client map when a socket is disconnected/de-authorised
var tidyClients = function(socketID) {
	var ids = clients.ids[socketID];

	if (ids) {
		if (clients.profileID[ids.profileID]) {
			for (var i = clients.profileID[ids.profileID].length -1; i > -1; i-- ) {
				if (clients.profileID[ids.profileID][i] === socketID) {
					clients.profileID[ids.profileID].splice(i, 1);
				}
			}
			if (!clients.profileID[ids.profileID].length) {
				delete clients.profileID[ids.profileID];
			}
		}
		if (clients.userID[ids.userID]) {
			for (var i = clients.userID[ids.userID].length - 1; i > -1; i-- ) {
				if (clients.userID[ids.userID][i] === socketID) {
					clients.userID[ids.userID].splice(i, 1);
				}
			}
			if (!clients.userID[ids.userID].length) {
				delete clients.userID[ids.userID];
			}
		}

		delete clients.ids[socketID];
		//console.log(clients);
	}
};



var io = engine.attach(http.createServer().listen(3030));
//var io = new engine.Server();
//
//global._app.all('/engine.io/*', function (req, res, next) {
//	io.handleRequest(req, res);
//});



io.on('connection', function (socket) {

	//console.log('\x1b[33mANALYTICS:\x1b[0m Event ' + req.body.EventID + ': ' + JSON.stringify(data));

	console.log('\x1b[33mSOCKET\x1b[0m: \x1b[36mOPEN\x1b[0m: ' + socket.id);

	socket.on('error', function() {
		console.error('\x1b[33mSOCKET\x1b[0m: \x1b[31mERROR\x1b[0m');
		console.error(arguments);
	});

	socket.on('message', function(msg){



		if (typeof msg === 'string') {
			try {
				var _msg = JSON.parse(msg);
				if (_msg.event !== 'auth') {
					console.log('\x1b[33mSOCKET\x1b[0m: \x1b[36mMESSAGE\x1b[0m: ' + socket.id);
					console.log(msg);
				}
				if (_msg.event && listeners[_msg.event]) {
					listeners[_msg.event].forEach(function (listener) {
						listener(_msg.data, socket);
					})
				}
			}
			catch (e) {
				console.error('Unable to parse: ' + msg)
			}
		}
		else {
			// TODO: handle binary?
		}

	});

	socket.on('close', function() {
		console.log('\x1b[33mSOCKET\x1b[0m: \x1b[36mCLOSE\x1b[0m: ' + socket.id);

		tidyClients(socket.id);

		console.log('\x1b[33mSOCKET\x1b[0m: \x1b[36mCLIENTS\x1b[0m: ' + Object.keys(clients.ids).length + ' authenticated / ' + Object.keys(io.clients).length + ' total');
	});

});



var Socket = {


	emit: function(eventType, scope, data) {

		console.log('\x1b[33mSOCKET\x1b[0m: \x1b[36mEMIT\x1b[0m: \x1b[32m' + eventType + '\x1b[0m:');
		console.log(JSON.stringify({ Scope: scope, Data: data }));

		var _clients = [];

		if (scope.profileID) {
			if (Array.isArray(scope.profileID)) {
				scope.profileID.forEach(function(profileID) {
					_clients = _clients.concat(clients.profileID[profileID] || []);
				})
			}
			else {
				_clients = _clients.concat(clients.profileID[scope.profileID] || []);
			}
		}
		if (scope.userID) {
			if (Array.isArray(scope.userID)) {
				scope.userID.forEach(function(userID) {
					_clients = _clients.concat(clients.userID[userID] || []);
				})
			}
			else {
				_clients = _clients.concat(clients.userID[scope.userID] || []);
			}
		}

		if (_clients.length) {
			if (typeof data === 'string') {
				data = { message: data };
			}

			var _sent = {};
			_clients.forEach(function(id) {
				if (io.clients[id] && !_sent[id]) {
					io.clients[id].send(JSON.stringify({ event: eventType, data: data }));
					_sent[id] = 1;
				}
			});

		}
	},


	//
	// Adds a listener for a specific event
	//
	on: function(eventType, listener) {
		listeners[eventType] = listeners[eventType] || [];
		listeners[eventType].push(listener);
	},


	//
	// Removes a listener for a specific event
	//
	off: function(eventType, listener) {
		if (!listener) {
			delete listeners[eventType];
		}
		else if (listeners[eventType]) {
			for (var i = listeners[eventType].length - 1; i > -1; i--) {
				if (listeners[eventType][i] === listener) {
					listeners[eventType].splice(i, 1);
				}
			}
		}
	}

};


Socket.on('auth', function(data, socket) {

	if (!clients.ids[socket.id]) {
		var req = { headers: { authorization: 'Bearer ' + data.accessToken } };

		AccessToken.getUser(req).then(function(user) {

			var success = false, message;

			if (!user) {
				message = 'Access token was invalid.';
				console.log('\x1b[33mSOCKET\x1b[0m: \x1b[31mAUTHENTICATION FAILED\x1b[0m: ' + socket.id + ': ' + message);
			}
			else if (user.Expires < new Date()) {
				message = 'Access token has expired.';
				console.log('\x1b[33mSOCKET\x1b[0m: \x1b[31mAUTHENTICATION FAILED\x1b[0m: ' + socket.id + ': ' + message);
			}
			else {
				console.log('\x1b[33mSOCKET\x1b[0m: \x1b[32mAUTHENTICATED\x1b[0m: ' + socket.id + ': ' + user.Name + ' (PID:' + user.ProfileID + ', UID:' + user.UserID + ')');

				clients.ids[socket.id] = { profileID: user.ProfileID, userID: user.UserID };
				clients.profileID[user.ProfileID] = clients.profileID[user.ProfileID] || [];
				clients.userID[user.UserID] = clients.userID[user.UserID] || [];
				clients.profileID[user.ProfileID].push(socket.id);
				clients.userID[user.UserID].push(socket.id);

				success = true;
				message = 'Success';
			}

			io.clients[socket.id].send(JSON.stringify({ event: 'auth', data: { Success: success, Message: message, Token: data.accessToken } }));

			console.log('\x1b[33mSOCKET\x1b[0m: \x1b[36mCLIENTS\x1b[0m: ' + Object.keys(clients.ids).length + ' authenticated / ' + Object.keys(io.clients).length + ' total');
		});
	}

});

Socket.on('logout', function(data, socket) {
	console.log('\x1b[33mSOCKET\x1b[0m: \x1b[32mLOGOUT\x1b[0m: ' + socket.id);
	tidyClients(socket.id);
});


//
// Broadcast to all clients the current client dependency and web app version
//
// - This informs clients a new version of the platform has been deployed
//
setTimeout(function () {
	var appVersion = 0,
		send = function () {
			var profiles = [];
			for (var id in clients.profileID) {
				profiles.push(id);
			}
			Socket.emit('cdv/change', { profileID: profiles }, { version: clientDependencyVersion, appVersion: appVersion });
		};

	fs.readFile('./' + webAppName + '/build.json', 'utf8', function (err, buildConfStr) {
		if (!err) {
			try {
				var buildConf = JSON.parse(buildConfStr);
				appVersion = buildConf['app-version'];
				send();
			}
			catch (e) {
				console.error(e);
				send();
			}
		}
		else {
			console.error(err);
			send();
		}
	});

}, 5000);


module.exports = Socket;