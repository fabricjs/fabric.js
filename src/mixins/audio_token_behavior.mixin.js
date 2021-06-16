(function() {

  fabric.util.object.extend(fabric.Audio_token.prototype, /** @lends fabric.Audio_token.prototype */ {

    /**
     * Initializes all the interactive behavior of Audio_token
     */
    initBehavior: function() {
      this.initAddedHandler();
      this.initRemovedHandler();
      this.initMousedownHandler();
    },

    onDeselect: function() {
      if (this.isPlaying || this.isPaused) {
        this.onStop();
      }
      console.log('deselect ' + this.cacheKey);
    },

    onPlay: function() {
      console.log('playing ' + this.cacheKey);
      this.isPaused = false;
      this.isPlaying = true;
      this.canvas.requestRenderAll();
    },

    onPause: function() {
      console.log('paused ' + this.cacheKey);
      this.isPaused = true;
      this.isPlaying = false;
      this.canvas.requestRenderAll();
    },

    onStop: function() {
      console.log('stopped ' + this.cacheKey);
      this.isPaused = false;
      this.isPlaying = false;
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

    initAddedHandler: function() {
      //may need to 'register' the audio URL or update some kind of bookkeeping...?
    },

    initRemovedHandler: function() {
      //may need to 'deregister' the audio URL or update some kind of bookkeeping...?
    },

    playControlPressed: function(e) {
      // may need e if we want to avoid play on right click or treat iPads special.
      if (this.isPlaying) {
        this.onPause();
      }
      else {
        this.onPlay();
      }
    },
  });
})();
