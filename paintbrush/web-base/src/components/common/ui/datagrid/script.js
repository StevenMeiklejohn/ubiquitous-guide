(function(){

angular.module('ARN')
	.directive('uiDatagrid', ['$compile', '$state', function ($compile, $state) {
		var _dir = 'components/common/ui/datagrid/';
		return {
			templateUrl: _dir + 'tpl.htm',
			//css: { href: _dir + 'styles.css', preload: true },
			restrict: 'E',
			replace: true,
			scope: {
				config: '='
			},
			link: function ($scope, $element) {
				var config = $scope.config;

				var sort = $scope.sort = {},
					pagination = $scope.pagintaion = { TotalPages: 0 },
					filters = $scope.filters = {},
					filterValueLabels = $scope.filterValueLabels = {},
					initialLoad = true,
					manageState = true,
					replaceState = false,
					restoringState = false,
					updatingState = false;


				var cloneObject = function (o) {
					return JSON.parse(JSON.stringify(o))
				};


				var	nextPage = function () {
					pagination.PageNumber += 1;
					$scope.pagination = pagination;
					loadPage();
				};

				//
				// Loads a new page of data based on the current pagination settings
				//
				var	loadPage = function () {
					if (!config.fetchPage) {
						console.warn('fetchPage not defined')
					}
					else {
						$scope.pendingRequest = true;

						if (manageState && (!restoringState || replaceState)) {
							updatingState = true;

							$state.go($state.current.name, angular.extend({}, $state.params, {
								ps: pagination.PageSize,
								pn: pagination.PageNumber,
								sf: sort.Field,
								sd: sort.Direction,
								ft: Object.keys(filters).length ? filters : undefined
							}) ,{
								notify: true,
								inherit: false,
								location: (replaceState ? 'replace' : true)
							});
						}
						replaceState = false;
						restoringState = false;

						config.fetchPage({
							Pagination: { PageSize: pagination.PageSize, PageNumber: pagination.PageNumber },
							Filters: cloneObject(filters),
							Sort: cloneObject(sort)
						})
						.then(function (resp) {
							if (resp.Pagination) {
								pagination.TotalResults = resp.Pagination.TotalResults;
								generatePaginationButtons();
							}

							$scope.message = undefined;
							$scope.data = config.data = resp.Data;

							var templateHTML = '';

							if (config.template) {
								switch(config.template.name) {
									case 'json':
										templateHTML = '<div ng-repeat="item in data">{{item}}</div>';
										break;

									case 'table':
										templateHTML =
											'<table>' +
												(config.template.header ? '<thead>' + config.template.header + '</thead>': '') +
												(config.template.body ? '<tbody>' + config.template.body + '</tbody>': '') +
												(config.template.footer ? '<tfoot>' + config.template.footer + '</tfoot>': '') +
											'</table>';
										break;

									default:
										templateHTML = config.template.body;
										break;
								}
							}

							var container = $element.find('.results');

							// append compiled template for the current page
							container.html($compile(templateHTML)($scope));
							$scope.$root.forceDigest(function () {

								// connect up sort triggers
								container.find('[data-sort]').each(function () {
									var el = $(this), field = el.data('sort'),
										dir = sort.Direction === 'desc' ? 'down' : 'up';

									if (field === sort.Field) {
										el.addClass('sorted').wrapInner('<span/>').append('<i class="fa fa-fw fa-lg fa-caret-' + dir + '"></i>');
										container.find('[data-sort-col="' + field + '"]').addClass('sorted');
									}

									el.addClass('sortable').on('click', function () {
										setSort(field);
									})
								});

								if (!initialLoad) {
									focusFilters();
								}
								initialLoad = false;
							});

						})
						.finally(function () {
							$scope.pendingRequest = false;
						})
						.catch(function (err) {
							$scope.message = { type: err.status === 403 ? 'warn' : 'error', message: err.data.Message };
						});
					}
				};


				var generatePaginationButtons = function () {
					pagination.TotalPages = Math.ceil(pagination.TotalResults / pagination.PageSize);

					var maxButtons = pagination.MaxButtons,
						currentPage = pagination.PageNumber,
						totalPages = pagination.TotalPages,
						start = currentPage - Math.floor(maxButtons / 2),
						end = currentPage + Math.floor(maxButtons / 2),
						buttons = [];

					if (start < 0) {
						end += (start * -1);
						start = 0;
					}

					if (end >= totalPages) {
						var diff = end - totalPages;

						if (start > 0) {
							start -= diff;
							if (start < 0) {
								start = 0;
							}
						}

						end -= diff;
					}

					for (var i = start; i < end; i++) {
						buttons.push(i);
					}

					if (currentPage > 49) {
						buttons.splice(0, 1, currentPage - 50);
					}
					if (currentPage < totalPages - 50) {
						buttons.splice(buttons.length-1, 1, currentPage + 50);
					}

					$scope.paginationButtons = buttons;
					$scope.pagination = pagination;
				};


				//
				// Clears any text selection
				//
				var clearSelection = function () {
					if (window.getSelection) {
						window.getSelection().removeAllRanges();
					}
					else if (document.selection) {
						document.selection.empty();
					}
				};




				//
				// Sets the current page
				//
				var setPage = $scope.setPage = function (pageNumber) {

					if (pageNumber >= pagination.TotalPages) {
						pageNumber = pagination.TotalPages - 1;
					}
					if (pageNumber < 0) {
						pageNumber = 0;
					}

					pagination.PageNumber = pageNumber;
					$scope.pagination = pagination;
					loadPage();

					clearSelection();
					setTimeout(clearSelection, 100);
					setTimeout(clearSelection, 500);
				};


				//
				// Sets the current page size
				//
				var setPageSize = $scope.setPageSize = function (size) {
					pagination.PageNumber = 0;
					pagination.PageSize = size < 1 ? 1 : size;
					$scope.pagination = pagination;
					loadPage();
				};



				// generates filter html
				var buildFilters = function () {
					var container = $element.find('.filters'), html = '';

					(config.filters || []).forEach(function(f, i, filters) {
						var label = (f.label || f.field),
							cls = i === filters.length - 1 ? 'last' : '';

						switch (f.type) {
							case 'list':
								html +=
									'<div class="wrap list">' +
										'<a class="filter ' + cls + '" data-filter="' + f.field + '">' +
										'<span class="label">' +
											'<span data-text="' + label + '" class="text">' + label + '<strong ng-show="filterValueLabels[\'' + f.field + '\']">: {{filterValueLabels[\'' + f.field + '\']}}</strong></span>' +
											'<i class="fa fa-chevron-right"></i><i class="fa fa-chevron-down"></i>' +
										'</span>' +
										'<ul class="options">' +
											'<li ng-click="setFilter(\'' + f.field + '\')">Any</li>' +
											'<li ng-repeat="f in config.filters[' + i + '].options" ng-click="setFilter(\'' + f.field + '\', f.value)">{{f.label || f.value}}</li>' +
										'</ul>' +
										'</a>' +
									'</div>';
								break;

							case 'text':
								html +=
									'<div class="wrap text">' +
										'<input class="filter ' + cls + '" title="' + label + '" name="' + f.field + '" placeholder="' + label + '" data-filter="' + f.field + '" data-type="text" ng-value="filters[\'' + f.field + '\']" />' +
										'<i class="fa fa-search"></i>' +
									'</div>';
								break;

							case 'pagination':
								html +=
									'<div class="wrap pagesize">' +
										'<a class="filter ' + cls + '">' +
											'<span class="label"><span class="text">{{pagination.PageSize}} Results</span><i class="fa fa-chevron-right"></i><i class="fa fa-chevron-down"></i></span>' +
											'<ul class="options">' +
												'<li ng-repeat="p in [10,20,30,50,100]" ng-click="setPageSize(p)">{{p}} Results</li>' +
											'</ul>' +
										'</a>' +
									'</div>';
								break;

							case 'sort':
								html +=
									'<div class="wrap sort">' +
										'<a class="filter ' + cls + '">' +
										'<span class="label"><span class="text">{{sort.Field}}</span><i class="fa fa-chevron-right"></i><i class="fa fa-chevron-down"></i></span>' +
										'<ul class="options">' +
											'<li ng-repeat="f in config.filters[' + i + '].options" ng-click="setSort(\'' + f.field + '\', \'' + f.field + '\')">{{f.label}}</li>' +
										'</ul>' +
										'</a>' +
									'</div>';
								break;

							case 'spacer':
								html += '<div class="spacer"></div>';
								break;
						}
					});

					container.html('').append($compile(html)($scope));

					$scope.$root.forceDigest(initFilterWidgets);
				};


				//
				// Initialises any filter widgets
				//
				var initFilterWidgets = function () {

					// free text filters
					var textTimeout,
						applyTextFilter = function () {
							clearTimeout(textTimeout);

							var field = $(this).data('filter'),
								value = $(this).val();

							setFilter(field, value);
						};

					$element.find('.filters .wrap.text > input')
						.change(applyTextFilter)
						.keyup(function () {
							var self = this;
							textTimeout = setTimeout(function() {
								applyTextFilter.call(self);
							}, 500)
						});

				};



				//
				// Scrolls the browser window to the top of the filters
				//
				var _focusFilters = function () {
					var page = $(browser.name.toLowerCase() === 'chrome' ? ' body' : 'html, body'),
						top = $element.find('.filters').offset().top - 10;
					page.scrollTop(top);
				};
				var focusFilters = function () {
					_focusFilters();
					setTimeout(_focusFilters, 25);
					setTimeout(_focusFilters, 75);
				};


				//
				// Sets a new filter value
				//
				var setFilter = $scope.setFilter = function (field, value, noReload) {

					var lastValue = filters[field],
						hasChanged = lastValue !== value;

					if (typeof lastValue === 'object') {
						hasChanged = JSON.stringify(lastValue) !== JSON.stringify(value);
					}

					// ensure when restoring a previous state text fields contain the correct value
					if (hasChanged || value === undefined) {
						$element.find('input[data-filter="' + field + '"]').val(value === undefined ? '' : value);
					}

					if (value === undefined) {
						delete filters[field];
						delete filterValueLabels[field];
					}
					else {
						filters[field] = value;

						// find options for current filter field, grab label text for value
						(config.filters || []).some(function(f) {
							if (f.field === field) {

								(f.options || []).some(function (o) {
									if (o.value === value) {
										filterValueLabels[field] = o.label || o.value;
										return true;
									}
								});
								return true;
							}
						});

					}

					$scope.filters  = filters;
					$scope.filterValueLabels  = filterValueLabels;

					if (hasChanged && !noReload) {
						setPage(0);
					}
				};


				var setSort = function (field, direction) {
					if (sort.Field === field) {
						sort.Direction = direction ? direction : sort.Direction === 'asc' ? 'desc' : 'asc';
					}
					else {
						sort = {
							Field: field,
							Direction: direction ? direction : 'asc'
						};
					}

					$scope.sort = sort;
					loadPage();
				};


				var init = function () {
					initialLoad = true;
					manageState = config.state !== false;

					var stateParams = $state.params;

					// if a state already exists set restoringState = true to prevent a duplicate state being created
					if (stateParams.pn !== undefined) {
						restoringState = true;
					}
					// otherwise replace existing state (page load before grid was ready)
					else {
						replaceState = true;
					}

					// set initial sort field
					var _s = config.sort || {};
					sort = $scope.sort = {
						Field: stateParams.sf || _s.field,
						Direction: stateParams.sd || _s.direction
					};

					// set initial pagination settings
					var _p = config.pagination || {};
					pagination = $scope.pagintaion = angular.extend({
						PageSize: stateParams.ps || _p.pageSize || 10,
						PageNumber: stateParams.pn || 0,
						MaxButtons: _p.maxButtons || 10
					}, pagination);

					// remove empty filters from config
					config.filters = (config.filters || []).filter(function (f) {
						return f;
					});

					// set initial filter settings
					for (var key in (stateParams.ft || {})) {
						setFilter(key, stateParams.ft[key], true);
					}

					// generate filter html
					buildFilters();

					// set no results message text
					$scope.noResults = { message: config.noResults || 'No results found.' };

					// expose private methods to parent component
					config.focusFilters = focusFilters;
					config.nextPage = nextPage;
					config.setFilter = setFilter;
					config.setPage = setPage;
					config.setPageSize = setPageSize;
					config.setSort = setSort;

					// let parent component know all public methods are available
					config.ready = true;

					// load first page
					loadPage();

					if (manageState) {

						// set up state change listener
						// note: $stateChangeStart does not fire when reloadOnSearch = false so use $locationChangeSuccess instead
						$scope.$on('$locationChangeSuccess', function(){

							if (!updatingState) {
								restoringState = true;

								sort = $scope.sort = {
									Field: stateParams.sf || sort.field,
									Direction: stateParams.sd || sort.direction
								};

								pagination = $scope.pagintaion = angular.extend(pagination, {
									PageSize: stateParams.ps !== undefined ? stateParams.ps : pagination.PageSize,
									PageNumber: stateParams.pn !== undefined ? stateParams.pn : pagination.PageNumber
								});

								filters = {};
								(config.filters || []).forEach(function (f) {
									setFilter(f.field, (stateParams.ft || {})[f.field], true);
								});

								loadPage();
							}

							updatingState = false;
						});

					}

					// fix for chrome loss of input focus bug
					if (browser.chrome && (config.filters || []).length) {
						var focusInterval = setInterval(function () {
							var el = $element.find('input:focus');
							if (el[0]) {
								el.focus().val(el.val());
							}
						}, 25);

						$scope.$on("$destroy", function () {
							clearInterval(focusInterval);
						});
					}

				};

				if (config) {
					init();
				}
				else {
					var watcher = $scope.$watch('config', function(val) {
						if (val) {
							watcher();
							config = $scope.config;
							init();
						}
					})
				}
			}
		}
	}])
})();