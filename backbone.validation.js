Backbone.Validation = (function(Backbone, _) {
    var builtinValidators = {
        required: function(value, attr, msg) {
            var isEmptyString = _.isString(value) && $.trim(value) === '';
            var isFalseBoolean = _.isBoolean(value) && value === false;
            
            if (_.isNull(value) || _.isUndefined(value) || isEmptyString || isFalseBoolean) {
                return msg || attr + ' is required';
            }
        },
        min: function(value, attr, msg, minValue) {
            if(value < minValue) {
                return msg || attr + ' must be equal to or larger than ' + minValue;
            }
        },
        max: function(value, attr, msg, maxValue) {
            if(value > maxValue) {
                return msg || attr + ' must be equal to or less than ' + maxValue;
            }
        },
        minLength: function(value, attr, msg, minLength){
            value = $.trim(value);
            if(_.isString(value) && value.length < minLength){
                return msg || attr + ' must longer than ' + minLength + ' characters';
            }
        }
    };

    var getValidators = function(view, attr) {
        var validation = view.model.validation[attr];

        if (_.isFunction(validation)) {
            return validation;
        } else {
            var valdations = [];
            for(attr in validation) {
                if(attr !== 'msg' && validation.hasOwnProperty(attr)) {
                    valdations.push({
                        fn: builtinValidators[attr],
                        val: validation[attr],
                        msg: validation['msg']
                    });   
                }
            }
            return valdations;
        }
    };
    
    var validateAttr = function(view, attr, value){
        var validators = getValidators(view, attr);
        
        if(_.isFunction(validators)){
            return validators(value);
        } else {
            var result = '';
            for (var i=0; i < validators.length; i++) {
               var validator = validators[i];
               var res = validator.fn(value, attr, validator.msg, validator.val);
               if(res){
                   result += res;
               }
            };
            return result;
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

        bind: function(view, options) {
            options = options || {};
            var validFn = options.valid || this.valid,
                invalidFn = options.invalid || this.invalid,
                invalidAttrs = view.model.invalidAttrs = view.model.invalidAttrs || [];
             
            view.model.validate = function(attrs) {
                var invalid = false,
                    modelValid = true;
                    
                for (changedAttr in attrs) {
                    delete invalidAttrs[_.indexOf(invalidAttrs, changedAttr)];
                    var result = validateAttr(view, changedAttr, attrs[changedAttr]);

                    if (result) {
                        invalid = true;
                        invalidAttrs.push(changedAttr);
                        invalidFn(view, changedAttr, result);
                    } else {
                        validFn(view, changedAttr);
                    }
                }
                
                view.model.set({isValid: _.compact(invalidAttrs).length === 0}, {silent: true});
                return invalid;
            };
        }
    };
} (Backbone, _));
