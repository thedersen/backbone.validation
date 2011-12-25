buster.testCase("email pattern validator", {
    setUp: function() {
        var that = this;
        var Model = Backbone.Model.extend({
            validation: {
                email: {
                    pattern: 'email'
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
    
    "an invalid email is invalid": function() {
        refute(this.model.set({
            email: 'aaa'
        }));
    },

    "a valid email is valid": function() {
        assert(this.model.set({
            email: 'a@example.com'
        }));
    }
});