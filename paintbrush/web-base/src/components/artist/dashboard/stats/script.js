

angular.module('ARN')

.directive('artistDashboardStats', [function () {
	return {
		templateUrl: 'components/artist/dashboard/stats/tpl.htm',
		restrict: 'E',
		replace: true,
		scope: {
			config: '='
		},
		controller: ['$scope', '$http', 'dashboardService', function ($scope, $http, dashboardService) {

			var profileID;

			var count = $scope.count = {
				likes: 0,
				scans: 0,
				shortlisted: 0,
				total: 0,
				views: 0
			};

			var error = $scope.error = {};

			$scope.$watch('$root.activeProfile', function(val) {
				if (val && val.ID > 0) {
					profileID = $scope.$root.activeProfile.ID;

					dashboardService.artwork.count.likes(profileID)
						.then(function(data) {
							count.likes = data.Count;
						})
						.catch(function (err) {
							error.likes = { type: err.status === 403 ? 'warn' : 'error', message: err.data.Message };
						});

					dashboardService.artwork.count.scans(profileID)
						.then(function(data) {
							count.scans = data.Count;
						})
						.catch(function (err) {
							error.scans = { type: err.status === 403 ? 'warn' : 'error', message: err.data.Message };
						});

					dashboardService.artwork.count.shortlisted(profileID)
						.then(function(data) {
							count.shortlisted = data.Count;
						})
						.catch(function (err) {
							error.shortlisted = { type: err.status === 403 ? 'warn' : 'error', message: err.data.Message };
						});

					dashboardService.artwork.count.total(profileID)
						.then(function(data) {
							count.total = data.Count;
						})
						.catch(function (err) {
							error.total = { type: err.status === 403 ? 'warn' : 'error', message: err.data.Message };
						});

					dashboardService.artwork.count.views(profileID)
						.then(function(data) {
							count.views += data.Count;
						})
						.catch(function (err) {
							error.views = { type: err.status === 403 ? 'warn' : 'error', message: err.data.Message };
						});

					dashboardService.profile.count.views(profileID)
						.then(function(data) {
							count.views += data.Count;
						})
						.catch(function (err) {
							error.views = { type: err.status === 403 ? 'warn' : 'error', message: err.data.Message };
						});

				}
			});

		}]
	}
}]);

