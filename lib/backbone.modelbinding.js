// Backbone.ModelBinding v0.3.9
//
// Copyright (C)2011 Derick Bailey, Muted Solutions, LLC
// Distributed Under MIT Liscene
//
// Documentation and Full Licence Availabe at:
// http://github.com/derickbailey/backbone.modelbinding

// ----------------------------
// Backbone.ModelBinding
// ----------------------------
Backbone.ModelBinding = (function(){
  function handleConventionBindings(view, model){
    var conventions = Backbone.ModelBinding.Conventions;
    for (var conventionName in conventions){
      if (conventions.hasOwnProperty(conventionName)){
        var conventionElement = conventions[conventionName];
        var handler = conventionElement.handler;
        var conventionSelector = conventionElement.selector;
        handler.bind(conventionSelector, view, model);
      }
    }
  }

  function handleUnbinding(view, model){
    var conventions = Backbone.ModelBinding.Conventions;
    for (var conventionName in conventions){
      if (conventions.hasOwnProperty(conventionName)){
        var conventionElement = conventions[conventionName];
        var handler = conventionElement.handler;
        var conventionSelector = conventionElement.selector;
        if (handler.unbind){
          handler.unbind(conventionSelector, view, model);
        }
      }
    }
  }

  return {
    version: "0.3.9",

    bind: function(view, options){
      Backbone.ModelBinding.Configuration.configureBindingAttributes(options);
      handleConventionBindings(view, view.model);
      Backbone.ModelBinding.Configuration.restoreBindingAttrConfig();
    },

    unbind: function(view){
      handleUnbinding(view, view.model);
    }
  }
})();

// ----------------------------
// Model Binding Configuration
// ----------------------------
Backbone.ModelBinding.Configuration = (function(){
  var bindingAttrConfig = {
	  text: "id",
	  textarea: "id",
	  password: "id",
	  radio: "name",
	  checkbox: "id",
	  select: "id"
  };

  return {
    configureBindingAttributes: function(options){
      if (options) {
        this.storeBindingAttrConfig();
        if (options.all){
          this.configureAllBindingAttributes(options.all);
          delete options.all;
        }
        _.extend(bindingAttrConfig, options);
      }
    },

    configureAllBindingAttributes: function(attribute){
      this.storeBindingAttrConfig();
      bindingAttrConfig.text = attribute;
      bindingAttrConfig.textarea = attribute;
      bindingAttrConfig.password = attribute;
      bindingAttrConfig.radio = attribute;
      bindingAttrConfig.checkbox = attribute;
      bindingAttrConfig.select = attribute;
    },

    storeBindingAttrConfig: function(){
      this._config = _.clone(bindingAttrConfig);
    },

    restoreBindingAttrConfig: function(){
      if (this._config) {
        bindingAttrConfig = this._config;
        delete this._config;
      }
    },

    getBindingAttr: function(type){ return bindingAttrConfig[type]; },

    getBindingValue: function(element, type){
      var bindingAttr = this.getBindingAttr(type);
      return element.attr(bindingAttr);
    }
  }
})();

// ----------------------------
// Text, Textarea, and Password Bi-Directional Binding Methods
// ----------------------------
Backbone.ModelBinding.StandardBinding = (function(){
  var methods = {};

  methods._getElementType = function(element) {
    var type = element[0].tagName.toLowerCase();
    if (type == "input"){
      type = element.attr("type");
      if (type == undefined || type == ''){
        type = 'text'
      }
    }
    return type;
  };

  methods._modelChange = function(changed_model, val){
    this.element.val(val);
  };

  methods.unbind = function(selector, view, model){
    view.$(selector).each(function(index){
      var element = view.$(this);
      var attribute_name = Backbone.ModelBinding.Configuration.getBindingValue(element, methods._getElementType(element));
      // unbind the model changes to the form elements
      model.unbind("change:" + attribute_name, methods._modelChange);
    });
  };

  methods.bind = function(selector, view, model){
    view.$(selector).each(function(index){
      var element = view.$(this);
      var attribute_name = Backbone.ModelBinding.Configuration.getBindingValue(element, methods._getElementType(element));
      // bind the model changes to the form elements
      // force "this" to be our config object, so i can
      // get the data that i need, during the callback.
      // i have to do it this way because the unbinding
      // that occurs a few lines above, in the "unbind" method
      // requires the same instance of the callback method as
      // was passed into the bind method here. however, i need
      // more data in the callback than i'm able to get because
      // it's a callback, limited to the model's "change" event.
      // by passing in "config" as "this" for the callback, i
      // can get all the data i need. you'll see this pattern
      // repeated through the rest of the binding objects.
      var config = {element: element};
      model.bind("change:" + attribute_name, methods._modelChange, config);

      // bind the form changes to the model
      element.bind("change", function(ev){
        var data = {};
        data[attribute_name] = view.$(ev.target).val();
        model.set(data);
      });

      // set the default value on the form, from the model
      var attr_value = model.get(attribute_name);
      if (typeof attr_value !== "undefined" && attr_value !== null) {
        element.val(attr_value);
      }
    });
  };

  return methods;
})();

