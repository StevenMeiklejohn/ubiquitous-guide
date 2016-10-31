var Promise = require('bluebird'),
	extend = require('extend');


//
// Util method to flatten an object
//
var flatten = function (value) {
	var data = {};

	function process(key, _value, path) {
		if (typeof _value !== 'object') {
			data[path.join('.') + '.' + key] = _value;
		}
	}

	function traverse(o, func, path) {
		path = path || [];
		for (var i in o) {
			func.apply(this, [i,o[i], path.slice(0)]);
			if (o[i] !== null && typeof(o[i])=="object") {
				//going one step down in the object tree!!
				var _path = path.slice(0);
				_path.push(i);
				traverse(o[i],func, _path);
			}
		}
	}

	traverse(value,process);

	return data;
};





//
// This class provides a simple way to get/set user preferences
//
var UserPreferences = {

	//
	// Returns a list of all available preferences (optionally filtered by category)
	//
	list: function(category) {
		return new Promise(function (resolve, reject) {
			db('UserPreferences').select()
				.whereRaw('Deleted = 0' + (category ? ' and Category = \'' + category + '\'' : ''))
				.then(function(prefs) {
					resolve(prefs);
				})
				.catch(reject)
		});
	},

	//
	// Returns the current value for the specified user preference
	//	- If no key is specified all preferences within the category will be returned
	//	- If no category is specified all preferences will be returned
	//
	get: function(userID, category, key) {
		return new Promise(function (resolve, reject) {
			db.select(
				'v.ID',
				'v.Value',
				'p.DefaultValue',
				'p.Category',
				'p.Key',
				'p.DataType'
			)
			.from('UserPreferences as p')
			.joinRaw('left join UserPreferenceValues as v on p.ID = v.UserPreferenceID and v.UserID = ' + userID)
			.whereRaw('p.Deleted = 0 ' + (category ? ' and p.Category = \'' + category + '\'' : '') + (key ? ' and p.Key = \'' + key + '\'' : ''))
			.then(function(data) {
				//console.log(data);

				if (!data.length) {
					if (key) {
						reject('The specified preference was not found: ' + category + '.' + key);
					}
					else if (category) {
						reject('No user preferences found for category: ' + category);
					}
					else {
						reject('No user preferences defined in database');
					}
				}
				else {
					var preferences = key ? undefined : {};

					data.forEach(function(item) {

						var v = item.ID !== null ? item.Value : item.DefaultValue;

						if (v) {
							if (v.indexOf('{{') === 0) {
								// TODO: replace token with values
							}

							// convert to correct data type
							switch(item.DataType) {
								case 'integer': if (!isNaN(parseInt(v))) v = parseInt(v); break;
								case 'float': if (!isNaN(parseFloat(v))) v = parseFloat(v); break;
								case 'boolean': v = v === 'true'; break;
							}

							if (key) {
								preferences = v;
							}
							else {
								var p = ((!category ? item.Category + '.' : '') + item.Key).split('.'), o = v;
								for (var i = p.length-1; i > -1; i--) {
									var _o = { };
									_o[p[i]] = o;
									o = _o;
								}
								preferences = extend(true, preferences, o);
							}
						}

					});

					resolve(preferences);
				}

			})
			.catch(reject)
		});
	},

	//
	// Sets a new value for the specified user preference
	//
	set: function(userID, category, key, value) {
		return new Promise(function (resolve, reject) {

			if (value === undefined) {
				reject('Please specify a value');
			}
			else if (key && !category) {
				reject('Please specify a category');
			}
			else {

				var queue = [];

				//
				// update single preference
				//
				if (key) {

					value = value.value;

					if (typeof value === 'object') {
						reject('Value cannot be an object');
					}
					else {
						queue.push(
							db.first(
								'v.ID',
								'v.Value',
								'p.DataType',
								'p.ID as UserPreferenceID'
							)
							.from('UserPreferences as p')
							.joinRaw('left join UserPreferenceValues as v on p.ID = v.UserPreferenceID and v.UserID = ' + userID)
							.where({ 'p.Category': category, 'p.Key': key })
							.then(function(pref) {
								if (pref) {
									// TODO: validate datatype
									value += '';	// convert to string

									if (pref.ID) {
										return db('UserPreferenceValues').update({ Value: value }).where('ID', pref.ID)
									}
									else {
										return db('UserPreferenceValues').insert({ UserID: userID, UserPreferenceID: pref.UserPreferenceID, Value: value });
									}
								}
							})
						)
					}

				}

				//
				// update category of preferences
				//
				else if (category) {

					var prefsNew = flatten(value);

					//
					// Get existing user preferences for the current category
					//
					queue.push(
						db.select(
							'v.ID',
							'v.Value',
							'p.DefaultValue',
							'p.Key',
							'p.DataType',
							'p.ID as UserPreferenceID'
						)
						.from('UserPreferences as p')
						.joinRaw('left join UserPreferenceValues as v on p.ID = v.UserPreferenceID and v.UserID = ' + userID)
						.where({ 'p.Category': category})
						.then(function(prefsExisting) {

							var _queue = [];

							//
							// Compare values to work out which ones have changed
							//
							prefsExisting.forEach(function(p) {

								// check if new value matches default value
								// - if match and v.ID is defined delete record
								// - if no match and v.ID is defined and value is different update record
								// - if no match and v.ID is not defined create new record

								if (prefsNew[p.Key] !== undefined) {
									var val = prefsNew[p.Key] + '';

									if (val === p.DefaultValue) {
										if (p.ID) {
											_queue.push(db('UserPreferenceValues').where('ID', p.ID).del());
										}
									}
									else {
										if (p.ID) {
											if (val !== p.Value) {
												_queue.push(db('UserPreferenceValues').where('ID', p.ID).update({ Value: val }));
											}
										}
										else {
											_queue.push(db('UserPreferenceValues').insert({ Value: val, UserID: userID, UserPreferenceID: p.UserPreferenceID }));
										}
									}
								}

							});

							return Promise.all(_queue);
						})
					);

				}

				Promise.all(queue).then(resolve).catch(reject);
			}

		});
	}

};

module.exports = UserPreferences;