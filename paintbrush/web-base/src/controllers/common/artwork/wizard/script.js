'use strict';

angular.module('ARN')

.controller('ArtworkImportWizard', ['$scope', '$stateParams', '$location', '$sce', 'artworkService', 'watchService', 'proxyService',
							function ($scope, $stateParams, $location, $sce, artworkService, watchService, proxy) {

	//watchService($scope).watch('$root.activeProfile', 'ID').then(loadArtwork);

								console.log($scope.activeProfile)
								console.log($scope.$root.activeProfile)

}]);





