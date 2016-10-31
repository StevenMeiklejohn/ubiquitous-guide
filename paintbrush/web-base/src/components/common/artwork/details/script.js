

angular.module('ARN')

.directive('artworkDetails', ['proxyService', function (proxy) {
	var _dir = 'components/common/artwork/details/';
	return {
		templateUrl: _dir + 'tpl.htm',
		//css: { href: _dir + 'styles.css', preload: true },
		restrict: 'E',
		replace: true,
		scope: {
			artwork: '='
		},
		controller: function ($scope, $element) {

			var artwork = $scope.artwork;

			var loadImage = function (src, complete, error) {
				var img = document.createElement('img');
				img.onload = function() {
					complete(img);
				};
				img.onerror = error;
				img.src = src;
			};

			var init = function () {
				loadImage(artwork.ImageURI_500, function () {
					$scope.imageLoaded = true;
					$scope.$root.forceDigest();
				})
			};

			$scope.playVideo = false;

			$scope.showVideo = function (val) {
				$scope.playVideo = val;

				$scope.$root.forceDigest(function () {
					$element.find('.video-overlay').toggleClass('visible', val);
				})
			};


			$scope.viewImage = function () {
				var d = new Dialog({
					class: 'lightbox',
					html: '<div class="ajax-loader"></div>'
				});

				var src= proxy.image($scope.artwork.ImageURI, Math.ceil(window.innerWidth * 0.9), Math.ceil(window.innerHeight * 0.9));
				loadImage(src, function (img) {
					img.style.maxWidth = '90vw';
					img.style.maxHeight = '90vh';

					d.root.html('').append('<a class="close"><i class="fa fa-times"></i></a>').append(img);
					d.root.find('.close, img').click(d.tidy);
					d.center();
				}, function() {
					d.root.html('').append('<a class="close"><i class="fa fa-times"></i></a><div class="message error">Image failed to load</div>');
					d.root.find('.close, img').click(d.tidy);
				});
			};


			$scope.getVideoType = function (uri) {
				var parts = uri.split('.');
				var ext = parts[parts.length - 1 ].toLowerCase();

				switch(ext) {
					case 'mp4': return 'video/mp4';
					case 'm3u8': return 'application/vnd.apple.mpegurl';
					case 'webm': return 'video/webm';
					case 'ogv': return 'video/ogg';
				}
				return '';
			};



			if (artwork) {
				init();
			}
			else {
				var watcher = $scope.$watch('artwork', function (val) {
					if (val && val.ID > 0) {
						watcher();
						artwork = val;
						init();
					}
				})
			}




		}
	}
}]);

