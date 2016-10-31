(function(){



angular.module('ARN')


.directive('s3Upload', ['s3Service', function(s3){
	return {
		restrict: 'E',
		replace: true,
		scope: {
			config: '='
		},
		templateUrl: 'components/common/s3/upload/tpl.htm',
		link: function (scope, element, attrs) {

			var fileInput = element.find('[type=file]'),
				statusBar = element.find('.upload-status'),
				config = scope.config || {};


			if (config.accept) {
				fileInput.attr('accept', config.accept);
			}


			// user selects an image
			fileInput.change(function () {

				if (!this.files || !this.files[0]) return

				var file = this.files[0],
					fileName = this.files[0].name,
					fileSize = file.size,

					startUpload = function () {
						// reset progress
						statusBar.removeClass('green red').addClass('gold');
						scope.progress = fileName + ' : Starting Upload';

						// upload direct to s3
						s3.upload(config.folder, file).then(
							function (uri) {
								scope.progress = fileName + ' : Complete';
								statusBar.removeClass('gold red').addClass('green');
								config.success && config.success(uri, fileName, fileSize);
							},
							function (message) {
								statusBar.removeClass('gold green').addClass('red');
								scope.progress = fileName + ' : Upload Failed';
								config.error && config.error(message);
							},
							function (progress) {
								scope.progress = fileName + ' : ' + progress + ' %';
							}
						)
					};

				// allow file to be inspected within browser before starting upload
				if (config.beforeUpload) {
					config.beforeUpload(file, startUpload);
				}
				else {
					startUpload();
				}
			})

		}
	}
}])



})();
