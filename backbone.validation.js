// Backbone.Validation v0.3.1
//
// Copyright (C)2011 Thomas Pedersen
// Distributed under MIT License
//
// Documentation and full license availabe at:
// http://github.com/thedersen/backbone.validation

Backbone.Validation = (function(Backbone, _, undefined) {
    var defaultSelector = 'name';
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

        var validationElements = model.validation[attr], validators = [], validationElement, validation;

        if( ! _.isArray(validationElements)) {
            validationElements = [validationElements];
        }

        for (var i = 0, l = validationElements.length; i < l; i++) {
            validation = validationElements[i];

            if (_.isFunction(validation)) {
                validators.push( validation);
            } else if(_.isString(validation)) {
                validators.push( model[validation]);
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
            }
        }

        return validators;
    };

    var validateAttr = function(model, attr, value) {
        var validatorsArray = getValidators(model, attr),
            error = '',
            errors = [],
            validator, 
            result;

        for( var index=0, count=validatorsArray.length; index<count; index++)
        {
            validator = validatorsArray[index];

            if (_.isFunction(validator)) {
                result = validator.call(model, value, attr);
                if (result) errors.push(result);
            } else {
                result = validator.fn(value, attr, validator.val, model);
                if (result) {
                    errors.push( validator.msg || result);
                }
            }
        }

        if (errors.length == 0) return false;

        return errors;
    };
    
    return {
        version: '0.3.1',

        setDefaultSelector: function(selector){
            defaultSelector = selector;
        },
        
        bind: function(view, options) {
            options = options || {};
            var model = view.model,
                delayTrigger,
                selector = options.selector || defaultSelector,
                validFn = options.valid || Backbone.Validation.callbacks.valid,
                invalidFn = options.invalid || Backbone.Validation.callbacks.invalid,
                isValid = _.isUndefined(model.validation);
            
            model.validate = function(attrs) {
                if(!attrs){
                    return model.validate.call(model, _.extend(getValidatedAttrs(model), model.toJSON()));
                }
                
                var result = [], invalidAttrs = [];
                isValid = true;

                for (var changedAttr in attrs) {
                    var errors = validateAttr(model, changedAttr, attrs[changedAttr]);
                    if (errors) {
                        for( var index=0, count=errors.length; index<count; index++)
                        {
                            result.push(errors[index]);
                            invalidAttrs.push(changedAttr);
                            isValid = false;

                            if( errors.length == 1) {
                                invalidFn(view, changedAttr, errors[0], selector);
                            } else {
                                invalidFn(view, changedAttr, errors, selector);
                            }
                        }
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
                
                if (result.length === 1) {
                    return result[0];
                }
                if (result.length > 1) {
                    return result;
                }
            };
            
            model.isValid = function() {
                return isValid;
            };
        },

        unbind: function(view) {
            view.model.validate = undefined;
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
    email: /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/,
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
        			return text == null ? '' : String.prototype.trim.call(text);
        		} :
        		function(text) {
        		    var trimLeft = /^\s+/,
                        trimRight = /\s+$/;
        
        			return text == null ? '' : text.toString().replace(trimLeft, '').replace(trimRight, '');
        		};
    var format = function() {
        var args = Array.prototype.slice.call(arguments);  
        var text = args.shift();
        return text.replace(/{(\d+)}/g, function(match, number) { 
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
        required: function(value, attr, required, model) {
            var isRequired = _.isFunction(required) ? required.call(model) : required;
            if(!isRequired && (!hasValue(value))) {
                return false; // overrides all other validators
            }
            if (isRequired && !hasValue(value)) {
                return format(messages.required, attr);
            }
        },
        acceptance: function(value, attr) {
            if(!_.isBoolean(value) || value === false){
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
            var length = trim(value).length;
            if(!hasValue(value) || length < range[0] || length > range[1]) {
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