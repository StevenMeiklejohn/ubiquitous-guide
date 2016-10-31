

angular.module('ARN')

.directive('profileEditActivCanvas', ['profileService', 'watchService', 'videoService', 'proxyService', '$location',
							function (profileService, watchService, videoService, proxy, $location) {
	return {
		templateUrl: 'components/common/profile/edit/activcanvas/tpl.htm',
		replace: true,
		restrict: 'E',
		scope: { profile: '=' },
		controller: function ($scope, $element) {
			var profile = $scope.profile;

			var form,
				init = function () {
					$scope.ready = true;
					setTimeout(function () {
						form = new Form($element.find('form'), {
							errors: { inline: true },
							field: {
								VideoID: { type: 'number' },
								AutoPlay: { type: 'bool' }
							}
						});

						// create video preview thumbnail
						$element.find('#VideoID').change(function () {
							var videoID = $(this).val();

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
				$location.url('/profile');
			};

			$scope.save = function () {
				if (!form.isValid()) {
					form.displayValidationErrors();
				}
				else {
					var data = form.getData();
					data.VideoID = data.VideoID || null;

					$scope.pendingRequest = true;
					profileService.update.activCanvas(profile.ID, data)
						.then(function() {
							$scope.$root.setActiveProfileByID(profile.ID, $scope.cancel);
						})
						.catch(function (err) {
							$scope.pendingRequest = false;
							$scope.error = { type: err.status === 403 ? 'warn' : 'error', message: err.data.Message };
						});
				}
			};

			watchService($scope).watch('profile', 'ID').then(function (data) {
				profile = data;

				videoService.list(profile.ID).then(function(videos) {
					$scope.videos = videos;
					init();
				})
			})
		}
	}
}]);

