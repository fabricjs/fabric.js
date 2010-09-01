function extend(destination, source) {
  
  // JScript DontEnum bug is not taken care of
  for (var property in source) {
    destination[property] = source[property];
  }
  return destination;
}

function clone(object) {
  return extend({ }, object);
}

fabric.util.object = {
  extend: extend,
  clone: clone
};