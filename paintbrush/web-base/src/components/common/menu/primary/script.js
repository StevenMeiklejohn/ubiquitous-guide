

angular.module('ARN')

.directive('menuPrimary', [function () {
	var _dir = 'components/common/menu/primary/';
	return {
		templateUrl: _dir + 'tpl.htm',
		//css: { href: _dir + 'styles.css', preload: true },
		replace: true,
		controller: ['$scope', '$element', '$state', function ($scope, $element, $state) {

			var toggle = $element.prev(),
				toggleTimeout,
				hideToggle = function () {
					clearTimeout(toggleTimeout);
					$element.css('top', '');
				};

			toggle.click(function () {
				$element.css('top', 'calc(100vh - ' + $element.outerHeight() + 'px)');
				toggleTimeout = setTimeout(hideToggle, 10000);
			});
			$(window).on('scroll', hideToggle);

			$scope.resetActiveProfile = function() {
				$scope.$root.setActiveProfile($scope.$root.userProfile);
				//$location.url('/profile/' + $scope.$root.userProfile.ID);
				$state.reload();
			};

			$scope.tab = '';

			var setTab = function(controller) {
				var _tab = '';
				switch(controller) {
					case 'ActivCanvasDemo':
					case 'ActivCanvasLanding':
						_tab = 'ActivCanvas'; break;

					case 'AnalyticsIndex':
					case 'AnalyticsUsersIndex':
					case 'AnalyticsUsersActivitySummary':
					case 'AnalyticsUsersActivityDetails':
						_tab = 'Analytics'; break;

					case 'ArtistSearch':
						_tab = 'ArtistSearch'; break;

					case 'ArtworkSearch':
					case 'ArtworkDetails':
					case 'ArtworkEdit':
					case 'ArtworkBulkEdit':

					case 'ArtworkManageEditGeneral':
					case 'ArtworkManageIndex':
					case 'ArtworkManageSearch':
						_tab = 'Artwork'; break;

					case 'Dashboard':
						_tab = 'Dashboard'; break;

					case 'Enquiry':
						_tab = 'Enquiry'; break;

					case 'GalleryArtistSearch':
						_tab = 'MyArtists'; break;

					case 'Help':
						_tab = 'Help'; break;

					case 'Inbox':
					case 'InboxView':
						_tab = 'Notifications'; break;

					case 'ProfileOwnView':
					case 'ProfileOwnEdit':
					case 'AccountSettings':
					case 'AuthenticationSettings':
					case 'DeviceSettings':
					case 'NotificationSettings':
					case 'Subscriptions':
					case 'ProfileOwnEditActivCanvas':
					case 'ProfileOwnEditArtist':
					case 'ProfileOwnEditAwards':
					case 'ProfileOwnEditBio':
					case 'ProfileOwnEditContact':
					case 'ProfileOwnEditSocial':
						_tab = 'ProfileOwn';
						break;

					case 'ProfilePublicView':
						_tab = 'ProfilePublic';
						break;

					case 'Shortlists':
					case 'ShortlistDetails':
						_tab = 'Shortlists'; break;

					case 'VideoView':
					case 'VideoEdit':
						_tab = 'Videos'; break;
				}

				if ($scope.tab !== _tab) {
					$scope.tab = _tab;
					$scope.$root.forceDigest();
				}

			};

			$scope.$on('$locationChangeStart', function (e, next) {
				var dest = $state.get(new URL(next).pathname);
				if (dest && dest.controller) {
					setTab(dest.controller)
				}
				hideToggle();
			});

			setTab($state.current.controller);
			setTimeout(function () {
				setTab($state.current.controller);
			}, 100)

		}]
	}
}]);

