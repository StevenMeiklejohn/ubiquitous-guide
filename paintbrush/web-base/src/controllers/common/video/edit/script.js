(function () {
	'use strict';

	angular
		.module('ARN')
		.controller('VideoEdit', [ '$scope', '$stateParams',
			function($scope, $stateParams) {
				if ($stateParams.videoID) {
					$scope.pageTitle = 'Edit';
				}
				else {
					$scope.pageTitle = 'Add';
				}
			}
		]);
})();
