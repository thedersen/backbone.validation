buster.testCase("Backbone.Validation events", {
    setUp: function() {
        var Model = Backbone.Model.extend({
            validation: {
                age: function(val){
                    if(!val) return 'age';
                },
                name: function(val){
                    if(!val) return 'name';
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
        "validated event is triggered with true": function(done) {
            this.model.bind('validated', function(valid){
                assert(valid);
                done();
            });

            this.model.set({
                age: 1,
                name: 'name'
            });
        },

        "validated:valid event is triggered": function(done) {
            this.model.bind('validated:valid', function(){
                assert(true);
                done();
            });

            this.model.set({
                age: 1,
                name: 'name'
            });
        }        
    },

    "when model is invalid": {
        "validated event is triggered with false": function(done) {
            this.model.bind('validated', function(valid){
                refute(valid);
                done();
            });

            this.model.set({age:0});
        },

        "validated:invalid event is triggered": function(done) {
            this.model.bind('validated:invalid', function(){
                assert(true);
                done();
            });

            this.model.set({age:0});
        },

        "error event is triggered with error as a string when one invalid value was set": function(done) {
            this.model.bind('error', function(model, error) {
                assert.equals('age', error);
                done();
            });

            this.model.set({age:0});
        },
        
        "error event is triggered with error as an array when two invalid values was set": function(done) {
            this.model.bind('error', function(model, error) {
                assert.equals(['age', 'name'], error);
                done();
            });

            this.model.set({
                age: 0,
                name: ''
            });
        }
    }
});