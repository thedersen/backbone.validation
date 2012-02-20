buster.testCase("required validator", {
    setUp: function() {
        var that = this;
        var Model = Backbone.Model.extend({
            validation: {
                name: {
                    required: true
                },
                agree: {
                    required: true
                },
                dependsOnName: {
                    required: function() {
                        return this.get('name') === 'name';
                    }
                }
            }
        });

        this.model = new Model();
        this.view = new Backbone.View({
            model: this.model
        });

        Backbone.Validation.bind(this.view, {
            valid: this.spy(),
            invalid: this.spy()
        });
    },

    "has default error message": function(done) {
        this.model.bind('error', function(model, error){
            assert.equals(['name is required'], error);
            done();
        });
        this.model.set({name:''});
    },

    "empty string is invalid": function() {
        refute(this.model.set({
            name: ''
        }));
    },

    "non-empty string is valid": function() {
        assert(this.model.set({
            name: 'a'
        }));
    },

    "string with just spaces is invalid": function() {
        refute(this.model.set({
            name: '  '
        }));
    },

    "null is invalid": function() {
        refute(this.model.set({
            name: null
        }));
    },

    "undefined is invalid": function() {
        refute(this.model.set({
            name: undefined
        }));
    },

    "false boolean is valid": function() {
        assert(this.model.set({
            agree: false
        }));
    },

    "true boolean is valid": function() {
        assert(this.model.set({
            agree: true
        }));
    },

    "required can be specified as a method returning true or false": function() {
        assert(this.model.set({
            dependsOnName: undefined
        }));

        this.model.set({name:'name'});

        refute(this.model.set({
            dependsOnName: undefined
        }));
    }
});