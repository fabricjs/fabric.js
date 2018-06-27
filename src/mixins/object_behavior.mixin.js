(function() {

  /**
   * Override _setObjectScale and apply max and min dimensions
   */
  var setObjectScaleOverridden = fabric.Canvas.prototype._setObjectScale;

  fabric.Canvas.prototype._setObjectScale = function (localMouse, transform,
    lockScalingX, lockScalingY, by, lockScalingFlip, _dim) {

    var t = transform.target;
    if (by === 'x') {
      var tw = t._getTransformedDimensions().x;
      var w = t.width * (localMouse.x / tw);
      if (w >= t.minWidth && w <= t.maxWidth) {
        t.set('width', w);
        return true;
      }
    }
    else if (by === 'y') {
      var th = t._getTransformedDimensions().y;
      var h = t.height * (localMouse.y / th);
      if (h >= t.minHeight && h <= t.maxHeight) {
        t.set('height', h);
        return true;
      }
    }
    else if (by === 'equally') {
      var tw = t._getTransformedDimensions().x;
      var w = t.width * (localMouse.x / tw);
      var th = t._getTransformedDimensions().y;
      var h = t.height * (localMouse.y / th);
      if (w >= t.minWidth && w <= t.maxWidth && h >= t.minHeight && h <= t.maxHeight) {
        return setObjectScaleOverridden.call(fabric.Canvas.prototype, localMouse, transform,
          lockScalingX, lockScalingY, by, lockScalingFlip, _dim);
      }
    }
  };
})();
