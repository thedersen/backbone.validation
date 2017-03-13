var assert = require('chai').assert;
var sinon = require('sinon');
var _ = require('underscore');
var Backbone = require('backbone');
require('../dist/backbone-validation-amd');

assert.defined = assert.isDefined;
assert.equals = assert.deepEqual;
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

"Specifying error messages": {
    beforeEach: function() {
        this.model = new Backbone.Model();
        this.view = new Backbone.View({model: this.model});

        this.invalid = sinon.spy();
        Backbone.Validation.bind(this.view, {
            invalid: this.invalid
        });
    },

    "per validator": {
        beforeEach: function() {
            this.model.validation = {
                email: [{
                    required: true,
                    msg: 'required'
                },{
                    pattern: 'email',
                    msg: function() {
                        return 'pattern';
                    }
                }]
            };
        },

        "and violating first validator returns msg specified for first validator": function() {
            this.model.set({email: ''}, {validate: true});

            assert(this.invalid.calledWith (this.view, 'email', 'required'));
        },

        "and violating second validator returns msg specified for second validator": function() {
            this.model.set({email: 'a'}, {validate: true});

            assert(this.invalid.calledWith (this.view, 'email', 'pattern'));
        }
    },

    "per attribute": {
        beforeEach: function() {
            this.model.validation = {
                email: {
                    required: true,
                    pattern: 'email',
                    msg: 'error'
                }
            };
        },

        "and violating first validator returns msg specified for attribute": function() {
            this.model.set({email: ''}, {validate: true});

            assert(this.invalid.calledWith (this.view, 'email', 'error'));
        },

        "and violating second validator returns msg specified for attribute": function() {
            this.model.set({email: 'a'}, {validate: true});

            assert(this.invalid.calledWith (this.view, 'email', 'error'));
        }
    }
}

}
