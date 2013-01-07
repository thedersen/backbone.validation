buster.testCase("Backbone.Validation", {
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

    "when binding": {
        setUp: function() {
            Backbone.Validation.bind(this.view);
        },

        "the model's validate function is defined": function() {
            assert.defined(this.model.validate);
        },

        "the model's isValid function is overridden": function() {
            refute.same(this.model.isValid, Backbone.Model.prototype.isValid);
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

    "when binding to view without model or collection": function(){
      assert.exception(function(){
        Backbone.Validation.bind(new Backbone.View());
      });
    },

    "when unbinding":{
        setUp: function(){
            Backbone.Validation.bind(this.view);
            Backbone.Validation.unbind(this.view);
        },

        "the model's validate function is undefined": function() {
            refute.defined(this.model.validate);
        },

        "the model's preValidate function is undefined": function() {
            refute.defined(this.model.preValidate);
        },

        "the model's isValid function is restored": function() {
            assert.same(this.model.isValid, Backbone.Model.prototype.isValid);
        }
    },

    "when unbinding view without model": {
        setUp: function(){
            Backbone.Validation.bind(this.view);
        },

        tearDown: function() {
            this.view.model = this.model;
        },

        "nothing happens": function() {
            delete this.view.model;
            Backbone.Validation.unbind(this.view);
            assert(true);
        }
    },

    "when bound to model with two validated attributes": {
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
                    refute(this.model.isValid());
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
                    refute(this.model.isValid());
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
                    assert(this.model.isValid());
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
                    refute(this.model.isValid());
                }
            },

            "first value invalid and second value valid": {
                setUp: function() {
                    this.result = this.model.set({
                        age: 1,
                        name: ''
                    });
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

                "model should be invalid": function() {
                    refute(this.model.isValid());
                }
            },

            "first value valid and second value invalid": {
                setUp: function() {
                    this.result = this.model.set({
                        age: 0,
                        name: 'name'
                    });
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

                "model should be invalid": function() {
                    refute(this.model.isValid());
                }
            },

            "one value at a time correctly marks the model as either valid or invalid": function() {
                refute(this.model.isValid());

                this.model.set({
                    age: 0
                });
                refute(this.model.isValid());

                this.model.set({
                    age: 1
                });
                refute(this.model.isValid());

                this.model.set({
                    name: 'hello'
                });
                assert(this.model.isValid());

                this.model.set({
                    age: 0
                });
                refute(this.model.isValid());
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
                Backbone.Validation.bind(this.view, {
                    valid: this.valid,
                    invalid: this.invalid
                });
            },

            "all attributes on the model is validated when nothing has been set": function(){
                this.model.validate();

                assert.calledWith(this.invalid, this.view, 'age', 'error');
                assert.calledWith(this.invalid, this.view, 'name', 'error');
            },

            "all attributes on the model is validated when one property has been set silently": function(){
                this.model.set({age: 1}, {silent:true});

                this.model.validate();

                assert.calledWith(this.valid, this.view, 'age');
                assert.calledWith(this.invalid, this.view, 'name', 'error');
            },

            "all attributes on the model is validated when two properties has been set silently": function(){
                this.model.set({age: 1, name: 'name'}, {silent:true});

                this.model.validate();

                assert.calledWith(this.valid, this.view, 'age');
                assert.calledWith(this.valid, this.view, 'name');
            },

            "callbacks are not called for unvalidated attributes": function(){

                this.model.set({age: 1, name: 'name', someProp: 'some value'}, {silent:true});

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

            Backbone.Validation.bind(this.view);
        },

        "and violating the first validator the model is invalid": function (){
            this.model.set({postalCode: '1'});

            refute(this.model.isValid());
        },

        "and violating the second validator the model is invalid": function (){
            this.model.set({postalCode: 'ab'});

            refute(this.model.isValid());
        },

       "and violating the last validator the model is invalid": function (){
           this.model.set({postalCode: '12345'});

           refute(this.model.isValid());
       },

        "and conforming to all validators the model is valid": function (){
            this.model.set({postalCode: '123'});

            assert(this.model.isValid());
        }
    },

    "when bound to model with to dependent attribute validations": {
        setUp: function() {
            var View = Backbone.View.extend({
                render: function() {
                    var html = $('<input type="text" name="one" /><input type="text" name="two" />');
                    this.$el.append(html);

                    Backbone.Validation.bind(this);
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
                this.model.set({one:1});
                this.model.set({two:2});
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
                this.model.set({one:1});
                this.model.set({two:2});
                this.model.set({one:2});
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

            Backbone.Validation.bind(this.view);
        },

        "and conforming to all validators the model is valid": function (){
            this.model.set({age: 12});
            this.model.set({name: 'Jack'});

            this.model.validate();
            assert(this.model.isValid());
        }
    }
});
