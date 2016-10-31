

angular.module('ARN')

.directive('artworkWizardStepImage', ['$q', 'artworkService', 'watchService', 'proxyService', function ($q, artworkService, watchService, proxy) {
	var _dir = 'components/common/artwork/wizard/step/image/';
	return {
		templateUrl: _dir + 'tpl.htm',
		replace: true,
		restrict: 'E',
		scope: { config: '=', profile: '=' },
		controller: ['$scope', function ($scope) {

			console.log('images scope:')
			console.log($scope)

			var config,
				artworkTypes;


			$scope.instructions = {
				message:
				'To ensure the best possible results these are our image guidelines:<br/>' +
				'<ul>' +
				'<li>Make sure that your artwork has been photographed from a \'straight on\' perspective and is not taken at an angle.</li>' +
				'<li>The image should be cropped to remove any visible frame around the artwork.</li>' +
				'<li>Avoid using photographs where the artwork is behind a reflective surface like glass.</li>' +
				'<li>The preferred file format is JPEG (.jpg)</li>' +
				'<li>The image file should be no larger than 6MB</li>' +
				'</ul>'
			};


			var init = function () {
				config = $scope.config;


				//
				// Init image upload control
				//
				$scope.uploadConfig = {
					folder: 'images',
					accept: 'image/jpeg,image/png',
					dropTarget: true,
					buttonText: 'Add Image(s)',
					buttonsTop: true,
					//buttonsTemplate:
							//'<a style="margin-left:10px;" ng-show="totalFiles" class="button orange right" ng-click="config.setTypes()"><i class="fa fa-pencil"></i><span class="text">Set Types</span></a>',
					template:
						'<div class="grid" ng-show="uploading">{{progressBar}}</div>' +
						'<div class="grid" ng-show="complete">' +
							'<div class="col-image">' +
								'<img ng-show="previewImageURI" ng-src="{{previewImageURI}}" />' +
								'<div ng-show="!previewImageURI" class="ajax-loader"></div>' +
							'</div>' +
							'<div class="col-fields">' +
								'<ui-message config="error"></ui-message>' +
								'<ui-form config="form"></ui-form>' +
							'</div>' +
							'<div class="col-controls">' +
								'<div class="status">' +
									'<i ng-if="status===1" class="fa fa-fw fa-lg fa-exclamation-triangle gold" title="There are currently validation errors/incomplete fields within this form, please correct the issues to save this artwork"></i>' +
									'<div ng-if="status===2" class="ajax-loader" title="This artwork is currently being saved."></div>' +
									'<i ng-if="status===3" class="fa fa-fw fa-lg fa-check green" title="This artwork has been successfully saved."></i>' +
									'<i ng-if="status===4" class="fa fa-fw fa-lg fa-times red" title="An error occurred while saving this data."></i>' +
								'</div>' +
								'<div class="divider"></div>' +
								'<a ng-click="removeFile()" title="Remove image"><i class="fa fa-fw fa-lg fa-trash orange"></i></a>' +
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
						// mark step as incomplete to prevent navigation to next step while image is uploading
						config.complete = false;

						// parse filename to use as default name
						var parts = file.name.split('.');
						var _fileName = parts.slice(0, parts.length - 1).join('.');

						// blank file name if it begins with a default camera naming scheme or is entirely numeric
						var cameraFileNames = ['DSC', 'DCP', 'IMG', 'MOV', 'MVC', 'P000', 'PICT', 'SBC'], disallowed = !isNaN(_fileName * 1);

						if (!disallowed) {
							disallowed = cameraFileNames.some(function(prefix) { return _fileName.indexOf(prefix) === 0; })
						}
						var fileName = disallowed ? '' : _fileName;

						// form instance settings
						scope.form = {
							fields: [
								{ type: 'hidden', name: 'ID', dataType: 'number', required: true },
								{ type: 'text', name: 'Name', value: fileName, required: true },
								{ type: 'select', name: 'ArtworkTypeID', label: 'Artwork Type', options: artworkTypes, dataType: 'number', required: true }
							]
						};

						// keep track of the sync current status of this form
						// 0: not saved yet
						// 1: form is currently invalid
						// 2: data is being submitted to the server
						// 3: data has been saved
						// 4: error occurred while saving
						scope.status = 0;

						scope.$on('ui-change', function (event, eventData) {
							if (eventData.form.isValid()) {
								scope.error = undefined;

								var data = eventData.form.getData();
								data.ImageURI = scope.uri;
								data.ImageColours = JSON.parse(scope.imageColours || '[]');

								console.log('SENDING DATA: ');
								console.log(data);

								// update sync status (sending)
								scope.status = 2;

								// add new artwork
								if (!data.ID) {
									data.ProfileID = $scope.profile.ID;

									artworkService.add(data)
										.then(function (resp) {
											// update form model so we avoid creating duplicates if user modifies form again
											eventData.form.updateModel('ID', resp.ID);
											scope.status = 3;
											savedURIs.push(data.ImageURI);
										})
										.catch(function (e) {
											scope.error = { type: e.status === 403 ? 'warn' : 'error', message: e.data && e.data.Message ? e.data.Message : 'Unexpected error while saving.' };
											scope.status = 4;
										})
										.finally(function () {
											setTimeout(isComplete, 150);
										});
								}
								else {
									artworkService.update.general(data.ID, data)
										.then(function () {
											scope.status = 3;
										})
										.catch(function (e) {
											scope.error = { type: e.status === 403 ? 'warn' : 'error', message: e.data && e.data.Message ? e.data.Message : 'Unexpected error while saving.' };
											scope.status = 4;
										})
										.finally(function () {
											setTimeout(isComplete, 150);
										});
								}

							}
							else {
								// mark step as incomplete to prevent navigation to next step
								config.complete = false;

								// update sync status (invalid)
								scope.status = 1;

								// display error message to user
							}

						});

						setTimeout(start, 1);
					},

					beforeFileRemoved: function(file, remove, cancel, scope) {
						var data = scope.form.getData();

						if (!data.ID) {
							remove();
						}
						else {
							artworkService.remove(data.ID).finally(remove);
						}
					},
					onFileRemoved: isComplete,

					// custom template methods
					// bulk updates the artwork type values
					setTypes: function() {
						//new Dialog({
						//	title: '<h3>Update Artwork Types</h3>',
						//	autoClose: false,
						//	html:
						//			$compile(
						//					'<div class="message" style="margin-bottom: 10px;max-width: 338px">Please choose an artwork type from the list to apply to your uploaded items.</div>' +
						//					'<form>' +
						//					'<div class="field"><label>Type</label>' +
						//					'<select name="ArtworkType" required>' +
						//					'<option></option><option ng-repeat="type in types" value="{{type.ID}}">{{type.Type}}</option>' +
						//					'</select>' +
						//					'</div>' +
						//					'</form>'
						//			)($scope),
						//	buttons:[
						//		{ text: 'Cancel', icon: { left: 'fa fa-reply' }, onclick: function() { this.tidy(); } },
						//		{ text: 'Update Unset', class: 'sky-blue', icon: { left: 'fa fa-save' }, onclick: function() { setVals('ArtworkTypeID', this, false); } },
						//		{ text: 'Update All', class: 'sky-blue', icon: { left: 'fa fa-save' }, onclick: function() { setVals('ArtworkTypeID', this, true); } }
						//	]
						//})
					}
				};

				// tidy up image files left on s3 if user cancels editing/leaves page
				var savedURIs = [];
				$scope.$on("$destroy", function() {
					$scope.uploadConfig.leaveHandler(savedURIs);
				});


				//
				// Flag directive as ready to parent
				//
				config.ready = true;
				$scope.$applyAsync();
			};

			//
			// Works out if current step is now complete
			//
			var isComplete = function () {

				var fileScopes = $scope.uploadConfig.fileScopes;

				if (!fileScopes.length) {
					config.complete = false;
				}
				else {
					// mark step as complete if all form instances are valid
					config.complete = !fileScopes.some(function (scope) {
						return !scope.form.isValid();
					});

					if (config.complete) {

						// update config.artworks to contain all form data from this step
						config.artworks = fileScopes.map(function (scope) {
							var data = scope.form.getData();
							data.ImageURI = scope.uri;
							data.PreviewImageURI = proxy.image(scope.uri, 250);
							return data;
						});
					}
				}

				$scope.$applyAsync();
			};

			var watch = watchService($scope).watch;

			$q.all([
				watch('config'),
				watch('profile', 'ID'),

				artworkService.types().then(function(data) {
					artworkTypes = data.map(function (t) {
						return { value: t.ID, label: t.Type };
					});
				})
			]).then(init);

		}]
	}
}]);

