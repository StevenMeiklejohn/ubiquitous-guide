

angular.module('ARN')

.directive('artworkManageEditGeneral', ['$location', '$q', 'artworkService', 'proxyService', 'watchService',  function ($location, $q, artworkService, proxy, watchService) {
	return {
		templateUrl: 'components/common/artwork/manage/edit/general/tpl.htm',
		replace: true,
		restrict: 'E',
		scope: { artwork: '=' },
		controller: function ($scope, $element) {

			var artwork = $scope.artwork;

			var form;

			var init = function () {
				$scope.previewImageURI = proxy.image(artwork.ImageURI, 500);

				$scope.artworkStyles = artwork.Styles.map(function (s) {
					return s.ID;
				});

				$scope.ready = true;

				setTimeout(function () {
					form = new Form($element.find('form'), {
						field: {
							ArtworkTypeID: { type: 'number' },
							Styles: { type: 'number', isArray: true },
							Tags: { isArray: true },
							Price: { type: 'number', min: 0 }
						},
						errors: { inline: true }
					});
				}, 10);
			};


			$scope.instructions = {
				message:
						'All the information below should be specific to the original artwork, even if it has already been sold and your are only selling prints.'
			};

			//
			//$scope.artworkUploadConfig = {
			//	folder: 'images',
			//	accept: 'image/jpeg,image/png',
			//	success: function (uri) {
			//		$element.find('[name=ImageURI]').val(uri);
			//
			//		var previewImageURI = proxy.image(uri, 500);
			//
			//		var img = document.createElement('img');
			//		img.onload = function () {
			//			$scope.previewImageColours = new ColorThief().getPalette(img, 6);
			//			$scope.previewImageURI = previewImageURI;
			//			root.find('[name=ImageColours]').val(JSON.stringify($scope.previewImageColours));
			//			$scope.$root.forceDigest();
			//		};
			//		var retryCount = 0;
			//		img.onerror = function () {
			//			if (retryCount < 4) {
			//				retryCount += 1;
			//
			//				setTimeout(function () {
			//					img.src = previewImageURI;
			//				}, 250)
			//			}
			//		};
			//		img.src = previewImageURI;
			//	}
			//};
			//
			//

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


			$q.all([
				watchService($scope).watch('artwork', 'ID').then(function(data) {
					artwork = $scope.artwork = data;
				}),
				artworkService.types().then(function (data) {
					$scope.artworkTypes = data;
				}),
				artworkService.styles().then(function (data) {
					$scope.styles = data;
				})
			])
			.then(init);

		}
	}
}]);

