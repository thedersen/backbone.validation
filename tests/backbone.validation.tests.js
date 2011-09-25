//var buster = require("buster");
var assert = buster.assert;

buster.testCase("Backbone.Validation", {
	setUp: function() {
		var View = Backbone.View.extend({
			render: function() {
				var html = $('<input type="text" id="age">');
				this.$(this.el).append(html);

				Backbone.Validation.bind(this);
			}
		});
		
		var Model = Backbone.Model.extend({});

		this.model = new Model();
		this.view = new View({
			model: this.model
		});

		this.view.render();
	},

	"Custom validator": {
		setUp: function() {
			this.model.validation = {
				age: function(val) {
					if (val === 0) {
						return "Age is invalid";
					}
				}
			};
		},
		

    	"valid property should not have invalid class": function() {
    		this.model.set({
    			age: 1
    		});

    		var el = $(this.view.$("#age"));
    		assert.isFalse(el.hasClass('invalid'));
    	},

    	"invalid property should have invalid class": function() {
    		this.model.set({
    			age: 0
    		});

    		var el = $(this.view.$("#age"));
    		assert.isTrue(el.hasClass('invalid'));
    	},

    	"invalid property should have data attribute with error message": function() {
    		this.model.set({
    			age: 0
    		});

    		var el = $(this.view.$("#age"));
    		assert.equals(el.data['error'], 'Age is invalid');
    	}
	}
});
