(function(){

angular.module('ARN')

	.factory('videoService', ['$q', '$http', 'cacheProvider', function($q, $http, cacheProvider){

		var cache = cacheProvider('video'),
			endpoint = '/api/video/';

		return {

			add: function(video, profileID) {
				var d = $q.defer();

				$http.post(endpoint + 'add/' + profileID, video)
					.then(function(resp) {
						cache.remove();
						d.resolve(resp.data);
					}, d.reject);

				return d.promise;
			},

			get: function(id) {
				var d = $q.defer(), data = cache.get(id);

				if (data) {
					d.resolve(data);
				}
				else {
					$http.get(endpoint + id).then(
						function(resp) {
							cache.set(id, resp.data, 60);
							d.resolve(resp.data);
						}, d.reject);
				}

				return d.promise;
			},

			remove: function(id) {
				var d = $q.defer();

				$http.delete(endpoint + id + '/remove').then(
					function(resp) {
						cache.remove();
						d.resolve(resp.data);
					}, d.reject);

				return d.promise;
			},

			update: function(id, video) {
				var d = $q.defer();

				$http.put(endpoint + id + '/update', video).then(
					function(resp) {
						cache.remove();
						d.resolve(resp.data);
					}, d.reject);

				return d.promise;
			},

			list: function(profileID) {
				var d = $q.defer(), key = 'list-' + profileID, data = cache.get(key);

				if (data) {
					d.resolve(data);
				}
				else {
					$http.get(endpoint + profileID + '/list').then(
						function(resp) {
							cache.set(key, resp.data, 60);
							d.resolve(resp.data);
						},
						d.reject);
				}

				return d.promise;
			}

		};

	}])

})();