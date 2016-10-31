(function(){

	angular.module('ARN').factory('notification', ['$rootScope', '$http', '$q', '$location', 'cacheProvider', 'websocket', 'userPreferencesService',
		function($rootScope, $http, $q, $location, cacheProvider, websocket, preferences) {

			var Notification = window.Notification || window.mozNotification || window.webkitNotification,
				settings = { desktop: {}, email: {}},
				cache = cacheProvider('notifications'),

			// generic getter for api calls
			// - returns a promise
			// - caches all results
			get = function(key, timeLimit) {
				var d = $q.defer(), data = cache.get(key);

				if (data) {
					d.resolve(data);
				}
				else {
					$http.get('/api/notifications/' + key).then(
						function(resp) {
							cache.set(key, resp.data, timeLimit);
							d.resolve(resp.data);
						},
						d.reject);
				}

				return d.promise;
			},


			put = function(notificationID, action, data) {
				var d = $q.defer();

				$http.put('/api/notifications/' + notificationID + '/' + action, data).then(
						function(resp) {
							cacheProvider('dashboard').remove();
							cache.remove(notificationID);
							d.resolve(resp.data);
						},
						d.reject);

				return d.promise;
			},


			del = function(notificationID, action) {
				var d = $q.defer();

				$http.delete('/api/notifications/' + notificationID + '/' + action).then(
						function(resp) {
							cacheProvider('dashboard').remove();
							cache.remove(notificationID);
							d.resolve(resp.data);
						},
						d.reject);

				return d.promise;
			};




			//
			// Notification service class
			//
			var notification = {

				settings: {
					//
					// Loads the current users notification settings
					//
					load : function() {
						preferences.get('notification').then(function (data) {
							settings = data;
							if (settings.desktop.enabled) {
								notification.desktop.requestPermission();
							}
						});
					}
				},

				//
				// Handles all desktop specific notifications
				//
				desktop: {
					//
					// Displays a new desktop notification
					//
					show: function(title, body) {
						if (settings.desktop.enabled) {
							return new Notification(
								title, {
									body: body,
									icon: "https://members.artretailnetwork.com/img/logo-new-120-sq.png"
								}
							);
						}
					},
					//
					// Requests permission from user to display desktop notifications
					//
					requestPermission: function() {
						Notification.requestPermission();
					}
				},


				//
				// API wrapper
				//
				list: {

					priorities: function () {
						return get('list/priorities');
					},

					types: function () {
						return get('list/types');
					},

					recipients: function (profileID) {
						return get(profileID + '/list/recipients');
					}

				},

				unread: function (profileID) {
					return get(profileID + '/count/unread', 1);
				},

				get: function (notificationID) {
					return get(notificationID);
				},

				markAsRead: function (notificationID) {
					return put(notificationID, 'mark-as-read');
				},

				remove: function (notificationID) {
					return del(notificationID, 'remove');
				},

				search: function(profileID, opts) {
					var d = $q.defer();

					$http.post('/api/notifications/' + profileID + '/search', opts).then(
						function(resp) {
							d.resolve(resp.data);
						},
						d.reject);

					return d.promise;
				}

			};


			//
			// Listen for desktop notifications pushed via our websocket connection
			//
			websocket.on('notification', function(data) {
				var _n = notification.desktop.show(data.Subject, 'Click for details');
				_n.onclick = function() {
					$location.url('/inbox/' + data.ID);
					_n.close();
					$rootScope.forceDigest();
				}
			});

			return notification;

		}])


})();
