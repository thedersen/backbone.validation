buster.testCase("validModel validator", {
    setUp: function() {
        var that = this;
        var ParentModel = Backbone.Model.extend({
            validation: {
                childModel: {
                    validModel: true
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
        this.childModel = new ChildModel();
        this.childModel.set("name", '');
        Backbone.Validation.bind(new Backbone.View({model: this.childModel})); // childModel requires a view for validation to work
        this.model = new ParentModel({childModel:this.childModel});
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
            assert.equals({childModel: 'Child model must be a validated model'}, error);
            done();
        });
        this.model.isValid(true);
    },
    "has valid childModel": function() {
        this.model.get("childModel").set("name", "Steve");
        assert(this.model.isValid(true));
    },
    "has no childModel": function() {
        this.model.set("childModel", null);
        assert(this.model.isValid(true));
    },
    "has invalid childModel": function() {
        refute(this.model.isValid(true));
    }
});