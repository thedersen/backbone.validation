# Backbone.Validation

A validation plugin for [Backbone.js](http://documentcloud.github.com/backbone) inspired by [Backbone.ModelBinding](http://github.com/derickbailey/backbone.modelbinding), and another implementation with a slightly different approach than mine at [Backbone.Validations](http://github.com/n-time/backbone.validations).

## Getting started

It's easy to get up and running. You only need to have Backbone (including underscore.js) and jQuery in your page before including the Backbone.Validation plugin.

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
		  min: 1,
		  max: 80
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

The validation binding code is executed with a call to `Backbone.Validation.bind(view)`. The [validate](http://documentcloud.github.com/backbone/#Model-validate) method on the view's model is then overridden to perform the validation.

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

After performing validation, an `isValid` attribute is set on the model that is (obviously) `true` when all the attributes on the model is valid, otherwise `false`.

The `Backbone.Validation.callbacks` contains two methods: `valid` and `invalid`. These are called after validation of an attribute is performed. 

The default implementation of `invalid` tries to look up an element within the view with an id equal to the name of the attribute that is validated. If it finds one, an `invalid` class is added to the element as well as a `data-error` attribute with the error message. The `valid` method removes these if they exists.

The default implementation of these can of course be overridden:

	_.extend(Backbone.Validation.callbacks, {
      valid: function(view, attr) {
	    // do something
	  },
      invalid: function(view, attr, error) {
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
	
## The built-in validators

#### method validator

	var SomeModel = Backbone.Model.extend({
	  validation: {
	    name: function(value) {
          if(value !== 'something') {
			// return an error message if the value is invalid; otherwise, return undefined
            return 'Name is invalid';
          }
		}
	  }
	});
	
#### named method validator

	var SomeModel = Backbone.Model.extend({
	  validation: {
	    name: 'validateName'
	  },
	  validateName: function(value) {
		if(value !== 'something') {
		  // return an error message if the value is invalid; otherwise, return undefined
          return 'Name is invalid';
        }
	  }
	});

#### required

	var SomeModel = Backbone.Model.extend({
	  validation: {
	    name: {
		  required: true
		}
	  }
	});

#### acceptance

	var SomeModel = Backbone.Model.extend({
	  validation: {
	    name: {
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

or specify any regular expression you like:

	var SomeModel = Backbone.Model.extend({
	  validation: {
	    email: {
		  pattern: /^sample/
		}
	  }
	});

## Extending Backbone.Validation

### Adding custom validators

If you have custom validation logic that are used several places in your code, you can extend the validators with your own custom ones. And if you don't like the default implementation of one of the built-ins, you can override it.

	_.extend(Backbone.Validation.validators, {
      myValidator: function(value, attr, msg, customValue) {
        if(value !== customValue){
          return msg || 'error';
        }
      },
      required: function(value, attr, msg, customValue) {
        if(!value){
          return msg || 'My version of the required validator';
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

### Adding custom patterns

If you have custom patterns that are used several places in your code, you can extend the patterns with your own custom ones. And if you don't like the default implementation of one of the built-ins, you can override it.

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


# Release notes

### v0.2.0

* Added named method validator
* Added length validator
* Added acceptance validator which is typically used when the user has to accept something (e.g. terms of use)
* Added possibility to validate entire model by explicitly calling `model.validate()` without any parameters. (Note: `Backbone.Validation.bind(..)` must still be called)
* Possible breaking changes:
	* Removed the unused msg parameter when adding custom validators
	* Number pattern matches negative numbers (Fixes issue #4)
	* Context (this) in the method validators is now the model instead of the global object (Fixes issue # 6)
	* All validators except required and acceptance invalidates null, undefined or empty value. However, required:false can be specified to allow nulls
* Breaking changes:
	* Required validator no longer invalidates false boolean, use the new acceptance validator instead

### v0.1.3

* Fixed issue where min and max validators treated strings with leading digits as numbers
* Fixed issue with undefined Backbone reference when running Backbone in no conflict mode
* Fixed issue with numeric string with more than one number not being recognized as a number

### v0.1.2

* Initial release

# License

http://thedersen.mit-license.org/