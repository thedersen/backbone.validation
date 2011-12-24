buster.testCase("Backbone.Validation", {
    setUp: function() {
        var View = Backbone.View.extend({
            render: function() {
                var html = $('<input type="text" id="name" /><input type="text" id="age" />');
                this.$(this.el).append(html);
            }
        });

        var Model = Backbone.Model.extend({
            validation: {
                age: function(val) {
                    if (!val) {
                        return 'Age is invalid';
                    }
                },
                name: function(val) {
                    if (!val) {
                        return 'Name is invalid';
                    }
                }
            }
        });

        this.model = new Model();
        this.view = new View({
            model: this.model
        });

        this.view.render();
        this.age = $(this.view.$("#age"));
        this.name = $(this.view.$("#name"));
    },
	
	tearDown: function() {
		this.view.remove();
	},

	"when binding": {
		setUp: function() {
	        Backbone.Validation.bind(this.view);
		},

	    "the model's validate function is defined": function() {
	        assert.defined(this.model.validate);
	    },
	    
	    "and passing custom callbacks with the options": {
	        setUp: function(){
	            this.valid = this.spy();
                this.invalid = this.spy();

                Backbone.Validation.bind(this.view, {
                    valid: this.valid,
                    invalid: this.invalid
                });
	        },
	        
	        "should call valid callback passed with options": function() {
                this.model.set({
                    age: 1
                });

                assert.called(this.valid);
            },

            "should call invalid callback passed with options": function() {
                this.model.set({
                    age: 0
                });

                assert.called(this.invalid);
            }
	    }
	},

	"when unbinding":{
		setUp: function(){
	        Backbone.Validation.bind(this.view);
			Backbone.Validation.unbind(this.view);	
		},
		
    	"the model's validate function is undefined": function() {
        	refute.defined(this.model.validate);
    	}
	},

	"when bound to model with to validated attributes": {
		setUp: function() {            
	        Backbone.Validation.bind(this.view);
		},
		
		"attribute without validator should be set sucessfully": function() {
	        assert(this.model.set({
	            someProperty: true
	        }));
	    },
		
	    "and setting": {
	
	        "one valid value": {
    	        setUp: function() {
    	            this.model.set({
    	                age: 1
    	            });
    	        },

    	        "element should not have invalid class": function() {
    	            refute(this.age.hasClass('invalid'));
    	        },

    	        "element should not have data property with error message": function() {
    	            refute.defined(this.age.data('error'));
    	        },

    	        "should return the model": function() {
    	            assert.same(this.model.set({
    	                age: 1
    	            }), this.model);
    	        },

    	        "should update the model": function() {
    	            assert.equals(this.model.get('age'), 1);
    	        },
    	        
                "model should be invalid": function() {
    	            refute(this.model.get('isValid'));
    	        }
    	    },
    	   
    	    "one invalid value": {
    	        setUp: function() {
    	            this.model.set({
    	                age: 0
    	            });
    	        },

    	        "element should have invalid class": function() {
    	            assert(this.age.hasClass('invalid'));
    	        },

    	        "element should have data attribute with error message": function() {
    	            assert.equals(this.age.data('error'), 'Age is invalid');
    	        },

    	        "should return false": function() {
    	            refute(this.model.set({
    	                age: 0
    	            }));
    	        },

    	        "should not update the model": function() {
    	            refute.defined(this.model.get('age'));
    	        },
    	        
                "model should be invalid": function() {
    	            refute(this.model.get('isValid'));
    	        }
    	    },
    	    
	        "two valid values": {
	            setUp: function() {
	                this.model.set({
	                    age: 1,
	                    name: 'hello'
	                });
	            },

	            "elements should not have invalid class": function() {
	                refute(this.age.hasClass('invalid'));
	                refute(this.name.hasClass('invalid'));
                },

                "model should be valid": function() {
    	            assert(this.model.get('isValid'));
    	        }
	        },

	        "two invalid values": {
	            setUp: function() {
	                this.model.set({
	                    age: 0,
	                    name: ''
	                });
	            },

	            "elements should have invalid class": function() {
	                assert(this.age.hasClass('invalid'));
	                assert(this.name.hasClass('invalid'));
	            },
	            	            
	            "model should be invalid": function() {
    	            refute(this.model.get('isValid'));
    	        }
	        },

	        "one invalid and one valid value": {
	            setUp: function() {
	                this.model.set({
	                    age: 1,
	                    name: ''
	                });
	            },

	            "element should not have invalid class": function() {
	                refute(this.age.hasClass('invalid'));
	            },

	            "element should have invalid class": function() {
	                assert(this.name.hasClass('invalid'));
	            },
	            
	            "model should be invalid": function() {
    	            refute(this.model.get('isValid'));
    	        }
	        },
	        
	        "one value at a time correctly marks the model as either valid or invalid": function() {
	            refute.defined(this.model.get('isValid'));

	            this.model.set({
	                age: 0
	            });
	            refute(this.model.get('isValid'));

	            this.model.set({
	                age: 1
	            });
	            refute(this.model.get('isValid'));

	            this.model.set({
	                name: 'hello'
	            });
	            assert(this.model.get('isValid'));

	            this.model.set({
	                age: 0
	            });
	            refute(this.model.get('isValid'));
	        }
	    },
	    
	    "and custom error message is specified": {
	        setUp: function() {
	            this.model.validation = {
	                age: {
	                    min: 1,
	                    msg: 'Custom error'
	                }
	            }
	            
	            this.model.set({age: 0});
	        },
	        
            "element should have data attribute with the custom error message": function() {
	            assert.equals(this.age.data('error'), 'Custom error');
	        }
	    }
	}
});
