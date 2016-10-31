

angular.module('ARN')

.directive('artworkManageViewActivCanvas', ['cacheProvider', 'proxyService', 'watchService', 'websocket', 'videoService', function (cacheProvider, proxy, watchService, websocket, videoService) {
	var _dir = 'components/common/artwork/manage/view/activcanvas/';
	return {
		templateUrl: _dir + 'tpl.htm',
		replace: true,
		restrict: 'E',
		scope: { artwork: '=' },
		controller: ['$scope', function ($scope) {

			watchService($scope).watch('artwork', 'ID').then(function (artwork) {

				if (artwork.CustomShareURL) {
					$scope.customShareURL = artwork.CustomShareURL.replace(/(http|https):\/\//g, '');
				}

				$scope.activatedClass = artwork.Activated ? 'check good' : 'times bad';
				$scope.shareableClass = artwork.Shareable ? 'check good' : 'times bad';

				$scope.shareableTitle = 'This artwork can' + (artwork.Shareable ? '' : 'not') + ' be shared on social media by ActivCanvas users';
				$scope.activatedTitle = 'This artwork is currently ' + (artwork.Activated ? '' : 'un') + 'activated';
				$scope.processingTitle =
						'This image is currently being processed.\n\n' +
						'This may take some time if this is the first time the image has been activated.\n\n' +
						'In order to get the best possible tracking rating the image will be processed several times using different image filters to enhance the contrast of the image.\n\n' +
						'Images that are easy to track will take much less time, images that are difficult to track may need to be processed 3 or 4 times to get a star rating.';


				videoService.list(artwork.ArtistProfileID).then(function (data) {
					data.some(function (video) {
						if (video.ID === artwork.VideoID && video.Transcodes) {
							var typeID = -1;
							video.Transcodes.forEach(function (tc) {
								if (tc.TypeID > typeID) {	// higher typeID = higher quality encoding
									typeID = tc.TypeID;
									if (tc.Thumbnails && tc.Thumbnails[0]) {
										$scope.thumbURI = proxy.image(tc.Thumbnails[0].ImageURI, 500);
									}
								}
							});
							return true;
						}
					})
				});


				var activationListener = function(resp) {
					console.info(artwork);
					console.info(resp);

					if (resp.ArtworkID === artwork.ID) {
						artwork.TrackingRating = resp.TrackingRating;
						artwork.SyncRequired = resp.SyncRequired;
						artwork.Activated = resp.Activated;
						artwork.activatedClass = artwork.Activated ? 'check good' : 'times bad';
						cacheProvider('artwork').remove(artwork.ID);
						$scope.$root.forceDigest();
					}
				};
				websocket.on('artwork/activation', activationListener);
				$scope.$on("$destroy", function () {
					websocket.off('artwork/activation', activationListener);
				});

			});

		}]
	}
}]);

