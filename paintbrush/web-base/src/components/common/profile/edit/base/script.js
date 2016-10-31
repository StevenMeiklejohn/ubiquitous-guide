

angular.module('ARN')

.directive('profileEditBase', ['profileService', '$location', 'proxyService', function (profileService, $location, proxy) {
	return {
		templateUrl: 'components/common/profile/edit/base/tpl.htm',
		replace: true,
		restrict: 'E',
		scope: { profile: '=' },
		controller: function ($scope, $element) {
			var profile = $scope.profile;

			var form;

			var initForm = function () {
				$scope.previewImageURI = proxy.image(profile.ImageURI, 280);

				setTimeout(function () {
					form = new Form($element.find('form'), {
						errors: { inline: true }
					});
				}, 10);
			};


			$scope.imageUploadConfig = {
				folder: 'profile-images',
				accept: 'image/jpeg,image/png',
				success: function (uri, filename) {
					$element.find('[name=ImageURI]').val(uri);

					var previewImageURI = proxy.image(uri, 280);// '/api/proxy/image/' + encodeURIComponent(uri) + '/280';

					var img = document.createElement('img');
					img.onload = function () {
						$scope.previewImageURI = previewImageURI;
						$scope.$root.forceDigest();
					};
					var retryCount = 0;
					img.onerror = function () {
						if (retryCount < 4) {
							retryCount += 1;

							setTimeout(function () {
								img.src = previewImageURI;
							}, 250)
						}
					};
					img.src = previewImageURI;
				}
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

					profileService.update.base(profile.ID, data)
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

