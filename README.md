# Backbone.Validation v0.7.1

A validation plugin for [Backbone.js](http://documentcloud.github.com/backbone) that validates both your model as well as form input.

## Introduction

Good client side validation is an important part of giving your users a great experience when they visit your site. Backbone provides a [validate](http://backbonejs.org/#Model-validate) method, but it is left undefined and it is up to you to override it with your custom validation logic. Too many times I have seen validation implemented as lots of nested ifs and elses. This quickly becomes a big mess. One other thing is that with libraries like Backbone, you hold your state in a Model, and don't tie it to the DOM. Still, when validating your models you probably want to inform your users about errors etc., which means modifying the DOM.

Backbone.Validation tries to solve both these problems. It gives you a simple, extensible way of declaring validation rules on your model, and overrides Backbone's validate method behind the scene. And, it gives you a nice hook where you can implement your own way of showing the error messages to your user.

If you are using node.js on the server you can also reuse your models and validation on the server side. How cool is that?

Backbone.Validation is a bit opinionated, meaning that you have to follow some conventions in order for it to work properly.

## Download and source code

You can download the raw source from [GitHub](http://github.com/thedersen/backbone.validation), see the [annotated source](http://thedersen.com/projects/backbone-validation/docs) or use the links below for the latest stable version.

#### Standard builds

* Development: [backbone-validation.js](https://raw.github.com/thedersen/backbone.validation/master/dist/backbone-validation.js) *22.6kb*
* Production:  [backbone-validation-min.js](https://raw.github.com/thedersen/backbone.validation/master/dist/backbone-validation-min.js) *2.7kb gzipped*

#### AMD builds

* Development: [backbone-validation-amd.js](https://raw.github.com/thedersen/backbone.validation/master/dist/backbone-validation-amd.js) *24.1kb*
* Production:  [backbone-validation-amd-min.js](https://raw.github.com/thedersen/backbone.validation/master/dist/backbone-validation-amd-min.js) *2.8kb gzipped*

#### Node.js builds

    npm install backbone-validation

## Getting started

It's easy to get up and running. You only need to have Backbone (including underscore.js) in your page before including the Backbone.Validation plugin. If you are using the default implementation of the callbacks, you also need to include jQuery.

The plugin is tested with, and should work with the following versions of Backbone:

* 0.9.1
* 0.9.2
* 0.9.9

### Configure validation rules on the Model

To configure your validation rules, simply add a validation property with a property for each attribute you want to validate on your model. The validation rules can either be an object with one of the built-in validators or a combination of two or more of them, or a function where you implement your own custom validation logic.

Validating complex objects is also supported. To configure validation rules for objects, use dot notation in the name of the attribute, e.g `'address.street'`.

#### Example

```js
var SomeModel = Backbone.Model.extend({
  validation: {
    name: {
      required: true
    },
    'address.street': {
      required: true
    },
    'address.zip': {
      length: 4
    },
    age: {
      range: [1, 80]
    },
    email: {
      pattern: 'email'
    },
    someAttribute: function(value) {
      if(value !== 'somevalue') {
        return 'Error message';
      }
    }
  }
});
```

See the **[built-in validators](#built-in-validators)** section for a list of the validators and patterns that you can use.

### Specifying error messages

Backbone.Validation comes with a set of default error messages. If you don't like to use those, you can either [override them](#extending-backbone-validation/overriding-the-default-error-messages), or you can specify error messages where you declare validation rules on the model.

You can specify an error message per attribute by adding a `msg` property like this:

```js
MyModel = Backbone.Model.extend({
  validation: {
    email: {
      required: true,
      pattern: 'email',
      msg: 'Please enter a valid email'
    }
  }
});
```

Or, you can specify an error message per validator, by adding an array of validators like this:

```js
MyModel = Backbone.Model.extend({
  validation: {
    email: [{
      required: true,
      msg: 'Please enter an email address'
    },{
      pattern: 'email',
      msg: 'Please enter a valid email'
    }]
  }
});
```

## Using form+model validation

The philosophy behind this way of using the plugin, is that you should be able to reuse your validation rules both to validate your model and to validate form input, as well as providing a simple way of notifying users about errors when they are populating forms.

Note that Backbone.Validation does not provide any automatic/two-way binding between your model and the view, that's up you to implement (you can for instance use [Backbone.stickit](http://nytimes.github.com/backbone.stickit/).

Before you can start using form validation, you need to bind your view.

### Validation binding

The validation binding code is executed with a call to `Backbone.Validation.bind(view)`. There are several places that it can be called from, depending on your circumstances, but it must be called after your model or collection has been initialized.

```js
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
var someView = new SomeView({model: new SomeModel()});
Backbone.Validation.bind(someView);
```

### Binding to view with a model

For this to work, your view must have an instance property named *model* that holds your model before you perform the binding.

When binding to a view with a model, Backbone's [validate](http://documentcloud.github.com/backbone/#Model-validate) method on the model is overridden to perform the validation. In addition, the model's [isValid](http://backbonejs.org/#Model-isValid) method is also overridden to provide some extra functionality.

### Binding to view with a collection

For this to work, your view must have an instance property named *collection* that holds your collection before you perform the binding.

When binding to a view with a collection, all models in the collection are bound as described previously. When you are adding or removing models from your collection, they are bound/unbound accordingly.

Note that if you add/remove models with the silent flag, they will not be bound/unbound since there is no way of knowing the the collection was modified.

### Unbinding

If you want to remove the validation binding, this is done with a call to `Backbone.Validation.unbind(view)`. This removes the validation binding on the model, or all models if you view contains a collection, as well as removing all events hooked up on the collection.

## Using model validation

The philosophy behind this way of using the plugin, is to give you an easy way to implement validation across *all* your models without the need to bind to a view. Of course, if you use this option the callbacks to update the view is not executed, since there is no way of knowing what view a model belongs to.

### Validation mix-in

To add validation to your models, mix in the validation on the Model's prototype.

```js
_.extend(Backbone.Model.prototype, Backbone.Validation.mixin);
```

## Using server validation

If you are using node.js on your server, you can also reuse your models and validation on the server. For this to work you must share your models between the server and the client.

```js
var backbone = require('backbone'),
    _ = require('underscore'),
    validation = require('backbone-validation');

_.extend(backbone.Model.prototype, validation.mixin);
```

## Methods

### validate

This is called by Backbone when it needs to perform validation. You can also call it manually without any parameters to validate the entire model.

### isValid

Check to see if an attribute, an array of attributes or the entire model is valid.

`isValid` returns `undefined` when no validation has occurred and the model has validation (except with Backbone v0.9.9 where validation is called from the constructor), otherwise, `true` or `false`.

If you pass `true` as an argument, this will force an validation before the result is returned:

```js
var isValid = model.isValid(true);
```

If you pass the name of an attribute or an array of names, you can check whether or not the attributes are valid:

```js
// Check if name is valid
var isValid = model.isValid('name');

// Check if name and age are valid
var isValid = model.isValid(['name', 'age']);
```

### preValidate

Sometimes it can be useful to check (on each key press) if the input is valid - without changing the model - to perform some sort of live validation. You can execute the set of validators for an attribute by calling the `preValidate` method and pass it the name of the attribute and the value to validate.

If the value is not valid, the error message is returned (truthy), otherwise it returns a falsy value.

```js
var errorMessage = model.preValidate('attributeName', 'Value');
```

## Configuration

### Callbacks

The `Backbone.Validation.callbacks` contains two methods: `valid` and `invalid`. These are called after validation of an attribute is performed when using form validation.

The default implementation of `invalid` tries to look up an element within the view with an name attribute equal to the name of the attribute that is validated. If it finds one, an `invalid` class is added to the element as well as a `data-error` attribute with the error message. The `valid` method removes these if they exists.

The implementation is a bit naïve, so I recomend that you override it with your own implementation

globally:

```js
_.extend(Backbone.Validation.callbacks, {
  valid: function(view, attr, selector) {
    // do something
  },
  invalid: function(view, attr, error, selector) {
    // do something
  }
});
```

or, per view when binding:

```js
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
```

### Selector

*Default: name*

This configures what selector that will be used to look up a form element in the view. By default it uses *name*, but if you need to look up elements by class name or id instead, there are two ways to configure this.

You can configure it globally by calling:

```js
Backbone.Validation.configure({
  selector: 'class'
});
```

Or, you can configure it per view when binding:

```js
Backbone.Validation.bind(this.view, {
  selector: 'class'
});
```

If you have set the global selector to class, you can of course set the selector to name or id on specific views.

### Force update

*Default: false*

Sometimes it can be useful to update the model with invalid values. Especially when using automatic modelbinding.

You can turn this on globally by calling:

```js
Backbone.Validation.configure({
  forceUpdate: true
});
```

Or, you can turn it on per view when binding:

```js
Backbone.Validation.bind(this.view, {
  forceUpdate: true
});
```

Or, you can turn it on for one set operation only (Backbone.VERSION >= 0.9.1 only):

```js
model.set({attr: 'invalidValue'}, {
  forceUpdate: true
});
```

Note that when switching this on, Backbone's error event is no longer triggered.

### Label formatter

*Default: sentenceCase*

Label formatters determines how an attribute name is transformed before it is displayed in an error message.

There are three options available:

* 'none': Just returns the attribute name without any formatting
* 'sentenceCase': Converts `attributeName` or `attribute_name` to Attribute name
* 'label': Looks for a label configured on the model and returns it. If none found, sentenceCase is applied.

```js
var Model = Backbone.Model.extend({
  validation: {
    someAttribute: {
      required: true
    }
  },

  labels: {
    someAttribute: 'Custom label'
  }
});
```

To configure which one to use, set the labelFormatter options in configure:

```js
Backbone.Validation.configure({
  labelFormatter: 'label'
});
```


## Events

After validation is performed, the model will trigger some events with the result of the validation.

Note that the events reflects the state of the model, not only the current operation. So, if for some reason your model is in an invalid state and you set a value that is valid, `validated:invalid` will still be triggered, not `validated:valid`.

The `errors` object passed with the invalid events is a key/value pair of attribute name/error.

```js
{
  name: 'Name is required',
  email: 'Email must be a valid email'
}
```

### validated

The `validated` event is triggered after validation is performed, either it was successful or not. `isValid` is `true` or `false` depending on the result of the validation.

```js
model.bind('validated', function(isValid, model, errors) {
  // do something
});
```

### validated:valid

The `validated:valid` event is triggered after a successful validation is performed.

```js
model.bind('validated:valid', function(model) {
  // do something
});
```

### validated:invalid

The `validated:invalid` event is triggered after an unsuccessful validation is performed.

```js
model.bind('validated:invalid', function(model, errors) {
  // do something
});
```

## Built-in validators

### method validator

Lets you implement a custom function used for validation.

```js
var SomeModel = Backbone.Model.extend({
  validation: {
    name: function(value, attr, computedState) {
      if(value !== 'something') {
        return 'Name is invalid';
      }
    }
  }
});

var SomeModel = Backbone.Model.extend({
  validation: {
    name: {
      fn: function(value, attr, computedState) {
        if(value !== 'something') {
          return 'Name is invalid';
        }
      }
    }
  }
});
```

### named method validator

Lets you implement a custom function used for validation.

```js
var SomeModel = Backbone.Model.extend({
  validation: {
    name: 'validateName'
  },
  validateName: function(value, attr, computedState) {
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
  validateName: function(value, attr, computedState) {
    if(value !== 'something') {
      return 'Name is invalid';
    }
  }
});
```

### required

Validates if the attribute is required or not.

```js
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
```

### acceptance

Validates that something has to be accepted, e.g. terms of use. `true` or 'true' are valid.

```js
var SomeModel = Backbone.Model.extend({
  validation: {
    termsOfUse: {
      acceptance: true
    }
  }
});
```

### min

Validates that the value has to be a number and equal to or greater than the min value specified.

```js
var SomeModel = Backbone.Model.extend({
  validation: {
    age: {
      min: 1
    }
  }
});
```

### max

Validates that the value has to be a number and equal to or less than the max value specified.

```js
var SomeModel = Backbone.Model.extend({
  validation: {
      age: {
      max: 100
    }
  }
});
```

### range

Validates that the value has to be a number and equal to or between the two numbers specified.

```js
var SomeModel = Backbone.Model.extend({
  validation: {
    age: {
      range: [1, 10]
    }
  }
});
```

### length

Validates that the value has to be a string with length equal to the length value specified.

```js
var SomeModel = Backbone.Model.extend({
  validation: {
    postalCode: {
      length: 4
    }
  }
});
```

### minLength

Validates that the value has to be a string with length equal to or greater than the min length value specified.

```js
var SomeModel = Backbone.Model.extend({
  validation: {
    password: {
      minLength: 8
    }
  }
});
```

### maxLength

Validates that the value has to be a string with length equal to or less than the max length value specified.

```js
var SomeModel = Backbone.Model.extend({
  validation: {
    password: {
      maxLength: 100
    }
  }
});
```

### rangeLength

Validates that the value has to be a string and equal to or between the two numbers specified.

```js
var SomeModel = Backbone.Model.extend({
  validation: {
    password: {
      rangeLength: [6, 100]
    }
  }
});
```

### oneOf

Validates that the value has to be equal to one of the elements in the specified array. Case sensitive matching.

```js
var SomeModel = Backbone.Model.extend({
  validation: {
    country: {
      oneOf: ['Norway', 'Sweeden']
    }
  }
});
```

### equalTo

Validates that the value has to be equal to the value of the attribute with the name specified.

```js
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
```

### pattern

Validates that the value has to match the pattern specified. Can be a regular expression or the name of one of the built in patterns.

```js
var SomeModel = Backbone.Model.extend({
  validation: {
    email: {
      pattern: 'email'
    }
  }
});
```
The built-in patterns are:

* number - Matches any number (e.g. -100.000,00)
* email - Matches a valid email address (e.g. mail@example.com)
* url - Matches any valid url (e.g. http://www.example.com)
* digits - Matches any digit(s) (i.e. 0-9)

Specify any regular expression you like:

```js
var SomeModel = Backbone.Model.extend({
  validation: {
    email: {
      pattern: /^sample/
    }
  }
});
```

## Extending Backbone.Validation

### Adding custom validators

If you have custom validation logic that are used several places in your code, you can extend the validators with your own. And if you don't like the default implementation of one of the built-ins, you can override it.

```js
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
```

The validator should return an error message when the value is invalid, and nothing (`undefined`) if the value is valid. If the validator returns `false`, this will result in that all other validators specified for the attribute is bypassed, and the attribute is considered valid.

### Adding custom patterns

If you have custom patterns that are used several places in your code, you can extend the patterns with your own. And if you don't like the default implementation of one of the built-ins, you can override it.

```js
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
```

### Overriding the default error messages

If you don't like the default error messages you can easilly customize them by override the default ones globally:

```js
_.extend(Backbone.Validation.messages, {
  required: 'This field is required',
  min: '{0} should be at least {1} characters'
});
```

The message can contain placeholders for arguments that will be replaced:

* `{0}` will be replaced with the [formatted name](#configuration/label-formatter) of the attribute being validated
* `{1}` will be replaced with the allowed value configured in the validation (or the first one in a range validator)
* `{2}` will be replaced with the second value in a range validator

## Examples

Some examples can be found [here](http://thedersen.com/projects/backbone-validation/examples/). This is by far not complete, but I hope you get the idea. View source to see how it's made.

## FAQ

### What gets validated when?

If you are using Backbone v0.9.1 or later, all attributes in a model will be validated. However, if for instance `name` never has been set (either explicitly or with a default value) that attribute will not be validated before it gets set.

This is very useful when validating forms as they are populated, since you don't want to alert the user about errors in input not yet entered.

If you need to validate entire model (both attributes that has been set or not) you can call `validate()` or `isValid(true)` on the model.

### How can I allow empty values but still validate if the user enters something?

By default, if you configure a validator for an attribute, it is considered required. However, if you want to allow empty values and still validate when something is entered, add required: false in addition to other validators.

```js
validation: {
	value: {
		min: 1,
    required: false
  }
}
```

### I there an elegant way to display the error message that is put into the data-error attribute?

The default implementation of the callbacks are a bit naïve, since it is very difficult to make a general implementation that suits everybody.

My recommendation is to override the callbacks and implement your own strategy for displaying the error messages.

Please refer to [this section](/#configuration/callbacks) for more details.

### How can I use it with Twitter Bootstrap?

[driehle](https://github.com/driehle) put together a gist in Coffee Script that helps rendering the error messages for Twitter Bootstrap:

https://gist.github.com/2909552

Basic behaviour:

* The control-group gets an error class so that inputs get the red border
* By default error messages get rendered as &lt;p class="help-block"&gt; (which has red text because of the error class)
* You may use &lt;input .... data-error-style="inline"&gt; in your form to force rendering of a &lt;span class="help-inline"&gt;

## Release notes

#### v0.7.1 [commits](https://github.com/thedersen/backbone.validation/compare/v0.7.0...v0.7.1)

* Fixed Sizzle error: "unrecognized expression" (Thanks to [Vladimir Tsvang](https://github.com/vtsvang))
* Only binds to a collection when a model is not present on the view. Fixes #89
* Tested with Backbone v0.9.9

#### v0.7.0 [commits](https://github.com/thedersen/backbone.validation/compare/v0.6.4...v0.7.0)

* Nested validation is back! See [Configure validation rules](#configure-validation-rules-on-the-model)

#### v0.6.4 [commits](https://github.com/thedersen/backbone.validation/compare/v0.6.3...v0.6.4)

* `format(...)` and `formatLabel(...)` are made available for custom validators on `this` (Thanks to [rafanoronha](https://github.com/rafanoronha))

#### v0.6.3 [commits](https://github.com/thedersen/backbone.validation/compare/v0.6.2...v0.6.3)

* Labelformatter set to 'label' no longer crashes when no `labels` attribute is present on the model
* Does not invoke callbacks for attributes that are not validated
* Valid callbacks are always called before invalid callbacks (Thanks to [Justin Etheredge](https://github.com/jetheredge))
* Fixed typo in the readme

#### v0.6.2

* Fixed typo in the package.json (Thanks to [Patrick Scott](https://github.com/patrickleet))

#### v0.6.1

* AMD and node.js support in a seperate download
* Available on npm
* Throws error if the view has no model or collection when executing the binding

#### v0.6.0

* *BREAKING:* Nested validation is no longer supported as it came with too many issues with no obvious solution. Since it added more confusion than solving real problems, it is out until I can figure a better way of handling it.
* *BREAKING:* The array with attribute names passed to the validated/error events is replaced with an object with attribute name and error message {name: "Name is required"}
* Verified that all tests passes Backbone v0.9.2
* Fixed misspelling in `collectionAdd` function (Fixes #28, thanks to [morgoth](https://github.com/morgoth))
* Ensure model with custom `toJSON()` validates correctly (Fixes #31, thanks to [jasonzhao6](https://github.com/jasonzhao6))
* Wrong spelling of 'greater' as I'm sure we are not validating cheese (Fixes #35, thanks to [JProgrammer](https://github.com/JProgrammer))
* Fixed error when using mixin and setting values on models without validation (Fixes #36)
* Added `preValidate(attr, value)` method on validated models that can be used to preview if a value is valid or not
* User friendly names for attributes in validation messages (Thanks to [josjevv](https://github.com/josjevv))
* Required validator gets the same paramenters as method validator when specified as a function
* Lots of code clean up and restructuring
* Improved documentation

#### v0.5.2

* Fixed equalTo validator when setting both values at the same time (Fixes #27)
* Fixed removing invalid class in view when validating dependent attributes, and changing one makes the other valid

#### v0.5.1

* `error` argument passed to the error event raised by Backbone is always an array
* Can pass the name of an attribute or an array of names to `isValid` to verify if the attribute(s) are valid

#### v0.5.0

* Support for Backbone v0.9.1
* Support for object/nested validation (Fixed #20, thanks to [AndyUK](https://github.com/andyuk))
* Support for binding to a view with a collection of models
* Support for mixing in validation on `Backbone.Model.prototype`
* Context (this) in custom validators is the `Backbone.Validation.validators` object
* Calling `unbind` on a view without model no longer throws (Fixes #17)
* Method validators get a computed model state (i.e. the state of the model if the current set operation succeeds) as the third argument (Fixes #22)
* `forceUpdate` can be specified when settings attributes (Backbone.VERSION >= 0.9.1 only)

#### v0.4.0

* `isValid` returns `undefined` when no validatation has occured and the model has validation
* Passing `true` to `isValid` forces an validation
* When specifying multiple validators for one attribute, all can have it's own error message (thanks to [GarethElms](https://github.com/GarethElms))
* method validator and named method validator can be combined with other built-in validators
* acceptance validator accepts 'true' as valid (Fixes issue #12)
* Can configure per view or globally to force update the model with invalid values. This can be very useful when using automatic modelbinding and late validation (e.g. when submitting the form)
* email pattern is case insensitive
* Breaking changes (unfortunate, but necessary):
  * `setDefaultSelector` is removed, and you need to call `configure({selector: 'class'})` instead

#### v0.3.1

* Fixed issue with validated events being triggered before model was updated
* Added model and an array of invalid attribute names as arguments to the events

#### v0.3.0

* Triggers events when validation is performed (thanks to [GarethElms](https://github.com/GarethElms)):
  * 'validated' with `true` or `false` as argument
  * 'validated:valid' when model is valid
  * 'validated:invalid' when model is invalid
* Named method validator get the name of the attribute being validate as the second argument (thanks to [goreckm](https://github.com/goreckm))
* `error` argument passed to the error event raised by Backbone contains an array of errors when validating multiple attributed in one go, otherwise a string
* Breaking changes (unfortunate, but necessary):
  * isValid attribute (`model.get('isValid')`) is replaced with a method `model.isValid()`
  * Default selector is 'name' instead of 'id'

#### v0.2.0

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

#### v0.1.3

* Fixed issue where min and max validators treated strings with leading digits as numbers
* Fixed issue with undefined Backbone reference when running Backbone in no conflict mode
* Fixed issue with numeric string with more than one number not being recognized as a number

#### v0.1.2

* Initial release

## Contribute

In lieu of a formal styleguide, use two spaces for tabs and take care to maintain the existing coding style. Oh, and please add some tests:)

## Inspiration

Backbone.Validation is inspired by [Backbone.ModelBinding](http://github.com/derickbailey/backbone.modelbinding), and another implementation with a slightly different approach than mine at [Backbone.Validations](http://github.com/n-time/backbone.validations).

## License

http://thedersen.mit-license.org/