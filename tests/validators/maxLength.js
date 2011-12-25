buster.testCase("maxLength validator", {
    setUp: function() {
        var that = this;
        var Model = Backbone.Model.extend({
            validation: {
                name: {
                    maxLength: 2
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
    
    "string with length longer than maxLenght is invalid": function() {
        refute(this.model.set({
            name: 'aaa'
        }));
    },

    "string with length equal to maxLength is valid": function() {
        assert(this.model.set({
            name: 'aa'
        }));
    }
});