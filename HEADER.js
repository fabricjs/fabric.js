/*! Fabric.js Copyright 2008-2012, Bitsonnet (Juriy Zaytsev, Maxim Chernyak) */

var fabric = fabric || { version: "0.7.14" };

if (typeof exports != 'undefined') {
  exports.fabric = fabric;
}

if (typeof document != 'undefined' && typeof window != 'undefined') {
  fabric.document = document;
  fabric.window = window;
}
else {
  // assume we're running under node.js when document/window are not present
  fabric.document = require("jsdom").jsdom("<!DOCTYPE html><html><head></head><body></body></html>");
  fabric.window = fabric.document.createWindow();
}

/**
 * True when in environment that supports touch events
 * @property isTouchSupported
 * @type boolean
 */
fabric.isTouchSupported = "ontouchstart" in fabric.document.documentElement;