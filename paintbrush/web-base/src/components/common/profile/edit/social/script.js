

angular.module('ARN')

.directive('profileEditSocial', ['profileService', 'socialMediaService', '$location', '$q', function (profileService, socialMediaService, $location, $q) {
	return {
		templateUrl: 'components/common/profile/edit/social/tpl.htm',
		replace: true,
		restrict: 'E',
		scope: { profile: '=' },
		controller: function ($scope, $element) {

			var profile = $scope.profile;

			var form,
				init = function () {
					profile.SocialMedia.forEach(function(sm){
						$scope._profiles[sm.ServiceID] = sm;
					});

					$scope.ready = true;
					setTimeout(function () {
						form = new Form($element.find('form'), {
							errors: { inline: true },
							field: { }
						});
					}, 10);
				};


			$scope._profiles = {};

			$scope.cancel = function () {
				$location.url('/profile');
			};

			$scope.save = function () {
				if (!form.isValid()) {
					form.displayValidationErrors();
				}
				else {
					var data = form.getData();

					var profiles = [];
					for (var i in data) {
						if (data[i]) {
							profiles.push({ ServiceID: i.split('-')[1], URL: data[i] });
						}
					}

					$scope.pendingRequest = true;
					profileService.update.socialMedia(profile.ID, profiles)
						.then(function() {
							$scope.$root.setActiveProfileByID(profile.ID, $scope.cancel);
						})
						.catch(function (err) {
							$scope.pendingRequest = false;
							$scope.error = { type: err.status === 403 ? 'warn' : 'error', message: err.data.Message };
						});

				}
			};

			socialMediaService.listServices().then(function(data) {
				$scope.services = data;
			});


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

