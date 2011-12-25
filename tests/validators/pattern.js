buster.testCase("pattern validator", {
    setUp: function() {
        var that = this;
        var Model = Backbone.Model.extend({
            validation: {
                name: {
                    pattern: /^test/
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
    
    "value not matching pattern is invalid": function() {
        refute(this.model.set({
            name: 'aaa'
        }));
    },

    "value matching pattern is valid": function() {
        assert(this.model.set({
            name: 'test'
        }));
    }
});