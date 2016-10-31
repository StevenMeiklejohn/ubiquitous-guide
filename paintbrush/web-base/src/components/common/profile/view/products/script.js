

angular.module('ARN')

.directive('profileViewProducts', [function () {
	return {
		templateUrl: 'components/common/profile/view/products/tpl.htm',
		replace: true,
		restrict: 'E',
		scope: { profile: '=' },
		controller: ['$scope', function ($scope) {

		}]
	}
}]);

