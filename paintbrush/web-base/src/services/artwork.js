(function(){

angular.module('ARN')

	.factory('artworkService', ['$q', '$http', 'cacheProvider', function($q, $http, cacheProvider){

		var cache = cacheProvider('artwork'),
			endpoint = '/api/artwork/',

		// generic getter for artwork calls
		// - returns a promise
		// - caches all results
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
					function(resp) {
						d.reject(resp.data);
					});
			}

			return d.promise;
		},

		post = function (key, data) {
			var d = $q.defer();

			$http.post(endpoint + key, data)
				.then(function(resp) {
					d.resolve(resp.data);
				}, d.reject);

			return d.promise;
		},


		put = function (key, data) {
			var d = $q.defer();

			$http.put(endpoint + key, data)
				.then(function(resp) {
					d.resolve(resp.data);
				}, d.reject);

			return d.promise;
		},


		// sets the like status for a specific artwork
		toggleLikeStatus = function(id, status, profileID) {
			var d = $q.defer();

			$http.get(endpoint + id + '/' + status + '/' + profileID).then(
				function(resp) {
					cache.remove(id);
					d.resolve(resp.data);
				},
				function(resp) {
					d.reject(resp.data);
				});

			return d.promise;
		};


		return {

			//
			// Methods returning static lists of data
			//

			dimensionUnits: function() {
				return get('dimension-units');
			},

			priceBands: function() {
				return get('pricebands');
			},

			statuses: function() {
				return get('statuses');
			},

			styles: function(profileID) {
				return get('styles' + (profileID ? '/' + profileID : ''));
			},

			subjects: function(profileID) {
				return get('subjects' + (profileID ? '/' + profileID : ''));
			},

			timeSpent: function() {
				return get('time-spent');
			},

			types: function(profileID) {
				return get('types' + (profileID ? '/' + profileID : ''));
			},

			//
			// Artwork specific methods
			//

			add: function(artwork) {
				var d = $q.defer();

				$http.post(endpoint + 'add', artwork).then(
					function(resp) {
						d.resolve(resp.data);
					}, d.reject);

				return d.promise;
			},

			bulkAdd: function(profileID, artworks) {
				var d = $q.defer();

				$http.post(endpoint + 'bulk-add', { Artworks: artworks, ProfileID: profileID })
					.then(function(resp) {
						d.resolve(resp.data);
					}, d.reject);

				return d.promise;
			},

			
			get: function (id) {
				return get(id, 30);
			},

			remove: function(artworkID) {
				var d = $q.defer();

				$http.delete(endpoint + artworkID + '/remove')
					.then(function() {
						d.resolve();
					}, d.reject);

				return d.promise;
			},

			search: function(opts) {
				return post('search', opts);
			},

			update: {

				activCanvas: function(id, data) {
					return put(id + '/activcanvas', data)
							.then(function(data) {
								cache.remove(id);
								return data;
							});
				},


				general: function(id, data) {
					return put(id + '/general', data)
						.then(function(data) {
							cache.remove(id);
							return data;
						});
				}

			},
			
			
			
			//
			// Actions
			//
			
			like: function (id, profileID) {
				return toggleLikeStatus(id, 'like', profileID);
			},
			
			unlike: function (id, profileID) {
				return toggleLikeStatus(id, 'unlike', profileID);
			}


		};

	}])

})();