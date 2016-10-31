

angular.module('ARN')

.directive('artworkManageIndex', [function () {
	var _dir = 'components/common/artwork/manage/index/';
	return {
		templateUrl: _dir + 'tpl.htm',
		replace: true,
		restrict: 'E',
		scope: { artwork: '=' },
		controller: ['$scope', 'watchService', function ($scope, watchService) {

			var artwork;

			var init = function () {
				var incomplete = [];

				if (!artwork.ImageURI) {
					incomplete.push('<a href="/artwork/manage/' + artwork.ID + '/image">Image</a>');
				}
				if (!artwork.Name || !artwork.Description || !artwork.Type || !artwork.Tags.length || !artwork.Styles.length) {
					incomplete.push('<a href="/artwork/manage/' + artwork.ID + '/general">General</a>');
				}

				if (incomplete.length) {
					$scope.message = {
						type: 'warn',
						message:
						'<div>This artwork is currently incomplete, please fill out the following sections: ' +
						'<strong>' + incomplete.join(', ') + '</strong></div>'
					};
				}
			};

			watchService($scope).watch('artwork', 'ID').then(function (data) {
				artwork = data;
				init();
			});

		}]
	}
}]);

