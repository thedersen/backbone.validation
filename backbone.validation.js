// Backbone.Validation v0.4.0
//
// Copyright (C)2011 Thomas Pedersen
// Distributed under MIT License
//
// Documentation and full license availabe at:
// http://github.com/thedersen/backbone.validation

Backbone.Validation = (function(Backbone, _, undefined) {
    var defaultOptions = {
        forceUpdate: false,
        selector: 'name'
    };

    var getValidatedAttrs = function(model){
        return _.reduce(_.keys(model.validation), function(memo, key){
            memo[key] = undefined;
            return memo;
        }, {});
    };

    var getValidators = function(model, attr) {
        var validation = model.validation[attr] || {};

        if (_.isFunction(validation)) {
            return validation;
        } else if(_.isString(validation)) {
            return model[validation];
        } else if(!_.isArray(validation)) {
            validation = [validation];
        }

        return _.reduce(validation, function(memo, validation){
            _.each(_.without(_.keys(validation), 'msg'), function(validator){
                memo.push({
                    fn: Backbone.Validation.validators[validator],
                    val: validation[validator],
                    msg: validation.msg
                });
            });
            return memo;
        }, []);
    };

    var validateAttr = function(model, attr, value) {
        var validators = getValidators(model, attr);

        if (_.isFunction(validators)) {
            return validators.call(model, value, attr);
        }

        return _.reduce(validators, function(memo, validator){
            var result = validator.fn(value, attr, validator.val, model);
            if(result === false || memo === false) {
                return false;
            }
            if (result && !memo) {
                return validator.msg || result;
            }
            return memo;
        }, '');
    };
       
    return {
        version: '0.4.0',

        configure: function(options) {
            _.extend(defaultOptions, options);
        },
        
        bind: function(view, options) {
            options = options || {};
            var model = view.model,
                forceUpdate = options.forceUpdate || defaultOptions.forceUpdate,
                selector = options.selector || defaultOptions.selector,
                validFn = options.valid || Backbone.Validation.callbacks.valid,
                invalidFn = options.invalid || Backbone.Validation.callbacks.invalid,
                isValid = _.isUndefined(model.validation) ? true : undefined;
            
            model.validate = function(attrs) {
                if(!attrs){
                    return model.validate.call(model, _.extend(getValidatedAttrs(model), model.toJSON()));
                }
                
                var result = [],
                    invalidAttrs = [];
                    isValid = true;

                for (var changedAttr in attrs) {
                    var error = validateAttr(model, changedAttr, attrs[changedAttr]);
                    if (error) {
                        result.push(error);
                        invalidAttrs.push(changedAttr);
                        isValid = false;
                        invalidFn(view, changedAttr, error, selector);
                    } else {
                        validFn(view, changedAttr, selector);
                    }
                }

                if (isValid) {
                    for (var validatedAttr in model.validation) {
                        if (_.isUndefined(attrs[validatedAttr]) && validateAttr(model, validatedAttr, model.get(validatedAttr))) {
                            isValid = false;
                            break;
                        }
                    }
                }
                
                _.defer(function() {
                    model.trigger('validated', isValid, model, invalidAttrs);
                    model.trigger('validated:' + (isValid ? 'valid' : 'invalid'), model, invalidAttrs);
                });

                if(forceUpdate) {
                    return;
                }
                
                if (result.length === 1) {
                    return result[0];
                }
                if (result.length > 1) {
                    return result;
                }
            };
            
            model.isValid = function(forceValidation) {
                if(forceValidation) {
                    this.validate();
                }
                return isValid;
            };
        },

        unbind: function(view) {
            delete view.model.validate;
            delete view.model.isValid;
        }
    };
} (Backbone, _));

Backbone.Validation.callbacks = {
    valid: function(view, attr, selector) {
        view.$('[' + selector + '~=' + attr + ']')
            .removeClass('invalid')
            .removeAttr('data-error');
    },

    invalid: function(view, attr, error, selector) {
        view.$('[' + selector + '~=' + attr + ']')
            .addClass('invalid')
            .attr('data-error', error);
    }
};

