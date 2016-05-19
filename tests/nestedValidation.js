buster.testCase('Nested validation', {
  "one level": {
    setUp: function() {
      this.valid = this.spy();
      this.invalid = this.spy();

      var Model = Backbone.Model.extend({
        validation: {
          'address.street': {
            required: true,
            msg: 'error'
          }
        }
      });

      this.model = new Model();
      this.view = new Backbone.View({model: this.model});

      Backbone.Validation.bind(this.view, {
        invalid: this.invalid,
        valid: this.valid
      });
    },

    "invalid": {
      setUp: function () {
        this.result = this.model.set({
          address: {
            street:''
          }
        }, {validate: true});
      },

      "refutes setting invalid values": function() {
        refute(this.result);
      },

      "calls the invalid callback": function() {
        assert.calledWith(this.invalid, this.view, 'address.street', 'error');
      },

      "is valid returns false for the specified attribute name": function () {
        refute(this.model.isValid('address.street'));
      },

      "is valid returns false for the specified attribute names": function () {
        refute(this.model.isValid(['address.street', 'address.street']));
      },

      "pre validate returns error message for the specified attribute name": function () {
        assert(this.model.preValidate('address.street', ''));
      }
    },

    "valid": {
      setUp: function () {
        this.result = this.model.set({
          address: {
            street: 'name'
          }
        }, {validate: true});
      },

      "sets the value": function() {
        assert(this.result);
      },

      "calls the valid callback": function() {
        assert.calledWith(this.valid, this.view, 'address.street');
      },

      "is valid returns true for the specified attribute name": function () {
        assert(this.model.isValid('address.street'));
      },

      "is valid returns true for the specified attribute names": function () {
        assert(this.model.isValid(['address.street', 'address.street']));
      },

      "pre validate returns no error message for the specified attribute name": function () {
        refute(this.model.preValidate('address.street', 'street'));
      }
    }
  },

  "two levels": {
    setUp: function() {
      this.valid = this.spy();
      this.invalid = this.spy();

      var Model = Backbone.Model.extend({
        validation: {
          'foo.bar.baz': {
            required: true,
            msg: 'error'
          }
        }
      });

      this.model = new Model();
      this.view = new Backbone.View({model: this.model});

      Backbone.Validation.bind(this.view, {
        invalid: this.invalid,
        valid: this.valid
      });
    },

    "invalid": {
      setUp: function () {
        this.result = this.model.set({
          foo: {
            bar: {
              baz: ''
            }
          }
        }, {validate: true});
      },

      "refutes setting invalid values": function() {
        refute(this.result);
      },

      "calls the invalid callback": function() {
        assert.calledWith(this.invalid, this.view, 'foo.bar.baz', 'error');
      },

      "is valid returns false for the specified attribute name": function () {
        refute(this.model.isValid('foo.bar.baz'));
      },

      "is valid returns false for the specified attribute names": function () {
        refute(this.model.isValid(['foo.bar.baz', 'foo.bar.baz']));
      },

      "pre validate returns error message for the specified attribute name": function () {
        assert(this.model.preValidate('foo.bar.baz', ''));
      }
    },

    "valid": {
      setUp: function () {
        this.result = this.model.set({
          foo: {
            bar: {
              baz: 'val'
            }
          }
        }, {validate: true});
      },

      "sets the value": function() {
        assert(this.result);
      },

      "calls the valid callback": function() {
        assert.calledWith(this.valid, this.view, 'foo.bar.baz');
      },

      "is valid returns true for the specified attribute name": function () {
        assert(this.model.isValid('foo.bar.baz'));
      },

      "is valid returns true for the specified attribute names": function () {
        assert(this.model.isValid(['foo.bar.baz', 'foo.bar.baz']));
      },

      "pre validate returns no error message for the specified attribute name": function () {
        refute(this.model.preValidate('foo.bar.baz', 'val'));
      }
    }
  },

  "arrays": {
    setUp: function() {
      var Model = Backbone.Model.extend({
        validation: {
          'dogs.0.name': {
            required: true,
            msg: 'error'
          }
        }
      });

      this.model = new Model();
      this.view = new Backbone.View({ model: this.model });
      Backbone.Validation.bind(this.view, {});
    },

    "invalid": {
      setUp: function () {
        this.result = this.model.set({
          dogs: [{ name: '' }]
        }, {validate: true});
      },

      "refutes setting invalid values": function() {
        refute(this.result);
      },

      "is valid returns false for the specified attribute name": function () {
        refute(this.model.isValid('dogs.0.name'));
      },
    },

    "valid": {
      setUp: function () {
        this.result = this.model.set({
          dogs: [{ name: 'good boy' }]
        }, {validate: true});
      },

      "sets the value": function() {
        assert(this.result);
      },

      "is valid returns true for the specified attribute name": function () {
        assert(this.model.isValid('dogs.0.name'));
      },
    }
  },

  "complex nesting": {
    setUp: function() {
      this.valid = this.spy();
      this.invalid = this.spy();

      var Model = Backbone.Model.extend({
        validation: {
          'foo.bar.baz': {
            required: true,
            msg: 'error'
          },
          'foo.foo': {
            required: true,
            msg: 'error'
          }
        }
      });

      this.model = new Model();
      this.view = new Backbone.View({model: this.model});

      Backbone.Validation.bind(this.view, {
        invalid: this.invalid,
        valid: this.valid
      });
    },

    "invalid": {
      setUp: function () {
        this.result = this.model.set({
          foo: {
            foo: '',
            bar: {
              baz: ''
            }
          }
        }, {validate: true});
      },

      "refutes setting invalid values": function() {
        refute(this.result);
      },

      "calls the invalid callback": function() {
        assert.calledWith(this.invalid, this.view, 'foo.bar.baz', 'error');
        assert.calledWith(this.invalid, this.view, 'foo.foo', 'error');
      },

      "is valid returns false for the specified attribute name": function () {
        refute(this.model.isValid('foo.bar.baz'));
        refute(this.model.isValid('foo.foo'));
      },

      "is valid returns false for the specified attribute names": function () {
        refute(this.model.isValid(['foo.foo', 'foo.bar.baz']));
      },

      "pre validate returns error message for the specified attribute name": function () {
        assert(this.model.preValidate('foo.bar.baz', ''));
        assert(this.model.preValidate('foo.foo', ''));
      }
    },

    "valid": {
      setUp: function () {
        this.result = this.model.set({
          foo: {
            foo: 'val',
            bar: {
              baz: 'val'
            }
          }
        }, {validate: true});
      },

      "sets the value": function() {
        assert(this.result);
      },

      "calls the valid callback": function() {
        assert.calledWith(this.valid, this.view, 'foo.bar.baz');
        assert.calledWith(this.valid, this.view, 'foo.foo');
      },

      "is valid returns true for the specified attribute name": function () {
        assert(this.model.isValid('foo.bar.baz'));
        assert(this.model.isValid('foo.foo'));
      },

      "is valid returns true for the specified attribute names": function () {
        assert(this.model.isValid(['foo.bar.baz', 'foo.foo']));
      },

      "pre validate returns no error message for the specified attribute name": function () {
        refute(this.model.preValidate('foo.bar.baz', 'val'));
        refute(this.model.preValidate('foo.foo', 'val'));
      }
    }
  },

  "complex nesting with intermediate-level validators": {
    setUp: function() {
      this.valid = this.spy();
      this.invalid = this.spy();

      var Model = Backbone.Model.extend({
        validation: {
          'foo.bar': {
            fn: 'validateBazAndQux',
            msg: 'bazQuxError1'
          },
          'foo.foo': {
            fn: 'validateBazAndQux',
            msg: 'bazQuxError2'
          }
        },
        validateBazAndQux: function (value, attr, computedState) {
          if (!value || !value.baz || !value.qux) {
            return "error";
          }
        }
      });

      this.model = new Model();
      this.view = new Backbone.View({model: this.model});

      Backbone.Validation.bind(this.view, {
        invalid: this.invalid,
        valid: this.valid
      });
    },

    "invalid": {
      setUp: function () {
        this.result = this.model.set({
          foo: {
            bar: {
              baz: '',
              qux: 'qux'
            },
            foo: {
              baz: 'baz',
              qux: ''
            }
          }
        }, {validate: true});
      },

      "refutes setting invalid values": function() {
        refute(this.result);
      },

      "calls the invalid callback": function() {
        assert.calledWith(this.invalid, this.view, 'foo.bar', 'bazQuxError1');
        assert.calledWith(this.invalid, this.view, 'foo.foo', 'bazQuxError2');
      },

      "isValid returns false for the specified attribute name": function () {
        refute(this.model.isValid('foo.bar'));
        refute(this.model.isValid('foo.foo'));
      },

      "isValid returns false for the specified attribute names": function () {
        refute(this.model.isValid(['foo.foo', 'foo.bar']));
      },

      "preValidate returns error message for the specified attribute name": function () {
        assert(this.model.preValidate('foo.bar', ''));
        assert(this.model.preValidate('foo.foo', ''));
      },

      "preValidate does not return error message if new nested values validate": function () {
        refute(this.model.preValidate('foo.bar', { baz: 1, qux: 1 }));
        refute(this.model.preValidate('foo.foo', { baz: 1, qux: 1 }));
      }
    },

    "valid": {
      setUp: function () {
        this.result = this.model.set({
          foo: {
            bar: {
              baz: 'val',
              qux: 'val'
            },
            foo: {
              baz: 'val',
              qux: 'val'
            }
          }
        }, {validate: true});
      },

      "sets the value": function() {
        assert(this.result);
      },

      "calls the valid callback": function() {
        assert.calledWith(this.valid, this.view, 'foo.bar');
        assert.calledWith(this.valid, this.view, 'foo.foo');
      },

      "isValid returns true for the specified attribute name": function () {
        assert(this.model.isValid('foo.bar'));
        assert(this.model.isValid('foo.foo'));
      },

      "isValid returns true for the specified attribute names": function () {
        assert(this.model.isValid(['foo.bar', 'foo.foo']));
      },

      "preValidate returns no error message for the specified attribute name": function () {
        refute(this.model.preValidate('foo.bar', { baz: 1, qux: 1 }));
        refute(this.model.preValidate('foo.foo', { baz: 1, qux: 1 }));
      },

      "preValidate returns error message if new nested values do not validate": function () {
        assert.equals(this.model.preValidate('foo.bar', { baz: '', qux: '' }), 'bazQuxError1');
        assert.equals(this.model.preValidate('foo.foo', { baz: '', qux: '' }), 'bazQuxError2');
      }
    }
  },

  "nested models and collections": {
    setUp: function () {
      this.valid = this.spy();
      this.invalid = this.spy();

      var Model = Backbone.Model.extend({
      });

      var Collection = Backbone.Collection.extend({
        model: Model
      });

      this.model = new Model();
      this.model.set({
        model: this.model,
        collection: new Collection([this.model])
      });
      this.view = new Backbone.View({model: this.model});

      Backbone.Validation.bind(this.view, {
        invalid: this.invalid,
        valid: this.valid
      });

      this.result = this.model.set({
        foo: 'bar'
      }, {validate: true});
    },

    "are ignored": function() {
      assert(this.result);
    }
  }
});
