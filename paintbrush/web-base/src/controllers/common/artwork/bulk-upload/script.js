(function () {
	'use strict';

	function ArtworkBulkEditController($scope, $stateParams, $location, profileService) {

		var id = ($stateParams.id || localStorage.activeProfileID || 0) * 1;
		$scope.profile = null;
		$scope.artworkBulkUpload = {
			profileID: id
		};

		profileService.get(id)
			.then(function (data) {
				//$scope.docTitle(data.Name + ' | Artwork | Bulk Upload');
				$scope.profile = data;
				$scope.artworkBulkUpload.video = data.ActivCanvas.StatusID === 3;

				if (!(data.ID === $scope.userProfile.ID || $scope.userProfile.IsAdmin || $scope.userProfile.managesArtist(data.ID))) {
					$scope.error = 'You do not have permission to update this profile';
				}
				//else if (!data.Artist) {
				//	$scope.error = 'This profile is not an artist';
				//}
			})
			.catch(function(err) {
				if (err.Message) {
					$scope.error = err.Message;
				}
			});


		$scope.detailsVisible = false;
		$scope.toggleDetails = function() {
			$scope.detailsVisible = !$scope.detailsVisible;
		};


		$scope.save = function () {
			$scope.pendingRequest = true;

			$scope.artworkBulkUpload.save(
				function() {
					$location.url('/artwork/manage');
					//$location.url('/profile/' + id);
				},
				function() {
					$scope.pendingRequest = false;
				}
			);
		};

		$scope.cancel = function() {
			$location.url('/artwork/manage');
			//$location.url('/profile/' + id);
		}

	}


	angular
		.module('ARN')
		.controller('ArtworkBulkUpload', [ '$scope', '$stateParams', '$location', 'profileService', ArtworkBulkEditController ]);

})();