// ----------------------------
// Select Box Bi-Directional Binding Methods
// ----------------------------
Backbone.ModelBinding.SelectBoxBinding = (function(){
  var methods = {};

  methods._modelChange = function(changed_model, val){
    this.element.val(val);
  };

  methods.unbind = function(selector, view, model){
    view.$(selector).each(function(index){
      var element = view.$(this);
      var attribute_name = Backbone.ModelBinding.Configuration.getBindingValue(element, 'select');
      model.unbind("change:" + attribute_name, methods._modelChange);
    });
  };

  methods.bind = function(selector, view, model){
    view.$(selector).each(function(index){
      var element = view.$(this);
      var attribute_name = Backbone.ModelBinding.Configuration.getBindingValue(element, 'select');

      // bind the model changes to the form elements
      var config = {element: element};
      model.bind("change:" + attribute_name, methods._modelChange, config);

      // bind the form changes to the model
      element.bind("change", function(ev){
        var data = {};
        var targetEl = view.$(ev.target);
        data[attribute_name] = targetEl.val();
        data[attribute_name + "_text"] = targetEl.find(":selected").text();
        model.set(data);
      });

      // set the default value on the form, from the model
      var attr_value = model.get(attribute_name);
      if (typeof attr_value !== "undefined" && attr_value !== null) {
        element.val(attr_value);
      }
    });
  };

  return methods;
})();

// ----------------------------
// Radio Button Group Bi-Directional Binding Methods
// ----------------------------
Backbone.ModelBinding.RadioGroupBinding = (function(){
  var methods = {};

  methods._modelChange = function(model, val){
    var value_selector = "input[type=radio][" + this.bindingAttr + "=" + this.group_name + "][value=" + val + "]";
    this.view.$(value_selector).attr("checked", "checked");
  };

  methods.unbind = function(selector, view, model){
    var foundElements = [];
    view.$(selector).each(function(index){
      var element = view.$(this);
      var group_name = Backbone.ModelBinding.Configuration.getBindingValue(element, 'radio');
      if (!foundElements[group_name]) {
        foundElements[group_name] = true;
        var bindingAttr = Backbone.ModelBinding.Configuration.getBindingAttr('radio');
        model.unbind("change:" + group_name, methods._modelChange);
      }
    });
  };

  methods.bind = function(selector, view, model){
    var foundElements = [];
    view.$(selector).each(function(index){
      var element = view.$(this);

      var group_name = Backbone.ModelBinding.Configuration.getBindingValue(element, 'radio');
      if (!foundElements[group_name]) {
        foundElements[group_name] = true;
        var bindingAttr = Backbone.ModelBinding.Configuration.getBindingAttr('radio');

        // bind the model changes to the form elements
        var config = {
          bindingAttr: bindingAttr,
          group_name: group_name,
          view: view
        };
        model.bind("change:" + group_name, methods._modelChange, config);

        // bind the form changes to the model
        var group_selector = "input[type=radio][" + bindingAttr + "=" + group_name + "]";
        view.$(group_selector).bind("change", function(ev){
          var element = view.$(ev.currentTarget);
          if (element.is(":checked")){
            var data = {};
            data[group_name] = element.val();
            model.set(data);
          }
        });

        // set the default value on the form, from the model
        var attr_value = model.get(group_name);
        if (typeof attr_value !== "undefined" && attr_value !== null) {
          var value_selector = "input[type=radio][" + bindingAttr + "=" + group_name + "][value=" + attr_value + "]";
          view.$(value_selector).attr("checked", "checked");
        }
      }
    });
  };

  return methods;
})();

// ----------------------------
// Checkbox Bi-Directional Binding Methods
// ----------------------------
Backbone.ModelBinding.CheckboxBinding = (function(){
  var methods = {};

  methods._modelChange = function(model, val){
    if (val){
      this.element.attr("checked", "checked");
    }
    else{
      this.element.removeAttr("checked");
    }
  };

  methods.unbind = function(selector, view, model){
    view.$(selector).each(function(index){
      var element = view.$(this);
      var attribute_name = Backbone.ModelBinding.Configuration.getBindingValue(element, 'checkbox');
      model.unbind("change:" + attribute_name, methods._modelChange);
    });
  };

  methods.bind = function(selector, view, model){
    view.$(selector).each(function(index){
      var element = view.$(this);
      var attribute_name = Backbone.ModelBinding.Configuration.getBindingValue(element, 'checkbox');

      // bind the model changes to the form elements
      var config = {element: element};
      model.bind("change:" + attribute_name, methods._modelChange, config);

      // bind the form changes to the model
      element.bind("change", function(ev){
        var data = {};
        var changedElement = view.$(ev.target);
        var checked = changedElement.is(":checked")? true : false;
        data[attribute_name] = checked;
        model.set(data);
      });

      // set the default value on the form, from the model
      var attr_exists = model.attributes.hasOwnProperty(attribute_name);
      if (attr_exists) {
        var attr_value = model.get(attribute_name);
        if (typeof attr_value !== "undefined" && attr_value !== null && attr_value != false) {
          element.attr("checked", "checked");
        }
        else{
          element.removeAttr("checked");
        }
      }
    });
  };

  return methods;
})();

