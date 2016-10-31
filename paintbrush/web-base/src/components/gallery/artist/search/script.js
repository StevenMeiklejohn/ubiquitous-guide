angular.module('ARN')

.directive('galleryArtistSearch', ['$location', 'artistService', 'proxyService', function ($location, artistService, proxy) {
	var _dir = 'components/gallery/artist/search/';
	return {
		templateUrl: _dir + 'tpl.htm',
		//css: { href: _dir + 'styles.css', preload: true },
		restrict: 'E',
		replace: true,
		scope: {
			config: '='
		},
		controller: function ($scope) {

			var init = function () {
				$scope.grid = {
					fetchPage: function(req) {
						req.Filters.MyArtists = true;

						return artistService.search(req).then(function (data) {
							data.Data.forEach(function(item) {
								if (item.ImageURI) {
									item.ImageURI = proxy.image(item.ImageURI, 180);
								}

								item.ProfileGeneralClass =
									item.ProfileGeneral > 1 ? 'check good' :
									item.ProfileGeneral > 0 ? 'exclamation-triangle warn' : 'times bad';

								item.ProfileArtistClass =
									item.ProfileArtist > 1 ? 'check good' :
									item.ProfileArtist > 0 ? 'exclamation-triangle warn' : 'times bad';

								item.ProfileBiographyClass =
									item.ProfileBiography > 0 ? 'check good' : 'times bad';

								item.ProfileSocialMediaClass =
									item.ProfileSocialMedia > 0 ? 'check good' : 'times bad';


								item.ProfileGeneralTitle = 'General profile information is ' + (
									item.ProfileGeneral > 1 ? 'complete' :
									item.ProfileGeneral > 0 ? 'partially complete' : 'incomplete');

								item.ProfileArtistTitle = 'Artist information is ' + (
									item.ProfileArtist > 1 ? 'complete' :
									item.ProfileArtist > 0 ? 'partially complete' : 'incomplete');

								item.ProfileBiographyTitle = 'Artist biography is ' + (
									item.ProfileBiography > 0 ? 'complete' : 'incomplete');

								item.ProfileSocialMediaTitle = 'Social media information is ' + (
									item.ProfileSocialMedia > 0 ? 'complete (' + item.ProfileSocialMedia + ' profiles)' : 'incomplete');

							});
							return data;
						});
					},
					template: {
						name: 'flex',
						body:
							'<div class="row header">' +
								'<div class="profile-image-spacer"></div>' +
								'<div class="name" data-sort="Name">Name</div>' +
								'<div class="total" data-sort="Artworks">Artworks</div>' +
								'<div class="total" data-sort="Videos">Videos</div>' +
								'<div class="total" data-sort="ProfileGeneral">General</div>' +
								'<div class="total" data-sort="ProfileArtist">Artist</div>' +
								'<div class="total" data-sort="ProfileBiography">Biography</div>' +
								'<div class="total" data-sort="ProfileSocialMedia">Social Media</div>' +
							'</div>' +
							'<div class="row body" ng-repeat="item in data" ng-click="config.setActive(item.ID)">' +
								'<div class="image"><div class="profile-image" ng-if="item.ImageURI" style="background-image: url(\'{{item.ImageURI}}\')"></div></div>' +
								'<div class="name" data-sort-col="Name"><strong>{{item.Name}}</strong></div>' +
								'<div class="total" data-sort-col="Artworks">{{item.Artworks}}</div>' +
								'<div class="total" data-sort-col="Videos">{{item.Videos}}</div>' +
								'<div class="total" data-sort-col="ProfileGeneral" title="{{item.ProfileGeneralTitle}}"><i class="fa fa-lg fa-fw fa-{{item.ProfileGeneralClass}}"></i></div>' +
								'<div class="total" data-sort-col="ProfileArtist" title="{{item.ProfileArtistTitle}}"><i class="fa fa-lg fa-fw fa-{{item.ProfileArtistClass}}"></i></div>' +
								'<div class="total" data-sort-col="ProfileBiography" title="{{item.ProfileBiographyTitle}}"><i class="fa fa-lg fa-fw fa-{{item.ProfileBiographyClass}}"></i></div>' +
								'<div class="total" data-sort-col="ProfileSocialMedia" title="{{item.ProfileSocialMediaTitle}}"><i class="fa fa-lg fa-fw fa-{{item.ProfileSocialMediaClass}}"></i></div>' +
							'</div>'
					},
					filters: [
						{ type: 'text', field: 'Name' },
						{ type: 'spacer' },
						{ type: 'pagination' }
					],
					sort: { field: 'Name', direction: 'asc' },
					setActive: function (id) {
						$scope.$root.setActiveProfileByID(id, function(){
							$location.url('/profile');
						});
					}
				};
			};

			init();

		}
	}
}]);