Backbone.Validation.patterns = {
    digits: /^\d+$/,
    number: /^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/,
    email: /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i,
    url: /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i
};

Backbone.Validation.messages = {
    required: '{0} is required',
    acceptance: '{0} must be accepted',
    min: '{0} must be grater than or equal to {1}',
    max: '{0} must be less than or equal to {1}',
    range: '{0} must be between {1} and {2}',
    length: '{0} must be {1} characters',
    minLength: '{0} must be at least {1} characters',
    maxLength: '{0} must be at most {1} characters',
    rangeLength: '{0} must be between {1} and {2} characters',
    oneOf: '{0} must be one of: {1}',
    equalTo: '{0} must be the same as {1}',
    pattern: '{0} must be a valid {1}'
};

Backbone.Validation.validators = (function(patterns, messages, _) {
    var trim = String.prototype.trim ?
                function(text) {
                    return text === null ? '' : String.prototype.trim.call(text);
                } :
                function(text) {
                    var trimLeft = /^\s+/,
                        trimRight = /\s+$/;
        
                    return text === null ? '' : text.toString().replace(trimLeft, '').replace(trimRight, '');
                };
    var format = function() {
        var args = Array.prototype.slice.call(arguments);
        var text = args.shift();
        return text.replace(/\{(\d+)\}/g, function(match, number) {
            return typeof args[number] != 'undefined' ? args[number] : match;
        });
    };
    var isNumber = function(value){
        return _.isNumber(value) || (_.isString(value) && value.match(patterns.number));
    };
    var hasValue = function(value) {
        return !(_.isNull(value) || _.isUndefined(value) || (_.isString(value) && trim(value) === ''));
    };
            
    return {
        fn: function(value, attr, fn, model) {
            if(_.isString(fn)){
                fn = model[fn];
            }
            return fn.call(model, value, attr);
        },
        required: function(value, attr, required, model) {
            var isRequired = _.isFunction(required) ? required.call(model) : required;
            if(!isRequired && !hasValue(value)) {
                return false; // overrides all other validators
            }
            if (isRequired && !hasValue(value)) {
                return format(messages.required, attr);
            }
        },
        acceptance: function(value, attr) {
            if(value !== 'true' && (!_.isBoolean(value) || value === false)) {
                return format(messages.acceptance, attr);
            }
        },
        min: function(value, attr, minValue) {
            if (!isNumber(value) || value < minValue) {
                return format(messages.min, attr, minValue);
            }
        },
        max: function(value, attr, maxValue) {
            if (!isNumber(value) || value > maxValue) {
                return format(messages.max, attr, maxValue);
            }
        },
        range: function(value, attr, range) {
            if(!isNumber(value) || value < range[0] || value > range[1]) {
                return format(messages.range, attr, range[0], range[1]);
            }
        },
        length: function(value, attr, length) {
            if (!hasValue(value) || trim(value).length !== length) {
                return format(messages.length, attr, length);
            }
        },
        minLength: function(value, attr, minLength) {
            if (!hasValue(value) || trim(value).length < minLength) {
                return format(messages.minLength, attr, minLength);
            }
        },
        maxLength: function(value, attr, maxLength) {
            if (!hasValue(value) || trim(value).length > maxLength) {
                return format(messages.maxLength, attr, maxLength);
            }
        },
        rangeLength: function(value, attr, range) {
            if(!hasValue(value) || trim(value).length < range[0] || trim(value).length > range[1]) {
                return format(messages.rangeLength, attr, range[0], range[1]);
            }
        },
        oneOf: function(value, attr, values) {
            if(!_.include(values, value)){
                return format(messages.oneOf, attr, values.join(', '));
            }
        },
        equalTo: function(value, attr, equalTo, model) {
            if(value !== model.get(equalTo)) {
                return format(messages.equalTo, attr, equalTo);
            }
        },
        pattern: function(value, attr, pattern) {
            if (!hasValue(value) || !value.toString().match(patterns[pattern] || pattern)) {
                return format(messages.pattern, attr, pattern);
            }
        }
    };
} (Backbone.Validation.patterns, Backbone.Validation.messages, _));
