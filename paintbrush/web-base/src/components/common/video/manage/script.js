﻿

angular.module('ARN')

.directive('videoManage', [function () {
	return {
		templateUrl: 'components/common/video/manage/tpl.htm',
		restrict: 'E',
		controller: ['$scope', '$sce', '$element', '$location', 'videoService', 'proxyService', function ($scope, $sce, $element, $location, videoService, proxy) {

			var profileID = $scope.$root.activeProfile.ID;
			var targetColWidth = 268;

			var setColumns = function () {
				$scope.columns = [];

				$element.css('display', 'block');

				$element.children().hide();
				var _gridWidth = $element.width() + 10;
				for (var i = 0; i < Math.floor(_gridWidth / targetColWidth) ; i++) {
					$scope.columns.push(i);
				}

				$element.children().show();
			};
			setColumns();

			var reload = function () {
				setColumns();
				$scope.$root.forceDigest();
			};

			// handle window resizing
			var resizeTimer,
				resizeHandler = function() {
					clearTimeout(resizeTimer);
					resizeTimer = setTimeout(reload, 200);
				};
			$(window).on('resize', resizeHandler);

			var init = function() {
				videoService.list(profileID).then(function (data) {
					data.forEach(function (video) {
						video._VideoURI = $sce.trustAsResourceUrl(video.VideoURI.replace(/(youtu.be|youtube.com)\//gi, 'youtube.com/embed/'));

						video._ProfileImageURI = proxy.image(video.ProfileImageURI, 90);

						// check for a video thumbnail (use one from higher quality video if possible)
						if (video.Transcodes) {
							var typeID = -1;
							video.Transcodes.forEach(function (tc) {
								if (tc.TypeID > typeID) {
									typeID = tc.TypeID;
									if (tc.Thumbnails && tc.Thumbnails[0]) {
										video.Thumbnail = proxy.image(tc.Thumbnails[0].ImageURI, 340);
									}
								}
							})
						}

						var _m = Math.floor(video.Duration / 60), _s = Math.round(video.Duration - (_m * 60));
						video._Duration = _m + 'm ' + _s + 's';

						video.Views = 0;
						video.Likes = 0;
					});

					$scope.videos = data;
					$scope.ready = true;


					if (!data.length && $scope.activeProfile.ActivCanvas.StatusID === 3) {
						$scope.error = { message: 'You have not added any videos yet' };
					}
					else if (!data.length && $scope.activeProfile.ActivCanvas.StatusID !== 3) {
						$scope.error = { message: 'Videos are only available to ActivCanvas Premium accounts' };
					}
				})
				.catch(function (err) {
					$scope.error = { type: err.status === 403 ? 'warn' : 'error', message: err.data.Message };
				});
			};

			$scope.edit = function (id) {
				$location.url('/videos/edit/' + id);
				//$scope.loadDirective('profile-video-edit', id);
			};


			$scope.playVideo = function (v) {
				var d = new Dialog({
					class: 'lightbox',
					html: '<div class="ajax-loader"></div>'
				});

				var video = document.createElement('video');

				video.onloadstart = function() {
					d.center();
					setTimeout(d.center, 1);
				};
				video.onloadeddata = function() {
					d.center();
					setTimeout(d.center, 1);
				};

				video.style.maxWidth = '90vw';
				video.style.maxHeight = '90vh';
				//video.src = v.VideoURI;
				video.controls = true;

				v.Transcodes.forEach(function(tc) {
					var source = document.createElement('source');
					source.src = tc.VideoURI;
					video.appendChild(source);
				});

				var sourceOrig = document.createElement('source');
				sourceOrig.src = v.VideoURI;
				video.appendChild(sourceOrig);

				d.root.find('.content').html('').append('<a class="close"><i class="fa fa-times"></i></a>').append(video);

				d.root.find('.close').click(function() {
					d.tidy();
				})
			};


			if (profileID > 0 ) {
				init();
			}
			else {
				var watcher = $scope.$watch('$root.activeProfile', function (val) {
					if (val.ID > 0){
						watcher();
						profileID = val.ID;
						init();
					}
				})
			}

		}]
	}
}]);

