

angular.module('ARN')

.directive('artworkWizardStepArtworkInfo', ['artworkService', 'watchService', function (artworkService, watchService) {
	var _dir = 'components/common/artwork/wizard/step/artwork-info/';
	return {
		templateUrl: _dir + 'tpl.htm',
		replace: true,
		restrict: 'E',
		scope: { config: '=', profile: '=' },
		controller: ['$scope', function ($scope) {

			var config,
				forms = $scope.forms = {};

			$scope.instructions = {
				message:
				'<ul>' +
				'<li><strong>Description: </strong>Please enter a description of the original artwork, if you intend to sell the artwork or prints of the artwork you will be asked for details at a later step.</li>' +
				'<li><strong>Tags: </strong>Short descriptive words or phrases that describe the artwork</li>' +
				'</ul>'
			};


			var init = function () {
				config = $scope.config;

				console.warn(config);

				config.artworks.forEach(function (artwork) {
					forms[artwork.ID] = {
						data: artwork,
						fields: [
							{ type: 'textarea', name: 'Description' },
							{ type: 'repeater', name: 'Tags',
								field: { type: 'text' }
							}
						]
					}
				});


				$scope.$on('ui-change', function (event, eventData) {
					config.complete = false;

					var form = eventData.form;

					if (form.isValid()) {
						form.error = undefined;
						form.status = 2;

						var data = form.getData();

						artworkService.update.general(form.data.ID, data)
							.then(function () {
								form.status = 3;
							})
							.catch(function (err) {
								form.status = 4;
								form.error = { type: err.status === 403 ? 'warn' : 'error', message: err.data.Message };
							})
							.finally(isComplete);
					}
					else {
						form.status = 1;
						// display error message to user
					}

				});

				config.ready = true;
			};


			var isComplete = function () {

				var complete = true;
				for (var id in forms) {
					var form = forms[id];
					if (!form.isValid() || form.status !== 3) {
						complete = false;
					}
				}

				config.complete = complete;
			};


			watchService($scope).watch('config').then(init);
			
		}]
	}
}]);

