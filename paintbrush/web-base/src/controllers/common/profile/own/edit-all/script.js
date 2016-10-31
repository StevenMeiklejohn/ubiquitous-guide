;(function () {
	'use strict';

	function ProfileOwnEditController($scope, $stateParams, $compile, $location, profileService) {

		var id = ($stateParams.id || localStorage.profileID || 0) * 1;

		$scope.profile = null;

		profileService.get(id)
			.then(function (data) {

				if (data.Artist) {
					var _typeIDs = [];
					data.Artist.Types.forEach(function (type) {
						_typeIDs.push(type.ID);
					});
					data.Artist.Types = _typeIDs;

					var _spaceIDs = [];
					data.Artist.WorkingSpaces.forEach(function (space) {
						_spaceIDs.push(space.ID);
					});
					data.Artist.WorkingSpaces = _spaceIDs;
				}

				data.IsOwn = data.ID === $scope.userProfile.ID;
				$scope.profile = data;

				if (data.IsOwn || $scope.userProfile.IsAdmin || $scope.userProfile.managesArtist(data.ID)) {
					var el = angular.element('<div profile-info-edit></div>');
					$('.editor').html('').append(el);
					$compile(el)($scope.$new(true));
				}
				else {
					$scope.error = 'You do not have permission to edit this profile';
				}
			});


		$scope.cancel = function() {
			$location.url('/profile' + (!$scope.profile.IsOwn ? '/' + $scope.profile.ID : ''))
		};

	}


	angular
		.module('ARN')
		.controller('ProfileOwnEdit', [ '$scope', '$stateParams', '$compile', '$location', 'profileService', ProfileOwnEditController ]);

})();
