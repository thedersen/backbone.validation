// Backbone.Validation v0.6.2
//
// Copyright (c) 2011-2012 Thomas Pedersen
// Distributed under MIT License
//
// Documentation and full license available at:
// http://thedersen.com/projects/backbone-validation
(function(e){typeof exports=="object"?module.exports=e(require("backbone"),require("underscore")):typeof define=="function"&&define.amd&&define(["backbone","underscore"],e)})(function(e,t){return e.Validation=function(e){"use strict";var t={forceUpdate:!1,selector:"name",labelFormatter:"sentenceCase",valid:Function.prototype,invalid:Function.prototype},n=function(){var n=function(t){return e.reduce(e.keys(t.validation||{}),function(e,t){return e[t]=void 0,e},{})},i=function(t,n){var r=t.validation?t.validation[n]||{}:{};if(e.isFunction(r)||e.isString(r))r={fn:r};return e.isArray(r)||(r=[r]),e.reduce(r,function(t,n){return e.each(e.without(e.keys(n),"msg"),function(e){t.push({fn:u[e],val:n[e],msg:n.msg})}),t},[])},s=function(t,n,r,s){return e.reduce(i(t,n),function(e,i){var o=i.fn.call(u,r,n,i.val,t,s);return o===!1||e===!1?!1:o&&!e?i.msg||o:e},"")},o=function(t,n){var r,i,o={},u=!0,a=e.clone(n);for(i in n)r=s(t,i,n[i],a),r&&(o[i]=r,u=!1);return{invalidAttrs:o,isValid:u}},a=function(t,r){return{preValidate:function(t,n){return s(this,t,n,e.extend({},this.attributes))},isValid:function(t,n){var r;e.isString(t)&&(t=[t]),n===undefined?n=t:r=e.reduce(t,function(e,t){return e[t]=this.get(t),e},{},this);if(n===!0)return!this.validate(r);if(e.isArray(t)){for(var i=0;i<t.length;i++)if(s(this,t[i],this.get(t[i]),e.extend({},this.attributes)))return!1;return!0}return this.validation?this._isValid:!0},validate:function(i,s){var u=this,a=!i,f=e.extend({},r,s),l=e.extend(n(u),u.attributes,i),c=i||l,h=o(u,l);u._isValid=h.isValid;for(var p in l){var d=h.invalidAttrs.hasOwnProperty(p),v=c.hasOwnProperty(p);d&&(v||a)&&f.invalid(t,p,h.invalidAttrs[p],f.selector),d||f.valid(t,p,f.selector)}e.defer(function(){u.trigger("validated",u._isValid,u,h.invalidAttrs),u.trigger("validated:"+(u._isValid?"valid":"invalid"),u,h.invalidAttrs)});if(!f.forceUpdate&&e.intersection(e.keys(h.invalidAttrs),e.keys(c)).length>0)return h.invalidAttrs}}},f=function(t,n,r){e.extend(n,a(t,r))},l=function(e){delete e.validate,delete e.preValidate,delete e.isValid},c=function(e){f(this.view,e,this.options)},h=function(e){l(e)};return{version:"0.6.2",configure:function(n){e.extend(t,n)},bind:function(n,i){var s=n.model,o=n.collection;i=e.extend({},t,r,i);if(typeof s=="undefined"&&typeof o=="undefined")throw"Before you execute the binding your view must have a model or a collection.\nSee http://thedersen.com/projects/backbone-validation/#using-form-model-validation for more information.";s&&f(n,s,i),o&&(o.each(function(e){f(n,e,i)}),o.bind("add",c,{view:n,options:i}),o.bind("remove",h))},unbind:function(e){var t=e.model,n=e.collection;t&&l(e.model),n&&(n.each(function(e){l(e)}),n.unbind("add",c),n.unbind("remove",h))},mixin:a(null,t)}}(),r=n.callbacks={valid:function(e,t,n){e.$("["+n+"~="+t+"]").removeClass("invalid").removeAttr("data-error")},invalid:function(e,t,n,r){e.$("["+r+"~="+t+"]").addClass("invalid").attr("data-error",n)}},i=n.patterns={digits:/^\d+$/,number:/^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/,email:/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i,url:/^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i},s=n.messages={required:"{0} is required",acceptance:"{0} must be accepted",min:"{0} must be greater than or equal to {1}",max:"{0} must be less than or equal to {1}",range:"{0} must be between {1} and {2}",length:"{0} must be {1} characters",minLength:"{0} must be at least {1} characters",maxLength:"{0} must be at most {1} characters",rangeLength:"{0} must be between {1} and {2} characters",oneOf:"{0} must be one of: {1}",equalTo:"{0} must be the same as {1}",pattern:"{0} must be a valid {1}"},o=n.labelFormatters={none:function(e){return e},sentenceCase:function(e){return e.replace(/(?:^\w|[A-Z]|\b\w)/g,function(e,t){return t===0?e.toUpperCase():" "+e.toLowerCase()}).replace("_"," ")},label:function(e,t){return t.labels[e]||o.sentenceCase(e,t)}},u=n.validators=function(){var n=String.prototype.trim?function(e){return e===null?"":String.prototype.trim.call(e)}:function(e){var t=/^\s+/,n=/\s+$/;return e===null?"":e.toString().replace(t,"").replace(n,"")},r=function(e,n){return o[t.labelFormatter](e,n)},u=function(){var e=Array.prototype.slice.call(arguments),t=e.shift();return t.replace(/\{(\d+)\}/g,function(t,n){return typeof e[n]!="undefined"?e[n]:t})},a=function(t){return e.isNumber(t)||e.isString(t)&&t.match(i.number)},f=function(t){return!(e.isNull(t)||e.isUndefined(t)||e.isString(t)&&n(t)==="")};return{fn:function(t,n,r,i,s){return e.isString(r)&&(r=i[r]),r.call(i,t,n,s)},required:function(t,n,i,o,a){var l=e.isFunction(i)?i.call(o,t,n,a):i;if(!l&&!f(t))return!1;if(l&&!f(t))return u(s.required,r(n,o))},acceptance:function(t,n,i,o){if(t!=="true"&&(!e.isBoolean(t)||t===!1))return u(s.acceptance,r(n,o))},min:function(e,t,n,i){if(!a(e)||e<n)return u(s.min,r(t,i),n)},max:function(e,t,n,i){if(!a(e)||e>n)return u(s.max,r(t,i),n)},range:function(e,t,n,i){if(!a(e)||e<n[0]||e>n[1])return u(s.range,r(t,i),n[0],n[1])},length:function(e,t,i,o){if(!f(e)||n(e).length!==i)return u(s.length,r(t,o),i)},minLength:function(e,t,i,o){if(!f(e)||n(e).length<i)return u(s.minLength,r(t,o),i)},maxLength:function(e,t,i,o){if(!f(e)||n(e).length>i)return u(s.maxLength,r(t,o),i)},rangeLength:function(e,t,i,o){if(!f(e)||n(e).length<i[0]||n(e).length>i[1])return u(s.rangeLength,r(t,o),i[0],i[1])},oneOf:function(t,n,i,o){if(!e.include(i,t))return u(s.oneOf,r(n,o),i.join(", "))},equalTo:function(e,t,n,i,o){if(e!==o[n])return u(s.equalTo,r(t,i),r(n,i))},pattern:function(e,t,n,o){if(!f(e)||!e.toString().match(i[n]||n))return u(s.pattern,r(t,o),n)}}}();return n}(t),e.Validation});