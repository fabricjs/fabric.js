if (!Function.prototype.bind) {
  Function.prototype.bind = function(thisArg) {
    var fn = this, args = Array.prototype.slice.call(arguments, 1);
    return function() {
      return fn.apply(thisArg, args.concat(Array.prototype.slice.call(arguments)));
    };
  };
}