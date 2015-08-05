buster.testCase("Backbone.Validation.Async preValidate", {
  "when model has not defined any validation": {
    setUp: function() {
      this.model = new Backbone.Model();

      Backbone.Validation.Async.bind(new Backbone.View({model: this.model}));
    },

    "returns nothing": function(done) {
      this.model.preValidate('attr', 'value', done(function valid() {
        assert(true);
      }), done(function invalid() {
        assert(false);
      }));
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
      Backbone.Validation.Async.bind(new Backbone.View({model: this.model}));
    },

    "and pre-validating single attribute": {
      "returns error message when value is not valid": function(done) {
        this.model.preValidate('name', '', done(function valid() {
          assert(false);
        }), done(function invalid() {
          assert(true);
        }));
      },

      "returns nothing when value is valid": function(done) {
        this.model.preValidate('name', 'name', done(function valid() {
          assert(true);
        }), done(function invalid() {
          assert(false);
        }));
      },

      "returns nothing when attribute pre-validated has no validation": function(done){
        this.model.preValidate('age', 2, done(function valid() {
          assert(true);
        }), done(function invalid() {
          assert(false);
        }));
      },

      "handles null value": function(done) {
        this.model.preValidate('authenticated', null, done(function valid() {
          assert(true);
        }), done(function invalid() {
          assert(false);
        }));
      }
    },

    "and pre-validating hash of attributes": {
      "returns error object when value is not valid": function(done) {
        this.model.preValidate({name: '', address: 'address'}, null, done(function valid() {
          assert(false);
        }), done(function invalid(errors) {
          assert(errors.name);
          refute(errors.address);
        }));
      },

      "returns error object when values are not valid": function(done) {
        this.model.preValidate({name: '', address: ''}, null, done(function valid() {
          assert(false);
        }), done(function invalid(errors) {
          assert(errors.name);
          assert(errors.address);
        }));
      },

      "returns nothing when value is valid": function(done) {
        refute(this.model.preValidate({name: 'name'}));
        this.model.preValidate({name: 'name'}, null, done(function valid() {
          assert(true);
        }), done(function invalid() {
          assert(false);
        }));
      }
    }
  }
});