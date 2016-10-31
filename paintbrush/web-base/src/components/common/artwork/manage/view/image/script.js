

angular.module('ARN')

.directive('artworkManageViewImage', ['proxyService', 'watchService', function (proxy, watchService) {
	var _dir = 'components/common/artwork/manage/view/image/';
	return {
		templateUrl: _dir + 'tpl.htm',
		replace: true,
		restrict: 'E',
		scope: { artwork: '=' },
		controller: ['$scope', function ($scope) {

			watchService($scope).watch('artwork', 'ID')
				.then(function (artwork) {
					$scope.artworkImageURI = proxy.image(artwork.ImageURI,500);


					var loadImage = function (src, complete, error) {
						var img = document.createElement('img');
						img.onload = function() {
							complete(img);
						};
						img.onerror = error;
						img.src = src;
					};


					$scope.viewImage = function () {
						var d = new Dialog({
							'class': 'lightbox',
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


				});

		}]
	}
}]);

