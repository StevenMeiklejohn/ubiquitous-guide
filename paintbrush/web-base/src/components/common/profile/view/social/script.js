

angular.module('ARN')

.directive('profileViewSocialMedia', ['socialMediaService', '$location', function (socialMediaService, $location) {
	return {
		templateUrl: 'components/common/profile/view/social/tpl.htm',
		replace: true,
		restrict: 'E',
		scope: { profile: '=' },
		controller: ['$scope', function ($scope) {

			$scope._socialMedia = {};

			socialMediaService.listServices().then(function(data) {
				data.forEach(function (s) {
					s.ImageURI_G = s.ImageURI.replace('.png', '-gs.png');
					$scope.profile.SocialMedia.some(function(sm) {
						if (sm.ServiceID === s.ID) {
							s.ProfileURL = sm.URL;
							s.ProfileName = new URL(sm.URL).pathname.replace('/', '');
							return true;
						}
					});
				});

				$scope.socialMediaServices = data;
			});


			$scope.go = function (url, e) {
				if (url && e.target.tagName !== 'A') {
					var a = document.createElement('a');
					a.target = '_blank';
					a.href = url;
					a.style = 'display:none;';
					document.body.appendChild(a);
					a.click();
					a.remove();
				}
			}

		}]
	}
}]);

