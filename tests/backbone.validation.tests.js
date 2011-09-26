var assert = buster.assert;

buster.testCase("Backbone.Validation", {
    setUp: function() {
        var View = Backbone.View.extend({
            render: function() {
                var html = $('<input type="text" id="name" /><input type="text" id="age" />');
                this.$(this.el).append(html);

                Backbone.Validation.bind(this);
            }
        });

        var Model = Backbone.Model.extend({
            validation: {
                age: function(val) {
                    if (val === 0) {
                        return 'Age is invalid';
                    }
                },
                name: function(val) {
                    if(val === '') {
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
    
    "bind sets up the models validate function": function() {
        assert(this.model.validate);
    },
    
    "unbind removes the validate function from the model": function(){
        Backbone.Validation.unbind(this.view);
        
        assert.isUndefined(this.model.validate);
    },

    "setting valid value": {
        setUp: function() {
            this.model.set({
                age: 1
            });
        },

        "should not have invalid class": function() {
            assert.isFalse(this.age.hasClass('invalid'));
        },

        "should not have data property with error message": function() {
            assert.isUndefined(this.age.data('error'));
        },

        "should return the model": function() {
            assert.equals(this.model.set({
                age: 1
            }), this.model);
        },

        "should update the model": function(){
            assert.equals(this.model.get('age'), 1);
        },
        
        "should set isValid on the model to true": function(){
            assert.isTrue(this.model.get('isValid'));
        }
    },

    "setting invalid value": {
        setUp: function() {
            this.model.set({
                age: 0
            });
        },

        "should have invalid class": function() {
            assert.isTrue(this.age.hasClass('invalid'));
        },

        "should have data attribute with error message": function() {
            assert.equals(this.age.data('error'), 'Age is invalid');
        },

        "should return false": function() {
            assert.isFalse(this.model.set({
                age: 0
            }));
        },
        
        "should not update the model": function(){
            assert.isUndefined(this.model.get('age'));
        },

        "should set isValid on the model to false": function(){
            assert.isFalse(this.model.get('isValid'));
        }
    },
    
    "setting multiple values": {
        "both valid": {
            setUp: function(){
                this.model.set({
                    age: 1,
                    name: 'hello'
                });                
            },
            
            "age should not have invalid class": function() {
                assert.isFalse(this.age.hasClass('invalid'));
            },
                        
            "name should not have invalid class": function() {
                assert.isFalse(this.name.hasClass('invalid'));
            },

            "should set isValid on the model to true": function(){
                assert.isTrue(this.model.get('isValid'));
            }
        },
        
        "both invalid": {
            setUp: function(){
                this.model.set({
                    age: 0,
                    name: ''
                });                
            },
            
            "age should have invalid class": function() {
                assert.isTrue(this.age.hasClass('invalid'));
            },
                        
            "name should have invalid class": function() {
                assert.isTrue(this.name.hasClass('invalid'));
            },

            "should set isValid on the model to false": function(){
                assert.isFalse(this.model.get('isValid'));
            }
        },
        
        "one invalid and one valid": {
            setUp: function(){
                this.model.set({
                    age: 1,
                    name: ''
                });                
            },
            
            "age should not have invalid class": function() {
                assert.isFalse(this.age.hasClass('invalid'));
            },
                        
            "name should have invalid class": function() {
                assert.isTrue(this.name.hasClass('invalid'));
            },

            "should set isValid on the model to false": function(){
                assert.isFalse(this.model.get('isValid'));
            }
        }
    },
    
    "setting a property on invalid model": {
        setUp: function(){
            this.model.set({
                age: 0
            });
        },
        
        "model should still be invalid when setting different property": function(){
            assert.isFalse(this.model.get('isValid'));
            
            this.model.set({name: 'hello'});
            
            assert.isFalse(this.model.get('isValid'));
        },
        
        "model should be valid when setting valid value": function(){            
            assert.isFalse(this.model.get('isValid'));
            
            this.model.set({age: 1});
            
            assert.isTrue(this.model.get('isValid'));
        }
    },
    
    "should ignore property without validator": function(){
        this.model.set({someProperty: true});
    },
    
    "no conflict": {
        setUp: function(){
            this.previousBackbone = Backbone.noConflict();
            this.previousUnderscore = _.noConflict();
        },
        
        tearDown: function(){
            Backbone = this.previousBackbone;
            _ = this.previousUnderscore;
        },
        
        "should work with backbone": function(){
            this.model.set({someProperty: true});
        },

        "should work with underscore": function(){
            this.model.set({someProperty: true});
        }
    }
});

buster.testCase("Backbone.Validation cutomize", {
    setUp: function() {
        Backbone.Validation.valid = this.spy();
        Backbone.Validation.invalid = this.spy();

        var Model = Backbone.Model.extend({
            validation: {
                age: function(val) {
                    if (val === 0) {
                        return "Age is invalid";
                    }
                }
            }
        });
        
        this.model = new Model();

        Backbone.Validation.bind(new Backbone.View({model: this.model}));
    },

    "should call overridden valid function": function() {
        this.model.set({
            age: 1
        });

        assert.called(Backbone.Validation.valid);
    },

    "should call overridden invalid function": function() {
        this.model.set({
            age: 0
        });

        assert.called(Backbone.Validation.invalid);
    }
});

buster.testCase("Backbone.Validation bind options", {
    setUp: function() {
        var Model = Backbone.Model.extend({
            validation: {
                age: function(val) {
                    if (val === 0) {
                        return "Age is invalid";
                    }
                }
            }
        });

        this.model = new Model();
        this.valid = this.spy();
        this.invalid = this.spy();

        Backbone.Validation.bind(new Backbone.View({model: this.model}), {
            valid: this.valid,
            invalid: this.invalid
        });
    },

    "should call valid function passed with options": function() {
        this.model.set({
            age: 1
        });

        assert.called(this.valid);
    },
    
    "should call invalid function passed with options": function() {
        this.model.set({
            age: 0
        });

        assert.called(this.invalid);
    }
});

buster.testCase("Backbone.Validation builtin validators", {
    setUp: function() {
        this.valid = this.spy();
        this.invalid = this.spy();

        this.model = new Backbone.Model();
        this.view = new Backbone.View({model: this.model});
        
        Backbone.Validation.bind(this.view, {
            valid: this.valid,
            invalid: this.invalid
        });
    },

    "required": {
        setUp: function() {
            this.model.validation = {
                name: {
                    required: true
                },
                agree: {
                    required: true
                }
            };
        },

        "should call valid with correct arguments when property is valid": function() {
            this.model.set({
                name: 'valid'
            });

            assert.calledWith(this.valid, this.view, 'name');
        },

        "should call invalid with correct arguments when property is invalid": function() {
            this.model.set({
                name: ''
            });

            assert.calledWith(this.invalid, this.view, 'name', 'name is required');
        },

        "should override error msg when specified": function() {
            this.model.validation = {
                name: {
                    required: true,
                    msg: 'Error'
                }
            };
            this.model.set({
                name: ''
            });

            assert.calledWith(this.invalid, this.view, 'name', 'Error');
        },

        "empty string should be invalid": function() {
            this.model.set({
                name: ''
            });

            assert.called(this.invalid);
        },

        "blank string should be invalid": function() {
            this.model.set({
                name: '  '
            });

            assert.called(this.invalid);
        },

        "null should be invalid": function() {
            this.model.set({
                name: null
            });

            assert.called(this.invalid);
        },

        "undefined should be invalid": function() {
            this.model.set({
                name: undefined
            });

            assert.called(this.invalid);
        },
        
        "false boolean should be invalid": function(){
            this.model.set({agree: false});
            
            assert.called(this.invalid);
        },
        
        "true boolean should be valid": function(){
            this.model.set({agree: true});
            
            assert.called(this.valid);
        }
    },

    "min": {
        setUp: function() {
            this.model.validation = {
                age: {
                    min: 1
                }
            };
        },

        "setting value lower than min should be invalid": function() {
            this.model.set({
                age: 0
            });

            assert.called(this.invalid);
        },

        "setting value equal to min should be valid": function() {
            this.model.set({
                age: 1
            });

            assert.called(this.valid);
        },

        "should override error msg when specified": function() {
            this.model.validation = {
                age: {
                    min: 1,
                    msg: 'Error'
                }
            };
            this.model.set({
                age: 0
            });

            assert.calledWith(this.invalid, this.view, 'age', 'Error');
        }
    },

    "max": {
        setUp: function() {
            this.model.validation = {
                age: {
                    max: 10
                }
            };
        },

        "setting value higher than max should be invalid": function() {
            this.model.set({
                age: 11
            });

            assert.called(this.invalid);
        },

        "setting value equal to max should be valid": function() {
            this.model.set({
                age: 10
            });

            assert.called(this.valid);
        },

        "should override error msg when specified": function() {
            this.model.validation = {
                age: {
                    max: 1,
                    msg: 'Error'
                }
            };
            this.model.set({
                age: 2
            });

            assert.calledWith(this.invalid, this.view, 'age', 'Error');
        }
    },

    "min && max": {
        setUp: function() {
            this.model.validation = {
                age: {
                    min: 1,
                    max: 10
                }
            };
        },

        "setting value lower than min should be invalid": function() {
            this.model.set({
                age: 0
            });

            assert.called(this.invalid);
        },

        "setting value equal to min should be valid": function() {
            this.model.set({
                age: 1
            });

            assert.called(this.valid);
        },

        "setting value higher than max should be invalid": function() {
            this.model.set({
                age: 11
            });

            assert.called(this.invalid);
        },

        "setting value equal to max should be valid": function() {
            this.model.set({
                age: 10
            });

            assert.called(this.valid);
        }
    },
    
    "minLength": {
        setUp: function() {
            this.model.validation = {
                name: {
                    minLength: 2
                }
            };
        },

        "setting value with length shorter than minLenght should be invalid": function() {
            this.model.set({
                name: 'a'
            });

            assert.called(this.invalid);
        },

        "setting value with length equal to minLength should be valid": function() {
            this.model.set({
                name: 'aa'
            });

            assert.called(this.valid);
        },

        "should override error msg when specified": function() {
            this.model.validation = {
                name: {
                    minLength: 2,
                    msg: 'Error'
                }
            };
            this.model.set({
                name: 'a'
            });

            assert.calledWith(this.invalid, this.view, 'name', 'Error');
        }
    },
    
    "maxLength": {
        setUp: function() {
            this.model.validation = {
                name: {
                    maxLength: 2
                }
            };
        },

        "setting value with length longer than maxLenght should be invalid": function() {
            this.model.set({
                name: 'aaa'
            });

            assert.called(this.invalid);
        },

        "setting value with length equal to maxLength should be valid": function() {
            this.model.set({
                name: 'aa'
            });

            assert.called(this.valid);
        },

        "should override error msg when specified": function() {
            this.model.validation = {
                name: {
                    maxLength: 2,
                    msg: 'Error'
                }
            };
            this.model.set({
                name: 'aaa'
            });

            assert.calledWith(this.invalid, this.view, 'name', 'Error');
        }
    },
    
    "email": {
        setUp: function() {
            this.model.validation = {
                email: {
                    pattern: 'email'
                }
            };
        },

        "setting invalid email should be invalid": function() {
            this.model.set({
                email: 'aaa'
            });

            assert.called(this.invalid);
        },

        "setting valid email should be valid": function() {
            this.model.set({
                email: 'a@example.com'
            });

            assert.called(this.valid);
        },

        "should override error msg when specified": function() {
            this.model.validation = {
                email: {
                    pattern: 'email',
                    msg: 'Error'
                }
            };
            this.model.set({
                email: 'aaa'
            });

            assert.calledWith(this.invalid, this.view, 'email', 'Error');
        }
    },
    
    "url": {
        setUp: function() {
            this.model.validation = {
                url: {
                    pattern: 'url'
                }
            };
        },

        "setting invalid url should be invalid": function() {
            this.model.set({
                url: 'aaa'
            });

            assert.called(this.invalid);
        },

        "setting valid url should be valid": function() {
            this.model.set({
                url: 'http://www.example.com?something=true&'
            });

            assert.called(this.valid);
        },

        "should override error msg when specified": function() {
            this.model.validation = {
                url: {
                    pattern: 'url',
                    msg: 'Error'
                }
            };
            this.model.set({
                url: 'aaa'
            });

            assert.calledWith(this.invalid, this.view, 'url', 'Error');
        }
    },
    
    "pattern": {
        setUp: function() {
            this.model.validation = {
                name: {
                    pattern: /^test/
                }
            };
        },

        "setting value not matching pattern should be invalid": function() {
            this.model.set({
                name: 'aaa'
            });

            assert.called(this.invalid);
        },

        "setting value matching pattern should be valid": function() {
            this.model.set({
                name: 'test'
            });

            assert.called(this.valid);
        },

        "should override error msg when specified": function() {
            this.model.validation = {
                name: {
                    pattern: /^test/,
                    msg: 'Error'
                }
            };
            this.model.set({
                name: 'aaa'
            });

            assert.calledWith(this.invalid, this.view, 'name', 'Error');
        }
    }
    
});

buster.testCase('Backbone.Validation add custom validator', {
   setUp: function(){
       Backbone.Validation.addValidator('custom', function(value, attr, msg, customValue){
           if(value !== customValue){
               return 'error';
           }
       });
       
       var Model = Backbone.Model.extend({
           validation: {
               age: {
                   custom: 1
               }
           }
       });
       
       this.model = new Model();
       Backbone.Validation.bind(new Backbone.View({model: this.model}));
   },
   
   "should fire custom validator": function(){
       assert(this.model.set({age: 1}));
       assert.isFalse(this.model.set({age: 2}));
   }
});

buster.testCase('Backbone.Validation override existing validator', {
   setUp: function(){
       Backbone.Validation.addValidator('min', function(value, attr, msg, customValue){
           if(value !== customValue){
               return 'error';
           }
       });
       
       var Model = Backbone.Model.extend({
           validation: {
               age: {
                   min: 1
               }
           }
       });
       
       this.model = new Model();
       Backbone.Validation.bind(new Backbone.View({model: this.model}));
   },
   
   "should fire custom validator": function(){
       assert(this.model.set({age: 1}));
       assert.isFalse(this.model.set({age: 2}));
   }
});

buster.testCase('Backbone.Validation add custom pattern', {
   setUp: function(){
       Backbone.Validation.addPattern('custom', /^test/);
       
       var Model = Backbone.Model.extend({
           validation: {
               name: {
                   pattern: 'custom'
               }
           }
       });
       
       this.model = new Model();
       Backbone.Validation.bind(new Backbone.View({model: this.model}));
   },
   
   "should fire custom pattern validator": function(){
       assert(this.model.set({name: 'test'}));
       assert.isFalse(this.model.set({name: 'aa'}));
   }
});

buster.testCase('Backbone.Validation override exising pattern', {
   setUp: function(){
       Backbone.Validation.addPattern('email', /^test/);
       
       var Model = Backbone.Model.extend({
           validation: {
               name: {
                   pattern: 'email'
               }
           }
       });
       
       this.model = new Model();
       Backbone.Validation.bind(new Backbone.View({model: this.model}));
   },
   
   "should fire custom pattern validator": function(){
       assert(this.model.set({name: 'test'}));
       assert.isFalse(this.model.set({name: 'aa'}));
   }
});
