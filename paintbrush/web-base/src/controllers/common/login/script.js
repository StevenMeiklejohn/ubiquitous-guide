;(function () {
	'use strict';

	angular
		.module('ARN')
		.controller('Login', ['$scope', '$stateParams', function ($scope, $stateParams) {

			var view = 'login';

			switch ($stateParams.v) {
				case 'reset': view = 'reset'; break;
				case 'forgot': view = 'forgot'; break;
			}

			$scope.view = view;		// login/forgot/reset

		}]);

})();
