var extend = require('util')._extend;

//
// Clone the global API config
//
var config = extend({}, require('../config'));

//
// Return API V1 config
//
module.exports = config;
