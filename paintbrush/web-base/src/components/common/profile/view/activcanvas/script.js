

angular.module('ARN')

.directive('profileViewActivCanvas', ['videoService', 'proxyService', function (videoService, proxy) {
	return {
		templateUrl: 'components/common/profile/view/activcanvas/tpl.htm',
		replace: true,
		restrict: 'E',
		scope: { profile: '=' },
		controller: ['$scope', function ($scope) {

			if ($scope.profile.ActivCanvas.Link) {
				$scope.profile.ActivCanvas._Link = $scope.profile.ActivCanvas.Link.replace(/(http|https):\/\//g, '');
			}

			videoService.list($scope.profile.ID).then(function (data) {
				data.some(function (video) {
					if (video.ID === $scope.profile.ActivCanvas.VideoID) {
						$scope.profile.ActivCanvas.VideoName = video.Name;

						if (video.Transcodes) {
							var typeID = -1;
							video.Transcodes.some(function (tc) {
								if (tc.TypeID > typeID) {	// higher typeID = higher quality encoding
									typeID = tc.TypeID;
									if (tc.Thumbnails && tc.Thumbnails[0]) {
										$scope.thumbURI = proxy.image(tc.Thumbnails[0].ImageURI, 500);
									}
								}
							});
							return true;
						}

					}
				})
			})

		}]
	}
}]);

