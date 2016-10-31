'use strict';

angular.module('ARN')

.controller('VideoView', ['$scope', '$location', function ($scope, $location) {

	$scope.add = function () {
		$location.url('/videos/add');
	};

}]);





