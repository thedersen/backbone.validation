buster.testCase("Specifying error messages", {
    setUp: function() {
        this.model = new Backbone.Model();
        this.view = new Backbone.View({model: this.model});

        this.invalid = this.spy();
        Backbone.Validation.bind(this.view, {
            invalid: this.invalid
        });
    },

    "per validator": {
        setUp: function() {
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

            assert.calledWith(this.invalid, this.view, 'email', 'required');
        },

        "and violating second validator returns msg specified for second validator": function() {
            this.model.set({email: 'a'}, {validate: true});

            assert.calledWith(this.invalid, this.view, 'email', 'pattern');
        }
    },

    "per attribute": {
        setUp: function() {
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

            assert.calledWith(this.invalid, this.view, 'email', 'error');
        },

        "and violating second validator returns msg specified for attribute": function() {
            this.model.set({email: 'a'}, {validate: true});

            assert.calledWith(this.invalid, this.view, 'email', 'error');
        }
    }
});