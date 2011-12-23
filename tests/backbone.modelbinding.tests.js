buster.testCase('Works with Backbone.Modelbinding', {
    setUp: function() {
        var that = this;
        this.valid = this.spy();
        this.invalid = this.spy();

        var View = Backbone.View.extend({
            render: function() {
                var html = $('<input type="text" id="name" /><input type="submit" id="submit" data-bind="enabled isValid" />');
                this.$(this.el).append(html);

                Backbone.ModelBinding.bind(this);
                Backbone.Validation.bind(this, {
                    valid: that.valid,
                    invalid: that.invalid
                });

                return this;
            }
        });

        var Model = Backbone.Model.extend({
            validation: {
                name: {
                    required: true
                }
            }
        });

        this.model = new Model();
        this.view = new View({
            model: this.model
        });

        $('body').append(this.view.render().el);

        this.input = $(this.view.$('#name'));
        this.submit = $(this.view.$('#submit'));
    },

    tearDown: function() {
        Backbone.ModelBinding.unbind(this.view);
        this.view.remove();
    },

    "button should be disabled by default": function() {
        assert.equals(this.submit.attr('disabled'), 'disabled');
    },

    "input should not have invalid class by default": function() {
        refute(this.input.hasClass('invalid'));
    },

    "invalid input": {
        setUp: function() {
            this.input.val('');
            this.input.trigger('change');
        },

        "should call invalid": function() {
            assert.called(this.invalid);
        }
    },

    "valid input": {
        setUp: function() {
            this.input.val('hello');
            this.input.trigger('change');
        },

        "should call valid": function() {
            assert.called(this.valid);
        }
    }
});
