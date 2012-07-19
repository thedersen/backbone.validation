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
                    required: function(val, attr, computed) {
                        that.ctx = this;
                        that.attr = attr;
                        that.computed = computed;
                        return this.get('name') === 'name';
                    }
                }
            }
        });

        this.model = new Model({
            name: 'name',
            agree: true,
            dependsOnName: 'depends'
        });
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
            assert.equals({name: 'Name is required'}, error);
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
        this.model.set({name:'aaa'});

        assert(this.model.set({
            dependsOnName: undefined
        }));

        this.model.set({name:'name'});

        refute(this.model.set({
            dependsOnName: undefined
        }));
    },

    "context is the model": function() {
        this.model.set({
            dependsOnName: ''
        });
        assert.same(this.ctx, this.model);
    },

    "second argument is the name of the attribute being validated": function() {
        this.model.set({dependsOnName: ''});
        assert.equals('dependsOnName', this.attr);
    },

    "third argument is a computed model state": function() {
        this.model.set({attr: 'attr'}, {silent: true});
        this.model.set({
            name: 'name',
            dependsOnName: 'value'
        });

        assert.equals({agree:true, attr:'attr', dependsOnName:'value', name:'name'}, this.computed);
    }
});