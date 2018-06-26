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
      if (w >= t.getMinWidth() && w <= t.getMaxWidth()) {
        t.set('width', w);
        return true;
      }
    }
    else if (by === 'y') {
      var th = t._getTransformedDimensions().y;
      var h = t.height * (localMouse.y / th);
      if (h >= t.getMinHeight() && h <= t.getMaxHeight()) {
        t.set('height', h);
        return true;
      }
    }
    else if (by === 'equally') {
      var tw = t._getTransformedDimensions().x;
      var w = t.width * (localMouse.x / tw);
      if (w >= t.getMinWidth() && w <= t.getMaxWidth() && h >= t.getMinHeight() && h <= t.getMaxHeight()) {
        return setObjectScaleOverridden.call(fabric.Canvas.prototype, localMouse, transform,
          lockScalingX, lockScalingY, by, lockScalingFlip, _dim);
      }
    }
  };
})();
