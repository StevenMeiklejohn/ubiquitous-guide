

angular.module('ARN')

.directive('profileVideoEdit', [function () {
	return {
		templateUrl: 'components/common/profile/edit/video/tpl.htm',
		controllerAs: 'ctrl',
		bindToController: true,
		controller: ['$scope', '$http', '$element', 'videoService', function ($scope, $http, $element, videoService) {

			$scope.ready = false;
			$scope.video = {};

			var form,
				uploadInProgress,
				isReady = function () {

					$scope.ready = true;

					setTimeout(function () {
						form = new Form($element.find('form'), {
							errors: { inline: true },
							field: {
								Duration: { type: 'number' },
								FileSize: { type: 'number' },
								Width: { type: 'number' },
								Height: { type: 'number' }
							}
						});

						if ($scope.video.VideoURI) {
							form.root.find('.video-preview').html('').append('<video controls src="' + $scope.video.VideoURI + '" style="max-width:500px;"></video>');
						}

					}, 500);
				};


			if ($scope.videoID) {
				videoService.get($scope.videoID).then(function(data) {
					$scope.video = data;
					isReady();
				});
			}
			else {
				isReady();
			}



			$scope.videoUploadConfig = {
				accept: 'video/mp4,video/quicktime,video/x-msvideo,video/webm',
				beforeUpload: function(file, start) {

					var input = form.root.find('[name=VideoURI]'),
						field = input.parents('.field'),
						URL = window.URL || window.webkitURL;

					form.clearMessage(null, input);

					var video = document.createElement('video');
					video.preload = 'metadata';
					video.onloadedmetadata = function () {
						URL.revokeObjectURL(this.src);

						var limit = 180, duration = video.duration;

						if (duration > limit && !($scope.profile.Artist && $scope.profile.Artist.Private)) {
							form.displayInlineMessage(
								input, 'error', 'Video is too long (' + Math.ceil(duration) + ' seconds), must be less than ' + limit + ' seconds.'
							);
						}
						else {
							start();
							uploadInProgress = true;

							// record meta data
							form.root.find('[name=Duration]').val(duration.toFixed(2));
							form.root.find('[name=Width]').val(video.videoWidth);
							form.root.find('[name=Height]').val(video.videoHeight);

							// output video preview
							video.style.maxWidth = '500px';
							video.controls = true;
							field.find('.video-preview').html('').append(video);
						}
					};
					video.onerror = function (e) {
						form.displayInlineMessage(
							input, 'error', 'This video file is either corrupt or not supported by your browser.'
						);
					};
					video.src = URL.createObjectURL(file);
					
				},
				success: function (uri, fileName, fileSize) {
					uploadInProgress = false;
					form.root.find('[name=VideoURI]').val(uri);
					form.root.find('[name=FileName]').val(fileName);
					form.root.find('[name=FileSize]').val(fileSize);
				},
				error: function () {
					uploadInProgress = false;
				}
			};



			$scope.save = function () {

				if (uploadInProgress) {
					form.displayMessage('error', 'Upload is still in progress, please wait');
				}
				else if (!form.isValid()) {
					form.displayValidationErrors();
				}
				else {
					var data = form.getData();
					data.ProfileID = $scope.profile.ID;

					$scope.pendingRequest = true;
					var complete = function() {
						$scope.pendingRequest = false;
						$scope.loadDirective('profile-videos');
					};

					var error = function(res) {
						$scope.pendingRequest = false;
						new Dialog.Info({
							title: '<h3 class="uppercase">Error</h3>',
							fixed: true,
							html:
								'<div class="message error">' +
								(res.Message ? res.Message : 'An unexpected error occurred while saving') +
								'</div>'
						});
					};

					if ($scope.video && $scope.video.ID) {
						videoService.update($scope.video.ID, data).then(complete).catch(error);
					}
					else {
						videoService.add(data).then(complete).catch(error);
					}

				}

			};



			$scope.deleteVideo = function () {

				$scope.pendingRequest = true;

				videoService.remove($scope.video.ID)
					.then(function () {
						$scope.pendingRequest = false;
						$scope.loadDirective('profile-videos');
					})
					.catch(function(res) {
						$scope.pendingRequest = false;
						new Dialog.Info({
							title: '<h3 class="uppercase">Error</h3>',
							fixed: true,
							html:
							'<div class="message error">' +
								(res.Message ? res.Message : 'An unexpected error occurred while deleting') +
							'</div>'
						});
					})


			}


		}]
	}
}]);

