(function(){

angular.module('ARN')

	.factory('messageService', ['$q', '$http', 'cacheProvider', function($q, $http, cacheProvider){

		var cacheNotifications = cacheProvider('notifications');

		return {

			send: function(message) {
				var d = $q.defer();

				$http.post('/api/message/send', message).then(function(resp) {
					cacheNotifications.clear();
					d.resolve(resp.data);
				}, d.reject);

				return d.promise;
			}

		};

	}])

})();