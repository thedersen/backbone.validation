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
			this.model.set({name: 'name'}, {validate: true});

			assert(this.model.isValid());
		},

		"returns false when model is invalid": function() {
			this.model.set({name: ''}, {validate: true});

			refute(this.model.isValid());
		},

		"can force validation by passing true": function() {
			refute.defined(this.model.isValid());
			assert(this.model.isValid(true) === false);
		},

		"and passing name of attribute": {
			setUp: function() {
				this.model.validation = {
					name: {
						required: true
					},
					age: {
						required: true
					}
				};
			},

			"returns false when attribute is invalid": function() {
				refute(this.model.isValid('name'));
			},

			"returns true when attribute is valid": function() {
				this.model.set({name: 'name'});

				assert(this.model.isValid('name'));
			}
		},

		"and passing array of attributes": {
			setUp: function() {
				this.model.validation = {
					name: {
						required: true
					},
					age: {
						required: true
					},
					phone: {
						required: true
					}
				};
			},

			"returns false when all attributes are invalid": function() {
				refute(this.model.isValid(['name', 'age']));
			},

			"returns false when one attribute is invalid": function() {
				this.model.set({name: 'name'});

				refute(this.model.isValid(['name', 'age']));
			},

			"returns true when all attributes are valid": function() {
				this.model.set({name: 'name', age: 1 });

				assert(this.model.isValid(['name', 'age']));
			}
		}
	}
});