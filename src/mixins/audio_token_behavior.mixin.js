(function() {

  fabric.util.object.extend(fabric.Audio_token.prototype, /** @lends fabric.Audio_token.prototype */ {

    /**
     * Initializes all the interactive behavior of Audio_token
     */
    initBehavior: function() {
      this.initAddedHandler();
      this.initRemovedHandler();
      this.initMousedownHandler();
      this.initMouseupHandler();
    },

    onDeselect: function() {
      console.log('deselect ' + this.cacheKey);
      this.isPlaying = false;
      this.isPaused = false;
      this.selected = false;
      this.canvas.requestRenderAll();
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
    * @private
    */
    _stopEvent: function(e) {
      e.preventDefault && e.preventDefault();
      e.stopPropagation && e.stopPropagation();
    },

    _mouseDownHandler: function(options) {
      if (!this.canvas || (options.e.button && options.e.button !== 1)) {
        return;
      }
      this.__isMousedown = true;
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
    },

    /**
    * Initializes "mousedown" event handler
    */
    initMousedownHandler: function() {
      this.on('mousedown', this._mouseDownHandler);
      this.on('mousedown:before', this._mouseDownHandlerBefore);
    },

    /**
    * Initializes "mouseup" event handler
    */
    initMouseupHandler: function() {
      this.on('mouseup', this.mouseUpHandler);
    },

    initAddedHandler: function() {
      //may need to 'register' the audio URL or update some kind of bookkeeping...?
    },

    initRemovedHandler: function() {
      //may need to 'deregister' the audio URL or update some kind of bookkeeping...?
    },

    /**
    * standard hander for mouse up, overridable
    * @private
    */
    mouseUpHandler: function(options) {
      this.__isMousedown = false;
      if (this.group ||
         (options.transform && options.transform.actionPerformed) ||
         (options.e.button && options.e.button !== 1)) {
        return;
      }

      if (this.selected) {
        this.selected = false;
        if (this.isPlaying) {
          this.onPause();
        }
        else {
          this.onPlay();
        }
      }
      else {
        this.selected = true;
      }
    },
  });
})();
