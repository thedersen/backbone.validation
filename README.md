# Backbone.Validation

Convention-based validation binding for [Backbone.js](http://documentcloud.github.com/backbone)

Inspired by [Backbone.ModelBinding](http://github.com/derickbailey/backbone.modelbinding), and another implementation with a slightly different approach than mine at [Backbone.Validations](http://github.com/n-time/backbone.validation).

## Getting Started

It's easy to get up and running. You only need to have Backbone (including underscore.js - a requirement for Backbone) and jQuery in your page before including the Backbone.Validation plugin.

### Validation Binding

The validation binding code is executed with a call to `Backbone.Validation.bind(view)`. There are
several places that it can be called from, depending on your circumstances.

#### Binding After Rendering

	SomeView = Backbone.View.extend({
	  render: function(){
	    // ... render your form here
	    $(this.el).html("... some html and content goes here ... ");

	    // execute the validation bindings
	    Backbone.Validation.bind(this);
	  }
	});

#### Binding When Initializing

	FormView = Backbone.View.extend({
	  initialize: function(){
	    Backbone.Validation.bind(this);
	  }
	});

#### Binding From Outside a View

There is no requirement for the validation binding code to be called from within a view directly.
You can bind the view from external code, like this:


	FormView = Backbone.View.extend({
	  el: "#some-form",
	});

	formView = new FormView();
	Backbone.Validation.bind(formView);
