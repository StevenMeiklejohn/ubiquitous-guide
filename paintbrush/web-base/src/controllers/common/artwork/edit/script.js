(function () {
	'use strict';

	function ArtworkEditController($scope, $stateParams, $location) {

		$scope.artworkID = $stateParams.artworkID;

		$scope.artworkEditConfig = {
			onerror: function(err) {
				$scope.error = err.Message || 'Unexpected error';
			}
		};

		$scope.cancel = function() {
			//$location.url('/profile' + (!$scope.profile.IsOwn ? '/' + $scope.profile.ID : ''))
			$location.url('/artwork');
		};

		$scope.saveArtwork = function () {

			$scope.pendingRequest = true;

			$scope.artworkEdit.save(
					$scope.cancel,
					function (res) {
						new Dialog.Info({
							title: '<h3 class="uppercase">Error</h3>',
							fixed: true,
							html:
								'<div class="message error">' +
									(res.data.Message ? res.data.Message : 'An unexpected error occurred while saving') +
								'</div>'
						});
					},
					function () {
						$scope.pendingRequest = false;
					}
			)

		};

		$scope.deleteArtwork = function () {

			$scope.pendingRequest = true;

			$scope.artworkEdit.delete(
					$scope.cancel,
					function (res) {
						new Dialog.Info({
							title: '<h3 class="uppercase">Error</h3>',
							fixed: true,
							html:
								'<div class="message error">' +
									(res.Message ? res.Message : 'An unexpected error occurred while deleting') +
								'</div>'
						});
					},
					function () {
						$scope.pendingRequest = false;
						$scope.forceDigest();
					}
			)

		};


	}


	angular
		.module('ARN')
		.controller('ArtworkEdit', [ '$scope', '$stateParams', '$location', ArtworkEditController ]);

})();
