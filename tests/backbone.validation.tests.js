var assert = buster.assert;

buster.testCase("Backbone.Validation", {
	setUp: function() {
		var View = Backbone.View.extend({
			render: function() {
				var html = $('<input type="text" id="name" /><input type="text" id="age" />');
				this.$(this.el).append(html);

				Backbone.Validation.bind(this);
			}
		});

		var Model = Backbone.Model.extend({});

		this.model = new Model();
		this.view = new View({
			model: this.model
		});

		this.view.render();
	},

	"default behaviour": {
		setUp: function() {
			this.model.validation = {
				age: function(val) {
					if (val === 0) {
						return "Age is invalid";
					}
				}
			};

			this.el = $(this.view.$("#age"));
		},

		"setting valid value": {
			setUp: function() {
				this.model.set({
					age: 1
				});
			},

			"should not have invalid class": function() {
				assert.isFalse(this.el.hasClass('invalid'));
			},

			"should not have data property with error message": function() {
				assert.isUndefined(this.el.data('error'));
			},

			"should return the model": function() {
				assert.equals(this.model.set({
					age: 1
				}), this.model);
			}
		},

		"setting invalid value": {
			setUp: function() {
				this.model.set({
					age: 0
				});
			},

			"should have invalid class": function() {
				assert.isTrue(this.el.hasClass('invalid'));
			},

			"should have data attribute with error message": function() {
				assert.equals(this.el.data('error'), 'Age is invalid');
			},

			"should return false": function() {
				assert.isFalse(this.model.set({
					age: 0
				}));
			}
		}
	},

	"override default behaviour": {
		setUp: function() {
			this.model.validation = {
				age: function(val) {
					if (val === 0) {
						return "Age is invalid";
					}
				}
			};

			this.oldValid = Backbone.Validation.valid;
			this.oldInvalid = Backbone.Validation.invalid;
		},

		tearDown: function() {
			Backbone.Validation.valid = this.oldValid;
			Backbone.Validation.invalid = this.oldInvalid;
		},

		"should call custom valid function": function() {
			var customCalled;
			Backbone.Validation.valid = function(view, attr) {
				customCalled = true;
			};

			this.model.set({
				age: 1
			});

			assert.isTrue(customCalled);
		},

		"should call custom invalid function": function() {
			var customCalled;
			Backbone.Validation.invalid = function(view, attr, error) {
				customCalled = true;
			};

			this.model.set({
				age: 0
			});

			assert.isTrue(customCalled);
		}
	},

	"builtin validators": {
		setUp: function() {
			this.invalidSpy = this.spy(Backbone.Validation, 'invalid');
			this.validSpy = this.spy(Backbone.Validation, 'valid');
		},

		"required": {
			setUp: function() {
				this.model.validation = {
					name: {
						required: true
					}
				};
			},

            "should call valid with correct arguments when property is valid": function() {
                this.model.set({
                    name: 'valid'
                });

                assert.calledWith(this.validSpy, this.view, 'name');
            },
            
            "should call invalid with correct arguments when property is invalid": function() {
                this.model.set({
                    name: ''
                });

                assert.calledWith(this.invalidSpy, this.view, 'name', 'name is required');
            },

			"should override error msg when specified": function() {
				this.model.validation = {
					name: {
						required: true,
						msg: 'Error'
					}
				};
				this.model.set({
					name: ''
				});

				assert.calledWith(this.invalidSpy, this.view, 'name', 'Error');
			},

			"empty string should be invalid": function() {
				this.model.set({
					name: ''
				});

				assert.called(this.invalidSpy);
			},

			"blank string should be invalid": function() {
				this.model.set({
					name: '  '
				});

				assert.called(this.invalidSpy);
			},

			"null should be invalid": function() {
				this.model.set({
					name: null
				});

				assert.called(this.invalidSpy);
			},

			"undefined should be invalid": function() {
				this.model.set({
					name: undefined
				});

				assert.called(this.invalidSpy);
			}
		},
		
		"min": {
		    setUp: function() {
				this.model.validation = {
					age: {
						min: 1
					}
				};
			},
            
            "setting value lower than min should be invalid": function(){
                this.model.set({age: 0});
                
                assert.called(this.invalidSpy);
            },
                       
            "setting value equal to min should be valid": function(){
                this.model.set({age: 1});
                
                assert.called(this.validSpy);
            }
		}
	}
});
