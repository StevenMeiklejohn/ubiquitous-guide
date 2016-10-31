

angular.module('ARN')

.directive('registerProfile', [function () {
	return {
		templateUrl: 'components/common/register/profile/tpl.htm',
		controllerAs: 'ctrl',
		bindToController: true,
		controller: ['$scope', '$http', '$element', function ($scope, $http, $element) {

			var form;

			var setPreviewImage = function(uri) {
				var previewImageURI = '/api/proxy/image/' + encodeURIComponent(uri) + '/280';

				var img = document.createElement('img');
				img.onload = function () {
					$scope.previewImageURI = previewImageURI;
					$scope.forceDigest();
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
			};



			setTimeout(function () {
				form = new Form($element.find('form'), {
					errors: { inline: true }
				});

				// autofocus first field
				$element.find('[name=Name]').focus();

				$element.find('input').keypress(function (e) {
					if (e.which === 13) {
						$scope.next();
					}
				});


				if ($scope.registrationProfile.imageURI) {
					$element.find('[name=ImageURI]').val($scope.registrationProfile.imageURI);
					setPreviewImage($scope.registrationProfile.imageURI);
				}
				if ($scope.registrationProfile.displayName) {
					$element.find('[name=Name]').val($scope.registrationProfile.displayName).change();
				}

			}, 1);


			$scope.location = window.location;

			$scope.imageUploadConfig = {
				folder: 'profile-images',
				accept: 'image/jpeg,image/png',
				success: function (uri) {
					$element.find('[name=ImageURI]').val(uri);
					setPreviewImage(uri);
				}
			};


			$scope.next = function () {

				if (!form.isValid()) {
					form.displayValidationErrors();
				}
				else {
					form.hideMessage();

					var data = form.getData();

					$http.post('/api/register/create-profile', {
						UserID: $scope.userID,
						RegistrationID: $scope.registrationID,
						Artist: $scope.type === 'artist',
						Gallery: $scope.type === 'gallery',
						Name: data.Name,
						ImageURI: data.ImageURI,
						Location: data.Location,
						Website: data.Website
					})
					.success(function (resp) {
						localStorage['profileID'] = resp.ProfileID;

						$scope.nextStep();
					})

				}
			}

		}]
	}
}]);

