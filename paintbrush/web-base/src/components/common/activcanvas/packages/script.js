

angular.module('ARN')

.directive('activcanvasPackages', [function () {
	return {
		templateUrl: 'components/common/activcanvas/packages/tpl.htm',
		controllerAs: 'ctrl',
		bindToController: true,
		controller: ['$scope', '$http', '$element', function ($scope, $http, $element) {

			$http.get('/api/subscriptions/packages')
				.success(function (packages) {

					var _packages = [];

					_packages.push(packages[0]);
					_packages.push(packages[2]);

					$scope.packages = _packages;
				})

		}]
	}
}]);

