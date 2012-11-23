buster.testCase('Nested validation', {
  setUp: function() {
    this.valid = this.spy();
    this.invalid = this.spy();

    var Model = Backbone.Model.extend({
      validation: {
        'address.street': {
          required: true
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
      });
    },

    "refutes setting invalid values": function() {
      refute(this.result);
    },

    "calls the invalid callback": function() {
      assert.calledWith(this.invalid, this.view, 'address.street', 'Address. street is required');
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
      });
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
});
