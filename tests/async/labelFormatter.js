buster.testCase('Backbone.Validation.Async Label formatters', {
    "Attribute names on the model can be formatted in error messages using": {
        setUp: function() {
            var Model = Backbone.Model.extend({
                validation: {
                    someAttribute: {
                        required: true
                    },
                    some_attribute: {
                        required: true
                    },
                    some_other_attribute: {
                        required: true
                    }
                },

                labels: {
                    someAttribute: 'Custom label'
                }
            });

            this.model = new Model();
            _.extend(this.model, Backbone.Validation.Async.mixin);
        },

        tearDown: function() {
            // Reset to default formatter
            Backbone.Validation.Async.configure({
                labelFormatter: 'sentenceCase'
            });
        },

        "no formatting": {
            setUp: function() {
                Backbone.Validation.Async.configure({
                    labelFormatter: 'none'
                });
            },

            "returns the attribute name": function(done){
                this.model.preValidate('someAttribute', '', done(function valid() {
                    assert(false);
                }), done(function invalid(error) {
                    assert.equals(error, 'someAttribute is required');
                }));
            }
        },

        "label formatting": {
            setUp: function() {
                Backbone.Validation.Async.configure({
                    labelFormatter: 'label'
                });
            },

            "looks up a label on the model": function(done){
                this.model.preValidate('someAttribute', '', done(function valid() {
                    assert(false);
                }), done(function invalid(error) {
                    assert.equals(error, 'Custom label is required');
                }))
            },

            "returns sentence cased name when label is not found": function(done){
                this.model.preValidate('some_attribute', '', done(function valid() {
                    assert(false);
                }), done(function invalid(error) {
                    assert.equals(error, 'Some attribute is required');
                }));
            },

            "returns sentence cased name when label attribute is not defined": function(done){
                var Model = Backbone.Model.extend({
                    validation: {
                        someAttribute: {
                            required: true
                        }
                    }
                });

                var model = new Model();
                _.extend(model, Backbone.Validation.Async.mixin);

                model.preValidate('someAttribute', '', done(function valid() {
                    assert(false);
                }), done(function invalid(error) {
                    assert.equals(error, 'Some attribute is required');
                }));
            }
        },

        "sentence formatting": {
            setUp: function() {
                Backbone.Validation.Async.configure({
                    labelFormatter: 'sentenceCase'
                });
            },

            "sentence cases camel cased attribute name": function(done){
                this.model.preValidate('someAttribute', '', done(function valid() {
                    assert(false);
                }), done(function invalid(error) {
                    assert.equals(error, 'Some attribute is required');
                }));
            },

            "sentence cases underscore named attribute name": function(done){
                this.model.preValidate('some_attribute', '', done(function valid() {
                    assert(false);
                }), done(function invalid(error) {
                    assert.equals(error, 'Some attribute is required');
                }));
            },

            "sentence cases underscore named attribute name with multiple underscores": function(done){
                this.model.preValidate('some_other_attribute', '', done(function valid() {
                    assert(false);
                }), done(function invalid(error) {
                    assert.equals(error, 'Some other attribute is required');
                }));
            }
        }
    }
});