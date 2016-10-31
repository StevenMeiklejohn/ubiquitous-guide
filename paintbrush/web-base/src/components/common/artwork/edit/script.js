

angular.module('ARN')

.directive('artworkEdit', [function () {
	return {
		templateUrl: 'components/common/artwork/edit/tpl.htm',
		//controllerAs: 'ctrl',
		//bindToController: true,
		controller: ['$scope', '$http', '$element', '$q', 'artworkService', 'materialsService', 'videoService', function ($scope, $http, $element, $q, artworkService, materialsService, videoService) {

			var root = $element.find('form'), form;

			$scope.artworkEdit = $scope.$parent.artworkEdit = {};

			// load any config specified by parent 
			var _conf = $element.attr('config');
			if (_conf && $scope[_conf]) {
				angular.extend($scope.artworkEdit, $scope[_conf]);
			}


			delete $scope.artwork;
			delete $scope.previewImageURI;
			delete $scope.previewImageColours;

			$scope.ready = false;	// ready flag will be set to true once all ajax requests have completed

			var pendingRequests = 3,
				isReady = function () {
					pendingRequests--;
					if (pendingRequests < 1) {
						$scope.ready = true;

						if ($scope.artwork) {
							$scope.artwork.Width = $scope.artwork.WidthMM / $scope.dimensionUnitRatios[$scope.artwork.DimensionUnitID];
							$scope.artwork.Height = $scope.artwork.HeightMM / $scope.dimensionUnitRatios[$scope.artwork.DimensionUnitID];
							$scope.artwork.Depth = $scope.artwork.DepthMM / $scope.dimensionUnitRatios[$scope.artwork.DimensionUnitID];
						}
						else {
							$scope.artwork = {
								Shareable: true,
								DimensionUnitID: 2
							};
						}


						// ensure digest cycle has finished before binding data dependent event listeners
						$scope.$root.forceDigest(function () {

							form = new Form(root, {
								autoScroll: true,
								errors: { inline: true },
								field: {
									Materials: { type: 'number', isArray: true },
									Styles: { type: 'number', isArray: true },
									Subjects: { type: 'number', isArray: true },
									DimensionUnitID: { type: 'number' },
									Tags: { isArray: true },
									ImageColours: { type: 'json' },
									VideoID: { type: 'number' }
								}
							});

							if (($scope.artwork.Tags || []).length === 0) {
								root.find('.tags .button').click();
							}

							root.find('[name=LimitedEdition]').change(function () {
								root.find('[name=LimitedEditionDetails]').parents('.field').toggle($(this).is(':checked'));
							}).change();

							root.find('[name=DimensionUnitID]').change(function () {
								var _id = $(this).val() * 1,
									_lastId = $(this).data('last-val') * 1,

									_fWidth = root.find('[name=Width]'),
									_fHeight = root.find('[name=Height]'),
									_fDepth = root.find('[name=Depth]');

								_fWidth.val(
									Math.round(Math.round(_fWidth.val() * $scope.dimensionUnitRatios[_lastId]) / $scope.dimensionUnitRatios[_id] * 100) / 100
								);
								_fHeight.val(
									Math.round(Math.round(_fHeight.val() * $scope.dimensionUnitRatios[_lastId]) / $scope.dimensionUnitRatios[_id] * 100) / 100
								);
								_fDepth.val(
									Math.round(Math.round(_fDepth.val() * $scope.dimensionUnitRatios[_lastId]) / $scope.dimensionUnitRatios[_id] * 100) / 100
								);

								if ($scope.dimensionUnitRatios[_id] === 1) {
									_fWidth.attr({ 'step': '1', 'min': '1' });
									_fHeight.attr({ 'step': '1', 'min': '1' });
									_fDepth.attr({ 'step': '1', 'min': '0' });
								}
								else {
									_fWidth.attr({ 'step': '0.01', 'min': '0.01' });
									_fHeight.attr({ 'step': '0.01', 'min': '0.01' });
									_fDepth.attr({ 'step': '0.01', 'min': '0' });
								}

								$(this).data('last-val', _id);
							}).change();
							
						});

					}
				};





			// If this directive is used during registration the user will not be authenticated
			// and will not be editing an existing artwork.
			// Skip setting a watcher for the profile object to be loaded
			if (!$scope.$root.authenticated) {
				isReady(); isReady();
			}
			else {
				// Wait for profile object to be loaded before fetching dependent data
				var _profileWatcher = $scope.$watch('$root.activeProfile', function(val) {
					if (val.ID > 0) {

						videoService.list(val.ID).then(function(data) {
							$scope.videos = data;
						})
						.finally(isReady);

						// if editing existing artwork fetch the record from the database
						if ($scope.artworkID) {

							artworkService.get($scope.artworkID)
								.then(function (data) {
									//if ($scope.profile.ID !== data.ArtistProfileID) {
									//	$scope.artworkEdit.onerror && $scope.artworkEdit.onerror({ Message: 'You do not have permission to modify this artwork' });
									//}
									//else {

									data._Styles = data.Styles.map(function (s) { return s.ID; });
									data._Subjects = data.Subjects.map(function (s) { return s.ID; });
									data._Materials = data.Materials.map(function (s) { return s.ID; });

									if (data.DimensionUnitID > 3) {
										data.DimensionUnitID = 2;

									}

									$scope.artwork = data;
									$scope.previewImageURI = '/api/v2/proxy/image/' + encodeURIComponent(data.ImageURI) + '/500';

									$scope.previewImageColours = [];

									if (data.Colours.length) {
										data.Colours.forEach(function (c) {
											$scope.previewImageColours.push([c.R, c.G, c.B]);
										});
										$scope.artwork.ImageColours = JSON.stringify($scope.previewImageColours);
									}
									else {
										var img = document.createElement('img');
										img.onload = function () {
											$scope.previewImageColours = new ColorThief().getPalette(img, 6);
											$scope.artwork.ImageColours = JSON.stringify($scope.previewImageColours);
											$scope.forceDigest();
										};
										img.src = $scope.previewImageURI;
									}

									isReady();
									//}
								})
								.catch(function(err) {
									$scope.artworkEdit.onerror && $scope.artworkEdit.onerror(err.data || {});
								});

						}
						else {
							isReady();
						}

						// un register watcher
						_profileWatcher();
					}
				});
			}


			var promiseQueue = [];

			promiseQueue.push(
				 artworkService.dimensionUnits().then(function (data) {
					 data = data.filter(function(u) {
						 return u.ID < 4;
					 });
					$scope.dimensionUnits = data;
					$scope.dimensionUnitRatios = {};
					for (var i in data) {
						$scope.dimensionUnitRatios[data[i].ID] = data[i].Ratio_MM;
					}
				})
			);

			promiseQueue.push(
				artworkService.priceBands().then(function (data) {
					$scope.pricebands = [];
					for (var i in data) {
						$scope.pricebands.push({
							ID: data[i].ID,
							Band: '£' + data[i].Min + (data[i].Max > 0 ? ' - £' + data[i].Max : '+')
						})
					}
				})
			);

			promiseQueue.push(
				artworkService.statuses().then(function (data) {
					$scope.statuses = data;
				})
			);

			promiseQueue.push(
				artworkService.styles().then(function (data) {
					$scope.styles = data;
				})
			);

			promiseQueue.push(
				artworkService.subjects().then(function (data) {
					$scope.subjects = data;
				})
			);

			promiseQueue.push(
				artworkService.timeSpent().then(function (data) {
					$scope.artworkTimeSpent = data;
				})
			);

			promiseQueue.push(
				artworkService.types().then(function (data) {
					$scope.artworkTypes = data;
				})
			);

			promiseQueue.push(
				materialsService.list().then(function (data) {
					$scope.materials = data;
				})
			);

			$q.all(promiseQueue).then(isReady);


			// public save method for parent controls to use
			$scope.artworkEdit.save = function (success, error, _finally) {
			
				if (!form.isValid()) {
					form.displayValidationErrors();
					_finally();
				}
				else {
					var data = form.getData();

					// ensure multi-select values are passed up as arrays
					if (!$.isArray(data.Materials)) {
						data.Materials = [data.Materials];
					}
					if (!$.isArray(data.Styles)) {
						data.Styles = [data.Styles];
					}
					if (!$.isArray(data.Subjects)) {
						data.Subjects = [data.Subjects];
					}

					// ensure tags are stored individually if entered as a comma separated list
					var _tags = [];
					data.Tags.forEach(function (tag) {
						var parts = tag.split(',');
						parts.forEach(function (part) {
							var t = part.trim();
							if (t) {
								_tags.push(t);
							}
						});
					});
					data.Tags = _tags;

					// ensure numeric values are not sent up as empty strings
					if (data.TimeSpentID === '') {
						data.TimeSpentID = undefined;
					}
					if (data.VideoID === '') {
						data.VideoID = undefined;
					}


					// convert dimensions into mm
					data.WidthMM = Math.round(data.Width * $scope.dimensionUnitRatios[data.DimensionUnitID]);
					data.HeightMM = Math.round(data.Height * $scope.dimensionUnitRatios[data.DimensionUnitID]);
					data.DepthMM = Math.round(data.Depth * $scope.dimensionUnitRatios[data.DimensionUnitID]);

					//
					data.Complete = true;

					var _success = function (resp) {
						data.ID = resp.ID;
						success(data);
					};

					if ($scope.artwork && $scope.artwork.ID) {
						artworkService.update($scope.artwork.ID, data).then(_success).catch(error).finally(_finally);
					}
					else {
						//if ($scope.profile) {
						//	data.ProfileID = $scope.profile.ID;	// allows admin users to add artwork on behalf of artist
						//}
						data.ProfileID = $scope.$root.activeProfile.ID;
						artworkService.add(data).then(_success).catch(error).finally(_finally);
					}
				}

			};




			// public delete method for parent controls to use
			$scope.artworkEdit.delete = function (success, error, _finally) {

				new Dialog({
					title: '<h3>Delete</h3>',
					html: '<div class="message">Are you sure you wish to delete <strong>' + form.getData().Name + '?</strong></div>',
					buttons: [{
						text: 'Cancel',
						icon: { left: 'fa fa-reply' },
						onclick: _finally
					}, {
						text: 'Delete',
						class: 'orange',
						icon: { left: 'fa fa-trash' },
						onclick: function () {
							$http.delete('/api/artwork/' + $scope.artwork.ID + '/remove')
								.success(success).error(error).finally(_finally);
						}
					}]
				});

			};



			$scope.artworkUploadConfig = {
				folder: 'images',
				accept: 'image/jpeg,image/png',
				success: function (uri, filename) {
					root.find('[name=ImageURI]').val(uri);

					var previewImageURI = '/api/proxy/image/' + encodeURIComponent(uri) + '/500';

					var img = document.createElement('img');
					img.onload = function () {
						$scope.previewImageColours = new ColorThief().getPalette(img, 6);
						$scope.previewImageURI = previewImageURI;
						root.find('[name=ImageColours]').val(JSON.stringify($scope.previewImageColours));
						$scope.forceDigest();
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
				}
			};

		}]
	}
}]);

