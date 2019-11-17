(function() {
  var getFixture;
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
    getFixture = global.getFixture;
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
    getFixture = window.getFixture;
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

  function generic1(canvas, callback) {
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
    width: 150,
    height: 60,
  });

  function shadownonscaling(canvas, callback) {
    var obj = new fabric.Rect();
    obj.set({
      width: 10, height: 10, scaleX: 12, scaleY: 3, top: 10, left: 5, fill: '#f55',
    });
    obj.setShadow({
      color: 'rgba(0,100,0,0.9)', blur: 5, offsetX: 8, offsetY: 8, nonScaling: true
    });
    canvas.add(obj);
    canvas.renderAll();
    callback(canvas.lowerCanvasEl);
  }

  tests.push({
    test: 'Rect DropShadow with nonScaling: true',
    code: shadownonscaling,
    golden: 'shadownonscaling.png',
    percentage: 0.09,
    width: 150,
    height: 60,
  });

  function polygonWithStroke(canvas, callback) {
    canvas.set({backgroundColor: '#AAAA77'});
    var p1 = new fabric.Polygon([
      {x: 0, y: 216},
      {x: 125, y: 433},
      {x: 375, y: 433},
      {x: 500, y: 216},
      {x: 375, y: 0},
      {x: 125, y: 0}
    ],
    {
      fill: 'white'
    });
    canvas.add(p1);
    var p2 = new fabric.Polygon([
      {x: 0, y: 216},
      {x: 125, y: 433},
      {x: 375, y: 433},
      {x: 500, y: 216},
      {x: 375, y: 0},
      {x: 125, y: 0}
    ],
    {
      fill: 'transparent',
      stroke: '#00AAFFAA',
      strokeWidth: 15,
      originX: 'center',
      originY: 'center'
    });
    canvas.add(p2);
    canvas.setZoom(0.4);
    canvas.renderAll();
    callback(canvas.lowerCanvasEl);
  }

  tests.push({
    test: 'polygon postion independently from strokeWidth and origin',
    code: polygonWithStroke,
    golden: 'polygonWithStroke.png',
    percentage: 0.09,
    width: 210,
    height: 210,
  });

  function backgroundWithGradient(canvas, callback) {
    var g = new fabric.Gradient({
      type: 'linear',
      gradientTransform: [0.4 , -0.4, 0.2, 0.1, 3, 5],
      coords: {
        x1: 0,
        y1: 0,
        x2: 200,
        y2: 0
      },
      colorStops: [{
        offset: 0,
        color: 'green'
      },
      {
        offset: 0.5,
        color: 'white'
      },
      {
        offset: 1,
        color: 'blue'
      }]
    });
    canvas.set({ backgroundColor: g });
    canvas.renderAll();
    callback(canvas.lowerCanvasEl);
  }

  tests.push({
    test: 'canvas can have a gradient background',
    code: backgroundWithGradient,
    golden: 'backgroundWithGradient.png',
    percentage: 0.09,
    width: 300,
    height: 300,
  });

  function backgroundWithGradientZoom(canvas, callback) {
    canvas.setZoom(0.1);
    var g = new fabric.Gradient({
      type: 'linear',
      gradientTransform: [0.4 , -0.4, 0.2, 0.1, 3, 5],
      coords: {
        x1: 0,
        y1: 0,
        x2: 300,
        y2: 0
      },
      colorStops: [{
        offset: 0,
        color: 'green'
      },
      {
        offset: 0.5,
        color: 'white'
      },
      {
        offset: 1,
        color: 'blue'
      }]
    });
    canvas.set({ backgroundColor: g });
    canvas.renderAll();
    callback(canvas.lowerCanvasEl);
  }

  tests.push({
    test: 'canvas can have a gradient background and being zoomed',
    code: backgroundWithGradientZoom,
    golden: 'backgroundWithGradientZoom.png',
    percentage: 0.09,
    width: 300,
    height: 300,
  });

  function backgroundWithGradientNoVpt(canvas, callback) {
    canvas.setZoom(0.1);
    canvas.backgroundVpt = false;
    var g = new fabric.Gradient({
      type: 'linear',
      gradientTransform: [0.4 , -0.4, 0.2, 0.1, 3, 5],
      coords: {
        x1: 0,
        y1: 0,
        x2: 200,
        y2: 0
      },
      colorStops: [{
        offset: 0,
        color: 'green'
      },
      {
        offset: 0.5,
        color: 'white'
      },
      {
        offset: 1,
        color: 'blue'
      }]
    });
    canvas.set({ backgroundColor: g });
    canvas.renderAll();
    callback(canvas.lowerCanvasEl);
  }

  tests.push({
    test: 'canvas can have a gradient background with zoom but being unaffected',
    code: backgroundWithGradientNoVpt,
    golden: 'backgroundWithGradient.png',
    percentage: 0.09,
    width: 300,
    height: 300,
  });

  function objectsInActiveSelections(canvas, callback) {
    canvas.setZoom(0.1);
    var rect1 = new fabric.Rect({ fill: 'purple', top: 30, left: 50, width: 30, height: 100, angle: 10 });
    var rect2 = new fabric.Rect({ fill: 'green', top: 150, left: 10, width: 300, height: 30, angle: -10 });
    new fabric.ActiveSelection([rect1, rect2]);
    var output = rect1.toCanvasElement();
    callback(output);
  }

  tests.push({
    test: 'objects in activeSelection toCanvasElement',
    code: objectsInActiveSelections,
    golden: 'objectsInActiveSelections.png',
    percentage: 0.09,
    width: 300,
    height: 300,
  });

  function canvasPattern(fabricCanvas, callback) {
    getFixture('diet.jpeg', false, function(img) {
      var pattern = new fabric.Pattern({
        source: img,
        repeat: 'repeat',
        offsetX: -120,
        offsetY: 50
      });
      fabricCanvas.backgroundColor = pattern;
      var canvas = fabricCanvas.toCanvasElement();
      callback(canvas);
    });
  }

  tests.push({
    test: 'canvas with background pattern and export',
    code: canvasPattern,
    // use the same golden on purpose
    golden: 'canvasPattern.png',
    percentage: 0.09,
    width: 500,
    height: 500,
  });

  function canvasPatternMultiplier(fabricCanvas, callback) {
    getFixture('diet.jpeg', false, function(img2) {
      var pattern = new fabric.Pattern({
        source: img2,
        repeat: 'repeat',
        offsetX: -120,
        offsetY: 50
      });
      fabricCanvas.backgroundColor = pattern;
      var canvas = fabricCanvas.toCanvasElement(0.3);
      callback(canvas);
    });
  }

  tests.push({
    test: 'canvas with background pattern and multiplier',
    code: canvasPatternMultiplier,
    // use the same golden on purpose
    golden: 'canvasPatternMultiplier.png',
    percentage: 0.09,
    width: 500,
    height: 500,
  });

  tests.forEach(visualTestLoop(QUnit));
})();
