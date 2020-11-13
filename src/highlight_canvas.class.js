(function() {
  /**
   * HighlightCanvas class
   * @class fabric.HighlightCanvas
   * @extends fabric.Canvas
   * @since 4.2.5
   * @tutorial {@link https://docs.google.com/document/d/1kBNWIeKwgj1_GATsXrWccClUhRgWDwyIrNJpDj30V_Y}
   * @see {@link fabric.HighlightCanvas#initialize} for constructor definition
   */
  fabric.HighlightCanvas = fabric.util.createClass(fabric.Canvas, /** @lends fabric.HighlightCanvas.prototype */ {

    /**
     * Constructor
     * @param {HTMLElement | String} el &lt;canvas> element to initialize instance on
     * @param {Object} [options] Options object
     * @return {Object} thisArg
     */
    initialize: function(el, options) {
      this.callSuper('initialize', el, options);
      this._initHighlightDrawing();
    },

    /**
     * In-memory canvas element to support highlight drawing
     * @type HTMLElement
     */
    highlightDrawingCanvasEl: null,

    /**
     * Initializes the in-memory canvas element and makes sure its on the stage
     * Calling this multiple times should not cause any problems
     * @private
     */
    _initHighlightDrawing: function() {
      var scale = this.getRetinaScaling();

      //(1) Init off-screen buffer
      if (!this.highlightDrawingCanvasEl) {
        var canvasBuffer = document.createElement('canvas');
        canvasBuffer.width  = this.width * scale;
        canvasBuffer.height = this.height * scale;
        canvasBuffer.getContext('2d').scale(scale, scale);
        this.highlightDrawingCanvasEl = canvasBuffer;
      }

      //(2) Insert Image representing buffer onto the stage
      if (this.getHighlightLayerIndex() < 0) {
        var fabricImageBuffer = new fabric.Image(this.highlightDrawingCanvasEl);
        fabricImageBuffer.selectable = false;
        fabricImageBuffer.isHighlightLayer = true;
        fabricImageBuffer.imageSmoothing = false;
        fabricImageBuffer.scale(1.0 / scale);
        this.add(fabricImageBuffer);
      }

      // (3) Hijack contextTop
      // TODO: save original top so we can revert to using that for drawing if needed
      // TODO: add a drawingModeType that controls contextTop + PencilBrush behavior
      this.contextTop = this.highlightDrawingCanvasEl.getContext('2d');
    },

    /**
     * Searches the objects on the stage for the highlight layer 
     * @return {Number} index of highlight layer or -1 if not found
     */
    getHighlightLayerIndex: function() {
      var highlightLayerIndex = -1;
      this.forEachObject(function(object, index){
        if (object.type === 'image' && object.isHighlightLayer === true) {
          if (highlightLayerIndex !== -1) {
            console.log('fabric.HighlightCanvas::getHighlightLayerIndex -> found more than 1 drawingHighlightLayer!');
            console.log('    Found ' + index + ' but we already found one at ' + highlightLayerIndex);
          }
          highlightLayerIndex = index;
        }
      });
      return highlightLayerIndex;
    },

    /**
     * Adds object to the stage right under the drawing highlight layer
     * @param {Object} object Object to insert
     * @return {Self} thisArg
     * @chainable
     */
    addHighlight: function(path) {
      var highlightLayerIndex = this.getHighlightLayerIndex();
      return this.insertAt(path, highlightLayerIndex);
    },

    /**
     * Clears all contexts (background, main, top) of an instance
     * @param {Boolean} shouldReInitHighlight determines if this action should also reinitialize the highlightLayer
     * @return {fabric.Canvas} thisArg
     * @chainable
     */
    clear: function (shouldReInitHighlight) {
        this.callSuper('clear');
        if(shouldReInitHighlight) {
            this._initHighlightDrawing();
        }
        return this;
    },


    /**
     * Override this method in order to properly size the highlight buffer
     * @private
     * @param {String} prop property (width|height)
     * @param {Number} value value to set property to
     * @return {fabric.HighlightCanvas} instance
     * @chainable true
     */
    _setBackstoreDimension: function (prop, value) {
      this.callSuper('_setBackstoreDimension', prop, value);

      if (this.highlightDrawingCanvasEl) {
        var scale = this.getRetinaScaling();

        this.highlightDrawingCanvasEl[prop] = value * scale;

        var highlightLayerIndex = this.getHighlightLayerIndex();
        var highlightImageBuffer = this.item(highlightLayerIndex)
        if (highlightImageBuffer) {
          highlightImageBuffer[prop] = value * scale;
        }
      }
      return this;
    }
  });
})();
