var assert = require('chai').assert;

global._ = require('underscore');
global.Backbone = require('backbone');
require('../dist/backbone-validation-amd');

global.assert = assert;

assert.defined = assert.isDefined;
assert.equals = assert.deepEqual;
assert.contains = assert.include;
assert.same = assert.strictEqual;
assert.exception = assert.throws;
assert.called = function(func) {
  return assert(func.called)
}

global.refute = assert.isNotOk;
refute.contains = assert.notInclude;
refute.defined = assert.isUndefined;
refute.same = assert.notStrictEqual;
refute.exception = assert.doesNotThrow;

global.sinon = require('sinon');

var jsdom;

before(function() {
  jsdom = require('jsdom-global')()
  Backbone.$ = $ = require('jquery')(window)
})

after(function() {
  jsdom()
})
