(function() {

  /**
   * Override _setObjectScale and add Textbox specific resizing behavior. Resizing
   * a Textbox doesn't scale text, it only changes width and makes text wrap automatically.
   */
  var setObjectScaleOverridden = fabric.Canvas.prototype._setObjectScale;

  fabric.Canvas.prototype._setObjectScale = function(localMouse, transform,
                                                     lockScalingX, lockScalingY, by, lockScalingFlip, _dim) {

    var t = transform.target;
    if (t instanceof fabric.Textbox) {
      var w = t.width * ((localMouse.x / transform.scaleX) / (t.width + t.strokeWidth));
      if (w >= t.getMinWidth()) {
        t.set('width', w);
        return true;
      }
    }
    else {
      return setObjectScaleOverridden.call(fabric.Canvas.prototype, localMouse, transform,
        lockScalingX, lockScalingY, by, lockScalingFlip, _dim);
    }
  };

  /**
   * Sets controls of this group to the Textbox's special configuration if
   * one is present in the group. Deletes _controlsVisibility otherwise, so that
   * it gets initialized to default value at runtime.
   */
  fabric.Group.prototype._refreshControlsVisibility = function() {
    if (typeof fabric.Textbox === 'undefined') {
      return;
    }
    for (var i = this._objects.length; i--;) {
      if (this._objects[i] instanceof fabric.Textbox) {
        this.setControlsVisibility(fabric.Textbox.getTextboxControlVisibility());
        return;
      }
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
