buster.testCase("required validator", {
    "valid and invalid values": {
        setUp: function() {
            var Model = Backbone.Model.extend({
                validation: {
                    name: {
                        required: true
                    },
                    agree: {
                        required: true
                    },
                    posts: {
                        required: true
                    }
                }
            });

            _.extend(Model.prototype, Backbone.Validation.mixin);

            this.model = new Model({
                name: 'name',
                agree: true,
                posts: ['post'],
            });
        },

        "empty string is invalid": function() {
            refute(this.model.set({
                name: ''
            }, {validate: true}));
        },

        "non-empty string is valid": function() {
            assert(this.model.set({
                name: 'a'
            }, {validate: true}));
        },

        "string with just spaces is invalid": function() {
            refute(this.model.set({
                name: '  '
            }, {validate: true}));
        },

        "null is invalid": function() {
            refute(this.model.set({
                name: null
            }, {validate: true}));
        },

        "undefined is invalid": function() {
            refute(this.model.set({
                name: void 0
            }, {validate: true}));
        },

        "false boolean is valid": function() {
            assert(this.model.set({
                agree: false
            }, {validate: true}));
        },

        "true boolean is valid": function() {
            assert(this.model.set({
                agree: true
            }, {validate: true}));
        },

        "empty array is invalid": function() {
            refute(this.model.set({
                posts: []
            }, {validate: true}));
        },

        "non-empty array is valid": function() {
            assert(this.model.set({
                posts: ['post']
            }, {validate: true}));
        }
    },

    "default error message": {
        setUp: function () {
            var Model = Backbone.Model.extend({
                validation: {
                    name: {
                        required: true
                    }
                }
            });

            _.extend(Model.prototype, Backbone.Validation.mixin);

            this.model = new Model({ name: "name" });
        },

        "message is sent to validated:invalid event": function (done) {
            this.model.bind('validated:invalid', function(model, error){
                assert.equals({ name: 'Name is required' }, error);
                done();
            });

            this.model.set({ name: '' }, { validate: true });
        },

        "message is sent to invalid function": function () {
            var invalid = this.spy();

            var view = new Backbone.View({ model: this.model });

            Backbone.Validation.bind(view, {
                invalid: invalid
            });

            this.model.set({ name: '' }, { validate: true });

            assert.calledWith(invalid, view, "name", "Name is required");
        }
    },

    "required as a function": {
        setUp: function () {
            this.requiredSpy = this.spy(function (value, attr, computed) {
                return this.get("shouldRequireName");
            });

            var Model = Backbone.Model.extend({
                validation: {
                    shouldRequireName: {
                        required: true,
                    },
                    name: {
                        required: this.requiredSpy
                    }
                }
            });

            _.extend(Model.prototype, Backbone.Validation.mixin);

            this.model = new Model();
        },

        "required function call": {
            setUp: function () {
                this.model.set({
                    name: "name value",
                    shouldRequireName: true
                }, { validate: true });
            },

            "function is called on model": function () {
                assert.calledOn(this.requiredSpy, this.model);
            },

            "function is called with value, attribute name, and computed": function () {
                assert.calledWith(this.requiredSpy, "name value", "name", {
                    name: "name value",
                    shouldRequireName: true
                });
            }
        },

        "value not required": {
            setUp: function () {
                this.model.set("shouldRequireName", false);
            },

            "setting invalid value is allowed": function () {
                assert(this.model.set("name", void 0, { validate: true }));
            },

            "setting valid value is allowed": function () {
                assert(this.model.set("name", "valid", { validate: true }));
            }
        },

        "value required": {
            setUp: function () {
                this.model.set("shouldRequireName", true);
            },

            "setting invalid value is not allowed": function () {
                refute(this.model.set("name", void 0, { validate: true }));
            },

            "setting valid value is allowed": function () {
                assert(this.model.set("name", "valid", { validate: true }));
            }
        }
    }
});
