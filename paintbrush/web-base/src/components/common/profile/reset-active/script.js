

angular.module('ARN')

.directive('profileResetActive', [function () {
	return {
		templateUrl: 'components/common/profile/reset-active/tpl.htm',
		replace: true,
		controller: ['$scope', '$location',  function ($scope, $location) {

			$scope.resetActiveProfile = function() {
				$scope.$root.setActiveProfile($scope.$root.userProfile);
				$location.url('/profile/' + $scope.$root.userProfile.ID);
			}

		}]
	}
}]);

