

angular.module('ARN')

.directive('deviceSettings', [function () {
	return {
		templateUrl: 'components/common/device/tpl.htm',
		controllerAs: 'ctrl',
		bindToController: true,
		controller: ['$scope', '$http',  function ($scope, $http) {

			$http.get('/api/device/list')
				.success(function(data) {

					data.forEach(function (device) {
						device.TotalLogins = 0;
						device.LastLoginFull = DateUtils.format.full(device.LastLogin);
						device.LastAccessFull = DateUtils.format.full(device.LastAccess);



						var dicon = 'question';
						switch (device.Type.toLowerCase()) {
							case 'computer': dicon = 'laptop'; break;
							case 'mobile': dicon = 'mobile'; break;
							case 'tablet': dicon = 'tablet'; break;
							case 'tv': dicon = 'tv'; break;
						}
						device.Icon = dicon;

						device.Browsers.forEach(function(browser) {
							browser.LastLoginFull = DateUtils.format.full(browser.LastLogin);
							browser.LastAccessFull = DateUtils.format.full(browser.LastAccess);

							var bicon = browser.Name.toLowerCase();
							switch (bicon) {
								case 'firefox mobile': bicon = 'firefox'; break;
								case 'chrome mobile': bicon = 'chrome'; break;
								case 'mobile safari': bicon = 'safari'; break;
							}
							browser.Icon = bicon.replace(/ /g, '-') + '-32.png';

							var parts = browser.Version.split('.');
							if (parts.length > 2) {
								browser.VersionShort = parts.slice(0,2).join('.')
							}
							else {
								browser.VersionShort = browser.Version
							}

							device.TotalLogins += browser.History.length;
							browser.History.forEach(function(entry) {
								entry.LoginDateFull = DateUtils.format.full(entry.LoginDate);
								entry.LastAccessFull = DateUtils.format.full(entry.LastAccess);
							})

						});

					});

					$scope.devices = data;

					$http.get('/api/device/current').success(function(currentDevice) {
						$scope.currentDevice = currentDevice;
					})

				});

			$scope.toggleDevice = function(e){
				// ignore clicks on browser panels
				if (!$(e.target).parents('.browser, .settings').size()){
					$(e.currentTarget).toggleClass('open');
				}
			};

			$scope.toggleHistory = function (e) {
				// ignore clicks on history panel
				if (!$(e.target).parents('.history').size()){
					$(e.currentTarget).toggleClass('open');
				}

			}
		}]
	}
}]);
