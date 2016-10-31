

angular.module('ARN')

.directive('notificationsSearch', [function () {
	var _dir = 'components/common/notifications/search/';
	return {
		templateUrl: _dir + 'tpl.htm',
		//css: { href: _dir + 'styles.css', preload: true },
		restrict: 'E',
		replace: true,
		controller: ['$scope', '$location', '$q', 'notification', function ($scope, $location, $q, notification) {

			var profile = $scope.$root.activeProfile;
			var types = [];


			var init = function () {
				$scope.grid = {
					fetchPage: function(req) {
						return notification.search(profile.ID, req).then(function(data) {
							data.Data.forEach(function (row) {
								row.SentTitle = DateUtils.format.full(row.SentDate);
								row._SentDate = DateUtils.format.friendly(row.SentDate);

								var _d = document.createElement('div');
								_d.innerHTML = row.Body.replace(/<\/p>/gi, '</p> ').replace(/>/gi, '> ');
								row.BodyPreview = _d.textContent.substring(0, 250);

								switch (row.TypeID) {
									case 1: row.Icon = 'tasks'; row.IconTitle = 'Task'; break;
									case 2: row.Icon = 'info'; row.IconTitle = 'Information'; break;
									case 4: row.Icon = 'link'; row.IconTitle = 'Connection Request'; break;
									case 5: row.Icon = 'plus-circle'; row.IconTitle = 'ActivCanavas'; break;
									default: row.Icon = 'envelope'; row.IconTitle = 'Message';
								}
							});
							return data;
						});
					},
					template: {
						name: 'table',
						header:
							'<tr>' +
								'<th class="icons" data-sort="Type">Type</th>' +
								'<th class="content no-pad"><span data-sort="Subject">Subject</span></th>' +
								'<th class="importance" data-sort="PriorityDescription">Importance</th>' +
								'<th class="date" data-sort="Date">Sent</th>' +
							'</tr>',
						body:
							'<tr ng-repeat="item in data" ng-click="config.open(item.ID)" class="{{item.ReadDate ? \'\' : \'un\'}}read">' +
								'<td class="icons"><i class="fa fa-fw fa-{{item.Icon}}" title="{{item.IconTitle}}"></i></td>' +
								'<td class="content"><span class="subject">{{item.Subject}}</span><span ng-if="item.BodyPreview" class="body-preview">{{item.BodyPreview}}</span></td>' +
								'<td class="importance">{{item.PriorityDescription}}</td>' +
								'<td class="date"><span title="{{item.SentTitle}}">{{item._SentDate}}</span></td>' +
							'</tr>'
					},
					filters: [
						{
							type: 'list',
							field: 'Read',
							options: [{ label: 'Yes', value: true }, { label: 'No', value: false }]
						},
						{ type: 'list', field: 'TypeID', label: 'Type', options: types },
						{
							type: 'list',
							field: 'Importance',
							options: [{ label: 'Low', value: 2 }, { label: 'General', value: 3 }, { label: 'High', value: 4 }]
						},
						{ type: 'text', field: 'Search' },
						{ type: 'spacer' },
						{ type: 'pagination' }
					],
					sort: { field: 'Date', direction: 'desc' },
					open: function (id) {
						$location.url('/inbox/view/' + id);
					}
				};
			};


			// ensure active profile is set	before loading component
			var loadProfile = function () {
				var d = $q.defer();

				if (profile.ID && profile.ID > 0) {
					d.resolve();
				}
				else {
					var watcher = $scope.$watch('$root.activeProfile', function(val) {
						if (val && val.ID > 0) {
							watcher();
							profile = val;
							d.resolve();
						}
					});
				}

				return d.promise;
			};


			$q.all([
				loadProfile(),

				notification.list.types().then(function (data) {
					types = data.map(function (p) {
						return { label: p.Type, value: p.ID };
					});
				})
			]).then(init);

		}]
	}
}]);

