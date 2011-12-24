buster.testCase('Backbone.Validation add custom validator', {
    setUp: function() {
        _.extend(Backbone.Validation.validators, {
            custom: function(value, attr, msg, customValue) {
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

    "should fire custom validator": function() {
        assert(this.model.set({
            age: 1
        }));
        refute(this.model.set({
            age: 2
        }));
    }
});

buster.testCase('Backbone.Validation override existing validator', {
    setUp: function() {
		this.builtinMin = Backbone.Validation.validators.min;
		
        _.extend(Backbone.Validation.validators, {
            min: function(value, attr, msg, customValue) {
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
	
    "should fire custom validator": function() {
        assert(this.model.set({
            age: 1
        }));
        refute(this.model.set({
            age: 2
        }));
    }
});
