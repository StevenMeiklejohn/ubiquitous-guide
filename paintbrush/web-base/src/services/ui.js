(function(){

angular.module('ARN')

	.factory('ui', [function() {

		var _uid = 1;

		return {

			// returns a unique id for use in generated html components
			uid: function () {
				return _uid++;
			}

		}


	}])

})();