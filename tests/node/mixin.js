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
    buster.assert(this.model.set({name:'Name'}, {validate: true}));
  },

  "Fails validation": function () {
    buster.refute(this.model.set({name:''}, {validate: true}));
  }
});
