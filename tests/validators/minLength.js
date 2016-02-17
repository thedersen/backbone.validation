buster.testCase("minLength validator", {
    setUp: function() {
        var that = this;
        var Model = Backbone.Model.extend({
            validation: {
                name: {
                    minLength: 2
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

    "has default error message for string": function(done) {
        this.model.bind('validated:invalid', function(model, error){
            assert.equals({name: 'Name must be at least 2 characters'}, error);
            done();
        });
        this.model.set({name:''}, {validate: true});
    },

    "has default error message for array": function(done) {
        this.model.bind('validated:invalid', function(model, error){
            assert.equals({name: 'Name must contain at least 2 elements'}, error);
            done();
        });
        this.model.set({name:[]}, {validate: true});
    },

    "string with length shorter than minLength is invalid": function() {
        refute(this.model.set({
            name: 'a'
        }, {validate: true}));
    },

    "string with length equal to minLength is valid": function() {
        assert(this.model.set({
            name: 'aa'
        }, {validate: true}));
    },

    "string with length greater than minLength is valid": function() {
        assert(this.model.set({
            name: 'aaaa'
        }, {validate: true}));
    },

    "spaces are treated as part of the string (no trimming)": function() {
        assert(this.model.set({
            name: 'a '
        }, {validate: true}));
    },

    "non strings are treated as an error": function() {
        refute(this.model.set({
            name: 123
        }, {validate: true}));
    },

    "array with length shorter than minLength is invalid": function() {
        refute(this.model.set({
            name: ['a']
        }, {validate: true}));
    },

    "array with length equal to minLength is valid": function() {
        assert(this.model.set({
            name: ['a', 'a']
        }, {validate: true}));
    },

    "array with length greater than minLength is valid": function() {
        assert(this.model.set({
            name: ['a', 'a', 'a', 'a']
        }, {validate: true}));
    },

    "when required is not specified": {
        "undefined is invalid": function() {
            refute(this.model.set({
                name: undefined
            }, {validate: true}));
        },

        "null is invalid": function() {
            refute(this.model.set({
                name: null
            }, {validate: true}));
        }
    },

    "when required:false": {
        setUp: function() {
            this.model.validation.name.required = false;
        },

        "null is valid": function() {
            assert(this.model.set({
                name: null
            }, {validate: true}));
        },

        "undefined is valid": function() {
            assert(this.model.set({
                name: undefined
            }, {validate: true}));
        }
    },

    "when required:true": {
        setUp: function() {
            this.model.validation.name.required = true;
        },

        "undefined is invalid": function() {
            refute(this.model.set({
                name: undefined
            }, {validate: true}));
        },

        "null is invalid": function() {
            refute(this.model.set({
                name: null
            }, {validate: true}));
        }
    }
});