buster.testCase('Backbone.Validation.Async Nested validation', {
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
      
      Backbone.Validation.Async.bind(this.view, {
        invalid: this.invalid,
        valid: this.valid
      });
    },
  
    "invalid": {
      setUp: function () {
        this.model.set({
          address: {
            street:''
          }
        }, {validate: true});
      },
  
      "refutes setting invalid values": function(done) {
        this.model.isValid(null, done(function valid() {
          assert(false);
        }), done(function invalid() {
          assert(true);
        }));
      },
  
      "calls the invalid callback": function() {
        assert.calledWith(this.invalid, this.view, 'address.street', 'error');
      },
  
      "is valid returns false for the specified attribute name": function (done) {
        this.model.isValid('address.street', done(function valid() {
          assert(false);
        }), done(function invalid() {
          assert(true);
        }));
      },
  
      "is valid returns false for the specified attribute names": function (done) {
        this.model.isValid(['address.street', 'address.street'], done(function valid() {
          assert(false);
        }), done(function invalid() {
          assert(true);
        }));
      },
  
      "pre validate returns error message for the specified attribute name": function (done) {
        this.model.preValidate('address.street', '', done(function valid() {
          assert(false);
        }), done(function invalid() {
          assert(true);
        }));
      }
    },
  
    "valid": {
      setUp: function () {
        this.model.set({
          address: {
            street: 'name'
          }
        }, {validate: true});
      },
  
      "sets the value": function(done) {
        this.model.isValid(null, done(function valid() {
          assert(true);
        }), done(function invalid() {
          assert(false);
        }));
      },
  
      "calls the valid callback": function() {
        assert.calledWith(this.valid, this.view, 'address.street');
      },
  
      "is valid returns true for the specified attribute name": function (done) {
        this.model.isValid('address.street', done(function valid() {
          assert(true);
        }), done(function invalid() {
          assert(false);
        }));
      },
  
      "is valid returns true for the specified attribute names": function (done) {
        this.model.isValid(['address.street', 'address.street'], done(function valid() {
          assert(true);
        }), done(function invalid() {
          assert(false);
        }));
      },
  
      "pre validate returns no error message for the specified attribute name": function (done) {
        this.model.preValidate('address.street', 'street', done(function valid() {
          assert(true);
        }), done(function invalid() {
          assert(false);
        }));
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
      
      Backbone.Validation.Async.bind(this.view, {
        invalid: this.invalid,
        valid: this.valid
      });
    },

    "invalid": {
      setUp: function () {
        this.model.set({
          foo: {
            bar: {
              baz: ''
            }
          }
        }, {validate: true});
      },
  
      "refutes setting invalid values": function(done) {
        this.model.isValid(null, done(function valid() {
          assert(false);
        }), done(function invalid() {
          assert(true);
        }));
      },
  
      "calls the invalid callback": function() {
        assert.calledWith(this.invalid, this.view, 'foo.bar.baz', 'error');
      },
  
      "is valid returns false for the specified attribute name": function (done) {
        this.model.isValid('foo.bar.baz', done(function valid() {
          assert(false);
        }), done(function invalid() {
          assert(true);
        }));
      },
  
      "is valid returns false for the specified attribute names": function (done) {
        this.model.isValid(['foo.bar.baz', 'foo.bar.baz'], done(function valid() {
          assert(false);
        }), done(function invalid() {
          assert(true);
        }));
      },
  
      "pre validate returns error message for the specified attribute name": function (done) {
        this.model.preValidate('foo.bar.baz', '', done(function valid() {
          assert(false);
        }), done(function invalid() {
          assert(true);
        }));
      }
    },
  
    "valid": {
      setUp: function () {
        this.model.set({
          foo: {
            bar: {
              baz: 'val'
            }
          }
        }, {validate: true});
      },
  
      "sets the value": function(done) {
        this.model.isValid(null, done(function valid() {
          assert(true);
        }), done(function invalid() {
          assert(false);
        }));
      },
  
      "calls the valid callback": function() {
        assert.calledWith(this.valid, this.view, 'foo.bar.baz');
      },
  
      "is valid returns true for the specified attribute name": function (done) {
        this.model.isValid('foo.bar.baz', done(function valid() {
          assert(true);
        }), done(function invalid() {
          assert(false);
        }));
      },
  
      "is valid returns true for the specified attribute names": function (done) {
        this.model.isValid(['foo.bar.baz', 'foo.bar.baz'], done(function valid() {
          assert(true);
        }), done(function invalid() {
          assert(false);
        }));
      },
  
      "pre validate returns no error message for the specified attribute name": function (done) {
        this.model.preValidate('foo.bar.baz', 'val', done(function valid() {
          assert(true);
        }), done(function invalid() {
          assert(false);
        }));
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
      
      Backbone.Validation.Async.bind(this.view, {
        invalid: this.invalid,
        valid: this.valid
      });
    },

    "invalid": {
      setUp: function () {
        this.model.set({
          foo: {
            foo: '',
            bar: {
              baz: ''
            }
          }
        }, {validate: true});
      },
  
      "refutes setting invalid values": function(done) {
        this.model.isValid(null, done(function valid() {
          assert(false);
        }), done(function invalid() {
          assert(true);
        }));
      },
  
      "calls the invalid callback": function() {
        assert.calledWith(this.invalid, this.view, 'foo.bar.baz', 'error');
        assert.calledWith(this.invalid, this.view, 'foo.foo', 'error');
      },
  
      "is valid returns false for the specified attribute name": function (done) {
        this.model.isValid('foo.bar.baz', done(function valid() {
          assert(false);
        }), done(function invalid() {
          assert(true);
        }));
        this.model.isValid('foo.foo', done(function valid() {
          assert(false);
        }), done(function invalid() {
          assert(true);
        }));
      },
  
      "is valid returns false for the specified attribute names": function (done) {
        this.model.isValid(['foo.foo', 'foo.bar.baz'], done(function valid() {
          assert(false);
        }), done(function invalid() {
          assert(true);
        }));
      },
  
      "pre validate returns error message for the specified attribute name": function (done) {
        this.model.preValidate('foo.bar.baz', '', done(function valid() {
          assert(false);
        }), done(function invalid() {
          assert(true);
        }));
        this.model.preValidate('foo.foo', '', done(function valid() {
          assert(false);
        }), done(function invalid() {
          assert(true);
        }));
      }
    },
  
    "valid": {
      setUp: function () {
        this.model.set({
          foo: {
            foo: 'val',
            bar: {
              baz: 'val'
            }
          }
        }, {validate: true});
      },
  
      "sets the value": function(done) {
        this.model.isValid(null, done(function valid() {
          assert(true);
        }), done(function invalid() {
          assert(false);
        }));
      },
  
      "calls the valid callback": function() {
        assert.calledWith(this.valid, this.view, 'foo.bar.baz');
        assert.calledWith(this.valid, this.view, 'foo.foo');
      },
  
      "is valid returns true for the specified attribute name": function (done) {
        this.model.isValid('foo.bar.baz', done(function valid() {
          assert(true);
        }), done(function invalid() {
          assert(false);
        }));
        this.model.isValid('foo.foo', done(function valid() {
          assert(true);
        }), done(function invalid() {
          assert(false);
        }));
      },
  
      "is valid returns true for the specified attribute names": function (done) {
        this.model.isValid(['foo.foo', 'foo.bar.baz'], done(function valid() {
          assert(true);
        }), done(function invalid() {
          assert(false);
        }));
      },
  
      "pre validate returns no error message for the specified attribute name": function (done) {
        this.model.preValidate('foo.bar.baz', 'val', done(function valid() {
          assert(true);
        }), done(function invalid() {
          assert(false);
        }));
        this.model.preValidate('foo.foo', 'val', done(function valid() {
          assert(true);
        }), done(function invalid() {
          assert(false);
        }));
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
      
      Backbone.Validation.Async.bind(this.view, {
        invalid: this.invalid,
        valid: this.valid
      });
    },

    "invalid": {
      setUp: function () {
        this.model.set({
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
  
      "refutes setting invalid values": function(done) {
        this.model.isValid(null, done(function valid() {
          assert(false);
        }), done(function invalid() {
          assert(true);
        }));
      },
  
      "calls the invalid callback": function() {
        assert.calledWith(this.invalid, this.view, 'foo.bar', 'bazQuxError1');
        assert.calledWith(this.invalid, this.view, 'foo.foo', 'bazQuxError2');
      },
  
      "isValid returns false for the specified attribute name": function (done) {
        this.model.isValid('foo.bar', done(function valid() {
          assert(false);
        }), done(function invalid() {
          assert(true);
        }));
        this.model.isValid('foo.foo', done(function valid() {
          assert(false);
        }), done(function invalid() {
          assert(true);
        }));
      },
  
      "isValid returns false for the specified attribute names": function (done) {
        this.model.isValid(['foo.foo', 'foo.bar'], done(function valid() {
          assert(false);
        }), done(function invalid() {
          assert(true);
        }));
      },
  
      "preValidate returns error message for the specified attribute name": function (done) {
        this.model.preValidate('foo.bar', '', done(function valid() {
          assert(false);
        }), done(function invalid() {
          assert(true);
        }));
        this.model.preValidate('foo.foo', '', done(function valid() {
          assert(false);
        }), done(function invalid() {
          assert(true);
        }));
      },

      "preValidate does not return error message if new nested values validate": function (done) {
        this.model.preValidate('foo.bar', { baz: 1, qux: 1 }, done(function valid() {
          assert(true);
        }), done(function invalid() {
          assert(false);
        }));
        this.model.preValidate('foo.foo', { baz: 1, qux: 1 }, done(function valid() {
          assert(true);
        }), done(function invalid() {
          assert(false);
        }));
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
  
      "sets the value": function(done) {
        this.model.isValid(null, done(function valid() {
          assert(true);
        }), done(function invalid() {
          assert(false);
        }));
      },
  
      "calls the valid callback": function() {
        assert.calledWith(this.valid, this.view, 'foo.bar');
        assert.calledWith(this.valid, this.view, 'foo.foo');
      },
  
      "isValid returns true for the specified attribute name": function (done) {
        this.model.isValid('foo.bar', done(function valid() {
          assert(true);
        }), done(function invalid() {
          assert(false);
        }));
        this.model.isValid('foo.foo', done(function valid() {
          assert(true);
        }), done(function invalid() {
          assert(false);
        }));
      },
  
      "isValid returns true for the specified attribute names": function (done) {
        this.model.isValid(['foo.foo', 'foo.bar'], done(function valid() {
          assert(true);
        }), done(function invalid() {
          assert(false);
        }));
      },
  
      "preValidate returns no error message for the specified attribute name": function (done) {
        this.model.preValidate('foo.bar', { baz: 1, qux: 1 }, done(function valid() {
          assert(true);
        }), done(function invalid() {
          assert(false);
        }));
        this.model.preValidate('foo.foo', { baz: 1, qux: 1 }, done(function valid() {
          assert(true);
        }), done(function invalid() {
          assert(false);
        }));
      },

      "preValidate returns error message if new nested values do not validate": function (done) {
        this.model.preValidate('foo.bar', { baz: '', qux: '' }, done(function valid() {
          assert(false);
        }), done(function invalid(error) {
          assert.equals(error, 'bazQuxError1');
        }));
        this.model.preValidate('foo.foo', { baz: '', qux: '' }, done(function valid() {
          assert(false);
        }), done(function invalid(error) {
          assert.equals(error, 'bazQuxError2');
        }));
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

      Backbone.Validation.Async.bind(this.view, {
        invalid: this.invalid,
        valid: this.valid
      });

      this.model.set({
        foo: 'bar'
      }, {validate: true});
    },

    "are ignored": function(done) {
      this.model.isValid(null, done(function valid() {
        assert(true);
      }), done(function invalid() {
        assert(false);
      }));
    }
  }
});
