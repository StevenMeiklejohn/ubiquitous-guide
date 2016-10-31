(function () {
	'use strict';

	angular.module('ARN')
		.controller('ArtworkManageEditProduct', ['$scope', '$stateParams', 'artworkService', 'watchService',
			function ($scope, $stateParams, artworkService, watchService) {

				//var isNew = $scope.isNew = $stateParams.productID === 'add',
				//	watch = .watch;

				var init = function () {

					artworkService.get($stateParams.artworkID)
						.then(function(artwork) {
							$scope.artwork = artwork;
							$scope.$root.docTitle('Products | ' + artwork.Name + ' | ' +  'Artwork | ' + artwork.ArtistName);
						})
						.catch(function (err) {
							$scope.error = { type: err.status === 403 ? 'warn' : 'error', message: err.data.Message };
						});

				};

				$scope.config = { returnURL: '/artwork/manage/' + $stateParams.artworkID };

				watchService($scope).watch('$root.activeProfile', 'ID').then(init);

			}]);
})();
