

angular.module('ARN')

.directive('profileArtwork', [function () {
	return {
		templateUrl: 'components/common/profile/view/artwork/tpl.htm',
		restrict: 'E',
		scope: { profile: '=' },
		controller: ['$scope', '$http', '$element', '$timeout', '$compile', '$location', 'websocket', function ($scope, $http, $el, $timeout, $compile, $location, websocket) {

			var profile = $scope.profile;
			var init = function() {
				$scope.$root.forceDigest(function () {
					if ($scope.artworkGrid) {
						$scope.artworkGrid.reset();
					}
					else {
						var watcher = $scope.$watch('artworkGrid', function(artworkGrid) {
							if (artworkGrid) {
								watcher();
								artworkGrid.reset();
							}
						});
					}
				})
			};

			$scope.artworkDetails = function (artworkID) {
				$location.url('/artwork/' + artworkID);
			};

			$scope.artworkGridConfig = {
				artworkStats: false,
				//artistDetails: false,
				colours: true,
				trackingRating: false,
				//controls: {},
				autoLoad: false,
				fetchPage: function (req, complete) {
					req.Filters = { ArtistProfileID: profile.ID };

					$http.post('/api/artwork/search', req)
						.success(complete)
						.error(function (err) {
							//console.error(err);
						});
				},
				event: {
					click: function (e, artwork) {
						$scope.artworkDetails(artwork.ID);
					}
				}
			};



			if (profile && profile.ID > 0) {
				init();
			}
			else {
				var watcher = $scope.$watch('profile', function(val) {
					if (val.ID > 0) {
						watcher();
						profile = val;
						init();
					}
				});
			}
		}]
	}
}]);

