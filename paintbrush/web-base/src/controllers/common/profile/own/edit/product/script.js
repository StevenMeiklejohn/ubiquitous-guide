(function () {
	'use strict';

	angular.module('ARN')
		.controller('ProfileOwnEditProduct', ['$scope', '$stateParams',
										function($scope, $stateParams) {

				var isNew = $stateParams.productID === 'add';

				$scope.title = isNew ? 'Add' : 'Edit';
				$scope.config = { returnURL: '/profile/product' };

			}
		]);

})();
