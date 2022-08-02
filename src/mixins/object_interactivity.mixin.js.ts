(function(global) {

  var fabric = global.fabric, degreesToRadians = fabric.util.degreesToRadians;

  fabric.util.object.extend(fabric.Object.prototype, /** @lends fabric.Object.prototype */ {
    /**
     * Determines which corner has been clicked
     * @private
     * @param {Object} pointer The pointer indicating the mouse position
     * @return {String|Boolean} corner code (tl, tr, bl, br, etc.), or false if nothing is found
     */
    _findTargetCorner: function(pointer, forTouch) {
      if (!this.hasControls || (!this.canvas || this.canvas._activeObject !== this)) {
        return false;
      }
      var xPoints,
          lines, keys = Object.keys(this.oCoords),
          j = keys.length - 1, i;
      this.__corner = 0;

      // cycle in reverse order so we pick first the one on top
      for (; j >= 0; j--) {
        i = keys[j];
        if (!this.isControlVisible(i)) {
          continue;
        }

        lines = this._getImageLines(forTouch ? this.oCoords[i].touchCorner : this.oCoords[i].corner);
        // // debugging
        //
        // this.canvas.contextTop.fillRect(lines.bottomline.d.x, lines.bottomline.d.y, 2, 2);
        // this.canvas.contextTop.fillRect(lines.bottomline.o.x, lines.bottomline.o.y, 2, 2);
        //
        // this.canvas.contextTop.fillRect(lines.leftline.d.x, lines.leftline.d.y, 2, 2);
        // this.canvas.contextTop.fillRect(lines.leftline.o.x, lines.leftline.o.y, 2, 2);
        //
        // this.canvas.contextTop.fillRect(lines.topline.d.x, lines.topline.d.y, 2, 2);
        // this.canvas.contextTop.fillRect(lines.topline.o.x, lines.topline.o.y, 2, 2);
        //
        // this.canvas.contextTop.fillRect(lines.rightline.d.x, lines.rightline.d.y, 2, 2);
        // this.canvas.contextTop.fillRect(lines.rightline.o.x, lines.rightline.o.y, 2, 2);

        xPoints = this._findCrossPoints(pointer, lines);
        if (xPoints !== 0 && xPoints % 2 === 1) {
          this.__corner = i;
          return i;
        }
      }
      return false;
    },

    /**
     * Calls a function for each control. The function gets called,
     * with the control, the object that is calling the iterator and the control's key
     * @param {Function} fn function to iterate over the controls over
     */
    forEachControl: function(fn) {
      for (var i in this.controls) {
        fn(this.controls[i], i, this);
      };
    },

    /**
     * Sets the coordinates of the draggable boxes in the corners of
     * the image used to scale/rotate it.
     * note: if we would switch to ROUND corner area, all of this would disappear.
     * everything would resolve to a single point and a pythagorean theorem for the distance
     * @private
     */
    _setCornerCoords: function() {
      var coords = this.oCoords;

      for (var control in coords) {
        var controlObject = this.controls[control];
        coords[control].corner = controlObject.calcCornerCoords(
          this.angle, this.cornerSize, coords[control].x, coords[control].y, false);
        coords[control].touchCorner = controlObject.calcCornerCoords(
          this.angle, this.touchCornerSize, coords[control].x, coords[control].y, true);
      }
    },

    /**
     * Draws a colored layer behind the object, inside its selection borders.
     * Requires public options: padding, selectionBackgroundColor
     * this function is called when the context is transformed
     * has checks to be skipped when the object is on a staticCanvas
     * @param {CanvasRenderingContext2D} ctx Context to draw on
     * @return {fabric.Object} thisArg
     * @chainable
     */
    drawSelectionBackground: function(ctx) {
      if (!this.selectionBackgroundColor ||
        (this.canvas && !this.canvas.interactive) ||
        (this.canvas && this.canvas._activeObject !== this)
      ) {
        return this;
      }
      ctx.save();
      var center = this.getRelativeCenterPoint(), wh = this._calculateCurrentDimensions(),
          vpt = this.canvas.viewportTransform;
      ctx.translate(center.x, center.y);
      ctx.scale(1 / vpt[0], 1 / vpt[3]);
      ctx.rotate(degreesToRadians(this.angle));
      ctx.fillStyle = this.selectionBackgroundColor;
      ctx.fillRect(-wh.x / 2, -wh.y / 2, wh.x, wh.y);
      ctx.restore();
      return this;
    },

    /**
     * @public override this function in order to customize the drawing of the control box, e.g. rounded corners, different border style.
     * @param {CanvasRenderingContext2D} ctx ctx is rotated and translated so that (0,0) is at object's center
     * @param {fabric.Point} size the control box size used
     */
    strokeBorders: function (ctx, size) {
      ctx.strokeRect(
        -size.x / 2,
        -size.y / 2,
        size.x,
        size.y
      );
    },

    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to draw on
     * @param {fabric.Point} size
     * @param {Object} styleOverride object to override the object style
     */
    _drawBorders: function (ctx, size, styleOverride) {
      var options = Object.assign({
        hasControls: this.hasControls,
        borderColor: this.borderColor,
        borderDashArray: this.borderDashArray
      }, styleOverride || {});
      ctx.save();
      ctx.strokeStyle = options.borderColor;
      this._setLineDash(ctx, options.borderDashArray);
      this.strokeBorders(ctx, size);
      options.hasControls && this.drawControlsConnectingLines(ctx, size);
      ctx.restore();
    },

    /**
     * Draws borders of an object's bounding box.
     * Requires public properties: width, height
     * Requires public options: padding, borderColor
     * @param {CanvasRenderingContext2D} ctx Context to draw on
     * @param {object} options object representing current object parameters
     * @param {Object} [styleOverride] object to override the object style
     * @return {fabric.Object} thisArg
     * @chainable
     */
    drawBorders: function (ctx, options, styleOverride) {
      var size;
      if ((styleOverride && styleOverride.forActiveSelection) || this.group) {
        var bbox = fabric.util.sizeAfterTransform(this.width, this.height, options),
            strokeFactor = this.strokeUniform ?
              new fabric.Point(0, 0).scalarAddEquals(this.canvas.getZoom()) :
              new fabric.Point(options.scaleX, options.scaleY),
            stroke = strokeFactor.scalarMultiplyEquals(this.strokeWidth);
        size = bbox.addEquals(stroke).scalarAddEquals(this.borderScaleFactor);
      }
      else {
        size = this._calculateCurrentDimensions().scalarAddEquals(this.borderScaleFactor);
      }
      this._drawBorders(ctx, size, styleOverride);
      return this;
    },

    /**
     * Draws lines from a borders of an object's bounding box to controls that have `withConnection` property set.
     * Requires public properties: width, height
     * Requires public options: padding, borderColor
     * @param {CanvasRenderingContext2D} ctx Context to draw on
     * @param {number} width object final width
     * @param {number} height object final height
     * @return {fabric.Object} thisArg
     * @chainable
     */
    drawControlsConnectingLines: function (ctx, size) {
      var shouldStroke = false;

      ctx.beginPath();
      this.forEachControl(function (control, key, fabricObject) {
        // in this moment, the ctx is centered on the object.
        // width and height of the above function are the size of the bbox.
        if (control.withConnection && control.getVisibility(fabricObject, key)) {
          // reset movement for each control
          shouldStroke = true;
          ctx.moveTo(control.x * size.x, control.y * size.y);
          ctx.lineTo(
            control.x * size.x + control.offsetX,
            control.y * size.y + control.offsetY
          );
        }
      });
      shouldStroke && ctx.stroke();

      return this;
    },

    /**
     * Draws corners of an object's bounding box.
     * Requires public properties: width, height
     * Requires public options: cornerSize, padding
     * @param {CanvasRenderingContext2D} ctx Context to draw on
     * @param {Object} styleOverride object to override the object style
     * @return {fabric.Object} thisArg
     * @chainable
     */
    drawControls: function(ctx, styleOverride) {
      styleOverride = styleOverride || {};
      ctx.save();
      var retinaScaling = this.canvas.getRetinaScaling(), p;
      ctx.setTransform(retinaScaling, 0, 0, retinaScaling, 0, 0);
      ctx.strokeStyle = ctx.fillStyle = styleOverride.cornerColor || this.cornerColor;
      if (!this.transparentCorners) {
        ctx.strokeStyle = styleOverride.cornerStrokeColor || this.cornerStrokeColor;
      }
      this._setLineDash(ctx, styleOverride.cornerDashArray || this.cornerDashArray);
      this.setCoords();
      this.forEachControl(function(control, key, fabricObject) {
        if (control.getVisibility(fabricObject, key)) {
          p = fabricObject.oCoords[key];
          control.render(ctx, p.x, p.y, styleOverride, fabricObject);
        }
      });
      ctx.restore();

      return this;
    },

    /**
     * Returns true if the specified control is visible, false otherwise.
     * @param {String} controlKey The key of the control. Possible values are 'tl', 'tr', 'br', 'bl', 'ml', 'mt', 'mr', 'mb', 'mtr'.
     * @returns {Boolean} true if the specified control is visible, false otherwise
     */
    isControlVisible: function(controlKey) {
      return this.controls[controlKey] && this.controls[controlKey].getVisibility(this, controlKey);
    },

    /**
     * Sets the visibility of the specified control.
     * @param {String} controlKey The key of the control. Possible values are 'tl', 'tr', 'br', 'bl', 'ml', 'mt', 'mr', 'mb', 'mtr'.
     * @param {Boolean} visible true to set the specified control visible, false otherwise
     * @return {fabric.Object} thisArg
     * @chainable
     */
    setControlVisible: function(controlKey, visible) {
      if (!this._controlsVisibility) {
        this._controlsVisibility = {};
      }
      this._controlsVisibility[controlKey] = visible;
      return this;
    },

    /**
     * Sets the visibility state of object controls.
     * @param {Object} [options] Options object
     * @param {Boolean} [options.bl] true to enable the bottom-left control, false to disable it
     * @param {Boolean} [options.br] true to enable the bottom-right control, false to disable it
     * @param {Boolean} [options.mb] true to enable the middle-bottom control, false to disable it
     * @param {Boolean} [options.ml] true to enable the middle-left control, false to disable it
     * @param {Boolean} [options.mr] true to enable the middle-right control, false to disable it
     * @param {Boolean} [options.mt] true to enable the middle-top control, false to disable it
     * @param {Boolean} [options.tl] true to enable the top-left control, false to disable it
     * @param {Boolean} [options.tr] true to enable the top-right control, false to disable it
     * @param {Boolean} [options.mtr] true to enable the middle-top-rotate control, false to disable it
     * @return {fabric.Object} thisArg
     * @chainable
     */
    setControlsVisibility: function(options) {
      options || (options = { });

      for (var p in options) {
        this.setControlVisible(p, options[p]);
      }
      return this;
    },

    /**
     * Clears the canvas.contextTop in a specific area that corresponds to the object's bounding box
     * that is in the canvas.contextContainer.
     * This function is used to clear pieces of contextTop where we render ephemeral effects on top of the object.
     * Example: blinking cursror text selection, drag effects.
     * // TODO: discuss swapping restoreManually with a renderCallback, but think of async issues
     * @param {Boolean} [restoreManually] When true won't restore the context after clear, in order to draw something else.
     * @return {CanvasRenderingContext2D|undefined} canvas.contextTop that is either still transformed
     * with the object transformMatrix, or restored to neutral transform
     */
    clearContextTop: function(restoreManually) {
      if (!this.canvas || !this.canvas.contextTop) {
        return;
      }
      var ctx = this.canvas.contextTop, v = this.canvas.viewportTransform;
      if (!ctx) {
        return;
      }
      ctx.save();
      ctx.transform(v[0], v[1], v[2], v[3], v[4], v[5]);
      this.transform(ctx);
      // we add 4 pixel, to be sure to do not leave any pixel out
      var width = this.width + 4, height = this.height + 4;
      ctx.clearRect(-width / 2, -height / 2, width, height);

      restoreManually || ctx.restore();
      return ctx;
    },

    /**
     * This callback function is called every time _discardActiveObject or _setActiveObject
     * try to to deselect this object. If the function returns true, the process is cancelled
     * @param {Object} [options] options sent from the upper functions
     * @param {Event} [options.e] event if the process is generated by an event
     */
    onDeselect: function() {
      // implemented by sub-classes, as needed.
    },


    /**
     * This callback function is called every time _discardActiveObject or _setActiveObject
     * try to to select this object. If the function returns true, the process is cancelled
     * @param {Object} [options] options sent from the upper functions
     * @param {Event} [options.e] event if the process is generated by an event
     */
    onSelect: function() {
      // implemented by sub-classes, as needed.
    },

    /**
     * Override to customize drag and drop behavior
     * @public
     * @param {DragEvent} e
     * @returns {boolean}
     */
    canDrop: function (/* e */) {
      return false;
    },

    renderDragSourceEffect: function() {
      // for subclasses
    },

    renderDropTargetEffect: function(/* e */) {
      // for subclasses
    },

  });
})(typeof exports !== 'undefined' ? exports : window);
