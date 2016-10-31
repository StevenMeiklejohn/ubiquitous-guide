

angular.module('ARN')

.directive('artworkManageEditActivCanvas', ['$location', '$q', 'artworkService', 'proxyService', 'watchService', 'videoService', 'profileService',
									function ($location, $q, artworkService, proxy, watchService, videoService, profileService) {
	return {
		templateUrl: 'components/common/artwork/manage/edit/activcanvas/tpl.htm',
		replace: true,
		restrict: 'E',
		scope: { artwork: '=' },
		controller: function ($scope, $element) {

			var artwork = $scope.artwork,
				profile,
				form;

			var init = function () {

				if (profile.ActivCanvas.StatusID === 3) {
					$scope.defaultVideoName = 'Default: ' + (profile.ActivCanvas.VideoID ? profile.ActivCanvas.VideoName : 'No Video');
				}

				$scope.customSharePlaceholder = $location.$$absUrl.replace($location.$$url, '') + '/api/v2/artwork/' + artwork.ID + '/view';
				$scope.messageMetaTags = {type:'warn',message:'<strong>Note:</strong> In order for sharing to work correctly the linked web page must contain <a href="https://developers.facebook.com/docs/sharing/webmasters#markup">Facebook</a> and <a href="https://dev.twitter.com/cards/types/summary-large-image">Twitter</a> meta tags describing the artwork.'}
				$scope.ready = true;

				setTimeout(function () {
					form = new Form($element.find('form'), {
						errors: { inline: true }
					});


					// create video preview thumbnail
					$element.find('#VideoID').change(function () {
						var el = $(this);

						var videoID = el.val();

						if (videoID === '0') {
							videoID = profile.ActivCanvas.VideoID;
						}

						if (videoID) {
							$scope.videos.some(function (video) {
								if (video.ID == videoID && video.Transcodes) {
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
							});
						}
						else {
							$scope.thumbURI = undefined;
						}
						$scope.$root.forceDigest();

					}).change();
				}, 10);
			};


			$scope.cancel = function () {
				$location.url('/artwork/manage/' + artwork.ID);
			};

			$scope.save = function () {
				if (!form.isValid()) {
					form.displayValidationErrors();
				}
				else {
					var data = form.getData();
					$scope.pendingRequest = true;

					data.VideoID = data.VideoID === '' ? undefined : data.VideoID * 1;

					artworkService.update.activCanvas(artwork.ID, data)
						.then($scope.cancel)
						.catch(function (err) {
							$scope.pendingRequest = false;
							$scope.error = { type: err.status === 403 ? 'warn' : 'error', message: err.data.Message };
						});
				}
			};


			watchService($scope).watch('artwork', 'ID').then(function(data) {
				artwork = $scope.artwork = data;

				$q.all([
					profileService.get(artwork.ArtistProfileID).then(function (artistProfile) {
						profile = $scope.profile = artistProfile;
					}),
					videoService.list(artwork.ArtistProfileID).then(function (videos) {
						$scope.videos = videos;
					})
				])
				.then(init);

			});

		}
	}
}]);

