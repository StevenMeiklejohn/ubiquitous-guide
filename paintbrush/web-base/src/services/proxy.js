(function(){

angular.module('ARN')

	.factory('proxyService', [function(){

		return {

			image: function(uri, maxWidth, maxHeight) {
				return '/api/v2/proxy/image/' + encodeURIComponent(uri) + '/' + (maxWidth || 500) + (maxHeight ? '/' + maxHeight : '');
			}

		};

	}])

})();