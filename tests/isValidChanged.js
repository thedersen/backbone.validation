buster.testCase("isValidChanged", {
	"when bound to invalid model": {
		setUp: function() {
			var Model = Backbone.Model.extend({
				validation: {
					name: {
						required: true
					}
				}
			});
			this.model = new Model({name:''}); //invalid model
			Backbone.Validation.bind(new Backbone.View({model: this.model}));
		},

		"returns false because the model is invalid": function() {
			refute(this.model.isValid());
		}
	},
	"when bound to invalid unchanged model but validating only changed attributes": {
		setUp: function() {
			var Model = Backbone.Model.extend({
				validation: {
					name: {
						required: true
					},
					age: {
						required: true
					}
				}
			});
			this.model = new Model({name:'', age:''}); // invalid model
			Backbone.Validation.bind(new Backbone.View({model: this.model}), {useChangedAttr:true});
		},

		"returns true because nothing changed": function() {
			assert(this.model.isValid(true)); // force model validation
		}
	},
	"when bound to valid model, and an attribute is given an invalid value": {
		setUp: function() {
			var Model = Backbone.Model.extend({
				validation: {
					name: {
						required: true
					},
					age: {
						required: true
					}
				}
			});
			this.model = new Model({name:'name', age:'12'});
			Backbone.Validation.bind(new Backbone.View({model: this.model}));
			this.model.set("name", "");
		},

		"returns false because a property is invalid": function() {
			refute(this.model.isValid(true)); // force model validation
		}
	},
	"when bound to valid model validating validating only changed attributes, and an attribute is given an invalid value": {
		setUp: function() {
			var Model = Backbone.Model.extend({
				validation: {
					name: {
						required: true
					},
					age: {
						required: true
					}
				}
			});
			this.model = new Model({name:'name', age:'12'}, {useChangedAttr:true});
			Backbone.Validation.bind(new Backbone.View({model: this.model}));
			this.model.set("name", "");
		},

		"returns false because a changed property is invalid": function() {
			refute(this.model.isValid(true)); // force model validation
		}
	},
	"when bound to invalid model validating only changed attributes, and changing an attribute with a valid value": {
		setUp: function() {
			var Model = Backbone.Model.extend({
				validation: {
					name: {
						required: true
					},
					age: {
						required: true
					}
				}
			});
			this.model = new Model({name:'', age:''});
			Backbone.Validation.bind(new Backbone.View({model: this.model}), {useChangedAttr:true});
			this.model.set("name", "Steve");
		},

		"returns true because the changed value is valid": function() {
			assert(this.model.isValid(true)); // force model validation
		}
	}
});