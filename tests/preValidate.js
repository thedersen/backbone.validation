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

  "when model has dependancies between validation functions": {
    setUp: function() {
      var CARD_TYPES = {
        VISA : 0,
        AMEX : 1
      };
      var Model = Backbone.Model.extend({
        validation: {
          card_type: {
            required: true
          },
          security_code: function(value, attr, computedState){
            var requiredLength = (computedState.card_type === CARD_TYPES.AMEX? 4 : 3);
            if(value && _.isString(value) && value.length !== requiredLength) {
              return 'Please enter a valid security code.';
            }
          }
        }
      });
      Model.CARD_TYPES = CARD_TYPES;
      this.ModelDefinition = Model;
      this.model = new Model();
      Backbone.Validation.bind(new Backbone.View({model: this.model}));
    },

    "and pre-validating hash of attributes": {
      "returns error object when value is not valid": function() {
        var result = this.model.preValidate({card_type: this.ModelDefinition.CARD_TYPES.VISA, security_code: '1234'});
        assert(result.security_code);
        refute(result.card_type);
      },

      "returns error object when values are not valid": function() {
        var result = this.model.preValidate({card_type: '', security_code: '12345'});
        assert(result.card_type);
        assert(result.security_code);
      },

      "returns nothing when value is valid": function() {
        refute(this.model.preValidate({card_type: this.ModelDefinition.CARD_TYPES.AMEX, security_code: '1234'}));
      }
    }
  }
});