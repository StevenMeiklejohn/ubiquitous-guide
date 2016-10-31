(function(){

angular.module('ARN')

	.factory('websocket', ['$q', function($q){

		var listeners = {},
			host = location.hostname,
				protocol = 'http';

		if (host.indexOf('artretailnetwork.com') > -1) {
			var p = host.split('.');
			p[0] += '-ws';
			host = p.join('.');
			protocol += 's';
		}
		else {
			host += ':3030';
		}

		var socket = eio(protocol + '://' + host, {  }), reconnectTimeout;
		//var socket = eio('ws://' + location.hostname + (location.port ? ':' + location.port : ''), {  }), reconnectTimeout;

		socket.on('open', function(){
			//console.log('OPEN');
			clearTimeout(reconnectTimeout);

			if (localStorage.accessToken) {
				ws.authenticate();
			}
		});

		socket.on('message', function(msg) {
			//console.log('MESSAGE');
			//console.log(msg);

			if (typeof msg === 'string') {
				try {
					var _msg = JSON.parse(msg);

					//console.log(listeners);

					if (_msg.event && listeners[_msg.event]) {
						listeners[_msg.event].forEach(function (listener) {
							listener(_msg.data);
						})
					}
				}
				catch (e) {
					console.error('Unable to parse: ' + msg);
					console.error(e);
				}
			}
			else {
				// TODO: handle binary?
			}
		});

		socket.on('close', function(){
			//console.log('CLOSE');

			// re-connect
			reconnectTimeout = setTimeout(function(){
				socket.open();
			}, 2000);
		});



		//console.log(socket);

		var ws = {

			//
			// Associates the current access token with the current web socket client id
			//
			authenticate: function() {
				if (localStorage.accessToken) {
					if (socket.readyState === 'open') {
						ws.emit('auth', { accessToken: localStorage.accessToken });
					}
					else {
						setTimeout(ws.authenticate, 100);
					}
				}
			},



			//
			// De-associates the current web socket client id with user & profile
			//
			logout: function() {
				if (socket.readyState === 'open') {
					ws.emit('logout');
				}
			},


			//
			// Emits an event to the server
			//
			emit: function(eventType, data) {
				var d = $q.defer();

				if (typeof data === 'string') {
					data = { message: data };
				}

				socket.send(JSON.stringify({ event: eventType, data: data }), function() {
					d.resolve();
				});

				return d.promise;
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


		//
		// Authentication failure handler
		//
		ws.on('auth', function (resp) {
			//console.warn(resp);
			//console.log(localStorage.accessToken);
			if (!resp.Success) {
				if (resp.Token !== localStorage.accessToken) {
					ws.authenticate();
				}
				else if (resp.Message && resp.Message.indexOf('invalid')) {
					//window.location.reload();
				}
				//else if (resp.Message && resp.Message.indexOf('expired')) {
				//	refresh?
				//}
				else {
					setTimeout(ws.authenticate, 30000);
				}
			}
		});

		return ws;

	}])

})();