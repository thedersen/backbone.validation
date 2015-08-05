buster.testCase("Backbone.Validation.Async", {
    setUp: function() {
        var View = Backbone.View.extend({
            render: function() {
                var html = $('<input type="text" name="name" /><input type="text" name="age" />');
                this.$el.append(html);
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
        this.age = $(this.view.$('[name~=age]'));
        this.name = $(this.view.$('[name~=name]'));
    },

    tearDown: function() {
        this.view.remove();
    },

    "when unbinding view without model": {
        setUp: function(){
            Backbone.Validation.Async.bind(this.view);
        },

        tearDown: function() {
            this.view.model = this.model;
        },

        "nothing happens": function() {
            delete this.view.model;
            Backbone.Validation.Async.unbind(this.view);
            assert(true);
        }
    },

    "when bound to model with two validated attributes": {
        setUp: function() {
            Backbone.Validation.Async.bind(this.view);
            this.model.clear();
        },

        "attribute without validator should be set sucessfully": function(done) {
            this.model.set({someProperty: true}, {validate: true});
            this.model.isValid('someProperty', done(function valid() {
                assert(true);
            }), done(function invalid() {
                assert(false);
            }))
        },

        "and setting": {

            "one valid value": {
                setUp: function() {
                    this.model.set({
                        age: 1
                    }, {validate: true});
                },

                "element should not have invalid class": function() {
                    refute(this.age.hasClass('invalid'));
                },

                "element should not have data property with error message": function() {
                    refute.defined(this.age.data('error'));
                },

                "should return nothing": function() {
                    refute(this.model.set({age: 1}, {validate: true}));
                },

                "should update the model": function() {
                    assert.equals(this.model.get('age'), 1);
                },

                "model should be invalid": function(done) {
                    this.model.isValid(null, done(function valid() {
                        assert(false);
                    }), done(function invalid() {
                        assert(true);
                    }));
                }
            },

            "one invalid value": {
                setUp: function() {
                    this.model.set({
                        age: 0
                    }, {validate: true});
                },

                "element should have invalid class": function() {
                    assert(this.age.hasClass('invalid'));
                },

                "element should have data attribute with error message": function() {
                    assert.equals(this.age.data('error'), 'Age is invalid');
                },

                "should return false": function(done) {
                    this.model.set({age: 0}, {validate: true});
                    this.model.isValid(null, done(function valid() {
                        assert(false);
                    }), done(function invalid() {
                        assert(true);
                    }));
                },

                "should not update the model": function() {
                    refute.defined(this.model.get('age'));
                },

                "model should be invalid": function(done) {
                    this.model.isValid(null, done(function valid() {
                        assert(false);
                    }), done(function invalid() {
                        assert(true);
                    }));
                }
            },

            "two valid values": {
                setUp: function() {
                    this.model.set({
                        age: 1,
                        name: 'hello'
                    }, {validate: true});
                },

                "elements should not have invalid class": function() {
                    refute(this.age.hasClass('invalid'));
                    refute(this.name.hasClass('invalid'));
                },

                "model should be valid": function(done) {
                    this.model.isValid(null, done(function valid() {
                        assert(true);
                    }), done(function invalid() {
                        assert(false);
                    }));
                }
            },

            "two invalid values": {
                setUp: function() {
                    this.model.set({
                        age: 0,
                        name: ''
                    }, {validate: true});
                },


                "elements should have invalid class": function() {
                    assert(this.age.hasClass('invalid'));
                    assert(this.name.hasClass('invalid'));
                },

                "model should be invalid": function(done) {
                    this.model.isValid(null, done(function valid() {
                        assert(false);
                    }), done(function invalid() {
                        assert(true);
                    }));
                }
            },

            "first value invalid and second value valid": {
                setUp: function() {
                    this.result = this.model.set({
                        age: 1,
                        name: ''
                    }, {validate: true});
                },

                "model is not updated": function() {
                    refute(this.result);
                },

                "element should not have invalid class": function() {
                    refute(this.age.hasClass('invalid'));
                },

                "element should have invalid class": function() {
                    assert(this.name.hasClass('invalid'));
                },

                "model should be invalid": function(done) {
                    this.model.isValid(null, done(function valid() {
                        assert(false);
                    }), done(function invalid() {
                        assert(true);
                    }));
                }
            },

            "first value valid and second value invalid": {
                setUp: function() {
                    this.result = this.model.set({
                        age: 0,
                        name: 'name'
                    }, {validate: true});
                },

                "model is not updated": function() {
                    refute(this.result);
                },

                "element should not have invalid class": function() {
                    refute(this.name.hasClass('invalid'));
                },

                "element should have invalid class": function() {
                    assert(this.age.hasClass('invalid'));
                },

                "model should be invalid": function(done) {
                    this.model.isValid(null, done(function valid() {
                        assert(false);
                    }), done(function invalid() {
                        assert(true);
                    }));
                }
            },

            "one value at a time correctly marks the model as either valid or invalid": function(done) {
                this.model.isValid(null, function valid() {
                    assert(false);
                }, function invalid() {
                    assert(true);
                });

                this.model.set({age: 0}, {validate: true});
                this.model.isValid(null, function valid() {
                    assert(false);
                }, function invalid() {
                    assert(true);
                });

                this.model.set({age: 1}, {validate: true});
                this.model.isValid(null, function valid() {
                    assert(false);
                }, function invalid() {
                    assert(true);
                });

                this.model.set({name: 'hello'}, {validate: true});
                this.model.isValid(null, function valid() {
                    assert(true);
                }, function invalid() {
                    assert(false);
                });

                this.model.set({age: 0}, {validate: true});
                this.model.isValid(null, done(function valid() {
                    assert(false);
                }), done(function invalid() {
                    assert(true);
                }));
            }
        },

        "and validate is explicitly called with no parameters": {
            setUp: function() {
                this.invalid = this.spy();
                this.valid = this.spy();
                this.model.validation = {
                    age: {
                        min: 1,
                        msg: 'error'
                    },
                    name: {
                        required: true,
                        msg: 'error'
                    }
                };
                Backbone.Validation.Async.bind(this.view, {
                    valid: this.valid,
                    invalid: this.invalid
                });
            },

            "all attributes on the model is validated when nothing has been set": function(){
                this.model.validate();

                assert.calledWith(this.invalid, this.view, 'age', 'error');
                assert.calledWith(this.invalid, this.view, 'name', 'error');
            },

            "all attributes on the model is validated when one property has been set without validating": function(){
                this.model.set({age: 1});

                this.model.validate();

                assert.calledWith(this.valid, this.view, 'age');
                assert.calledWith(this.invalid, this.view, 'name', 'error');
            },

            "all attributes on the model is validated when two properties has been set without validating": function(){
                this.model.set({age: 1, name: 'name'});

                this.model.validate();

                assert.calledWith(this.valid, this.view, 'age');
                assert.calledWith(this.valid, this.view, 'name');
            },

            "callbacks are not called for unvalidated attributes": function(){

                this.model.set({age: 1, name: 'name', someProp: 'some value'});

                this.model.validate();

                assert.calledWith(this.valid, this.view, 'age');
                assert.calledWith(this.valid, this.view, 'name');
                refute.calledWith(this.valid, this.view, 'someProp');
            }
        }
    },

    "when bound to model with three validators on one attribute": {
        setUp: function() {
            this.Model = Backbone.Model.extend({
                validation: {
                    postalCode: {
                        minLength: 2,
                        pattern: 'digits',
                        maxLength: 4
                    }
                }
            });

            this.model = new this.Model();
            this.view.model = this.model;

            Backbone.Validation.Async.bind(this.view);
        },

        "and violating the first validator the model is invalid": function (done){
            this.model.set({postalCode: '1'}, {validate: true});

            this.model.isValid(null, done(function valid() {
                assert(false);
            }), done(function invalid() {
                assert(true);
            }));
        },

        "and violating the second validator the model is invalid": function (done){
            this.model.set({postalCode: 'ab'}, {validate: true});

            this.model.isValid(null, done(function valid() {
                assert(false);
            }), done(function invalid() {
                assert(true);
            }));
        },

       "and violating the last validator the model is invalid": function (done){
           this.model.set({postalCode: '12345'}, {validate: true});

            this.model.isValid(null, done(function valid() {
                assert(false);
            }), done(function invalid() {
                assert(true);
            }));
       },

        "and conforming to all validators the model is valid": function (done){
            this.model.set({postalCode: '123'}, {validate: true});

            this.model.isValid(null, done(function valid() {
                assert(true);
            }), done(function invalid() {
                assert(false);
            }));
        }
    },

    "when bound to model with to dependent attribute validations": {
        setUp: function() {
            var View = Backbone.View.extend({
                render: function() {
                    var html = $('<input type="text" name="one" /><input type="text" name="two" />');
                    this.$el.append(html);

                    Backbone.Validation.Async.bind(this);
                }
            });
            var Model = Backbone.Model.extend({
                validation: {
                    one: function(val, attr, computed) {
                        if(val < computed.two) {
                            return 'error';
                        }
                    },
                    two: function(val, attr, computed) {
                        if(val > computed.one) {
                            return 'return';
                        }
                    }
                }
            });


            this.model = new Model();
            this.view = new View({
                model: this.model
            });

            this.view.render();
            this.one = $(this.view.$('[name~=one]'));
            this.two = $(this.view.$('[name~=two]'));
        },

        tearDown: function() {
            this.view.remove();
        },

        "when setting invalid value on second input": {
            setUp: function() {
                this.model.set({one:1}, {validate: true});
                this.model.set({two:2}, {validate: true});
            },

            "first input is valid": function() {
                assert(this.one.hasClass('invalid'));
            },

            "second input is invalid": function() {
                assert(this.two.hasClass('invalid'));
            }
        },

        "when setting invalid value on second input and changing first": {
            setUp: function() {
                this.model.set({one:1}, {validate: true});
                this.model.set({two:2}, {validate: true});
                this.model.set({one:2}, {validate: true});
            },

            "first input is valid": function() {
                refute(this.one.hasClass('invalid'));
            },

            "second input is valid": function() {
                refute(this.two.hasClass('invalid'));
            }
        }
    },

    "when bound to model with custom toJSON": {
        setUp: function() {
            this.model.toJSON = function() {
                return {
                    'person': {
                        'age': this.attributes.age,
                        'name': this.attributes.name
                    }
                };
            };

            Backbone.Validation.Async.bind(this.view);
        },

        "and conforming to all validators the model is valid": function (done){
            this.model.set({age: 12}, {validate: true});
            this.model.set({name: 'Jack'}, {validate: true});

            this.model.validate();
            this.model.isValid(null, done(function valid() {
                assert(true);
            }), done(function invalid() {
                assert(false);
            }));
        }
    }
});
