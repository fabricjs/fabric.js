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

  function defaultControlsRendering(canvas, callback) {
    var rect = new fabric.Rect({
      width: 90, height: 90, strokeWidth: 2,
      fill: 'orange', stroke: 'green', top: 55, left: 55,
    });
    canvas.add(rect);
    canvas.setActiveObject(rect);
    canvas.renderAll();
    callback(canvas.lowerCanvasEl);
  }

  tests.push({
    test: 'Rect with default controls',
    code: defaultControlsRendering,
    golden: 'controls1.png',
    newModule: 'Controls rendering',
    percentage: 0.02,
    width: 200,
    height: 200,
    fabricClass: 'Canvas',
  });

  function paddingControlsRendering(canvas, callback) {
    var rect = new fabric.Rect({
      width: 90, height: 90, strokeWidth: 2, padding: 8,
      fill: 'orange', stroke: 'green', top: 55, left: 55,
    });
    canvas.add(rect);
    canvas.setActiveObject(rect);
    canvas.renderAll();
    callback(canvas.lowerCanvasEl);
  }

  tests.push({
    test: 'Rect with padding',
    code: paddingControlsRendering,
    golden: 'controls2.png',
    percentage: 0.02,
    width: 200,
    height: 200,
    fabricClass: 'Canvas',
  });

  function solidCornerRendering(canvas, callback) {
    var rect = new fabric.Rect({
      width: 90, height: 90, strokeWidth: 2, padding: 8,
      transparentCorners: false,
      fill: 'orange', stroke: 'green', top: 55, left: 55,
    });
    canvas.add(rect);
    canvas.setActiveObject(rect);
    canvas.renderAll();
    callback(canvas.lowerCanvasEl);
  }

  tests.push({
    test: 'transparent corner square',
    code: solidCornerRendering,
    golden: 'controls3.png',
    percentage: 0.02,
    width: 200,
    height: 200,
    fabricClass: 'Canvas',
  });


  function circleControls(canvas, callback) {
    var rect = new fabric.Rect({
      width: 90, height: 90, strokeWidth: 2, padding: 8,
      cornerStyle: 'circle', cornerColor: 'green',
      fill: 'orange', stroke: 'green', top: 55, left: 55,
    });
    canvas.add(rect);
    canvas.setActiveObject(rect);
    canvas.renderAll();
    callback(canvas.lowerCanvasEl);
  }

  tests.push({
    test: 'circle corners greem',
    code: circleControls,
    golden: 'controls4.png',
    percentage: 0.02,
    width: 200,
    height: 200,
    fabricClass: 'Canvas',
  });

  function solidControlsTransparent(canvas, callback) {
    var rect = new fabric.Rect({
      width: 90, height: 90, strokeWidth: 2, padding: 8,
      cornerStyle: 'circle', cornerColor: 'red', transparentCorners: false,
      fill: 'orange', stroke: 'green', top: 55, left: 55,
    });
    canvas.add(rect);
    canvas.setActiveObject(rect);
    canvas.renderAll();
    callback(canvas.lowerCanvasEl);
  }

  tests.push({
    test: 'circle corners solid red',
    code: solidControlsTransparent,
    golden: 'controls5.png',
    percentage: 0.02,
    width: 200,
    height: 200,
    fabricClass: 'Canvas',
  });

  function corneSizeRect(canvas, callback) {
    var rect = new fabric.Rect({
      width: 90, height: 90, strokeWidth: 2, padding: 4,
      cornerSize: 20, cornerColor: 'yellow', transparentCorners: false,
      fill: 'orange', stroke: 'green', top: 55, left: 55,
    });
    canvas.add(rect);
    canvas.setActiveObject(rect);
    canvas.renderAll();
    callback(canvas.lowerCanvasEl);
  }

  tests.push({
    test: 'corner size 20 rect style',
    code: corneSizeRect,
    golden: 'controls6.png',
    percentage: 0.02,
    width: 200,
    height: 200,
    fabricClass: 'Canvas',
  });

  function cornerSizeRound(canvas, callback) {
    var rect = new fabric.Rect({
      width: 90, height: 90, strokeWidth: 2, padding: 4, cornerStyle: 'circle',
      cornerSize: 20, cornerColor: 'purple', transparentCorners: false,
      fill: 'orange', stroke: 'green', top: 55, left: 55,
    });
    canvas.add(rect);
    canvas.setActiveObject(rect);
    canvas.renderAll();
    callback(canvas.lowerCanvasEl);
  }

  tests.push({
    test: 'corner size 20 rect style',
    code: cornerSizeRound,
    golden: 'controls7.png',
    percentage: 0.02,
    width: 200,
    height: 200,
    fabricClass: 'Canvas',
  });

  function controlVisibilityTest(canvas, callback) {
    var rect = new fabric.Rect({
      width: 90, height: 90, strokeWidth: 2, padding: 4,
      cornerSize: 20, cornerColor: 'blue', transparentCorners: false,
      fill: 'orange', stroke: 'green', top: 55, left: 55,
    });
    rect.setControlVisible('tl', false);
    rect.setControlVisible('br', false);
    canvas.add(rect);
    canvas.setActiveObject(rect);
    canvas.renderAll();
    callback(canvas.lowerCanvasEl);
  }

  tests.push({
    test: 'control visibility',
    code: controlVisibilityTest,
    golden: 'controls8.png',
    percentage: 0.02,
    width: 200,
    height: 200,
    fabricClass: 'Canvas',
  });

  function controlsWithFillStroke(canvas, callback) {
    var rect = new fabric.Rect({
      width: 90, height: 90, strokeWidth: 2, padding: 4,
      cornerSize: 17, cornerColor: 'green', cornerStrokeColor: 'pink',
      transparentCorners: false, cornerDashArray: [3, 3],
      fill: 'orange', stroke: 'green', top: 55, left: 55,
    });
    canvas.add(rect);
    canvas.setActiveObject(rect);
    canvas.renderAll();
    callback(canvas.lowerCanvasEl);
  }

  tests.push({
    test: 'control with fill and stroke and dash array',
    code: controlsWithFillStroke,
    golden: 'controls9.png',
    percentage: 0.02,
    width: 200,
    height: 200,
    fabricClass: 'Canvas',
  });

  function controlsWithFillStrokeborderScaleFactor(canvas, callback) {
    var rect = new fabric.Rect({
      width: 90, height: 90, strokeWidth: 2, padding: 4,
      cornerSize: 15, cornerColor: 'green', cornerStrokeColor: 'pink',
      transparentCorners: false, cornerDashArray: [3, 3], borderScaleFactor: 3,
      fill: 'red', stroke: 'blue', top: 55, left: 55,
    });
    canvas.add(rect);
    canvas.setActiveObject(rect);
    canvas.renderAll();
    callback(canvas.lowerCanvasEl);
  }

  tests.push({
    test: 'control with fill and stroke and dash array with borderScaleFactor',
    code: controlsWithFillStrokeborderScaleFactor,
    golden: 'controls10.png',
    percentage: 0.02,
    width: 200,
    height: 200,
    fabricClass: 'Canvas',
  });

  tests.forEach(visualTestLoop(QUnit));
})();
