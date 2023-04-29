(function() {
  if (isNode()) {
    if (process.env.launcher === 'Firefox') {
      fabric.config.configure({ browserShadowBlurConstant: 0.9 });
    }
    if (process.env.launcher === 'Node') {
      fabric.config.configure({ browserShadowBlurConstant: 1 });
    }
    if (process.env.launcher === 'Chrome') {
      fabric.config.configure({ browserShadowBlurConstant: 1.5 });
    }
    if (process.env.launcher === 'Edge') {
      fabric.config.configure({ browserShadowBlurConstant: 1.75 });
    }
  }
  else {
    if (navigator.userAgent.indexOf('Firefox') !== -1) {
      fabric.config.configure({ browserShadowBlurConstant: 0.9 });
    }
    if (navigator.userAgent.indexOf('Chrome') !== -1) {
      fabric.config.configure({ browserShadowBlurConstant: 1.5 });
    }
    if (navigator.userAgent.indexOf('Edge') !== -1) {
      fabric.config.configure({ browserShadowBlurConstant: 1.75 });
    }
  }
  fabric.config.configure({
    enableGLFiltering: false
  });
  fabric.Object.ownDefaults.objectCaching = true;
  var visualTestLoop;
  if (isNode()) {
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
    test: 'circle corners green',
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

  function controlboxFlippedX(canvas, callback) {
    var rect = new fabric.Rect({
      width: 90, height: 90, padding: 4, angle: 15, flipX: true,
      cornerSize: 12, cornerColor: 'green', cornerStrokeColor: 'pink',
      transparentCorners: true, borderScaleFactor: 3,
      fill: 'red', top: 35, left: 35,
    });
    canvas.add(rect);
    canvas.setActiveObject(rect);
    canvas.renderAll();
    callback(canvas.lowerCanvasEl);
  }

  tests.push({
    test: 'controlbox with flipped X',
    code: controlboxFlippedX,
    golden: 'controls11.png',
    percentage: 0.004,
    width: 150,
    height: 170,
    fabricClass: 'Canvas',
  });

  function controlBoxes(canvas, callback) {
    canvas.loadFromJSON('{"version":"4.6.0","objects":[{"type":"Rect","version":"4.6.0","left":38,"top":201,"width":150,"height":150,"fill":"red","skewX":0.15,"skewY":36},{"type":"Rect","version":"4.6.0","left":20,"top":2,"width":150,"height":150,"fill":"#020aed","scaleX":1.24,"scaleY":0.81,"angle":35.95,"skewX":25.46},{"type":"Group","version":"4.6.0","left":60.65,"top":28,"width":320.4,"height":335.5,"objects":[{"type":"Rect","version":"4.6.0","left":-29.85,"top":-167.75,"width":150,"height":150,"fill":"green","angle":30,"skewX":14.71,"skewY":36},{"type":"Rect","version":"4.6.0","left":-29.85,"top":-167.75,"width":150,"height":150,"fill":"yellow","angle":45,"skewX":14.71}]}]}')
      .then(function() {
        canvas.renderAll();
        canvas.getObjects().forEach(function(object) {
          object.borderScaleFactor = 3;
          object.transparentCorners = false;
          object._renderControls(canvas.contextContainer, {
            borderColor: object.fill,
            cornerColor: object.fill,
          });
          if (object.getObjects) {
            object.getObjects().forEach(function(subTarget) {
              subTarget.borderScaleFactor = 3;
              subTarget.transparentCorners = false;
              subTarget._renderControls(canvas.contextContainer, {
                borderColor: subTarget.fill,
                cornerColor: subTarget.fill,
              });
            });
          }
        });
        callback(canvas.lowerCanvasEl);
      });
  }

  tests.push({
    test: 'controlboxes with skewY',
    code: controlBoxes,
    golden: 'controls12.png',
    percentage: 0.002,
    width: 400,
    height: 600,
    fabricClass: 'Canvas',
  });

  function controlBoxes2(canvas, callback) {
    canvas.loadFromJSON('{"version":"5.2.0","objects":[{"type":"Rect","version":"5.2.0","left":38,"top":201,"width":150,"height":150,"fill":"red","skewX":0.15,"skewY":36},{"type":"Rect","version":"5.2.0","left":20,"top":2,"width":150,"height":150,"fill":"#020aed","scaleX":1.24,"scaleY":0.81,"angle":35.95,"skewX":25.46},{"type":"Group","version":"5.2.0","left":152.65,"top":21,"width":320.4,"height":335.5,"scaleX":0.75,"skewY":24.57, "objects":[{"type":"Rect","version":"5.2.0","left":-29.85,"top":-167.75,"width":150,"height":150,"fill":"green","angle":30,"skewX":14.71,"skewY":36, "flipX": true, "flipY": true},{"type":"Rect","version":"5.2.0","left":-29.85,"top":-167.75,"width":150,"height":150,"fill":"yellow","angle":45,"skewX":14.71}]},{"type":"Group","version":"5.2.0","left":329.65,"top":65,"width":320.4,"height":335.5,"scaleX":1.29,"scaleY":1.29, "flipX": true,"objects":[{"type":"Rect","version":"5.2.0","left":-29.85,"top":-167.75,"width":150,"height":150,"fill":"purple","angle":30,"skewX":14.71,"skewY":36},{"type":"Rect","version":"5.2.0","left":-29.85,"top":-167.75,"width":150,"height":150,"fill":"pink","angle":45,"skewX":14.71}]}]}')
      .then(function() {
        canvas.renderAll();
        canvas.getObjects().forEach(function(object) {
          object.borderScaleFactor = 3;
          object.transparentCorners = false;
          object._renderControls(canvas.contextContainer, {
            borderColor: object.fill,
            cornerColor: object.fill,
          });
          if (object.getObjects) {
            object.getObjects().forEach(function(subTarget) {
              subTarget.borderScaleFactor = 3;
              subTarget.transparentCorners = false;
              subTarget._renderControls(canvas.contextContainer, {
                borderColor: subTarget.fill,
                cornerColor: subTarget.fill,
              });
            });
          }
        });
        callback(canvas.lowerCanvasEl);
      });
  }

  tests.push({
    test: 'controlboxes with skewY and flipX',
    code: controlBoxes2,
    golden: 'controls13.png',
    percentage: 0.002,
    width: 700,
    height: 600,
    fabricClass: 'Canvas',
  });

  tests.forEach(visualTestLoop(QUnit));
})();
