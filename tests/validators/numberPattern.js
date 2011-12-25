buster.testCase("number pattern validator", {
    setUp: function() {
        var that = this;
        var Model = Backbone.Model.extend({
            validation: {
                age: {
                    pattern: 'number'
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
    
    "non numeric value is invalid": function() {
        refute(this.model.set({
            age: '1a'
        }));
    },

    "numeric value with one digit is valid": function() {
        assert(this.model.set({
            age: 1
        }));
    },
    
    "negative numeric value with one digit is valid": function() {
        assert(this.model.set({
            age: -1
        }));
    },
    
    "numeric value with several digits is valid": function() {
        assert(this.model.set({
            age: 1234
        }));
    },
    
    "numeric string value is valid": function() {
        assert(this.model.set({
            age: "1234"
        }));
    },
    
    "negative numeric string value is valid": function() {
        assert(this.model.set({
            age: "-1234"
        }));
    }
});