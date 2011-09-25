Backbone.Validation = (function() {
	var validators = {
		required: function(value, attr, msg) {
			if (_.isNull(value) || _.isUndefined(value) || (_.isString(value) && value.trim() === '')) {
				return msg || attr + ' is required';
			}
		},
        min: function(value, attr, msg, minValue) {
            if(value < minValue) {
                return attr + ' must be equal to or larger than ' + minValue;
            }
        },
        max: function(value, attr, msg, maxValue) {
            if(value > maxValue) {
                return attr + ' must be equal to or less than ' + maxValue;
            }
        }
	};

	var getValidator = function(view, attr) {
		var val = view.model.validation[attr];

        if (_.isFunction(val)) {
			return {
			    fn: val
			};
		} else {
		    for(v in val) {
    			return {
    			    fn: validators[v],
    			    val: val[v],
    			    msg: val['msg']
    		    };   
		    }
		    return undefined;
		}
	};
	
	var validate = function(view, attr, value){
	    var val = getValidator(view, attr);
	    return val['fn'](value, attr, val['msg'], val['val']);
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
					var result = validate(view, attr, attrs[attr]);

					if (result) {
						that.invalid(view, attr, result);
					} else {
						that.valid(view, attr);
					}
					
					return result;
				}
				return undefined;
			};
		}
	};
} ());
