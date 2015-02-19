buster.testCase("Backbone.Validation.Async Mixin validation", {
    setUp: function() {
        this.origPrototype = _.clone(Backbone.Model.prototype);

        _.extend(Backbone.Model.prototype, Backbone.Validation.Async.mixin);

        this.Model = Backbone.Model.extend({
            validation: {
                name: function(val) {
                    if(!val) {
                        return 'error';
                    }
                }
            }
        });

        this.model = new this.Model();
    },

    tearDown: function() {
        Backbone.Model.prototype = this.origPrototype;
    },

    "isValid is undefined when no validation has occurred": function(done) {
        var callbacks = {
            valid: Function.prototype,
            invalid: Function.prototype
        };
        this.stub(callbacks, 'valid');
        this.stub(callbacks, 'invalid');

        new this.Model().isValid(null, callbacks.valid, callbacks.invalid);

        setTimeout(done(function() {
            refute.calledOnce(callbacks.valid);
            refute.calledOnce(callbacks.invalid);
        }), 100);
    },

    "isValid is false when model is invalid": function(done) {
        this.model.isValid(true, done(function valid() {
            assert(false);
        }), done(function invalid() {
            assert(true);
        }));
    },

    "isValid is true when model is valid": function(done) {
        this.model.set({name: 'name'});

        this.model.isValid(true, done(function valid() {
            assert(true);
        }), done(function invalid() {
            assert(false);
        }));
    },

    "refutes setting invalid value": function(done) {
        var self = this;
        this.model.set({name: ''}, {validate: true});
        this.model.validate('name', null, done(function valid() {
            assert.equals(self.model.get('name'), undefined);
        }), done(function invalid() {
            assert.equals(self.model.get('name'), undefined);
        }));
    },

    "succeeds setting valid value": function(done) {
        var self = this;
        this.model.set({name: 'name'}, {validate: true});
        this.model.validate('name', null, done(function valid() {
            assert.equals(self.model.get('name'), 'name');
        }), done(function invalid() {
            assert(false);
        }));
    },

    "when forcing update succeeds setting invalid value": function(done) {
        var self = this;
        this.model.set({name:''}, {forceUpdate: true, validate: true});
        this.model.validate('name', {forceUpdate: true}, done(function valid() {
            assert.equals(self.model.get('name'), '');
        }), done(function invalid() {
            assert(false);
        }));
    },

    "when forcing update globally": {
        setUp: function() {
            Backbone.Validation.Async.configure({
                forceUpdate: true
            });
        },

        tearDown: function() {
            Backbone.Validation.Async.configure({
                forceUpdate: false
            });
        },

        "succeeds setting invalid value when forcing update globally": function(done) {
            var self = this;
            this.model.set({name:''}, {validate: true});
            this.model.validate('name', null, done(function valid() {
                assert.equals(self.model.get('name'), '');
            }), done(function invalid() {
                assert(false);
            }));
        }
    },

    "when setting attribute on model without validation": {
        setUp: function(){
            this.model = new Backbone.Model();
        },

        "it should not complain": function(done) {
            var self = this;
            this.model.set({someAttr:'someValue'}, {validate: true});
            this.model.validate('someAttr', {forceUpdate: true}, done(function valid() {
                assert.equals(self.model.get('someAttr'), 'someValue');
            }), done(function invalid() {
                assert(false);
            }));
        }
    }
});