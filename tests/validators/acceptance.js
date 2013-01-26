buster.testCase("acceptance validator", {
    setUp: function() {
        var that = this;
        var Model = Backbone.Model.extend({
            validation: {
                agree: {
                    acceptance: true
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

    "has default error message": function(done) {
        this.model.bind('validated:invalid', function(model, error){
            assert.equals({agree: 'Agree must be accepted'}, error);
            done();
        });
        this.model.set({agree:false}, {validate: true});
    },

    "non-boolean is invalid": function(){
        refute(this.model.set({
            agree: 'non-boolean'
        }, {validate: true}));
    },

    "string with true is evaluated as valid": function() {
        assert(this.model.set({
            agree: 'true'
        }, {validate: true}));
    },

    "false boolean is invalid": function() {
        refute(this.model.set({
            agree: false
        }, {validate: true}));
    },

    "true boolean is valid": function() {
        assert(this.model.set({
            agree: true
        }, {validate: true}));
    }
});