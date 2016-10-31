(function(){

angular.module('ARN')

	.factory('analytics', ['$q', '$http', function($q, $http){

		var endpoint = '/api/analytics/',

		get = function(key) {
			var d = $q.defer();

			$http.get(endpoint + key).then(function(resp) {
				d.resolve(resp.data);
			}, d.reject);

			return d.promise;
		},

		post = function(key, data) {
			var d = $q.defer();

			$http.post(endpoint + key, data).then(function(resp) {
				d.resolve(resp.data);
			}, d.reject);

			return d.promise;
		};

		return {

			event: {

				add: function(eventID, data) {
					data = data || {};
					data.EventID = eventID;

					return post('event', data);
				},

				list: function() {
					return get('event/list');
				}

			},


			users: {

				activity: {

					details: function (profileID, userProfileID) {
						return get(profileID + '/users/activity/' + userProfileID);
					},

					summary: function (profileID) {
						return get(profileID + '/users/activity/summary');
					},

					search: function(profileID, opts) {
						return post(profileID + '/users/activity/search', opts);
					}

				}

			}

		};

	}])

})();