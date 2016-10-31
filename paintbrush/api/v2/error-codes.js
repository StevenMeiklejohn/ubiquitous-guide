var extend = require('extend');

//
// This file defines all error codes returned by the data contract layer
//
//	- Ensures consistent codes and messages are returned for the same error
//


//
// Private error code definitions
//
var _errors = {};

//
// Util method to define a new error code
//
var define = function (code, message, defaultTokens) {
	_errors[code] = { message: message, defaultTokens: defaultTokens, subCode: code };
};

//
// Util method to define a new error code using the message and tokens from an existing code
//
var inherit = function (newCode, existingCode, defaultTokens) {
	var e = extend({}, _errors[existingCode]);
	define(newCode, e.message, extend({}, e.defaultTokens, defaultTokens));
	_errors[newCode ].subCode = existingCode;
};

//
// Util method to replace tokens
//
var replaceTokens = function (str, tokens, replaceUnmatched) {
	for (var token in tokens) {
		str = str.replace(new RegExp('\{\{' + token + '}}', 'g'), tokens[token]);
	}
	if (replaceUnmatched !== false) {
		str = str.replace(/\{\{[a-z0-9A-Z]+}}/g, '');
	}
	return str;
};


//
// Define generic error codes and default tokens
//

// Missing value
define('MissingValue', 'Please specify a value for {{field}}');

// Invalid data type
define('InvalidBool', '{{field}} must have a value of true or false');
define('InvalidInt', '{{field}} must have an integer');

// Integer out of range
define('IntOutOfRange', '{{field}} must be an integer within the range {{min}}-{{max}}', { min: 0, max: 1 });
define('IntBelowMin', '{{field}} must be an integer greater than {{min}}', { min: 0 });
define('IntAboveMax', '{{field}} must be an integer less than {{max}}', { max: 1 });

// string out of range
define('StringOutOfRange', '{{field}} must be a string containing between {{min}}-{{max}} characters', { min: 0, max: 1 });
define('StringBelowMin', '{{field}} must be a string with at least {{min}} characters', { min: 0 });
define('StringAboveMax', '{{field}} must be a string with no more than {{max}} characters', { max: 1 });



//
// Define specific error codes for common ID fields
//
[
	'ArtworkID',
	'ArtworkTypeID',
	'GroupID',
	'ProfileID',
	'ProductID',
	'ProductTypeID',
	'TypeID',
	'VariantID',
	'VideoID'
]
.forEach(function (field) {
	inherit('Missing' + field, 'MissingValue', { field: field });
	inherit('Invalid' + field, 'IntBelowMin', { field: field });
});



module.exports = function (code, tokens) {

	if (!_errors[code]) {
		console.error('Error code ' + code + ' does not exist');
		return { Code: code, Message: 'Unexpected Error' };
	}
	else {
		var e = extend({}, _errors[code]);
		return { Code: code, SubCode: e.subCode || null, Message: replaceTokens(e.message, extend((e.defaultTokens||{}), tokens)) };
	}

};
