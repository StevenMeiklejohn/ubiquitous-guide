

angular.module('ARN')

.directive('notificationsSearch', [function () {
	return {
		templateUrl: 'components/common/notifications/search/tpl.htm',
		//controllerAs: 'ctrl',
		//bindToController: true,
		restrict: 'E',
		replace: true,
		controller: ['$scope', '$element', '$sce', '$compile', '$location', 'notification', function ($scope, $element, $sce, $compile, $location, notification) {

			var profileID;

			var filters = {}, sort = {};

			$scope.notifications = [];
			$scope.pagination = { PageSize: 50, PageNumber: 0 };

			notification.list.priorities().then(function (data) { $scope.notificationPriorities = data; });
			notification.list.types().then(function (data) { $scope.notificationTypes = data; });

			var clearSelection = function () {
				if (window.getSelection) {
					window.getSelection().removeAllRanges();
				}
				else if (document.selection) {
					document.selection.empty();
				}
			};
			
			var generatePaginationButtons = function () {
				$scope.paginationButtons = [];

				$scope.pagination.TotalPages = Math.ceil($scope.pagination.TotalResults / $scope.pagination.PageSize);

				var maxButtons = 10,
					start = $scope.pagination.PageNumber - Math.floor(maxButtons / 2),
					end = $scope.pagination.PageNumber + Math.floor(maxButtons / 2);

				if (start < 0) {
					end += (start * -1);
					start = 0;
				}

				if (end >= $scope.pagination.TotalPages) {
					var diff = end - $scope.pagination.TotalPages;

					if (start > 0) {
						start -= diff;
						if (start < 0) {
							start = 0;
						}
					}

					end -= diff;
				}

				for (var i = start; i < end; i++) {
					$scope.paginationButtons.push(i);
				}
			};

			$scope.setPage = function (pageNumber) {

				if (pageNumber >= $scope.pagination.TotalPages) {
					pageNumber = $scope.pagination.TotalPages - 1;
				}
				if (pageNumber < 0) {
					pageNumber = 0;
				}

				if ($scope.pagination.PageNumber !== pageNumber) {
					$scope.pagination.PageNumber = pageNumber;
					$scope.focusFilters();
					$scope.loadPage();
				}

				setTimeout(clearSelection, 500);
			};


			$scope.setPageSize = function (size) {
				$scope.pagination.PageNumber = 0;
				$scope.pagination.PageSize = size < 0 ? 0 : size;
				$scope.focusFilters();
				$scope.loadPage();
			};

			$scope.setFilter = function (type, value, label, $event) {

				var el = $element.find('[data-filter=' + type + ']'),
					lastValue = filters[type],
					changed = lastValue !== value;

				if (typeof lastValue === 'object') {
					changed = JSON.stringify(lastValue) !== JSON.stringify(value);
				}

				var typeLabel = type.replace('ID', '');

				if (value === undefined) {
					delete filters[type];
					el.find('.label .text').html(typeLabel);
				}
				else {
					filters[type] = value;

					if (label) {
						el.find('.label .text').html(typeLabel + ': <strong>' + label + '</strong>');
					}
					else if ($event) {
						el.find('.label .text').html(typeLabel + ': <strong>' + $($event.currentTarget).text() + '</strong>');
					}
				}

				if (changed) {

					$scope.focusFilters();
					$scope.pagination.PageNumber = 0;
					$scope.loadPage();

					updateLocationSearch();
				}
			};

			$scope.focusFilters = function () {
				var page = $(browser.name.toLowerCase() === 'chrome' ? ' body' : 'html, body'),
					top = $element.find('.filters').offset().top - 10,
					dist = page.scrollTop() - top;

				if (dist > 0) {
					page.scrollTop(top);
				}
			};

			$scope.setSort = function (field, label) {

				if (field !== sort.Field) {
					var el = $element.find('.filters .sort');
					el.find('.label .text').text(label || field);

					sort = { Field: field };
					$scope.loadPage();

					updateLocationSearch();
				}

			};

			$scope.openMessage = function (notification) {
				$location.url('/inbox/view/' + notification.ID);
			};

			$scope.loadPage = function () {

				$scope.pendingRequest = true;

				notification.search(profileID, {
					Pagination: $scope.pagination,
					Filters: filters,
					Sort: sort
				})
				.then(function (data) {

					$scope.pendingRequest = false;
					$scope.pagination.TotalResults = data.Pagination.TotalResults;
					generatePaginationButtons();

					var notifications = [];

					data.Data.forEach(function (n) {

						n.DateTitle = DateUtils.format.full(n.SentDate);
						n.Date = DateUtils.format.friendly(n.SentDate) || '-';

						// create short body text containing no html
						var _d = document.createElement('div');
						_d.innerHTML = n.Body.replace(/<\/p>/gi, '</p> ').replace(/>/gi, '> ');
						n.BodyPreview = _d.textContent.substring(0, 250);

						n.Body = $sce.trustAsHtml(n.Body);

						notifications.push(n);
					});

					$scope.notifications = notifications;

				})
				.finally(function () {
					$scope.ready = true;
				})
				.catch(function (err) {
					$scope.error = { type: err.status === 403 ? 'warn' : 'error', message: err.data.Message };
				});

			};


			$scope.$watch('$root.activeProfile', function(val) {
				if (val && val.ID > 0) {
					profileID = $scope.$root.activeProfile.ID;
					notification.list.recipients(profileID).then(function (data) { $scope.recipients = data; });
					$scope.loadPage();
				}
			});



			//
			// Search Filter
			//
			var searchFilter = $element.find('.subject input'),
				searchTimeout,
				applySearchFilter = function () {

					clearTimeout(searchTimeout);

					var value = searchFilter.val(),
						changed = filters['Search'] === undefined && value === '' ? false : filters['Search'] !== value;

					if (value) {
						filters['Search'] = value;
					}
					else {
						delete filters['Search'];
					}

					if (changed) {
						$scope.loadPage();
						updateLocationSearch();
					}
				};

			searchFilter
				.change(applySearchFilter)
				.keyup(function () {
					clearTimeout(searchTimeout);
					searchTimeout = setTimeout(applySearchFilter, 500)
				});






			//
			// view specific routing
			//

			var updateLocationSearch = function () {
				var _p = $scope.pagination || {};

				//$location.search({
				//	filters: JSON.stringify(filters),
				//	sort: sort.Field,
				//	page: _p.PageNumber,
				//	pagesize: _p.PageSize
				//})
			};

			//$scope.$on('ZZZZZ$routeUpdate', function () {
			//
			//	var _s = $location.search(),
			//		_p = $scope.pagination || {};
			//
			//	console.log('update');
			//	console.log(_s);
			//	console.log(Object.keys(_s).length);
			//
			//	if (_s.filters !== JSON.stringify(filters) || _s.page !== _p.PageNumber || _s.pagesize !== _p.PageSize) {
			//		console.warn('CHANGE');
			//
			//		filters = JSON.parse(_s.filters);
			//
			//		if (_s.sort) {
			//			sort.Field = _s.sort;
			//		}
			//
			//		$scope.pagination.PageNumber = _s.page;
			//		$scope.pagination.PageSize = _s.pagesize;
			//
			//
			//
			//
			//		for (var type in filters) {
			//			var el = $element.find('[data-filter=' + type + ']'),
			//				value = filters[type],
			//				label = el.find('.label .text');
			//
			//			// drop down...
			//			if (label.size()) {
			//				label.html(type + ': <strong>' + el.find('[data-value=' + value + ']').text() + '</strong>');
			//			}
			//			// input field
			//			else {
			//				el.find('input:visible').val(value)
			//				console.info(el.find('input'));
			//			}
			//
			//			console.log(el);
			//
			//		}
			//
			//
			//		$scope.loadPage();
			//
			//	}
			//
			//
			//	console.info(JSON.parse(_s.filters));
			//	console.info(_s.sort);
			//
			//});


		}]
	}
}]);

