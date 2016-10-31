

angular.module('ARN')

.directive('profileEditBio', ['profileService', 'biographyService', '$location', '$q', function (profileService, biographyService, $location, $q) {
	return {
		templateUrl: 'components/common/profile/edit/bio/tpl.htm',
		replace: true,
		restrict: 'E',
		scope: { profile: '=' },
		controller: function ($scope, $element) {

			var form;
			var profile = $scope.profile;

			var init = function () {
				var profileType = profile.Artist ? 'artist' : 'gallery';

				$q.all([
					biographyService.answers(profile.ID).then(function (data) {
						data.forEach(function (answer) {
							$scope.answers[answer.QuestionID] = answer.Answer;
						})
					}),
					biographyService.questions.types(profileType).then(function (data) {
						$scope.questionTypes = data;

						data.forEach(function (type) {
							biographyService.questions.list(profileType, type.ID).then(function (_data) {
								$scope.questions[type.ID] = _data;
							});
						})
					}),
					biographyService.get(profile.ID).then(function (data) {
						$scope.biography = data.Description;
					}).catch(function (err) { })

				]).then(function() {
					$scope.questionTypes.forEach(function (type) {
						type.hasAnswers = ($scope.questions[type.ID] || []).some(function (question) {
							return $scope.answers[question.ID];
						})
					});


					if (!$scope.biography && Object.keys($scope.answers).length) {
						$scope.migrateWarning = {
							type: 'warn',
							message:
									'After feedback from our users we have changed the profile biography section to a single free text field.<br/><br/>' +
									'Your previous data has been preserved below to allow you to copy any text you wish to keep.'
						}
					}

					setTimeout(function () {
						form = new Form($element.find('form'), {
							errors: { inline: true }
						});
					}, 10);
				})
			};

			$scope.answers = {};
			$scope.questions = {};

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

					biographyService.update(profile.ID, data)
						.then(function() {
							$scope.$root.setActiveProfileByID($scope.profile.ID, $scope.cancel);
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

