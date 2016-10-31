

angular.module('ARN')

.directive('dashboardViewedProfile', ['$location', 'dashboardService', function ($location, dashboardService) {
	return {
		templateUrl: 'components/common/dashboard/viewed-profile/tpl.htm',
		restrict: 'E',
		replace: true,
		scope: {
			config: '='
		},
		controller: function ($scope, $element) {

			var profileID;

			$scope.$watch('$root.activeProfile', function(val) {
				if (val && val.ID > 0) {
					profileID = $scope.$root.activeProfile.ID;
					init();
				}
			});

			$scope.viewProfile = function (id) {
				$location.url('/profile/' + id);
			};


			var init = function() {

				dashboardService.profile.viewed.details(profileID)
					.then(function(data) {
						for (var i in data) {
							data[i].ImageURI = '/api/proxy/image/' + encodeURIComponent(data[i].ImageURI) + '/180';
						}
						$scope.profiles = data;
					})
					.catch(function(err) {
						$scope.error = { type: err.status === 403 ? 'warn' : 'error', message: err.data.Message };;
					});

				var slider = $element.find('.profiles'),
					sliderSpeed = 0.1,	// lower == faster
					sliderAnimating = false,
					profilesInner = slider.find('.profiles-inner');

				slider.find('.control.up').click(function () {

					if (!sliderAnimating) {
						var firstItem = profilesInner.find(' > .profile').first(),
							mtop = parseInt(firstItem.css('margin-top') || '0'),
							panelHeight = firstItem.next().outerHeight(true),
							visiblePanels = Math.floor(profilesInner.height() / panelHeight);

						if (mtop < 0) {
							sliderAnimating = true;
							var i = mtop + (visiblePanels * panelHeight), _t = (sliderSpeed * visiblePanels);
							firstItem.css('transition-duration', _t + 's');
							firstItem.css('margin-top', (i < 0 ? i : 0) + 'px');
							setTimeout(function () { sliderAnimating = false; }, _t * 1000);
						}
					}

				});


				slider.find('.control.down').click(function () {

					if (!sliderAnimating) {

						var firstItem = profilesInner.find(' > .profile').first(),
							mtop = parseInt(firstItem.css('margin-top') || '0'),
							panelHeight = firstItem.next().outerHeight(true),
							innerHeight = panelHeight * profilesInner.find('.profile').size(),
							visiblePanels = Math.floor(profilesInner.height() / panelHeight);


						if ((mtop * -1) < innerHeight - profilesInner.width()) {
							sliderAnimating = true;
							var _t = (sliderSpeed * visiblePanels);
							firstItem.css('transition-duration',  _t + 's');
							firstItem.css('margin-top', (mtop - (visiblePanels * panelHeight)) + 'px');
							setTimeout(function () { sliderAnimating = false; }, _t * 1000);
						}
					}

				})

			}

			
		}
	}
}]);

