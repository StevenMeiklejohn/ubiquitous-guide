(function(){

	angular.module('ARN').factory('shortlistService', ['$rootScope', '$http', '$q', '$location', 'cacheProvider',
		function($rootScope, $http, $q, $location, cacheProvider) {

			var cache = cacheProvider('shortlist'),
				endpoint = '/api/shortlist/',

			get = function(key, timeLimit) {
				var d = $q.defer(), data = cache.get(key);

				if (data) {
					d.resolve(data);
				}
				else {
					$http.get(endpoint + key).then(
						function(resp) {
							cache.set(key, resp.data, timeLimit);
							d.resolve(resp.data);
						},
						d.reject);
				}

				return d.promise;
			},


			put = function(action, data) {
				var d = $q.defer();

				$http.put(endpoint + action, data).then(
					function(resp) {
						cache.remove();
						d.resolve(resp.data);
					},
					d.reject);

				return d.promise;
			},


			post = function(action, data) {
				var d = $q.defer();

				$http.post(endpoint + action, data).then(
					function(resp) {
						cache.remove();
						d.resolve(resp.data);
					},
					d.reject);

				return d.promise;
			},


			del = function(action) {
				var d = $q.defer();

				$http.delete(endpoint + action).then(
					function(resp) {
						cache.remove();
						d.resolve(resp.data);
					},
					d.reject);

				return d.promise;
			};




			//
			// Notification service class
			//
			return {

				archive: function (shortlistID) {
					return put(shortlistID + '/archive');
				},

				create: function(profileID, shortlist) {
					return post('create/' + profileID, shortlist)
				},

				get: function (shortlistID) {
					return get(shortlistID);
				},

				list: {

					active: function (profileID) {
						return get(profileID + '/list/active');
					},

					archived: function (profileID) {
						return get(profileID + '/list/archived');
					},

					types: function () {
						return get('list/types');
					}

				},

				item: {

					add: function (shortlistID, items) {
						return post(shortlistID + '/add', items).finally(function() {
							cacheProvider('artwork').remove();
						});
					},

					remove: function (shortlistID, itemID) {
						return del(shortlistID + '/item/' + itemID).finally(function() {
							cacheProvider('artwork').remove();
						});
					}

				},


				remove: function (shortlistID) {
					return del(shortlistID);
				},

				update: function(shortlistID, shortlist) {
					return put(shortlistID + '/update', shortlist)
				}

				//unread: function (profileID) {
				//	return get(profileID + '/count/unread', 1);
				//},
				//
				//get: function (profileID, notificationID) {
				//	return get(profileID + '/' + notificationID);
				//},
				//
				//markAsRead: function (profileID, notificationID) {
				//	return put(profileID, notificationID, 'mark-as-read');
				//},
				//
				//remove: function (profileID, notificationID) {
				//	return del(profileID, notificationID, 'remove');
				//},
				//
				//search: function(profileID, opts) {
				//	var d = $q.defer();
				//
				//	$http.post('/api/notifications/' + profileID + '/search', opts).then(
				//		function(resp) {
				//			d.resolve(resp.data);
				//		},
				//		d.reject);
				//
				//	return d.promise;
				//}

			};

		}])


})();
