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

    "has default error message": function(done) {
        this.model.bind('validated:invalid', function(model, error){
            assert.equals({name: 'Name must be at most 2 characters'}, error);
            done();
        });
        this.model.set({name:'aaa'}, {validate: true});
    },

    "string with length longer than maxLenght is invalid": function() {
        refute(this.model.set({
            name: 'aaa'
        }, {validate: true}));
    },

    "string with length equal to maxLength is valid": function() {
        assert(this.model.set({
            name: 'aa'
        }, {validate: true}));
    },

    "string with length shorter than maxLength is valid": function() {
        assert(this.model.set({
            name: 'a'
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