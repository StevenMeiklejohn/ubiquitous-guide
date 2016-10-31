

angular.module('ARN')

.directive('artworkManageEditImage', ['$location', '$q', 'artworkService', 'proxyService', 'watchService',  function ($location, $q, artworkService, proxy, watchService) {
	return {
		templateUrl: 'components/common/artwork/manage/edit/image/tpl.htm',
		replace: true,
		restrict: 'E',
		scope: { artwork: '=' },
		controller: function ($scope, $element) {

			var artwork = $scope.artwork;

			var form;

			var init = function () {
				$scope.previewImageURI = proxy.image(artwork.ImageURI, 500);

				$scope.imageInstructions = {
					message:
						'To ensure the best possible results these are our image guidelines:<br/>' +
						'<ul>' +
						'<li>Make sure that your artwork has been photographed from a \'straight on\' perspective and is not taken at an angle.</li>' +
						'<li>The image should be cropped to remove any visible frame around the artwork.</li>' +
						'<li>Avoid using photographs where the artwork is behind a reflective surface like glass.</li>' +
						'<li>The preferred file format is JPEG (.jpg)</li>' +
						'<li>The image file should be no larger than 6MB</li>' +
						'</ul>'
				};

				$scope.ready = true;

				setTimeout(function () {
					form = new Form($element.find('form'), {
						errors: { inline: true }
					});
				}, 10);
			};


			$scope.artworkUploadConfig = {
				folder: 'images',
				accept: 'image/jpeg,image/png',
				success: function (uri, filename) {
					$element.find('[name=ImageURI]').val(uri);

					var previewImageURI = proxy.image(uri, 500);

					var img = document.createElement('img');
					img.onload = function () {
						$scope.previewImageColours = new ColorThief().getPalette(img, 6);
						$scope.previewImageURI = previewImageURI;
						root.find('[name=ImageColours]').val(JSON.stringify($scope.previewImageColours));
						$scope.$root.forceDigest();
					};
					var retryCount = 0;
					img.onerror = function () {
						if (retryCount < 4) {
							retryCount += 1;

							setTimeout(function () {
								img.src = previewImageURI;
							}, 250)
						}
					};
					img.src = previewImageURI;
				}
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

					artworkService.update.general(artwork.ID, data)
						.then($scope.cancel)
						.catch(function (err) {
							$scope.pendingRequest = false;
							$scope.error = { type: err.status === 403 ? 'warn' : 'error', message: err.data.Message };
						});

				}
			};


			watchService($scope).watch('artwork', 'ID').then(function(data) {
				artwork = $scope.artwork = data;
				init();
			})

		}
	}
}]);

