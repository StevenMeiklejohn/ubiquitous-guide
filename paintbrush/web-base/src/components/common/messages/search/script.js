

angular.module('ARN')

.directive('messagesSearch', [function () {
	return {
		templateUrl: 'components/common/messages/search/tpl.htm',
		restrict: 'E',
		replace: true,
		controller: ['$scope', 'notification', function ($scope, notification) {

			//var priorities = [];
			//notification.list.priorities().then(function (data) {
			//	data.forEach(function (p) {
			//		priorities.push({ label: p.Description, value: p.ID });
			//	});
			//});


			var init = function () {
				$scope.grid = {
					fetchPage: function(req) {
						return notification.search($scope.$root.activeProfile.ID, req).then(function(data) {
							data.Data.forEach(function (row) {
								row.SentTitle = DateUtils.format.full(row.SentDate);
								row._SentDate = DateUtils.format.friendly(row.SentDate);

								var _d = document.createElement('div');
								_d.innerHTML = row.Body.replace(/<\/p>/gi, '</p> ').replace(/>/gi, '> ');
								row.BodyPreview = _d.textContent.substring(0, 250);
							});
							return data;
						});
					},
					template: {
						name: 'table',
						header:
							'<tr>' +
								'<th class="icons"></th>' +
								'<th class="recipient" data-sort="Recipient">Recipient</th>' +
								'<th class="content" data-sort="Subject">Subject</th>' +
								'<th class="date" data-sort="Date">Sent</th>' +
							'</tr>',
						body:
							'<tr ng-repeat="item in data">' +
								'<td class="icons"><i class="fa fa-fw fa-envelope p-4" title="Message"></i></td>' +
								'<td class="recipient">{{item.Recipient}}</td>' +
								'<td class="content"><span class="subject">{{item.Subject}}</span><span ng-if="item.BodyPreview" class="body-preview">{{item.BodyPreview}}</span></td>' +
								'<td class="date"><span title="{{item.SentTitle}}">{{item._SentDate}}</span></td>' +
							'</tr>'
					},
					filters: [
						{
							type: 'list',
							field: 'Read',
							options: [{ label: 'Yes', value: true }, { label: 'No', value: false }]
						},
						//{
						//	type: 'list',
						//	field: 'Importance',
						//	options: [{ label: 'Low', value: 2 }, { label: 'General', value: 3 }, { label: 'High', value: 4 }]
						//}

						{ type: 'text', field: 'Search' },
						{ type: 'spacer' },
						{ type: 'pagination' },
						{ type: 'sort' }
					],
					sort: { field: 'Date', direction: 'desc' }
				};
			};

			if ($scope.$root.activeProfile.ID > 0) {
				init();
			}
			else {
				var watcher = $scope.$watch('$root.activeProfile', function(val) {
					if (val && val.ID > 0) {
						watcher();
						init();
					}
				});
			}

		}]
	}
}]);

