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
          authenticated: {
            required: false
          }
        }
      });
      this.model = new Model();
      Backbone.Validation.bind(new Backbone.View({model: this.model}));
    },

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
  }
});