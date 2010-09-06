if (!Function.prototype.bind) {
  Function.prototype.bind = function(thisArg) {
    var fn = this, args = slice.call(arguments, 1);
    return args.length
      ? function() { return fn.apply(thisArg, args.concat(slice.call(arguments))) };
      : function() { return fn.apply(thisArg, arguments) };
  };
}