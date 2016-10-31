

angular.module('ARN')

.directive('artworkManageViewGeneral', ['watchService', function (watchService) {
	var _dir = 'components/common/artwork/manage/view/general/';
	return {
		templateUrl: _dir + 'tpl.htm',
		replace: true,
		restrict: 'E',
		scope: { artwork: '=' },
		controller: ['$scope', function ($scope) {

			watchService($scope).watch('artwork', 'ID')
				.then(function (artwork) {
					var description = artwork.Description || '';
					$scope.descriptionShort = description.length > 250 ? description.substring(0, 250) + '...' : description;
				});

		}]
	}
}]);

