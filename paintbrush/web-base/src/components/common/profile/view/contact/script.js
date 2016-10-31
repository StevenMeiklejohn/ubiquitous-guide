

angular.module('ARN')

.directive('profileViewContactInfo', [function () {
	return {
		templateUrl: 'components/common/profile/view/contact/tpl.htm',
		replace: true,
		restrict: 'E',
		scope: { profile: '=' },
		controller: ['$scope', function ($scope) {

			var profile = $scope.profile;

			if (profile.Contact && profile.Contact.Website) {
				$scope.websiteURI = profile.Contact.Website + '';
				$scope.website = profile.Contact.Website.split('://')[1];
			}
		}]
	}
}]);

