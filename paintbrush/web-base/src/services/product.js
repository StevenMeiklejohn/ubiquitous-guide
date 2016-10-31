(function(){

angular.module('ARN')

	.factory('productService', ['$q', '$http', 'cacheProvider', function($q, $http, cacheProvider){

		var cache = cacheProvider('product'),
			endpoint = '/api/products/',

		clearCache = function (resp) {
			cache.clear();
			return resp;
		},

		// generic getter
		// - returns a promise
		// - caches all results
		get = function(key, timeLimit) {
			var d = $q.defer(), data = cache.get(key);

			if (data) {
				d.resolve(data);
			}
			else {
				$http.get(endpoint + key).then(
					function(resp) {
						cache.set(key, resp.data, timeLimit);
						d.resolve(resp.data);
					},
					d.reject);
			}

			return d.promise;
		},

		_request = function(verb, key, data) {
			var d = $q.defer();

			$http[verb](endpoint + key, data)
				.then(function(resp) {
					d.resolve(resp.data);
				}, d.reject);

			return d.promise;
		},

		post = function (key, data) {
			return _request('post', key, data);
		},

		put = function (key, data) {
			return _request('put', key, data);
		},

		_delete = function (key, data) {
			return _request('delete', key, data);
		};


		return {

			types: function() {
				return get('types');
			},

			get: function (id) {
				return get(id);
			},

			add: function (data) {
				return post('add', data).then(clearCache);
			},

			remove: function (productID) {
				return _delete(productID).then(clearCache);
			},

			update: function (productID, data) {
				return put(productID, data).then(clearCache);
			},

			search: function(opts) {
				return post('search', opts);
			},



			variant: {

				add: function (data) {
					return post('variant/add', data).then(clearCache);
				},


				update: function (id, data) {
					return put('variant/' + id, data).then(clearCache);
				},

				remove: function (id) {
					return _delete('variant/' + id).then(clearCache);
				},


				product: function (productID) {
					return get('variant/product/' + productID);
				},

				profile: function (profileID) {
					return get('variant/profile/' + profileID);
				},


				groups: {

					add: function (data) {
						return post('variant/groups/add', data).then(clearCache);
					},

					update: function (groupID, data) {
						return put('variant/groups/' + groupID, data).then(clearCache);
					},

					remove: function (id) {
						return _delete('variant/groups/' + id).then(clearCache);
					},

					profile: function (profileID) {
						return get('variant/groups/profile/' + profileID);
					}

				}

			}

		};

	}])

})();