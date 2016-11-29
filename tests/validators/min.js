buster.testCase("min validator", {
    setUp: function() {
        var that = this;
        var Model = Backbone.Model.extend({
            validation: {
                age: {
                    min: 1
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
            assert.equals({age: 'Age must be greater than or equal to 1'}, error);
            done();
        });
        this.model.set({age: 0}, {validate: true});
    },

    "number lower than min is invalid": function() {
        refute(this.model.set({
            age: 0
        }, {validate: true}));
    },

    "non numeric value is invalid": function() {
        refute(this.model.set({
            age: '10error'
        }, {validate: true}));
    },

    "number equal to min is valid": function() {
        assert(this.model.set({
            age: 1
        }, {validate: true}));
    },

    "number greater than min is valid": function() {
        assert(this.model.set({
            age: 2
        }, {validate: true}));
    },

    "numeric string values are treated as numbers": function() {
        assert(this.model.set({
            age: '1'
        }, {validate: true}));
    },

    "when required is not specified": {
        "undefined is invalid": function() {
            refute(this.model.set({
                age: undefined
            }, {validate: true}));
        },

        "null is invalid": function() {
            refute(this.model.set({
                age: null
            }, {validate: true}));
        }
    },

    "when required:false": {
        setUp: function() {
            this.model.validation.age.required = false;
        },

        "null is valid": function() {
            assert(this.model.set({
                age: null
            }, {validate: true}));
        },

        "undefined is valid": function() {
            assert(this.model.set({
                age: undefined
            }, {validate: true}));
        }
    },

    "when required:true": {
        setUp: function() {
            this.model.validation.age.required = true;
        },

        "undefined is invalid": function() {
            refute(this.model.set({
                age: undefined
            }, {validate: true}));
        },

        "null is invalid": function() {
            refute(this.model.set({
                age: null
            }, {validate: true}));
        }
    },

    "when min:0, 0 < val < 1": {
        setUp: function() {
            this.model.validation.aFloat = {
                min: 0
            };
        },
        "val is string, no leading zero, e.g. '.2'": function() {
            assert(this.model.set({
                aFloat: '.2'
            }, {validate: true}));
        },
        "val is string, leading zero, e.g. '0.2'": function() {
            assert(this.model.set({
                aFloat: '0.2'
            }, {validate: true}));
        },
        "val is number, leading zero, e.g. 0.2": function() {
            assert(this.model.set({
                aFloat: 0.2
            }, {validate: true}));
        }
    }

});
