buster.testCase("Setting options.attributes", {
    setUp: function () {
        var View = Backbone.View.extend({
            render: function () {
                var html = $('<form><input type="text" name="name" /></form>');
                this.$el.append(html);
            }
        });

        var Model = Backbone.Model.extend({
            validation: {
                age: {
                    required: true
                },
                name: {
                    required: true
                },
                password: {
                    required: true
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

    tearDown: function () {
        this.view.remove();
    },

    "to an string array": {
        setUp: function () {
            Backbone.Validation.bind(this.view, {
                attributes: ['name', 'age']
            });
        },
        tearDown: function () {
            Backbone.Validation.unbind(this.view);
            this.model.clear();
        },

        "only the attributes in array should be validated": function () {
            var errors = this.model.validate();
            assert.defined(errors['name']);
            assert.defined(errors['age']);
            refute.defined(errors['password']);
        },

        "when all the attributes in array are valid": {
            setUp: function () {
                this.model.set({
                    age: 1,
                    name: 'hello'
                });
            },
            "validation will pass": function () {
                var errors = this.model.validate();
                refute.defined(errors);
            }
        }
    },
    "to an function returning an string array": {
        setUp: function () {
            Backbone.Validation.bind(this.view, {
                attributes: function(view) {
                    return ['name', 'age'];
                }
            });
        },
        tearDown: function () {
            Backbone.Validation.unbind(this.view);
            this.model.clear();
        },

        "only the attributes returned by the function should be validated": function () {
            var errors = this.model.validate();
            assert.defined(errors['name']);
            assert.defined(errors['age']);
            refute.defined(errors['password']);
        },

        "when all the attributes returned by the function are valid": {
            setUp: function () {
                this.model.set({
                    age: 1,
                    name: 'hello'
                });
            },
            "validation will pass": function () {
                var errors = this.model.validate();
                refute.defined(errors);
            }
        }
    },
    "to 'form', the builtin attributeLoader": {
        setUp: function () {
            Backbone.Validation.bind(this.view, {
                attributes: 'form'
            });
        },
        tearDown: function () {
            Backbone.Validation.unbind(this.view);
            this.model.clear();
        },

        "only the attributes with present in form should be validated": function () {
            var errors = this.model.validate();
            assert.defined(errors['name']);
            refute.defined(errors['age']);
            refute.defined(errors['password']);
        },

        "when all the attributes present in form are valid": {
            setUp: function () {
                this.model.set({
                    name: 'hello'
                });
            },
            "validation will pass": function () {
                var errors = this.model.validate();
                refute.defined(errors);
            }
        }
    },
    "to an custom attributeLoader": {
        setUp: function () {
            _.extend(Backbone.Validation.attributeLoaders, {
               myAttrLoader: function() {
                   return ['age'];
               }
            });
            Backbone.Validation.bind(this.view, {
                attributes: 'myAttrLoader'
            });
        },
        tearDown: function () {
            Backbone.Validation.unbind(this.view);
            this.model.clear();
        },

        "only the attributes returned by the registered function should be validated": function () {
            var errors = this.model.validate();
            assert.defined(errors['age']);
            refute.defined(errors['name']);
            refute.defined(errors['password']);
        },

        "when all the attributes returned by registered the function are valid": {
            setUp: function () {
                this.model.set({
                    age: 1
                });
            },
            "validation will pass": function () {
                var errors = this.model.validate();
                refute.defined(errors);
            }
        }
    }
});