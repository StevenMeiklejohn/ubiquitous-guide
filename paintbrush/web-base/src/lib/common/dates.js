(function () {

	var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],

	// expect date object, date string or integer
	parseDate = function (d) {
		if (typeof d === 'object') {
			return d;
		}
		else {
			return new Date(d);
		}
	},

	// pads a string with any character
	pad = function (n, p, c) {
		var pad_char = typeof c !== 'undefined' ? c : '0';
		var pad = new Array(1 + p).join(pad_char);
		return (pad + n).slice(-pad.length);
	},

	// executes passed in function, silently fails on error returning empty string
	silent = function (fn) {
		try {
			return fn()
		}
		catch (e) {
			return '';
		}
	};

	window.DateUtils = {

		format: {
		
			friendly: function (d) {
				return silent(function () {
					var _d = parseDate(d), _dISO = _d.toISOString(), nowISO = new Date().toISOString();

					// today
					if (nowISO.substring(0, 10) === _dISO.substring(0, 10)) {
						return pad(_d.getHours(), 2) + ':' + pad(_d.getMinutes(), 2);
					}
						// date is same year
					else if (nowISO.substring(0, 4) === _dISO.substring(0, 4)) {
						return _d.getDate() + ' ' + months[_d.getMonth()];
					}
						// previous year
					else {
						return _d.getDate() + ' ' + months[_d.getMonth()] + ' ' + _d.getFullYear();
					}
				})				
			},

			full: function (d) {
				return silent(function () {
					var _d = parseDate(d);
					return _d.getDate() + ' ' + months[_d.getMonth()] + ' ' + _d.getFullYear() + ' ' + pad(_d.getHours(), 2) + ':' + pad(_d.getMinutes(), 2);
				});
			},

			short: function (d) {
				return silent(function () {
					var _d = parseDate(d);
					return _d.getDate() + ' ' + months[_d.getMonth()] + ' ' + _d.getFullYear();
				});
			},

			time: function (d) {
				var _d = parseDate(d);
				return pad(_d.getHours(), 2) + ':' + pad(_d.getMinutes(), 2)+ ':' + pad(_d.getSeconds(), 2);
			}

		
		},

		add: function (date, seconds, minutes, hours, days) {
			date = date || new Date();

			date = new Date(date.setSeconds(date.getSeconds() + (seconds || 0)));
			date = new Date(date.setMinutes(date.getMinutes() + (minutes || 0)));
			date = new Date(date.setHours(date.getHours() + (hours || 0)));
			date = new Date(date.setDate(date.getDate() + (days || 0)));

			return date;
		}

	}

})();

