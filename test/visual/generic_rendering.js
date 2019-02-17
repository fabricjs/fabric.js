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
  var fabricCanvas = this.canvas = new fabric.Canvas(null, {
    enableRetinaScaling: false, renderOnAddRemove: false, width: 200, height: 200,
  });

  var tests = [];

  function generic1(canvas, callback) {
    canvas.setDimensions({ width: 150, height: 60 });
    var rect = new fabric.Rect({
      width: 20, height: 40, strokeWidth: 2, scaleX: 6, scaleY: 0.5, strokeUniform: true,
      fill: '', stroke: 'red'
    });
    var rect2 = new fabric.Rect({
      width: 60, height: 60, top: 4, left: 4, strokeWidth: 2, scaleX: 2,
      scaleY: 0.5, strokeUniform: false, fill: '', stroke: 'blue',
    });
    canvas.add(rect);
    canvas.add(rect2);
    canvas.renderAll();
    callback(canvas.lowerCanvasEl);
  }

  tests.push({
    test: 'Rect with strokeUniform: true',
    code: generic1,
    golden: 'generic1.png',
    newModule: 'Generic rendering',
    percentage: 0.09,
  });

  tests.forEach(visualTestLoop(fabricCanvas, QUnit));
})();
