buster.testCase("Backbone.Validation builtin validator", {
    setUp: function() {
        this.model = new Backbone.Model();
        this.view = new Backbone.View({
            model: this.model
        });

        Backbone.Validation.bind(this.view, {
            valid: this.spy(),
            invalid: this.spy()
        });
    },
    
    "'function'": {
        setUp: function() {
            var that = this;
            this.model.validation = {
                name: function(val){
                    that.ctx = this;
                    if(name !== 'backbone') {
                        return 'Error';
                    }
                }
            };
        },
        
        "is invalid when method returns truthy value": function() {
            refute(this.model.set({name: ''}));
        },
                
        "is valid when method returns falsy value": function() {
            refute(this.model.set({name: 'backbone'}));
        },
                
        "context is the model": function() {
            this.model.set({name: ''});
            assert.same(this.ctx, this.model);
        }
    },

    "'named function'": {
        setUp: function() {
            var that = this;
            this.model.validation = {
                name: 'validateName'
            };
            
            this.model.validateName = function(val){
                that.ctx = this;
                if(name !== 'backbone') {
                    return 'Error';
                }
            };
        },
        
        "is invalid when method returns truthy value": function() {
            refute(this.model.set({name: ''}));
        },
                
        "is valid when method returns falsy value": function() {
            refute(this.model.set({name: 'backbone'}));
        },
        
        "context is the model": function() {
            this.model.set({name: ''});
            assert.same(this.ctx, this.model);
        }
    },

    "'required'": {
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

        "empty string is invalid": function() {
            refute(this.model.set({
                name: ''
            }));
        },
        
        "non-empty string is valid": function() {
            assert(this.model.set({
                name: 'a'
            }));
        },

        "blank string is invalid": function() {
            refute(this.model.set({
                name: '  '
            }));
        },

        "null is invalid": function() {
            refute(this.model.set({
                name: null
            }));
        },

        "undefined is invalid": function() {
            refute(this.model.set({
                name: undefined
            }));
        },

        "false boolean is invalid": function() {
            refute(this.model.set({
                agree: false
            }));
        },

        "true boolean is valid": function() {
            assert(this.model.set({
                agree: true
            }));
        }
    },

    "'min'": {
        setUp: function() {
            this.model.validation = {
                age: {
                    min: 1
                }
            };
        },

        "undefined is invalid": function() {
            refute(this.model.set({
                age: undefined
            }));
        },

        "value lower than min is invalid": function() {
            refute(this.model.set({
                age: 0
            }));
        },

        "non numeric value is invalid": function() {
            refute(this.model.set({
                age: '10error'
            }));
        },

        "value equal to min is valid": function() {
            assert(this.model.set({
                age: 1
            }));
        },

        "numeric string value equal to min is valid": function() {
            assert(this.model.set({
                age: '1'
            }));
        }
    },

    "'max'": {
        setUp: function() {
            this.model.validation = {
                age: {
                    max: 10
                }
            };
        },

        "undefined is invalid": function() {
            refute(this.model.set({
                age: undefined
            }));
        },

        "value higher than max is invalid": function() {
            refute(this.model.set({
                age: 11
            }));
        },

        "non numeric value is invalid": function() {
            refute(this.model.set({
                age: '10error'
            }));
        },

        "value equal to max is valid": function() {
            assert(this.model.set({
                age: 10
            }));
        },

        "numeric string value equal to max is valid": function() {
            assert(this.model.set({
                age: '10'
            }));
        }
    },

    "'min' and 'max'": {
        setUp: function() {
            this.model.validation = {
                age: {
                    min: 1,
                    max: 10
                }
            };
        },

        "value lower than min is invalid": function() {
            refute(this.model.set({
                age: 0
            }));
        },

        "value equal to min is valid": function() {
            assert(this.model.set({
                age: 1
            }));
        },

        "value higher than max is invalid": function() {
            refute(this.model.set({
                age: 11
            }));
        },

        "value equal to max is valid": function() {
            assert(this.model.set({
                age: 10
            }));
        }
    },

    "'length'": {
        setUp: function() {
            this.model.validation = {
                postalCode: {
                    length: 2
                }
            };
        },

        "undefined is invalid": function() {
            refute(this.model.set({
                postalCode: undefined
            }));
        },

        "value with length shorter than length is invalid": function() {
            refute(this.model.set({
                postalCode: 'a'
            }));
        },

        "value with length longer than length is invalid": function() {
            refute(this.model.set({
                postalCode: 'aaa'
            }));
        },

        "value with length equal to length is valid": function() {
            assert(this.model.set({
                postalCode: 'aa'
            }));
        }  
    },
    
    "'minLength'": {
        setUp: function() {
            this.model.validation = {
                name: {
                    minLength: 2
                }
            };
        },

        "undefined is invalid": function() {
            refute(this.model.set({
                name: undefined
            }));
        },

        "value with length shorter than minLenght is invalid": function() {
            refute(this.model.set({
                name: 'a'
            }));
        },

        "value with length equal to minLength is valid": function() {
            assert(this.model.set({
                name: 'aa'
            }));
        }
    },

    "'maxLength'": {
        setUp: function() {
            this.model.validation = {
                name: {
                    maxLength: 2
                }
            };
        },

        "value with length longer than maxLenght is invalid": function() {
            refute(this.model.set({
                name: 'aaa'
            }));
        },

        "value with length equal to maxLength is valid": function() {
            assert(this.model.set({
                name: 'aa'
            }));
        }
    },

    "'pattern'": {
        setUp: function() {
            this.model.validation = {
                name: {
                    pattern: /^test/
                }
            };
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
        }
    },
    
    "'email pattern'": {
        setUp: function() {
            this.model.validation = {
                email: {
                    pattern: 'email'
                }
            };
        },

        "an invalid email is invalid": function() {
            refute(this.model.set({
                email: 'aaa'
            }));
        },

        "a valid email is valid": function() {
            assert(this.model.set({
                email: 'a@example.com'
            }));
        }
    },

    "'url pattern'": {
        setUp: function() {
            this.model.validation = {
                url: {
                    pattern: 'url'
                }
            };
        },

        "an invalid url is invalid": function() {
            refute(this.model.set({
                url: 'aaa'
            }));
        },

        "a valid url is valid": function() {
            assert(this.model.set({
                url: 'http://www.example.com?something=true&'
            }));
        }
    },

    "'number pattern'": {
        setUp: function() {
            this.model.validation = {
                age: {
                    pattern: 'number'
                }
            };
        },

        "non numeric value is invalid": function() {
            refute(this.model.set({
                age: '1a'
            }));
        },

        "numeric value with one digit is valid": function() {
            assert(this.model.set({
                age: 1
            }));
        },
        
        "negative numeric value with one digit is valid": function() {
            assert(this.model.set({
                age: -1
            }));
        },
        
        "numeric value with several digits is valid": function() {
            assert(this.model.set({
                age: 1234
            }));
        },
        
        "numeric string value is valid": function() {
            assert(this.model.set({
                age: "1234"
            }));
        },
        
        "negative numeric string value is valid": function() {
            assert(this.model.set({
                age: "-1234"
            }));
        }
    }
});
