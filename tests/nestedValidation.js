buster.testCase("nested validation - with required parent object", {
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
            assert.equals(['image must be an object'], error);
            done();
        });
        this.model.set({image:'abc'});
    },

    "model is invalid because no attributes have been set": function() {
        refute(this.model.isValid(true));
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

        refute(this.model.isValid(true));
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

    "should be able to set an empty object": function() {
        assert(this.model.set({
            image: {
                src: 'foo.png'
            }
        }));

        assert(this.model.set({}));
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
    }
});

buster.testCase("nested validation - without required parent", {
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

    "model is valid when nothing is set": function(){
        assert(this.model.isValid(true));
    },

    "undefined is invalid when a child attribute is required": function() {
        assert(this.model.set({
            image: undefined
        }));

        assert(this.model.isValid(true));
    },

    "empty object is invalid when a child attribute is required": function() {
        assert(this.model.set({
            image: {}
        }));

        refute(this.model.isValid(true));
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

        refute(this.model.isValid(true));
    }
});