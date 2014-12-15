buster.testCase("preValidate", {
  "when model has not defined any validation": {
    setUp: function() {
      this.model = new Backbone.Model();

      Backbone.Validation.bind(new Backbone.View({model: this.model}));
    },

    "returns nothing": function() {
      refute(this.model.preValidate('attr', 'value'));
    }
  },

  "when model has defined validation": {
    setUp: function() {
      var Model = Backbone.Model.extend({
        validation: {
          name: {
            required: true
          },
          address: {
            required: true,
          },
          authenticated: {
            required: false
          }
        }
      });
      this.model = new Model();
      Backbone.Validation.bind(new Backbone.View({model: this.model}));
    },

    "and pre-validating single attribute": {
      "returns error message when value is not valid": function() {
        assert(this.model.preValidate('name', ''));
      },

      "returns nothing when value is valid": function() {
        refute(this.model.preValidate('name', 'name'));
      },

      "returns nothing when attribute pre-validated has no validation": function(){
        refute(this.model.preValidate('age', 2));
      },

      "handles null value": function() {
        refute(this.model.preValidate('authenticated', null));
      }
    },

    "and pre-validating hash of attributes": {
      "returns error object when value is not valid": function() {
        var result = this.model.preValidate({name: '', address: 'address'});
        assert(result.name);
        refute(result.address);
      },

      "returns error object when values are not valid": function() {
        var result = this.model.preValidate({name: '', address: ''});
        assert(result.name);
        assert(result.address);
      },

      "returns nothing when value is valid": function() {
        refute(this.model.preValidate({name: 'name'}));
      }
    }
  },
  "when model has defined validation with complex object": {
    setUp: function() {
      var Model = Backbone.Model.extend({
        validation: {
          'address.street': {
            required: true
          },
          'address.city': {
            required: true
          },
          'address.state': {
            required: false
          },
          'foo.bar.baz': {
            required: true
          },
          price: {
            required: true
          }
        }
      });
      this.model = new Model();
      this.modelData = {
        price: '',
        address: {
          street: '',
          city: ''
        },
        foo: {
          bar: {
            baz: ''
          }
        }
      };
      this.errorHash = {
        'price': 'Price is required',
        'address.street':'Address. street is required',
        'address.city': 'Address. city is required',
        'foo.bar.baz': 'Foo. bar. baz is required'
      };

      Backbone.Validation.bind(new Backbone.View({model: this.model}));
    },
    "and prevalidating a single attribute": {
      "returns error message when value is not valid": function() {
        assert(this.model.preValidate('address.street', ''));
      },

      "returns nothing when value is valid": function() {
        refute(this.model.preValidate('address.street', '123 Main Street.'));
      },

      "returns nothing when attribute pre-validated has no validation": function(){
        refute(this.model.preValidate('address.zip', ''));
      },

      "handles null value": function() {
        refute(this.model.preValidate('address.state', null));
      }
    },
    "and prevalidating a hash of attributes": {
      "returns error object when value is not valid": function() {

        var data = {
          address: {
            street: '123 Main Street',
            city: ''
          },
          foo: {
            bar: {
              baz: ''
            }
          }
        };
        var result = this.model.preValidate(data);

        refute(result['address.street']);
        assert(result['address.city']);
        assert(result['foo.bar.baz']);
      },

      "returns error object when values are not valid": function() {
        var result = this.model.preValidate(this.modelData);
        assert(result['address.street']);
        assert(result['address.city']);
        assert(result['foo.bar.baz']);
      },

      "returns nothing when value is valid": function() {
        var data = {
          address: {
            street: '123 Main Street.'
          }
        };

        refute(this.model.preValidate(data));
      },
      "returns object with correct amount of errors": function () {
        assert.equals(this.model.preValidate(this.modelData), this.errorHash);
      }
    }
  }
});
