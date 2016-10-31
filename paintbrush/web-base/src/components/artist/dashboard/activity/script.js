

angular.module('ARN')

.directive('artistDashboardActivity', [function () {
	return {
		templateUrl: 'components/artist/dashboard/activity/tpl.htm',
		controllerAs: 'ctrl',
		bindToController: true,
		scope: {
			config: '='
		},
		controller: ['$scope', '$http', '$element', 'dashboardService', function ($scope, $http, $element, dashboardService) {

			var profileID;

			var error = $scope.error = {};

			// ref to each chart instance
			var chart = {},

			// default chart height in px
			defaultHeight = 295,
				

			// forces a reflow of the visible chart to ensure it fits the tab panel perfectly
			reflow = function () {
				for (var i in chart) {

					// check if chart container element is visible
					if (chart[i].container.clientWidth) {
						chart[i].reflow();
					}
				}
			},

			// trims empty data from the start of data sets
			trimData = function (data, minPoints) {
				var c = 0;
				for (var i in data) {
					if (data[i]) {
						c = (i * 1); break;
					}
				}

				var points = data.length - c;
				if (minPoints && points < minPoints) {
					c -= minPoints - points;
				}

				return data.splice(c);
			},


			// creates time based labels for a data set relative to the current time
			createLabels = function (data, interval) {

				var labels = [],
					now = new Date() * 1,
					interval_ms = (24 * 60 * 60 * 1000);

				switch (interval) {
					case 'week': interval_ms = interval_ms * 7; break;
					case 'month': interval_ms = interval_ms * 30; break;

				}

				// create y axis labels
				for (var i in data) {
					var _d = new Date(now - ((data.length - (i * 1) - 1) * interval_ms));

					labels.push(
						_d.getDate() + ' ' +
						['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][_d.getMonth()] + ' ' +
						_d.getFullYear()
					)

				}

				return labels;
			},

			// pads the start of an array with a specific value	until the array reaches the specified length
			padArray = function(arr, val, length) {
				var temp = [], steps = length - arr.length;
				if (steps > 0) {
					for (var i = 0; i < steps; i++) {
						temp.push(val);
					}
				}
				return temp.concat(arr);
			},


			// init tabs
			tabs = new Tabs($element.find('.tabs'), {
				event: {
					change: reflow
				}
			});
			$scope.$parent.config.showActivity = tabs.show;

			var resizeHandler = function () {
				if (!$element.is(':visible')) {
					$(window).off('resize', resizeHandler);
				}
				else {
					setTimeout(reflow, 10);
					setTimeout(reflow, 100);
				}
			};
			$(window).on('resize', resizeHandler);


			$scope.$watch('$root.activeProfile', function(val) {
				if (val && val.ID > 0) {
					profileID = $scope.$root.activeProfile.ID;


					dashboardService.artwork.interval.views(profileID, 'week', 52)
						.then(function(data) {

							dashboardService.profile.interval.views(profileID, 'week', 52)
								.then(function(data2) {

									data = trimData(data, 15);
									data2 = trimData(data2, data.length);
									data = padArray(data, 0, data2.length);

									var labels = createLabels(data, 'week');

									$(function () {
										chart.views = new Highcharts.Chart({
											chart: {
												renderTo: 'graph-views',
												type: 'areaspline',
												height: defaultHeight
											},
											title: false,
											xAxis: {
												categories: labels
											},
											yAxis: {
												title: {
													text: null
												}
											},
											tooltip: {
												headerFormat: '',
												pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.y}</b><br/>'
											},
											legend: {
												enabled: false
											},
											credits: {
												enabled: false
											},
											series: [{
												color: '#68b981',
												name: 'Artwork Views',
												data: data
											},{
												color: '#68b981',
												name: 'Profile Views',
												data: data2
											}]
										});
									});

									reflow();

									// due to content still loading on page init
									setTimeout(reflow, 10);
									setTimeout(reflow, 100);

									load();
								})

						})
						.catch(function (err) {
							error.views = { type: err.status === 403 ? 'warn' : 'error', message: err.data.Message };
						});

					// load background tabs once visible tab has loaded
					var load = function () {

						dashboardService.artwork.interval.scans(profileID, 'week', 52)
							.then(function(data) {
								data = trimData(data, 15);
								var labels = createLabels(data, 'week');

								$(function () {
									chart.scans = new Highcharts.Chart({
										chart: {
											renderTo: 'graph-scans',
											type: 'areaspline',
											height: defaultHeight
										},
										title: false,
										xAxis: {
											categories: labels
										},
										yAxis: {
											title: {
												text: null
											}
										},
										tooltip: {
											headerFormat: '',
											pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.y}</b><br/>'
										},
										legend: {
											enabled: false
										},
										credits: {
											enabled: false
										},
										series: [{
											color: '#598cba',
											name: 'Scans',
											data: data
										}]
									});
								});

								reflow();

								// due to content still loading on page init
								setTimeout(reflow, 10);
								setTimeout(reflow, 100);

							})
							.catch(function (err) {
								error.scans = { type: err.status === 403 ? 'warn' : 'error', message: err.data.Message };
							});


						dashboardService.artwork.interval.shortlisted(profileID, 'week', 52)
							.then(function(data) {
								data = trimData(data);
								var labels = createLabels(data, 'week');


								$(function () {
									chart.shortlisted = new Highcharts.Chart({
										chart: {
											renderTo: 'graph-shortlisted',
											type: 'areaspline',
											height: defaultHeight
										},
										title: false,
										xAxis: {
											categories: labels
										},
										yAxis: {
											title: {
												text: null
											},
											plotLines: [{
												value: 0,
												width: 1,
												color: '#808080'
											}]
										},
										tooltip: {
											headerFormat: '',
											pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.y}</b><br/>'
										},
										legend: {
											enabled: false
										},
										credits: {
											enabled: false
										},
										series: [{
											color: '#813a84',
											name: 'Shortlisted',
											data: data
										}]
									});
								});


							})
							.catch(function (err) {
								error.shortlisted = { type: err.status === 403 ? 'warn' : 'error', message: err.data.Message };
							});


						dashboardService.artwork.interval.total(profileID, 'week', 52)
							.then(function(data) {
								data = trimData(data, 15);
								var labels = createLabels(data, 'week');


								$(function () {
									chart.artworks = new Highcharts.Chart({
										chart: {
											renderTo: 'graph-total-artworks',
											type: 'areaspline',
											height: defaultHeight
										},
										title: false,
										xAxis: {
											categories: labels
										},
										yAxis: {
											title: {
												text: null
											},
											plotLines: [{
												value: 0,
												width: 1,
												color: '#808080'
											}]
										},
										tooltip: {
											headerFormat: '',
											pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.y}</b><br/>'
										},
										legend: {
											enabled: false
										},
										credits: {
											enabled: false
										},
										series: [{
											color: '#d1ac00',
											name: 'Total Artworks',
											data: data
										}]
									});
								});


							})
							.catch(function (err) {
								error.total = { type: err.status === 403 ? 'warn' : 'error', message: err.data.Message };
							});


						dashboardService.artwork.interval.likes(profileID, 'week', 52)
							.then(function(data) {
								data = trimData(data, 15);
								var labels = createLabels(data, 'week');


								$(function () {
									chart.likes = new Highcharts.Chart({
										chart: {
											renderTo: 'graph-likes',
											type: 'areaspline',
											height: defaultHeight
										},
										title: false,
										xAxis: {
											categories: labels
										},
										yAxis: {
											title: {
												text: null
											},
											plotLines: [{
												value: 0,
												width: 1,
												color: '#808080'
											}]
										},
										tooltip: {
											headerFormat: '',
											pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.y}</b><br/>'
										},
										legend: {
											enabled: false
										},
										credits: {
											enabled: false
										},
										series: [{
											color: '#d14021',
											name: 'Likes',
											data: data
										}]
									});
								});

							})
							.catch(function (err) {
								error.likes = { type: err.status === 403 ? 'warn' : 'error', message: err.data.Message };
							});
					}

				}
			});


		}]
	}
}]);

