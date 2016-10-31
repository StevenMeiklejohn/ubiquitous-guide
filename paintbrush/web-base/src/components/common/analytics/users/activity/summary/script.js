

angular.module('ARN')

.directive('analyticsUsersActivitySummary', ['$location', 'analytics', 'proxyService', function ($location, analytics, proxy) {
	var _dir = 'components/common/analytics/users/activity/summary/';
	return {
		templateUrl: _dir + 'tpl.htm',
		//css: { href: _dir + 'styles.css', preload: true },
		restrict: 'E',
		replace: true,
		scope: {
			config: '='
		},
		controller: function ($scope) {

			var profileID = $scope.$root.activeProfile.ID;

			var init = function () {
				$scope.grid = {
					fetchPage: function(req) {
						return analytics.users.activity.search(profileID, req).then(function (data) {
							data.Data.forEach(function(profile) {
								profile.ImageURI = proxy.image(profile.ImageURI, 180);
								profile.LastActivityStr = DateUtils.format.friendly(profile.LastActivity);
								profile.LastActivityTitle = DateUtils.format.full(profile.LastActivity);
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
								'<div class="total" data-sort="TotalEvents">Total Events</div>' +
								'<div class="details">Event Types</div>' +
								'<div class="last-activity" data-sort="LastActivity">Last Activity</div>' +
							'</div>' +
							'<div class="row body" ng-repeat="item in data" ng-click="config.open(item.ID)">' +
								'<div class="image"><div class="profile-image" ng-if="item.ImageURI" style="background-image: url(\'{{item.ImageURI}}\')"></div></div>' +
								'<div class="name" data-sort-col="Name"><strong>{{item.Name}}</strong><br/>{{item.Type}}</div>' +
								'<div class="total" data-sort-col="TotalEvents">{{item.TotalEvents}}</div>' +
								'<div class="details"><span ng-repeat="evt in item.Events">{{evt.Type}}: <strong>{{evt.Total}}</strong></span></div>' +
								'<div class="last-activity" data-sort-col="LastActivity" title="{{item.LastActivityTitle}}">{{item.LastActivityStr}}</div>' +
							'</div>'
					},
					filters: [
						{
							type: 'list',
							field: 'UserType',
							label: 'User Type',
							options: [{ value: 'Artist' }, { value: 'Consumer' }, { value: 'Gallery' }]
						},
						{ type: 'text', field: 'Name' },
						{ type: 'spacer' },
						{ type: 'pagination' }
					],
					sort: { field: 'LastActivity', direction: 'desc' },
					open: function (id) {
						$location.url('/analytics/users/activity/' + id);
					}
				};
			};

			if (profileID > 0) {
				init();
			}
			else {
				var watcher = $scope.$watch('$root.activeProfile', function(val) {
					if (val && val.ID > 0) {
						profileID = val.ID;
						watcher();
						init();
					}
				});
			}
			
		}
	}
}]);