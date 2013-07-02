buster.testCase("Multiple Views", {
    setUp: function() {
        var View1 = Backbone.View.extend({
            render: function() {
                var html = $('<input type="text" name="name" />');
                this.$el.append(html);
            }
        });
		
        var View2 = Backbone.View.extend({
            render: function() {
                var html = $('<input type="text" name="age" />');
                this.$el.append(html);
            }
        });

        var Model = Backbone.Model.extend({
            validation: {
                age: function(val) {
                    if (!val) {
                        return 'Age is invalid';
                    }
                },
                name: function(val) {
                    if (!val) {
                        return 'Name is invalid';
                    }
                }
            }
        });

        this.model = new Model();
        this.view1 = new View1({
            model: this.model
        });
		
        this.view2 = new View2({
            model: this.model
        });

        this.view1.render();
        this.view2.render();

    },
    "when binding": {
        setUp: function() {
            this.view1_valid = this.spy();
            this.view1_invalid = this.spy();
			
            this.view2_valid = this.spy();
            this.view2_invalid = this.spy();
			
            Backbone.Validation.bind(this.view1, {
                valid: this.view1_valid,
                invalid: this.view1_invalid
            });
			
            Backbone.Validation.bind(this.view2, {
                valid: this.view2_valid,
                invalid: this.view2_invalid
            });
        },
        "all valid": function() {
            this.model.clear();
			
			this.model.set({
                age: 1,
				name: "Steve"
            }, {validate: true});

            assert.called(this.view2_valid);
            assert.called(this.view1_valid);
			
			assert.equals(this.model.get('age'), 1);
			assert.equals(this.model.get('name'), "Steve");
        },
		
        "all invalid": function() {
			this.model.clear();
			
            this.model.set({
                age: 0,
				name: null
            }, {validate: true});

            assert.called(this.view2_invalid);
            assert.called(this.view1_invalid);
			
			refute.defined(this.model.get('age'));
			refute.defined(this.model.get('name'));
        },

        "age invalid": function() {
			this.model.clear();
			
            this.model.set({
                age: 0,
				name: "Steve"
            }, {validate: true});

            assert.called(this.view2_invalid);
            assert.called(this.view1_valid);
			
			refute.defined(this.model.get('age'));
			refute.defined(this.model.get('name'));
        },
		
        "name invalid": function() {
			this.model.clear();
			
            this.model.set({
                age: 1,
				name: null
            }, {validate: true});

            assert.called(this.view2_valid);
            assert.called(this.view1_invalid);
			
			refute.defined(this.model.get('age'));
			refute.defined(this.model.get('name'));
        }
    },
});