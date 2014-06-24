buster.testCase("notEqualTo validator", {
    setUp: function() {
        var that = this;
        var Model = Backbone.Model.extend({
            validation: {
                email: {
                    required: true,
                    pattern: 'email',
                },
                parentEmail: {
                    required: true,
                    pattern: 'email',
                    notEqualTo: 'email'
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

        this.model.set({email: 'email@example.com'});
    },

    "has default error message": function(done) {
        this.model.bind('validated:invalid', function(model, error){
            assert.equals({parentEmail: 'Parent email must not be the same as Email'}, error);
            done();
        });
        this.model.set({parentEmail:'email@example.com'}, {validate: true});
    },

    "value equal to (===) the specified attribute is invalid": function(){
        refute(this.model.set({
            parentEmail: 'email@example.com'
        }, {validate: true}));
    },

    "value not equal to (!==) the specified attribute is valid": function(){
        assert(this.model.set({
            parentEmail: 'parentemail@example.com'
        }, {validate: true}));
    }

});
