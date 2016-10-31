

angular.module('ARN')

.directive('artistSearch', [function () {
	return {
		templateUrl: 'components/common/artist/search/tpl.htm',
		controllerAs: 'ctrl',
		bindToController: true,
		controller: ['$scope', '$http', '$element', '$timeout', '$location', 'artworkService', function ($scope, $http, $element, $timeout, $location, artworkService) {

			
			var filters = {},	// active filters
				sort = { Field: 'Latest' };		// sort settings


			artworkService.priceBands().then(function(data) {
				$scope.pricebands = data;
			});

			artworkService.styles().then(function(data) {
				$scope.styles = data;
			});

			artworkService.types().then(function(data) {
				$scope.types = data;
			});

			$scope.artworkGridConfig = {
				artistStats: true,
				colours: false,
				message: {
					noResults: { message: 'No artists found' }
				},
				event: {
					mouseup: function (e, artwork, target) {
						switch (target) {
							case 'image':
								var _url = '/profile/' + artwork.ProfileID;

								if (e.button === 1 || (e.button === 0 && e.ctrlKey)) {
									var a = document.createElement("a");
									a.href = _url;
									a.style = 'display:none;';
									a.target = '_blank';
									document.body.appendChild(a);

									if (browser.firefox) {
										a.click();
									}
									else {
										var evt = document.createEvent("MouseEvents");
										evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, true, false, false, false, 0, null);
										a.dispatchEvent(evt);
									}
								}
								else if (e.button === 0) {
									$location.url(_url);
								}
								break;
						}
					}
				},
				fetchPage: function (req, complete) {
					req.Filters = filters;
					req.Sort = sort;

					$http.post('/api/marketplace/search', req)
					.success(function (data) {

						data.Data.forEach(function (aw) {
							if (aw.Types) { aw.TypesStr = aw.Types.join(', '); }
						});

						complete(data);
					})
					.error(function (err) {
						//console.error(err);
					});
				}
			};




			$scope.setSort = function (field) {
				
				if (field !== sort.Field) {
					var el = $element.find('.filters .sort'); //,opts = el.find('.options li');

					el.find('.label .text').text(field);
					//opts.show().filter(':contains(\'' + field + '\')').hide()

					sort = { Field: field }
					$scope.artworkGrid.reset();
				}

			};



			$scope.setFilter = function (type, value, label, $event) {

				var el = $element.find('[data-filter=' + type + ']'),
					lastValue = filters[type] || [],
					changed = lastValue[0] !== value;
					
				if (typeof lastValue === 'object') {
					changed = JSON.stringify(lastValue[0]) !== JSON.stringify(value);
				}

				if (value === undefined) {
					delete filters[type];
					el.find('.label .text').html(type);
				}
				else {
					filters[type] = [value];

					if (label) {
						el.find('.label .text').html(type + ': <strong>' + label + '</strong>');
					}
					else if ($event) {
						el.find('.label .text').html(type + ': <strong>' + $($event.currentTarget).text() + '</strong>');
					}
				}

				if (changed) {
					$scope.artworkGrid.reset();
				}
			};

			

			//
			// Colour Filter
			//

			var picker = $element.find('.colour-picker');
			picker.prepend('<a title="Remove colour filter" class="remove-colour fa fa-times"></a>')

			var removeColour = picker.find('.remove-colour'),
				selectedColour = picker.parents('.filter').find('.selected-colour'),
				pickerTimeout,

				applyColourFilter = function () {
					clearTimeout(pickerTimeout);

					var _c = selectedColour.data('colour');
					if (_c) {
						var c = JSON.parse(_c);
						$scope.setFilter('Colour', { R: c.R, G: c.G, B: c.B })
					}
				};

			removeColour.hide();
			selectedColour.hide();

			picker.colpick({
				flat: true,
				layout: 'hex',
				submit: 0,
				onChange: function (hsb, hex, rgb) {
					selectedColour.css('background', '#' + hex).data('colour', JSON.stringify({ R: rgb.r, G: rgb.g, B: rgb.b })).show();
					removeColour.show();

					clearTimeout(pickerTimeout);
					pickerTimeout = setTimeout(applyColourFilter, 500)
				}
			})
			.mouseleave(applyColourFilter)
			.find('.colpick_new_color, .colpick_hex_field').remove();


			removeColour.click(function () {
				selectedColour.hide();
				removeColour.hide();
				selectedColour.data('colour', '');
				$scope.setFilter('Colour');
			});





			//
			// Search Filter
			//
			var searchFilter = $element.find('.text input'),
				searchTimeout,
				applySearchFilter = function () {

					clearTimeout(searchTimeout);

					var value = searchFilter.val(),
						changed = filters['Text'] === undefined && value === '' ? false : filters['Text'] !== value;

					if (value) {
						filters['Text'] = value;
					}
					else {
						delete filters['Text'];
					}

					if (changed) {
						$scope.artworkGrid.reset();
					}
				};

			searchFilter
				.change(applySearchFilter)
				.keyup(function () {
					clearTimeout(searchTimeout);
					searchTimeout = setTimeout(applySearchFilter, 500)
				});



		}]
	}
}]);

