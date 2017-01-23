(function (factory) {
  if (typeof exports === 'object') {
    module.exports = factory(require('backbone'), require('lodash'));
  } else if (typeof define === 'function' && define.amd) {
    define(['backbone', 'lodash'], factory);
  }
}(function (Backbone, _) {
  //= backbone-validation.js
  return Backbone.Validation;
}));
