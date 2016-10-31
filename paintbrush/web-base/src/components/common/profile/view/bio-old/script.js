

angular.module('ARN')

.directive('profileBio', [function () {
	return {
		templateUrl: 'components/common/profile/view/bio/tpl.htm',
		controllerAs: 'ctrl',
		bindToController: true,
		controller: ['$scope', '$http', '$element', '$sce', function ($scope, $http, $element, $sce) {

			$scope.answers = {};
			$scope.questions = {};
			$scope.ready = false;

			var form;
			var pendingRequests = 2,
				isReady = function () {
					pendingRequests--;
					if (pendingRequests < 1) {
						$scope.hasAnswers = Object.keys($scope.answers).length > 0;

						$scope.questionTypes.forEach(function (type) {
							type.hasAnswers = $scope.questions[type.ID].some(function (question) {
								return $scope.answers[question.ID];
							})
						})

						$scope.ready = true;
					}
				};


			var profileType = $scope.profile.Gallery ? 'gallery' : 'artist';

			$http.get('/api/question/' + profileType + '/types')
				.success(function (types) {
					pendingRequests += types.length;

					$scope.questionTypes = types;

					for (var i in types) {
						(function (_id) {
							$http.get('/api/question/' + profileType + '/list/' + _id)
								.success(function (questions) {
									$scope.questions[_id] = questions;
								})
								.error(function () { })
								.then(isReady);
						})(types[i].ID)
					}

				})
				.error(function () { })
				.then(isReady);


			$http.get('/api/profile/' + $scope.profile.ID + '/answers')
				.success(function (data) {

					data.forEach(function (answer) {
						$scope.answers[answer.QuestionID] = answer.Answer;
					})

				})
				.error(function () { })
				.then(isReady);


		}]
	}
}]);

