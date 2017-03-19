module.exports = {
	"forceUpdate": {
		beforeEach: function () {
			var Model = Backbone.Model.extend({
				validation: {
					name: {
						required: true
					}
				}
			});
			this.model = new Model();
			this.view = new Backbone.View({ model: this.model });
		},

		"default behaviour": {
			beforeEach: function () {
				Backbone.Validation.bind(this.view);
			},

			"invalid values are not set on model": function () {
				refute(this.model.set({ name: '' }, { validate: true }));
			}
		},

		"forcing update when binding": {
			beforeEach: function () {
				Backbone.Validation.bind(this.view, {
					forceUpdate: true
				});
			},

			"invalid values are set on model": function () {
				assert(this.model.set({ name: '' }, { validate: true }));
			}
		},

		"forcing update when setting attribute": {
			beforeEach: function () {
				Backbone.Validation.bind(this.view);
			},

			"invalid values are set on model": function () {
				assert(this.model.set({ name: '' }, { forceUpdate: true, validate: true }));
			}
		},

		"forcing update globally": {
			beforeEach: function () {
				Backbone.Validation.configure({
					forceUpdate: true
				});
				Backbone.Validation.bind(this.view);
			},

			afterEach: function () {
				Backbone.Validation.configure({
					forceUpdate: false
				});
			},

			"invalid values are set on model": function () {
				assert(this.model.set({ name: '' }, { validate: true }));
			}
		}
	}
}