Backbone.Validation = (function() {
    var validators = {
        required: function(val) {
            if(!val){
                return "Required";
            }
        }
    };

	return {
		version: '0.0.1',
		bind: function(view) {
			view.model.validate = function(attrs) {
				for (attr in attrs) {

					var val = view.model.validation[attr];
					var result;
					if (typeof val === 'function') {
						result = val(attrs[attr]);	
					} else {
					    result = validators['required'](attrs[attr]);
					}
					
					if (result) {
						view.$("#" + attr).data['error'] = result;
						view.$("#" + attr).addClass("invalid");
					} else {
						view.$("#" + attr).removeClass("invalid");
					}
				}
			};
		}
	};
} ());
