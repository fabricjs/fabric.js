function extend(destination, source) {
  for (var property in source) {
    destination[property] = source[property];
  }
  return destination;
}

function clone(object) {
  return extend({ }, object);
}

fabric.base.object = {
  extend: extend,
  clone: clone
};