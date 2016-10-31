(function(){

angular.module('ARN')

	.factory('userPreferencesService', ['$q', '$http', 'cacheProvider', function($q, $http, cacheProvider){

		var cache = cacheProvider('user-preferences');

		return {

			get: function(category, key) {
				var d = $q.defer(), ckey = category + (key || ''), data = cache.get(ckey);

				if (data) {
					d.resolve(data);
				}
				else {
					$http.get('/api/user-preferences/' + category + '/' + (key || '')).catch(d.reject).then(function(resp) {
						if (resp) {
							cache.set(key, resp.data, 60);
							d.resolve(resp.data);
						}
						else {
							d.reject();
						}
					});
				}

				return d.promise;
			},

			set: function(category, key, value) {
				var d = $q.defer();

				$http.put('/api/user-preferences/' + category + '/' + (key || ''), typeof value === 'object' ? value : { value: value }).catch(d.reject).then(function(resp) {
					if (resp) {
						d.resolve(resp.data);
					}
					else {
						d.reject();
					}
				});

				return d.promise;
			}

		};

	}])

})();