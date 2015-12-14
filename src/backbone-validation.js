Backbone.Validation = (function(_){
  'use strict';

  // Default options
  // ---------------

  var defaultOptions = {
    forceUpdate: false,
    selector: 'name',
    labelFormatter: 'sentenceCase',
    valid: Function.prototype,
    invalid: Function.prototype
  };


  // Helper functions
  // ----------------

  // Formatting functions used for formatting error messages
  var formatFunctions = {
    // Uses the configured label formatter to format the attribute name
    // to make it more readable for the user
    formatLabel: function(attrName, model) {
      return defaultLabelFormatters[defaultOptions.labelFormatter](attrName, model);
    },

    // Replaces nummeric placeholders like {0} in a string with arguments
    // passed to the function
    format: function() {
      var args = Array.prototype.slice.call(arguments),
          text = args.shift();
      return text.replace(/\{(\d+)\}/g, function(match, number) {
        return typeof args[number] !== 'undefined' ? args[number] : match;
      });
    }
  };

  // Flattens an object
  // eg:
  //
  //     var o = {
  //       owner: {
  //         name: 'Backbone',
  //         address: {
  //           street: 'Street',
  //           zip: 1234
  //         }
  //       }
  //     };
  //
  // becomes:
  //
  //     var o = {
  //       'owner': {
  //         name: 'Backbone',
  //         address: {
  //           street: 'Street',
  //           zip: 1234
  //         }
  //       },
  //       'owner.name': 'Backbone',
  //       'owner.address': {
  //         street: 'Street',
  //         zip: 1234
  //       },
  //       'owner.address.street': 'Street',
  //       'owner.address.zip': 1234
  //     };
  // This may seem redundant, but it allows for maximum flexibility
  // in validation rules.
  var flatten = function (obj, into, prefix) {
    into = into || {};
    prefix = prefix || '';

    _.each(obj, function(val, key) {
      if(obj.hasOwnProperty(key)) {
        if (!!val && _.isArray(val)) {
          _.forEach(val, function(v, k) {
            flatten(v, into, prefix + key + '.' + k + '.');
            into[prefix + key + '.' + k] = v;
          });
        } else if (!!val && typeof val === 'object' && val.constructor === Object) {
          flatten(val, into, prefix + key + '.');
        }

        // Register the current level object as well
        into[prefix + key] = val;
      }
    });

    return into;
  };


  // Returns plain value if any. Runs the provided function and returns its result otherwise.
  var getFunctionParam = function (functionOrValue, model, value, attr, computed) {
    var result;
    if (_.isFunction(functionOrValue)) {
      result = functionOrValue.call(model, value, attr, computed);
    } else {
      result = functionOrValue;
    }
    return result;
  };

  // Validation
  // ----------

  var Validation = (function(){

    // Returns an object with undefined properties for all
    // attributes on the model that has defined one or more
    // validation rules.
    var getValidatedAttrs = function(model, attrs) {
      attrs = attrs || _.keys(_.result(model, 'validation') || {});
      return _.reduce(attrs, function(memo, key) {
        memo[key] = void 0;
        return memo;
      }, {});
    };

    // Returns an array with attributes passed through options
    var getOptionsAttrs = function(options, view) {
      var attrs = options.attributes;
      if (_.isFunction(attrs)) {
        attrs = attrs(view);
      } else if (_.isString(attrs) && (_.isFunction(defaultAttributeLoaders[attrs]))) {
        attrs = defaultAttributeLoaders[attrs](view);
      }
      if (_.isArray(attrs)) {
        return attrs;
      }
    };


    // Looks on the model for validations for a specified
    // attribute. Returns an array of any validators defined,
    // or an empty array if none is defined.
    var getValidators = function(model, attr) {
      var attrValidationSet = model.validation ? _.result(model, 'validation')[attr] || {} : {};

      // If the validator is a function or a string, wrap it in a function validator
      if (_.isFunction(attrValidationSet) || _.isString(attrValidationSet)) {
        attrValidationSet = {
          fn: attrValidationSet
        };
      }

      // Stick the validator object into an array
      if(!_.isArray(attrValidationSet)) {
        attrValidationSet = [attrValidationSet];
      }

      // Reduces the array of validators into a new array with objects
      // with a validation method to call, the value to validate against
      // and the specified error message, if any
      return _.reduce(attrValidationSet, function(memo, attrValidation) {
        _.each(_.without(_.keys(attrValidation), 'msg'), function(validator) {
          memo.push({
            fn: defaultValidators[validator],
            val: attrValidation[validator],
            msg: attrValidation.msg
          });
        });
        return memo;
      }, []);
    };

    // Validates an attribute against all validators defined
    // for that attribute. If one or more errors are found,
    // the first error message is returned.
    // If the attribute is valid, an empty string is returned.
    var validateAttr = function(model, attr, value, computed) {
      // Reduces the array of validators to an error message by
      // applying all the validators and returning the first error
      // message, if any.
      return _.reduce(getValidators(model, attr), function(memo, validator){
        // Pass the format functions plus the default
        // validators as the context to the validator
        var ctx = _.extend({}, formatFunctions, defaultValidators),
            result = validator.fn.call(ctx, value, attr, validator.val, model, computed);

        if(result === false || memo === false) {
          return false;
        }
        if (result && !memo) {
          return _.result(validator, 'msg') || result;
        }
        return memo;
      }, '');
    };

    // Loops through the model's attributes and validates the specified attrs.
    // Returns and object containing names of invalid attributes
    // as well as error messages.
    var validateModel = function(model, attrs, validatedAttrs) {
      var error,
          invalidAttrs = {},
          isValid = true,
          computed = _.clone(attrs);

      _.each(validatedAttrs, function(val, attr) {
        error = validateAttr(model, attr, val, computed);
        if (error) {
          invalidAttrs[attr] = error;
          isValid = false;
        }
      });

      return {
        invalidAttrs: invalidAttrs,
        isValid: isValid
      };
    };

    // Contains the methods that are mixed in on the model when binding
    var mixin = function(view, options) {
      return {

        // Check whether or not a value, or a hash of values
        // passes validation without updating the model
        preValidate: function(attr, value) {
          var self = this,
              result = {},
              error;

          if(_.isObject(attr)){
            _.each(attr, function(value, key) {
              error = self.preValidate(key, value);
              if(error){
                result[key] = error;
              }
            });

            return _.isEmpty(result) ? undefined : result;
          }
          else {
            return validateAttr(this, attr, value, _.extend({}, this.attributes));
          }
        },

        // Check to see if an attribute, an array of attributes or the
        // entire model is valid. Passing true will force a validation
        // of the model.
        isValid: function(option) {
          var flattened, attrs, error, invalidAttrs;

          option = option || getOptionsAttrs(options, view);

          if(_.isString(option)){
            attrs = [option];
          } else if(_.isArray(option)) {
            attrs = option;
          }
          if (attrs) {
            flattened = flatten(this.attributes);
            //Loop through all associated views
            _.each(this.associatedViews, function(view) {
              _.each(attrs, function (attr) {
                error = validateAttr(this, attr, flattened[attr], _.extend({}, this.attributes));
                if (error) {
                  options.invalid(view, attr, error, options.selector);
                  invalidAttrs = invalidAttrs || {};
                  invalidAttrs[attr] = error;
                } else {
                  options.valid(view, attr, options.selector);
                }
              }, this);
            }, this);
          }

          if(option === true) {
            invalidAttrs = this.validate();
          }
          if (invalidAttrs) {
            this.trigger('invalid', this, invalidAttrs, {validationError: invalidAttrs});
          }
          return attrs ? !invalidAttrs : this.validation ? this._isValid : true;
        },

        // This is called by Backbone when it needs to perform validation.
        // You can call it manually without any parameters to validate the
        // entire model.
        validate: function(attrs, setOptions){
          var model = this,
              validateAll = !attrs,
              opt = _.extend({}, options, setOptions),
              validatedAttrs = getValidatedAttrs(model, getOptionsAttrs(options, view)),
              allAttrs = _.extend({}, validatedAttrs, model.attributes, attrs),
              flattened = flatten(allAttrs),
              changedAttrs = attrs ? flatten(attrs) : flattened,
              result = validateModel(model, allAttrs, _.pick(flattened, _.keys(validatedAttrs)));

          model._isValid = result.isValid;

          //After validation is performed, loop through all associated views
          _.each(model.associatedViews, function(view){

            // After validation is performed, loop through all validated and changed attributes
            // and call the valid and invalid callbacks so the view is updated.
            _.each(validatedAttrs, function(val, attr){
                var invalid = result.invalidAttrs.hasOwnProperty(attr),
                  changed = changedAttrs.hasOwnProperty(attr);

                if(!invalid){
                  opt.valid(view, attr, opt.selector);
                }
                if(invalid && (changed || validateAll)){
                  opt.invalid(view, attr, result.invalidAttrs[attr], opt.selector);
                }
            });
          });

          // Trigger validated events.
          // Need to defer this so the model is actually updated before
          // the event is triggered.
          _.defer(function() {
            model.trigger('validated', model._isValid, model, result.invalidAttrs);
            model.trigger('validated:' + (model._isValid ? 'valid' : 'invalid'), model, result.invalidAttrs);
          });

          // Return any error messages to Backbone, unless the forceUpdate flag is set.
          // Then we do not return anything and fools Backbone to believe the validation was
          // a success. That way Backbone will update the model regardless.
          if (!opt.forceUpdate && _.intersection(_.keys(result.invalidAttrs), _.keys(changedAttrs)).length > 0) {
            return result.invalidAttrs;
          }
        }
      };
    };

    // Helper to mix in validation on a model. Stores the view in the associated views array.
    var bindModel = function(view, model, options) {
      if (model.associatedViews) {
        model.associatedViews.push(view);
      } else {
        model.associatedViews = [view];
      }
      _.extend(model, mixin(view, options));
    };

    // Removes view from associated views of the model or the methods
    // added to a model if no view or single view provided
    var unbindModel = function(model, view) {
      if (view && model.associatedViews && model.associatedViews.length > 1){
        model.associatedViews = _.without(model.associatedViews, view);
      } else {
        delete model.validate;
        delete model.preValidate;
        delete model.isValid;
        delete model.associatedViews;
      }
    };

    // Mix in validation on a model whenever a model is
    // added to a collection
    var collectionAdd = function(model) {
      bindModel(this.view, model, this.options);
    };

    // Remove validation from a model whenever a model is
    // removed from a collection
    var collectionRemove = function(model) {
      unbindModel(model);
    };

    // Returns the public methods on Backbone.Validation
    return {

      // Current version of the library
      version: '0.11.3',

      // Called to configure the default options
      configure: function(options) {
        _.extend(defaultOptions, options);
      },

      // Hooks up validation on a view with a model
      // or collection
      bind: function(view, options) {
        options = _.extend({}, defaultOptions, defaultCallbacks, options);

        var model = options.model || view.model,
            collection = options.collection || view.collection;

        if(typeof model === 'undefined' && typeof collection === 'undefined'){
          throw 'Before you execute the binding your view must have a model or a collection.\n' +
                'See http://thedersen.com/projects/backbone-validation/#using-form-model-validation for more information.';
        }

        if(model) {
          bindModel(view, model, options);
        }
        else if(collection) {
          collection.each(function(model){
            bindModel(view, model, options);
          });
          collection.bind('add', collectionAdd, {view: view, options: options});
          collection.bind('remove', collectionRemove);
        }
      },

      // Removes validation from a view with a model
      // or collection
      unbind: function(view, options) {
        options = _.extend({}, options);
        var model = options.model || view.model,
            collection = options.collection || view.collection;

        if(model) {
          unbindModel(model, view);
        }
        else if(collection) {
          collection.each(function(model){
            unbindModel(model, view);
          });
          collection.unbind('add', collectionAdd);
          collection.unbind('remove', collectionRemove);
        }
      },

      // Used to extend the Backbone.Model.prototype
      // with validation
      mixin: mixin(null, defaultOptions)
    };
  }());


  // Callbacks
  // ---------

  var defaultCallbacks = Validation.callbacks = {

    // Gets called when a previously invalid field in the
    // view becomes valid. Removes any error message.
    // Should be overridden with custom functionality.
    valid: function(view, attr, selector) {
      view.$('[' + selector + '~="' + attr + '"]')
          .removeClass('invalid')
          .removeAttr('data-error');
    },

    // Gets called when a field in the view becomes invalid.
    // Adds a error message.
    // Should be overridden with custom functionality.
    invalid: function(view, attr, error, selector) {
      view.$('[' + selector + '~="' + attr + '"]')
          .addClass('invalid')
          .attr('data-error', error);
    }
  };


  // Patterns
  // --------

  var defaultPatterns = Validation.patterns = {
    // Matches any digit(s) (i.e. 0-9)
    digits: /^\d+$/,

    // Matches any number (e.g. 100.000)
    number: /^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/,

    // Matches a valid email address (e.g. mail@example.com)
    email: /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i,

    // Mathes any valid url (e.g. http://www.xample.com)
    url: /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i
  };


  // Error messages
  // --------------

  // Error message for the build in validators.
  // {x} gets swapped out with arguments form the validator.
  var defaultMessages = Validation.messages = {
    required: '{0} is required',
    acceptance: '{0} must be accepted',
    min: '{0} must be greater than or equal to {1}',
    max: '{0} must be less than or equal to {1}',
    range: '{0} must be between {1} and {2}',
    length: '{0} must be {1} characters',
    minLength: '{0} must be at least {1} characters',
    maxLength: '{0} must be at most {1} characters',
    rangeLength: '{0} must be between {1} and {2} characters',
    oneOf: '{0} must be one of: {1}',
    equalTo: '{0} must be the same as {1}',
    digits: '{0} must only contain digits',
    number: '{0} must be a number',
    email: '{0} must be a valid email',
    url: '{0} must be a valid url',
    inlinePattern: '{0} is invalid'
  };

  // Label formatters
  // ----------------

  // Label formatters are used to convert the attribute name
  // to a more human friendly label when using the built in
  // error messages.
  // Configure which one to use with a call to
  //
  //     Backbone.Validation.configure({
  //       labelFormatter: 'label'
  //     });
  var defaultLabelFormatters = Validation.labelFormatters = {

    // Returns the attribute name with applying any formatting
    none: function(attrName) {
      return attrName;
    },

    // Converts attributeName or attribute_name to Attribute name
    sentenceCase: function(attrName) {
      return attrName.replace(/(?:^\w|[A-Z]|\b\w)/g, function(match, index) {
        return index === 0 ? match.toUpperCase() : ' ' + match.toLowerCase();
      }).replace(/_/g, ' ');
    },

    // Looks for a label configured on the model and returns it
    //
    //      var Model = Backbone.Model.extend({
    //        validation: {
    //          someAttribute: {
    //            required: true
    //          }
    //        },
    //
    //        labels: {
    //          someAttribute: 'Custom label'
    //        }
    //      });
    label: function(attrName, model) {
      return (model.labels && model.labels[attrName]) || defaultLabelFormatters.sentenceCase(attrName, model);
    }
  };

  // AttributeLoaders

  var defaultAttributeLoaders = Validation.attributeLoaders = {
    inputNames: function (view) {
      var attrs = [];
      if (view) {
        view.$('form [name]').each(function () {
          if (/^(?:input|select|textarea)$/i.test(this.nodeName) && this.name &&
            this.type !== 'submit' && attrs.indexOf(this.name) === -1) {
            attrs.push(this.name);
          }
        });
      }
      return attrs;
    }
  };


  // Built in validators
  // -------------------

  var defaultValidators = Validation.validators = (function(){
    // Use native trim when defined
    var trim = String.prototype.trim ?
      function(text) {
        return text === null ? '' : String.prototype.trim.call(text);
      } :
      function(text) {
        var trimLeft = /^\s+/,
            trimRight = /\s+$/;

        return text === null ? '' : text.toString().replace(trimLeft, '').replace(trimRight, '');
      };

    // Determines whether or not a value is a number
    var isNumber = function(value){
      return _.isNumber(value) || (_.isString(value) && value.match(defaultPatterns.number));
    };

    // Determines whether or not a value is empty
    var hasValue = function(value) {
      return !(_.isNull(value) || _.isUndefined(value) || (_.isString(value) && trim(value) === '') || (_.isArray(value) && _.isEmpty(value)));
    };

    return {
      // Function validator
      // Lets you implement a custom function used for validation
      fn: function(value, attr, fn, model, computed) {
        if(_.isString(fn)){
          fn = model[fn];
        }
        return fn.call(model, value, attr, computed); // makes model available as 'this' in the validation function
      },

      // Required validator
      // Validates if the attribute is required or not
      // Whether the attribute is required can be specified as either a boolean value or a function that returns a boolean value
      required: function(value, attr, requiredFnOrVal, model, computed) {
        var required = getFunctionParam(requiredFnOrVal, model, value, attr, computed);
        if (!required && !hasValue(value)) {
          return false; // overrides all other validators
        }
        if (required && !hasValue(value)) {
          return this.format(defaultMessages.required, this.formatLabel(attr, model));
        }
      },

      // Acceptance validator
      // Validates that something has to be accepted, e.g. terms of use
      // `true` or 'true' are valid
      // Whether acceptance is required can be specified as either a boolean value or a function that returns a boolean value
      acceptance: function(value, attr, acceptFnOrVal, model, computed) {
        var accept = getFunctionParam(acceptFnOrVal, model, value, attr, computed);
        if (accept && value !== 'true' && (!_.isBoolean(value) || value === false)) {
          return this.format(defaultMessages.acceptance, this.formatLabel(attr, model));
        }
      },

      // Min validator
      // Validates that the value has to be a number and equal to or greater than
      // the min value specified
      // The min value can be specified either directly or as a function which returns the value.
      min: function(value, attr, minFnOrVal, model, computed) {
        var minValue = getFunctionParam(minFnOrVal, model, value, attr, computed);
        if (!isNumber(value) || value < minValue) {
          return this.format(defaultMessages.min, this.formatLabel(attr, model), minValue);
        }
      },

      // Max validator
      // Validates that the value has to be a number and equal to or less than
      // the max value specified
      // The max value can be specified either directly or as a function which returns the value.
      max: function(value, attr, maxFnOrVal, model, computed) {
        var maxValue = getFunctionParam(maxFnOrVal, model, value, attr, computed);
        if (!isNumber(value) || value > maxValue) {
          return this.format(defaultMessages.max, this.formatLabel(attr, model), maxValue);
        }
      },

      // Range validator
      // Validates that the value has to be a number and equal to or between
      // the two numbers specified as an array
      // The range value can be specified either directly or as a function which returns the value.
      range: function(value, attr, rangeFnOrVal, model, computed) {
        var range = getFunctionParam(rangeFnOrVal, model, value, attr, computed);
        if (!isNumber(value) || value < range[0] || value > range[1]) {
          return this.format(defaultMessages.range, this.formatLabel(attr, model), range[0], range[1]);
        }
      },

      // Length validator
      // Validates that the value has to be a string with length equal to
      // the length value specified
      // The length value can be specified either directly or as a function which returns the value.
      length: function(value, attr, lengthFnOrVal, model, computed) {
        var length = getFunctionParam(lengthFnOrVal, model, value, attr, computed);
        if (!_.isString(value) || value.length !== length) {
          return this.format(defaultMessages.length, this.formatLabel(attr, model), length);
        }
      },

      // Min length validator
      // Validates that the value has to be a string with length equal to or greater than
      // the min length value specified
      // The min length value can be specified either directly or as a function which returns the value.
      minLength: function(value, attr, minLengthFnOrVal, model, computed) {
        var minLength = getFunctionParam(minLengthFnOrVal, model, value, attr, computed);
        if (!_.isString(value) || value.length < minLength) {
          return this.format(defaultMessages.minLength, this.formatLabel(attr, model), minLength);
        }
      },

      // Max length validator
      // Validates that the value has to be a string with length equal to or less than
      // the max length value specified
      // The max length value can be specified either directly or as a function which returns the value.
      maxLength: function(value, attr, maxLengthFnOrVal, model, computed) {
        var maxLength = getFunctionParam(maxLengthFnOrVal, model, value, attr, computed);
        if (!_.isString(value) || value.length > maxLength) {
          return this.format(defaultMessages.maxLength, this.formatLabel(attr, model), maxLength);
        }
      },

      // Range length validator
      // Validates that the value has to be a string with a length equal to or between
      // two numbers specified as an array
      // The string length value can be specified either directly or as a function which returns the value.
      rangeLength: function(value, attr, rangeFnOrVal, model, computed) {
        var range = getFunctionParam(rangeFnOrVal, model, value, attr, computed);
        if (!_.isString(value) || value.length < range[0] || value.length > range[1]) {
          return this.format(defaultMessages.rangeLength, this.formatLabel(attr, model), range[0], range[1]);
        }
      },

      // One of validator
      // Validates that the value has to be equal to one of the elements in
      // the specified array. Case sensitive matching
      // The array of values can be specified either directly or as a function which returns the array.
      oneOf: function(value, attr, fnOrValues, model, computed) {
        var values = getFunctionParam(fnOrValues, model, value, attr, computed);
        if (!_.include(values, value)) {
          return this.format(defaultMessages.oneOf, this.formatLabel(attr, model), values.join(', '));
        }
      },

      // Equal to validator
      // Validates that the value has to be equal to the value of the attribute
      // with the name specified
      // The name of the corresponding attribute can be specified either directly or as a function which returns
      // the attribute name.
      equalTo: function(value, attr, equalToFnOrVal, model, computed) {
        var equalTo = getFunctionParam(equalToFnOrVal, model, value, attr, computed);
        if (value !== computed[equalTo]) {
          return this.format(defaultMessages.equalTo, this.formatLabel(attr, model), this.formatLabel(equalTo, model));
        }
      },

      // Pattern validator
      // Validates that the value has to match the pattern specified.
      // Can be a regular expression or the name of one of the built in patterns
      // The pattern can be specified either directly or as a function which returns the pattern.
      pattern: function(value, attr, patternFnOrVal, model, computed) {
        var pattern = getFunctionParam(patternFnOrVal, model, value, attr, computed);
        if (!hasValue(value) || !value.toString().match(defaultPatterns[pattern] || pattern)) {
          return this.format(defaultMessages[pattern] || defaultMessages.inlinePattern, this.formatLabel(attr, model), pattern);
        }
      }
    };
  }());

  // Set the correct context for all validators
  // when used from within a method validator
  _.each(defaultValidators, function(validator, key) {
    defaultValidators[key] = _.bind(defaultValidators[key], _.extend({}, formatFunctions, defaultValidators));
  });

  return Validation;
}(_));
