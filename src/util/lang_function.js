(function() {
  
  var slice = Array.prototype.slice,
      apply = Function.prototype.apply;
  
  if (!Function.prototype.bind) {
    /**
     * Cross-browser approximation of ES5 Function.prototype.bind (not fully spec conforming)
     * @see <a href="https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Function/bind">Function#bind on MDN</a>
     * @param {Object} thisArg Object to bind function to
     * @param {Any[]} [...] Values to pass to a bound function
     * @return {Function}
     */
    Function.prototype.bind = function(thisArg) {
      var fn = this, args = slice.call(arguments, 1);
      return args.length
        ? function() { return apply.call(fn, thisArg, args.concat(slice.call(arguments))); }
        : function() { return apply.call(fn, thisArg, arguments) };
    };
  }
  
})();