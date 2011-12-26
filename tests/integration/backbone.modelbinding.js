buster.testCase('Integrates with Backbone.Modelbinding', {
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

    "by default button should be disabled when data binding to isValid attribute": function() {
        assert.equals(this.submit.attr('disabled'), 'disabled');
    },

    "by default input should not have invalid class": function() {
        refute(this.input.hasClass('invalid'));
    },

    "when entering invalid input": {
        setUp: function() {
            this.input.val('');
            this.input.trigger('change');
        },

        "invalid callback is called": function() {
            assert.called(this.invalid);
        }
    },

    "when entering valid input": {
        setUp: function() {
            this.input.val('hello');
            this.input.trigger('change');
        },

        "valid callback should be called": function() {
            assert.called(this.valid);
        }
    }
});
