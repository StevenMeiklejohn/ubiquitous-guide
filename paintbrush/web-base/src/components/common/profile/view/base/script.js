

angular.module('ARN')

.directive('profileViewBaseInfo', ['proxyService', function (proxy) {
	return {
		templateUrl: 'components/common/profile/view/base/tpl.htm',
		replace: true,
		restrict: 'E',
		scope: { profile: '=' },
		controller: ['$scope', function ($scope) {
			var profile = $scope.profile;

			var init = function () {
				$scope.profileImageStyle = { backgroundImage: 'url(' + proxy.image(profile.ImageURI, 280) + ')' };
			};

			if (profile.ID > 0) {
				init();
			}
			else {
				var watcher = $scope.$watch('profile', function (val) {
					if (val.ID > 0) {
						profile = val;
						watcher();
						init();
					}
				})
			}
		}]
	}
}]);

