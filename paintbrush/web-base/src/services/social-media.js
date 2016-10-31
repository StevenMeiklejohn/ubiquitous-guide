(function(){

angular.module('ARN')

	.factory('socialMediaService', ['$q', '$http', 'cacheProvider', function($q, $http, cacheProvider){

		var cache = cacheProvider('social-media');

		return {

			listServices: function() {
				var d = $q.defer(), key = 'list-services', data = cache.get(key);

				if (data) {
					d.resolve(data);
				}
				else {
					$http.get('/api/social/services').catch(d.reject).then(function(resp) {
						cache.set(key, resp.data);
						d.resolve(resp.data);
					});
				}

				return d.promise;
			}

		};

	}])

})();