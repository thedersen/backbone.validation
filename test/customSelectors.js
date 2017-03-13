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

"Overriding default id selector with class": {
    beforeEach: function() {
        var View = Backbone.View.extend({
            render: function() {
                var html = $('<input type="text" class="name" />');
                this.$el.append(html);
            }
        });

        var Model = Backbone.Model.extend({
            validation: {
                name: function(val) {
                    if (!val) {
                        return 'Name is invalid';
                    }
                }
            }
        });

        this.model = new Model();
        this.view = new View({
            model: this.model
        });

        this.view.render();
        this.name = $(this.view.$(".name"));
    },

    "globally": function() {
        Backbone.Validation.configure({
            selector: 'class'
        });
        Backbone.Validation.bind(this.view);

        this.model.set({name:''}, {validate: true});

        assert(this.name.hasClass('invalid'));

        Backbone.Validation.configure({
            selector: 'name'
        });
    },

    "per view when binding": function() {
        Backbone.Validation.bind(this.view, {
            selector: 'class'
        });
        this.model.set({name:''}, {validate: true});

        assert(this.name.hasClass('invalid'));
    }
}

}

