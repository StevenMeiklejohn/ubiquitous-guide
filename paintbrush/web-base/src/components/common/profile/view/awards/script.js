

angular.module('ARN')

.directive('profileViewAwards', [function () {
	return {
		templateUrl: 'components/common/profile/view/awards/tpl.htm',
		replace: true,
		restrict: 'E',
		scope: { profile: '=' },
		controller: ['$scope', function ($scope) {

		}]
	}
}]);

