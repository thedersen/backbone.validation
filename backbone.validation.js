Backbone.Validation = (function() {

	return {
		version: '0.0.1',
		bind: function(view) {
			view.model.validate = function(attrs) {
				for (attr in attrs) {

					var val = view.model.validation[attr];
					if (typeof val === 'function') {
						var result = val(attrs[attr]);
						if (result) {
							view.$("#" + attr).data['error'] = result;
							view.$("#" + attr).addClass("invalid");
						} else {
							view.$("#" + attr).removeClass("invalid");
						}
					}
				}
			};
		}
	};
} ());
