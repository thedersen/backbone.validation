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

    "has default error message": function(done) {
        this.model.bind('error', function(model, error){
            assert.equals({name: 'Name must be at least 2 characters'}, error);
            done();
        });
        this.model.set({name:''});
    },

    "string with length shorter than minLenght is invalid": function() {
        refute(this.model.set({
            name: 'a'
        }));
    },

    "string with length equal to minLength is valid": function() {
        assert(this.model.set({
            name: 'aa'
        }));
    },

    "string with length greater than minLength is valid": function() {
        assert(this.model.set({
            name: 'aaaa'
        }));
    },

    "when required is not specified": {
        "undefined is invalid": function() {
            refute(this.model.set({
                name: undefined
            }));
        },

        "null is invalid": function() {
            refute(this.model.set({
                name: null
            }));
        }
    },

    "when required:false": {
        setUp: function() {
            this.model.validation.name.required = false;
        },

        "null is valid": function() {
            assert(this.model.set({
                name: null
            }));
        },

        "undefined is valid": function() {
            assert(this.model.set({
                name: undefined
            }));
        }
    },

    "when required:true": {
        setUp: function() {
            this.model.validation.name.required = true;
        },

        "undefined is invalid": function() {
            refute(this.model.set({
                name: undefined
            }));
        },

        "null is invalid": function() {
            refute(this.model.set({
                name: null
            }));
        }
    }
});