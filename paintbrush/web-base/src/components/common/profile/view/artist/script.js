

angular.module('ARN')

.directive('profileViewArtistInfo', [function () {
	return {
		templateUrl: 'components/common/profile/view/artist/tpl.htm',
		replace: true,
		restrict: 'E',
		scope: { profile: '=' },
		controller: ['$scope', function ($scope) {

		}]
	}
}]);