// ----------------------------
// Data-Bind Binding Methods
// ----------------------------
Backbone.ModelBinding.DataBindBinding = (function(){
  var methods = {};

  var dataBindSubstConfig = {
    "default": ""
  };

  Backbone.ModelBinding.Configuration.dataBindSubst = function(config){
    this.storeDataBindSubstConfig();
    _.extend(dataBindSubstConfig, config);
  };

  Backbone.ModelBinding.Configuration.storeDataBindSubstConfig = function(){
    Backbone.ModelBinding.Configuration._dataBindSubstConfig = _.clone(dataBindSubstConfig);
  };

  Backbone.ModelBinding.Configuration.restoreDataBindSubstConfig = function(){
    if (Backbone.ModelBinding.Configuration._dataBindSubstConfig){
      dataBindSubstConfig = Backbone.ModelBinding.Configuration._dataBindSubstConfig;
      delete Backbone.ModelBinding.Configuration._dataBindSubstConfig;
    }
  };

  Backbone.ModelBinding.Configuration.getDataBindSubst = function(elementType, value){
    var returnValue = value;
    if (value === undefined){
      if (dataBindSubstConfig.hasOwnProperty(elementType)){
        returnValue = dataBindSubstConfig[elementType];
      } else {
        returnValue = dataBindSubstConfig["default"];
      }
    }
    return returnValue;
  };

  methods._modelChange = function(model, val){
    methods._setOnElement(this.element, this.elementAttr, val);
  };

  methods._setOnElement = function(element, attr, val){
    var valBefore = val;
    val = Backbone.ModelBinding.Configuration.getDataBindSubst(attr, val);
    switch(attr){
      case "html":
        element.html(val);
        break;
      case "text":
        element.text(val);
        break;
      case "enabled":
        element.attr("disabled", !val);
        break;
      case "displayed":
        element.css("display", val ? 'block' : 'none' );
        break;
      case "hidden":
        element.css("display", val ? 'none' : 'block' );
        break;
      default:
        element.attr(attr, val);
    }
  };

  methods._splitBindingAttr = function(element)
  {
    var dataBindConfigList = [];
    var databindList = element.attr("data-bind").split(";");
    _.each(databindList, function(attrbind){
      var databind = $.trim(attrbind).split(" ");

      // make the default special case "text" if none specified
      if( databind.length == 1 ) databind.unshift("text");

      dataBindConfigList.push({
        elementAttr: databind[0],
        modelAttr: databind[1]
      });
    });
    return dataBindConfigList;
  };

  methods.bind = function(selector, view, model){
    view.$(selector).each(function(index){
      var element = view.$(this);
      var databindList = methods._splitBindingAttr(element);

      _.each(databindList, function(databind){
        var config = {
          element: element,
          elementAttr: databind.elementAttr
        };
        model.bind("change:" + databind.modelAttr, methods._modelChange, config);

        // set default on data-bind element
        methods._setOnElement(element, databind.elementAttr, model.get(databind.modelAttr));
      });
    });
  };

  methods.unbind = function(selector, view, model){
    view.$(selector).each(function(index){
      var element = view.$(this);
      var databindList = methods._splitBindingAttr(element);
      _.each(databindList, function(databind){
        model.unbind("change:" + databind.modelAttr, methods._modelChange);
      });
    });
  };

  return methods;
})();


// ----------------------------
// Binding Conventions
// ----------------------------
Backbone.ModelBinding.Conventions = {
  text: {selector: "input:text", handler: Backbone.ModelBinding.StandardBinding},
  textarea: {selector: "textarea", handler: Backbone.ModelBinding.StandardBinding},
  password: {selector: "input:password", handler: Backbone.ModelBinding.StandardBinding},
  radio: {selector: "input:radio", handler: Backbone.ModelBinding.RadioGroupBinding},
  checkbox: {selector: "input:checkbox", handler: Backbone.ModelBinding.CheckboxBinding},
  select: {selector: "select", handler: Backbone.ModelBinding.SelectBoxBinding},
  databind: { selector: "*[data-bind]", handler: Backbone.ModelBinding.DataBindBinding}
};