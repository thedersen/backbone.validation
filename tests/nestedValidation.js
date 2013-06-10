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
