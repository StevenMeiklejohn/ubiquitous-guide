var mathjs = require('mathjs');


//
// This class provides validation of data types
//
var Validate = {

	is: {

		bool: function (value) {
			return typeof value === 'boolean';
		},

		// util to see if a value is an integer and optionally within a specific range
		int: function (value, min, max) {
			var i = value * 1;
			return !(!mathjs.isInteger(i) || (min !== undefined && i < min) || (max !== undefined && i > max));
		},

		string: function (value, min, max) {
			return !(typeof value !== 'string' || (min !== undefined && value.length < min) || (max !== undefined && value.length > max));
		}

	}

};

module.exports = Validate;