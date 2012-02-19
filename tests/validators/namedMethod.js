buster.testCase("named method validator", {
    setUp: function() {
        var that = this;
        var Model = Backbone.Model.extend({
            validation: {
                name: {
                    fn: 'validateName'
                }
            },
            validateName: function(val, attr, computed){
                that.ctx = this;
                that.attr = attr;
                that.computed = computed;
                if(val !== 'backbone') {
                    return 'Error';
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

    "is invalid when method returns error message": function() {
        refute(this.model.set({name: ''}));
    },

    "is valid when method returns undefined": function() {
        assert(this.model.set({name: 'backbone'}));
    },

    "context is the model": function() {
        this.model.set({name: ''});
        assert.same(this.ctx, this.model);
    },

    "second argument is the name of the attribute being validated": function() {
        this.model.set({name: ''});
        assert.equals('name', this.attr);
    },

    "third argument is a computed model state": function() {
        this.model.set({attr: 'attr'}, {silent: true});
        this.model.set({
            name: 'name',
            age: 1
        });

        assert.equals({attr:'attr', name:'name', age:1}, this.computed);
    }
});

buster.testCase("named method validator short hand syntax", {
    setUp: function() {
        var that = this;
        var Model = Backbone.Model.extend({
            validation: {
                name: 'validateName'
            },
            validateName: function(val, attr, computed){
                that.ctx = this;
                that.attr = attr;
                that.computed = computed;
                if(val !== 'backbone') {
                    return 'Error';
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

    "is invalid when method returns error message": function() {
        refute(this.model.set({name: ''}));
    },

    "is valid when method returns undefined": function() {
        assert(this.model.set({name: 'backbone'}));
    },

    "context is the model": function() {
        this.model.set({name: ''});
        assert.same(this.ctx, this.model);
    },

    "second argument is the name of the attribute being validated": function() {
        this.model.set({name: ''});
        assert.equals('name', this.attr);
    },

    "third argument is a computed model state": function() {
        this.model.set({attr: 'attr'}, {silent: true});
        this.model.set({
            name: 'name',
            age: 1
        });

        assert.equals({attr:'attr', name:'name', age:1}, this.computed);
    }
});