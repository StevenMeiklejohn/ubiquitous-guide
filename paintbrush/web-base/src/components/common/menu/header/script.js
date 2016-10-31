

angular.module('ARN')

.directive('menuHeader', [function () {
	return {
		templateUrl: 'components/common/menu/header/tpl.htm',
		replace: true,
		controller: ['$scope', '$http', '$element', '$timeout', '$location', 'websocket', 'notification', function ($scope, $http, $el, $timeout, $location, websocket, notification) {

			//console.log(notification);

			var updateInterval = 600 * 1000;

			var updateUnreadCount = function () {
				if ($scope.authenticated && $scope.$root.activeProfile.ID > 0) {
					notification.unread($scope.$root.activeProfile.ID).then(function (data) {
						$scope.unreadNotifications = data.Count;
					})
				}
			};

			//var updateConnectionsCount = function () {
			//	if ($scope.authenticated) {
			//		$http.get('/api/connections/pending').success(function (pending) {
			//			$scope.pendingConnections = pending.length;
			//		})
			//	}
			//};


			updateUnreadCount();


			var profileChangedListener = function () {
				updateUnreadCount();
				$scope._ImageURI = '/api/proxy/image/' + encodeURIComponent($scope.$root.activeProfile.ImageURI) + '/90';
			};
			$scope.$on('authenticated', profileChangedListener);
			$scope.$on('activeProfileChanged', profileChangedListener);


			//updateConnectionsCount();

			//setInterval(updateUnreadCount, updateInterval);
			//setInterval(updateConnectionsCount, updateInterval + 1000);

			//$scope.$on('$locationChangeStart', function () {
			//	setTimeout(updateUnreadCount, 3000);
			//	//setTimeout(updateConnectionsCount, 4000);
			//});






			
			$scope.logout = function () {
				$http.get('/api/auth/logout');
				websocket.logout();

				setTimeout(function () {
					sessionStorage.clear();
					localStorage.clear();
					$location.url('/login?r=' + encodeURIComponent($location.url()));
					$scope.$root.authenticated = false;
					$scope.$root.userProfile = { ID: -1 };
					$scope.$root.activeProfile = { ID: -1 };
					$scope.forceDigest();
				}, 1)
			};


			var clearTimer,
				drawer = $el.find('.drawer'),
				hideDrawer = function () {
					clearTimeout(clearTimer);
					clearTimer = setTimeout(function () {
						drawer.stop().fadeOut(250);
					}, 750);
				},
				showDrawer = function () {
					clearTimeout(clearTimer);
					drawer.stop().fadeIn(250);
				};

			drawer.hide();

			$el.find('.profile-link').mouseover(showDrawer);
			$el.parent().mouseleave(hideDrawer);
			drawer.mouseover(showDrawer).mouseleave(hideDrawer).click(hideDrawer);


			websocket.on('notification/unread', function(count) {
				$scope.unreadNotifications = count;
				$scope.forceDigest();
			});


		}]
	}
}]);

