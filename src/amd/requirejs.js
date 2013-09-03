/* Footer for requirejs AMD support */

window.fabric = fabric;

if (typeof define === "function" && define.amd) {
  define("fabric", [], function() { return fabric });
}
