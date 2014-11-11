(function() {

  /**
   * Override _setObjectScale and add Textbox specific resizing behavior. Resizing
   * a Textbox doesn't scale text, it only changes width and makes text wrap automatically.
   */
  var setObjectScaleOverridden = fabric.Canvas.prototype._setObjectScale;
  fabric.Canvas.prototype._setObjectScale = function(localMouse, transform,
    lockScalingX, lockScalingY, by, lockScalingFlip) {

    var t = transform.target;
    if (t instanceof fabric.Textbox) {
      var w = t.width * ((localMouse.x / transform.scaleX) / (t.width + t.strokeWidth));
      if (w >= t.minWidth) {
        t.set('width', w);
      }
    }
    else {
      setObjectScaleOverridden.call(fabric.Canvas.prototype, localMouse, transform,
        lockScalingX, lockScalingY, by, lockScalingFlip);
    }
  };

})();
