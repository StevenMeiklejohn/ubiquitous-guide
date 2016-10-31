'use strict';

angular.module('ARN')

.controller('ArtworkManageIndex', ['$scope', '$stateParams', '$location', '$sce', '$compile', '$q', 'artworkService', 'watchService', 'proxyService', 'permissionService',
	function ($scope, $stateParams, $location, $sce, $compile, $q, artworkService, watchService, proxy, permissions) {

		var artworkID = $stateParams.artworkID,
			artwork;

		$scope.permission = {};

		$scope.delete = function () {
			var scope = $scope.$new(true);
			scope.message = { type: 'question', message: 'Are you sure you wish to delete <strong>' + $scope.artwork.Name + '?</strong>' };

			new Dialog({
				title: ' ',
				template: $compile('<ui-message class="static" config="message"/>')(scope),
				buttons: [{
					text: 'Cancel',
					icon: { left: 'fa fa-reply' }
				}, {
					text: 'Delete',
					class: 'orange',
					icon: { left: 'fa fa-trash' },
					onclick: function () {
						artworkService.remove($scope.artwork.ID).then(function(){
							// TODO: check if last state was manage grid - restore previous state instead
							$location.url('artwork/manage');
						});
					}
				}]
			});
		};

		var init = function () {
			$scope.$root.docTitle(artwork.Name + ' | ' +  'Artwork | ' + artwork.ArtistName);

			if (!$scope.permission.edit) {
				$scope.error = { type: 'warn', message: 'You do not have permission to edit this artwork' };
			}
			else {
				artwork.ImageURI_500 = proxy.image(artwork.ImageURI, 500);
				if (artwork.VideoURI && artwork.VideoID !== 8) {
					artwork._VideoURI = $sce.trustAsResourceUrl(artwork.VideoURI);
				}
				artwork.VideoTranscodes.forEach(function(tc){
					tc._VideoURI = $sce.trustAsResourceUrl(tc.VideoURI);
				});
				$scope.artwork = artwork;
			}
		};


		$q.all([
			artworkService.get(artworkID).then(function(data) {
				artwork = data;
			}),

			permissions.artwork.check(artworkID, 'update').then(function (resp) {
				$scope.permission.edit = resp.allowed;
			}),

			permissions.artwork.check(artworkID, 'remove').then(function (resp) {
				$scope.permission.delete = resp.allowed;
			})

		])
		.then(init)
		.catch(function (err) {
			$scope.error = { type: err.status === 403 ? 'warn' : 'error', message: err.data.Message };
		});


}]);





