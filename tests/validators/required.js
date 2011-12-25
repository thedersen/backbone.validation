buster.testCase("required validator", {
    setUp: function() {
        var that = this;
        var Model = Backbone.Model.extend({
            validation: {
                name: {
                    required: true
                },
                agree: {
                    required: true
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

    "empty string is invalid": function() {
        refute(this.model.set({
            name: ''
        }));
    },
    
    "non-empty string is valid": function() {
        assert(this.model.set({
            name: 'a'
        }));
    },

    "blank string is invalid": function() {
        refute(this.model.set({
            name: '  '
        }));
    },

    "null is invalid": function() {
        refute(this.model.set({
            name: null
        }));
    },

    "undefined is invalid": function() {
        refute(this.model.set({
            name: undefined
        }));
    },

    "false boolean is invalid": function() {
        refute(this.model.set({
            agree: false
        }));
    },

    "true boolean is valid": function() {
        assert(this.model.set({
            agree: true
        }));
    }
});