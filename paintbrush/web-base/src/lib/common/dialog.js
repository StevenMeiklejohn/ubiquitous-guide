(function ($) {

	var uid = 1,

	// util method to append dialog to page	
	append = function (opts) {
		$("body").append('<div id="dialog-' + (++uid) + '" style="display:none;"><div class="content"></div></div>');
		$('#dialog-' + uid + ' .content').append(opts.html || '');
	},

	// util method to tidy up a dialog instance
	tidy = function (d) {
		if (d.parents().length) {	// dialog will have no parent elements if it has been removed from the DOM
			d.dialog("close");
			d.dialog("destroy");
			d.remove();
			d.disposed = true;
			if (typeof d.close === "function") { d.close() }
		}
	},

	// wraps each dialog in a helper object which provides callers access to dialog object and util methods
	returnWrapper = function (d, opts) {
		return {
			content: d.find('.content'),
			root: d,
			tidy: function () {
				tidy(d);
				this.disposed = true;
			},
			center: function () {
				d.dialog("option", "position", {
					my: "center",
					at: "center",
					of: window
				});
			},
			position: function (pos) {
				d.dialog("option", "position", pos);
			},
			show: function () {
				d.dialog('open');
			},
			hide: function () {
				d.dialog('close');
			}
		}
	},

	// returns shared config data for all dialog types
	baseConfig = function (opts) {
		return {
			closeText: "",
			modal: true,
			fixed: false,	// fixed position
			minHeight: opts.minHeight || 40,
			minWidth: opts.minWidth || 40,
			maxHeight: opts.maxHeight,
			maxWidth: opts.maxWidth,
			height: opts.height,
			width: opts.width || 'auto',
			resizable: opts.resizable || false,
			title: opts.title || "",
			dialogClass: 'dialog' + (opts.title ? '' : ' notitle') + (opts['class'] ? ' ' + opts['class'] : ''),
			closeOnEscape: opts.closeOnEscape,
			autoOpen: opts.autoOpen,
			draggable: opts.draggable,
			position: opts.position
		}
	};

	// define a generic dialog constructor
	var Dialog = window.Dialog = function (opts) {
		append(opts);	// append dialog html to page
		var d = $("#dialog-" + uid);
		d.close = opts.close;

		if (opts.directive) {
			var el = angular.element('<div ' + opts.directive + '></div>');
			d.find('.content').html('').append(el);
			//opts.$compile(el)(opts.$scope);
		}

		if (opts.template) {
			d.find('.content').html(opts.template);
		}

		if (opts.buttons) {

			// wrap button callback functions with a tidy dialog call
			for (var i in opts.buttons) {
				(function (_fn) {
					var _wrap = function () {
						_fn.apply(_d, arguments);
						if (opts.autoClose !== false) {
							tidy(d);
						}
					}
					opts.buttons[i].onclick = _wrap;
				})(opts.buttons[i].onclick || function () { })
			}

			d.append('<div class="buttons"></div>');

			opts.buttons.forEach(function (button) {
				button.icon = button.icon || {};
				d.find('.buttons').append(
					'<a class="button' + (button.class ? ' ' + button.class : '') + (button.icon.right ? ' icon-right' : '') + '">' +
					(button.icon.left ? '<i class="' + button.icon.left + '"></i>' : '') +
					(button.text ? '<span>' + button.text + '</span>' : '') +
					(button.icon.right ? '<i class="' + button.icon.right + '"></i>' : '') +
					'</a>'
				).find('.button').last().click(button.onclick);
			});

		}

		d.dialog(baseConfig(opts));
		var _d = returnWrapper(d, opts);

		d.parent().css('position', opts.fixed === false ? 'absolute' : 'fixed');
		_d.center();

		if (opts.onload) {
			opts.onload.call(_d);
			_d.center();
		}


		if (opts.directive) {
			//var el = angular.element('<div ' + opts.directive + '></div>');
			//d.find('.content').html('').append(el);
			opts.$scope.dialog = _d;
			opts.$compile(el)(opts.$scope);
		}


		return _d;
	};

	// preset confirm dialog
	Dialog.Confirm = function (opts) {
		opts.title = opts.title || "Confirm";
		opts.buttons = [{
			text: 'Yes',
			'class': 'sky-blue',
			icon: { left: 'fa fa-check' },
			onclick: function () {
				if (typeof opts.accept === "function") opts.accept();
			}
		}, {
			text: 'No',
			'class': 'orange',
			icon: { left: 'fa fa-times' },
			onclick: function () {
				if (typeof opts.reject === "function") opts.reject();
			}
		}];
		var _d = new Dialog(opts);
		return _d;
	};

	// preset info dialog
	Dialog.Info = function (opts) {
		opts.buttons = [{
			text: 'OK',
			'class': 'sky-blue',
			icon: { left: 'fa fa-thumbs-o-up' }
		}];
		var _d = new Dialog(opts);
		return _d;
	}

	// enable html within jquery dialog titles
	$.widget("ui.dialog", $.extend({}, $.ui.dialog.prototype, {
		_title: function (title) {
			if (!this.options.title) {
				title.html("&#160;");
			} else {
				title.html(this.options.title);
			}
		}
	}));



})(jQuery);