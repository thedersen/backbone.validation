buster.testCase("rangeLength validator", {
    setUp: function() {
        var that = this;
        var Model = Backbone.Model.extend({
            validation: {
                name: {
                    rangeLength: [2, 4]
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
            assert.equals({name: 'Name must be between 2 and 4 characters'}, error);
            done();
        });
        this.model.set({name:'a'});
    },

    "string with length shorter than first value is invalid": function() {
        refute(this.model.set({
            name: 'a'
        }));
    },

    "string with length equal to first value is valid": function() {
        assert(this.model.set({
            name: 'aa'
        }));
    },

    "string with length longer than last value is invalid": function() {
        refute(this.model.set({
            name: 'aaaaa'
        }));
    },

    "string with length equal to last value is valid": function() {
        assert(this.model.set({
            name: 'aaaa'
        }));
    },

    "string with length within range is valid": function() {
        assert(this.model.set({
            name: 'aaa'
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