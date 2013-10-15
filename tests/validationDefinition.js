buster.testCase("Backbone.Validation validation definition", {
    setUp: function() {
        var Model = Backbone.Model.extend({
            validation: function() {
                return {
                    name: {
                        required: true
                    }
                };
            }
        });

        _.extend(Model.prototype, Backbone.Validation.mixin);

        this.model = new Model();
    },

    "can be a function": function () {
        refute(this.model.set({
            name: ''
        }, {validate: true}));

        assert(this.model.set({
            name: 'name'
        }, {validate: true}));
    }
});