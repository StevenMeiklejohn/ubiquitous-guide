(function ($) {

	var Tabs = window.Tabs = function (root, opts) {
		opts = opts || {};

		var me = this;
		me.root = root;
		me.opts = opts;

		var event = opts.event || {};

		var c_selected = 'selected',
			c_visible = 'visible',
			c_panel = 'tab-panel',
			c_navitem = 'tab-nav-item',
			c_nav = 'tab-nav';
		

		root.find('> div').addClass(c_panel).hide().each(function (i) {
			$(this).data('index', i);
		});
		root.find('> div').addClass(c_visible).first().show();
		root.find('> ul').addClass(c_nav);
		root.find('> ul > li').first().addClass(c_selected);
		root.find('> ul > li').addClass(c_navitem).each(function (i) {
			$(this).data('index', i);
		}).click(function () {
			root.find('.' + c_navitem).removeClass(c_selected);
			$(this).addClass(c_selected);

			me.selected = $(this).data('index') * 1;
			me.activeTab = $(this);
			me.activePanel = root.find('> div:nth-child(' + ((me.selected) + 2) + ')');

			root.find('> div').removeClass(c_visible).hide();
			me.activePanel.addClass(c_visible).show();

			if (event.change) {
				event.change(root.find(c_visible));
			}
		});

		// shows the specified tab (by name or index)
		me.show = function (name) {
			if (typeof name === 'number') {
				root.find('> ul > li:nth-child(' + name + ')').click();
			}
			else {
				root.find('> ul > li:contains("' + name + '")').click();
			}
		}

		root.find('> ul > li:first-child').click();

		return me;
	}

})(jQuery);