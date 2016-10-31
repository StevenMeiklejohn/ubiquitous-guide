(function ($) {

	var Form = window.Form = function (root, opts) {
		opts = opts || {};

		this.root = root;
		this.opts = opts;

		var self = this;

		// append any form helpers
		root.prepend('<div class="messages global"></div>');

		// returns all data currently present in the form
		this.getData = function () {
			var inputs = root.find('input, select, textarea').not('.validation-shim');
			var data = inputs.serializeObject();

			inputs.filter("[disabled]").each(function () {
				data[$(this).attr("name")] = $(this).val();
			});

			// include all checkboxes in data - browser's default behaviour will only serialize ticked checkboxes
			inputs.filter("[type=checkbox]").not('.multi-select .values input').each(function () {
				data[$(this).attr("name")] = $(this).prop("checked");
			});


			// apply datatypes specified in options if present
			for (var i in (opts.field || {})) {
				var field = opts.field[i],
					value = data[i];

				var format = function (_value) {
					if (_value) {
						switch (field.type) {
							case 'bool':
								if (typeof _value !== 'boolean') {
									_value = (!_value || _value.toLowerCase() === 'false') ? false : true;
								}
								break;
							case 'number':
								_value = isNaN(_value * 1) ? null : _value * 1;
								break;
							case 'json':
								_value = JSON.parse(_value);
								break;
						}
					}
					return _value;
				};

				if (field.isArray && !$.isArray(value)) {
					value = [value];
				}

				if ($.isArray(value)) {
					var unique = [];
					for (var j in value) {
						if (unique.indexOf(value[j]) < 0) {
							unique.push(format(value[j]));
						}
					}
					value = unique;
				}
				else {
					value = format(value);
				}

				data[i] = value;
			}

			// apply grouping to data
			var _data = {};
			for (var name in data) {
				var _group = inputs.filter('[name=' + name + ']').data('group');
				if (_group) {
					_data[_group] = _data[_group] || {};
					_data[_group][name] = data[name]
				}
				else {
					_data[name] = data[name];
				}
			}


			return _data;
		};


		this.getValidationErrors = function () {
			var inputs = root.find('input, select, textarea'),
				validationErrors = [],
				processed = {};

			inputs.each(function () {
				var _name = $(this).attr('name');

				if (!this.validity.valid && !processed[_name]) {
					processed[_name] = 1;

					var _error = {
						el: $(this),
						Name: root.find('[for="' + _name + '"]').text() || _name,	// attempt to use label text when referring to field
						Message: this.validationMessage
					};

					validationErrors.push(_error);
				}
			});

			return validationErrors;
		};

		// checks if form is currently valid
		this.isValid = function () {
			return this.getValidationErrors().length < 1;
		};

		this.displayValidationErrors = function (errors) {
			this.hideMessage();

			var _errors = errors || this.getValidationErrors();
			var _message = '';

			if (!opts.errors || opts.errors.top) {
				_errors.forEach(function (error) {
					_message += '<div class="row"><strong>' + error.Name + ':</strong><span>' + error.Message + '</span></div>';
				});
				this.displayMessage('error', _message);
			}

			if (opts.errors && opts.errors.inline) {
				_errors.forEach(function (error) {
					self.displayInlineMessage(error.el, 'error', error.Message);
				});
				if (!opts.errors.top && opts.autoScroll) {
					focusFirstMessage();
				}
			}



			root.addClass('validated');
		};


		var focusFirstMessage = function() {
			var _target = root.find('.message').first();
			if (_target.size()) {
				$('html, body').animate({
					scrollTop: _target.offset().top - 10
				}, 500);
			}
		};

		// clears all messages after a specific period of time has passed
		// - calling multiple times resets the timer
		var clearMessageTimeout,
			clearMessages = function () {
				clearTimeout(clearMessageTimeout);
				clearMessageTimeout = setTimeout(function () {

					root.find('.message').not('.static').fadeOut(500, function () {
						$(this).remove();
					});

				}, 60000);
			};

		// clears the specified error(s) immediately
		this.clearMessage = function (type, el) {
			var _messages;

			if (el) {
				if (el.hasClass('.message')) {
					_messages = el;
				}
				else {
					_messages = el.parents('.field').find('.message');
				}
			}
			else if (type === 'all' || type === 'top') {
				_messages = root.find('.message.global');
			}
			else if (type === 'all' || type === 'inline') {
				_messages = root.find('.message.inline');
			}
			
			_messages.remove();
		};


		// displays a message box at top of the form
		this.displayMessage = function (type, message) {
			
			var _messages = root.find('.messages.global');
			if (message) {
				_messages.html('<div class="message ' + type + '" style="display:none;">' + message + '</div>');
			}

			var _message = _messages.find('.message');
			_message.fadeIn(150);

			if (opts.autoScroll) {
				focusFirstMessage();
			}

			clearMessages();
		};


		// displays an inline error message
		this.displayInlineMessage = function (input, type, message) {

			if (input) {
				var _top = !input.is(':visible') ? 5 : input.position().top;
				input.first().after('<div class="message ' + type + ' inline" style="position:absolute;top:' + _top + 'px;right:-290px;width:250px;">' + message + '</div>');
			}

			clearMessages();

		};

		// hides the message box at top of the form
		this.hideMessage = function () {
			root.find('.message').not('.static').remove();
		};



		// form widgets init code
		var widget = {
			
			multiSelect: function() {
				var el = $(this);
				el.addClass('multi-select');
				el.append('<div class="count"></div>');

				el.before('<input class="validation-shim" style="display:none;" name="' + (el.data('name') || '') + '" />');
				var _shim = el.prev();

				setTimeout(function () {
					var _min = el.data('min') || 0,
						_max = el.data('max') || -1,
						_count = el.find('.count');

					el.find('.values > div > input:not(:checked)').after('<i class="fa fa-circle-thin"></i>');
					el.find('.values > div > input:checked').after('<i class="fa fa-circle"></i>');

					el.find('.values > div').click(function (e) {
						var _input = $(this).find('input'), _icon = $(this).find('i');

						if (e.target.nodeName !== 'INPUT') {
							_input.click();
						}

						var _checked = _input.is(':checked');
						_icon.toggleClass('fa-circle-thin', !_checked).toggleClass('fa-circle', _checked);

						if (window.getSelection) window.getSelection().removeAllRanges();
						else if (document.selection) document.selection.empty();
					});

					var _inputs = el.find('input');
					_inputs.change(function () {
						var _selected = _inputs.filter(':checked').size();

						if (_selected < _min) {
							_shim[0].setCustomValidity('Please select a minimum of ' + _min + ' item' + (_min == 1 ? '' : 's') + '.');
							el.toggleClass('invalid', true);
						}
						else if (_max > 0 && _selected > _max) {
							_shim[0].setCustomValidity('Please select a maximium of ' + _max + ' item' + (_max == 1 ? '' : 's') + '.');
							el.toggleClass('invalid', true);
						}
						else {
							_shim[0].setCustomValidity('');
							el.toggleClass('invalid', false);
						}

						_count.html(
							//(_min > 0 ? '<span>Min: ' + _min + '</span>' : '') +
							(_max > 0 ? '<span>Max: ' + _max + '</span>' : '') +
							'<span>Selected: <strong>' + _selected + '</strong></span>'
						);

						//el.toggleClass('invalid', !el.find('input:checked').size());
						$(this).parent().toggleClass('checked', $(this).is(':checked'));
					})
					.first().change();

					// wait for next digest cycle to finish
					setTimeout(function () {
						el.find('input:checked').change();
					}, 100);
				}, 10);
			},

			//select: function() {
			//	var el = $(this);
			//	el.change(function() {
			//		el.toggleClass('placeholder', !!el.val());
			//	})
			//	el.toggleClass('placeholder', !!el.val());
			//},

			tag: function() {
				var el = $(this);
				el.addClass('tags');

				el.before('<input class="validation-shim" style="display:none;" name="' + (el.data('name') || '') + '" />');
				var _shim = el.prev();

				var _values = el.find('.values');
				_values.after('<div class="button-wrap"><a class="button blue"><i class="fa fa-plus"></i><span class="text">' + (el.data('button-text') || 'Tag') + '</span></a></div>');

				var _name = el.data('name'),
					_min = (el.data('min') || '0') * 1,
					_max = (el.data('max') || '0') * 1,
					_group = el.data('group') || '',
					_buttonAdd = el.find('.button-wrap .button'),

				_appendInput = function () {
					_values.append('<input name="' + _name + '" type="text" data-group="' + _group + '" />');
					return _values.find('input:last');
				},

				_wireInput = function (_input) {
					_input.wrap('<div class="input-wrap" />');
					var _wrap = _input.parent();

					//if (!_wrap.is(':first-child') || _min < 1) {
						_input.after('<i class="remove fa fa-times"></i>');
					//}
					_input.change(_validate);

					_input.keydown(function (e) {
						var _val = _input.val();

						if (e.key === 'Backspace') {
							var totalInputs = _values.find('input').size();

							// if > min inputs and this input is empty remove it
							if (!_val && totalInputs > 1 && (!_min || totalInputs > _min)) {
								_wrap.find('.remove').click();
								e.preventDefault();
							}
						}
					});

					_input.keyup(function (e) {
						var _val = _input.val();

						if (e.key === ',') {
							// strip comma from value
							_input.val(_val.replace(/,/g, ''));

							// if input contains a value click on the add button
							if (_val.length > 1) {
								_buttonAdd.click();
							}
						}
						else if (e.ctrlKey && e.key === 'v') {

							// if pasted value was a comma separated list split into multiple fields
							var _parts = _input.val().split(','), c = 0;
							if (_parts.length > 1) {
								_parts.forEach(function (part) {
									var _part = part.trim();
									if (_part) {
										if (!c) {
											_input.val(_part)
										}
										else {
											_buttonAdd.click();
											_values.find('> .input-wrap:last input').val(_part);
										}
										c++;
									}
								})
							}

						}

					});

					
					_wrap.find('.remove').click(function () {
						_focusInput(_wrap.prev().find('input'));
						_wrap.remove();
						_toggleAddButton();
						_validate();
					});

					// bind autocomplete widget?

					// opts.field[id].provider
				},

				// focuses the specified input field within the values container
				_focusInput = function (_input) {
					if (_input) {
						var _v = _input.val();
						_input.focus().val('').val(_v); // re-setting the value moves cursor to the end of the input
					}
				},

				_toggleAddButton = function () {
					var totalInputs = _values.find('input').size();
					el[totalInputs % 2 ? 'addClass' : 'removeClass']('odd');

					if (_max && totalInputs >= _max) {
						_buttonAdd.hide();
					}
					else {
						_buttonAdd.show();
					}
				},

				_validate = function () {

					var _entered = 0;
					_values.find('input').each(function () {
						_entered += $(this).val() ? 1 : 0;
					});

					if (_entered < _min) {
						_shim[0].setCustomValidity('Please enter a minimum of ' + _min + ' tag' + (_min == 1 ? '' : 's') + '.');
						el.toggleClass('invalid', true);
					}
					else if (_max > 0 && _entered > _max) {
						_shim[0].setCustomValidity('Please enter a maximium of ' + _max + ' tag' + (_max == 1 ? '' : 's') + '.');
						el.toggleClass('invalid', true);
					}
					else {
						_shim[0].setCustomValidity('');
						el.toggleClass('invalid', false);
					}

				};

				_values.find('input').each(function () {
					_wireInput($(this));					
				});

				_buttonAdd.click(function () {

					var totalInputs = _values.find('input').size(),
						lastVal =_values.find('> .input-wrap:last input').val();

					// check if last input contains a value and we have not exceeded max values
					if (!totalInputs || (lastVal.length && (!_max || totalInputs < _max))) {
						_wireInput(_appendInput());
						_toggleAddButton();
						_validate();
					}

					_focusInput(_values.find('> .input-wrap:last input'));
				});

				_validate();
				_toggleAddButton();

				if (_values.find('input').size() < 1) {
					_buttonAdd.click();
				}
			}

		};


		// initialise widgets
		root.find('[widget=multi-select]').each(widget.multiSelect);
		root.find('[widget=tags]').each(widget.tag);
		//root.find('select').each(widget.select);



		// disable default browser validation bubble messages
		root.find("input").on("invalid", function (e) {
			e.preventDefault();
		});

		// focus first field within form
		if (opts.autoFocus !== false) {
			setTimeout(function () {
				var _input = root.find('.field:first').find('input, textarea').first(), _v = _input.val();
				_input.focus().val('').val(_v);
			}, 10)
		}

		return this;
	}

})(jQuery);