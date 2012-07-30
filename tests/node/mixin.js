var buster = require('buster'),
    backbone = require('backbone'),
    _ = require('underscore'),
    validation = require('../../dist/backbone-validation-amd');

buster.testCase("Server validation", {

  setUp: function(){
    _.extend(backbone.Model.prototype, validation.mixin);

    var Model = backbone.Model.extend({
      validation: {
        name: {
          required: true
        }
      }
    });

    this.model = new Model();
  },

  "Passes validation": function () {
    assert(this.model.set({name:'Name'}));
  },

  "Fails validation": function () {
    refute(this.model.set({name:''}));
  }
});