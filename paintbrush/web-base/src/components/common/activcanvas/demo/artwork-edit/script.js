

angular.module('ARN')

.directive('demoArtworkEdit', [function () {
	return {
		templateUrl: 'components/common/activcanvas/demo/artwork-edit/tpl.htm',
		controllerAs: 'ctrl',
		bindToController: true,
		controller: ['$scope', 'profileService', function ($scope, profileService) {

			var id = localStorage.profileID * 1;

			profileService.get(id).then(function(data) { $scope.profile = data; });

			$scope.next = function () {

				$scope.pendingRequest = true;

				$scope.artworkEdit.save(
					function (artwork) {
						$scope.setArtwork(artwork);
					},
					function (res) {
						new Dialog.Info({
							title: '<h3 class="uppercase">Error</h3>',
							fixed: true,
							html: 'An error occurred while saving' +
								(!res.Message ? '' : ':' + '<pre>' + res.Message + '</pre>'),
						});
					},
					function () {
						$scope.pendingRequest = false;
					}
				)

			}


		}]
	}
}]);

