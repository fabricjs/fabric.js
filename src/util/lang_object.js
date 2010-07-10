function extend(destination, source) {
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