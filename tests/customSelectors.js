buster.testCase("Overriding default id selector with class", {
    setUp: function() {
        var View = Backbone.View.extend({
            render: function() {
                var html = $('<input type="text" class="name" />');
                this.$(this.el).append(html);
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
        
        Backbone.Validation.setDefaultSelector('class');
        Backbone.Validation.bind(this.view);
    },
    
    tearDown: function() {
        Backbone.Validation.setDefaultSelector('id');
    },
    
    "looks up element by class": function() {
        this.model.set({name:''});
        
        assert(this.name.hasClass('invalid'));
    }
});