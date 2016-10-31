

angular.module('ARN')

.directive('profileEditArtistInfo', ['profileService', 'artistService', '$location', '$q', function (profileService, artistService, $location, $q) {
	return {
		templateUrl: 'components/common/profile/edit/artist/tpl.htm',
		replace: true,
		restrict: 'E',
		scope: { profile: '=' },
		controller: function ($scope, $element) {

			var profile = $scope.profile;

			var form,
				initForm = function () {
					$scope.ready = true;
					setTimeout(function () {
						form = new Form($element.find('form'), {
							errors: { inline: true },
							field: {
								Types: {type: 'number', isArray: true},
								WorkingSpaces: {type: 'number', isArray: true},
								AgeBracketID: {type: 'number'}
							}
						});
					}, 10);
				},
				init = function() {
					$scope._types = profile.Artist.Types.map(function (t) { return t.ID; });
					$scope._workSpaces = profile.Artist.WorkingSpaces.map(function (s) { return s.ID; });

					$q.all([
						artistService.ageBrackets().then(function(data) {
							$scope.ageBrackets = data;
						}),
						artistService.types().then(function(data) {
							$scope.artistTypes = data;
						}),
						artistService.workspaces().then(function(data) {
							$scope.workspaces = data;
						})
					]).then(initForm);
				};


			$scope.cancel = function () {
				$location.url('/profile');
			};

			$scope.save = function () {
				if (!form.isValid()) {
					form.displayValidationErrors();
				}
				else {
					var data = form.getData();
					$scope.pendingRequest = true;

					profileService.update.artist(profile.ID, data)
						.then(function() {
							$scope.$root.setActiveProfileByID(profile.ID, $scope.cancel);
						})
						.catch(function (err) {
							$scope.pendingRequest = false;
							$scope.error = { type: err.status === 403 ? 'warn' : 'error', message: err.data.Message };
						});

				}
			};

			if (profile.ID > 0) {
				init();
			}
			else {
				var watcher = $scope.$watch('profile', function (val) {
					if (val.ID > 0) {
						profile = val;
						watcher();
						init();
					}
				})
			}
		}
	}
}]);

