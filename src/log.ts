(function(global) {
  var fabric = global.fabric || (global.fabric = { });
  /**
   * Wrapper around `console.log` (when available)
   * @param {*} [values] Values to log
   */
  fabric.log = console.log;

  /**
   * Wrapper around `console.warn` (when available)
   * @param {*} [values] Values to log as a warning
   */
  fabric.warn = console.warn;
})(typeof exports !== 'undefined' ? exports : window);
