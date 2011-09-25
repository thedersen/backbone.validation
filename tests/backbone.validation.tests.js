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
			
			this.el = $(this.view.$("#age"));			
		},

		"valid property": {
			setUp: function() {
				this.model.set({
					age: 1
				});
			},

			"should not have invalid class": function() {
				assert.isFalse(this.el.hasClass('invalid'));
			},
			
			"should not have data property with error message": function(){
			    assert.isUndefined(this.el.data['error']);
			}
		},

		"invalid property": {
			setUp: function() {
				this.model.set({
					age: 0
				});
			},

			"invalid property should have invalid class": function() {
				assert.isTrue(this.el.hasClass('invalid'));
			},

			"invalid property should have data attribute with error message": function() {
				assert.equals(this.el.data['error'], 'Age is invalid');
			}
		}
	}
});
