// Backbone.Validation v0.9.1
//
// Copyright (c) 2011-2014 Thomas Pedersen
// Distributed under MIT License
//
// Documentation and full license available at:
// http://thedersen.com/projects/backbone-validation
!function(a){"object"==typeof exports?module.exports=a(require("backbone"),require("underscore")):"function"==typeof define&&define.amd&&define(["backbone","underscore"],a)}(function(a,b){return a.Validation=function(b){"use strict";var c={forceUpdate:!1,selector:"name",labelFormatter:"sentenceCase",valid:Function.prototype,invalid:Function.prototype},d={formatLabel:function(a,b){return j[c.labelFormatter](a,b)},format:function(){var a=Array.prototype.slice.call(arguments),b=a.shift();return b.replace(/\{(\d+)\}/g,function(b,c){return"undefined"!=typeof a[c]?a[c]:b})}},e=function(c,d,f){return d=d||{},f=f||"",b.each(c,function(b,g){c.hasOwnProperty(g)&&(b&&"object"==typeof b&&!(b instanceof Array||b instanceof Date||b instanceof RegExp||b instanceof a.Model||b instanceof a.Collection)?e(b,d,f+g+"."):d[f+g]=b)}),d},f=function(){var a=function(a){return b.reduce(b.keys(b.result(a,"validation")||{}),function(a,b){return a[b]=void 0,a},{})},f=function(a,c){var d=a.validation?b.result(a,"validation")[c]||{}:{};return(b.isFunction(d)||b.isString(d))&&(d={fn:d}),b.isArray(d)||(d=[d]),b.reduce(d,function(a,c){return b.each(b.without(b.keys(c),"msg"),function(b){a.push({fn:k[b],val:c[b],msg:c.msg})}),a},[])},h=function(a,c,e,g){return b.reduce(f(a,c),function(f,h){var i=b.extend({},d,k),j=h.fn.call(i,e,c,h.val,a,g);return j===!1||f===!1?!1:j&&!f?b.result(h,"msg")||j:f},"")},i=function(a,c){var d,f={},g=!0,i=b.clone(c),j=e(c);return b.each(j,function(b,c){d=h(a,c,b,i),d&&(f[c]=d,g=!1)}),{invalidAttrs:f,isValid:g}},j=function(c,d){return{preValidate:function(a,c){var d,e=this,f={};return b.isObject(a)?(b.each(a,function(a,b){d=e.preValidate(b,a),d&&(f[b]=d)}),b.isEmpty(f)?void 0:f):h(this,a,c,b.extend({},this.attributes))},isValid:function(a){var c=e(this.attributes);return b.isString(a)?!h(this,a,c[a],b.extend({},this.attributes)):b.isArray(a)?b.reduce(a,function(a,d){return a&&!h(this,d,c[d],b.extend({},this.attributes))},!0,this):(a===!0&&this.validate(),this.validation?this._isValid:!0)},validate:function(f,g){var h=this,j=!f,k=b.extend({},d,g),l=a(h),m=b.extend({},l,h.attributes,f),n=e(f||m),o=i(h,m);return h._isValid=o.isValid,b.each(l,function(a,b){var d=o.invalidAttrs.hasOwnProperty(b);d||k.valid(c,b,k.selector)}),b.each(l,function(a,b){var d=o.invalidAttrs.hasOwnProperty(b),e=n.hasOwnProperty(b);d&&(e||j)&&k.invalid(c,b,o.invalidAttrs[b],k.selector)}),b.defer(function(){h.trigger("validated",h._isValid,h,o.invalidAttrs),h.trigger("validated:"+(h._isValid?"valid":"invalid"),h,o.invalidAttrs)}),!k.forceUpdate&&b.intersection(b.keys(o.invalidAttrs),b.keys(n)).length>0?o.invalidAttrs:void 0}}},l=function(a,c,d){b.extend(c,j(a,d))},m=function(a){delete a.validate,delete a.preValidate,delete a.isValid},n=function(a){l(this.view,a,this.options)},o=function(a){m(a)};return{version:"0.9.1",configure:function(a){b.extend(c,a)},bind:function(a,d){d=b.extend({},c,g,d);var e=d.model||a.model,f=d.collection||a.collection;if("undefined"==typeof e&&"undefined"==typeof f)throw"Before you execute the binding your view must have a model or a collection.\nSee http://thedersen.com/projects/backbone-validation/#using-form-model-validation for more information.";e?l(a,e,d):f&&(f.each(function(b){l(a,b,d)}),f.bind("add",n,{view:a,options:d}),f.bind("remove",o))},unbind:function(a,c){c=b.extend({},c);var d=c.model||a.model,e=c.collection||a.collection;d?m(d):e&&(e.each(function(a){m(a)}),e.unbind("add",n),e.unbind("remove",o))},mixin:j(null,c)}}(),g=f.callbacks={valid:function(a,b,c){a.$("["+c+'~="'+b+'"]').removeClass("invalid").removeAttr("data-error")},invalid:function(a,b,c,d){a.$("["+d+'~="'+b+'"]').addClass("invalid").attr("data-error",c)}},h=f.patterns={digits:/^\d+$/,number:/^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/,email:/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i,url:/^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i},i=f.messages={required:"{0} is required",acceptance:"{0} must be accepted",min:"{0} must be greater than or equal to {1}",max:"{0} must be less than or equal to {1}",range:"{0} must be between {1} and {2}",length:"{0} must be {1} characters",minLength:"{0} must be at least {1} characters",maxLength:"{0} must be at most {1} characters",rangeLength:"{0} must be between {1} and {2} characters",oneOf:"{0} must be one of: {1}",equalTo:"{0} must be the same as {1}",notEqualTo:"{0} must not be the same as {1}",digits:"{0} must only contain digits",number:"{0} must be a number",email:"{0} must be a valid email",url:"{0} must be a valid url",inlinePattern:"{0} is invalid"},j=f.labelFormatters={none:function(a){return a},sentenceCase:function(a){return a.replace(/(?:^\w|[A-Z]|\b\w)/g,function(a,b){return 0===b?a.toUpperCase():" "+a.toLowerCase()}).replace(/_/g," ")},label:function(a,b){return b.labels&&b.labels[a]||j.sentenceCase(a,b)}},k=f.validators=function(){var a=String.prototype.trim?function(a){return null===a?"":String.prototype.trim.call(a)}:function(a){var b=/^\s+/,c=/\s+$/;return null===a?"":a.toString().replace(b,"").replace(c,"")},c=function(a){return b.isNumber(a)||b.isString(a)&&a.match(h.number)},d=function(c){return!(b.isNull(c)||b.isUndefined(c)||b.isString(c)&&""===a(c)||b.isArray(c)&&b.isEmpty(c))};return{fn:function(a,c,d,e,f){return b.isString(d)&&(d=e[d]),d.call(e,a,c,f)},required:function(a,c,e,f,g){var h=b.isFunction(e)?e.call(f,a,c,g):e;return h||d(a)?h&&!d(a)?this.format(i.required,this.formatLabel(c,f)):void 0:!1},acceptance:function(a,c,d,e){return"true"===a||b.isBoolean(a)&&a!==!1?void 0:this.format(i.acceptance,this.formatLabel(c,e))},min:function(a,b,d,e){return!c(a)||d>a?this.format(i.min,this.formatLabel(b,e),d):void 0},max:function(a,b,d,e){return!c(a)||a>d?this.format(i.max,this.formatLabel(b,e),d):void 0},range:function(a,b,d,e){return!c(a)||a<d[0]||a>d[1]?this.format(i.range,this.formatLabel(b,e),d[0],d[1]):void 0},length:function(a,c,d,e){return b.isString(a)&&a.length===d?void 0:this.format(i.length,this.formatLabel(c,e),d)},minLength:function(a,c,d,e){return!b.isString(a)||a.length<d?this.format(i.minLength,this.formatLabel(c,e),d):void 0},maxLength:function(a,c,d,e){return!b.isString(a)||a.length>d?this.format(i.maxLength,this.formatLabel(c,e),d):void 0},rangeLength:function(a,c,d,e){return!b.isString(a)||a.length<d[0]||a.length>d[1]?this.format(i.rangeLength,this.formatLabel(c,e),d[0],d[1]):void 0},oneOf:function(a,c,d,e){return b.include(d,a)?void 0:this.format(i.oneOf,this.formatLabel(c,e),d.join(", "))},equalTo:function(a,b,c,d,e){return a!==e[c]?this.format(i.equalTo,this.formatLabel(b,d),this.formatLabel(c,d)):void 0},notEqualTo:function(a,b,c,d,e){return a===e[c]?this.format(i.notEqualTo,this.formatLabel(b,d),this.formatLabel(c,d)):void 0},pattern:function(a,b,c,e){return d(a)&&a.toString().match(h[c]||c)?void 0:this.format(i[c]||i.inlinePattern,this.formatLabel(b,e),c)}}}();return b.each(k,function(a,c){k[c]=b.bind(k[c],b.extend({},d,k))}),f}(b),a.Validation});