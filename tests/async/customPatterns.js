buster.testCase('Backbone.Validation.Async Extending Backbone.Validation with custom pattern', {
    setUp: function() {
        _.extend(Backbone.Validation.Async.patterns, {
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
        Backbone.Validation.Async.bind(new Backbone.View({
            model: this.model
        }));
    },

    "should execute the custom pattern validator": function(done) {
        this.model.set({name: 'test'}, {validate: true});
        this.model.isValid(null, done(function valid() {
            assert(true);
        }), done(function invalid() {
            assert(false);
        }));
        this.model.set({name: 'aa'}, {validate: true});
        this.model.isValid(null, done(function valid() {
            assert(false);
        }), done(function invalid() {
            assert(true);
        }));
    }
});

buster.testCase('Backbone.Validation.Async Overriding builtin pattern in Backbone.Validation', {
    setUp: function() {
        this.builtinEmail = Backbone.Validation.Async.patterns.email;
        
        _.extend(Backbone.Validation.Async.patterns, {
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
        Backbone.Validation.Async.bind(new Backbone.View({
            model: this.model
        }));
    },

    tearDown: function(){
        Backbone.Validation.Async.patterns.email = this.builtinEmail;
    },

    "should execute the custom pattern validator": function(done) {
        this.model.set({name: 'test'}, {validate: true});
        this.model.isValid(null, done(function valid() {
            assert(true);
        }), done(function invalid() {
            assert(false);
        }));
        this.model.set({name: 'aa'}, {validate: true});
        this.model.isValid(null, done(function valid() {
            assert(false);
        }), done(function invalid() {
            assert(true);
        }));
    }
});
