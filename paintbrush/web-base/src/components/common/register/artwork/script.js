

angular.module('ARN')

.directive('registerArtwork', [function () {
	return {
		templateUrl: 'components/common/register/artwork/tpl.htm',
		controllerAs: 'ctrl',
		bindToController: true,
		controller: ['$scope', function ($scope) {

			$scope.skip = function () {
				$scope.nextStep();
			};

			$scope.next = function () {
				$scope.pendingRequest = true;

				$scope.artworkEdit.save(
					function () {
						$scope.nextStep();
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

