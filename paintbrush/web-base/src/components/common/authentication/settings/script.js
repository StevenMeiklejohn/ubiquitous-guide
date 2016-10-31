

angular.module('ARN')

.directive('authenticationSettings', [function () {
	return {
		templateUrl: 'components/common/authentication/settings/tpl.htm',
		controllerAs: 'ctrl',
		bindToController: true,
		controller: ['$scope', '$http', '$stateParams', 'profileService', function ($scope, $http, $stateParams, profileService) {

			$http.get('/api/auth/current-user').success(function(user) {
				$scope.Auth = user.Auth;

				for (var i in $scope.Auth) {
					var uri = $scope.Auth[i].ProfileImageURI;
					if (uri) {
						uri = '/api/proxy/image/' + encodeURIComponent(uri) + '/280';
						$scope.Auth[i].ProfileImageStyle = { backgroundImage: 'url(' + uri + ')' };
					}
				}

			});

			$scope.go = function(path) {
				window.location.href = path;
			};

			if ($stateParams.linked) {
				profileService.cache.remove();
			}

		}]
	}
}]);

