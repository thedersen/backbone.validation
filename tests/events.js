buster.testCase("Backbone.Validation events", {
    setUp: function() {
        var Model = Backbone.Model.extend({
            validation: {
                age: function(val){
                    if(!val) {
                        return 'age';
                    }
                },
                name: function(val){
                    if(!val) {
                        return 'name';
                    }
                }
            }
        });

        this.model = new Model();
        this.view = new Backbone.View({
            model: this.model
        });

        Backbone.Validation.bind(this.view);
    },

    "model is updated before the events are raised": function() {
        this.model.bind('change', function(){
            assert.equals(1, this.model.get('age'));
        }, this);

        this.model.bind('validated', function(){
            assert.equals(1, this.model.get('age'));
        }, this);

        this.model.bind('validated:valid', function(){
            assert.equals(1, this.model.get('age'));
        }, this);

        this.model.set({
            age: 1,
            name: 'name'
        });
    },

    "when model is valid": {
        "validated event is triggered with true and model": function(done) {
            this.model.bind('validated', function(valid, model){
                assert(valid);
                assert.same(this.model, model);
                done();
            }, this);

            this.model.set({
                age: 1,
                name: 'name'
            });
        },

        "validated:valid event is triggered with model": function(done) {
            this.model.bind('validated:valid', function(model){
                assert.same(this.model, model);
                done();
            }, this);

            this.model.set({
                age: 1,
                name: 'name'
            });
        }
    },

    "when one invalid value is set": {
        "validated event is triggered with false, model, and name of attributes with error": function(done) {
            this.model.bind('validated', function(valid, model, attr){
                refute(valid);
                assert.same(this.model, model);
                assert.equals({age:'age', name:'name'}, attr);
                done();
            }, this);

            this.model.set({age:0});
        },

        "validated:invalid event is triggered with model and name of attributes with error": function(done) {
            this.model.bind('validated:invalid', function(model, attr){
                assert.same(this.model, model);
                assert.equals({age: 'age', name: 'name'}, attr);
                done();
            }, this);

            this.model.set({age:0});
        },

        "error event is triggered with model and error as an array of attribute names with error": function(done) {
            this.model.bind('error', function(model, error) {
                assert.same(this.model, model);
                assert.equals({age: 'age', name: 'name'}, error);
                done();
            }, this);

            this.model.set({age:0});
        }
    },

    "when one valid value is set": {
        "validated event is triggered with false, model, and an array with the names of the attributes with error": function(done) {
            this.model.bind('validated', function(valid, model, attrs){
                refute(valid);
                assert.same(this.model, model);
                assert.equals({name: 'name'}, attrs);
                done();
            }, this);

            this.model.set({
                age: 1
            });
        },

        "validated:invalid event is triggered with model and an array with the names of the attributes with error": function(done) {
            this.model.bind('validated:invalid', function(model, attrs){
                assert.same(this.model, model);
                assert.equals({name: 'name'}, attrs);
                done();
            }, this);

            this.model.set({
                age: 1
            }, this);
        }
    }
});