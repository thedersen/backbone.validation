// Backbone.Validation v0.2.0
//
// Copyright (C)2011 Thomas Pedersen
// Distributed under MIT License
//
// Documentation and full license availabe at:
// http://github.com/thedersen/backbone.validation

Backbone.Validation = (function(Backbone, _, undefined) {
    var getValidatedAttrs = function(model){
        var validatedAttrs = {};
        for (var attr in model.validation) {
            if(model.validation.hasOwnProperty(attr)){
                validatedAttrs[attr] = undefined;
            }
        }
        return validatedAttrs;      
    };
    
    var getValidators = function(model, attr) {
        var validation = model.validation[attr],
            validators = [];

        if (_.isFunction(validation)) {
            return validation;
        } else if(_.isString(validation)) {
            return model[validation];
        } else {
            for (var validator in validation) {
                if (validator !== 'msg' && validation.hasOwnProperty(validator)) {
                    validators.push({
                        fn: Backbone.Validation.validators[validator],
                        val: validation[validator],
                        msg: validation.msg
                    });
                }
            }
            return validators;
        }
    };

    var validateAttr = function(model, attr, value) {
        var validators = getValidators(model, attr),
            error = '',
            validator, 
            result;

        if (_.isFunction(validators)) {
            return validators.call(model, value);
        } else {
            for (var i = 0; i < validators.length; i++) {
                validator = validators[i];
                result = validator.fn(value, attr, validator.val, model);
                if(result === false) {
                    return '';
                }
                else if (result) {
                    error += validator.msg || result;
                }
            };
            return error;
        }
    };

    return {
        version: '0.2.0',

        bind: function(view, options) {
            options = options || {};
            var model = view.model,
                validFn = options.valid || Backbone.Validation.callbacks.valid,
                invalidFn = options.invalid || Backbone.Validation.callbacks.invalid;

            model.validate = function(attrs) {
                if(!attrs){
                    return model.validate.call(model, _.extend(getValidatedAttrs(model), model.toJSON()));
                }
                
                var isValid = true,
                    error;

                for (var changedAttr in attrs) {
                    if (changedAttr === 'isValid') {
                        return false;
                    }

                    error = validateAttr(model, changedAttr, attrs[changedAttr]);
                    if (error) {
                        invalidFn(view, changedAttr, error);
                    } else {
                        validFn(view, changedAttr);
                    }
                }

                if (error) {
                    model.set({
                        isValid: false
                    });
                } else {
                    for (var validatedAttr in model.validation) {
                        if (_.isUndefined(attrs[validatedAttr]) && validateAttr(model, validatedAttr, model.get(validatedAttr))) {
                            isValid = false;
                            break;
                        }
                    }
                    model.set({
                        isValid: isValid
                    });
                }

                return error;
            };
        },

        unbind: function(view) {
            view.model.validate = undefined;
        }
    };
} (Backbone, _));

Backbone.Validation.callbacks = {
    valid: function(view, attr) {
        view.$('#' + attr).removeClass('invalid');
        view.$('#' + attr).removeAttr('data-error');
    },

    invalid: function(view, attr, error) {
        view.$('#' + attr).addClass('invalid');
        view.$('#' + attr).attr('data-error', error);
    }
};

Backbone.Validation.patterns = {
    number: /^-?\d+$/,
    email: /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,
    url: /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i
};

Backbone.Validation.validators = (function(patterns, _) {
    var trim = String.prototype.trim ?
    		function(text) {
    			return text == null ?
    				"" :
    				String.prototype.trim.call(text);
    		} :
    		function(text) {
    		    var trimLeft = /^\s+/,
                    trimRight = /\s+$/;
                    
    			return text == null ?
    				"" :
    				text.toString().replace(trimLeft, "").replace(trimRight, "");
    		};
    var isNumber = function(value){
        return _.isNumber(value) || (_.isString(value) && value.match(patterns.number));
    };
    var hasValue = function(value) {
        return !(_.isNull(value) || _.isUndefined(value) || (_.isString(value) && trim(value) === ''));
    };
    		
    return {
        required: function(value, attr, required) {
            if(!required && (!hasValue(value))) {
                return false; // overrides all other validators
            }
            if (required && !hasValue(value)) {
                return attr + ' is required';
            }
        },
        acceptance: function(value, attr) {
            if(!_.isBoolean(value) || value === false){
                return attr + ' must be accepted';
            }
        },
        min: function(value, attr, minValue) {
            if (!isNumber(value) || value < minValue) {
                return attr + ' must be larger than or equal to ' + minValue;
            }
        },
        max: function(value, attr, maxValue) {
            if (!isNumber(value) || value > maxValue) {
                return attr + ' must be less than or equal to ' + maxValue;
            }
        },
        range: function(value, attr, range) {
            if(!isNumber(value) || value < range[0] || value > range[1]) {
                return attr + ' must be within range ' + range.toString();
            }
        },
        length: function(value, attr, length) {
            value = trim(value);
            if (!hasValue(value) || value.length !== length) {
                return attr + ' must have exact ' + length + ' characters';
            }  
        },
        minLength: function(value, attr, minLength) {
            if (!hasValue(value) || trim(value).length < minLength) {
                return attr + ' must be longer than or equal to ' + minLength + ' characters';
            }
        },
        maxLength: function(value, attr, maxLength) {
            if (!hasValue(value) || trim(value).length > maxLength) {
                return attr + ' must be shorter than or equal to' + maxLength + ' characters';
            }
        },
        rangeLength: function(value, attr, range) {
            var length = trim(value).length;
            if(!hasValue(value) || length < range[0] || length > range[1]) {
                return 'Length of ' + attr + ' must be within range ' + range.toString();
            }
        },
        equalTo: function(value, attr, equalTo, model) {
            if(value !== model.get(equalTo)) {
                return attr + ' does not equal ' + equalTo;
            }
        },
        pattern: function(value, attr, pattern) {
            pattern = patterns[pattern] || pattern;
            if (!hasValue(value) || !value.toString().match(pattern)) {
                return attr + ' is not a valid ' + pattern;
            }
        }
    };
} (Backbone.Validation.patterns, _));
