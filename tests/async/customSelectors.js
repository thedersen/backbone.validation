buster.testCase("Backbone.Validation.Async Overriding default id selector with class", {
    setUp: function() {
        var View = Backbone.View.extend({
            render: function() {
                var html = $('<input type="text" class="name" />');
                this.$el.append(html);
            }
        });

        var Model = Backbone.Model.extend({
            validation: {
                name: function(val) {
                    if (!val) {
                        return 'Name is invalid';
                    }
                }
            }
        });

        this.model = new Model();
        this.view = new View({
            model: this.model
        });

        this.view.render();
        this.name = $(this.view.$(".name"));
    },

    "globally": function() {
        Backbone.Validation.Async.configure({
            selector: 'class'
        });
        Backbone.Validation.Async.bind(this.view);

        this.model.set({name:''}, {validate: true});

        assert(this.name.hasClass('invalid'));

        Backbone.Validation.Async.configure({
            selector: 'name'
        });
    },

    "per view when binding": function() {
        Backbone.Validation.Async.bind(this.view, {
            selector: 'class'
        });
        this.model.set({name:''}, {validate: true});

        assert(this.name.hasClass('invalid'));
    }
});