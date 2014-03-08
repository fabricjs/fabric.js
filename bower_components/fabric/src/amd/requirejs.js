/* Footer for requirejs AMD support */

window.fabric = fabric;

// make sure exports.fabric is always defined when used as 'global' later scopes
var exports = exports || {};
exports.fabric = fabric;

if (typeof define === "function" && define.amd) {
  define([], function() { return fabric });
}
