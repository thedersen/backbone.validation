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
