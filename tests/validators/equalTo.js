buster.testCase("equalTo validator", {
    setUp: function() {
        var that = this;
        var Model = Backbone.Model.extend({
            validation: {
                password: {
                    required: true
                },
                passwordRepeat: {
                    equalTo: 'password'
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

        this.model.set({password: 'password'});
    },

    "has default error message": function(done) {
        this.model.bind('error', function(model, error){
            assert.equals({passwordRepeat: 'Password repeat must be the same as Password'}, error);
            done();
        });
        this.model.set({passwordRepeat:'123'});
    },

    "value equal to (===) the specified attribute is valid": function(){
        assert(this.model.set({
            passwordRepeat: 'password'
        }));
    },

    "value not equal to (!==) the specified attribute is invalid": function(){
        refute(this.model.set({
            passwordRepeat: 'error'
        }));
    },

    "is case sensitive": function(){
        refute(this.model.set({
            passwordRepeat: 'Password'
        }));
    },

    "setting both at the same time to the same value is valid": function() {
        assert(this.model.set({
            password: 'a',
            passwordRepeat: 'a'
        }));
    }
});
