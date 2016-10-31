

angular.module('ARN')

.directive('demoTest', [function () {
	return {
		templateUrl: 'components/common/activcanvas/demo/test/tpl.htm',
		controllerAs: 'ctrl',
		bindToController: true,
		controller: ['$scope', '$http', '$element', function ($scope, $http, $el) {

			$scope.previewImageURI = '/api/proxy/image/' + encodeURIComponent($scope.artwork.ImageURI) + '/500';

			var checkStatus = function (delay) {
				setTimeout(function () {

					$http.get('/api/demo/status/' + $scope.artwork.ID)
					.success(function (resp) {
						if (resp.TrackingRating === null || resp.TrackingRating < 0) {
							checkStatus(1000);
						}
						else {
							$scope.TrackingRating = resp.TrackingRating;
						}
					});

				}, delay);
			}

			$http.get('/api/demo/activate/' + $scope.artwork.ID)
			.success(function() {
				checkStatus(2000);
			})
			.error(function() {
				
			});


		}]
	}
}]);

