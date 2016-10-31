'use strict';

// Declare app level module which depends on views, and components
angular.module('ARN', [ 'ui.router' ])
.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', '$provide', '$locationProvider', function ($stateProvider, $urlRouterProvider, $httpProvider, $provide, $locationProvider) {

	var cdv = window.clientDependencyVersion;

	// load routes for this app
	var routeConfig = '[APP_ROUTES]',
		routePrefix = '[APP_ROUTES_PREFIX]';

	for (var path in routeConfig) {
		var c = routeConfig[path];
		c.templateUrl = (routePrefix ? routePrefix + '/' : '') + 'controllers/' + c.templateUrl + (cdv ? '?cdv=' + cdv : '');
		c.url = path +
				'?{ps:int}&{pn:int}&sf&sd&{ft:json}' + 	// datagrid params
				'&r&v&c' +								// login form params
				'&linked';								// auth settings
		$stateProvider.state(path, c);
	}
	$stateProvider.state('404', {
		templateUrl: (routePrefix ? routePrefix + '/' : '') + 'controllers/common/404/view.htm',
		controller: '404',
		title: { t: 'Page Not Found' }
	});
	$urlRouterProvider.otherwise(function($injector, $location){
		$injector.get('$state').go('404');
		return $location.path();
	});


	// register the interceptor as a service
	$provide.factory('authHttpInterceptor', ['$q', '$injector', '$rootScope', '$location', function ($q, $injector, $rootScope, $location) {
		var refreshing = {};
		return {
			request: function(config) {
				if (config.url.indexOf('/api/') === 0 && config.url.indexOf('/api/v2/') === -1) {
					config.url = config.url.replace('/api/', '/api/v2/');
				}
				return config || $q.when(config);
			},
			responseError: function (response) {
				if (response.status === 401) {

					var _error = response.headers('www-authenticate') || '';

					if (_error.indexOf('Token expired') > -1) {
						var deferred = $q.defer(); // defer until we can re-request a new token 
						// Get a new token... (cannot inject $http directly as will cause a circular ref)

						var token = localStorage['refreshToken'];
						refreshing[token] = refreshing[token] || [];

						// queue original request until we have finished refreshing tokens
						refreshing[token].push(function() {
							$injector.get("$http")(response.config).then(function (resp) {
								deferred.resolve(resp);
							},
							function () {
								deferred.reject(); // something went wrong
							});
						});

						// ensure we only try to refresh token once
						if (refreshing[token].length === 1) {

							$injector.get("$http")({
								method: 'POST',
								url: '/api/auth/refresh',
								headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
								transformRequest: function (obj) {
									var str = [];
									for (var p in obj)
										str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
									return str.join("&");
								},
								data: {
									refresh_token: localStorage['refreshToken'],
									grant_type: 'refresh_token',
									client_id: 'MembersPortal',
									client_secret: '828147bdf3b6a1880f394e960989a457'
								}
							})
							.success(function (data) {

								if (data.access_token) {
									localStorage['accessToken'] = data.access_token;
									localStorage['refreshToken'] = data.refresh_token;
									localStorage['tokenType'] = data.token_type;

									// execute queued ajax requests
									refreshing[token].forEach(function(f) { f(); });
								} else {
									deferred.reject(); // login.json didn't give us data
								}

							})
							.error(function () {

								$rootScope.authenticated = false;
								localStorage.removeItem('accessToken');
								$('body').toggleClass('authenticated', false);

								if (!($location.path() === '/login' || $location.path() === '/register')) {
									$location.url('/login?r=' + encodeURIComponent($location.url()))
								}

								deferred.reject(); // token retry failed
							});

						}
						return deferred.promise; // return the deferred promise 
						
					}
					else {
						$rootScope.authenticated = false;
						localStorage.removeItem('accessToken');
						$('body').toggleClass('authenticated', false);
						if (!($location.path() === '/login' || $location.path() === '/register')) {
							$location.url('/login?r=' + encodeURIComponent($location.url()))
						}
					}

				}
				return $q.reject(response);
			}
		};
	}]);

	$httpProvider.interceptors.push('authHttpInterceptor');

	$locationProvider.html5Mode(true);

}])
.run(['$rootScope', '$injector', '$compile', '$http', '$location', '$q', '$state', 'profileService', 'websocket', 'notification', 'cacheProvider', function ($rootScope, $injector, $compile, $http, $location, $q, $state, profileService, websocket, notification, cacheProvider) {

	$rootScope.activeProfile = { ID: -1 };
	$rootScope.userProfile = { ID: -1 };
	$rootScope.route = $state;
	$rootScope.authenticated = false;


	$injector.get("$http").defaults.transformRequest = function(data, headersGetter) { 
		if (localStorage['accessToken']) {
			headersGetter()['Authorization'] = localStorage['tokenType'] + ' ' + localStorage['accessToken'];
		}
		if (data) { 
			return angular.toJson(data);
		} 
	};


	$rootScope.$watch('authenticated', function(val) {
		if (val) {
			websocket.authenticate();
			notification.settings.load();
			$rootScope.$broadcast('authenticated', val);
		}
	});

	// sets the active user profile in the root scope
	$rootScope.setActiveProfile = function (profile, callback) {
		if (profile) {

			if (profile.ID === $rootScope.userProfile.ID || $rootScope.userProfile.IsAdmin || true) {
				//  TODO: ensure current user has permission to set this profile as active

				profile.ImageURI_90 = '/api/proxy/image/' + encodeURIComponent(profile.ImageURI) + '/90';

				$rootScope.activeProfile = profile;
				localStorage.activeProfileID = profile.ID;

				$rootScope.$broadcast('activeProfileChanged', {});
			}
			else {
				console.warn('You do not have permission to set profile ' + profile.ID + ' as your active profile');
			}

		}
		callback && callback();
	};


	$rootScope.setActiveProfileByID = function (profileID, callback) {
		return profileService.get(profileID)
			.then(function (p) {
				$rootScope.setActiveProfile(p, callback);
			})
			.catch(function (err) {
				var userProfileID = $rootScope.userProfile.ID,
					errorCode = (err.data || {}).Code;

				if (userProfileID != profileID) {
					if (err.status === 404) {
						$rootScope.setActiveProfileByID(userProfileID, callback);
					}
					else if (err.status === 400 && ['InvalidProfileID', 'MissingProfileID' ].indexOf(errorCode) > -1) {
						$rootScope.setActiveProfileByID(userProfileID, callback);
					}
				}
			})
	};


	// stores the current users profile in the root scope
	$rootScope.setUserProfile = function (profile, callback) {
		if (profile) {
			profile.ImageURI_90 = '/api/v2/proxy/image/' + encodeURIComponent(profile.ImageURI) + '/90';

			profile.managesArtist = function(artistID) {
				var _id = artistID * 1;
				if (!isNaN(_id) && this.Gallery) {
					return this.Gallery.Artists.indexOf(_id) > -1;
				}
				return false;
			};

			//var $z = window.$zopim;
			//if ($z && $z.livechat) {
			//	$z.livechat.setEmail(profile.Email);
			//	$z.livechat.setName(profile.Name);
			//}


			$rootScope.userProfile = profile;


			// refresh groups for this profile
			$rootScope.refreshUserGroups(function() {
				$rootScope.$broadcast('userProfileChanged', {});

				if (!$rootScope.activeProfile || $rootScope.activeProfile.ID < 1) {

					if (!localStorage.activeProfileID) {
						localStorage.activeProfileID = profile.ID;
					}

					$rootScope.setActiveProfileByID(localStorage.activeProfileID, callback);
				}
				else {
					callback && callback();
				}
			})

		}
		else {
			callback && callback();
		}
	};

	$rootScope.refreshUserGroups = function (cb) {
		$http.get('/api/profile/groups')
			.success(function (groups) {
				$rootScope.userProfile.Groups = groups || [];
				$rootScope.userProfile.inGroup = function (name) {
					return this.Groups.some(function (g) {
						return g.Name === name;
					});
				};
				$rootScope.userProfile.IsAdmin = $rootScope.userProfile.inGroup('Administrators');
				cb && cb();
			})
	};


	if (localStorage['registrationID']) {
		$location.url('/register');
	}
	else if ($location.path() !== '/register') {

		if (!localStorage['profileID'] || localStorage['profileID'] === '-1') {
			localStorage.clear();
			if ($location.path() !== '/login') {
				$location.url('/login');
			}
		}
		else {
			profileService.get(localStorage['profileID'])
				.then(function (profile) {
					$rootScope.setUserProfile(profile, function () {
						$rootScope.authenticated = true;
					});
				})
				.catch(function(e){
					localStorage.clear();
					$location.url('/login');
				});
		}
	}

	// forces a new digest cycle without throwing errors and provides a callback to allow execution of code immediately upon finishing the digest cycle
	// - NOTE: using $timeout (the semi-official work around) is unreliable
	$rootScope.forceDigest = function (complete) {
		var interval = setInterval(function () {
			try {
				$rootScope.$digest();
				clearInterval(interval);
				complete && complete();
			}
			catch (e) {
				console.error(e)
			}
		}, 50);
	};


	$rootScope.authenticate = function (email, password) {
		var deferred = $q.defer();

		$http({
			method: 'POST',
			url: '/api/auth',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			transformRequest: function (obj) {
				var str = [];
				for (var p in obj)
					str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
				return str.join("&");
			},
			data: {
				username: email,
				password: password,
				grant_type: 'password',
				client_id: 'MembersPortal',
				client_secret: '828147bdf3b6a1880f394e960989a457'
			}

		})
		.then(function (resp) {
			if (window.mixpanel) {
				mixpanel.identify(email);
			}
			deferred.resolve(resp.data);
		}, function (resp) {
			deferred.reject(resp);
		});

		return deferred.promise;
	};

	// set's the document title
	var docTitleTimeout;
	$rootScope.docTitle = function (t, delay) {
		var setTitle = function() {
			document.title = (t ? t + ' | ' : '' ) + 'Art Retail Network';
		};

		if (delay) {
			clearTimeout(docTitleTimeout);
			docTitleTimeout = setTimeout(setTitle , delay);
		}
		else {
			setTitle();
		}
	};


	$rootScope.$on('$viewContentLoaded', function (event) {
		try {
			var route = event.targetScope.route.current;

			if (typeof route.title === 'object') {
				var title = route.title,
					activeProfileName = $rootScope.activeProfile.Name,
					userProfileName = ($rootScope.userProfile || {}).Name,
					setTitle = function () {
						$rootScope.docTitle(title.t + (title.a && activeProfileName ? ' | ' + activeProfileName : '') + (title.u && userProfileName ? ' | ' + userProfileName : ''));
					},
					watch = function (obj, cb) {
						var watcher = $rootScope.$watch('activeProfile', function (val) {
							if (val.Name) {
								watcher();
								cb(val.Name);
								setTitle();
							}
						})
					};

				if (title.a && !activeProfileName) {
					watch('activeProfile', function (name) {
						activeProfileName = name;
					})
				}
				else if (title.u && !userProfileName) {
					watch('userProfile', function (name) {
						userProfileName = name;
					})
				}
				else {
					setTitle();
				}
			}
			else {
				$rootScope.docTitle(route.title || route.controller);
			}

		}
		catch (e) { }

		window.ga && window.ga('send', 'pageview', { page: $location.url() });
	});



	//
	// Watch for profileID in localStorage changing - force page refresh
	//
	window.onfocus = function() {
		if ($rootScope.userProfile && $rootScope.userProfile.ID > 0 && (localStorage.profileID * 1) !== $rootScope.userProfile.ID) {
			new Dialog({
				title: '<h3>Profile Change Detected...</h3>'
			});
			window.location.reload();
		}
	};


	//
	// Listen for client dependency version changes
	//
	var reloadDialog, reloadListener;
	websocket.on('cdv/change', function (data) {

		var forceReload = function () {
			if (!reloadListener) {
				reloadListener = 1;

				var stateChanged;
				$rootScope.$on('$locationChangeSuccess', function(){
					if (!stateChanged || !browser.chrome) {
						cacheProvider().clear();
						window.location.reload();
				 	}
				});
				$rootScope.$on('$stateChangeStart', function(){
					stateChanged = 1;
					cacheProvider().clear();
					window.location.reload();
				})
			}
		};

		//
		// App version has changed (assume major/breaking changes to web app code)
		// - inform user, ask to reload page immediately but allow them to attempt to save if editing content with the knowledge it may not work.
		// - force page reload on next view change event
		//
		if (data.appVersion && data.appVersion !== window.appVersion) {
			if (!reloadDialog || reloadDialog.root.disposed) {
				reloadDialog = new Dialog({
					title: ' ',
					width: 450,
					html:
						'<div class="message info" style="display: flex;">' +
						'<span style="margin-right:10px;"><i class="fa fa-2x fa-info-circle"></i></span>' +
						'<span>This website has been updated since you initially opened this page, some functionality may not work properly until you reload this page.</span>' +
						'</div>',
					buttons: [{
						text: 'Ignore',
						icon: { left: 'fa fa-times' },
						class: 'orange',
						onclick: function () {
							// force reload on page navigation

							forceReload();
						}
					}, {
						text: 'Reload',
						icon: { left: 'fa fa-refresh' },
						class: 'green',
						onclick: function () {
							window.location.reload();
						}
					}]
				});
			}

		}
		//
		// Only client dependency version has changed (assume minor changes to web app code)
		// - force page reload on next view change event
		//
		else if (data.version !== window.clientDependencyVersion) {
			forceReload();
		}
	})


}]);

