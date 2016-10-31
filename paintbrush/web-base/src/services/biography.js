(function(){

angular.module('ARN')

	.factory('biographyService', ['$q', '$http', 'cacheProvider', function($q, $http, cacheProvider){

		var cache = cacheProvider('bio'),

			get = function(key, timeLimit) {
				var d = $q.defer(), data = cache.get(key);

				if (data) {
					d.resolve(data);
				}
				else {
					$http.get('/api/' + key).then(function(resp) {
						cache.set(key, resp.data, timeLimit);
						d.resolve(resp.data);
					}, d.reject);
				}

				return d.promise;
			},

			put = function(action, data) {
				var d = $q.defer();

				$http.put('/api/' + action, data).then(
						function(resp) {
							cache.remove();
							d.resolve(resp.data);
						},
						d.reject);

				return d.promise;
			};


		return {

			get: function(profileID) {
				return get('biography/' + profileID);
			},


			answers: function(profileID) {
				return get('profile/' + profileID + '/answers');
			},

			questions: {

				list: function(profileType, typeID) {
					return get('question/' + profileType + '/list/' + typeID);
				},

				types: function(profileType) {
					return get('question/' + profileType + '/types');
				}

			},

			update:  function(profileID, data) {
				return put('biography/' + profileID + '/update', data);
			}


		};

	}])

})();