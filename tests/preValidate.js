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

  "when model has defined validation with computed": {
    setUp: function() {
      var Model = Backbone.Model.extend({
        validation: {
          name: {
            required: function( val, attr, computed ) {
              return computed.name_required === true;
            }
          },
          address: {
            required: true
          },
          name_required: {
            required: false
          }
        }
      });
      this.model = new Model();
      Backbone.Validation.bind(new Backbone.View({model: this.model}));
    },

    "and pre-validating single attribute": {
      "returns error message when value is not valid and name is required": function() {
        this.model.set('name_required', true);
        assert(this.model.preValidate('name', ''));
      },

      "returns nothing when value in model is empty and name is set to required": function() {
        this.model.set('name_required', false);
        this.model.set('name', '');
        // After this name would be invalid, so the model would be invalid
        // But just this preValidate will be valid because name_required has no validation
        refute(this.model.preValidate('name_required', true));
      },

      "returns nothing when name is empty and name is not required": function() {
        this.model.set('name_required', false);
        refute(this.model.preValidate('name', ''));
      }

    },

    "and pre-validating hash of attributes": {
      "returns error object when value is not valid": function() {
        this.model.set('name_required', true);
        var result = this.model.preValidate({name: ''});
        assert(result);
        assert(result.name);
      },

      "returns nothing when name is empty and name is not required": function() {
        this.model.set('name_required', false);
        var result = this.model.preValidate({name: ''});
        refute(result);
      }
    },

    "and pre-validating hash of attributes including name_required": {
      "returns error object when value is not valid": function() {
        this.model.set('name_required', false);
        var result = this.model.preValidate({name: '', name_required: true});
        assert(result);
        assert(result.name);
      },

      "returns nothing when name is empty and name is not required": function() {
        this.model.set('name_required', true);
        var result = this.model.preValidate({name: '', name_required: false});
        refute(result);
      }
    }
  }
});