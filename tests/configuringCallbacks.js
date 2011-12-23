buster.testCase("Backbone.Validation override callbacks", {
    setUp: function() {
        this.valid = this.spy();
        this.invalid = this.spy();

        _.extend(Backbone.Validation.callbacks, {
            valid: this.valid,
            invalid: this.invalid
        });

        var Model = Backbone.Model.extend({
            validation: {
                age: function(val) {
                    if (val === 0) {
                        return "Age is invalid";
                    }
                }
            }
        });

        this.model = new Model();

        Backbone.Validation.bind(new Backbone.View({
            model: this.model
        }));
    },

    "should call overridden valid function": function() {
        this.model.set({
            age: 1
        });

        assert.called(this.valid);
    },

    "should call overridden invalid function": function() {
        this.model.set({
            age: 0
        });

        assert.called(this.invalid);
    }
});
