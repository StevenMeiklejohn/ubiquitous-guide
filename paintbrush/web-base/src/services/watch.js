(function(){

angular.module('ARN')

	//
	// Wraps $scope.$watch in a promise, auto tidies watcher once done
	//
	.factory('watchService', ['$q', function($q) {


		//
		// Predefined common value inspectors
		//
		var inspectors = {

			exists: function (val) {
				return val !== undefined;
			},

			ID: function(val) {
				return val && val.ID > 0;
			},

			value: function(val, expectedVal) {
				return val === expectedVal;
			}
		};


		//
		// Gets the specified inspector function - defaults to 'exists'
		// - Optionally passes an array of arguments to the function
		//
		var getInspector = function (inspect, args) {
			// set inspect method
			var _inspect = inspectors.exists;

			if (typeof inspect === 'string') {
				_inspect = inspectors[inspect] || _inspect;
			}
			else if (typeof inspect === 'function') {
				_inspect = inspect;
			}
			return function(val) {
				return _inspect.apply(this, [val].concat(args || []));
			};
		};


		return function ($scope) {

			var uid = 1,
				watchers = {};


			//
			// Private watch method - resolves when object is ready
			//
			// - Automatically removes watcher once done
			//
			var _watch = function (objectName, inspect, groupID) {
				var d = $q.defer();

				// inspect scope to see if object is ready
				if (inspect($scope[objectName])) {
					d.resolve($scope[objectName]);
				}
				// otherwise create watcher and wait until object is ready
				else {
					var watcher = $scope.$watch(objectName, function(val) {
						if (inspect(val)) {
							watcher();
							d.resolve(val);
						}
					});

					if (groupID) {
						watchers[groupID].push(watcher);
					}
				}

				return d.promise;
			};


			//
			// Returns when any of the objects in the watch list are ready
			//
			var any = function(objects) {
				var d = $q.defer(),
					groupID = uid++;

				watchers[groupID] = [];

				for (var key in objects) {
					(function(objectName){

						_watch(objectName, getInspector(objects[objectName]), groupID).then(function(val) {
							watchers[groupID].forEach(function (watcher) {
								watcher();
							});
							delete watchers[groupID];

							var resp = {};
							resp[objectName] = val;
							d.resolve(resp);
						})
					})(key);
				}

				return d.promise;
			};


			//
			// Returns when the specified object is ready within the current scope
			//
			var watch = function (objectName, inspect) {

				// set inspect method and pass in any additional arguments
				var _inspect = getInspector(inspect, Array.prototype.slice.call(arguments, 2));

				return _watch(objectName, _inspect);
			};


			return {
				//all: all,
				any: any,
				watch: watch
			};
		}

	}])

})();