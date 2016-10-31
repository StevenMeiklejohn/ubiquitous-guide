(function () {
	'use strict';

	angular
		.module('ARN')
		.controller('ActivCanvasDemo', ['$scope', '$stateParams', '$http', function ($scope, $stateParams, $http) {
	
			// current demo step
			$scope.step = 0;

			// sets the artwork to be activated with a demo
			$scope.setArtwork = function (artwork) {
				$scope.artwork = artwork;
				$scope.step = 3;
			}

			$scope.selectArtwork = function () {
				$scope.artwork = undefined;
				$scope.step = 2;
			}

			$scope.uploadArtwork = function () {
				$scope.artwork = undefined;
				$scope.step = 1;
			}

			$scope.$watch('userProfile', function (newValue) {
				if (newValue !== undefined) {

					// check if current user is an artist
					if (!$scope.userProfile.Artist) {
						$scope.step = -1;
					}
					else if ($scope.userProfile.ActivCanvas.StatusID === 30) {
						$scope.step = -2;
					}
					else {

						// check if current user has any artwork
						$http.post('/api/artwork/search', { Filters: { ArtistProfileID: $scope.userProfile.ID } })
						.success(function (resp) {
							$scope.totalArtworks = resp.Pagination.TotalResults;

							// user has no artwork yet - ask user to upload 1 piece of art
							if (!$scope.totalArtworks) {
								$scope.step = 1;
							}
							// go to artwork select screen
							else {
								$scope.step = 2;
							}

						})
						.error(function () {

						})


					}
				}
			});

			

		}]);

})()
