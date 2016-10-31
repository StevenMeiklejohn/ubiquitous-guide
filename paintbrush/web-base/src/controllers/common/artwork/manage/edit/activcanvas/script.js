(function () {
	'use strict';
	angular.module('ARN').controller('ArtworkManageEditActivCanvas', ['$scope', '$stateParams', 'artworkService', function($scope, $stateParams, artworkService) {
		artworkService.get($stateParams.artworkID).then(function (data) {
			$scope.artwork = data;
			$scope.$root.docTitle('ActivCanvas Settings | ' + data.Name + ' | ' +  'Artwork | ' + data.ArtistName);
		})
		.catch(function (err) {
			$scope.error = { type: err.status === 403 ? 'warn' : 'error', message: err.data.Message };
		});
	}]);
})();
