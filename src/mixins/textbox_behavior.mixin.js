(function() {

  /**
   * Override _setObjectScale and add Textbox specific resizing behavior. Resizing
   * a Textbox doesn't scale text, it only changes width and makes text wrap automatically.
   */
  var setObjectScaleOverridden = fabric.Canvas.prototype._setObjectScale;

  fabric.Canvas.prototype._setObjectScale = function(localMouse, transform,
    lockScalingX, lockScalingY, by, lockScalingFlip, _dim) {

    var t = transform.target, scaled,
        scaleX = localMouse.x * t.scaleX / _dim.x,
        scaleY = localMouse.y * t.scaleY / _dim.y;
    if (by === 'x' && t instanceof fabric.Textbox) {
      var tw = t._getTransformedDimensions().x;
      var w = t.width * (localMouse.x / tw);
      transform.newScaleX = scaleX;
      transform.newScaleY = scaleY;
      if (w >= t.getMinWidth()) {
        scaled = w !== t.width;
        t.set('width', w);
        return scaled;
      }
    }
    else {
      return setObjectScaleOverridden.call(fabric.Canvas.prototype, localMouse, transform,
        lockScalingX, lockScalingY, by, lockScalingFlip, _dim);
    }
  };

  fabric.util.object.extend(fabric.Textbox.prototype, /** @lends fabric.IText.prototype */ {
    /**
     * @private
     */
    _removeExtraneousStyles: function() {
      for (var prop in this._styleMap) {
        if (!this._textLines[prop]) {
          delete this.styles[this._styleMap[prop].line];
        }
      }
    },

  });
})();
