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
			this.originalCallbacks = {};
			_.extend(this.originalCallbacks, Backbone.Validation.callbacks);

			this.valid = this.spy();
			this.invalid = this.spy();

			_.extend(Backbone.Validation.callbacks, {
				valid: this.valid,
				invalid: this.invalid
			});

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

		tearDown: function(){
			_.extend(Backbone.Validation.callbacks, this.originalCallbacks);
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

		"and passing forceValidation": {
			"forces validation and calls callbacks when model is valid": function() {
				this.model.set({name: 'name'}, { silent:true });
				assert(this.model.isValid(true));
				assert.called(this.valid);
			},

			"forces validation and calls callbacks when model is invalid": function() {
				refute(this.model.isValid(true));
				assert.called(this.invalid);
			}
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
				this.model.set({name: 'name'}, { silent:true });

				assert(this.model.isValid('name'));
			},

			"and passing forceValidation": {
				"returns false and fires callback when attribute is invalid": function() {
					refute(this.model.isValid('name', true));
					assert.called(this.invalid);
				},

				"returns true and fires callback when attribute is valid": function() {
					this.model.set({name: 'name'}, { silent:true });

					assert(this.model.isValid('name', true));
					assert.called(this.valid);
				}
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
				this.model.set({name: 'name'}, { silent:true });

				refute(this.model.isValid(['name', 'age']));
			},

			"returns true when all attributes are valid": function() {
				this.model.set({name: 'name', age: 1 }, { silent:true });

				assert(this.model.isValid(['name', 'age']));
			},

			"and passing forceValidation": {
				"returns false and fires callback when all attributes are invalid": function() {
					refute(this.model.isValid(['name', 'age'], true));
					assert.called(this.invalid);
				},

				"returns false and fires callback when one attribute is invalid": function() {
					this.model.set({name: 'name'}, { silent:true });

					refute(this.model.isValid(['name', 'age'], true));
					assert.called(this.invalid);
				},

				"returns true and fires callback when all attributes are valid": function() {
					this.model.set({name: 'name', age: 1 }, { silent:true });

					assert(this.model.isValid(['name', 'age'], true));
					assert.called(this.valid);
				}
			}
		}
	}
});