Backbone.Validation = (function(Backbone, _) {
    var builtinValidators = {
        required: function(value, attr, msg) {
            if (_.isNull(value) || _.isUndefined(value) || (_.isString(value) && $.trim(value) === '')) {
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
    
    var validate = function(view, attr, value){
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
            var validFn = options.valid || this.valid;
            var invalidFn = options.invalid || this.invalid;
            
            view.model.validate = function(attrs) {
                var invalid = false;
                for (attr in attrs) {
                    var result = validate(view, attr, attrs[attr]);

                    if (result) {
                        invalid = true;
                        invalidFn(view, attr, result);
                    } else {
                        validFn(view, attr);
                    }
                }    

                view.model.set({isValid: !invalid}, {silent: true});
                return invalid;
            };
        }
    };
} (Backbone, _));
