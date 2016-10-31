

angular.module('ARN')

.directive('demoArtworkSelect', [function () {
	return {
		templateUrl: 'components/common/activcanvas/demo/artwork-select/tpl.htm',
		controllerAs: 'ctrl',
		bindToController: true,
		controller: ['$scope', '$http', '$element', '$timeout', '$compile', function ($scope, $http, $el, $timeout, $compile) {

			

			var filters = {};
			filters[($scope.userProfile.Artist ? 'Artist' : 'Owner') + 'ProfileID'] = $scope.userProfile.ID;

			

			$scope.artworkGridConfig = {
				//artworkStats: true,
				colours: true,
				//trackingRating: ($scope.userProfile.IsAdmin || $scope.profile.IsOwn) && $scope.profile.ActivCanvas.StatusID === 3,
				//controls: controls,
				fetchPage: function (req, complete) {
					req.Filters = filters;

					$http.post('/api/artwork/search', req)
					.success(function (data) {
						complete(data)
					})
					.error(function (err) {
						//console.error(err);
					});

				},
				event: {
					click: function (e, artwork) {

						console.log(artwork);

						$scope.setArtwork(artwork);

						//$scope.artworkDetails(artwork.ID);
					}
				}
			};


		}]
	}
}]);

