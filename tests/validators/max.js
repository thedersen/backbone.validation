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
    
    "undefined is invalid when required is not specified": function() {
        refute(this.model.set({
            age: undefined
        }));
    },
    
    "undefined is invalid when required:true": function() {
        this.model.validation.age.required = true;

        refute(this.model.set({
            age: undefined
        }));
    },
        
    "undefined is valid when required:false": function() {
        this.model.validation.age.required = false;

        assert(this.model.set({
            age: undefined
        }));
    },
        
    "null is invalid when required is not specified": function() {
        refute(this.model.set({
            age: null
        }));
    },
    
    "null is invalid when required:true": function() {
        this.model.validation.age.required = true;

        refute(this.model.set({
            age: null
        }));
    },
        
    "null is valid when required:false": function() {
        this.model.validation.age.required = false;

        assert(this.model.set({
            age: null
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