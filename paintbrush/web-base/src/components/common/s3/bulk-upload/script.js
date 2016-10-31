(function(){



angular.module('ARN')


.directive('s3BulkUpload', ['s3Service', '$compile', 'watchService', function(s3, $compile, watchService){
	return {
		restrict: 'E',
		replace: true,
		scope: {
			config: '='
		},
		templateUrl: 'components/common/s3/bulk-upload/tpl.htm',
		link: function ($scope, element) {

			watchService($scope).watch('config').then(function () {

				var fileInput = element.find('[type=file]'),
					filesWrap = element.find('.files'),
					config = $scope.config || {},
					acceptTypes = {},	// hash map of acceptable mime types
					index = 0;

				// expose file scopes to parent control
				config.fileScopes = [];

				if (!config.template) {
					//config.template = '<div>TODO</div>';
				}
				config.template = config.template.replace(/\{\{progressBar}}/, '<div ng-show="progress" class="upload-status gold" title="Progress">{{progress}}</div>');

				if (config.buttonsTemplate) {
					element.find('.buttons').each(function() {
						$(this).append($compile(config.buttonsTemplate)($scope));
					});
				}

				if (config.accept) {
					fileInput.attr('accept', config.accept);
					config.accept.split(',').forEach(function(t) {
						acceptTypes[t] = 1;
					});
				}

				$scope.buttonText = config.buttonText || 'Add File(s)';
				$scope.totalFiles = 0;

				// add page leave handler to tidy up s3 bucket
				var pendingImageURIs = {};
				var leaveHandler = function() {
					Object.keys(pendingImageURIs).forEach(function(uri) { removeFile(uri); });
				};
				$(window).on('beforeunload', leaveHandler);

				// expose the page leave handler within config so parent control can use it if user cancels out of form
				config.leaveHandler = function(keepURIs) {
					if (keepURIs) {
						keepURIs.forEach(function(uri) {
							delete pendingImageURIs[uri];
						});
					}
					leaveHandler();
				};

				// keeps track of any rejected files each time a new set of files are added
				var rejectedFiles = [];

				// displays a notification to the user if any files where rejected
				var rejectedFilesNotification = function() {
					if (rejectedFiles.length) {

						var html = '<p><strong>' + rejectedFiles.length + '</strong> file' + (rejectedFiles.length > 1 ? 's' : '') + ' could not be uploaded</p><ul>';
						rejectedFiles.forEach(function(f) {
							html += '<li><strong>' + f.name + '</strong> - ' + f.reason + '</li>';
						});

						new Dialog.Info({
							title: '<h3>Warning</h3>',
							html: html + '</ul>'
						});

						rejectedFiles = [];
					}
				};


				// starts uploading a new file
				var startUpload = function(file, scope) {
					$scope.totalFiles++;

					var fileName = file.name,
						fileSize = file.size;

					scope.index = index++;
					scope.uploading = 1;
					scope.fileName = fileName;
					scope.fileSize = fileSize;
					scope.progress = file.name + ' : Starting Upload';

					scope.parentConfig = config;

					scope.removeFile = function() {
						removeFile(scope.uri, wrap, scope);
					};

					// append compiled template for the current file
					filesWrap.append($compile('<div class="file file-' + scope.index + '">' + config.template + '</div>')(scope));
					scope.$root.forceDigest();

					var wrap = filesWrap.find('> .file-' + scope.index),
						statusBar = wrap.find('.upload-status');

					// upload direct to s3
					s3.upload(config.folder, file).then(
						function (uri) {
							pendingImageURIs[uri] = 1;

							scope.progress = fileName + ' : Complete';
							scope.uri = uri;
							scope.complete = 1;
							scope.uploading = 0;

							statusBar.removeClass('gold red').addClass('green');
							if (config.success) {
								config.success(
									{
										uri: uri,
										name: fileName,
										size: fileSize
									},
									wrap,
									scope
								);
							}

							scope.$root.forceDigest();
						},
						function () {
							statusBar.removeClass('gold green').addClass('red');
							scope.progress = fileName + ' : Upload Failed';
						},
						function (progress) {
							scope.progress = fileName + ' : ' + progress + ' %';
						}
					);

					config.fileScopes.push(scope);
				};

				// removes an uploaded file from the s3 bucket
				var removeFile = function(uri, wrap, scope) {
					wrap && wrap.append('<div class="ajax-loader-wrap"><div class="ajax-loader"></div></div>');

					var _cancel = function () {
						wrap && wrap.find('.ajax-loader-wrap').remove();
					};
					var _remove = function () {
						s3.deleteObject(uri)
							.success(function() {
								delete pendingImageURIs[uri];
								$scope.totalFiles--;
								wrap && wrap.remove();

								if (scope) {
									config.fileScopes = config.fileScopes.filter(function (fscope) {
										return fscope.index !== scope.index;
									});
								}
								if (config.onFileRemoved) {
									config.onFileRemoved();
								}
							})
							.catch(function(e) {
								if (wrap) {
									wrap.find('> .message').remove();
									wrap.prepend(
										'<div class="message error">' + ((e.data || {}).Message || 'Unexpected error occurred while deleting image') + '</div>'
									)
								}
							})
							.finally(_cancel)
					};

					if (config.beforeFileRemoved) {
						config.beforeFileRemoved({ uri: uri }, _remove, _cancel, scope);
					}
					else {
						_remove();
					}

				};

				// handles adding a new file
				// - check file is in the list of acceptable mime-types if defined
				// - creates an isolated scope then starts uploading
				var addFile = function(file) {

					// verify mime-type is allowed
					if (config.accept && Object.keys(acceptTypes).length && !acceptTypes[file.type]) {
						rejectedFiles.push({
							name: file.name,
							reason: 'This is not an allowed file type'
						});
					}
					else if (!file.size) {
						rejectedFiles.push({
							name: file.name,
							reason: 'This file is corrupt or empty'
						});
					}
					else {

						// create a new scope for this file
						var scope = $scope.$new(true);

						// allow file to be inspected within browser before starting upload
						if (config.beforeUpload) {
							config.beforeUpload(file, function() { startUpload(file, scope); }, scope);
						}
						else {
							startUpload(file, scope);
						}
					}
				};

				// user selects an image
				fileInput.change(function () {
					if (this.files && this.files[0]) {
						for (var i = 0; i < this.files.length; i++) {
							addFile(this.files[i]);
						}
						rejectedFilesNotification();
					}

				});

				// set up drag/drop handlers
				var dragOverHandler = function(e) {
					e.preventDefault();
					e.originalEvent.dataTransfer.dropEffect = "move"
				};

				var dropHandler = function(e) {
					e.stopPropagation(); // Stops some browsers from redirecting.
					e.preventDefault();

					var files = e.originalEvent.dataTransfer.files;
					if (files.length) {
						for (var i = 0, f; f = files[i]; i++) {
							var file = files[i];

							// check if object is a folder
							if (!file.type && file.size%4096 == 0) {
								rejectedFiles.push({
									name: file.name,
									reason: 'Uploading folders is currently unsupported'
								});
							}
							else {
								addFile(file);
							}
						}
						rejectedFilesNotification();
					}
				};

				$('body').on('dragover', dragOverHandler);
				$('body').on('drop', dropHandler);

				// tidy up event listeners if directive is destroyed
				$scope.$on("$destroy", function() {
					$(window).off('beforeunload', leaveHandler);
					$('body').off('dragover', dragOverHandler);
					$('body').off('drop', dropHandler);
				});

			})

		}
	}
}])



})();
