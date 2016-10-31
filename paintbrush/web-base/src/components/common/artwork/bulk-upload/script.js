

angular.module('ARN')

.directive('artworkBulkUpload', ['$http', '$location', '$compile', 'artworkService', 'videoService', function ($http, $location, $compile, artworkService, videoService) {
	return {
		restrict: 'E',
		replace: true,
		scope: {
			config: '='
		},
		templateUrl: 'components/common/artwork/bulk-upload/tpl.htm',
		controller: function($scope, $element) {

			var form,
				config = $scope.config || {};

			setTimeout(function () {
				form = new Form($element.find('form'), {
					autoScroll: true,
					errors: { inline: true }
				});
			}, 500);

			// util method to bulk set artwork values
			var setVals = function(fieldName, dialog, setAll) {
				var _form = dialog.root.find('form'), _val = _form.find('select').val();
				if (!_val) {
					_form.find('.message').remove();
					_form.prepend('<div class="message error">Please select a value from the list</div>');
				}
				else {
					form.root.find('[fname=' + fieldName + ']').each(function() {
						if (setAll || !$(this).val()) {
							$(this).val(_val);
						}
					});
					dialog.tidy();
				}
			};


			// bulk upload config
			$scope.uploadConfig = {
				folder: 'images',
				accept: 'image/jpeg,image/png',
				video: config.video,
				dropTarget: true,
				buttonText: 'Add Image(s)',
				buttonsTop: true,
				buttonsTemplate:
					'<a style="margin-left:10px;" ng-show="totalFiles" class="button orange right" ng-click="config.setTypes()"><i class="fa fa-pencil"></i><span class="text">Set Types</span></a>' +
					'<a ng-show="totalFiles && config.video" class="button orange right" ng-click="config.setVideos()"><i class="fa fa-video-camera"></i><span class="text">Set Videos</span></a>',
				template:
					'<div class="grid" ng-show="uploading">{{progressBar}}</div>' +
					'<div class="grid" ng-show="complete">' +
						'<div class="col-image">' +
							'<img ng-show="previewImageURI" ng-src="{{previewImageURI}}" />' +
							'<div ng-show="!previewImageURI" class="ajax-loader"></div>' +
						'</div>' +
						'<div class="col-fields">' +
							'<input name="ImageURI-{{index}}" type="hidden" value="{{uri}}" />' +
							'<input name="ImageColours-{{index}}" type="hidden" value="{{imageColours}}" />' +
							'<div class="field"><label for="Name-{{index}}">Title</label><input name="Name-{{index}}" type="text" value="{{_fileName}}" required /></div>' +
							'<div class="field"><label for="ArtworkTypeID-{{index}}">Type</label><select fname="ArtworkTypeID" name="ArtworkTypeID-{{index}}" required>' +
								'<option value=""></option>' +
								'<option ng-repeat="type in types" value="{{type.ID}}" title="{{type.Type}}">{{type.Type}}</option>' +
							'</select></div>' +
							'<div class="field" ng-if="parentConfig.video"><label for="VideoID-{{index}}">ActivCanvas Video</label><select fname="VideoID" name="VideoID-{{index}}">' +
								'<option value="">No Video</option>' +
								'<option value="0">Default Profile Video</option>' +
								'<option ng-repeat="video in videos" value="{{video.ID}}" title="{{video.Description}}">{{video.Name}}</option>' +
							'</select></div>' +
							'<div class="field"><label for="Price-{{index}}">Price (GBP)</label><input name="Price-{{index}}" type="number" min="0" max="100000000" value="0" required /></div>' +

					'</div>' +
						'<div class="col-controls">' +
							'<a><i class="fa fa-lg fa-times" ng-click="removeFile()" title="Remove image"></i></a>' +
						'</div>' +
					'</div>',
				success: function (file, wrap, scope) {

					var previewImageURI = '/api/proxy/image/' + encodeURIComponent(file.uri) + '/250';

					var img = document.createElement('img');
					img.onload = function () {
						scope.previewImageURI = previewImageURI;
						scope.imageColours = JSON.stringify(new ColorThief().getPalette(img, 6));
						scope.$root.forceDigest();
					};
					var retryCount = 0;
					img.onerror = function () {
						if (retryCount < 4) {
							retryCount += 1;

							setTimeout(function () {
								img.src = previewImageURI;
							}, 250)
						}
					};
					img.src = previewImageURI;
				},
				beforeUpload: function(file, start, scope) {
					scope.videos = $scope.videos;
					scope.types = $scope.types;

					var parts = file.name.split('.');
					var fileName = parts.slice(0, parts.length - 1).join('.');

					// blank file name if it begins with a default camera naming scheme or is entirely numeric
					var cameraFileNames = ['DSC', 'DCP', 'IMG', 'MOV', 'MVC', 'P000', 'PICT', 'SBC'],
						disallowed = !isNaN(fileName * 1);

					if (!disallowed) {
						disallowed = cameraFileNames.some(function(prefix) { return fileName.indexOf(prefix) === 0; })
					}

					scope._fileName = disallowed ? '' : fileName;
					setTimeout(start, 1);
				},

				// custom template methods
				// bulk updates the artwork type values
				setTypes: function() {
					new Dialog({
						title: '<h3>Update Artwork Types</h3>',
						autoClose: false,
						html:
							$compile(
								'<div class="message" style="margin-bottom: 10px;max-width: 338px">Please choose an artwork type from the list to apply to your uploaded items.</div>' +
								'<form>' +
								'<div class="field"><label>Type</label>' +
									'<select name="ArtworkType" required>' +
										'<option></option><option ng-repeat="type in types" value="{{type.ID}}">{{type.Type}}</option>' +
									'</select>' +
								'</div>' +
								'</form>'
							)($scope),
						buttons:[
							{ text: 'Cancel', icon: { left: 'fa fa-reply' }, onclick: function() { this.tidy(); } },
							{ text: 'Update Unset', class: 'sky-blue', icon: { left: 'fa fa-save' }, onclick: function() { setVals('ArtworkTypeID', this, false); } },
							{ text: 'Update All', class: 'sky-blue', icon: { left: 'fa fa-save' }, onclick: function() { setVals('ArtworkTypeID', this, true); } }
						]
					})
				},
				setVideos: function() {
					new Dialog({
						title: '<h3>Update Artwork Videos</h3>',
						autoClose: false,
						html:
							$compile(
								'<div class="message" style="margin-bottom: 10px;max-width: 338px">Please choose a video from the list to apply to your uploaded items.</div>' +
								'<form>' +
								'<div class="field"><label>Video</label>' +
									'<select name="VideoID" required>' +
										'<option></option><option ng-repeat="video in videos" value="{{video.ID}}">{{video.Name}}</option>' +
									'</select>' +
								'</div>' +
								'</form>'
							)($scope),
						buttons:[
							{ text: 'Cancel', icon: { left: 'fa fa-reply' }, onclick: function() { this.tidy(); } },
							{ text: 'Update Unset', class: 'sky-blue', icon: { left: 'fa fa-save' }, onclick: function() { setVals('VideoID', this, false); } },
							{ text: 'Update All', class: 'sky-blue', icon: { left: 'fa fa-save' }, onclick: function() { setVals('VideoID',this, true); } }
						]
					})
				}
			};

			// tidy up image files left on s3 if user cancels editing/leaves page
			var savedURIs = [];
			$scope.$on("$destroy", function() {
				$scope.uploadConfig.leaveHandler(savedURIs);
			});


			config.save = function(success, error) {

				if (!form.isValid()) {
					form.displayValidationErrors();
					error && error();
				}
				else {
					var data = form.getData();

					var files = [], keys = Object.keys(data);

					keys.forEach(function(key) {
						if (key.indexOf('ImageURI') === 0) {
							var index = key.split('-')[1];
							files.push({
								ImageURI: data['ImageURI-' + index],
								ImageColours: JSON.parse(data['ImageColours-' + index] || '[]'),
								ArtworkTypeID: data['ArtworkTypeID-' + index],
								VideoID: data['VideoID-' + index],
								Name: data['Name-' + index],
								Price: data['Price-' + index]
							});
						}
					});


					artworkService.bulkAdd(config.profileID, files)
						.then(function () {
							files.forEach(function(file){
								savedURIs.push(file.ImageURI);
							});
							success && success();
						})
						.catch(function(e) {
							if (e.data && e.data.Message) {
								form.displayMessage('error', e.data.Message);
							}
							error && error(e);
						});

				}

			};


			videoService.list(config.profileID).then(function (data) {
				$scope.videos = data;
			});

			artworkService.types().then(function(data) {
				$scope.types = data;
			});

		}
	}
}]);

