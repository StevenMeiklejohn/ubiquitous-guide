(function(){

angular.module('ARN')

	.factory('profileService', ['$q', '$http', 'cacheProvider', function($q, $http, cacheProvider){

		var cache = cacheProvider('profile'),
			endpoint = '/api/profile/',


			get = function(key, timeLimit) {
				var d = $q.defer(), data = cache.get(key);

				if (data) {
					d.resolve(data);
				}
				else {
					$http.get(endpoint + key).then(function(resp) {
						cache.set(key, resp.data, timeLimit);
						d.resolve(resp.data);
					}, d.reject);
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
			};


		return {

			cache: {
				remove: cache.remove
			},

			get: function(profileID) {
				return get(profileID, 60);
			},

			//get: {
			//	base: function(profileID) {
			//		return get(profileID + '/base', 60);
			//	},
			//
			//	artist: function(profileID) {
			//		return get(profileID + '/artist', 60);
			//	},
			//
			//	activCanvas: function(profileID) {
			//		return get(profileID + '/activcanvas', 60);
			//	},
			//
			//	contact: function(profileID) {
			//		return get(profileID + '/contact', 60);
			//	},
			//
			//	consumer: function(profileID) {
			//		return get(profileID + '/consumer', 60);
			//	},
			//
			//	gallery: function(profileID) {
			//		return get(profileID + '/gallery', 60);
			//	},
			//
			//	socialMedia: function(profileID) {
			//		return get(profileID + '/social-media', 60);
			//	}
			//}


			update: {

				base: function(profileID, data) {
					return put(profileID + '/base', data);
				},

				activCanvas: function(profileID, data) {
					return put(profileID + '/activcanvas', data);
				},

				artist: function(profileID, data) {
					return put(profileID + '/artist', data);
				},

				awards: function(profileID, data) {
					return put(profileID + '/awards', data);
				},

				contact: function(profileID, data) {
					return put(profileID + '/contact', data);
				},

				consumer: function(profileID, data) {
					return put(profileID + '/consumer', data);
				},

				gallery: function(profileID, data) {
					return put(profileID + '/gallery', data);
				},

				socialMedia: function(profileID, data) {
					return put(profileID + '/social-media', data);
				}

			}

			//
			//
			//update: function (id, profile) {
			//	var d = $q.defer();
			//
			//	$http.put('/api/profile/' + id + '/update', profile).then(
			//		function(resp) {
			//			cache.remove(id);
			//			d.resolve(resp.data);
			//		}, d.reject);
			//
			//	return d.promise;
			//}

		};

	}])

})();