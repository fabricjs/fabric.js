(function(global) {
  if (typeof document !== 'undefined' && typeof window !== 'undefined') {
    // ensure globality even if entire library were function wrapped (as in Meteor.js packaging system)
    global.fabric = fabric;
  }
})(typeof exports !== 'undefined' ? exports : window);
