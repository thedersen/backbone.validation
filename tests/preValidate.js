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
          },
          passwordConfirmation: {
            equalsTo: 'password'
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
    },

    "and pre-validating hash of attributes against itself (2nd param is `true`)": {
      "returns error object when value is not valid": function() {
        var result = this.model.preValidate({password: 'password', passwordConfirmation: 'passWORT'}, true);
        assert(result.passwordConfirmation);
      },

      "returns nothing when value is valid": function() {
        refute(this.model.preValidate({password: 'password', passwordConfirmation: 'password'}, true));
      }
    },

    "and pre-validating hash of attributes against another hash of attributes (2nd param is a hash)": {
      "returns error object when value is not valid": function() {
        var result = this.model.preValidate({passwordConfirmation: 'passWORT'}, {password: 'password'});
        assert(result.passwordConfirmation);
      },

      "returns nothing when value is valid": function() {
        refute(this.model.preValidate({passwordConfirmation: 'password'}, {password: 'password'});
      }
    }
  }
});