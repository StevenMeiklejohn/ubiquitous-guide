(function(){

	angular.module('ARN').factory('cacheProvider', [function(){

		return function(sessionKey) {

			var items = {};

			//
			// Link items to local storage to persist across multiple tabs
			// - useful if an item is invalidated, change will propagate to other tabs
			//
			if (sessionKey) {
				sessionKey = 'cache-' + sessionKey + '-';
			}

			return {

				items: items,

				//
				// Empties cache
				//
				clear: function(key) {
					if (key) {
						delete localStorage[(sessionKey ? sessionKey : '') + key];
					}
					else {
						if (sessionKey) {
							for (var i in localStorage) {
								if (i.indexOf(sessionKey) === 0) {
									delete localStorage[i];
								}
							}
						}
						else {
							for (var i in localStorage) {
								if (i.indexOf('cache') === 0) {
									delete localStorage[i];
								}
							}
							items = {};
						}
					}
				},

				//
				// Returns an item from the cache if it exists and has not expired
				//
				get: function(key) {
					var item = sessionKey ? JSON.parse(localStorage[sessionKey + key] || 'null') : items[key];
					if (!item || new Date(item.expiryDate) < new Date()) {
						return undefined;
					}
					return item.data;
				},

				//
				// Removes item(s) from the cache
				//
				remove: function(key) {
					if (sessionKey) {
						if (key) {
							localStorage.removeItem(sessionKey + key);
						}
						else {
							for (var i in localStorage) {
								if (i.indexOf(sessionKey) === 0) {
									localStorage.removeItem(i);
								}
							}
						}
					}
					else {
						delete items[key];
					}
				},

				//
				// Adds/updates an item in the cache
				//
				set: function (key, data, expires) {
					var item = {
						data: data,
						expiryDate: DateUtils.add(0, 0, expires || 300)
					};

					if (sessionKey) {
						localStorage[sessionKey + key] = JSON.stringify(item);
					}
					else {
						items[key] = item;
					}
				}

			};

		};

	}])

})();