buster.testCase("Backbone.Validation.Async forceUpdate", {
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
			Backbone.Validation.Async.bind(this.view);
		},

		"invalid values are not set on model": function(done) {
			this.model.set({name:''}, {validate: true});
			this.model.validate(null, null, done(function valid() {
				assert(false);
			}), done(function invalid() {
				assert(true);
			}))
		}
	},

	"forcing update when binding": {
		setUp: function() {
			Backbone.Validation.Async.bind(this.view, {
				forceUpdate: true
			});
		},

		"invalid values are set on model": function(done) {
			this.model.set({name:''}, {validate: true});
			this.model.validate(null, null, done(function valid() {
				assert(true);
			}), done(function invalid() {
				assert(false);
			}))
		}
	},

	"forcing update when setting attribute": {
		setUp: function() {
			Backbone.Validation.Async.bind(this.view);
		},

		"invalid values are set on model": function(done) {
    		this.model.set({name:''}, {validate: true});
			this.model.validate(null, {forceUpdate: true}, done(function valid() {
				assert(true);
			}), done(function invalid() {
				assert(false);
			}))
		}
	},

	"forcing update globally": {
		setUp: function() {
			Backbone.Validation.Async.configure({
				forceUpdate: true
			});
			Backbone.Validation.Async.bind(this.view);
		},

		tearDown: function() {
			Backbone.Validation.Async.configure({
				forceUpdate: false
			});
		},

		"invalid values are set on model": function(done) {
			this.model.set({name:''}, {validate: true});
			this.model.validate(null, null, done(function valid() {
				assert(true);
			}), done(function invalid() {
				assert(false);
			}))
		}
	}
});