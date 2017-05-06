(function() {

  var noop = function() {};

  fabric.Canvas2dFilterBackend = Canvas2dFilterBackend;

  /**
   * Canvas 2D filter backend.
   */
  function Canvas2dFilterBackend() {};

  Canvas2dFilterBackend.prototype = /** @lends fabric.Canvas2dFilterBackend.prototype */ {
    evictCachesForKey: noop,
    dispose: noop,
    clearWebGLCaches: noop,

    /**
     * Apply a set of filters against a source image and draw the filtered output
     * to the provided destination canvas.
     *
     * @param {EnhancedFilter} filters The filter to apply.
     * @param {HTMLImageElement|HTMLCanvasElement} source The source to be filtered.
     * @param {Number} width The width of the source input.
     * @param {Number} height The height of the source input.
     * @param {HTMLCanvasElement} targetCanvas The destination for filtered output to be drawn.
     */
    applyFilters: function(filters, sourceElement, sourceWidth, sourceHeight, targetCanvas) {
      var ctx = targetCanvas.getContext('2d');
      ctx.drawImage(sourceElement, 0, 0, sourceWidth, sourceHeight);
      var imageData = ctx.getImageData(0, 0, sourceWidth, sourceHeight);
      var originalImageData = ctx.getImageData(0, 0, sourceWidth, sourceHeight);
      var pipelineState = {
        sourceWidth: sourceWidth,
        sourceHeight: sourceHeight,
        imageData: imageData,
        originalEl: sourceElement,
        originalImageData: originalImageData,
        canvasEl: targetCanvas,
        ctx: ctx,
      };
      filters.forEach(function(filter) { filter.applyTo(pipelineState); });
      ctx.putImageData(pipelineState.imageData, 0, 0);
    },
  };
})();
