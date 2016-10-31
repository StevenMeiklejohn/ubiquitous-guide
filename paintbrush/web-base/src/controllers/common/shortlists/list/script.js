;(function () {
	'use strict';

	angular.module('ARN')
	.controller('Shortlists', ['$scope', 'shortlistService', '$compile', '$location', function ($scope, shortlistService, $compile, $location) {

		$scope.ready = false;

		var loadActive = function () {

			shortlistService.list.active($scope.$root.activeProfile.ID).then(function (data) {
				for (var i in data) {
					if (data[ i ].Images[ 0 ]) {
						data[ i ].Images[ 0 ] = '/api/proxy/image/' + encodeURIComponent(data[ i ].Images[ 0 ]) + '/200';
						for (var j in data[ i ].Images) {
							if (j > 0) {
								data[ i ].Images[ j ] = '/api/proxy/image/' + encodeURIComponent(data[ i ].Images[ j ]) + '/90';
							}
						}
					}
				}

				$scope.shortlists = data;
				$scope.ready = true;

				if (!data.length) {
					$scope.error = { message: 'You do not currently have any shortlists.' };
				}
			})
			.catch(function (err) {
				$scope.error = { type: err.status === 403 ? 'warn' : 'error', message: err.data.Message };
			});

		};

		$scope.createShortlist = function () {
			
			$scope.dialog = new Dialog({
				title: '<h4>Create Shortlist</h4>',
				directive: 'shortlist-create',
				$scope: $scope,
				$compile: $compile
			});

		};


		$scope.viewShortlist = function (id) {
			$location.url('/shortlists/' + id);
		};


		if ($scope.$root.activeProfile && $scope.$root.activeProfile.ID > 0) {
			loadActive();
		}
		else {
			var watcher = $scope.$watch('$root.activeProfile', function(val) {
				if (val && val.ID > 0) {
					watcher();
					loadActive();
				}
			});
		}

	}]);


})();