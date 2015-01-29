buster.testCase('Binding to view with model', {
    setUp: function() {
        var View = Backbone.View.extend({
            render: function() {
                Backbone.Validation.bind(this);
            }
        });
        var Model = Backbone.Model.extend({
            validation: {
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
    },

    tearDown: function() {
        this.view.remove();
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
                name: 'Ben'
            }, {validate: true});

            assert.called(this.valid);
        },

        "should call invalid callback passed with options": function() {
            this.model.set({
                name: ''
            }, {validate: true});

            assert.called(this.invalid);
        }
    },

    "and passing custom callbacks and selector with the options": {
        setUp: function(){
            this.valid = this.spy();
            this.invalid = this.spy();

            Backbone.Validation.bind(this.view, {
                selector: 'some-selector',
                valid: this.valid,
                invalid: this.invalid
            });
        },

        "should call valid callback with correct selector": function() {
            this.model.set({
                name: 'Ben'
            }, {validate: true});

            assert.calledWith(this.valid, this.view, 'name', 'some-selector');
        },

        "should call invalid callback with correct selector": function() {
            this.model.set({
                name: ''
            }, {validate: true});

            assert.calledWith(this.invalid, this.view, 'name', 'Name is invalid', 'some-selector');
        }
    },

    "and unbinding":{
        setUp: function(){
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
    }
});

buster.testCase('Binding to view with optional model', {
    setUp: function() {
        var self = this;

        this.valid = this.spy();
        this.invalid = this.spy();

        var Model = Backbone.Model.extend({
            validation: {
                name: function(val) {
                    if (!val) {
                        return 'Name is invalid';
                    }
                }
            }
        });
        this.model = new Model();

        var View = Backbone.View.extend({
            render: function() {
                Backbone.Validation.bind(this, {
                    model: self.model,
                    valid: self.valid,
                    invalid: self.invalid
                });
            }
        });
        this.view = new View();

        this.view.render();
    },

    tearDown: function() {
        this.view.remove();
    },

    "the model's validate function is defined": function() {
        assert.defined(this.model.validate);
    },

    "the model's isValid function is overridden": function() {
        refute.same(this.model.isValid, Backbone.Model.prototype.isValid);
    },

    "should call valid callback passed with options": function() {
        this.model.set({
            name: 'Ben'
        }, {validate: true});

        assert.called(this.valid);
    },

    "should call invalid callback passed with options": function() {
        this.model.set({
            name: ''
        }, {validate: true});

        assert.called(this.invalid);
    },

    "and unbinding":{
        setUp: function(){
            Backbone.Validation.unbind(this.view, {model: this.model});
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
    }
});

buster.testCase('Binding to view with collection', {
    setUp: function() {
        var View = Backbone.View.extend({
            render: function() {
                Backbone.Validation.bind(this);
            }
        });
        this.Model = Backbone.Model.extend({
            validation: {
                name: function(val) {
                    if (!val) {
                        return 'Name is invalid';
                    }
                }
            }
        });
        var Collection = Backbone.Collection.extend({
            model: this.Model
        });
        this.collection = new Collection([{name: 'Tom'}, {name: 'Thea'}]);
        this.view = new View({
            collection: this.collection
        });

        this.view.render();
    },

    tearDown: function() {
        this.view.remove();
    },

    "binds existing models in collection when binding": function() {
        assert.defined(this.collection.at(0).validate);
        assert.defined(this.collection.at(1).validate);
    },

    "binds model that is added to the collection": function() {
        var model = new this.Model({name: 'Thomas'});
        this.collection.add(model);

        assert.defined(model.validate);
    },

    "binds models that are batch added to the collection": function() {
        var model1 = new this.Model({name: 'Thomas'});
        var model2 = new this.Model({name: 'Hans'});
        this.collection.add([model1, model2]);

        assert.defined(model1.validate);
        assert.defined(model2.validate);
    },

    "unbinds model that is removed from collection": function() {
        var model = this.collection.at(0);
        this.collection.remove(model);

        refute.defined(model.validate);
    },

    "unbinds models that are batch removed from collection": function() {
        var model1 = this.collection.at(0);
        var model2 = this.collection.at(1);
        this.collection.remove([model1, model2]);

        refute.defined(model1.validate);
        refute.defined(model2.validate);
    },

    "unbinds all models in collection when unbinding view": function() {
        Backbone.Validation.unbind(this.view);

        refute.defined(this.collection.at(0).validate);
        refute.defined(this.collection.at(1).validate);
    },

    "unbinds all collection events when unbinding view": function() {
        var that = this;
        Backbone.Validation.unbind(this.view);

        refute.exception(function() { that.collection.trigger('add'); });
        refute.exception(function() { that.collection.trigger('remove'); });
    }
});

buster.testCase('Binding to view with optional collection', {
    setUp: function() {
        var self = this;
        this.Model = Backbone.Model.extend({
            validation: {
                name: function(val) {
                    if (!val) {
                        return 'Name is invalid';
                    }
                }
            }
        });
        var Collection = Backbone.Collection.extend({
            model: this.Model
        });
        this.collection = new Collection([{name: 'Tom'}, {name: 'Thea'}]);
        var View = Backbone.View.extend({
            render: function() {
                Backbone.Validation.bind(this, {collection: self.collection});
            }
        });
        this.view = new View();

        this.view.render();
    },

    tearDown: function() {
        this.view.remove();
    },

    "binds existing models in collection when binding": function() {
        assert.defined(this.collection.at(0).validate);
        assert.defined(this.collection.at(1).validate);
    },

    "binds model that is added to the collection": function() {
        var model = new this.Model({name: 'Thomas'});
        this.collection.add(model);

        assert.defined(model.validate);
    },

    "binds models that are batch added to the collection": function() {
        var model1 = new this.Model({name: 'Thomas'});
        var model2 = new this.Model({name: 'Hans'});
        this.collection.add([model1, model2]);

        assert.defined(model1.validate);
        assert.defined(model2.validate);
    },

    "unbinds model that is removed from collection": function() {
        var model = this.collection.at(0);
        this.collection.remove(model);

        refute.defined(model.validate);
    },

    "unbinds models that are batch removed from collection": function() {
        var model1 = this.collection.at(0);
        var model2 = this.collection.at(1);
        this.collection.remove([model1, model2]);

        refute.defined(model1.validate);
        refute.defined(model2.validate);
    },

    "unbinds all models in collection when unbinding view": function() {
        Backbone.Validation.unbind(this.view, {collection: this.collection});

        refute.defined(this.collection.at(0).validate);
        refute.defined(this.collection.at(1).validate);
    },

    "unbinds all collection events when unbinding view": function() {
        var that = this;
        Backbone.Validation.unbind(this.view, {collection: this.collection});

        refute.exception(function() { that.collection.trigger('add'); });
        refute.exception(function() { that.collection.trigger('remove'); });
    }
});

buster.testCase('Binding to view with no model or collection', {
    "throws exception": function(){
      assert.exception(function(){
        Backbone.Validation.bind(new Backbone.View());
      });
    }
});

buster.testCase('Binding multiple views to same model', {
  setUp: function() {
    var Model = Backbone.Model.extend({
      validation: {
        name: function(val) {
          if (!val) {
            return 'Name is invalid';
          }
        },
        surname: function(val) {
          if (!val) {
            return 'Surname is invalid';
          }
        }
      }
    });
    var View = Backbone.View.extend({
      initialize: function(data){
        this.attributeName = data.attributeName;
      },
      render: function() {
        var html = $('<input type="text" name="' + this.attributeName + '" />');
        this.$el.append(html);
        Backbone.Validation.bind(this);
      }
    });
    this.model = new Model();
    this.view1 = new View({
      attributeName: 'name',
      model: this.model
    });
    this.view2 = new View({
      attributeName: 'surname',
      model: this.model
    });
    this.view1.render();
    this.view2.render();
    this.name = $(this.view1.$('[name~=name]'));
    this.surname = $(this.view2.$('[name~=surname]'));
  },

  tearDown: function() {
    this.view1.remove();
  },

  "both elements receive invalid class and data-error message when validating the model": function() {
    this.model.validate();

    assert(this.name.hasClass('invalid'));
    assert(this.surname.hasClass('invalid'));
    assert.equals(this.name.data('error'), 'Name is invalid');
    assert.equals(this.surname.data('error'), 'Surname is invalid');
  },

  "each element validates separately": {
    setUp: function() {
      this.model.set({
        name: 'Rafael'
      });
      this.model.validate();
    },

    "first element should not have invalid class": function() {
      refute(this.name.hasClass('invalid'));
    },

    "second element should have invalid class": function() {
      assert(this.surname.hasClass('invalid'));
    }
  },

  "each view can be unbind separately from the same model": {
    setUp: function() {
      this.model.set('name', '');
      this.view2.render();
      Backbone.Validation.unbind(this.view2);
      this.model.validate();
    },

    "first element is invalid and has class invalid": function() {
      refute(this.model.isValid('name'));
      assert(this.name.hasClass('invalid'));
    },

    "second element is invalid and has not class invalid": function() {
      refute(this.model.isValid('surname'));
      refute(this.surname.hasClass('invalid'));
    }
  }
});