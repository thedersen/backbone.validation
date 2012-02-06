buster.testCase("validation (recursive) validator - with required parent object", {
    setUp: function() {
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

        Backbone.Validation.bind(this.view);
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
    },
    
    "check attribute name is correct for null attribute": function(done) {
  
        this.model.bind('validated', function(valid, model, attr){
            refute(valid);
            assert.same(this.model, model);
            assert.equals(['image.src'], attr);
            done();
        }, this);
  
        this.model.set({
          image: {
            src: null
          } 
        });
        var force = true;
        refute(this.model.isValid(force));
    }
    
});

buster.testCase("validation (recursive) validator - without required parent", {
    setUp: function() {
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
        Backbone.Validation.bind(this.view);
    },
    
    "undefined is invalid when a child attribute is required": function(done) {
        assert(this.model.set({
          image: undefined
        }));
        // but the whole model isn't valid since image.src is required
        var force = true;
        refute(this.model.isValid(force));
    },
    
    "empty object is invalid when a child attribute is required": function(done) {
        assert(this.model.set({
          image: {}
        }));
        // but the whole model isn't valid since image.src is required
        var force = true;
        refute(this.model.isValid(force));
    },
    
    "validated event returns an empty array of invalid attributes when model is invalid": function(done) {
        this.model.bind('validated', function(valid, model, attr){
            refute(valid);
            assert.same(this.model, model);
            // strictly speaking, this is correct since the image object by itself is valid
            // but is this what we really want?
            assert.equals([], attr);
            done();
        }, this);
  
        this.model.set({
          image: {}
        });
        var force = true;
        refute(this.model.isValid(force));
    }
    
});