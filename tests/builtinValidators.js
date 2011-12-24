buster.testCase("Backbone.Validation builtin validators", {
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
    
    "named function": {
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

    "min": {
        setUp: function() {
            this.model.validation = {
                age: {
                    min: 1,
                    msg: 'Error'
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

    "max": {
        setUp: function() {
            this.model.validation = {
                age: {
                    max: 10,
                    msg: 'Error'
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

    "minLength": {
        setUp: function() {
            this.model.validation = {
                name: {
                    minLength: 2,
                    msg: 'Error'
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
            refute(this.model.set({
                url: 'aaa'
            }));
        },

        "setting valid url should be valid": function() {
            assert(this.model.set({
                url: 'http://www.example.com?something=true&'
            }));
        },

        "should override error msg when specified": function() {
            this.model.set({
                url: 'aaa'
            });

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
            refute(this.model.set({
                age: '1a'
            }));
        },

        "setting numeric value with one digit should be valid": function() {
            assert(this.model.set({
                age: 1
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
