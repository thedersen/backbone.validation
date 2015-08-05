buster.testCase("Backbone.Validation.Async validation definition", {
    setUp: function() {
        var Model = Backbone.Model.extend({
            validation: function() {
                return {
                    name: {
                        required: true
                    }
                };
            }
        });

        _.extend(Model.prototype, Backbone.Validation.Async.mixin);

        this.model = new Model();
    },

    "can be a function": function (done) {
        var self = this;
        self.model.set({name: ''}, {validate: true});
        setTimeout(function() {
            refute(self.model._isValid);
            self.model.set({name: 'name'}, {validate: true});
            setTimeout(function() {
                assert(self.model._isValid);
                done();
            }, 10);
        }, 10);
    }
});