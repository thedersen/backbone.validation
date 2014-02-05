buster.testCase("validCollection validator", {
    setUp: function() {
        var that = this;
        var ParentModel = Backbone.Model.extend({
            validation: {
                childCollection: {
                    validCollection: true
                }
            }
        });
        var ChildModel = Backbone.Model.extend({
            validation: {
                name: {
                    required: true
                }
            }
        });
        var ChildCollection = Backbone.Collection.extend({
            model: ChildModel
        });
        var childCollection = new ChildCollection([{name:''}]);

        Backbone.Validation.bind(new Backbone.View({collection: childCollection})); 
        this.model = new ParentModel({childCollection:childCollection});
        this.view = new Backbone.View({
            model: this.model
        });

        Backbone.Validation.bind(this.view, {
            valid: this.spy(),
            invalid: this.spy()
        });
    },

    "has default error message for string": function(done) {
        this.model.bind('validated:invalid', function(model, error){
            assert.equals({childCollection: 'Child collection must be a validated collection'}, error);
            done();
        });
        this.model.isValid(true);
    },
    "has valid childCollection": function() {
        this.model.get("childCollection").first().set("name", "Steve");
        assert(this.model.isValid(true));
    },
    "has valid childCollection with multiple items": function() {
        this.model.get("childCollection").first().set("name", "Steve");
        this.model.get("childCollection").add({name:"Amy"});
        this.model.get("childCollection").add({name:"John"});
        assert(this.model.isValid(true));
    },
    "has invalid childCollection": function() {
        refute(this.model.isValid(true));
    },
    "has invalid childCollection with multiple items": function() {
        this.model.get("childCollection").add({name:"Amy"});
        this.model.get("childCollection").add({name:"John"});
        refute(this.model.isValid(true));
    }
});