Backbone.Validation = (function() {
	var validators = {
		required: function(val, attr, msg) {
			if (!val) {
				return msg || attr + ' is required';
			}
		}
	};

	var getValidator = function(view, attr) {
		var val = view.model.validation[attr];

        if (typeof val === 'function') {
			return {
			    fn: val
			};
		} else {
			return {
			    fn: validators['required'],
			    msg: val['msg']
		    };
		}
	};

	return {
		version: '0.0.1',
		valid: function(view, attr) {
			view.$('#' + attr).removeClass('invalid');
			view.$('#' + attr).removeData('error');
		},
		invalid: function(view, attr, error) {
			view.$('#' + attr).data('error', error);
			view.$('#' + attr).addClass('invalid');
		},

		bind: function(view) {
			var that = this;
			view.model.validate = function(attrs) {
				for (attr in attrs) {
				    var val = getValidator(view, attr);
					var result = val['fn'](attrs[attr], attr, val['msg']);

					if (result) {
						that.invalid(view, attr, result);
					} else {
						that.valid(view, attr);
					}
					
					return result;
				}
			};
		}
	};
} ());
