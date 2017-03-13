var assert = require('chai').assert;
var sinon = require('sinon');
var _ = require('underscore');
var Backbone = require('backbone');
require('../dist/backbone-validation-amd');

assert.defined = assert.isDefined;
assert.equals = assert.equal;
assert.contains = assert.include;
assert.same = assert.strictEqual;
assert.exception = assert.throws;
assert.called = function(func) {
  return assert(func.called)
}
var refute = assert.isNotOk;
refute.contains = assert.notInclude;
refute.defined = assert.isUndefined;
refute.same = assert.notStrictEqual;
refute.exception = assert.doesNotThrow;

module.exports = {

    before: function () {
        this.jsdom = require('jsdom-global')()
        Backbone.$ = $ = require('jquery')(window)
    },

    after: function () {
        this.jsdom()
    },


"Overriding default callbacks in Backbone.Validation": {
    beforeEach: function() {
        this.originalCallbacks = {};
        _.extend(this.originalCallbacks, Backbone.Validation.callbacks);

        this.valid = sinon.spy();
        this.invalid = sinon.spy();

        _.extend(Backbone.Validation.callbacks, {
            valid: this.valid,
            invalid: this.invalid
        });

        var Model = Backbone.Model.extend({
            validation: {
                age: function(val) {
                    if (val === 0) {
                        return "Age is invalid";
                    }
                }
            }
        });

        this.model = new Model();

        Backbone.Validation.bind(new Backbone.View({
            model: this.model
        }));
    },

    afterEach: function(){
        _.extend(Backbone.Validation.callbacks, this.originalCallbacks);
    },

    "validate should call overridden valid callback": function() {
        this.model.set({
            age: 1
        }, {validate: true});

        assert.called(this.valid);
    },

    "validate should call overridden invalid callback": function() {
        this.model.set({
            age: 0
        }, {validate: true});

        assert.called(this.invalid);
    },

    "isValid(true) should call overridden valid callback": function() {
        this.model.set({
          age: 1
        });
        this.model.isValid(true);
        assert.called(this.valid);
    },

    "isValid(true) should call overridden invalid callback": function() {
        this.model.set({
          age: 0
        });
      this.model.isValid(true);
      assert.called(this.invalid);
    },

    "isValid([]) should call overridden valid callback": function() {
        this.model.set({
          age: 1
        });
        this.model.isValid(['age']);
        assert.called(this.valid);
    },

    "isValid([]) should call overridden invalid callback": function() {
        this.model.set({
          age: 0
        });
        this.model.isValid(['age']);
        assert.called(this.invalid);
    }

}

}


