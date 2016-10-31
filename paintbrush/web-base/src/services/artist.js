(function(){

angular.module('ARN')

	.factory('artistService', ['$q', '$http', 'cacheProvider', function($q, $http, cacheProvider){

		var cache = cacheProvider('artist'),

		// generic getter for artist calls
		// - returns a promise
		// - caches all results
		get = function(key, timeLimit) {
			var d = $q.defer(), data = cache.get(key);

			if (data) {
				d.resolve(data);
			}
			else {
				$http.get('/api/artist/' + key).then(function(resp) {
					cache.set(key, resp.data, timeLimit);
					d.resolve(resp.data);
				}, d.reject);
			}

			return d.promise;
		};

		return {

			ageBrackets: function() {
				return get('age-brackets');
			},

			awards: {

				list: function() {
					return get('awards/list');
				}

			},

			qualifications: {

				list: function() {
					return get('qualifications/list');
				}

			},

			types: function() {
				return get('types');
			},

			workspaces: function () {
				return get('workspaces');
			},

			search: function(opts) {
				var d = $q.defer();

				$http.post('/api/artist/search', opts).then(
					function(resp) {
						d.resolve(resp.data);
					},
					d.reject);

				return d.promise;
			}

		};

	}])

})();