'use strict';

angular.module('ARN')

.controller('ArtworkDetails', ['$scope', '$stateParams', '$location', '$sce', 'artworkService', 'shortlistService', 'proxyService', 'analytics',
	function ($scope, $stateParams, $location, $sce, artworkService, shortlistService, proxy, analytics) {

	$scope.permission = {};

	$scope.edit = function () {
		$location.url('artwork/edit/' + $stateParams.artworkID);
	};

	$scope.delete = function () {
		new Dialog({
			title: '<h3>Delete</h3>',
			html: '<div class="message">Are you sure you wish to delete <strong>' + $scope.artwork.Name + '?</strong></div>',
			buttons: [{
				text: 'Cancel',
				icon: { left: 'fa fa-reply' }
				//onclick: _finally
			}, {
				text: 'Delete',
				class: 'orange',
				icon: { left: 'fa fa-trash' },
				onclick: function () {
					artworkService.remove($scope.artwork.ID).then(function(){
						$location.url('artwork');
					});
				}
			}]
		});
	};

	$scope.shortlistArtwork = function (shortlistID) {

		// add to shortlist
		if ($scope.artwork.Shortlists.indexOf(shortlistID) < 0) {
			shortlistService.item.add(shortlistID, [$stateParams.artworkID]).then(function(){
				$scope.artwork.Shortlists.push(shortlistID);

				$scope.shortlists.some(function (s) {
					if (s.ID === shortlistID) { s.Items += 1; return true; }
				});
				$scope.$root.forceDigest();
			});

		}
		// remove from shortlist
		else {
			shortlistService.item.remove(shortlistID, $stateParams.artworkID).then(function(){
				for (var i in $scope.artwork.Shortlists) {
					if ($scope.artwork.Shortlists[i] === shortlistID) {
						$scope.artwork.Shortlists.splice(i, 1); break;
					}
				}

				$scope.shortlists.some(function (s) {
					if (s.ID === shortlistID) { s.Items -= 1; return true; }
				});
				$scope.$root.forceDigest();
			});
		}

	};

	$scope.toggleLike = function () {
		$scope.artwork.Liked = !$scope.artwork.Liked;

		if ($scope.artwork.Liked) {
			artworkService.like($stateParams.artworkID, $scope.$root.activeProfile.ID);
		}
		else {
			artworkService.unlike($stateParams.artworkID, $scope.$root.activeProfile.ID);
		}
	};


	var loadArtwork = function () {
		artworkService.get($stateParams.artworkID)
			.then(function(artwork) {
				artwork.ImageURI_500 = proxy.image(artwork.ImageURI, 500);
				if (artwork.VideoURI && artwork.VideoID !== 8) {
					artwork._VideoURI = $sce.trustAsResourceUrl(artwork.VideoURI);
				}
				artwork.VideoTranscodes.forEach(function(tc){
					tc._VideoURI = $sce.trustAsResourceUrl(tc.VideoURI);
				});

				$scope.artwork = artwork;
				if ($scope.$root.activeProfile.ID === artwork.ArtistProfileID) {
					$scope.permission.delete = true;
					$scope.permission.update = true;
				}
				else {
					analytics.event.add(7, { ArtworkID: artwork.ID });
					$scope.permission.like = true;
					$scope.permission.shortlist = true;
				}

				var title = artwork.Name + ' | ';
				if ($scope.activeProfile.ID !== artwork.ArtistProfileID) {
					title += artwork.ArtistName + ' | Artist Search';
				}
				else {
					title += 'Artwork | ' + artwork.ArtistName;
				}
				$scope.$root.docTitle(title);
			})
			.catch(function (err) {
				$scope.error = { type: err.status === 403 ? 'warn' : 'error', message: err.data.Message };
			});

		shortlistService.list.active($scope.$root.activeProfile.ID).then(function (data) {
			$scope.shortlists = data;
		});
	};


	if ($scope.$root.activeProfile.ID > 0) {
		loadArtwork();
	}
	else {
		var watcher = $scope.$watch('$root.activeProfile', function (val) {
			if (val && val.ID > 0) {
				watcher();
				loadArtwork();
			}
		})
	}

}]);





