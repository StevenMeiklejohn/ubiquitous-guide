

angular.module('ARN')

.directive('analyticsUsersActivityDetails', ['$location', 'analytics', 'proxyService', '$stateParams', function ($location, analytics, proxy, $stateParams) {
	return {
		templateUrl: 'components/common/analytics/users/activity/details/tpl.htm',
		restrict: 'E',
		replace: true,
		scope: {
			config: '='
		},
		controller: function ($scope, $element) {

			var userProfileID = $stateParams.profileID,
				activeProfileID = $scope.$root.activeProfile.ID;

			var init = function () {
				analytics.users.activity.details(activeProfileID, userProfileID)
						.then(function(data) {

							var keyOrder = [];
							var groupedEvents = {};

							data.forEach(function (e) {
								if (e.ArtworkImageURI) {
									e.ArtworkImageURI = proxy.image(e.ArtworkImageURI, 90, 50);
								}
								if (e.ArtistImageURI) {
									e.ArtistImageURI = proxy.image(e.ArtistImageURI, 180);
								}
								if (e.ProfileImageURI) {
									e.ProfileImageURI = proxy.image(e.ProfileImageURI, 180);
								}

								if (e.BrowserName) {
									var bicon = e.BrowserName.toLowerCase();
									switch (bicon) {
										case 'firefox mobile': bicon = 'firefox'; break;
										case 'chrome mobile': bicon = 'chrome'; break;
										case 'mobile safari uiwebview':
										case 'mobile safari': bicon = 'safari'; break;
									}
									e.BrowserIcon = bicon.replace(/ /g, '-') + '-32.png';
								}

								if (e.BrowserVersion) {
									var parts = e.BrowserVersion.split('.');
									if (parts.length > 2) {
										e.BrowserVersionShort = parts.slice(0,2).join('.')
									}
									else {
										e.BrowserVersionShort = e.BrowserVersion;
									}
								}

								if (e.DeviceType) {
									var dicon = 'question';
									switch (e.DeviceType.toLowerCase()) {
										case 'computer': dicon = 'laptop'; break;
										case 'mobile': dicon = 'mobile'; break;
										case 'tablet': dicon = 'tablet'; break;
										case 'tv': dicon = 'tv'; break;
									}
									e.DeviceTypeIcon = dicon;
								}


								e.OwnProfile =  $scope.$root.activeProfile.ID === e.ArtistProfileID || $scope.$root.activeProfile.ID === e.ProfileID;

								var time = DateUtils.format.time(e.Date).split(':');
								e.Time = time[0] + ':' + time[1];
								e.TimeS = time[2];


								var key = DateUtils.format.short(e.Date);
								if (keyOrder.indexOf(key) < 0) {
									keyOrder.push(key);
									groupedEvents[ key ] = groupedEvents[ key ] || [];
								}
								groupedEvents[key].push(e);
							});

							console.info(groupedEvents);

							$scope.keys = keyOrder;
							for (var i in groupedEvents) {
								groupedEvents[i] = groupedEvents[i].reverse();
							}

							$scope.groupedEvents = groupedEvents;
						})
						.catch(function(err) {
							$scope.error = { type: err.status === 403 ? 'warn' : 'error', message: err.data.Message };
						});
			};

			if (activeProfileID > 0) {
				init();
			}
			else {
				var watcher = $scope.$watch('$root.activeProfile', function(val) {
					if (val.ID > 0) {
						activeProfileID = val.ID;
						watcher();
						init();
					}
				});
			}
		}
	}
}]);

