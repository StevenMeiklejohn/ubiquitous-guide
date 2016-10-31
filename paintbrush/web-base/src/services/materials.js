(function(){

angular.module('ARN')

	.factory('materialsService', ['$q', '$http', 'cacheProvider', function($q, $http, cacheProvider){

		var cache = cacheProvider('materials');

		return {

			list: function(profileID) {
				var d = $q.defer(), key = 'list' + (profileID ? '/' + profileID : ''), data = cache.get(key);

				if (data) {
					d.resolve(data);
				}
				else {
					$http.get('/api/materials' + (profileID ? '/' + profileID : '')).catch(d.reject).then(function(resp) {
						cache.set(key, resp.data);
						d.resolve(resp.data);
					});
				}

				return d.promise;
			}

		};

	}])

})();