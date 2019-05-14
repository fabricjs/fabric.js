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

  tests.forEach(visualTestLoop(QUnit));
})();
