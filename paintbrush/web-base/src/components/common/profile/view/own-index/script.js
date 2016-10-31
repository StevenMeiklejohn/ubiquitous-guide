

angular.module('ARN')

.directive('profileViewOwnIndex', [function () {
	var _dir = 'components/common/profile/view/own-index/';
	return {
		templateUrl: _dir + 'tpl.htm',
		//css: { href: _dir + 'styles.css', preload: true },
		replace: true,
		restrict: 'E',
		scope: { profile: '=' },
		controller: ['$scope', function ($scope) {

			var profile = $scope.profile;
			var init = function () {
				var incomplete = [];

				if (!profile.Name || !profile.ImageURI) {
					incomplete.push('<a href="/profile/edit">General</a>');
				}
				var contact = profile.Contact;
				if (profile.Gallery && (!contact || !contact.Address1 || !contact.Address2 || !contact.Town || !contact.Postcode)) {
					incomplete.push('<a href="/profile/edit/contact">Contact Information</a>');
				}
				var artist = profile.Artist;
				if (artist && (!artist.Types.length || !artist.WorkingSpaces.length)) {
					incomplete.push('<a href="/profile/edit/artist">Artist Information</a>');
				}

				if (incomplete.length) {
					$scope.message = {
						type: 'warn',
						message:
							'<div>Your profile is currently incomplete, please fill out the following sections: ' +
							'<strong>' + incomplete.join(', ') + '</strong></div>'
					};
				}
			};

			if (profile.ID > 0) {
				init();
			}
			else {
				var watcher = $scope.$watch('profile', function (val) {
					if (val.ID > 0) {
						watcher();
						profile = val;
						init();
					}
				})
			}

		}]
	}
}]);

