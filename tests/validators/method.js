buster.testCase("method validator", {
    setUp: function() {
        var that = this;
        var Model = Backbone.Model.extend({
            validation: {
                name: {
                    fn: function(val) {
                        that.ctx = this;
                        if (name !== 'backbone') {
                            return 'Error';
                        }
                    }
                }
            }
        });
        this.model = new Model();
        this.view = new Backbone.View({
            model: this.model
        });

        Backbone.Validation.bind(this.view, {
            valid: this.spy(),
            invalid: this.spy()
        });
    },

    "is invalid when method returns error message": function() {
        refute(this.model.set({
            name: ''
        }));
    },

    "is valid when method returns undefined": function() {
        refute(this.model.set({
            name: 'backbone'
        }));
    },

    "context is the model": function() {
        this.model.set({
            name: ''
        });
        assert.same(this.ctx, this.model);
    }
});

buster.testCase("method validator short hand syntax", {
    setUp: function() {
        var that = this;
        var Model = Backbone.Model.extend({
            validation: {
                name: function(val) {
                    that.ctx = this;
                    if (name !== 'backbone') {
                        return 'Error';
                    }
                }
            }
        });
        this.model = new Model();
        this.view = new Backbone.View({
            model: this.model
        });

        Backbone.Validation.bind(this.view, {
            valid: this.spy(),
            invalid: this.spy()
        });
    },

    "is invalid when method returns error message": function() {
        refute(this.model.set({
            name: ''
        }));
    },

    "is valid when method returns undefined": function() {
        refute(this.model.set({
            name: 'backbone'
        }));
    },

    "context is the model": function() {
        this.model.set({
            name: ''
        });
        assert.same(this.ctx, this.model);
    }
});