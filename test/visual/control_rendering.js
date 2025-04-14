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

  function paddingControlsRendering(group, canvas, callback) {
    const rect = new fabric.Rect({
      width: 90, height: 90, strokeWidth: 2, padding: 8,
      fill: 'orange', stroke: 'green', top: 55, left: 55,
    });
    const target = group ? new fabric.Group([rect]) : rect;
    if (group) {
      target.set({ scaleX: 2 });
      rect.set({ scaleX: 0.5 });
    }
    canvas.add(target);
    canvas.setActiveObject(rect);
    canvas.renderAll();
    callback(canvas.lowerCanvasEl);
  }

  tests.push({
    test: 'Rect with padding',
    code: paddingControlsRendering.bind(null, false),
    golden: 'controls2.png',
    percentage: 0.02,
    width: 200,
    height: 200,
    fabricClass: 'Canvas',
  });

  tests.push({
    test: 'Rect with padding under group',
    code: paddingControlsRendering.bind(null, true),
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

  function controlboxFlippedXInGroup(canvas, callback) {
    var rect = new fabric.Rect({
      width: 90, height: 90, padding: 9, angle: 0, flipX: true,
      cornerSize: 12, cornerColor: 'green', cornerStrokeColor: 'blue',
      transparentCorners: false, borderScaleFactor: 3,
      fill: 'red', top: 50, left: 35,
    });
    var group = new fabric.Group([rect], {
      interactive: true,
      subTargetCheck: true,
    });
    canvas.add(group);
    canvas.setActiveObject(rect);
    canvas.renderAll();
    callback(canvas.lowerCanvasEl);
  }

  tests.push({
    test: 'controlbox with flipped X in group',
    code: controlboxFlippedXInGroup,
    golden: 'controls11group.png',
    percentage: 0.004,
    width: 150,
    height: 180,
    fabricClass: 'Canvas',
  });

  function controlboxFlippedYInRotatedGroup(canvas, callback) {
    var rect = new fabric.Rect({
      width: 90, height: 90, padding: 9, angle: 0, flipX: false,
      cornerSize: 12, cornerColor: 'green', cornerStrokeColor: 'blue',
      transparentCorners: false, borderScaleFactor: 3,
      fill: 'red', top: 50, left: 35,
    });
    var group = new fabric.Group([rect], {
      angle: 90,
      left: 110,
      flipY: true,
      interactive: true,
      subTargetCheck: true,
    });
    canvas.add(group);
    canvas.setActiveObject(rect);
    canvas.renderAll();
    callback(canvas.lowerCanvasEl);
  }

  tests.push({
    test: 'controlbox with flipped Y in rotated group',
    code: controlboxFlippedYInRotatedGroup,
    golden: 'controls11group90r.png',
    percentage: 0.004,
    width: 180,
    height: 180,
    fabricClass: 'Canvas',
  });

  function controlboxOpacitySingle(canvas, callback) {
    var rect = new fabric.Rect({
      width: 90, height: 90, padding: 3, opacity: 0.4,
      cornerSize: 12, cornerColor: 'black', cornerStrokeColor: 'black', borderColor: 'black',
      borderScaleFactor: 4,
      fill: 'cyan', top: 10, left: 10, isMoving: true, borderOpacityWhenMoving: 0.4
    });
    canvas.add(rect);
    canvas.setActiveObject(rect);
    canvas.renderAll();
    callback(canvas.lowerCanvasEl);
  }

  tests.push({
    test: 'controlbox opacity single',
    code: controlboxOpacitySingle,
    golden: 'controls12.png',
    percentage: 0.004,
    width: 110,
    height: 110,
    fabricClass: 'Canvas',
  });

  function controlboxOpacitySingleInGroup(canvas, callback) {
    var rect = new fabric.Rect({
      width: 90, height: 90, padding: 3, opacity: 0.4,
      cornerSize: 12, cornerColor: 'black', cornerStrokeColor: 'black', borderColor: 'black',
      borderScaleFactor: 4,
      fill: 'cyan', isMoving: true, borderOpacityWhenMoving: 0.4
    });
    var group = new fabric.Group([rect], { interactive: true, subTargetCheck: true, top: 10, left: 10, });
    canvas.preserveObjectStacking = false;
    canvas.add(group);
    canvas.setActiveObject(rect);
    canvas.renderAll();
    callback(canvas.lowerCanvasEl);
  }

  tests.push({
    test: 'controlbox opacity in group',
    code: controlboxOpacitySingleInGroup,
    golden: 'controls13.png',
    percentage: 0.004,
    width: 110,
    height: 110,
    fabricClass: 'Canvas',
  });

  function controlboxOpacitySingleInGroupAndAs(canvas, callback) {
    var rect = new fabric.Rect({
      width: 90, height: 90, padding: 3, opacity: 0.4,
      cornerSize: 12, cornerColor: 'black', cornerStrokeColor: 'black', borderColor: 'black',
      borderScaleFactor: 4,
      fill: 'cyan', isMoving: true, borderOpacityWhenMoving: 0.4
    });
    var rect2 = new fabric.Rect({
      width: 90, height: 90, padding: 3, opacity: 0.4, top: 10, left: 120,
      cornerSize: 12, cornerColor: 'black', cornerStrokeColor: 'black', borderColor: 'black',
      borderScaleFactor: 4,
      fill: 'lime', isMoving: true, borderOpacityWhenMoving: 0.4
    });
    var group = new fabric.Group([rect], { interactive: true, subTargetCheck: true, top: 10, left: 10, });
    canvas.add(group, rect2);
    const as = new fabric.ActiveSelection([rect, rect2], { canvas: canvas, isMoving: true, cornerSize: 12,
      cornerColor: 'black', cornerStrokeColor: 'black', borderColor: 'black', borderScaleFactor: 4, });
    canvas.setActiveObject(as);
    canvas.renderAll();
    callback(canvas.lowerCanvasEl);
  }

  tests.push({
    test: 'controlbox opacity group and as',
    code: controlboxOpacitySingleInGroupAndAs,
    golden: 'controls14.png',
    percentage: 0.004,
    width: 220,
    height: 110,
    fabricClass: 'Canvas',
  });

  tests.forEach(visualTestLoop(QUnit));
})();
