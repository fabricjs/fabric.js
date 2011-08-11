(function (global) {
  
  "use strict";
  
  var fabric = global.fabric || (global.fabric = { }),
      slice = Array.prototype.slice,
      apply = Function.prototype.apply;
  
  /** @namespace */
  fabric.util = { };
  
  //= require "observable"
  //= require "util/misc"
  
  //= require "util/lang_array"
  //= require "util/lang_object"
  //= require "util/lang_string"
  //= require "util/lang_function"
  
  //= require "util/lang_class"
  
  //= require "util/dom_event"
  //= require "util/dom_style"
  //= require "util/dom_misc"
  
  //= require "util/dom_request"
  
})(typeof exports != 'undefined' ? exports : this);