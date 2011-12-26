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
    },
    
    "when required is not specified": {
        "undefined is invalid": function() {
            refute(this.model.set({
                age: undefined
            }));
        },
        
        "null is invalid": function() {
            refute(this.model.set({
                age: null
            }));
        }
    },
    
    "when required:false": {
        setUp: function() {
            this.model.validation.age.required = false;
        },

        "null is valid": function() {
            assert(this.model.set({
                age: null
            }));
        },
        
        "undefined is valid": function() {
            assert(this.model.set({
                age: undefined
            }));
        }
    },
    
    "when required:true": {
        setUp: function() {
            this.model.validation.age.required = true;
        },

        "undefined is invalid": function() {
            refute(this.model.set({
                age: undefined
            }));
        },

        "null is invalid": function() {
            refute(this.model.set({
                age: null
            }));
        }
    }
});