(function() {
  if (fabric.isLikelyNode) {
    if (process.env.launcher === 'Firefox') {
      fabric.browserShadowBlurConstant = 0.9;
    }
    if (process.env.launcher === 'Node') {
      fabric.browserShadowBlurConstant = 1;
    }
    if (process.env.launcher === 'Chrome') {
      fabric.browserShadowBlurConstant = 1.5;
    }
    if (process.env.launcher === 'Edge') {
      fabric.browserShadowBlurConstant = 1.75;
    }
  }
  else {
    if (navigator.userAgent.indexOf('Firefox') !== -1) {
      fabric.browserShadowBlurConstant = 0.9;
    }
    if (navigator.userAgent.indexOf('Chrome') !== -1) {
      fabric.browserShadowBlurConstant = 1.5;
    }
    if (navigator.userAgent.indexOf('Edge') !== -1) {
      fabric.browserShadowBlurConstant = 1.75;
    }
  }
  fabric.enableGLFiltering = false;
  fabric.isWebglSupported = false;
  fabric.Object.prototype.objectCaching = true;
  var visualTestLoop;
  if (fabric.isLikelyNode) {
    visualTestLoop = global.visualTestLoop;
  }
  else {
    visualTestLoop = window.visualTestLoop;
  }

  var tests = [];

  function freedrawing(canvas, callback) {
    // eslint-disable-next-line
    var points = [{"x":"14.940","y":"18.084"},{"x":"14.940","y":"20.076"},{"x":"14.940","y":"22.068"},{"x":"14.940","y":"25.056"},{"x":"14.940","y":"27.048"},{"x":"14.940","y":"29.040"},{"x":"14.940","y":"31.032"},{"x":"14.940","y":"33.024"},{"x":"14.940","y":"35.016"},{"x":"15.936","y":"36.012"},{"x":"17.928","y":"35.016"},{"x":"18.924","y":"34.020"},{"x":"19.920","y":"32.028"},{"x":"21.912","y":"31.032"},{"x":"22.908","y":"29.040"},{"x":"23.904","y":"27.048"},{"x":"24.900","y":"25.056"},{"x":"25.896","y":"24.060"},{"x":"26.892","y":"22.068"},{"x":"28.884","y":"23.064"},{"x":"29.880","y":"24.060"},{"x":"30.876","y":"25.056"},{"x":"32.869","y":"25.056"},{"x":"34.861","y":"25.056"},{"x":"36.853","y":"25.056"},{"x":"38.845","y":"25.056"},{"x":"40.837","y":"24.060"},{"x":"41.833","y":"23.064"},{"x":"42.829","y":"22.068"},{"x":"43.825","y":"21.072"},{"x":"44.821","y":"20.076"},{"x":"43.825","y":"24.060"},{"x":"43.825","y":"26.052"},{"x":"43.825","y":"30.036"},{"x":"43.825","y":"33.024"},{"x":"43.825","y":"35.016"},{"x":"43.825","y":"38.004"},{"x":"43.825","y":"40.992"},{"x":"43.825","y":"42.984"},{"x":"43.825","y":"44.976"},{"x":"44.821","y":"45.972"},{"x":"45.817","y":"46.968"},{"x":"47.809","y":"46.968"},{"x":"48.805","y":"45.972"},{"x":"50.797","y":"43.980"},{"x":"51.793","y":"41.988"},{"x":"52.789","y":"38.004"},{"x":"53.785","y":"37.008"},{"x":"53.785","y":"35.016"},{"x":"54.781","y":"33.024"},{"x":"54.781","y":"31.032"},{"x":"54.781","y":"33.024"},{"x":"56.773","y":"33.024"},{"x":"58.765","y":"34.020"},{"x":"60.757","y":"34.020"},{"x":"62.749","y":"34.020"},{"x":"63.745","y":"33.024"}];
    canvas.isDrawingMode = true;
    var brush = new fabric.PencilBrush(canvas);
    brush.color = 'red';
    brush.width = 2;
    canvas.freeDrawingBrush = brush;
    brush.onMouseDown(points[0]);
    for (var i = 1; i < points.length; i++) {
      points[i].x = parseFloat(points[i].x);
      points[i].y = parseFloat(points[i].y);
      brush.onMouseMove(points[i]);
    }
    brush.onMouseUp();
    canvas.renderAll();
    callback(canvas.lowerCanvasEl);
  }

  tests.push({
    test: 'Simple free drawing',
    code: freedrawing,
    golden: 'freedrawing1.png',
    newModule: 'Free Drawing',
    percentage: 0.09,
    width: 200,
    height: 200,
    fabricClass: 'Canvas'
  });

  tests.forEach(visualTestLoop(QUnit));
})();
