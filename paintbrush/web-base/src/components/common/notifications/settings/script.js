

angular.module('ARN')

.directive('notificationSettings', [function () {
	return {
		templateUrl: 'components/common/notifications/settings/tpl.htm',
		controllerAs: 'ctrl',
		bindToController: true,
		controller: ['$scope', '$http', 'notification', 'userPreferencesService', '$location', function ($scope, $http, notification, preferences, $location) {

			preferences.get('notification').then(function(data) {
				$scope.settings = data;
			});

			//console.log($scope);
			//
			//$scope.$watch('settings', function(val, oldVal) {
			//	if (oldVal !== undefined) {
			//		console.info(val)
			//
			//		preferences.set('notification', null, val)
			//	}
			//}, true);
			//

			notification.list.priorities().then(function (data) { $scope.notificationPriorities = data; });
			notification.list.types().then(function (data) {
				$scope.notificationTypes = data.filter(function (t) {
					return t.ID !== 1 && t.ID !== 4;
				})
			});

			$scope.updateEmail = function (e) {
				$scope.settings.email.address = e.target.value;
			};

			$scope.save = function () {
				preferences.set('notification', null, $scope.settings);
				$location.url('/account');
			};

			$scope.cancel = function () {
				$location.url('/account');
			};

		}]
	}
}]);

