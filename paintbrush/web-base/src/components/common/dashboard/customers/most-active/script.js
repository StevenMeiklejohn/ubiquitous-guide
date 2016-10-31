

angular.module('ARN')

.directive('dashboardCustomersMostActive', ['$location', 'dashboardService', 'proxyService', function ($location, dashboardService, proxy) {
	return {
		templateUrl: 'components/common/dashboard/customers/most-active/tpl.htm',
		restrict: 'E',
		replace: true,
		scope: {
			config: '='
		},
		controller: function ($scope, $element) {

			var profileID;

			$scope.$watch('$root.activeProfile', function(val) {
				if (val && val.ID > 0) {
					profileID = $scope.$root.activeProfile.ID;
					init();
				}
			});

			$scope.viewProfile = function (id) {
				$location.url('/analytics/users/activity/' + id);
			};

			var init = function() {

				dashboardService.customers.mostActive(profileID)
					.then(function(data) {
						if (!data.length) {
							$scope.error = { message: 'No recent activity' };
						}
						else {
							data.forEach(function(profile) {
								profile.ImageURI = proxy.image(profile.ImageURI, 180);
								profile.LatestEventStr = DateUtils.format.friendly(profile.LatestEvent);
							});
							$scope.profiles = data;
						}
					})
					.catch(function(err) {
						$scope.error = { type: err.status === 403 ? 'warn' : 'error', message: err.data.Message };;
					});


			}

			
		}
	}
}]);

