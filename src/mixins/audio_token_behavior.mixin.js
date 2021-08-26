(function() {

  fabric.util.object.extend(fabric.Audio_token.prototype, /** @lends fabric.Audio_token.prototype */ {

    /**
     * Initializes all the interactive behavior of Audio_token
     */
    initBehavior: function() {
      this.initMousedownHandler();
    },

    onDeselect: function() {
      if (this.isPlaying || this.isPaused) {
        this.onStop();
      }
    },

    onPlay: function() {
      this.isPaused = false;
      this.isPlaying = true;
      this.canvas && this.canvas.fire('audio:play', { target: this });
      this.canvas.requestRenderAll();
    },

    onPause: function() {
      this.isPaused = true;
      this.isPlaying = false;
      this.canvas && this.canvas.fire('audio:pause', { target: this });
      this.canvas.requestRenderAll();
    },

    onStop: function() {
      this.isPaused = false;
      this.isPlaying = false;
      this.canvas && this.canvas.fire('audio:stop', { target: this });
      this.canvas.requestRenderAll();
    },

    /**
    * Default event handler for the basic functionalities needed on mousedown:before
    * can be overridden to do something different.
    * Scope of this implementation is: verify the object is already selected when mousing down
    */
    _mouseDownHandlerBefore: function(options) {
      if (!this.canvas || (options.e.button && options.e.button !== 1)) {
        return;
      }
      this.selected = this === this.canvas._activeObject;
      this.canvas.requestRenderAll();
    },

    /**
    * Initializes "mousedown" event handler
    */
    initMousedownHandler: function() {
      this.on('mousedown', this._mouseDownHandler);
      this.on('mousedown:before', this._mouseDownHandlerBefore);
    },

    playControlPressed: function() {
      if (this.isPlaying) {
        this.onPause();
      }
      else {
        this.onPlay();
      }
    },

    // for most objects, all 'controls' are the same size, for audio_tokens we need to treat them uniquely
    _setCornerCoords: function() {
      var coords = this.oCoords,
          newTheta = fabric.util.degreesToRadians(45 - this.angle),
          cosTheta = fabric.util.cos(newTheta),
          sinTheta = fabric.util.sin(newTheta),
          controlSize = this.cornerSize,
          scale = this.scaleX;

      for (var control in coords) {
        switch (control) {
          case 'deleteControl':
            controlSize = this.deleteControlSize * scale;
            break;
          case 'playControl':
            controlSize = this.playControlSize * scale;
            break;
          default:
            // 'corner' is fabrics default term for controls...because they are in the corners?
            controlSize = this.cornerSize * scale;
        }

        var cornerHypotenuse = controlSize * 0.707106,
            touchHypotenuse = controlSize * 0.707106,
            cosHalfOffset = cornerHypotenuse * cosTheta,
            sinHalfOffset = cornerHypotenuse * sinTheta,
            touchCosHalfOffset = touchHypotenuse * cosTheta,
            touchSinHalfOffset = touchHypotenuse * sinTheta,
            x = coords[control].x,
            y = coords[control].y;

        coords[control].corner = {
          tl: {
            x: x - sinHalfOffset,
            y: y - cosHalfOffset
          },
          tr: {
            x: x + cosHalfOffset,
            y: y - sinHalfOffset
          },
          bl: {
            x: x - cosHalfOffset,
            y: y + sinHalfOffset
          },
          br: {
            x: x + sinHalfOffset,
            y: y + cosHalfOffset
          }
        };
        coords[control].touchCorner = {
          tl: {
            x: x - touchSinHalfOffset,
            y: y - touchCosHalfOffset
          },
          tr: {
            x: x + touchCosHalfOffset,
            y: y - touchSinHalfOffset
          },
          bl: {
            x: x - touchCosHalfOffset,
            y: y + touchSinHalfOffset
          },
          br: {
            x: x + touchSinHalfOffset,
            y: y + touchCosHalfOffset
          }
        };
      }
    },
  });
})();
