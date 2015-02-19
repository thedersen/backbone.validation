buster.testCase("Backbone.Validation.Async isValid", {
    "when model has not defined any validation": {
        setUp: function() {
            this.model = new Backbone.Model();

            Backbone.Validation.Async.bind(new Backbone.View({model: this.model}));
        },

        "called success": function(done) {
            this.model.isValid(null, function valid() {
                assert(true);
                done();
            });
        }
    },

    "when model has defined validation": {
        setUp: function() {
            var Model = Backbone.Model.extend({
                validation: {
                    name: {
                        required: true
                    }
                }
            });
            this.model = new Model();
            Backbone.Validation.Async.bind(new Backbone.View({model: this.model}));
        },

        "called success when model is valid": function(done) {
            this.model.set({name: 'name'}, {validate: true});
            this.model.isValid(null, function valid() {
                assert(true);
                done();
            })
        },

        "called failure when model is invalid": function(done) {
            this.model.set({name: ''}, {validate: true});
            this.model.isValid(null, done(function valid() {
                assert(false);
            }), done(function invalid() {
                assert(true);
            }));
        },

        "can force validation by passing true": function(done) {
            this.model.isValid(null, function valid() {
                assert(false);
            }, function invalid() {
                assert(false);
            });
            this.model.isValid(true, done(function valid() {
                assert(false);
            }), done(function invalid() {
                assert(true);
            }));
        },

        "invalid is triggered when model is invalid": function(done) {
            this.model.bind('invalid', function(model, attrs) {
                done();
            });
            this.model.isValid(true, function valid() {
                assert(false);
            }, function invalid() {
                assert(true);
            });
        },

        "and passing name of attribute": {
            setUp: function() {
                this.model.validation = {
                    name: {
                        required: true
                    },
                    age: {
                        required: true
                    }
                };
            },

            "called failure when attribute is invalid": function(done) {
                this.model.isValid('name', done(function valid() {
                    assert(false);
                }), done(function invalid() {
                    assert(true);
                }));
            },

            "invalid is triggered when attribute is invalid": function(done) {
                this.model.bind('invalid', function(model, attrs) {
                    done();
                });
                this.model.isValid('name', function valid() {
                    assert(false);
                }, function invalid() {
                    assert(true);
                });
            },

            "called success when attribute is valid": function(done) {
                this.model.set({name: 'name'});

                this.model.isValid('name', done(function valid() {
                    assert(true);
                }), done(function invalid() {
                    assert(false);
                }));
            }
        },

        "and passing array of attributes": {
            setUp: function() {
                this.model.validation = {
                    name: {
                        required: true
                    },
                    age: {
                        required: true
                    },
                    phone: {
                        required: true
                    }
                };
            },

            "called failure when all attributes are invalid": function(done) {
                this.model.isValid(['name', 'age'], done(function valid() {
                    assert(false);
                }), done(function invalid() {
                    assert(true);
                }));
            },

            "called failure when one attribute is invalid": function(done) {
                this.model.set({name: 'name'});

                this.model.isValid(['name', 'age'], done(function valid() {
                    assert(false);
                }), done(function invalid() {
                    assert(true);
                }));
            },

            "called success when all attributes are valid": function(done) {
                this.model.set({name: 'name', age: 1 });

                this.model.isValid(['name', 'age'], done(function valid() {
                    assert(true);
                }), done(function invalid() {
                    assert(false);
                }));
            }
        }
    }
});