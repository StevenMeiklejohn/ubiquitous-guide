

angular.module('ARN')

.directive('profileBioEdit', [function () {
	return {
		templateUrl: 'components/common/profile/edit/bio/tpl.htm',
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

						$scope.ready = true;
						
						var target = 100,			// target number of characters
							steps = 324;			// 212, 0, 0 --> 100, 212, 0

						$element.find('textarea').on('input', function () {

							var perc = $(this).val().length / target,
								step = Math.round(steps * perc);

							if (step < 213) {
								$(this).parent().css('background', 'rgb(212,' + step + ',0)')
							}
							else {
								$(this).parent().css('background', 'rgb(' + (step <= steps ? 212 - (step - 212) : 100) + ',212,0)');
							}

							// #d40000	-> rgb(212, 0, 0)
							// #43d400	-> rgb(67, 212, 0)

						}).trigger('input');
						
						form = new Form($element.find('form'));
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


			$scope.save = function () {
					
				var data = form.getData(), answers = [];
				for (var i in data) {
					answers.push({
						QuestionID: (i.replace(/question\-/g, '') * 1),
						Answer: data[i]
					})
				}
					

				$http.post('/api/profile/' + $scope.profile.ID + '/answers/update', answers)
					.success(function () {
						$scope.loadDirective('profile-bio');
					})
					.error(function (res) {
						new Dialog.Info({ title: 'Error', html: res.Message })
					});

			}

		}]
	}
}]);

