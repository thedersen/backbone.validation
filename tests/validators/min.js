buster.testCase("min validator", {
    setUp: function() {
        var that = this;
        var Model = Backbone.Model.extend({
            validation: {
                age: {
                    min: 1
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
    
    "undefined is invalid": function() {
        refute(this.model.set({
            age: undefined
        }));
    },

    "number lower than min is invalid": function() {
        refute(this.model.set({
            age: 0
        }));
    },

    "non numeric value is invalid": function() {
        refute(this.model.set({
            age: '10error'
        }));
    },

    "number equal to min is valid": function() {
        assert(this.model.set({
            age: 1
        }));
    },

    "numeric string value equal to min is valid": function() {
        assert(this.model.set({
            age: '1'
        }));
    }
});