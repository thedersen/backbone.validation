buster.testCase("Setting options.attributes", {
    setUp: function () {
        var View = Backbone.View.extend({
            render: function () {
                var html = $('<form><input type="text" name="name" /><input type="radio" name="name" /><input type="submit" name="save"/><button name="cancel"></button></form>');
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
                },
                email: {
                    pattern: 'email'
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
            assert.defined(errors.name);
            assert.defined(errors.age);
            refute.defined(errors.password);
            refute.defined(errors.email);
        },

        "when all the attributes in array are valid": {
            setUp: function () {
                this.model.set({
                    age: 1,
                    name: 'hello',
                    email: 'invalidemail'
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
            assert.defined(errors.name);
            assert.defined(errors.age);
            refute.defined(errors.password);
            refute.defined(errors.email);
        },

        "when all the attributes returned by the function are valid": {
            setUp: function () {
                this.model.set({
                    age: 1,
                    name: 'hello',
                    email: 'invalidemail'
                });
            },
            "validation will pass": function () {
                var errors = this.model.validate();
                refute.defined(errors);
            }
        }
    },
    "to 'inputNames' builtin attributeLoader": {
        setUp: function () {
            Backbone.Validation.bind(this.view, {
                attributes: 'inputNames'
            });
        },
        tearDown: function () {
            Backbone.Validation.unbind(this.view);
            this.model.clear();
        },

        "only the attributes with present in form should be validated": function () {
            var errors = this.model.validate();
            assert.defined(errors.name);
            refute.defined(errors.age);
            refute.defined(errors.password);
            refute.defined(errors.email);
        },

        "submit and buttons should not be included in attribute array": function () {
            var attrs = Backbone.Validation.attributeLoaders.inputNames(this.view);
            assert.equals(attrs.length, 1, 'Length of array returned by inputNames loader');
            assert.contains(attrs, 'name');
            refute.contains(attrs, 'save');
            refute.contains(attrs, 'cancel');
        },
        "when all the attributes present in form are valid": {
            setUp: function () {
                this.model.set({
                    name: 'hello',
                    email: 'invalidemail'
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
            assert.defined(errors.age);
            refute.defined(errors.name);
            refute.defined(errors.password);
        },

        "when all the attributes returned by the registered function are valid": {
            setUp: function () {
                this.model.set({
                    age: 1,
                    email: 'invalidemail'
                });
            },
            "validation will pass": function () {
                var errors = this.model.validate();
                refute.defined(errors);
            }
        }
    }
});