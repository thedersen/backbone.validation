buster.testCase('Binding to view with collection', {
    setUp: function() {
        var View = Backbone.View.extend({
            render: function() {
                Backbone.Validation.bind(this);
            }
        });
        this.Model = Backbone.Model.extend({
            validation: {
                name: function(val) {
                    if (!val) {
                        return 'Name is invalid';
                    }
                }
            }
        });
        var Collection = Backbone.Collection.extend({
            model: this.Model
        });
        this.collection = new Collection([{name: 'Tom'}, {name: 'Thea'}]);
        this.view = new View({
            collection: this.collection
        });

        this.view.render();
    },

    tearDown: function() {
        this.view.remove();
    },

    "binds existing models in collection when binding": function() {
        assert.defined(this.collection.at(0).validate);
        assert.defined(this.collection.at(1).validate);
    },

    "binds model that is added to the collection": function() {
        var model = new this.Model({name: 'Thomas'});
        this.collection.add(model);

        assert.defined(model.validate);
    },

    "binds models that are batch added to the collection": function() {
        var model1 = new this.Model({name: 'Thomas'});
        var model2 = new this.Model({name: 'Hans'});
        this.collection.add([model1, model2]);

        assert.defined(model1.validate);
        assert.defined(model2.validate);
    },

    "unbinds model that is removed from collection": function() {
        var model = this.collection.at(0);
        this.collection.remove(model);

        refute.defined(model.validate);
    },

    "unbinds models that are batch removed from collection": function() {
        var model1 = this.collection.at(0);
        var model2 = this.collection.at(1);
        this.collection.remove([model1, model2]);

        refute.defined(model1.validate);
        refute.defined(model2.validate);
    },

    "unbinds all models in collection when unbinding view": function() {
        Backbone.Validation.unbind(this.view);

        refute.defined(this.collection.at(0).validate);
        refute.defined(this.collection.at(1).validate);
    },

    "unbinds all collection events when unbinding view": function() {
        var that = this;
        Backbone.Validation.unbind(this.view);

        refute.exception(function() { that.collection.trigger('add'); });
        refute.exception(function() { that.collection.trigger('remove'); });
    }
});