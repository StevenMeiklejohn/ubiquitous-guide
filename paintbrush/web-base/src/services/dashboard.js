(function(){

angular.module('ARN')

	.factory('dashboardService', ['$q', '$http', 'cacheProvider', function($q, $http, cacheProvider){

		var cache = cacheProvider('dashboard'),

		// generic getter for artist calls
		// - returns a promise
		// - caches all results
		get = function(key, timeLimit) {
			var d = $q.defer(), data = cache.get(key);

			if (data) {
				d.resolve(data);
			}
			else {
				$http.get('/api/dashboard/' + key).then(function(resp) {
					cache.set(key, resp.data, timeLimit);
					d.resolve(resp.data);
				}, d.reject);
			}

			return d.promise;
		};

		return {


			artwork: {

				popular: function (profileID) {
					return get(profileID + '/artwork/popular');
				},

				count: {

					likes: function (profileID) {
						return get(profileID + '/artwork/count/likes');
					},

					scans: function (profileID) {
						return get(profileID + '/artwork/count/scans');
					},

					shortlisted: function (profileID) {
						return get(profileID + '/artwork/count/shortlisted');
					},

					total: function (profileID) {
						return get(profileID + '/artwork/count/total');
					},

					views: function (profileID) {
						return get(profileID + '/artwork/count/views');
					}
				},

				interval: {

					likes: function (profileID, interval, datapoints) {
						return get(profileID + '/artwork/interval/likes/' + interval + '/' + datapoints);
					},

					scans: function (profileID, interval, datapoints) {
						return get(profileID + '/artwork/interval/scans/' + interval + '/' + datapoints);
					},

					shortlisted: function (profileID, interval, datapoints) {
						return get(profileID + '/artwork/interval/shortlisted/' + interval + '/' + datapoints);
					},

					total: function (profileID, interval, datapoints) {
						return get(profileID + '/artwork/interval/total/' + interval + '/' + datapoints);
					},

					views: function (profileID, interval, datapoints) {
						return get(profileID + '/artwork/interval/views/' + interval + '/' + datapoints);
					}
				}

			},

			customers: {

				mostActive: function (profileID) {
					return get(profileID + '/customers/most-active', 0);
				}

			},

			profile: {

				count: {

					views: function (profileID) {
						return get(profileID + '/profile/count/views');
					}

				},

				interval: {

					views: function (profileID, interval, datapoints) {
						return get(profileID + '/profile/interval/views/' + interval + '/' + datapoints);
					}

				},

				viewed: {

					details: function (profileID) {
						return get(profileID + '/profile/viewed/details');
					}

				}

			},


			notifications: function (profileID) {
				return get(profileID + '/notifications');
			}


		};

	}])

})();