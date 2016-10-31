(function () {
	'use strict';

	angular.module('ARN')
		.controller('AnalyticsUsersActivityDetails', ['$scope', 'profileService', 'proxyService', '$stateParams', function($scope, profileService, proxy, $stateParams) {

			profileService.get($stateParams.profileID).then(function (profile) {
				$scope.profile = profile;
				$scope.profileImageStyle = { backgroundImage: 'url(' + proxy.image(profile.ImageURI, 180) + ')' };
			});

		}]);

})();
