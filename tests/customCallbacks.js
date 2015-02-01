buster.testCase("Overriding default callbacks in Backbone.Validation", {
    setUp: function() {
        this.originalCallbacks = {};
        _.extend(this.originalCallbacks, Backbone.Validation.callbacks);
        
        this.valid = this.spy();
        this.invalid = this.spy();

        _.extend(Backbone.Validation.callbacks, {
            valid: this.valid,
            invalid: this.invalid
        });

        var Model = Backbone.Model.extend({
            validation: {
                age: function(val) {
                    if (val === 0) {
                        return "Age is invalid";
                    }
                }
            }
        });

        this.model = new Model();

        Backbone.Validation.bind(new Backbone.View({
            model: this.model
        }));
    },

    tearDown: function(){
        _.extend(Backbone.Validation.callbacks, this.originalCallbacks);
    },

    "validate should call overridden valid callback": function() {
        this.model.set({
            age: 1
        }, {validate: true});

        assert.called(this.valid);
    },

    "validate should call overridden invalid callback": function() {
        this.model.set({
            age: 0
        }, {validate: true});

        assert.called(this.invalid);
    },

    "isValid(true) should call overridden valid callback": function() {
        this.model.set({
          age: 1
        });
        this.model.isValid(true);
        assert.called(this.valid);
    },

    "isValid(true) should call overridden invalid callback": function() {
        this.model.set({
          age: 0
        });
      this.model.isValid(true);
      assert.called(this.invalid);
    },

    "isValid([]) should call overridden valid callback": function() {
        this.model.set({
          age: 1
        });
        this.model.isValid(['age']);
        assert.called(this.valid);
    },

    "isValid([]) should call overridden invalid callback": function() {
        this.model.set({
          age: 0
        });
        this.model.isValid(['age']);
        assert.called(this.invalid);
    }

});
