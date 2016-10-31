angular.module('ARN')

.directive('artworkManageSearch', ['$location', '$q', 'artworkService', 'materialsService', 'proxyService', 'videoService', 'websocket', 'watchService',
					function ($location, $q, artworkService, materialsService, proxy, videoService, websocket, watchService) {

	var _dir = 'components/common/artwork/manage/search/';
	return {
		templateUrl: _dir + 'tpl.htm',
		//css: { href: _dir + 'styles.css', preload: true },
		restrict: 'E',
		replace: true,
		scope: {
			profile: '='
		},
		controller: function ($scope) {

			var profile,
				materials,
				styles,
				subjects,
				types,
				videos;

			var init = function () {
				$scope.grid = {
					fetchPage: function(req) {
						if (profile.Gallery) {
							req.Filters[ 'MyArtists' ] = true;
						}
						else {
							req.Filters[ 'ArtistProfileID' ] = profile.ID;
						}

						return artworkService.search(req).then(function (data) {
							data.Data.forEach(function(item) {
								if (item.ImageURI) {
									item.ImageURI = proxy.image(item.ImageURI, 90, 50);
								}
								if (item.ProfileImageURI) {
									item.ProfileImageURI = proxy.image(item.ProfileImageURI, 180);
								}
								item.LastUpdated = DateUtils.format.friendly(item.updated_at);
								item.LastUpdatedFull = DateUtils.format.full(item.updated_at);
								item.ActivatedClass = item.Activated ? 'check good' : 'times bad';
								item.ShareableClass = item.Shareable ? 'check good' : 'times bad';

								item.ActivatedTitle = 'This artwork is currently ' + (item.Activated ? '' : 'un') + 'activated';
								item.ProcessingTitle =
										'This image is currently being processed.\n\n' +
										'This may take some time if this is the first time the image has been activated.\n\n' +
										'In order to get the best possible tracking rating the image will be processed several times using different image filters to enhance the contrast of the image.\n\n' +
										'Images that are easy to track will take much less time, images that are difficult to track may need to be processed 3 or 4 times to get a star rating.';

								if (item.NoVideo) {
									item.VideoName = 'No Video';
								}
								else if (item.VideoID === null) {
									if (profile.ActivCanvas.StatusID === 3) {
										item.VideoName = 'Default: ' + (profile.ActivCanvas.VideoID ? profile.ActivCanvas.VideoName : 'No Video');
									}
									else {
										item.VideoName = 'No Video';
									}
								}
							});
							return data;
						});
					},
					template: {
						name: 'table',
						header:
							'<tr>' +
								'<th class="image"></th>' +
								'<th class="name" data-sort="Name">Name</th>' +
								(!profile.Gallery ? '' :
									'<th class="artist-image"></th>' +
									'<th data-sort="ArtistName" class="artist-name">Artist</th>'
								) +
								'<th class="type" data-sort="Type">Type</th>' +
								'<th class="activated" data-sort="Activated">Activated</th>' +
								'<th class="rating" data-sort="TrackingRating">Tracking Rating</th>' +
								'<th class="video" data-sort="VideoName">Video</th>' +
								'<th class="shareable" data-sort="Shareable">Shareable</th>' +
								//'<th class="products" data-sort="AvailableProducts">Products</th>' +
								'<th class="last-updated" data-sort="LastUpdated">Last Updated</th>' +
								'<th class="actions"></th>' +
							'</tr>',
						body:
							'<tr class="row body" ng-repeat="item in data" ng-click="config.viewArtwork(item.ID, $event)">' +
								'<td class="image" style="height: {{item.MinHeight}}px"><img ng-src="{{item.ImageURI}}" /></td>' +
								'<td class="name" data-sort-col="Name"><strong>{{item.Name}}</strong></td>' +
								(!profile.Gallery ? '' :
									'<td class="artist-image"><div class="profile-image" ng-if="item.ProfileImageURI" style="background-image: url(\'{{item.ProfileImageURI}}\')"></div></td>' +
									'<td class="artist-name" data-sort-col="ArtistName">{{item.ArtistName}}</td>'
								) +
								'<td class="type" data-sort-col="Type">{{item.Type}}</td>' +
								'<td class="activated" data-sort-col="Activated">' +
									'<div ng-if="item.SyncRequired" class="ajax-loader" title="{{item.ProcessingTitle}}"></div>' +
									'<i ng-if="!item.SyncRequired" class="fa fa-lg fa-fw fa-{{item.ActivatedClass}}" title="{{item.ActivatedTitle}}"></i>' +
								'</td>' +
								'<td class="rating" data-sort-col="TrackingRating"><i class="fa fa-star{{i <= item.TrackingRating ? \'\' : \'-o\'}}" ng-repeat="i in [1,2,3,4,5]"></i></td>' +
								'<td class="video" data-sort-col="VideoName">{{item.VideoName}}</td>' +
								'<td class="shareable" data-sort-col="Shareable"><i class="fa fa-lg fa-fw fa-{{item.ShareableClass}}"></i></td>' +
								//'<td class="products" data-sort-col="AvailableProducts" title="{{item.AvailableProducts}} products available for sale\n{{item.TotalProducts}} products in total">{{item.AvailableProducts}}/{{item.TotalProducts}}</td>' +
								'<td class="last-updated" data-sort-col="LastUpdated" title="{{item.LastUpdatedFull}}">{{item.LastUpdated}}</td>' +
								'<td class="actions"><a class="button light-blue no-text" title="Edit" ng-click="config.viewArtwork(item.ID)"><i class="fa fa-pencil fa-lg"></i></a></td>' +
							'</tr>'
					},

					filters: [
						{ type: 'text', field: 'Name', label: 'Artwork Name' },
						!profile.Gallery ? undefined :
						{ type: 'text', field: 'ArtistName', label: 'Artist Name' },
						types.length < 2 ? undefined :
						{ type: 'list', field: 'TypeID', label: 'Type', options: types },
						materials.length < 2 ? undefined :
						{ type: 'list', field: 'MaterialID', label: 'Material', options: materials },
						styles.length < 2 ? undefined :
						{ type: 'list', field: 'StyleID', label: 'Style', options: styles },
						subjects.length < 2 ? undefined :
						{ type: 'list', field: 'SubjectID', label: 'Subject', options: subjects },
						{ type: 'list', field: 'Activated', options: [{ label: 'Yes', value: true }, { label: 'No', value: false }] },
						profile.ActivCanvas.StatusID !== 3 || videos.length < 2 ? undefined :
						{ type: 'list', field: 'VideoID', label: 'Video', options: videos },
						{ type: 'spacer' },
						{ type: 'pagination' }
					],
					sort: { field: 'LastUpdated', direction: 'desc' },
					//editArtwork: function (artworkID) {
					//	$location.url('/artwork/edit/' + artworkID);
					//},
					viewArtwork: function (artworkID, event) {
						//var target = $(event.target);
						//if (!(target.hasClass('actions') || target.parents().hasClass('actions'))) {
							$location.url('/artwork/manage/' + artworkID);
						//}
					}
				};

			};


			//
			var activationListener = function(resp) {
				if ($scope.grid && $scope.grid.data) {
					$scope.grid.data.forEach(function(item) {
						if (item.ID === resp.ArtworkID) {
							item.TrackingRating = resp.TrackingRating;
							item.SyncRequired = resp.SyncRequired;
							item.Activated = resp.Activated;
							item.ActivatedClass = item.Activated ? 'check good' : 'times bad';
							$scope.$root.forceDigest();
						}
					})
				}
			};
			websocket.on('artwork/activation', activationListener);
			$scope.$on("$destroy", function () {
				websocket.off('artwork/activation', activationListener);
			});


			watchService($scope).watch('profile', 'ID').then(function (_profile) {
				profile = _profile;

				$q.all([
					materialsService.list(profile.ID).then(function (data) {
						materials = data.map(function (m) {
							return { label: m.Name, value: m.ID };
						});
					}),
					artworkService.types(profile.ID).then(function (data) {
						types = data.map(function (t) {
							return { label: t.Type, value: t.ID };
						});
					}),
					artworkService.styles(profile.ID).then(function (data) {
						styles = data.map(function (s) {
							return { label: s.Style, value: s.ID };
						});
					}),
					artworkService.subjects(profile.ID).then(function (data) {
						subjects = data.map(function (s) {
							return { label: s.Subject, value: s.ID };
						});
					}),
					videoService.list(profile.ID).then(function (data) {
						videos = data.map(function (v) {
							return { label: v.Name, value: v.ID };
						});
					})
				])
				.then(init);
			});

		}
	}
}]);