buster.testCase('Extending Backbone.Validation with custom validator', {
    setUp: function() {
        var that = this;
        _.extend(Backbone.Validation.validators, {
            custom: function(value, attr, customValue) {
                that.context = this;
                if (value !== customValue) {
                    return 'error';
                }
            }
        });

        var Model = Backbone.Model.extend({
            validation: {
                age: {
                    custom: 1
                }
            }
        });

        this.model = new Model();
        Backbone.Validation.bind(new Backbone.View({
            model: this.model
        }));
    },

    "should execute the custom validator": function() {
        assert(this.model.set({
            age: 1
        }));
        refute(this.model.set({
            age: 2
        }));
    },

    "context is the validators object": function() {
        this.model.set({age:1});
        assert.same(Backbone.Validation.validators, this.context);
    }
});

buster.testCase('Overriding built-in validator in Backbone.Validation', {
    setUp: function() {
        this.builtinMin = Backbone.Validation.validators.min;

        _.extend(Backbone.Validation.validators, {
            min: function(value, attr, customValue) {
                if (value !== customValue) {
                    return 'error';
                }
            }
        });

        var Model = Backbone.Model.extend({
            validation: {
                age: {
                    min: 1
                }
            }
        });

        this.model = new Model();
        Backbone.Validation.bind(new Backbone.View({
            model: this.model
        }));
    },

    tearDown: function(){
        Backbone.Validation.validators.min = this.builtinMin;
    },

    "should execute the overridden validator": function() {
        assert(this.model.set({
            age: 1
        }));
        refute(this.model.set({
            age: 2
        }));
    }
});

buster.testCase("Chaining built-in validators with custom", {
    setUp: function() {
        _.extend(Backbone.Validation.validators, {
            custom2: function(value, attr, customValue, model) {
                if (value !== customValue) {
                        return 'error';
                }
            },
            custom: function(value, attr, customValue, model) {
                return this.required(value, attr, true, model) || this.custom2(value, attr, customValue, model);
            }
        });

        var Model = Backbone.Model.extend({
            validation: {
                name: {
                    custom: 'custom'
                }
            }
        });

        this.model = new Model();
        Backbone.Validation.bind(new Backbone.View({
            model: this.model
        }));
    },

    "violating first validator in chain return first error message": function() {
        assert.equals(['name is required'], this.model.validate({name:''}));
    },

    "violating second validator in chain return second error message": function() {
        assert.equals(['error'], this.model.validate({name:'a'}));
    },

    "violating none of the validators returns undefined": function() {
        refute.defined(this.model.validate({name:'custom'}));
    }
});
