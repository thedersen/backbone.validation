/*
buster.testCase("required temp test", {
    setUp: function() {
        var that = this;
        var Model = Backbone.Model.extend({
            validation: {
              name: {
                
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
    
		"model is valid because name is not required": function() {
		  var force = true;
			assert(this.model.isValid(force));
		}  
});
*/


buster.testCase("validation (recursive) validator - required tests", {
    setUp: function() {
        var that = this;
        var Model = Backbone.Model.extend({
            validation: {
                image: {
                  required: true,
                  validation: {
                    src: {
                      required: true
                    }
                  }
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
    
    "string is invalid for an object": function(done) {
        this.model.bind('error', function(model, error){
            assert.equals('image must be an object', error);
            done();
        });
        this.model.set({image:'abc'});
    },
    
		"model is invalid because no attributes have been set": function() {
		  var force = true;
			refute(this.model.isValid(force));
		},

    "undefined is invalid for an object": function() {
      refute(this.model.set({
        image: undefined
      }));
    },
    
    "empty object is invalid": function() {
      this.model.set({
        image: {}
      });
      var force = true;
      refute(this.model.isValid(force));
    },

    "object with required attribute is valid": function() {
      assert(this.model.set({
          image: {
            src: 'foo.png'
          }
      }));
    },
    
    "null required child attribute is invalid": function() {
      refute(this.model.set({
        image: {
          src: null
        }
      }));
    }
    
});

buster.testCase("validation (recursive) validator - not required tests", {
    setUp: function() {
        var that = this;
        var Model = Backbone.Model.extend({
            validation: {
                image: {
                  required: false,
                  validation: {
                    src: {
                      required: true
                    }
                  }
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
    
    "undefined is valid for an object": function(done) {
      refute(this.model.set({
        image: undefined
      }));
    },

    "empty object is invalid": function(done) {
      refute(this.model.set({
        image: {}
      }));
    }
});
