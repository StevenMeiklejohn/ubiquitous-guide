

angular.module('ARN')

.directive('profileViewBio', ['biographyService', '$q', function (biographyService, $q) {
	return {
		templateUrl: 'components/common/profile/view/bio/tpl.htm',
		replace: true,
		restrict: 'E',
		scope: { profile: '=' },
		controller: ['$scope', function ($scope) {
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
						$scope.biographyShort = data.Description.length > 500 ? data.Description.substring(0, 500) + '...' : data.Description;
					}).catch(function (err) {})

				]).then(function() {
					$scope.questionTypes.forEach(function (type) {
						type.hasAnswers = ($scope.questions[type.ID] || []).some(function (question) {
							return $scope.answers[question.ID];
						})
					});

					$scope.hasAnswers = !!Object.keys($scope.answers).length;

					if (!$scope.hasAnswers && !$scope.biography) {
						if ($scope.$root.activeProfile.ID === profile.ID) {
							$scope.error = { message: 'You haven\'t created a biography yet' };
						}
						else {
							$scope.error = { message: 'This artist hasn\'t added a biography yet' };
						}
					}
				})
			};

			$scope.answers = {};
			$scope.questions = {};

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


		}]
	}
}]);

