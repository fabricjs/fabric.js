if (!Function.prototype.bind) {
  Function.prototype.bind = function(thisArg) {
    var fn = this, args = slice.call(arguments, 1);
    return args.length
      ? function() { return apply.call(fn, thisArg, args.concat(slice.call(arguments))); }
      : function() { return apply.call(fn, thisArg, arguments) };
  };
}

