Backbone.Validation = (function() {
	var validators = {
		required: function(val) {
			if (!val) {
				return "Required";
			}
		}
	};

	var getValidator = function(view, attr) {
		var val = view.model.validation[attr];

        if (typeof val === 'function') {
			return val;
		} else {
			return validators['required'];
		}
	};

	return {
		version: '0.0.1',
		valid: function(view, attr) {
			view.$("#" + attr).removeClass("invalid");
		},
		invalid: function(view, attr, error) {
			view.$("#" + attr).data['error'] = error;
			view.$("#" + attr).addClass("invalid");
		},

		bind: function(view) {
			var that = this;
			view.model.validate = function(attrs) {
				for (attr in attrs) {
					var result = getValidator(view, attr)(attrs[attr]);

					if (result) {
						that.invalid(view, attr, result);
					} else {
						that.valid(view, attr);
					}
				}
			};
		}
	};
} ());
