buster.testCase("isValid", {
	"when model has not defined any validation": {
		setUp: function() {
			this.model = new Backbone.Model();

			Backbone.Validation.bind(new Backbone.View({model: this.model}));
		},

		"returns true": function() {
			assert(this.model.isValid());
		}
	},

	"when model has defined validation": {
		setUp: function() {
			var Model = Backbone.Model.extend({
				validation: {
					name: {
						required: true
					}
				}
			});
			this.model = new Model();
			Backbone.Validation.bind(new Backbone.View({model: this.model}));
		},

		"returns undefined when model is never validated": function() {
			refute.defined(this.model.isValid());
		},

		"returns true when model is valid": function() {
			this.model.set({name: 'name'});

			assert(this.model.isValid());
		},

		"returns false when model is invalid": function() {
			this.model.set({name: ''});

			refute(this.model.isValid());
		},

		"can force validation by passing true": function() {
			assert(this.model.isValid(true) === false);
		}
	}
});