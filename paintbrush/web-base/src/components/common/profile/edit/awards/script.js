

angular.module('ARN')

.directive('profileEditAwards', ['profileService', '$location', function (profileService, $location) {
	return {
		templateUrl: 'components/common/profile/edit/awards/tpl.htm',
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
								Awards: { isArray: true },
								Qualifications: { isArray: true }
							}
						});
					}, 10);
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
					data.Awards = data.Awards.filter(function(a){ return a; });
					data.Qualifications = data.Qualifications.filter(function(q){ return q; });

					$scope.pendingRequest = true;

					profileService.update.awards(profile.ID, data)
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
				initForm();
			}
			else {
				var watcher = $scope.$watch('profile', function (val) {
					if (val.ID > 0) {
						profile = val;
						watcher();
						initForm();
					}
				})
			}
		}
	}
}]);

