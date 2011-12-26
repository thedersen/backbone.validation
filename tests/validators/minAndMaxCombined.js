buster.testCase("min and max validators combined", {
    setUp: function() {
        var that = this;
        var Model = Backbone.Model.extend({
            validation: {
                age: {
                    min: 1,
                    max: 10
                }
            }
        });
        
        this.model = new Model();
        this.view = new Backbone.View({
            model: this.model
        });

        Backbone.Validation.bind(this.view, {
            valid: this.spy(),
            invalid: this.spy()
        });
    },
    
    "number lower than min is invalid": function() {
        refute(this.model.set({
            age: 0
        }));
    },

    "number equal to min is valid": function() {
        assert(this.model.set({
            age: 1
        }));
    },

    "number higher than max is invalid": function() {
        refute(this.model.set({
            age: 11
        }));
    },

    "number equal to max is valid": function() {
        assert(this.model.set({
            age: 10
        }));
    },
    
    "number between min and max is valid": function() {
        assert(this.model.set({
            age: 5
        }));
    }
});