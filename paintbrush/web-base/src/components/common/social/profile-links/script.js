

angular.module('ARN')

.directive('socialProfileLinks', [function () {
	return {
		templateUrl: 'components/common/social/profile-links/tpl.htm',
		replace: true,
		restrict: 'E',
		scope: { profile: '=' },
		controller: ['$scope', 'socialMediaService', function ($scope, socialMediaService) {

			var init = function () {
				socialMediaService.listServices().then(function(services) {
					var _services = {};

					services.forEach(function(s){
						_services[s.ID] = s;
					});

					if (services.length) {
						$scope.services = _services;
					}
				});
			};

			if ($scope.profile){
				init();
			}
			else {
				var watcher = $scope.$watch('profile', function(val) {
					if (val && val.ID > 0) {
						watcher();
						init();
					}
				});
			}



		}]
	}
}]);

