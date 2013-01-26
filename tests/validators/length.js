buster.testCase("length validator", {
    setUp: function() {
        var that = this;
        var Model = Backbone.Model.extend({
            validation: {
                postalCode: {
                    length: 2
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
            assert.equals({postalCode: 'Postal code must be 2 characters'}, error);
            done();
        });
        this.model.set({postalCode:''}, {validate: true});
    },

    "string with length shorter than length is invalid": function() {
        refute(this.model.set({
            postalCode: 'a'
        }, {validate: true}));
    },

    "string with length longer than length is invalid": function() {
        refute(this.model.set({
            postalCode: 'aaa'
        }, {validate: true}));
    },

    "string with length equal to length is valid": function() {
        assert(this.model.set({
            postalCode: 'aa'
        }, {validate: true}));
    },

    "when required is not specified": {
        "undefined is invalid": function() {
            refute(this.model.set({
                postalCode: undefined
            }, {validate: true}));
        },

        "null is invalid": function() {
            refute(this.model.set({
                postalCode: null
            }, {validate: true}));
        }
    },

    "when required:false": {
        setUp: function() {
            this.model.validation.postalCode.required = false;
        },

        "null is valid": function() {
            assert(this.model.set({
                postalCode: null
            }, {validate: true}));
        },

        "undefined is valid": function() {
            assert(this.model.set({
                postalCode: undefined
            }, {validate: true}));
        }
    },

    "when required:true": {
        setUp: function() {
            this.model.validation.postalCode.required = true;
        },

        "undefined is invalid": function() {
            refute(this.model.set({
                postalCode: undefined
            }, {validate: true}));
        },

        "null is invalid": function() {
            refute(this.model.set({
                postalCode: null
            }, {validate: true}));
        }
    }
});