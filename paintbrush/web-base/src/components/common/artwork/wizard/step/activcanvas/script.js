

angular.module('ARN')

.directive('artworkWizardStepActivCanvas', ['$q', 'artworkService', 'watchService', 'videoService', function ($q, artworkService, watchService, videoService) {
	var _dir = 'components/common/artwork/wizard/step/activcanvas/';
	return {
		templateUrl: _dir + 'tpl.htm',
		replace: true,
		restrict: 'E',
		scope: { config: '=', profile: '=' },
		controller: ['$scope', function ($scope) {

			var config,
				profile,
				videos,
				forms = $scope.forms = {};

			var init = function () {
				config = $scope.config;

				var premiumAccount = profile.ActivCanvas.StatusID === 3;

				if (premiumAccount) {
					videos.splice(0, 0, { value: 0, label: 'Default: ' + (profile.ActivCanvas.VideoID ? profile.ActivCanvas.VideoName : 'No Video') });
				}

				config.artworks.forEach(function (artwork) {
					artwork.Shareable = artwork.Shareable === undefined ? true : artwork.Shareable;
					artwork.VideoID = artwork.VideoID === undefined ? 0 : artwork.VideoID;

					var fields = [
						{ type: 'checkbox', name: 'Shareable', label: 'Shareable' },
						{ type: 'url', name: 'CustomShareURL', label: 'Custom Share URL', show: 'model.Shareable' }
					];

					if (premiumAccount) {
						fields.push({ type: 'select', name: 'VideoID', label: 'Video', options: videos, emptyLabel: 'No Video'  });
					}

					forms[artwork.ID] = {
						data: artwork,
						fields: fields
					}
				});


				$scope.instructions = {
					message:
						'Below are the current ActivCanvas settings for each artwork<br/>' +
						'<ul>' +
						'<li><strong>Shareable:</strong> allow ActivCanvas users to share this image with their friends on social media.</li>' +
						'<li><strong>Custom Share URL (Optional):</strong> specify a custom web page to direct people to when this image is shared on social media.</li>' +
						(premiumAccount ? '<li><strong>Video (Optional):</strong> specify a video to play after an ActivCanvas user has scanned this artwork.</li>' : '') +
						'</ul>'
				};

				$scope.$on('ui-change', function (event, eventData) {
					config.complete = false;

					var form = eventData.form;

					if (form.isValid()) {
						form.error = undefined;
						form.status = 2;

						var data = form.getData();

						artworkService.update.activCanvas(form.data.ID, data)
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

				config.complete = true;	// step is optional
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


			var watch = watchService($scope).watch;

			watch('profile').then(function(data) {
				profile = data;

				$q.all([
					watch('config'),

					videoService.list(profile.ID).then(function(data) {
						videos = data.map(function (v) {
							return { value: v.ID, label: v.Name };
						});
					})
				]).then(init);
			})



		}]
	}
}]);

