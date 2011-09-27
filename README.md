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



# License

The MIT License

Copyright (c) 2011 Thomas Pedersen

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.