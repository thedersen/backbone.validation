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
        this.model.bind('error', function(model, error){
            assert.equals({age: 'Age must be between 1 and 10'}, error);
            done();
        });
        this.model.set({age:0});
    },

    "number lower than first value is invalid": function() {
        refute(this.model.set({
            age: 0
        }));
    },

    "number equal to first value is valid": function() {
        assert(this.model.set({
            age: 1
        }));
    },

    "number higher than last value is invalid": function() {
        refute(this.model.set({
            age: 11
        }));
    },

    "number equal to last value is valid": function() {
        assert(this.model.set({
            age: 10
        }));
    },

    "number in range is valid": function() {
        assert(this.model.set({
            age: 5
        }));
    },

    "when required is not specified": {
         "undefined is invalid": function() {
             refute(this.model.set({
                 age: undefined
             }));
         },

         "null is invalid": function() {
             refute(this.model.set({
                 age: null
             }));
         }
     },

     "when required:false": {
         setUp: function() {
             this.model.validation.age.required = false;
         },

         "null is valid": function() {
             assert(this.model.set({
                 age: null
             }));
         },

         "undefined is valid": function() {
             assert(this.model.set({
                 age: undefined
             }));
         }
     },

     "when required:true": {
         setUp: function() {
             this.model.validation.age.required = true;
         },

         "undefined is invalid": function() {
             refute(this.model.set({
                 age: undefined
             }));
         },

         "null is invalid": function() {
             refute(this.model.set({
                 age: null
             }));
         }
     }
});