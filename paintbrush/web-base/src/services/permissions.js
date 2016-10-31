(function(){

angular.module('ARN')

	.factory('permissionService', ['$q', '$http', 'cacheProvider', function($q, $http, cacheProvider){

		var cache = cacheProvider('permissions'),
			endpoint = '/api/permissions/',

		// generic getter
		get = function(key, timeLimit) {
			var ckey = key + '/' + (localStorage.profileID || '0');

			var d = $q.defer(), data = cache.get(ckey);

			if (data) {
				d.resolve(data);
			}
			else {
				$http.get(endpoint + key).then(
					function(resp) {
						cache.set(ckey, resp.data, timeLimit);
						d.resolve(resp.data);
					},
					d.reject);
			}

			return d.promise;
		};


		return {

			artwork: {
				check: function(artworkID, action) {
					return get('artwork/check/' + artworkID + '/' + action, 60);
				}
			},

			profile: {
				check: function(profileID, action) {
					return get('profile/check/' + profileID + '/' + action, 60);
				}
			}

		};

	}])

})();