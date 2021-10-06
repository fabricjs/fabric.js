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

    // we need an externalized way to know this so worksheet can set the mouse cursor
    // even if this is NOT the fabric canvas' _activeObject
    isPointerOverPlayControl: function(e) {
      // I dont think this is needed, but some error checking cant hurt...
      if (!e.pointer ||
          !this.oCoords.playControl ||
          !this.oCoords.playControl.touchCorner) {
        return false;
      }

      var touchArea = this._getImageLines(this.oCoords.playControl.touchCorner);
      var crossPoints = this._findCrossPoints({ x: e.pointer.x, y: e.pointer.y }, touchArea);
      if (crossPoints !== 0 && crossPoints % 2 === 1) {
        return true;
      }
      return false;
    },
  });
})();
