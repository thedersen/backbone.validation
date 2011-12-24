buster.testCase("Backbone.Validation builtin validator", {
    setUp: function() {
        this.valid = this.spy();
        this.invalid = this.spy();

        this.model = new Backbone.Model();
        this.view = new Backbone.View({
            model: this.model
        });

        Backbone.Validation.bind(this.view, {
            valid: this.valid,
            invalid: this.invalid
        });
    },
    
    "'named function'": {
        setUp: function() {
            this.model.validation = {
                name: 'validateName'
            };
            
            this.model.validateName = function(val){
                if(name !== 'backbone') {
                    return 'Error';
                }
            };
        },
        
        "should call specified method on the model": function() {
            refute(this.model.set({name: ''}));
        }
    },

    "'required'": {
        setUp: function() {
            this.model.validation = {
                name: {
                    required: true,
                },
                agree: {
                    required: true
                }
            };
        },

        "empty string should be invalid": function() {
            refute(this.model.set({
                name: ''
            }));
        },

        "blank string should be invalid": function() {
            refute(this.model.set({
                name: '  '
            }));
        },

        "null should be invalid": function() {
            refute(this.model.set({
                name: null
            }));
        },

        "undefined should be invalid": function() {
            refute(this.model.set({
                name: undefined
            }));
        },

        "false boolean should be invalid": function() {
            refute(this.model.set({
                agree: false
            }));
        },

        "true boolean should be valid": function() {
            assert(this.model.set({
                agree: true
            }));
        }
    },

    "'min'": {
        setUp: function() {
            this.model.validation = {
                age: {
                    min: 1,
                }
            };
        },

        "undefined should be invalid": function() {
            refute(this.model.set({
                age: undefined
            }));
        },

        "setting value lower than min should be invalid": function() {
            refute(this.model.set({
                age: 0
            }));
        },

        "setting non numeric value should be invalid": function() {
            refute(this.model.set({
                age: '10error'
            }));
        },

        "setting value equal to min should be valid": function() {
            assert(this.model.set({
                age: 1
            }));
        },

        "setting numeric string value equal to min should be valid": function() {
            assert(this.model.set({
                age: '1'
            }));
        }
    },

    "'max'": {
        setUp: function() {
            this.model.validation = {
                age: {
                    max: 10,
                }
            };
        },

        "undefined should be invalid": function() {
            refute(this.model.set({
                age: undefined
            }));
        },

        "setting value higher than max should be invalid": function() {
            refute(this.model.set({
                age: 11
            }));
        },

        "setting non numeric value should be invalid": function() {
            refute(this.model.set({
                age: '10error'
            }));
        },

        "setting value equal to max should be valid": function() {
            assert(this.model.set({
                age: 10
            }));
        },

        "setting numeric string value equal to max should be valid": function() {
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

        "setting value lower than min should be invalid": function() {
            refute(this.model.set({
                age: 0
            }));
        },

        "setting value equal to min should be valid": function() {
            assert(this.model.set({
                age: 1
            }));
        },

        "setting value higher than max should be invalid": function() {
            refute(this.model.set({
                age: 11
            }));
        },

        "setting value equal to max should be valid": function() {
            assert(this.model.set({
                age: 10
            }));
        }
    },

    "'length'": {
        setUp: function() {
            this.model.validation = {
                postalCode: {
                    length: 2,
                }
            };
        },

        "undefined should be invalid": function() {
            refute(this.model.set({
                postalCode: undefined
            }));
        },

        "setting value with length shorter than length should be invalid": function() {
            refute(this.model.set({
                postalCode: 'a'
            }));
        },

        "setting value with length longer than length should be invalid": function() {
            refute(this.model.set({
                postalCode: 'aaa'
            }));
        },

        "setting value with length equal to length should be valid": function() {
            assert(this.model.set({
                postalCode: 'aa'
            }));
        }  
    },
    
    "'minLength'": {
        setUp: function() {
            this.model.validation = {
                name: {
                    minLength: 2,
                }
            };
        },

        "undefined should be invalid": function() {
            refute(this.model.set({
                name: undefined
            }));
        },

        "setting value with length shorter than minLenght should be invalid": function() {
            refute(this.model.set({
                name: 'a'
            }));
        },

        "setting value with length equal to minLength should be valid": function() {
            assert(this.model.set({
                name: 'aa'
            }));
        }
    },

    "'maxLength'": {
        setUp: function() {
            this.model.validation = {
                name: {
                    maxLength: 2,
                }
            };
        },

        "setting value with length longer than maxLenght should be invalid": function() {
            refute(this.model.set({
                name: 'aaa'
            }));
        },

        "setting value with length equal to maxLength should be valid": function() {
            assert(this.model.set({
                name: 'aa'
            }));
        }
    },

    "'email pattern'": {
        setUp: function() {
            this.model.validation = {
                email: {
                    pattern: 'email',
                }
            };
        },

        "setting invalid email should be invalid": function() {
            refute(this.model.set({
                email: 'aaa'
            }));
        },

        "setting valid email should be valid": function() {
            assert(this.model.set({
                email: 'a@example.com'
            }));
        }
    },

    "'url pattern'": {
        setUp: function() {
            this.model.validation = {
                url: {
                    pattern: 'url',
                }
            };
        },

        "setting invalid url should be invalid": function() {
            refute(this.model.set({
                url: 'aaa'
            }));
        },

        "setting valid url should be valid": function() {
            assert(this.model.set({
                url: 'http://www.example.com?something=true&'
            }));
        }
    },

    "'number pattern'": {
        setUp: function() {
            this.model.validation = {
                age: {
                    pattern: 'number',
                }
            };
        },

        "setting non numeric value should be invalid": function() {
            refute(this.model.set({
                age: '1a'
            }));
        },

        "setting numeric value with one digit should be valid": function() {
            assert(this.model.set({
                age: 1
            }));
        },
        
        "setting negative numeric value with one digit should be valid": function() {
            assert(this.model.set({
                age: -1
            }));
        },
        
        "setting numeric value with several digits should be valid": function() {
            assert(this.model.set({
                age: 1234
            }));
        },
        
        "setting numeric string value should be valid": function() {
            assert(this.model.set({
                age: "1234"
            }));
        },
        
        "setting negative numeric string value should be valid": function() {
            assert(this.model.set({
                age: "-1234"
            }));
        }
    },

    "'pattern'": {
        setUp: function() {
            this.model.validation = {
                name: {
                    pattern: /^test/,
                }
            };
        },

        "setting value not matching pattern should be invalid": function() {
            refute(this.model.set({
                name: 'aaa'
            }));
        },

        "setting value matching pattern should be valid": function() {
            assert(this.model.set({
                name: 'test'
            }));
        }
    }

});
