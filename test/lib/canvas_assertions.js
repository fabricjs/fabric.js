(function(){
  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx context to test
   * @param {Function} fn Callback, invoked with `currentValue`, `previousValue` and `index`.
   *                      Breaks out of the loop if callback returns `false`.
   */
  function iterateData(ctx, fn) {
    var data = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height).data;
    for (var i = data.length; i--; ) {
      if (i > 4) {
        if (fn(data[i], data[i - 4], i) === false) break;
      }
    }
  }

  /**
   * @param {CanvasRenderingContext2D} ctx context to test
   * @param {String} color color in a hex value
   * @return {Boolean | null} `true` if all canvas pixels are of a given color, `null` if wrong color is given
   * @example `assertColor(canvas._oContextContainer, 'ff5555');`
   */
  function assertColor(ctx, color) {
    var match, r, g, b;
    if (match = String(color).match(/^#?([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})$/i)) {
      r = parseInt(match[1], 16);
      g = parseInt(match[2], 16);
      b = parseInt(match[3], 16);
    }
    else return null;
    var result = true;
    iterateData(ctx, function(currentValue, prevValue, i) {
      if ((!(i % 4) && (currentValue !== r)) ||
          (!((i-1) % 4) && (currentValue !== g)) ||
          (!((i-2) % 4) && (currentValue !== b))) {
        return (result = false);
      }
    });
    return result;
  }

  /**
   * @param {CanvasRenderingContext2D} ctx context to test
   * @return {Boolean} `true` if all canvas pixels are of the same color
   * @example `assertSameColor(canvas._oContextContainer);`
   */
  function assertSameColor(ctx) {
    debugger;
    var result = true;
    iterateData(ctx, function(currentValue, prevValue, i) {
      if (currentValue !== prevValue) {
        return (result = false);
      }
    });
    return result;
  }

  // export as global
  this.assertColor = assertColor;
  this.assertSameColor = assertSameColor;
})();
