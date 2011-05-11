/*! Fabric.js Copyright 2008-2011, Bitsonnet (Juriy Zaytsev, Maxim Chernyak) */

var fabric = fabric || { version: "0.2.4" };

/**
 * Wrapper around `console.log` (when available)
 * @method log
 * @param {Any} Values to log
 */
fabric.log = function() { };

/**
 * Wrapper around `console.warn` (when available)
 * @method warn
 * @param {Any} Values to log as a warning
 */
fabric.warn = function() { };

if (typeof console !== 'undefined') {
  if (typeof console.log !== 'undefined' && console.log.apply) {
    fabric.log = function() { 
      return console.log.apply(console, arguments);
    };
  }
  if (typeof console.warn !== 'undefined' && console.warn.apply) {
    fabric.warn = function() { 
      return console.warn.apply(console, arguments);
    };
  }
}

//= require "lib/json2"
//= require "lib/cufon"

//= require "src/util"
//= require "src/parser"
//= require "src/gradient"
                 
//= require "src/point.class"
//= require "src/intersection.class"

//= require "src/color.class"

//= require "src/element.class"

//= require "src/object.class"
//= require "src/line.class"
//= require "src/circle.class"
//= require "src/triangle.class"
//= require "src/ellipse.class"
//= require "src/rect.class"
//= require "src/polyline.class"
//= require "src/polygon.class"

//= require "src/path.class"
//= require "src/path_group.class"

//= require "src/group.class"

//= require "src/text.class"

//= require "src/image.class"