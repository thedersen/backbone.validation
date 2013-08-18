buster.testCase('Label formatters', {
  "Attribute names on the model can be formatted in error messages using": {
    setUp: function() {
      var Model = Backbone.Model.extend({
        validation: {
          someAttribute: {
            required: true
          },
          some_attribute: {
            required: true
          },
          some_other_attribute: {
            required: true
          }
        },

        labels: {
          someAttribute: 'Custom label'
        }
      });

      this.model = new Model();
      _.extend(this.model, Backbone.Validation.mixin);
    },

    tearDown: function() {
      // Reset to default formatter
      Backbone.Validation.configure({
        labelFormatter: 'sentenceCase'
      });
    },

    "no formatting": {
      setUp: function() {
        Backbone.Validation.configure({
          labelFormatter: 'none'
        });
      },

      "returns the attribute name": function(){
        assert.equals('someAttribute is required', this.model.preValidate('someAttribute', ''));
      }
    },

    "label formatting": {
      setUp: function() {
        Backbone.Validation.configure({
          labelFormatter: 'label'
        });
      },

      "looks up a label on the model": function(){
        assert.equals('Custom label is required', this.model.preValidate('someAttribute', ''));
      },

      "returns sentence cased name when label is not found": function(){
        assert.equals('Some attribute is required', this.model.preValidate('some_attribute', ''));
      },

      "returns sentence cased name when label attribute is not defined": function(){
        var Model = Backbone.Model.extend({
          validation: {
            someAttribute: {
              required: true
            }
          }
        });

        var model = new Model();
        _.extend(model, Backbone.Validation.mixin);

        assert.equals('Some attribute is required', model.preValidate('someAttribute', ''));
      }
    },

    "sentence formatting": {
      setUp: function() {
        Backbone.Validation.configure({
          labelFormatter: 'sentenceCase'
        });
      },

      "sentence cases camel cased attribute name": function(){
        assert.equals('Some attribute is required', this.model.preValidate('someAttribute', ''));
      },

      "sentence cases underscore named attribute name": function(){
        assert.equals('Some attribute is required', this.model.preValidate('some_attribute', ''));
      },

      "sentence cases underscore named attribute name with multiple underscores": function(){
        assert.equals('Some other attribute is required', this.model.preValidate('some_other_attribute', ''));
      }
    }
  }
});