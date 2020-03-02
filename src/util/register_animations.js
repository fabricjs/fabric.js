(function() {

  function registerAnimation(name, options) {
    fabric.animations[name] = options;
  }

  fabric.animations = {};
  fabric.util.registerAnimation = registerAnimation;

})();
