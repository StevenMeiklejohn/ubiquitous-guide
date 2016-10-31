'use strict';

angular.module('ARN')

.controller('Dashboard', ['$scope', function ($scope) {

	$scope.config = {};

	var profile = $scope.$root.activeProfile;
	var init = function () {
		$scope.$root.docTitle('Dashboard | ' + profile.Name, 10);
	};

	if (profile.ID > 0) {
		init();
	}
	else {
		var watcher = $scope.$watch('$root.activeProfile', function (val) {
			if (val.ID > 0) {
				profile = val;
				watcher();
				init();
			}
		})
	}

}]);
