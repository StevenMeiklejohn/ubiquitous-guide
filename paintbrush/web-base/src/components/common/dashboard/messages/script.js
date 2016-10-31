

angular.module('ARN')

.directive('dashboardMessages', [function () {
	return {
		templateUrl: 'components/common/dashboard/messages/tpl.htm',
		restrict: 'E',
		replace: true,
		scope: {
			config: '='
		},
		controller: ['$scope', '$http', '$element', '$sce', 'dashboardService', 'notification', function ($scope, $http, $element, $sce, dashboardService, notification) {

			var profileID;

			$scope.$watch('$root.activeProfile', function(val) {
				if (val && val.ID > 0) {
					console.log(val);
					profileID = $scope.$root.activeProfile.ID;
					refreshMessages();

					dashboardService.customers.mostActive(profileID).then(function () {
						console.log(arguments)
					})
				}
			});

			var refreshMessages = function () {
				dashboardService.notifications(profileID)
					.then(function(data) {

						data.forEach(function (m) {
							m.Body = $sce.trustAsHtml(m.Body + (m.Tasks ? '<p><a href="/inbox/' + m.ID + '">View Details</a></p>' : ''));

							if (m.Tasks) {
								m.TasksComplete = m.Tasks.filter(function (t) { return t.Complete }).length;

								setTimeout(function () {

									var _data = [];
									m.Tasks.sort(function (task) {
										return task.Complete ? -1 : 1;
									}).forEach(function (task) {
										_data.push({
											name: task.Description,
											y: 1,
											color: task.Complete ? '#68b981' : '#ddd'
										})
									});


									var test = new Highcharts.Chart({
										chart: {
											renderTo: $element.find('.chart')[0],
											plotBackgroundColor: null,
											plotBorderWidth: 0,
											plotShadow: false,
											height: 100,
											width: 100
										},
										plotOptions: {
											pie: {
												dataLabels: {
													enabled: false
												},
												states: {
													hover: {
														halo: false
													}
												},
												size: '200%'
											}
										},
										series: [{
											type: 'pie',
											innerSize: '70%',
											data: _data
											//data: [
											//	{ name: 'Complete', y: m.TasksComplete, color: '#68b981' },
											//	{ name: 'Incomplete', y: m.Tasks.length - m.TasksComplete, color: '#ddd' }
											//]
										}],


										title: false,
										//tooltip: { enabled: false },

										tooltip: {
											useHTML: true,
											shared: false,
											enabled: true,
											backgroundColor: 'none',
											formatter: function (a) {
												return '<div class="tooltip" style="margin-top:' + this.point.tooltipPos[1] + 'px;border-color:' + this.point.color + ';">' + this.point.name + '</div>';
											}
										},

										legend: {
											enabled: false
										},
										credits: {
											enabled: false
										}
									});
								}, 100)


							}
						});

						$scope.messages = data;
					})
					.catch(function (err) {
						$scope.error = { type: err.status === 403 ? 'warn' : 'error', message: err.data.Message };
					});
			};

			$scope.markAsRead = function (id) {
				notification.markAsRead(id).then(refreshMessages);
			}

		}]
	}
}]);

