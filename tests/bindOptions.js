buster.testCase("Backbone.Validation bind options", {
    setUp: function() {
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
        this.valid = this.spy();
        this.invalid = this.spy();

        Backbone.Validation.bind(new Backbone.View({
            model: this.model
        }), {
            valid: this.valid,
            invalid: this.invalid
        });
    },

    "should call valid function passed with options": function() {
        this.model.set({
            age: 1
        });

        assert.called(this.valid);
    },

    "should call invalid function passed with options": function() {
        this.model.set({
            age: 0
        });

        assert.called(this.invalid);
    }
});