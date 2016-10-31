

angular.module('ARN')

.directive('shortlistCreate', [function () {
	return {
		templateUrl: 'components/common/shortlists/create/tpl.htm',
		controller: ['$scope', 'shortlistService', '$timeout', function ($scope, shortlistService, $timeout) {
			var f;

			$scope.ready = true;

			$timeout(function () {
				$scope.$digest();
				$scope.dialog.center();

				f = new Form($scope.dialog.root.find('form'))
			});

			$scope.save = function () {

				if (!f.isValid()) {
					f.displayValidationErrors();
				}
				else {
					$scope.dialog.hide();

					var busy = new Dialog({ html: '<div class="ajax-loader"></div>' }),
							data = f.getData();

					var refreshShortlists = function() {
						shortlistService.list.active($scope.$root.activeProfile.ID).then(function (shortlists) {
							$scope.shortlists = shortlists;
							$scope.forceDigest();
						})
					};

					data.Description =  data.Description || data.Name;

					if (!$scope.shortlist || !$scope.shortlist.ID) {
						data.TypeID = 2;	// Artwork

						shortlistService.create($scope.$root.activeProfile.ID, data)
							.then(function () {
								refreshShortlists();
								$scope.dialog.tidy();
							})
							.catch(function (e) {
								$scope.dialog.show();
								f.displayMessage('error', e.data.Message);
							})
							.finally(busy.tidy);

					}
					else {
						shortlistService.update($scope.shortlist.ID, data)
							.then(function () {
								$scope.shortlist.Name = data.Name;
								$scope.shortlist.Description = data.Description;
								$scope.shortlist.Target = data.Target;
								refreshShortlists();
								$scope.dialog.tidy();
							})
							.catch(function (e) {
								console.log(e)
								$scope.dialog.show();
								f.displayMessage('error', e.data.Message);
							})
							.finally(busy.tidy);
					}



						
				}
			}

		}]
	}
}]);

