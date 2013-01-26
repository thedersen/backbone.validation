buster.testCase('Extending Backbone.Validation with custom pattern', {
    setUp: function() {
        _.extend(Backbone.Validation.patterns, {
            custom: /^test/
        });

        var Model = Backbone.Model.extend({
            validation: {
                name: {
                    pattern: 'custom'
                }
            }
        });

        this.model = new Model();
        Backbone.Validation.bind(new Backbone.View({
            model: this.model
        }));
    },

    "should execute the custom pattern validator": function() {
        assert(this.model.set({
            name: 'test'
        }, {validate: true}));
        refute(this.model.set({
            name: 'aa'
        }, {validate: true}));
    }
});

buster.testCase('Overriding builtin pattern in Backbone.Validation', {
    setUp: function() {
        this.builtinEmail = Backbone.Validation.patterns.email;
        
        _.extend(Backbone.Validation.patterns, {
            email: /^test/
        });

        var Model = Backbone.Model.extend({
            validation: {
                name: {
                    pattern: 'email'
                }
            }
        });

        this.model = new Model();
        Backbone.Validation.bind(new Backbone.View({
            model: this.model
        }));
    },

    tearDown: function(){
        Backbone.Validation.patterns.email = this.builtinEmail;
    },

    "should execute the custom pattern validator": function() {
        assert(this.model.set({
            name: 'test'
        }, { validate: true }));
        refute(this.model.set({
            name: 'aa'
        }, { validate: true }));
    }
});
