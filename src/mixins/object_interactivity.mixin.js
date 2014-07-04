(function(){

  var degreesToRadians = fabric.util.degreesToRadians,
      isVML = typeof G_vmlCanvasManager !== 'undefined';

  fabric.util.object.extend(fabric.Object.prototype, /** @lends fabric.Object.prototype */ {

    /**
     * The object interactivity controls.
     * @private
     */
    _controlsVisibility: null,

    /**
     * Determines which corner has been clicked
     * @private
     * @param {Object} pointer The pointer indicating the mouse position
     * @return {String|Boolean} corner code (tl, tr, bl, br, etc.), or false if nothing is found
     */
    _findTargetCorner: function(pointer) {
      if (!this.hasControls || !this.active) {
        return false;
      }

      var ex = pointer.x,
          ey = pointer.y,
          xPoints,
          lines;

      for (var i in this.oCoords) {

        if (!this.isControlVisible(i)) {
          continue;
        }

        if (i === 'mtr' && !this.hasRotatingPoint) {
          continue;
        }

        if (this.get('lockUniScaling') &&
           (i === 'mt' || i === 'mr' || i === 'mb' || i === 'ml')) {
          continue;
        }

        lines = this._getImageLines(this.oCoords[i].corner);

        // debugging

        // canvas.contextTop.fillRect(lines.bottomline.d.x, lines.bottomline.d.y, 2, 2);
        // canvas.contextTop.fillRect(lines.bottomline.o.x, lines.bottomline.o.y, 2, 2);

        // canvas.contextTop.fillRect(lines.leftline.d.x, lines.leftline.d.y, 2, 2);
        // canvas.contextTop.fillRect(lines.leftline.o.x, lines.leftline.o.y, 2, 2);

        // canvas.contextTop.fillRect(lines.topline.d.x, lines.topline.d.y, 2, 2);
        // canvas.contextTop.fillRect(lines.topline.o.x, lines.topline.o.y, 2, 2);

        // canvas.contextTop.fillRect(lines.rightline.d.x, lines.rightline.d.y, 2, 2);
        // canvas.contextTop.fillRect(lines.rightline.o.x, lines.rightline.o.y, 2, 2);

        xPoints = this._findCrossPoints({ x: ex, y: ey }, lines);
        if (xPoints !== 0 && xPoints % 2 === 1) {
          this.__corner = i;
          return i;
        }
      }
      return false;
    },

    /**
     * Sets the coordinates of the draggable boxes in the corners of
     * the image used to scale/rotate it.
     * @private
     */
    _setCornerCoords: function() {
      var coords = this.oCoords,
          theta = degreesToRadians(this.angle),
          newTheta = degreesToRadians(45 - this.angle),
          cornerHypotenuse = Math.sqrt(2 * Math.pow(this.cornerSize, 2)) / 2,
          cosHalfOffset = cornerHypotenuse * Math.cos(newTheta),
          sinHalfOffset = cornerHypotenuse * Math.sin(newTheta),
          sinTh = Math.sin(theta),
          cosTh = Math.cos(theta);

      coords.tl.corner = {
        tl: {
          x: coords.tl.x - sinHalfOffset,
          y: coords.tl.y - cosHalfOffset
        },
        tr: {
          x: coords.tl.x + cosHalfOffset,
          y: coords.tl.y - sinHalfOffset
        },
        bl: {
          x: coords.tl.x - cosHalfOffset,
          y: coords.tl.y + sinHalfOffset
        },
        br: {
          x: coords.tl.x + sinHalfOffset,
          y: coords.tl.y + cosHalfOffset
        }
      };

      coords.tr.corner = {
        tl: {
          x: coords.tr.x - sinHalfOffset,
          y: coords.tr.y - cosHalfOffset
        },
        tr: {
          x: coords.tr.x + cosHalfOffset,
          y: coords.tr.y - sinHalfOffset
        },
        br: {
          x: coords.tr.x + sinHalfOffset,
          y: coords.tr.y + cosHalfOffset
        },
        bl: {
          x: coords.tr.x - cosHalfOffset,
          y: coords.tr.y + sinHalfOffset
        }
      };

      coords.bl.corner = {
        tl: {
          x: coords.bl.x - sinHalfOffset,
          y: coords.bl.y - cosHalfOffset
        },
        bl: {
          x: coords.bl.x - cosHalfOffset,
          y: coords.bl.y + sinHalfOffset
        },
        br: {
          x: coords.bl.x + sinHalfOffset,
          y: coords.bl.y + cosHalfOffset
        },
        tr: {
          x: coords.bl.x + cosHalfOffset,
          y: coords.bl.y - sinHalfOffset
        }
      };

      coords.br.corner = {
        tr: {
          x: coords.br.x + cosHalfOffset,
          y: coords.br.y - sinHalfOffset
        },
        bl: {
          x: coords.br.x - cosHalfOffset,
          y: coords.br.y + sinHalfOffset
        },
        br: {
          x: coords.br.x + sinHalfOffset,
          y: coords.br.y + cosHalfOffset
        },
        tl: {
          x: coords.br.x - sinHalfOffset,
          y: coords.br.y - cosHalfOffset
        }
      };

      coords.ml.corner = {
        tl: {
          x: coords.ml.x - sinHalfOffset,
          y: coords.ml.y - cosHalfOffset
        },
        tr: {
          x: coords.ml.x + cosHalfOffset,
          y: coords.ml.y - sinHalfOffset
        },
        bl: {
          x: coords.ml.x - cosHalfOffset,
          y: coords.ml.y + sinHalfOffset
        },
        br: {
          x: coords.ml.x + sinHalfOffset,
          y: coords.ml.y + cosHalfOffset
        }
      };

      coords.mt.corner = {
        tl: {
          x: coords.mt.x - sinHalfOffset,
          y: coords.mt.y - cosHalfOffset
        },
        tr: {
          x: coords.mt.x + cosHalfOffset,
          y: coords.mt.y - sinHalfOffset
        },
        bl: {
          x: coords.mt.x - cosHalfOffset,
          y: coords.mt.y + sinHalfOffset
        },
        br: {
          x: coords.mt.x + sinHalfOffset,
          y: coords.mt.y + cosHalfOffset
        }
      };

      coords.mr.corner = {
        tl: {
          x: coords.mr.x - sinHalfOffset,
          y: coords.mr.y - cosHalfOffset
        },
        tr: {
          x: coords.mr.x + cosHalfOffset,
          y: coords.mr.y - sinHalfOffset
        },
        bl: {
          x: coords.mr.x - cosHalfOffset,
          y: coords.mr.y + sinHalfOffset
        },
        br: {
          x: coords.mr.x + sinHalfOffset,
          y: coords.mr.y + cosHalfOffset
        }
      };

      coords.mb.corner = {
        tl: {
          x: coords.mb.x - sinHalfOffset,
          y: coords.mb.y - cosHalfOffset
        },
        tr: {
          x: coords.mb.x + cosHalfOffset,
          y: coords.mb.y - sinHalfOffset
        },
        bl: {
          x: coords.mb.x - cosHalfOffset,
          y: coords.mb.y + sinHalfOffset
        },
        br: {
          x: coords.mb.x + sinHalfOffset,
          y: coords.mb.y + cosHalfOffset
        }
      };

      coords.mtr.corner = {
        tl: {
          x: coords.mtr.x - sinHalfOffset + (sinTh * this.rotatingPointOffset),
          y: coords.mtr.y - cosHalfOffset - (cosTh * this.rotatingPointOffset)
        },
        tr: {
          x: coords.mtr.x + cosHalfOffset + (sinTh * this.rotatingPointOffset),
          y: coords.mtr.y - sinHalfOffset - (cosTh * this.rotatingPointOffset)
        },
        bl: {
          x: coords.mtr.x - cosHalfOffset + (sinTh * this.rotatingPointOffset),
          y: coords.mtr.y + sinHalfOffset - (cosTh * this.rotatingPointOffset)
        },
        br: {
          x: coords.mtr.x + sinHalfOffset + (sinTh * this.rotatingPointOffset),
          y: coords.mtr.y + cosHalfOffset - (cosTh * this.rotatingPointOffset)
        }
      };
    },
    /**
     * Draws borders of an object's bounding box.
     * Requires public properties: width, height
     * Requires public options: padding, borderColor
     * @param {CanvasRenderingContext2D} ctx Context to draw on
     * @return {fabric.Object} thisArg
     * @chainable
     */
    drawBorders: function(ctx) {
      if (!this.hasBorders) return this;

      var padding = this.padding,
          padding2 = padding * 2,
          strokeWidth = ~~(this.strokeWidth / 2) * 2; // Round down to even number

      ctx.save();

      ctx.globalAlpha = this.isMoving ? this.borderOpacityWhenMoving : 1;
      ctx.strokeStyle = this.borderColor;

      var scaleX = 1 / this._constrainScale(this.scaleX),
          scaleY = 1 / this._constrainScale(this.scaleY);

      ctx.lineWidth = 1 / this.borderScaleFactor;
      
      var vpt = this.getViewportTransform(),
          wh = fabric.util.transformPoint(new fabric.Point(this.getWidth(), this.getHeight()), vpt, true),
          sxy = fabric.util.transformPoint(new fabric.Point(scaleX, scaleY), vpt, true),
          w = wh.x,
          h = wh.y,
          sx= sxy.x,
          sy= sxy.y;
      if (this.group) {
        w = w * this.group.scaleX;
        h = h * this.group.scaleY;
      }

      ctx.strokeRect(
        ~~(-(w / 2) - padding - strokeWidth / 2 * sx) - 0.5, // offset needed to make lines look sharper
        ~~(-(h / 2) - padding - strokeWidth / 2 * sy) - 0.5,
        ~~(w + padding2 + strokeWidth * sx) + 1, // double offset needed to make lines look sharper
        ~~(h + padding2 + strokeWidth * sy) + 1
      );

      if (this.hasRotatingPoint && this.isControlVisible('mtr') && !this.get('lockRotation') && this.hasControls) {

        var rotateHeight = (
          this.flipY
            ? h + (strokeWidth * sx) + (padding * 2)
            : -h - (strokeWidth * sy) - (padding * 2)
        ) / 2;

        ctx.beginPath();
        ctx.moveTo(0, rotateHeight);
        ctx.lineTo(0, rotateHeight + (this.flipY ? this.rotatingPointOffset : -this.rotatingPointOffset));
        ctx.closePath();
        ctx.stroke();
      }

      ctx.restore();
      return this;
    },

    /**
     * Draws corners of an object's bounding box.
     * Requires public properties: width, height
     * Requires public options: cornerSize, padding
     * @param {CanvasRenderingContext2D} ctx Context to draw on
     * @return {fabric.Object} thisArg
     * @chainable
     */
    drawControls: function(ctx) {
      if (!this.hasControls) return this;

      var size = this.cornerSize,
          size2 = size / 2,
          strokeWidth2 = ~~(this.strokeWidth / 2), // half strokeWidth rounded down
          wh = fabric.util.transformPoint(new fabric.Point(this.getWidth(), this.getHeight()), this.getViewportTransform(), true),
          width = wh.x,
          height = wh.y,
          left = -(width / 2),
          top = -(height / 2),
          padding = this.padding,
          scaleOffset = size2,
          scaleOffsetSize = size2 - size,
          methodName = this.transparentCorners ? 'strokeRect' : 'fillRect';

      ctx.save();

      ctx.lineWidth = 1;

      ctx.globalAlpha = this.isMoving ? this.borderOpacityWhenMoving : 1;
      ctx.strokeStyle = ctx.fillStyle = this.cornerColor;

      // top-left
      this._drawControl('tl', ctx, methodName,
        left - scaleOffset - strokeWidth2 - padding,
        top - scaleOffset - strokeWidth2 - padding);

      // top-right
      this._drawControl('tr', ctx, methodName,
        left + width - scaleOffset + strokeWidth2 + padding,
        top - scaleOffset - strokeWidth2 - padding);

      // bottom-left
      this._drawControl('bl', ctx, methodName,
        left - scaleOffset - strokeWidth2 - padding,
        top + height + scaleOffsetSize + strokeWidth2 + padding);

      // bottom-right
      this._drawControl('br', ctx, methodName,
        left + width + scaleOffsetSize + strokeWidth2 + padding,
        top + height + scaleOffsetSize + strokeWidth2 + padding);

      if (!this.get('lockUniScaling')) {

        // middle-top
        this._drawControl('mt', ctx, methodName,
          left + width/2 - scaleOffset,
          top - scaleOffset - strokeWidth2 - padding);

        // middle-bottom
        this._drawControl('mb', ctx, methodName,
          left + width/2 - scaleOffset,
          top + height + scaleOffsetSize + strokeWidth2 + padding);

        // middle-right
        this._drawControl('mr', ctx, methodName,
          left + width + scaleOffsetSize + strokeWidth2 + padding,
          top + height/2 - scaleOffset);

        // middle-left
        this._drawControl('ml', ctx, methodName,
          left - scaleOffset - strokeWidth2 - padding,
          top + height/2 - scaleOffset);
      }

      // middle-top-rotate
      if (this.hasRotatingPoint) {
        this._drawControl('mtr', ctx, methodName,
          left + width/2 - scaleOffset,
          this.flipY
            ? (top + height + this.rotatingPointOffset - this.cornerSize/2 + strokeWidth2 + padding)
            : (top - this.rotatingPointOffset - this.cornerSize/2 - strokeWidth2 - padding));
      }

      ctx.restore();

      return this;
    },

    /**
     * @private
     */
    _drawControl: function(control, ctx, methodName, left, top) {
      var size = this.cornerSize;

      if (this.isControlVisible(control)) {
        isVML || this.transparentCorners || ctx.clearRect(left, top, size, size);
        ctx[methodName](left, top, size, size);
      }
    },

    /**
     * Returns true if the specified control is visible, false otherwise.
     * @param {String} controlName The name of the control. Possible values are 'tl', 'tr', 'br', 'bl', 'ml', 'mt', 'mr', 'mb', 'mtr'.
     * @returns {Boolean} true if the specified control is visible, false otherwise
     */
    isControlVisible: function(controlName) {
      return this._getControlsVisibility()[controlName];
    },

    /**
     * Sets the visibility of the specified control.
     * @param {String} controlName The name of the control. Possible values are 'tl', 'tr', 'br', 'bl', 'ml', 'mt', 'mr', 'mb', 'mtr'.
     * @param {Boolean} visible true to set the specified control visible, false otherwise
     * @return {fabric.Object} thisArg
     * @chainable
     */
    setControlVisible: function(controlName, visible) {
      this._getControlsVisibility()[controlName] = visible;
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
     * Returns the instance of the control visibility set for this object.
     * @private
     * @returns {Object}
     */
    _getControlsVisibility: function() {
      if (!this._controlsVisibility) {
        this._controlsVisibility = {
          tl: true,
          tr: true,
          br: true,
          bl: true,
          ml: true,
          mt: true,
          mr: true,
          mb: true,
          mtr: true
        };
      }
      return this._controlsVisibility;
    }
  });
})();
