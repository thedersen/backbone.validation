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
                    if (!val) {
                        return 'Age is invalid';
                    }
                },
                name: function(val) {
                    if(!val) {
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
        
    "should ignore property without validator": function(){
        this.model.set({someProperty: true});
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
            }
        }
    },
    
    "isValid": {
        "one undefined and one valid value makes the model invalid": function() {
            delete this.model.attributes.age;
            this.model.set({
                name: 'hello'
            });

            assert.isFalse(this.model.get('isValid'));
        },
        
        "one invalid and one valid value makes the model invalid": function() {
            this.model.set({
                age: 0,
                name: 'hello'
            });

            assert.isFalse(this.model.get('isValid'));
        },
        
        "both invalid values makes the model invalid": function() {
            this.model.set({
                age: 0,
                name: ''
            });

            assert.isFalse(this.model.get('isValid'));
        },
                
        "both valid values makes the model valid": function() {
            this.model.set({
                age: 1,
                name: 'hello'
            });

            assert.isTrue(this.model.get('isValid'));
        },        
        
        "setting one value at a time": function() {
            assert.isUndefined(this.model.get('isValid'));
            
            this.model.set({age: 0});
            assert.isFalse(this.model.get('isValid'));

            this.model.set({age: 1});
            assert.isFalse(this.model.get('isValid'));
            
            this.model.set({name: 'hello'});
            assert.isTrue(this.model.get('isValid'));
            
            this.model.set({age: 0});
            assert.isFalse(this.model.get('isValid'));
        }
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
        this.valid = this.spy();
        this.invalid = this.spy();
        
        _.extend(Backbone.Validation.callbacks, {
           valid: this.valid,
           invalid: this.invalid 
        });
        
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

        assert.called(this.valid);
    },

    "should call overridden invalid function": function() {
        this.model.set({
            age: 0
        });

        assert.called(this.invalid);
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
                    required: true,
                    msg: 'Error'
                },
                agree: {
                    required: true
                }
            };
        },

        "should call valid with correct arguments when property is valid": function() {
            this.model.set({name: 'valid'});

            assert.calledWith(this.valid, this.view, 'name');
        },

        "should call invalid with correct arguments when property is invalid": function() {
            this.model.set({agree: false});

            assert.calledWith(this.invalid, this.view, 'agree', 'agree is required');
        },

        "should override error msg when specified": function() {
            this.model.set({name: ''});

            assert.calledWith(this.invalid, this.view, 'name', 'Error');
        },

        "empty string should be invalid": function() {
            assert.isFalse(this.model.set({name: ''}));
        },

        "blank string should be invalid": function() {
            assert.isFalse(this.model.set({name: '  '}));
        },

        "null should be invalid": function() {
            assert.isFalse(this.model.set({name: null}));
        },

        "undefined should be invalid": function() {
            assert.isFalse(this.model.set({name: undefined}));
        },
        
        "false boolean should be invalid": function(){
            assert.isFalse(this.model.set({agree: false}));
        },
        
        "true boolean should be valid": function(){
            assert(this.model.set({agree: true}));
        }
    },

    "min": {
        setUp: function() {
            this.model.validation = {
                age: {
                    min: 1,
                    msg: 'Error'
                }
            };
        },

        "setting value lower than min should be invalid": function() {
            assert.isFalse(this.model.set({age: 0}));
        },
        
        "setting non numeric value should be invalid": function(){
            assert.isFalse(this.model.set({age: 'error'}));
        },

        "setting value equal to min should be valid": function() {
            assert(this.model.set({age: 1}));
        },
        
        "setting numeric string value equal to min should be valid": function(){
            assert(this.model.set({age: '1'}));
        },
        
        "should override error msg when specified": function() {
            this.model.set({age: 0});

            assert.calledWith(this.invalid, this.view, 'age', 'Error');
        }
    },

    "max": {
        setUp: function() {
            this.model.validation = {
                age: {
                    max: 10,
                    msg: 'Error'
                }
            };
        },

        "setting value higher than max should be invalid": function() {
            assert.isFalse(this.model.set({age: 11}));
        },

        "setting non numeric value should be invalid": function(){
            assert.isFalse(this.model.set({age: 'error'}));
        },

        "setting value equal to max should be valid": function() {
            assert(this.model.set({age: 10}));
        },

        "setting numeric string value equal to max should be valid": function(){
            assert(this.model.set({age: '10'}));
        },

        "should override error msg when specified": function() {
            this.model.set({age: 11});

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
            assert.isFalse(this.model.set({age: 0}));
        },

        "setting value equal to min should be valid": function() {
            assert(this.model.set({age: 1}));
        },

        "setting value higher than max should be invalid": function() {
            assert.isFalse(this.model.set({age: 11}));
        },

        "setting value equal to max should be valid": function() {
            assert(this.model.set({age: 10}));
        }
    },
    
    "minLength": {
        setUp: function() {
            this.model.validation = {
                name: {
                    minLength: 2,
                    msg: 'Error'
                }
            };
        },

        "setting value with length shorter than minLenght should be invalid": function() {
            assert.isFalse(this.model.set({name: 'a'}));
        },

        "setting value with length equal to minLength should be valid": function() {
            assert(this.model.set({name: 'aa'}));
        },

        "should override error msg when specified": function() {
            this.model.set({name: 'a'});

            assert.calledWith(this.invalid, this.view, 'name', 'Error');
        }
    },
    
    "maxLength": {
        setUp: function() {
            this.model.validation = {
                name: {
                    maxLength: 2,
                    msg: 'Error'
                }
            };
        },

        "setting value with length longer than maxLenght should be invalid": function() {
            assert.isFalse(this.model.set({name: 'aaa'}));
        },

        "setting value with length equal to maxLength should be valid": function() {
            assert(this.model.set({name: 'aa'}));
        },

        "should override error msg when specified": function() {
            this.model.set({name: 'aaa'});

            assert.calledWith(this.invalid, this.view, 'name', 'Error');
        }
    },
    
    "email": {
        setUp: function() {
            this.model.validation = {
                email: {
                    pattern: 'email',
                    msg: 'Error'
                }
            };
        },

        "setting invalid email should be invalid": function() {
            assert.isFalse(this.model.set({email: 'aaa'}));
        },

        "setting valid email should be valid": function() {
            assert(this.model.set({email: 'a@example.com'}));
        },

        "should override error msg when specified": function() {
            this.model.set({email: 'aaa'});

            assert.calledWith(this.invalid, this.view, 'email', 'Error');
        }
    },
    
    "url": {
        setUp: function() {
            this.model.validation = {
                url: {
                    pattern: 'url',
                    msg: 'Error'
                }
            };
        },

        "setting invalid url should be invalid": function() {
            assert.isFalse(this.model.set({url: 'aaa'}));
        },

        "setting valid url should be valid": function() {
            assert(this.model.set({url: 'http://www.example.com?something=true&'}));
        },

        "should override error msg when specified": function() {
            this.model.set({url: 'aaa'});

            assert.calledWith(this.invalid, this.view, 'url', 'Error');
        }
    },
    
    "number": {
        setUp: function() {
            this.model.validation = {
                age: {
                    pattern: 'number',
                    msg: 'Error'
                }
            };
        },

        "setting non numeric value should be invalid": function() {
            assert.isFalse(this.model.set({age: '1a'}));
        },

        "setting numeric value should be valid": function() {
            assert(this.model.set({age: 1}));
        },

        "setting numeric string value should be valid": function() {
            assert(this.model.set({age: "1"}));
        },
        
        "should override error msg when specified": function() {
            this.model.set({age: 'a'});

            assert.calledWith(this.invalid, this.view, 'age', 'Error');
        }
    },
    
    "pattern": {
        setUp: function() {
            this.model.validation = {
                name: {
                    pattern: /^test/,
                    msg: 'Error'
                }
            };
        },

        "setting value not matching pattern should be invalid": function() {
            assert.isFalse(this.model.set({name: 'aaa'}));
        },

        "setting value matching pattern should be valid": function() {
            assert(this.model.set({name: 'test'}));
        },

        "should override error msg when specified": function() {
            this.model.set({name: 'aaa'});

            assert.calledWith(this.invalid, this.view, 'name', 'Error');
        }
    }
    
});

buster.testCase('Backbone.Validation add custom validator', {
   setUp: function(){
       _.extend(Backbone.Validation.validators, {
           custom: function(value, attr, msg, customValue){
               if(value !== customValue){
                   return 'error';
               }
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
       _.extend(Backbone.Validation.validators, {
           min: function(value, attr, msg, customValue){
               if(value !== customValue){
                   return 'error';
               }
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
       _.extend(Backbone.Validation.patterns, {custom: /^test/});
       
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
       _.extend(Backbone.Validation.patterns, {email: /^test/});
       
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
