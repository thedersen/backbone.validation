buster.testCase("range validator", {
    setUp: function() {
        var that = this;
        var Model = Backbone.Model.extend({
            validation: {
                age: {
                    range: [1, 10]
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
            assert.equals({age: 'Age must be between 1 and 10'}, error);
            done();
        });
        this.model.set({age:0}, {validate: true});
    },

    "number lower than first value is invalid": function() {
        refute(this.model.set({
            age: 0
        }, {validate: true}));
    },

    "number equal to first value is valid": function() {
        assert(this.model.set({
            age: 1
        }, {validate: true}));
    },

    "number higher than last value is invalid": function() {
        refute(this.model.set({
            age: 11
        }, {validate: true}));
    },

    "number equal to last value is valid": function() {
        assert(this.model.set({
            age: 10
        }, {validate: true}));
    },

    "number in range is valid": function() {
        assert(this.model.set({
            age: 5
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
     }
});