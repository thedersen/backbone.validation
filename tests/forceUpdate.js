buster.testCase("forceUpdate", {
	setUp: function() {
		var Model = Backbone.Model.extend({
			validation: {
				name: {
					required: true
				}
			}
		});
		this.model = new Model();
		this.view = new Backbone.View({model: this.model});
	},

	"default behaviour": {
		setUp: function() {
			Backbone.Validation.bind(this.view);
		},

		"invalid values are not set on model": function() {
			refute(this.model.set({name:''}, {validate: true}));
		}
	},

	"forcing update when binding": {
		setUp: function() {
			Backbone.Validation.bind(this.view, {
				forceUpdate: true
			});
		},

		"invalid values are set on model": function() {
			assert(this.model.set({name:''}, {validate: true}));
		}
	},

	"forcing update when setting attribute": {
		setUp: function() {
			Backbone.Validation.bind(this.view);
		},

		"invalid values are set on model": function() {
      assert(this.model.set({name:''}, {forceUpdate: true, validate: true}));
		}
	},

	"forcing update globally": {
		setUp: function() {
			Backbone.Validation.configure({
				forceUpdate: true
			});
			Backbone.Validation.bind(this.view);
		},

		tearDown: function() {
			Backbone.Validation.configure({
				forceUpdate: false
			});
		},

		"invalid values are set on model": function() {
			assert(this.model.set({name:''}, {validate: true}));
		}
	}
});