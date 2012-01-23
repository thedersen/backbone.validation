# Backbone.Validation

A validation plugin for [Backbone.js](http://documentcloud.github.com/backbone) inspired by [Backbone.ModelBinding](http://github.com/derickbailey/backbone.modelbinding), and another implementation with a slightly different approach than mine at [Backbone.Validations](http://github.com/n-time/backbone.validations).

## Getting started

It's easy to get up and running. You only need to have Backbone (including underscore.js) in your page before including the Backbone.Validation plugin. If you are using the default implementation of the callbacks, you also need to include jQuery.

### Configure validation rules on the Model

To configure your validation rules, simply add a validation property with a property for each attribute you want to validate on your model. The validation rules can either be an object with one of the built-in validators or a combination of two or more of them, or a function where you implement your own custom validation logic. If you want to provide a custom error message when using one of the built-in validators, simply define the `msg` property with your message.

#### Example

	var SomeModel = Backbone.Model.extend({
      validation: {
	    name: {
		  required: true,
		  msg: 'Name is required'
		},
        age: {
		  range: [1, 80]
		},
		email: {
		  pattern: 'email'
		},
		someAttribute: function(value) {
		  if(value !== 'somevalue') {
		    return 'Error';
		  }
		}
      }
    });

See the **built-in validators** section in this readme for a list of the validators and patterns that you can use.

### Validation binding

The validation binding code is executed with a call to `Backbone.Validation.bind(view)`. The [validate](http://documentcloud.github.com/backbone/#Model-validate) method on the view's model is then overridden to perform the validation. In addition, the model is extended with an `isValid()` method.

There are several places that it can be called from, depending on your circumstances.

	// Binding when rendering
	var SomeView = Backbone.View.extend({
	  render: function(){
	    Backbone.Validation.bind(this);
	  }
	});

	// Binding when initializing
	var SomeView = Backbone.View.extend({
	  initialize: function(){
	    Backbone.Validation.bind(this);
	  }
	});

	// Binding from outside a view
	var SomeView = Backbone.View.extend({
	});
	var someView = new SomeView();
	Backbone.Validation.bind(someView);

## A couple of conventions

The `Backbone.Validation.callbacks` contains two methods: `valid` and `invalid`. These are called after validation of an attribute is performed.

The default implementation of `invalid` tries to look up an element within the view with an name attribute equal to the name of the attribute that is validated. If it finds one, an `invalid` class is added to the element as well as a `data-error` attribute with the error message. The `valid` method removes these if they exists.

The default implementation of these can of course be overridden:

	_.extend(Backbone.Validation.callbacks, {
      valid: function(view, attr, selector) {
	    // do something
	  },
      invalid: function(view, attr, error, selector) {
		// do something
	  }
    });

You can also override these per view when binding:

	var SomeView = Backbone.View.extend({
	  render: function(){
	    Backbone.Validation.bind(this, {
		  valid: function(view, attr) {
		    // do something
		  },
	      invalid: function(view, attr, error) {
			// do something
		  }
		});
	  }
	});

If you need to look up elements by using for instance a class name or id instead of name, there are two ways to configure this.

You can configure it globally by calling:

	Backbone.Validation.configure({
		selector: 'class'
	});

Or, you can configure it per view when binding:

	Backbone.Validation.bind(this.view, {
        selector: 'class'
    });

If you have set the global selector to class, you can of course set the selector to name or id on specific views.

## Force update the model

Sometimes it can be useful to update the model with invalid values. Especially when using automatic modelbinding and late validation (e.g. when submitting the form).

You can turn this on globally by calling:

	Backbone.Validation.configure({
		forceUpdate: true
	});

Or, you can turn it on per view when binding:

	Backbone.Validation.bind(this.view, {
        forceUpdate: true
    });

When switching this on, the error event is no longer triggered.

## Events

The model triggers two events, 'validated' and 'validated:valid' or 'validated:invalid', after validation is performed.

	model.bind('validated', function(isValid, model, attrs) {
		// isValid is true or false
		// model is the model
		// attrs is an array with the name(s) of the attribute(s) with error
	});

	model.bind('validated:valid', function(model) {
		// model is the model
	});

	model.bind('validated:invalid', function(model, attrs) {
		// model is the model
		// attrs is an array with the name(s) of the attribute(s) with error
	});

## The built-in validators

#### method validator

	var SomeModel = Backbone.Model.extend({
	  validation: {
	    name: function(value) {
          if(value !== 'something') {
            return 'Name is invalid';
          }
		}
	  }
	});

	var SomeModel = Backbone.Model.extend({
	  validation: {
	    name: {
		  fn: function(value) {
	       	if(value !== 'something') {
	       	  return 'Name is invalid';
	      	}
	      }
		}
	  }
	});

#### named method validator

	var SomeModel = Backbone.Model.extend({
	  validation: {
	    name: 'validateName'
	  },
	  validateName: function(value, attr) {
		if(value !== 'something') {
          return 'Name is invalid';
        }
	  }
	});

	var SomeModel = Backbone.Model.extend({
	  validation: {
		name: {
		  fn: 'validateName'
		}
	  },
	  validateName: function(value, attr) {
		if(value !== 'something') {
          return 'Name is invalid';
        }
	  }
	});

#### required

	var SomeModel = Backbone.Model.extend({
	  validation: {
	    name: {
		  required: true | false
		}
	  }
	});

	var SomeModel = Backbone.Model.extend({
	  validation: {
	    name: {
		  required: function() {
			return true | false;
		  }
		}
	  }
	});

#### acceptance

	var SomeModel = Backbone.Model.extend({
	  validation: {
	    termsOfUse: {
		  acceptance: true
		}
	  }
	});

#### min

	var SomeModel = Backbone.Model.extend({
	  validation: {
	    age: {
		  min: 1
		}
	  }
	});

#### max

	var SomeModel = Backbone.Model.extend({
	  validation: {
	    age: {
		  max: 100
		}
	  }
	});

#### range

	var SomeModel = Backbone.Model.extend({
	  validation: {
	    age: {
		  range: [1, 10]
		}
	  }
	});

#### length

	var SomeModel = Backbone.Model.extend({
	  validation: {
	    postalCode: {
		  length: 4
		}
	  }
	});

#### minLength

	var SomeModel = Backbone.Model.extend({
	  validation: {
	    password: {
		  minLength: 8
		}
	  }
	});

#### maxLength

	var SomeModel = Backbone.Model.extend({
	  validation: {
	    password: {
		  maxLength: 100
		}
	  }
	});

#### rangeLength

	var SomeModel = Backbone.Model.extend({
	  validation: {
	    password: {
		  rangeLength: [6, 100]
		}
	  }
	});

#### oneOf

	var SomeModel = Backbone.Model.extend({
	  validation: {
	    country: {
		  oneOf: ['Norway', 'Sweeden']
		}
	  }
	});

#### equalTo

	var SomeModel = Backbone.Model.extend({
	  validation: {
	    password: {
		  required: true
		},
		passwordRepeat: {
			equalTo: 'password'
		}
	  }
	});

#### pattern

	var SomeModel = Backbone.Model.extend({
	  validation: {
	    email: {
		  pattern: 'email'
		}
	  }
	});

where the built-in patterns are:

* number
* email
* url
* digits

or specify any regular expression you like:

	var SomeModel = Backbone.Model.extend({
	  validation: {
	    email: {
		  pattern: /^sample/
		}
	  }
	});

See the [wiki](https://github.com/thedersen/backbone.validation/wiki) for more details about the validators.

## Extending Backbone.Validation

### Adding custom validators

If you have custom validation logic that are used several places in your code, you can extend the validators with your own. And if you don't like the default implementation of one of the built-ins, you can override it.

	_.extend(Backbone.Validation.validators, {
      myValidator: function(value, attr, customValue, model) {
        if(value !== customValue){
          return 'error';
        }
      },
      required: function(value, attr, customValue, model) {
        if(!value){
          return 'My version of the required validator';
        }
      },
   	});

   	var Model = Backbone.Model.extend({
      validation: {
        age: {
       	  myValidator: 1 // uses your custom validator
        }
      }
   	});

The validator should return an error message when the value is invalid, and nothing (`undefined`) if the value is valid. If the validator returns `false`, this will result in that all other validators specified for the attribute is bypassed, and the attribute is considered valid.

### Adding custom patterns

If you have custom patterns that are used several places in your code, you can extend the patterns with your own. And if you don't like the default implementation of one of the built-ins, you can override it.

	_.extend(Backbone.Validation.patterns, {
	  myPattern: /my-pattern/,
	  email: /my-much-better-email-regex/
	});

	var Model = Backbone.Model.extend({
      validation: {
        name: {
          pattern: 'myPattern'
        }
      }
	});

### Overriding the default error messages

If you don't like the default error messages there are several ways of customizing them.

You can override the default ones globally:

	_.extend(Backbone.Validation.messages, {
		required: 'This field is required'
	});

The message can contain placeholders for arguments that will be replaced:

* `{0}` will be replaced with the name of the attribute being validated
* `{1}` will be replaced with the allowed value configured in the validation (or the first one in a range validator)
* `{2}` will be replaced with the second value in a range validator


You can specify a message per attribute:

	MyModel = Backbone.Model.extend({
    	validation: {
        	email: {
            	required: true,
            	pattern: "email",
            	msg: "Please enter a valid email"
            }
        }
	});

You can specify a message per validator:

	MyModel = Backbone.Model.extend({
    	validation: {
        	email: [{
            	required: true,
            	msg: "Please enter an email address"
        	},{
            	pattern: "email",
            	msg: "Please enter a valid email"
        	}]
        }
	});

# Release notes

### v0.4.1

* Context (this) in custom validators is the `Backbone.Validation.validators` object

### v0.4.0

* `isValid` returns `undefined` when no validatation has occured and the model has validation
* Passing `true` to `isValid` forces an validation
* When specifying multiple validators for one attribute, all can have it's own error message (thanks to [GarethElms](https://github.com/GarethElms))
* method validator and named method validator can be combined with other built-in validators
* acceptance validator accepts 'true' as valid (Fixes issue #12)
* Can configure per view or globally to force update the model with invalid values. This can be very useful when using automatic modelbinding and late validation (e.g. when submitting the form)
* email pattern is case insensitive
* Breaking changes (unfortunate, but necessary):
	* `setDefaultSelector` is removed, and you need to call `configure({selector: 'class'})` instead

### v0.3.1

* Fixed issue with validated events being triggered before model was updated
* Added model and an array of invalid attribute names as arguments to the events

### v0.3.0

* Triggers events when validation is performed (thanks to [GarethElms](https://github.com/GarethElms)):
	* 'validated' with `true` or `false` as argument
	* 'validated:valid' when model is valid
	* 'validated:invalid' when model is invalid
* Named method validator get the name of the attribute being validate as the second argument (thanks to [goreckm](https://github.com/goreckm))
* `error` argument passed to the error event raised by Backbone contains an array of errors when validating multiple attributed in one go, otherwise a string
* Breaking changes (unfortunate, but necessary):
	* isValid attribute (`model.get('isValid')`) is replaced with a method `model.isValid()`
	* Default selector is 'name' instead of 'id'

### v0.2.0

* New validators:
	* named method
	* length
	* acceptance (which is typically used when the user has to accept something (e.g. terms of use))
	* equalTo
	* range
	* rangeLength
	* oneOf
* Added possibility to validate entire model by explicitly calling `model.validate()` without any parameters. (Note: `Backbone.Validation.bind(..)` must still be called)
* required validator can be specified as a method returning either `true` or `false`
* Can override the default error messages globally
* Can override the id selector (#) used in the callbacks either globally or per view when binding
* Improved email pattern for better matching
* Added new pattern 'digits'
* Possible breaking changes:
	* Removed the unused msg parameter when adding custom validators
	* Number pattern matches negative numbers (Fixes issue #4), decimals and numbers with 1000-separator (e.g. 123.000,45)
	* Context (this) in the method validators is now the model instead of the global object (Fixes issue #6)
	* All validators except required and acceptance invalidates null, undefined or empty value. However, required:false can be specified to allow null, undefined or empty value
* Breaking changes (unfortunate, but necessary):
	* Required validator no longer invalidates false boolean, use the new acceptance validator instead

### v0.1.3

* Fixed issue where min and max validators treated strings with leading digits as numbers
* Fixed issue with undefined Backbone reference when running Backbone in no conflict mode
* Fixed issue with numeric string with more than one number not being recognized as a number

### v0.1.2

* Initial release

# License

http://thedersen.mit-license.org/