buster.testCase("Mixin validation", {
    setUp: function() {
        this.origPrototype = _.clone(Backbone.Model.prototype);

        _.extend(Backbone.Model.prototype, Backbone.Validation.mixin);

        var Model = Backbone.Model.extend({
            validation: {
                name: function(val) {
                    if(!val) return 'error';
                }
            }
        });

        this.model = new Model();
    },

    tearDown: function() {
        Backbone.Model.prototype = this.origPrototype;
    },

    "isValid is undefined when no validation has occurred": function() {
        refute.defined(this.model.isValid());
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
    }
});