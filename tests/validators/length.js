buster.testCase("length validator", {
    setUp: function() {
        var that = this;
        var Model = Backbone.Model.extend({
            validation: {
                postalCode: {
                    length: 2
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
            postalCode: undefined
        }));
    },

    "string with length shorter than length is invalid": function() {
        refute(this.model.set({
            postalCode: 'a'
        }));
    },

    "string with length longer than length is invalid": function() {
        refute(this.model.set({
            postalCode: 'aaa'
        }));
    },

    "string with length equal to length is valid": function() {
        assert(this.model.set({
            postalCode: 'aa'
        }));
    }
});