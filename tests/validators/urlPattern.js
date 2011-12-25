buster.testCase("url pattern validator", {
    setUp: function() {
        var that = this;
        var Model = Backbone.Model.extend({
            validation: {
                url: {
                    pattern: 'url'
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
    
    "an invalid url is invalid": function() {
        refute(this.model.set({
            url: 'aaa'
        }));
    },

    "a valid url is valid": function() {
        assert(this.model.set({
            url: 'http://www.example.com?something=true&'
        }));
    }
});