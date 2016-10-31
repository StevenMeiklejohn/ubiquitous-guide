

angular.module('ARN')
.directive('artworkGrid', ['proxyService', function (proxy) {
	return {
		templateUrl: 'components/common/artwork/grid/tpl.htm',
		controllerAs: 'ctrl',
		bindToController: true,
		controller: ['$scope', '$element', function ($scope, root) {

			var me = $scope.artworkGrid = {};
			me.message = {
				noResults: { message: 'No artwork found' }
			};
			me.artistDetails = true;

			var _conf = root.attr('config');
			if (_conf && $scope[_conf]) {
				angular.extend(me, $scope[_conf]);
				$scope[_conf].instance = me;
			}

			var colHeights = [],								// keep track of column heights
				targetColWidth = 262,							// this is our target column width in px

			// sets number of columns based on page width
			setColumns = function (complete) {
				me.columns = [];
				colHeights = [];

				root.children().hide();
				var _gridWidth = root.width() + 10;

				var _complete = function () {
					for (var i = 0; i < Math.floor(_gridWidth / targetColWidth) ; i++) {
						me.columns.push(i);
						colHeights.push(0);
					}
					pageSize = me.columns.length * 2 || 1;

					// re add current artwork to page?
					if (me.artworks && me.artworks.length) {
						var queue = me.artworks.slice(0);
						me.artworks = [];
						addArtworks(queue);
					}
					root.children().show();

					complete && complete();

					setTimeout(function() {
						root.css('min-height', '0px');
						setGridHeight();
					}, 500)
				};

				if (_gridWidth > 10) {
					_complete();
				}
				else {
					setTimeout(function () {
						_gridWidth = root.width() + 10;
						_complete();
					}, 10);
				}

			},

			// appends an array of artwork to page
			// - works out best column for each item based on the image height
			addArtworks = function (queue) {

				var sorted = [], row = [];

				var currentItems = me.artworks.length,
					totalColumns = me.columns.length;

				//console.log(queue);
				while (queue.length > 0) {
					row = [];

					var rowOffset = currentItems % totalColumns;		// the number of items already filled on the current row
					var itemsToAdd = totalColumns - rowOffset;								// the total number of items we still need to add to the current row
					var items = queue.splice(0, itemsToAdd);

					if (!items.length) {
						break;
					}

					// calculate an approx dimensions of each rendered image
					items.forEach(function (item) {
						item.ImageHeightRendered = item.ImageHeight ? Math.floor(item.ImageHeight / (item.ImageWidth / targetColWidth)) : 0;

						if (item._ProfileImageURI) {
							item.ProfileImageStyle = 'background-image:url(' + item._ProfileImageURI + ')';
						}
					});

					// sort items tallest -> shortest if not the first row on the page
					if (currentItems > 0 || sorted.length) {
						items.sort(function (a, b) {
							if (a.ImageHeightRendered > b.ImageHeightRendered)
								return -1;
							if (a.ImageHeightRendered < b.ImageHeightRendered)
								return 1;
							return 0;
						});
					}


					// find next shortest column for each item
					items.forEach(function (item) {
						var idx = -1, shortest;

						for (var i = 0; i < items.length; i++) {
							// check column has not already been used
							if (!row[i]) {

								// if this is the shortest row seen so far record the index
								if (!shortest || colHeights[i + rowOffset] < shortest) {
									shortest = colHeights[i + rowOffset];
									idx = i;

									if (!shortest) {
										break;
									}
								}
							}

						}
						row[idx] = item;
						colHeights[idx + rowOffset] += (item.ImageHeightRendered || 0);
					});

					sorted = sorted.concat(row);
				}

				// measure actual height of columns
				var _colHeights = [];
				root.find('.column').each(function () {
					var _c = 0;
					$(this).find('> .artwork-panel').each(function () {
						_c += $(this).height();
					});
					_colHeights.push(_c);
				});

				colHeights = _colHeights.slice(0);

				me.artworks = me.artworks.concat(sorted);
				$scope.$root.forceDigest();
			},

			// fades in images once they have fully loaded
			// - added queue so fade in can be triggered by scroll handler once the images are loaded
			revealImagesQueue = [],
			revealImages = function () {
				root.find('.artwork-panel').not('.loaded, .loading').each(function () {
					var _panel = $(this),
						_img = _panel.find('.image > img'),
						_reveal = function () {
							
							revealImagesQueue.push(_panel);
							revealImagesProcessQueue();
						};

					_panel.addClass('loading').data('failed-count', 0);
					_img.on('load', function () {
						_panel.removeClass('error').find('.warning').remove();
						_reveal();
					});
					_img.on('error', function () {
						_panel.addClass('error').find('.warning').remove();
						_panel.prepend('<div class="warning" style="min-height:' + _panel.data('image-height') + 'px"><i class="fa fa-warning"></i><br/><span>Image failed to load</span></div>');
						_reveal();

						// retry 
						var failedCount = _panel.data('failed-count');
						//console.warn(failedCount + '   ' + _img.attr('src'));
						if (failedCount < 3) {
							_panel.data('failed-count', failedCount + 1);

							setTimeout(function () {
								_img.attr('src', _img.attr('src'));
							}, 500)
						}

					});

					// ensure the onload event is fired
					_img.attr('src', _img.attr('src'));
				});

				setGridHeight();
			},
			// checks if any of the images in the queue are now within the viewport
			revealImagesProcessQueue = function () {
				var cutoff = $(window).scrollTop() + $(window).height();

				for (var i = revealImagesQueue.length - 1; i > -1; i--) {
					var _panel = revealImagesQueue[i];
					if (Math.floor(_panel.position().top) < cutoff) {
						_panel.removeClass('loading').addClass('loaded');
						revealImagesQueue.splice(i, 1);
					}
				}
			},

			// set grid height to stop page jumping to top of page on mobile devices
			setGridHeight = function() {
				var tallest = 0;
				root.find('.column').each(function() {
					if ($(this).height() > tallest) {
						tallest = $(this).height();
					}
				});
				root.css('min-height', tallest + 'px');
			};




			// handle window resizing
			var resizeTimer,
				resizeHandler = function() {
					clearTimeout(resizeTimer);
					resizeTimer = setTimeout(reload, 200);
				};
			$(window).on('resize', resizeHandler);



			// util method to scroll window to the top of the page
			me.scrollToTop = function () {
				$('html, body').animate({ scrollTop: 0 }, (root.height() / 5) + 250);
			};
			me.artworks = [];



			var currentPage = -1,
				pageSize = 2,
				endOfResults = me.endOfResults = false,
				//pendingRequest,
				triggerDistance = 2.5,	// in window heights
				filters = {},

				// handles loading additional rows of artwork as the page is scrolled
				scrollHandler = function () {

					if (!me.pendingRequest && !endOfResults) {
						var scrollPos = $(window).scrollTop(),
							cutOff = $('body').height() - $(window).height() - ($(window).height() * triggerDistance);

						if (scrollPos > cutOff) {
							nextPage();
						}
					}

					revealImagesProcessQueue();

					if (!root.is(':visible')) {
						removeScrollHandler();
					}

					if (root.find('.artwork-panel').size() && root.find('.artwork-panel.loaded').size() === root.find('.artwork-panel').size() && endOfResults) {
						removeScrollHandler();
					}

				},

				// removes the current scroll handler if current directive is unloaded
				removeScrollHandler = me.removeScrollHandler = function () {
					$(window).off('scroll', scrollHandler);
				},

				// fetches next page of artwork
				nextPage = me.nextPage = function () {
					currentPage = me.currentPage = currentPage + 1;

					if (me.fetchPage) {
						me.pendingRequest = true;

						me.fetchPage({
							Pagination: { PageSize: pageSize, PageNumber: currentPage },
							Filters: filters
						},
						function (data) {
							me.pendingRequest = false;

							var pageLength = data.Data.length;

							data.Data.forEach(function (aw) {
								aw._ImageURI = proxy.image(aw.ImageURI, 340);
								aw._ProfileImageURI = proxy.image(aw.ProfileImageURI, 90);
							});

							// add new artworks to the page
							addArtworks(data.Data);

							revealImages();
							setTimeout(revealImages, 10);
							setTimeout(revealImages, 150);

							// if this is the first page add a scroll listener to the page
							if (currentPage === 0) {
								$(window).on('scroll', scrollHandler);
								nextPage();	// load an extra page to allow a reduced page size
								$(window).trigger('scroll');
							}


							// determine if we have reached the end
							if (!pageLength) {//currentPage > data.Pagination.TotalResults / pageSize && !revealImagesQueue.length) {
								endOfResults = me.endOfResults = true;

							}

							// if at bottom of window and not at end of results request the next page
							if (!endOfResults && $(window).scrollTop() === ($('body').height() - $(window).height())) {
								nextPage();
							}

							$scope.$root.forceDigest();
						})

					}

				},

				reload = me.reload = function () {
					setColumns(function() {
						endOfResults = false;
						$scope.$root.forceDigest(revealImages);
						setTimeout(function () { revealImages(); revealImagesProcessQueue(); }, 150);

						removeScrollHandler();
						$(window).on('scroll', scrollHandler);
					});
				},

				reset = me.reset = function () {
					endOfResults = false;
					currentPage = -1;
					me.artworks = [];

					root.css('min-height', '100vh');
					//setTimeout(function () { root.css('min-height', 'auto'); }, 5000)

					setColumns(nextPage);
				};


			$scope.$on("$destroy", function () {
				removeScrollHandler();
				$(window).off('resize', resizeHandler);
			});

			if (me.autoLoad !== false) {
				setColumns(nextPage);
			}

		}]
	}
}]);

