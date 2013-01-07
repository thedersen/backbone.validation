buster.testCase("Mixin validation", {
    setUp: function() {
        this.origPrototype = _.clone(Backbone.Model.prototype);

        _.extend(Backbone.Model.prototype, Backbone.Validation.mixin);

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

    // This breaks in v0.9.9 since validation is called from ctor.
    // Will change i v.next of BB
    "//isValid is undefined when no validation has occurred": function() {
        refute.defined(new this.Model().isValid());
    },

    "isValid is false when model is invalid": function() {
        assert.equals(false, this.model.isValid(true));
    },

    "isValid is true when model is valid": function() {
        this.model.set({name: 'name'},{silent:true});

        assert.equals(true, this.model.isValid(true));
    },

    "refutes setting invalid value": function() {
        refute(this.model.set({name: ''}));
    },

    "succeeds setting valid value": function() {
        assert(this.model.set({name: 'name'}));
    },

    "when forcing update succeeds setting invalid value": function() {
        assert(this.model.set({name:''}, {forceUpdate: true}));
    },

    "when forcing update globally": {
        setUp: function() {
            Backbone.Validation.configure({
                forceUpdate: true
            });
        },

        tearDown: function() {
            Backbone.Validation.configure({
                forceUpdate: false
            });
        },

        "succeeds setting invalid value when forcing update globally": function() {
            assert(this.model.set({name:''}));
        }
    },

    "when setting attribute on model without validation": {
        setUp: function(){
            this.model = new Backbone.Model();
        },

        "it should not complain": function() {
            assert(this.model.set({someAttr: 'someValue'}));
        }
    }
});