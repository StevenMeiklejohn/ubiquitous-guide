

angular.module('ARN')

.directive('profileEditContactInfo', ['profileService', '$location', function (profileService, $location) {
	return {
		templateUrl: 'components/common/profile/edit/contact/tpl.htm',
		replace: true,
		restrict: 'E',
		scope: { profile: '=' },
		controller: function ($scope, $element) {

			var form;

			setTimeout(function () {
				form = new Form($element.find('form'), {
					errors: { inline: true }
				});
			}, 10);


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

					profileService.update.contact($scope.profile.ID, data)
						.then(function() {
							$scope.$root.setActiveProfileByID($scope.profile.ID, $scope.cancel);
						})
						.catch(function (err) {
							$scope.pendingRequest = false;
							$scope.error = { type: err.status === 403 ? 'warn' : 'error', message: err.data.Message };
						});

				}
			};

		}
	}
}]);

