buster.testCase("max validator", {
    setUp: function() {
        var that = this;
        var Model = Backbone.Model.extend({
            validation: {
                age: {
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
    
    "undefined is invalid": function() {
        refute(this.model.set({
            age: undefined
        }));
    },

    "number higher than max is invalid": function() {
        refute(this.model.set({
            age: 11
        }));
    },

    "non numeric value is invalid": function() {
        refute(this.model.set({
            age: '10error'
        }));
    },

    "number equal to max is valid": function() {
        assert(this.model.set({
            age: 10
        }));
    },

    "numeric string value equal to max is valid": function() {
        assert(this.model.set({
            age: '10'
        }));
    }
});