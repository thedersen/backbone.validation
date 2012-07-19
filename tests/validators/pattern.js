buster.testCase("pattern validator", {
    setUp: function() {
        var that = this;
        var Model = Backbone.Model.extend({
            validation: {
                name: {
                    pattern: /^test/
                },
                email: {
                    pattern: 'email'
                }
            }
        });

        this.model = new Model({
            name: 'test',
            email: 'test@example.com'
        });
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
            assert.equals({email: 'Email must be a valid email'}, error);
            done();
        });
        this.model.set({email:''});
    },

    "value not matching pattern is invalid": function() {
        refute(this.model.set({
            name: 'aaa'
        }));
    },

    "value matching pattern is valid": function() {
        assert(this.model.set({
            name: 'test'
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
     },

     "can use one of the built-in patterns by specifying the name of it": function(){
         refute(this.model.set({
             email: 'aaa'
             }));

         assert(this.model.set({
             email: 'a@example.com'
         }));
     }
});