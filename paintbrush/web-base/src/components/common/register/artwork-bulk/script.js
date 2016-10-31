

angular.module('ARN')

.directive('registerArtworkBulk', [function () {
	return {
		templateUrl: 'components/common/register/artwork-bulk/tpl.htm',
		controllerAs: 'ctrl',
		bindToController: true,
		controller: ['$scope', function ($scope) {

			$scope.artworkBulkUpload = {
				profileID: localStorage.profileID
			};

			$scope.next = function() {
				$scope.pendingRequest = true;
				$scope.artworkBulkUpload.save(
					function() {
						$scope.nextStep();
					},
					function() {
						$scope.pendingRequest = false;

						// TODO: handle error...
					}
				)
			};




			$scope.skip = function () {
				$scope.nextStep();
			};

			//$scope.next = function () {
			//
			//	$scope.pendingRequest = true;

				//$scope.artworkEdit.save(
				//	function () {
				//		$scope.nextStep();
				//	},
				//	function (res) {
				//		new Dialog.Info({
				//			title: '<h3 class="uppercase">Error</h3>',
				//			fixed: true,
				//			html: 'An error occurred while saving' +
				//				(!res.Message ? '' : ':' + '<pre>' + res.Message + '</pre>'),
				//		});
				//	},
				//	function () {
				//		$scope.pendingRequest = false;
				//	}
				//)

			//}


		}]
	}
}]);

