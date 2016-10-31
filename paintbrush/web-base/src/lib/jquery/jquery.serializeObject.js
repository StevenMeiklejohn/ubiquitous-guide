(function ($) {

	$.fn.serializeObject = function (opt) {
		var o = {},
		a = this.serializeArray(),
		opt = opt || {};

		$.each(a, function () {
			var name = this.name;
			if (opt.remove) {
				name = name.replace(opt.remove, "");
			};
			if (opt.prefix) {
				name = opt.prefix + name;
			};
			if (o[name] !== undefined) {
				if (!o[name].push) {
					o[name] = [o[name]];
				}
				o[name].push(this.value || '');
			} else {
				o[name] = this.value || '';
			}
		});
		return o;
	};

})(jQuery);