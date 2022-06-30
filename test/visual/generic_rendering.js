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

  function renderStrokeWithNegativeScale(canvas, callback) {
    var rect = new fabric.Rect({
      width: 10,
      height: 10,
      fill: 'transparent',
      stroke: 'blue',
      strokeWidth: 15,
      strokeUniform: true,
      strokeDashArray: [2, 2],
      top: 65,
      left: 30,
    });
    // do not do this at init time or they will be positive
    rect.scaleX = -2;
    rect.scaleY = -4;

    var rect2 = new fabric.Rect({
      width: 10,
      height: 10,
      fill: 'transparent',
      stroke: 'red',
      strokeWidth: 15,
      scaleX: -2,
      scaleY: -4,
      strokeDashArray: [2, 2],
      strokeUniform: true,
      top: 10,
      left: 55,
    });
    canvas.add(rect, rect2);
    canvas.renderAll();
    callback(canvas.lowerCanvasEl);
  }

  tests.push({
    test: 'Rect with strokeUniform: true and negative scaling',
    code: renderStrokeWithNegativeScale,
    golden: 'strokeNegativeScale.png',
    percentage: 0.011,
    disabled: fabric.isLikelyNode,
    width: 100,
    height: 100,
  });

  function shadownonscaling(canvas, callback) {
    var obj = new fabric.Rect();
    obj.set({
      width: 10, height: 10, scaleX: 12, scaleY: 3, top: 10, left: 5, fill: '#f55',
    });
    obj.set('shadow', new fabric.Shadow({
      color: 'rgba(0,100,0,0.9)', blur: 5, offsetX: 8, offsetY: 8, nonScaling: true
    }));
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
    test: 'polygon position independently from strokeWidth and origin',
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

  function imageSmoothing(fabricCanvas, callback) {
    getFixture('greyfloral.png', false, function(img2) {
      var fImg = new fabric.Image(img2, { imageSmoothing: false, scaleX: 10, scaleY: 10 });
      var fImg2 = new fabric.Image(img2, { left: 400, scaleX: 10, scaleY: 10 });
      fabricCanvas.add(fImg);
      fabricCanvas.add(fImg2);
      fabricCanvas.renderAll();
      callback(fabricCanvas.lowerCanvasEl);
    });
  }

  tests.push({
    test: 'fabric.Image with imageSmoothing false',
    code: imageSmoothing,
    // use the same golden on purpose
    golden: 'imageSoothingOnObject.png',
    percentage: 0.09,
    width: 800,
    height: 400,
  });

  function pathWithGradient(canvas, callback) {
    var pathWithGradient = new fabric.Path('M 0 0 L 0 100 L 100 100 L 100 0 Z', {
      fill: new fabric.Gradient({
        gradientUnits: 'percentage',
        coords: { x1: 0, y1: 0, x2: 0, y2: 1 },
        colorStops: [
          { offset: 0, color: 'red' },
          { offset: 1, color: 'black' }
        ]
      }),
      height: 100,
      width: 100,
      top: 0,
      left: 0
    });
    canvas.add(pathWithGradient);
    canvas.renderAll();
    callback(canvas.lowerCanvasEl);
  }

  tests.push({
    test: 'gradient should be applied to path',
    code: pathWithGradient,
    golden: 'pathWithGradient.png',
    percentage: 0.06,
    width: 100,
    height: 100,
  });

  function gradientStroke(canvas, callback) {
    var line = new fabric.Line([10, 10, 200, 200], {
      stroke: new fabric.Gradient({
        type: 'linear',
        coords: {
          x1: 20,
          y1: 0,
          x2: 80,
          y2: 0,
        },
        colorStops: [
          {
            offset: 0,
            color: 'green',
          },
          {
            offset: 0.4,
            color: 'cyan',
          },
          {
            offset: 1,
            color: 'red',
          },
        ],
        gradientTransform: [1, 0, 0, 1, 50, 0]
      }),
      strokeWidth: 20,
    });
    canvas.add(
      line
    );
    canvas.renderAll();
    callback(canvas.lowerCanvasEl);

  }

  tests.push({
    test: 'Use the gradient strokeStyle for line(other shape is ok)',
    code: gradientStroke,
    golden: 'gradientStroke.png',
    newModule: 'Gradient stroke',
    percentage: 0.02,
    width: 300,
    height: 300,
  });

  function textGradientFill(canvas, callback) {
    var text = new fabric.Text('Some Text', {
      fontSize: 40,
      left: 25,
      top: -25,
      fontWeight: 'bold',
      fill: new fabric.Gradient({
        type: 'radial',
        coords: {
          x1: 0,
          y1: 0,
          r1: 100,
          x2: 0,
          y2: 0,
          r2: 50
        },
        colorStops: [
          {
            offset: 0,
            color: 'white',
          },
          {
            offset: 0.5,
            color: 'indianred',
          },
          {
            offset: 1,
            color: 'green',
          },
        ],
        gradientTransform: [1, 0, 0, 1, 50, 50]
      })
    });
    canvas.add(
      text
    );
    canvas.renderAll();
    callback(canvas.lowerCanvasEl);

  }

  tests.push({
    test: 'Use the gradient fillStyle for text',
    code: textGradientFill,
    golden: 'textGradientFill.png',
    newModule: 'Text gradient fill',
    percentage: 0.04,
    width: 300,
    height: 100,
  });

  function pathWithStrokeBBoxProjection(canvas, callback) {
    var pathStr = 'M0,150c0-0.2,0-0.3,0-0.6c3.6-2.7,6.8-5.7,9.7-8.9c4.5-5,8-10.6,9.8-17.1c2-6.6,1.7-13.3,0.3-19.9c-1.5-7.2-3.4-14.3-5-21.5  c-1.5-6.8-2.8-13.6-2.4-20.7c0.3-6.8,2.2-13.1,5.4-19.1c4.4-8.2,10.4-15,18-20.5c7.7-5.4,16.4-8,25.8-8.3c6.7-0.2,13.3,0.7,19.8,2  c5.7,1,11.2,2.4,16.8,3.6c5.8,1.2,11.7,2.2,17.5,3.1c5.4,0.9,11,0.9,16.4,0.1c5.6-0.8,10.6-2.8,15.4-5.8c4.3-2.7,8.1-6.1,11.2-10.2  c1.6-2,2.9-4.2,4.3-6.2c0.1,0,0.2,0,0.2,0c2.4,4.2,5.3,8,8.8,11.3c8.4,8.2,18.5,12.1,30.3,12.3c6.2,0,12.5-1,18.6-2.1  c8.6-1.5,17-3.6,25.6-5.2c6-1.2,12-1.9,18.3-1.6c6,0.2,11.8,1.4,17.3,3.6c4.2,1.6,8,3.9,11.4,6.7c4.3,3.4,7.9,7.3,11.1,11.7  c3.5,4.7,6.2,9.9,7.9,15.6c1.7,6,2.4,12.3,1.5,18.5c-0.8,5.7-1.7,11.2-3,16.8c-1.6,7.3-3.6,14.6-4.4,22.1  c-0.8,7.5,0.1,14.6,3.5,21.4c2.3,4.7,5.3,8.9,9,12.6c2.5,2.4,5.2,4.7,7.9,7.3c-0.2,0.2-0.6,0.6-0.9,0.8c-4.7,3.8-9.3,7.9-12.8,12.8  c-2.9,4-5.2,8.3-6.5,13.1c-1.7,6.6-1.6,13.4-0.2,20.1c1.6,7.9,3.6,15.7,5.2,23.6c1.2,5.2,1.9,10.5,1.7,16  c-0.2,6.6-1.6,12.8-4.5,18.7c-2,4.2-4.4,8-7.3,11.4c-3.4,4-7.1,7.7-11.4,10.8c-7.1,4.9-14.8,7.6-23.2,8.3c-3.9,0.3-7.9,0.2-11.8-0.2  c-6.9-0.9-13.8-2.1-20.6-3.4c-8-1.5-16-3.2-23.9-4.7c-4.3-0.8-8.6-0.9-13-0.7c-6.2,0.3-11.9,2-17.3,5c-4.7,2.7-8.7,6.2-12.1,10.4  c-1.9,2.2-3.5,4.6-5.2,7.1c-0.3-0.5-0.7-0.9-0.9-1.3c-2.1-2.8-4-5.8-6.4-8.4c-3.2-3.6-6.9-6.5-11.2-8.9c-4.6-2.5-9.6-3.9-14.7-4.6  c-6.5-0.8-13-0.1-19.3,1.2c-9.6,1.9-19.1,3.9-28.7,5.7c-4.4,0.8-8.7,1.5-13.2,1.7c-3.5,0.2-7.1,0-10.5-0.2c-8-0.6-15.4-3.4-22-7.9  c-5.8-3.9-10.3-9-14.3-14.8c-8.1-11.6-10.9-24.3-8.1-38c1.4-7.1,3.1-14,4.6-21c1.5-6.8,3-13.6,2.3-20.7c-0.5-4.9-1.9-9.4-4-13.8  c-2.7-5.3-6.5-9.7-10.8-13.6C4.4,153.4,2.2,151.7,0,150z';

    var path = new fabric.Path(pathStr, {
      fill: 'black',
      stroke: 'red',
      strokeWidth: 100,
      noScaleCache: false,
      //strokeUniform: true,
      objectCaching: false,
      paintFirst: 'stroke',
      hasControls: false,
      //strokeLineJoin:'bevel'
    });
    canvas.add(
      path
    );
    canvas.setActiveObject(path);
    canvas.renderAll();
    callback(canvas.lowerCanvasEl);
  }

  tests.push({
    test: 'path with stroke bbox projection',
    code: pathWithStrokeBBoxProjection,
    golden: 'pathWithStrokeBBoxProjection.png',
    newModule: 'bbox',
    percentage: 0.04,
    width: 700,
    height: 600,
    fabricClass: 'Canvas'
  });

  tests.forEach(visualTestLoop(QUnit));
})();
