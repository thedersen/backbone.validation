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
    
    "string with numbers and characters is invalid": function() {
        refute(this.model.set({
            age: '1a'
        }));
    },
        
    "boolean is invalid": function() {
        refute(this.model.set({
            age: true
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