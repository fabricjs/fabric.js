(function() {

  var SUB_TARGETS_JSON = '{"version":"' + fabric.version + '","objects":[{"type":"ActiveSelection","left":-152,"top":656.25,"width":356.5,"height":356.5,"scaleX":0.45,"scaleY":0.45,"objects":[]},{"type":"Group","left":11,"top":6,"width":511.5,"height":511.5,"objects":[{"type":"Rect","left":-255.75,"top":-255.75,"width":50,"height":50,"fill":"#6ce798","scaleX":10.03,"scaleY":10.03,"opacity":0.8},{"type":"Group","left":-179.75,"top":22,"width":356.5,"height":356.5,"scaleX":0.54,"scaleY":0.54,"objects":[{"type":"Rect","left":-178.25,"top":-178.25,"width":50,"height":50,"fill":"#4862cc","scaleX":6.99,"scaleY":6.99,"opacity":0.8},{"type":"Group","left":-163.25,"top":-161.25,"width":177.5,"height":177.5,"objects":[{"type":"Rect","left":-88.75,"top":-88.75,"width":50,"height":50,"fill":"#5fe909","scaleX":3.48,"scaleY":3.48,"opacity":0.8},{"type":"Rect","left":-59.75,"top":-68.75,"width":50,"height":50,"fill":"#f3529c","opacity":0.8},{"type":"Triangle","left":36.03,"top":-38.12,"width":50,"height":50,"fill":"#c1124e","angle":39.07,"opacity":0.8},{"type":"Rect","left":-65.75,"top":17.25,"width":50,"height":50,"fill":"#9c5120","opacity":0.8}]},{"type":"Group","left":-34.25,"top":-31.25,"width":177.5,"height":177.5,"scaleX":1.08,"scaleY":1.08,"objects":[{"type":"Rect","left":-88.75,"top":-88.75,"width":50,"height":50,"fill":"#5fe909","scaleX":3.48,"scaleY":3.48,"opacity":0.8},{"type":"Rect","left":-59.75,"top":-68.75,"width":50,"height":50,"fill":"#f3529c","opacity":0.8},{"type":"Triangle","left":36.03,"top":-38.12,"width":50,"height":50,"fill":"#c1124e","angle":39.07,"opacity":0.8},{"type":"Rect","left":-65.75,"top":17.25,"width":50,"height":50,"fill":"#9c5120","opacity":0.8}]}]},{"type":"Group","left":-202.75,"top":-228.5,"width":356.5,"height":356.5,"scaleX":0.61,"scaleY":0.61,"objects":[{"type":"Rect","left":-178.25,"top":-178.25,"width":50,"height":50,"fill":"#4862cc","scaleX":6.99,"scaleY":6.99,"opacity":0.8},{"type":"Group","left":-163.25,"top":-161.25,"width":177.5,"height":177.5,"objects":[{"type":"Rect","left":-88.75,"top":-88.75,"width":50,"height":50,"fill":"#5fe909","scaleX":3.48,"scaleY":3.48,"opacity":0.8},{"type":"Rect","left":-59.75,"top":-68.75,"width":50,"height":50,"fill":"#f3529c","opacity":0.8},{"type":"Triangle","left":36.03,"top":-38.12,"width":50,"height":50,"fill":"#c1124e","angle":39.07,"opacity":0.8},{"type":"Rect","left":-65.75,"top":17.25,"width":50,"height":50,"fill":"#9c5120","opacity":0.8}]},{"type":"Group","left":-34.25,"top":-31.25,"width":177.5,"height":177.5,"scaleX":1.08,"scaleY":1.08,"objects":[{"type":"Rect","left":-88.75,"top":-88.75,"width":50,"height":50,"fill":"#5fe909","scaleX":3.48,"scaleY":3.48,"opacity":0.8},{"type":"Rect","left":-59.75,"top":-68.75,"width":50,"height":50,"fill":"#f3529c","opacity":0.8},{"type":"Triangle","left":36.03,"top":-38.12,"width":50,"height":50,"fill":"#c1124e","angle":39.07,"opacity":0.8},{"type":"Rect","left":-65.75,"top":17.25,"width":50,"height":50,"fill":"#9c5120","opacity":0.8}]}]},{"type":"Group","left":138.3,"top":-90.22,"width":356.5,"height":356.5,"scaleX":0.42,"scaleY":0.42,"angle":62.73,"objects":[{"type":"Rect","left":-178.25,"top":-178.25,"width":50,"height":50,"fill":"#4862cc","scaleX":6.99,"scaleY":6.99,"opacity":0.8},{"type":"Group","left":-163.25,"top":-161.25,"width":177.5,"height":177.5,"objects":[{"type":"Rect","left":-88.75,"top":-88.75,"width":50,"height":50,"fill":"#5fe909","scaleX":3.48,"scaleY":3.48,"opacity":0.8},{"type":"Rect","left":-59.75,"top":-68.75,"width":50,"height":50,"fill":"#f3529c","opacity":0.8},{"type":"Triangle","left":36.03,"top":-38.12,"width":50,"height":50,"fill":"#c1124e","angle":39.07,"opacity":0.8},{"type":"Rect","left":-65.75,"top":17.25,"width":50,"height":50,"fill":"#9c5120","opacity":0.8}]},{"type":"Group","left":-34.25,"top":-31.25,"width":177.5,"height":177.5,"scaleX":1.08,"scaleY":1.08,"objects":[{"type":"Rect","left":-88.75,"top":-88.75,"width":50,"height":50,"fill":"#5fe909","scaleX":3.48,"scaleY":3.48,"opacity":0.8},{"type":"Rect","left":-59.75,"top":-68.75,"width":50,"height":50,"fill":"#f3529c","opacity":0.8},{"type":"Triangle","left":36.03,"top":-38.12,"width":50,"height":50,"fill":"#c1124e","angle":39.07,"opacity":0.8},{"type":"Rect","left":-65.75,"top":17.25,"width":50,"height":50,"fill":"#9c5120","opacity":0.8}]}]}]}]}';

  var canvas = this.canvas = new fabric.Canvas(null, {enableRetinaScaling: false, width: 600, height: 600});
  var upperCanvasEl = canvas.upperCanvasEl;

  QUnit.module('fabric.Canvas events mixin', {
    beforeEach: function() {
      canvas.cancelRequestedRender();
      canvas.viewportTransform = [1, 0, 0, 1, 0, 0];
      upperCanvasEl.style.display = '';
      canvas.controlsAboveOverlay = fabric.Canvas.getDefaults().controlsAboveOverlay;
      canvas.preserveObjectStacking = fabric.Canvas.getDefaults().preserveObjectStacking;
    },
    afterEach: function() {
      canvas.clear();
      canvas.backgroundColor = fabric.Canvas.getDefaults().backgroundColor;
      canvas.overlayColor = fabric.Canvas.getDefaults().overlayColor;
      canvas.handleSelection = fabric.Canvas.prototype.handleSelection;
      canvas.off();
      canvas.setDimensions({ width: 600, height: 600 });
      canvas.calcOffset();
      upperCanvasEl.style.display = 'none';
      canvas.cancelRequestedRender();
    }
  });

  QUnit.test('_beforeTransform', function (assert) {
    assert.ok(typeof canvas._beforeTransform === 'function');

    var canvasEl = canvas.getElement(),
        canvasOffset = fabric.util.getElementOffset(canvasEl);

    var rect = new fabric.Rect({ left: 50, top: 50, width: 50, height: 50 });
    canvas.add(rect);
    canvas.setActiveObject(rect);

    var t, counter = 0;
    canvas.on('before:transform', function (options) {
      t = options.transform.target;
      counter++;
    });

    var corners = ['tl', 'mt', 'tr', 'mr', 'br', 'mb', 'bl', 'ml', 'mtr'];
    for (var i = 0; i < corners.length; i++) {
      var co = rect.oCoords[corners[i]].corner;
      var e = {
        clientX: canvasOffset.left + (co.tl.x + co.tr.x) / 2,
        clientY: canvasOffset.top + (co.tl.y + co.bl.y) / 2,
        which: 1
      };
      canvas._setupCurrentTransform(e, rect);
    }
    assert.equal(counter, corners.length, 'before:transform should trigger onBeforeScaleRotate for all corners');
    assert.equal(t, rect, 'before:transform should receive correct target');

    canvas.zoomToPoint({ x: 25, y: 25 }, 2);

    t = null;
    counter = 0;
    for (var i = 0; i < corners.length; i++) {
      var c = corners[i];
      var co = rect.oCoords[c].corner;
      var e = {
        clientX: canvasOffset.left + (co.tl.x + co.tr.x) / 2,
        clientY: canvasOffset.top + (co.tl.y + co.bl.y) / 2,
        which: 1
      };
      canvas._beforeTransform(e, rect);
    }
    assert.equal(counter, corners.length, 'before:transform should trigger onBeforeScaleRotate when canvas is zoomed');
    assert.equal(t, rect, 'before:transform should receive correct target when canvas is zoomed');

    canvas.zoomToPoint({ x: 0, y: 0 }, 1);
  });

  QUnit.test('cache and reset event properties', function(assert) {
    var e = { clientX: 30, clientY: 30, which: 1, target: canvas.upperCanvasEl };
    var rect = new fabric.Rect({ width: 60, height: 60 });
    function cacheAndAssertTransformEvent() {
      canvas._cacheTransformEventData(e);
      assert.deepEqual(canvas._pointer, new fabric.Point(30, 30), 'pointer has been cached');
      assert.deepEqual(canvas._absolutePointer, new fabric.Point(15, 15), 'absolute pointer has been cached');
    }
    function assertTransformEventCacheIsReset() {
      assert.equal(canvas._pointer, null);
      assert.equal(canvas._absolutePointer, null);
      assert.equal(canvas._target, null);
    }
    canvas._currentTransform = null;
    canvas.add(rect);
    assertTransformEventCacheIsReset();
    canvas.viewportTransform = [2, 0, 0, 2, 0, 0];

    cacheAndAssertTransformEvent();
    assert.ok(canvas._target === rect);
    canvas._resetTransformEventData();
    assertTransformEventCacheIsReset();

    //  canvas resize
    cacheAndAssertTransformEvent();
    canvas.setDimensions({ width: 200, height: 200 });
    assertTransformEventCacheIsReset();

    //  window resize
    cacheAndAssertTransformEvent();
    canvas._onResize();
    assertTransformEventCacheIsReset();
  });

  QUnit.test('mouse:down with different buttons', function(assert) {
    var clickCount = 0;
    function mouseHandler() {
      clickCount++;
    }
    canvas.on('mouse:down', mouseHandler);
    canvas.fireMiddleClick = false;
    canvas.fireRightClick = false;
    canvas._currentTransform = false;
    canvas.isDrawingMode = false;
    canvas.__onMouseDown({ button: 0, target: canvas.upperCanvasEl  });
    assert.equal(clickCount, 1, 'mouse down fired');
    clickCount = 0;
    canvas.__onMouseDown({ button: 2, target: canvas.upperCanvasEl  });
    assert.equal(clickCount, 0, 'rightclick did not fire a mouse:down event');
    canvas.fireRightClick = true;
    canvas.__onMouseDown({ button: 2, target: canvas.upperCanvasEl  });
    assert.equal(clickCount, 1, 'rightclick did fire a mouse:down event');
    clickCount = 0;
    canvas.__onMouseDown({ button: 1, target: canvas.upperCanvasEl  });
    assert.equal(clickCount, 0, 'middleClick did not fire a mouse:down event');
    canvas.fireMiddleClick = true;
    canvas.__onMouseDown({ button: 1, target: canvas.upperCanvasEl  });
    assert.equal(clickCount, 1, 'middleClick did fire a mouse:down event');
  });

  QUnit.test('mouse:down:before with different buttons', function(assert) {
    var clickCount = 0;
    function mouseHandler() {
      clickCount++;
    }
    canvas.on('mouse:down:before', mouseHandler);
    canvas.fireMiddleClick = false;
    canvas.fireRightClick = false;
    canvas._currentTransform = false;
    canvas.isDrawingMode = false;
    canvas.__onMouseDown({ which: 1, target: canvas.upperCanvasEl  });
    assert.equal(clickCount, 1, 'mouse:down:before fired');
    clickCount = 0;
    canvas.__onMouseDown({ which: 3, target: canvas.upperCanvasEl  });
    assert.equal(clickCount, 1, 'rightclick fired a mouse:down:before event');
    canvas.fireRightClick = true;
    canvas.__onMouseDown({ which: 3, target: canvas.upperCanvasEl  });
    assert.equal(clickCount, 2, 'rightclick did fire a mouse:down:before event');
    clickCount = 0;
    canvas.__onMouseDown({ which: 2, target: canvas.upperCanvasEl  });
    assert.equal(clickCount, 1, 'middleClick did not fire a mouse:down:before event');
    canvas.fireMiddleClick = true;
    canvas.__onMouseDown({ which: 2, target: canvas.upperCanvasEl  });
    assert.equal(clickCount, 2, 'middleClick did fire a mouse:down:before event');
  });

  QUnit.test('mouse:down and group selector', function(assert) {
    var e = { clientX: 30, clientY: 40, which: 1, target: canvas.upperCanvasEl };
    var rect = new fabric.Rect({ width: 150, height: 150 });
    var expectedGroupSelector = { x: 80, y: 120, deltaX: 0, deltaY: 0 };
    canvas.absolutePan(new fabric.Point(50, 80));
    canvas.__onMouseDown(e);
    assert.deepEqual(canvas._groupSelector, expectedGroupSelector, 'a new groupSelector is created');
    canvas.add(rect);
    canvas.__onMouseUp(e);
    canvas.__onMouseDown(e);
    assert.deepEqual(canvas._groupSelector, null, 'with object on target no groupSelector is started');
    rect.selectable = false;
    canvas.__onMouseUp(e);
    canvas.__onMouseDown(e);
    assert.deepEqual(canvas._groupSelector, null, 'with object non selectable but already selected groupSelector is not started');
    canvas.__onMouseUp(e);
    canvas.discardActiveObject();
    rect.isEditing = true;
    canvas.__onMouseDown(e);
    assert.deepEqual(canvas._groupSelector, null, 'with object editing, groupSelector is not started');
    canvas.__onMouseUp(e);
    canvas.discardActiveObject();
    rect.isEditing = false;
    canvas.__onMouseDown(e);
    assert.deepEqual(canvas._groupSelector, expectedGroupSelector, 'a new groupSelector is created');
    canvas.__onMouseUp(e);
  });

  QUnit.test('activeOn object selection', function(assert) {
    var rect = new fabric.Rect({ width: 200, height: 200, activeOn: 'down' });
    canvas.add(rect);
    var e = { clientX: 30, clientY: 15, which: 1, target: canvas.upperCanvasEl };
    canvas.__onMouseDown(e);
    assert.equal(canvas._activeObject, rect, 'with activeOn of down object is selected on mouse down');
    canvas.__onMouseUp(e);
    canvas.discardActiveObject();
    rect.activeOn = 'up';
    canvas.__onMouseDown(e);
    assert.equal(canvas._activeObject, null, 'with activeOn of up object is not selected on mouse down');
    canvas.__onMouseUp(e);
    assert.equal(canvas._activeObject, rect, 'with activeOn of up object is selected on mouse up');
  });

  QUnit.test('specific bug #5317 for multiselection', function(assert) {
    var greenRect = new fabric.Rect({
      width: 300,
      height: 300,
      left: 0,
      top: 0,
      fill: 'green',
      selectable: false
    });
    canvas.add(greenRect);

    // add green, half-transparent circle
    var redCircle = new fabric.Circle({
      radius: 40,
      left: 200,
      top: 100,
      fill: 'red',
      opacity: 0.5
    });
    canvas.add(redCircle);

    // add green, half-transparent circle
    var blueCircle = new fabric.Circle({
      radius: 40,
      left: 0,
      top: 0,
      fill: 'blue',
      opacity: 0.5
    });
    canvas.add(blueCircle);
    var e = { clientX: 40, clientY: 40, which: 1, target: canvas.upperCanvasEl };
    canvas.__onMouseDown(e);
    assert.equal(canvas._activeObject, blueCircle, 'blue circle is selected with first click');
    canvas.__onMouseUp(e);
    var e2 = { clientX: 240, clientY: 140, which: 1, target: canvas.upperCanvasEl, shiftKey: true };
    canvas.__onMouseDown(e2);
    var selection = canvas.getActiveObjects();
    assert.equal(selection[1], blueCircle, 'blue circle is still selected');
    assert.equal(selection[0], redCircle, 'red circle is selected with shift click');
    canvas.__onMouseUp(e2);
    var e3 = { clientX: 140, clientY: 90, which: 1, target: canvas.upperCanvasEl, shiftKey: true };
    canvas.__onMouseDown(e3);
    var selection = canvas.getActiveObjects();
    canvas.on('mouse:down', function(options) {
      assert.equal(options.target, greenRect, 'green rectangle was the target');
    });
    assert.equal(selection[1], blueCircle, 'blue circle is still selected 2');
    assert.equal(selection[0], redCircle, 'red circle is still selected 2');
    assert.equal(selection.length, 2, 'no other object have been selected');
    canvas.__onMouseUp(e3);
    var e4 = { clientX: 290, clientY: 290, which: 1, target: canvas.upperCanvasEl };
    canvas.__onMouseDown(e4);
    var selection = canvas.getActiveObjects();
    canvas.on('mouse:down', function(options) {
      assert.equal(options.target, greenRect, 'green rectangle was the target 2');
    });
    assert.equal(selection.length, 0, 'no other object have been selected because green rect is unselectable');
    canvas.__onMouseUp(e4);
  });

  QUnit.test('specific bug #6314 for partial intersection with drag', function(assert) {
    var canvas = this.canvas = new fabric.Canvas(null, {enableRetinaScaling: false, width: 600, height: 600});
    var renderRequested = false;
    var greenRect = new fabric.Rect({
      width: 300,
      height: 300,
      left: 50,
      top: 0,
      fill: 'green',
    });
    canvas.add(greenRect);
    canvas._onMouseDown({ clientX: 25, clientY: 25, which: 1, target: canvas.upperCanvasEl });
    canvas._onMouseMove({ clientX: 30, clientY: 30, which: 1, target: canvas.upperCanvasEl });
    canvas._onMouseMove({ clientX: 100, clientY: 50, which: 1, target: canvas.upperCanvasEl });
    canvas.requestRenderAll = function() {
      renderRequested = true;
    };
    canvas._onMouseUp({ clientX: 100, clientY: 50, which: 1, target: canvas.upperCanvasEl });
    assert.equal(renderRequested, true, 'a render has been requested');
  });


  QUnit.test('mouse:up, isClick = true', function(assert) {
    var e = { clientX: 30, clientY: 30, which: 1, target: canvas.upperCanvasEl  };
    var isClick = false;
    canvas.on('mouse:up', function(opt) {
      isClick = opt.isClick;
    });
    canvas.__onMouseDown(e);
    canvas.__onMouseUp(e);
    assert.equal(isClick, true, 'without moving the pointer, the click is true');
  });

  QUnit.test('mouse:up after move, isClick = false', function (assert) {
    var e = { clientX: 30, clientY: 30, which: 1 };
    var e2 = { clientX: 31, clientY: 31, which: 1 };
    var isClick = true;
    canvas.on('mouse:up', function (opt) {
      isClick = opt.isClick;
    });
    canvas.__onMouseDown(e);
    canvas.__onMouseMove(e2);
    canvas.__onMouseUp(e2);
    assert.equal(isClick, false, 'moving the pointer, the click is false');
  });

  QUnit.test('mouse:up after dragging, isClick = false', function (assert) {
    var e = { clientX: 30, clientY: 30, which: 1 };
    var e2 = { clientX: 31, clientY: 31, which: 1 };
    var isClick = true;
    canvas.on('mouse:up', function (opt) {
      isClick = opt.isClick;
    });
    canvas.__onMouseDown(e);
    canvas._onDragStart({
      preventDefault() {

      },
      stopPropagation() {

      }
    });
    canvas.__onMouseUp(e2);
    assert.equal(isClick, false, 'moving the pointer, the click is false');
  });

  QUnit.test('setDimensions and active brush', function(assert) {
    var prepareFor = false;
    var rendered = false;
    var canva = new fabric.Canvas(null, { width: 500, height: 500 });
    var brush = new fabric.PencilBrush({ color: 'red', width: 4 });
    canva.isDrawingMode = true;
    canva.freeDrawingBrush = brush;
    canva._isCurrentlyDrawing = true;
    brush._render = function() { rendered = true; };
    brush._setBrushStyles = function() { prepareFor = true; };
    canva.setDimensions({ width: 200, height: 200 });
    canva.renderAll();
    assert.equal(rendered, true, 'the brush called the _render method');
    assert.equal(prepareFor, true, 'the brush called the _setBrushStyles method');
  });

  QUnit.test('mouse:up should return target and currentTarget', function(assert) {
    var e1 = { clientX: 30, clientY: 30, which: 1 };
    var e2 = { clientX: 100, clientY: 100, which: 1 };
    var rect1 = new fabric.Rect({ left: 0, top: 0, width: 50, height: 50, lockMovementX: true, lockMovementY: true });
    var rect2 = new fabric.Rect({ left: 75, top: 75, width: 50, height: 50 });
    canvas.add(rect1);
    canvas.add(rect2);
    var opt;
    canvas.on('mouse:up', function(_opt) {
      opt = _opt;
    });
    canvas.__onMouseDown(e1);
    canvas.__onMouseMove(e2);
    canvas.__onMouseUp(e2);
    assert.equal(opt.target, rect1, 'options match model - target');
    assert.equal(opt.currentTarget, rect2, 'options match model - currentTarget');
  });

  QUnit.test('fires object:modified', function(assert) {
    var e = { clientX: 30, clientY: 30, which: 1 };
    var e2 = { clientX: 31, clientY: 31, which: 1 };
    var rect = new fabric.Rect({ left: 0, top: 0, width: 50, height: 50 });
    canvas.add(rect);
    var count = 0;
    var opt;
    canvas.on('object:modified', function(_opt) {
      count++;
      opt = _opt;
    });
    canvas.__onMouseDown(e);
    canvas.__onMouseMove(e2);
    canvas.__onMouseUp(e2);
    assert.equal(count, 1, 'object:modified fired');
    assert.equal(opt.e, e2, 'options match model - event');
    assert.equal(opt.target, rect, 'options match model - target');
    assert.equal(opt.transform.action, 'drag', 'options match model - target');
  });

  QUnit.test('drag small object when mousemove + drag, not active', function(assert) {
    var e = { clientX: 2, clientY: 2, which: 1 };
    var e1 = { clientX: 4, clientY: 4, which: 1 };
    var e2 = { clientX: 6, clientY: 6, which: 1 };
    var rect = new fabric.Rect({ left: 0, top: 0, width: 3, height: 3, strokeWidth: 0 });
    canvas.add(rect);
    canvas.__onMouseDown(e);
    canvas.__onMouseMove(e1);
    canvas.__onMouseMove(e2);
    canvas.__onMouseUp(e2);
    assert.equal(rect.top, 4, 'rect moved by 4 pixels top');
    assert.equal(rect.left, 4, 'rect moved by 4 pixels left');
    assert.equal(rect.scaleX, 1, 'rect did not scale Y');
    assert.equal(rect.scaleY, 1, 'rect did not scale X');
  });

  QUnit.test('scale small object when mousemove + drag, active', function(assert) {
    var e = { clientX: 3, clientY: 3, which: 1 };
    var e1 = { clientX: 6, clientY: 6, which: 1 };
    var e2 = { clientX: 9, clientY: 9, which: 1 };
    var rect = new fabric.Rect({ left: 0, top: 0, width: 3, height: 3, strokeWidth: 0 });
    assert.equal(rect.scaleX, 1, 'rect not scaled X');
    assert.equal(rect.scaleY, 1, 'rect not scaled Y');
    canvas.add(rect);
    canvas.setActiveObject(rect);
    canvas.__onMouseDown(e);
    canvas.__onMouseMove(e1);
    canvas.__onMouseMove(e2);
    canvas.__onMouseUp(e2);
    assert.equal(rect.scaleX, 3, 'rect scaled X');
    assert.equal(rect.scaleY, 3, 'rect scaled Y');
  });

  QUnit.test('scaling a nested target', function(assert) {
    var e = { clientX: 3, clientY: 3, which: 1 };
    var e1 = { clientX: 6, clientY: 6, which: 1 };
    var e2 = { clientX: 9, clientY: 9, which: 1 };
    var rect = new fabric.Rect({ left: 0, top: 0, width: 3, height: 3, strokeWidth: 0, scaleX: 0.5 });
    var mouseUpCalled = false;
    var mouseDownCalled = false;
    rect.controls = {
      br: rect.controls.br,
    };
    rect.controls.br.mouseUpHandler = function() {
      mouseUpCalled = true;
    };
    rect.controls.br.mouseDownHandler = function() {
      mouseDownCalled = true;
    };
    const group = new fabric.Group([rect, new fabric.Rect({ left: 100, top: 100, width: 3, height: 3 })], { interactive: true, subTargetCheck: true, scaleX: 2 });
    canvas.add(group);
    canvas.setActiveObject(rect);
    canvas.__onMouseDown(e);
    canvas.__onMouseMove(e1);
    canvas.__onMouseMove(e2);
    canvas.__onMouseUp(e2);
    assert.equal(mouseUpCalled, true, 'mouse up handler for control has been called');
    assert.equal(mouseDownCalled, true, 'mouse down handler for control has been called');
    assert.deepEqual(rect.calcTransformMatrix(), [3, 0, 0, 3, 4.5, 4.5], 'transform matrix');
    assert.deepEqual(rect.getXY(), new fabric.Point(), 'position is maintained');
  });

  QUnit.test('dragging a nested target', function (assert) {
    var e = { clientX: 1, clientY: 1, which: 1 };
    var e1 = { clientX: 6, clientY: 6, which: 1 };
    var e2 = { clientX: 9, clientY: 9, which: 1 };
    var rect = new fabric.Rect({ left: 0, top: 0, width: 3, height: 3, strokeWidth: 0, scaleX: 0.5 });
    rect.controls = {};
    const group = new fabric.Group([rect, new fabric.Rect({ left: 100, top: 100, width: 3, height: 3 })], { interactive: true, subTargetCheck: true, scaleX: 2 });
    canvas.add(group);
    canvas.setActiveObject(rect);
    canvas.__onMouseDown(e);
    canvas.__onMouseMove(e1);
    canvas.__onMouseMove(e2);
    canvas.__onMouseUp(e2);
    assert.deepEqual(rect.calcTransformMatrix(), [1, 0, 0, 1, 9.5, 9.5], 'transform matrix');
    assert.deepEqual(rect.getXY(), new fabric.Point(8, 8), 'position changed by 8 pixels');
  });

  QUnit.test('A transform will call mouseup and mousedown on the control', function(assert) {
    var e = { clientX: 3, clientY: 3, which: 1 };
    var e1 = { clientX: 6, clientY: 6, which: 1 };
    var e2 = { clientX: 9, clientY: 9, which: 1 };
    var rect = new fabric.Rect({ left: 0, top: 0, width: 3, height: 3, strokeWidth: 0 });
    var mouseUpCalled = false;
    var mouseDownCalled = false;
    rect.controls = {
      br: rect.controls.br,
    };
    rect.controls.br.mouseUpHandler = function() {
      mouseUpCalled = true;
    };
    rect.controls.br.mouseDownHandler = function() {
      mouseDownCalled = true;
    };
    canvas.add(rect);
    canvas.setActiveObject(rect);
    canvas.__onMouseDown(e);
    canvas.__onMouseMove(e1);
    canvas.__onMouseMove(e2);
    canvas.__onMouseUp(e2);
    assert.equal(mouseUpCalled, true, 'mouse up handler for control has been called');
    assert.equal(mouseDownCalled, true, 'mouse down handler for control has been called');
  });

  QUnit.test('A transform than ends outside the object will call mouseup handler', function(assert) {
    var e = { clientX: 3, clientY: 3, which: 1 };
    var e1 = { clientX: 6, clientY: 6, which: 1 };
    var e2 = { clientX: 9, clientY: 9, which: 1 };
    var e3 = { clientX: 100, clientY: 100, which: 1 };
    var rect = new fabric.Rect({ left: 0, top: 0, width: 3, height: 3, strokeWidth: 0 });
    var mouseUpCalled = false;
    rect.controls = {
      br: rect.controls.br,
    };
    rect.controls.br.mouseUpHandler = function() {
      mouseUpCalled = true;
    };
    canvas.add(rect);
    canvas.setActiveObject(rect);
    canvas.__onMouseDown(e);
    canvas.__onMouseMove(e1);
    canvas.__onMouseMove(e2);
    canvas.__onMouseUp(e3);
    assert.equal(mouseUpCalled, true, 'mouse up handler for control has been called anyway');
  });

  QUnit.test('A transform than ends on a new control, calls both mouseup handler', function(assert) {
    var e = { clientX: 3, clientY: 3, which: 1 };
    var e1 = { clientX: 6, clientY: 6, which: 1 };
    var e2 = { clientX: 9, clientY: 9, which: 1 };
    var e3 = { clientX: 9, clientY: 3, which: 1 };
    var rect = new fabric.Rect({ left: 0, top: 0, width: 3, height: 3, strokeWidth: 0 });
    var mouseUpCalled1 = false;
    var mouseUpCalled2 = false;

    rect.controls = {
      br: rect.controls.br,
      tr: rect.controls.tr,
    };
    rect.controls.br.mouseUpHandler = function() {
      mouseUpCalled1 = true;
    };
    rect.controls.tr.mouseUpHandler = function() {
      mouseUpCalled2 = true;
    };
    canvas.add(rect);
    canvas.setActiveObject(rect);
    canvas.__onMouseDown(e);
    canvas.__onMouseMove(e1);
    canvas.__onMouseMove(e2);
    canvas.__onMouseUp(e3);
    assert.equal(mouseUpCalled1, true, 'mouse up handler for rect has been called anyway');
    assert.equal(mouseUpCalled2, true, 'mouse up handler for rect2 has been called');
  });

  QUnit.test('Fabric event fired - Drop', function (assert) {
    var eventNames = ['drop:before', 'drop'];
    var c = new fabric.Canvas();
    var fired = [];
    eventNames.forEach(function (eventName) {
      c.on(eventName, function () {
        fired.push(eventName);
      });
    });
    var event = fabric.getDocument().createEvent('HTMLEvents');
    event.initEvent('drop', true, true);
    c.upperCanvasEl.dispatchEvent(event);
    assert.deepEqual(fired, eventNames, 'bad drop event fired');
  });

  QUnit.test('drag event cycle', async function (assert) {
    async function testDragCycle(cycle, canDrop) {
      var c = new fabric.Canvas();
      var rect = new fabric.Rect({ width: 10, height: 10 });
      rect.canDrop = function () {
        return canDrop;
      }
      c.add(rect);
      var registery = [], canvasRegistry = [];
      cycle.forEach(eventName => {
        rect.once(eventName, function () {
          registery.push(eventName);
        });
        c.once(eventName, function (opt) {
          assert.equal(opt.target, rect, eventName + ' on canvas has rect as a target');
          canvasRegistry.push(eventName);
        });
        var event = fabric.getDocument().createEvent('HTMLEvents');
        event.initEvent(eventName, true, true);
        event.clientX = 5;
        event.clientY = 5;
        c.upperCanvasEl.dispatchEvent(event);
      });
      await c.dispose();
      assert.equal(canvasRegistry.length, cycle.length, 'should fire cycle on canvas');
      assert.deepEqual(canvasRegistry, cycle, 'should fire all events on canvas');
      return registery
    }
    var cycle, res;
    cycle = ['dragenter', 'dragover', 'dragover', 'dragover', 'drop'];
    res = await testDragCycle(cycle, true);
    assert.deepEqual(res, cycle, 'should fire all events on rect');
    cycle = ['dragenter', 'dragover', 'dragover', 'dragover', 'dragleave'];
    res = await testDragCycle(cycle, true);
    assert.deepEqual(res, cycle, 'should fire all events on rect');
    cycle = ['dragenter', 'dragover', 'dragover', 'dragover', 'drop'];
    res = await testDragCycle(cycle);
    assert.deepEqual(res, cycle, 'should fire all events on rect');
    cycle = ['dragenter', 'dragover', 'dragover', 'dragover', 'dragleave'];
    res = await testDragCycle(cycle);
    assert.deepEqual(res, cycle, 'should fire all events on rect');
  });

  ['mousedown', 'mousemove', 'wheel', 'dblclick'].forEach(function(eventType) {
    QUnit.test('Fabric event fired - ' + eventType, function(assert) {
      var eventname = eventType.slice(0, 5) + ':' + eventType.slice(5);
      if (eventType === 'wheel' || eventType === 'dblclick') {
        eventname = 'mouse:' + eventType;
      }
      var target;
      if (eventType === 'mouseenter') {
        eventname = 'mouse:over';
      }
      var counter = 0;
      var c = new fabric.Canvas();
      var rect = new fabric.Rect({ top: -4, left: -4, width: 12, height: 12 });
      c.add(rect);
      c.on(eventname, function(opt) {
        counter++;
        target = opt.target;
      });
      var event = fabric.getDocument().createEvent('HTMLEvents');
      event.initEvent(eventType, true, true);
      event.clientX = 5;
      event.clientY = 5;
      c.upperCanvasEl.dispatchEvent(event);
      assert.equal(counter, 1, eventname + ' fabric event fired');
      assert.equal(target, rect, eventname + ' on canvas has rect as a target');
    });
  });

  QUnit.test('mouseenter (mouse:over)', function (assert) {
    var eventname = 'mouse:over'
    var counter = 0;
    var c = new fabric.Canvas();
    c.on(eventname, function () {
      counter++;
    });
    var event = fabric.getDocument().createEvent('HTMLEvents');
    event.initEvent('mouseenter', true, true);
    c.upperCanvasEl.dispatchEvent(event);
    assert.equal(counter, 1, eventname + ' fabric event fired');
  });

  QUnit.test('mouseout', function (assert) {
    var eventName = 'mouseout';
    var canvasEventName = 'mouse:out';
    var c = new fabric.Canvas();
    var o1 = new fabric.Object();
    var o2 = new fabric.Object();
    var o3 = new fabric.Object();
    var control = [];
    var targetControl = [];
    [o1, o2, o3].forEach(target => {
      target.on(canvasEventName.replace(':', ''), () => {
        targetControl.push(target);
      });
    });
    canvas.add(o1, o2, o3);
    c.on(canvasEventName, function (ev) {
      control.push(ev);
    });
    var event = fabric.getDocument().createEvent('HTMLEvents');
    event.initEvent(eventName, true, true);

    //  with targets
    c._hoveredTarget = o3;
    c._hoveredTargets = [o2, o1];
    c.upperCanvasEl.dispatchEvent(event);
    assert.equal(c._hoveredTarget, null, 'should clear `_hoveredTarget` ref');
    assert.deepEqual(c._hoveredTargets, [], 'should clear `_hoveredTargets` ref');
    const expected = [o3, o2, o1];
    assert.deepEqual(control.map(ev => ev.target), expected, 'should equal control');
    assert.deepEqual(targetControl, expected, 'should equal target control');

    //  without targets
    control = [];
    targetControl = [];
    c.upperCanvasEl.dispatchEvent(event);
    assert.equal(control.length, 1, 'should have fired once');
    assert.equal(control[0].target, null, 'no target should be referenced');
    assert.deepEqual(targetControl, [], 'no target should be referenced');
  });

  QUnit.test('mouseover and mouseout with subtarget check', function(assert) {
    var rect1 = new fabric.Rect({ width: 5, height: 5, left: 5, top: 0, strokeWidth: 0, name: 'rect1' });
    var rect2 = new fabric.Rect({ width: 5, height: 5, left: 5, top: 5, strokeWidth: 0, name: 'rect2' });
    var rect3 = new fabric.Rect({ width: 5, height: 5, left: 0, top: 5, strokeWidth: 0, name: 'rect3' });
    var rect4 = new fabric.Rect({ width: 5, height: 5, left: 0, top: 0, strokeWidth: 0, name: 'rect4' });
    var rect5 = new fabric.Rect({ width: 5, height: 5, left: 2.5, top: 2.5, strokeWidth: 0, name: 'rect5' });
    var group1 = new fabric.Group([rect1, rect2], { subTargetCheck: true, name: 'group1' });
    var group2 = new fabric.Group([rect3, rect4], { subTargetCheck: true, name: 'group2' });
    // a group with 2 groups, with 2 rects each, one group left one group right
    // each with 2 rects vertically aligned
    var group = new fabric.Group([group1, group2], { subTargetCheck: true, name: 'group' });
    var c = new fabric.Canvas();
    var targetArray = [];
    var targetOutArray = [];
    [rect1, rect2, rect3, rect4, rect5, group1, group2, group].forEach(function(t) {
      t.on('mouseover', function(opt) {
        targetArray.push(opt.target);
      });
      t.on('mouseout', function(opt) {
        targetOutArray.push(opt.target);
      });
    });
    c.add(group, rect5);
    simulateEvent(c.upperCanvasEl, 'mousemove', {
      pointerX: 1, pointerY: 1
    });
    assert.equal(targetArray[0], group, 'first hit is group');
    assert.equal(targetArray[2], group2, 'then hit group2');
    assert.equal(targetArray[1], rect4, 'then hit rect4');
    assert.equal(targetOutArray.length, 0, 'no target out');

    targetArray = [];
    targetOutArray = [];
    simulateEvent(c.upperCanvasEl, 'mousemove', {
      pointerX: 5, pointerY: 5
    });
    assert.equal(targetArray[0], rect5, 'first hit is target5');
    assert.equal(targetArray.length, 1, 'only one target');
    assert.equal(targetOutArray[0], group, 'first targetOutArray is group');
    assert.equal(targetOutArray[2], group2, 'then targetOutArray group2');
    assert.equal(targetOutArray[1], rect4, 'then targetOutArray rect4');

    targetArray = [];
    targetOutArray = [];
    simulateEvent(c.upperCanvasEl, 'mousemove', {
      pointerX: 9, pointerY: 9
    });
    assert.equal(targetArray[0], group, 'first hit is group');
    assert.equal(targetArray[2], group1, 'then hit group1');
    assert.equal(targetArray[1], rect2, 'then hit rect2');
    assert.equal(targetOutArray.length, 1, 'only one target out when moving away from rect 5');
    assert.equal(targetOutArray[0], rect5, 'rect5 fires out');

    targetArray = [];
    targetOutArray = [];
    simulateEvent(c.upperCanvasEl, 'mousemove', {
      pointerX: 9, pointerY: 1
    });
    assert.equal(targetArray[0], rect1, 'the only target changing is rect1');
    assert.equal(targetArray.length, 1, 'only one target entering ');
    assert.equal(targetOutArray.length, 1, 'one target out');
    assert.equal(targetOutArray[0], rect2, 'the only target out is rect2');
  });

  QUnit.test('Fabric mouseover, mouseout events fire for subTargets when subTargetCheck is enabled', function(assert){
    var done = assert.async();
    var counterOver = 0, counterOut = 0, canvas = new fabric.Canvas();
    function setSubTargetCheckRecursive(obj) {
      if (obj._objects) {
        obj._objects.forEach(setSubTargetCheckRecursive);
      }
      obj.subTargetCheck = true;
      obj.on('mouseover', function() {
        counterOver++;
      });
      obj.on('mouseout', function() {
        counterOut++;
      });
    }
    canvas.loadFromJSON(SUB_TARGETS_JSON).then(function() {
      var activeSelection = canvas.getActiveSelection();
      activeSelection.add(...canvas.getObjects());
      canvas.setActiveObject(activeSelection);
      setSubTargetCheckRecursive(activeSelection);

      // perform MouseOver event on a deeply nested subTarget
      var moveEvent = fabric.getDocument().createEvent('HTMLEvents');
      moveEvent.initEvent('mousemove', true, true);
      var target = canvas.item(1);
      canvas.targets = [
        target.item(1),
        target.item(1).item(1),
        target.item(1).item(1).item(1)
      ];
      canvas._fireOverOutEvents(moveEvent, target);
      assert.equal(counterOver, 4, 'mouseover fabric event fired 4 times for primary hoveredTarget & subTargets');
      assert.equal(canvas._hoveredTarget, target, 'activeSelection is _hoveredTarget');
      assert.equal(canvas._hoveredTargets.length, 3, '3 additional subTargets are captured as _hoveredTargets');

      // perform MouseOut even on all hoveredTargets
      canvas.targets = [];
      canvas._fireOverOutEvents(moveEvent, null);
      assert.equal(counterOut, 4, 'mouseout fabric event fired 4 times for primary hoveredTarget & subTargets');
      assert.equal(canvas._hoveredTarget, null, '_hoveredTarget has been set to null');
      assert.equal(canvas._hoveredTargets.length, 0, '_hoveredTargets array is empty');
      done();
    });
  });

  // TODO: QUnit.test('mousemove: subTargetCheck: setCursorFromEvent considers subTargets')
  // TODO: QUnit.test('mousemove: subTargetCheck: setCursorFromEvent considers subTargets in reverse order, so the top-most subTarget's .hoverCursor takes precedence')

  QUnit.test('mouse move and group selector', function(assert){
    var e = { clientX: 30, clientY: 40, which: 1, target: canvas.upperCanvasEl };
    var expectedGroupSelector = { x: 15, y: 30, deltaX: 65, deltaY: 90};
    canvas.absolutePan(new fabric.Point(50, 80));
    canvas._groupSelector = {x: 15, y: 30, deltaX: 0, deltaY: 0};
    canvas.__onMouseMove(e);
    assert.deepEqual(canvas._groupSelector, expectedGroupSelector, 'groupSelector is updated');
  });

  QUnit.test('mouseEnter removes _hoveredTarget', function(assert) {
    var event = fabric.getDocument().createEvent('MouseEvent');
    event.initEvent('mouseenter', true, true);
    var c = new fabric.Canvas();
    c._hoveredTarget = new fabric.Object();
    c.upperCanvasEl.dispatchEvent(event);
    assert.equal(c._hoveredTarget, null, '_hoveredTarget has been removed');
  });

  QUnit.test('mouseEnter does not remove _hoveredTarget if a transform is happening', function(assert) {
    var event = fabric.getDocument().createEvent('MouseEvent');
    event.initEvent('mouseenter', true, true);
    var c = new fabric.Canvas();
    var obj = new fabric.Object();
    c._hoveredTarget = obj;
    c._currentTransform = {};
    c.upperCanvasEl.dispatchEvent(event);
    assert.equal(c._hoveredTarget, obj, '_hoveredTarget has been not removed');
  });

  QUnit.test('mouseEnter removes __corner', function(assert) {
    var event = fabric.getDocument().createEvent('MouseEvent');
    event.initEvent('mouseenter', true, true);
    var c = new fabric.Canvas();
    var obj = new fabric.Object({ top: 100, left: 100 });
    c.add(obj);
    c.setActiveObject(obj);
    obj.__corner = 'test';
    c.upperCanvasEl.dispatchEvent(event);
    assert.equal(obj.__corner, undefined, '__corner has been resetted from activeObject');
  });

  QUnit.test('mouseEnter does not removes __corner if there is a transform', function(assert) {
    var event = fabric.getDocument().createEvent('MouseEvent');
    event.initEvent('mouseenter', true, true);
    var c = new fabric.Canvas();
    var obj = new fabric.Object();
    c._currentTransform = {};
    c.setActiveObject(obj);
    obj.__corner = 'test';
    c.upperCanvasEl.dispatchEvent(event);
    assert.equal(obj.__corner, 'test', '__corner has not been reset');
  });

  // this test is important. As today we do not havenymore a unique function that give us the
  // status of the action. that logic is replicated in style handler and action handler.
  // this is a cleanup of the current work that we need to do.
  // this wasn't a user facing feature, although the method was public and documented in JSDOCS
  // QUnit.test('actionIsDisabled ', function(assert) {
  //   assert.ok(typeof fabric.Canvas.prototype.actionIsDisabled === 'function', 'actionIsDisabled is a function');
  //   var key = canvas.altActionKey;
  //   var target = new fabric.Object();
  //   var e = { };
  //   e[key] = false;
  //   assert.equal(!!canvas.actionIsDisabled('mt', target, e), false, 'action is not disabled');
  //   assert.equal(!!canvas.actionIsDisabled('mb', target, e), false, 'action is not disabled');
  //   assert.equal(!!canvas.actionIsDisabled('ml', target, e), false, 'action is not disabled');
  //   assert.equal(!!canvas.actionIsDisabled('mr', target, e), false, 'action is not disabled');
  //   assert.equal(!!canvas.actionIsDisabled('tl', target, e), false, 'action is not disabled');
  //   assert.equal(!!canvas.actionIsDisabled('tr', target, e), false, 'action is not disabled');
  //   assert.equal(!!canvas.actionIsDisabled('bl', target, e), false, 'action is not disabled');
  //   assert.equal(!!canvas.actionIsDisabled('br', target, e), false, 'action is not disabled');
  //   assert.equal(!!canvas.actionIsDisabled('mtr', target, e), false, 'action is not disabled');
  //   target = new fabric.Object();
  //   target.lockScalingX = true;
  //
  //   assert.equal(!!canvas.actionIsDisabled('mt', target, e), false, 'mt action is not disabled lockScalingX');
  //   assert.equal(!!canvas.actionIsDisabled('mb', target, e), false, 'mb action is not disabled lockScalingX');
  //   assert.equal(!!canvas.actionIsDisabled('ml', target, e), true, 'ml action is disabled lockScalingX');
  //   assert.equal(!!canvas.actionIsDisabled('mr', target, e), true, 'mr action is disabled lockScalingX');
  //   assert.equal(!!canvas.actionIsDisabled('tl', target, e), true, 'tl action is disabled lockScalingX');
  //   assert.equal(!!canvas.actionIsDisabled('tr', target, e), true, 'tr action is disabled lockScalingX');
  //   assert.equal(!!canvas.actionIsDisabled('bl', target, e), true, 'bl action is disabled lockScalingX');
  //   assert.equal(!!canvas.actionIsDisabled('br', target, e), true, 'br action is disabled lockScalingX');
  //   assert.equal(!!canvas.actionIsDisabled('mtr', target, e), false, 'mtr action is not disabled lockScalingX');
  //   target = new fabric.Object();
  //   target.lockScalingY = true;
  //   assert.equal(!!canvas.actionIsDisabled('mt', target, e), true, 'mt action is disabled lockScalingY');
  //   assert.equal(!!canvas.actionIsDisabled('mb', target, e), true, 'mb action is disabled lockScalingY');
  //   assert.equal(!!canvas.actionIsDisabled('ml', target, e), false, 'ml action is not disabled lockScalingY');
  //   assert.equal(!!canvas.actionIsDisabled('mr', target, e), false, 'mr action is not disabled lockScalingY');
  //   assert.equal(!!canvas.actionIsDisabled('tl', target, e), true, 'tl action is not disabled lockScalingY');
  //   assert.equal(!!canvas.actionIsDisabled('tr', target, e), true, 'tr action is not disabled lockScalingY');
  //   assert.equal(!!canvas.actionIsDisabled('bl', target, e), true, 'bl action is not disabled lockScalingY');
  //   assert.equal(!!canvas.actionIsDisabled('br', target, e), true, 'br action is not disabled lockScalingY');
  //   assert.equal(!!canvas.actionIsDisabled('mtr', target, e), false, 'mtr action is not disabledlockScalingY');
  //   target = new fabric.Object();
  //   target.lockScalingY = true;
  //   target.lockScalingX = true;
  //   assert.equal(!!canvas.actionIsDisabled('mt', target, e), true, 'mt action is disabled scaling locked');
  //   assert.equal(!!canvas.actionIsDisabled('mb', target, e), true, 'mb action is disabled scaling locked');
  //   assert.equal(!!canvas.actionIsDisabled('ml', target, e), true, 'ml action is disabled scaling locked');
  //   assert.equal(!!canvas.actionIsDisabled('mr', target, e), true, 'mr action is disabled scaling locked');
  //   assert.equal(!!canvas.actionIsDisabled('tl', target, e), true, 'tl action is disabled scaling locked');
  //   assert.equal(!!canvas.actionIsDisabled('tr', target, e), true, 'tr action is disabled scaling locked');
  //   assert.equal(!!canvas.actionIsDisabled('bl', target, e), true, 'bl action is disabled scaling locked');
  //   assert.equal(!!canvas.actionIsDisabled('br', target, e), true, 'br action is disabled scaling locked');
  //   assert.equal(!!canvas.actionIsDisabled('mtr', target, e), false, 'mtr action is not disabled scaling locked');
  //   target = new fabric.Object();
  //   target.lockRotation = true;
  //   assert.equal(!!canvas.actionIsDisabled('mt', target, e), false, 'mt action is not disabled lockRotation');
  //   assert.equal(!!canvas.actionIsDisabled('mb', target, e), false, 'mb action is not disabled lockRotation');
  //   assert.equal(!!canvas.actionIsDisabled('ml', target, e), false, 'ml action is not disabled lockRotation');
  //   assert.equal(!!canvas.actionIsDisabled('mr', target, e), false, 'mr action is not disabled lockRotation');
  //   assert.equal(!!canvas.actionIsDisabled('tl', target, e), false, 'tl action is not disabled lockRotation');
  //   assert.equal(!!canvas.actionIsDisabled('tr', target, e), false, 'tr action is not disabled lockRotation');
  //   assert.equal(!!canvas.actionIsDisabled('bl', target, e), false, 'bl action is not disabled lockRotation');
  //   assert.equal(!!canvas.actionIsDisabled('br', target, e), false, 'br action is not disabled lockRotation');
  //   assert.equal(!!canvas.actionIsDisabled('mtr', target, e), true, 'mtr action is disabled lockRotation');
  //   target = new fabric.Object();
  //   target.lockSkewingX = true;
  //   target.lockSkewingY = true;
  //   assert.equal(!!canvas.actionIsDisabled('mt', target, e), false, 'mt action is not disabled lockSkewing');
  //   assert.equal(!!canvas.actionIsDisabled('mb', target, e), false, 'mb action is not disabled lockSkewing');
  //   assert.equal(!!canvas.actionIsDisabled('ml', target, e), false, 'ml action is not disabled lockSkewing');
  //   assert.equal(!!canvas.actionIsDisabled('mr', target, e), false, 'mr action is not disabled lockSkewing');
  //   assert.equal(!!canvas.actionIsDisabled('tl', target, e), false, 'tl action is not disabled lockSkewing');
  //   assert.equal(!!canvas.actionIsDisabled('tr', target, e), false, 'tr action is not disabled lockSkewing');
  //   assert.equal(!!canvas.actionIsDisabled('bl', target, e), false, 'bl action is not disabled lockSkewing');
  //   assert.equal(!!canvas.actionIsDisabled('br', target, e), false, 'br action is not disabled lockSkewing');
  //   assert.equal(!!canvas.actionIsDisabled('mtr', target, e), false, 'mtr action is not disabled lockSkewing');
  //   e[key] = true;
  //   target = new fabric.Object();
  //   target.lockSkewingY = true;
  //   assert.equal(!!canvas.actionIsDisabled('mt', target, e), false, 'mt action is not disabled lockSkewingY');
  //   assert.equal(!!canvas.actionIsDisabled('mb', target, e), false, 'mb action is not disabled lockSkewingY');
  //   assert.equal(!!canvas.actionIsDisabled('ml', target, e), true, 'ml action is disabled lockSkewingY');
  //   assert.equal(!!canvas.actionIsDisabled('mr', target, e), true, 'mr action is disabled lockSkewingY');
  //   assert.equal(!!canvas.actionIsDisabled('tl', target, e), false, 'tl action is not disabled lockSkewingY');
  //   assert.equal(!!canvas.actionIsDisabled('tr', target, e), false, 'tr action is not disabled lockSkewingY');
  //   assert.equal(!!canvas.actionIsDisabled('bl', target, e), false, 'bl action is not disabled lockSkewingY');
  //   assert.equal(!!canvas.actionIsDisabled('br', target, e), false, 'br action is not disabled lockSkewingY');
  //   assert.equal(!!canvas.actionIsDisabled('mtr', target, e), false, 'mtr action is not disabled lockSkewingY');
  //
  //   e[key] = true;
  //   target = new fabric.Object();
  //   target.lockSkewingX = true;
  //   assert.equal(!!canvas.actionIsDisabled('mt', target, e), true, 'mt action is disabled lockSkewingX');
  //   assert.equal(!!canvas.actionIsDisabled('mb', target, e), true, 'mb action is disabled lockSkewingX');
  //   assert.equal(!!canvas.actionIsDisabled('ml', target, e), false, 'ml action is not disabled lockSkewingX');
  //   assert.equal(!!canvas.actionIsDisabled('mr', target, e), false, 'mr action is not disabled lockSkewingX');
  //   assert.equal(!!canvas.actionIsDisabled('tl', target, e), false, 'tl action is not disabled lockSkewingX');
  //   assert.equal(!!canvas.actionIsDisabled('tr', target, e), false, 'tr action is not disabled lockSkewingX');
  //   assert.equal(!!canvas.actionIsDisabled('bl', target, e), false, 'bl action is not disabled lockSkewingX');
  //   assert.equal(!!canvas.actionIsDisabled('br', target, e), false, 'br action is not disabled lockSkewingX');
  //   assert.equal(!!canvas.actionIsDisabled('mtr', target, e), false, 'mtr action is not disabled lockSkewingX');
  // });

  QUnit.test('_setCursorFromEvent ', function(assert) {
    var key = canvas.altActionKey;
    var key2 = canvas.uniScaleKey;
    var target = new fabric.Rect({ width: 100, height: 100 });
    canvas.add(target);
    canvas.setActiveObject(target);
    target.setCoords();
    const expected = {
      mt: 'n-resize',
      mb: 's-resize',
      ml: 'w-resize',
      mr: 'e-resize',
      tl: 'nw-resize',
      tr: 'ne-resize',
      bl: 'sw-resize',
      br: 'se-resize',
      mtr: 'crosshair',
    };
    Object.entries(target.oCoords).forEach(([corner, coords]) => {
      const e = { clientX: coords.x, clientY: coords.y, [key]: false };
      canvas._setCursorFromEvent(e, target);
      assert.equal(canvas.upperCanvasEl.style.cursor, expected[corner], `${expected[corner]} action is not disabled`);
    })

    const expectedLockScalinX = {
      mt: 'n-resize',
      mb: 's-resize',
      ml: 'not-allowed',
      mr: 'not-allowed',
      tl: 'not-allowed',
      tr: 'not-allowed',
      bl: 'not-allowed',
      br: 'not-allowed',
      mtr: 'crosshair',
    };
    target.lockScalingX = true;
    Object.entries(target.oCoords).forEach(([corner, coords]) => {
      const e = { clientX: coords.x, clientY: coords.y, [key]: false };
      canvas._setCursorFromEvent(e, target);
      assert.equal(canvas.upperCanvasEl.style.cursor, expectedLockScalinX[corner], `${corner} is ${expectedLockScalinX[corner]} for lockScalingX`);
    });
    // when triggering the uniscaleKey corners are ok
    const expectedUniScale = {
      mt: 'ew-resize', // skewing
      mb: 'ew-resize', // skewing
      ml: 'ns-resize', // skewing
      mr: 'ns-resize', // skewing
      tl: 'nw-resize',
      tr: 'ne-resize',
      bl: 'sw-resize',
      br: 'se-resize',
      mtr: 'crosshair',
    };
    Object.entries(target.oCoords).forEach(([corner, coords]) => {
      const e = { clientX: coords.x, clientY: coords.y, [key]: false, [key2]: true };
      canvas._setCursorFromEvent(e, target);
      assert.equal(canvas.upperCanvasEl.style.cursor, expectedUniScale[corner], `${corner} is ${expectedUniScale[corner]} for uniScaleKey pressed`);
    });

    const expectedLockScalinY = {
      mt: 'not-allowed',
      mb: 'not-allowed',
      ml: 'w-resize',
      mr: 'e-resize',
      tl: 'not-allowed',
      tr: 'not-allowed',
      bl: 'not-allowed',
      br: 'not-allowed',
      mtr: 'crosshair',
    };
    target.lockScalingX = false;
    target.lockScalingY = true;
    Object.entries(target.oCoords).forEach(([corner, coords]) => {
      const e = { clientX: coords.x, clientY: coords.y, [key]: false };
      canvas._setCursorFromEvent(e, target);
      assert.equal(canvas.upperCanvasEl.style.cursor, expectedLockScalinY[corner], `${corner} is ${expectedLockScalinY[corner]} for lockScalingY`);
    });
    const expectedLockScalinYUniscaleKey = {
      mt: 'ew-resize', // skewing
      mb: 'ew-resize', // skewing
      ml: 'ns-resize', // skewing
      mr: 'ns-resize', // skewing
      tl: 'nw-resize',
      tr: 'ne-resize',
      bl: 'sw-resize',
      br: 'se-resize',
      mtr: 'crosshair',
    };
    Object.entries(target.oCoords).forEach(([corner, coords]) => {
      const e = { clientX: coords.x, clientY: coords.y, [key]: false, [key2]: true };
      canvas._setCursorFromEvent(e, target);
      assert.equal(canvas.upperCanvasEl.style.cursor, expectedLockScalinYUniscaleKey[corner], `${corner} is ${expectedLockScalinYUniscaleKey[corner]} for lockScalingY + uniscaleKey`);
    });

    const expectedAllLock = {
      mt: 'not-allowed',
      mb: 'not-allowed',
      ml: 'not-allowed',
      mr: 'not-allowed',
      tl: 'not-allowed',
      tr: 'not-allowed',
      bl: 'not-allowed',
      br: 'not-allowed',
      mtr: 'crosshair',
    };
    target.lockScalingY = true;
    target.lockScalingX = true;
    Object.entries(target.oCoords).forEach(([corner, coords]) => {
      const e = { clientX: coords.x, clientY: coords.y, [key]: false };
      canvas._setCursorFromEvent(e, target);
      assert.equal(canvas.upperCanvasEl.style.cursor, expectedAllLock[corner], `${corner} is ${expectedAllLock[corner]} for all locked`);
    });
    // when pressing uniscale key
    const expectedAllLockUniscale = {
      mt: 'ew-resize', // skewing
      mb: 'ew-resize', // skewing
      ml: 'ns-resize', // skewing
      mr: 'ns-resize', // skewing
      tl: 'not-allowed',
      tr: 'not-allowed',
      bl: 'not-allowed',
      br: 'not-allowed',
      mtr: 'crosshair',
    };
    Object.entries(target.oCoords).forEach(([corner, coords]) => {
      const e = { clientX: coords.x, clientY: coords.y, [key]: false, [key2]: true };
      canvas._setCursorFromEvent(e, target);
      assert.equal(canvas.upperCanvasEl.style.cursor, expectedAllLockUniscale[corner], `${corner} is ${expectedAllLockUniscale[corner]} for all locked + uniscale`);
    });

    target.lockRotation = true;
    target.lockScalingY = false;
    target.lockScalingX = false;
    const e = { clientX: target.oCoords.mtr.x, clientY: target.oCoords.mtr.y, [key]: false };
    canvas._setCursorFromEvent(e, target);
    assert.equal(canvas.upperCanvasEl.style.cursor, 'not-allowed', `mtr is not allowed for locked rotation`);

    target.lockSkewingX = true;
    target.lockSkewingY = true;
    target.lockRotation = false;
    // with lock-skewing we are back at normal
    Object.entries(target.oCoords).forEach(([corner, coords]) => {
      const e = { clientX: coords.x, clientY: coords.y, [key]: false };
      canvas._setCursorFromEvent(e, target);
      assert.equal(canvas.upperCanvasEl.style.cursor, expected[corner], `${key} is ${expected[corner]} for both lockskewing`);
    });

    // trying to skew while lock skew Y
    target.lockSkewingY = true;
    target.lockSkewingX = false;
    const expectedLockSkewingY = {
      mt: 'ew-resize', // skewing
      mb: 'ew-resize', // skewing
      ml: 'not-allowed', // skewing
      mr: 'not-allowed', // skewing
      tl: 'nw-resize',
      tr: 'ne-resize',
      bl: 'sw-resize',
      br: 'se-resize',
      mtr: 'crosshair',
    };
    Object.entries(target.oCoords).forEach(([corner, coords]) => {
      const e = { clientX: coords.x, clientY: coords.y, [key]: true };
      canvas._setCursorFromEvent(e, target);
      assert.equal(canvas.upperCanvasEl.style.cursor, expectedLockSkewingY[corner], `${corner} ${expectedLockSkewingY[corner]} for lockSkewingY`);
    });

    // trying to skew while lock skew X
    target.lockSkewingY = false;
    target.lockSkewingX = true;
    const expectedLockSkewingX = {
      mt: 'not-allowed', // skewing
      mb: 'not-allowed', // skewing
      ml: 'ns-resize', // skewing
      mr: 'ns-resize', // skewing
      tl: 'nw-resize',
      tr: 'ne-resize',
      bl: 'sw-resize',
      br: 'se-resize',
      mtr: 'crosshair',
    };
    Object.entries(target.oCoords).forEach(([corner, coords]) => {
      const e = { clientX: coords.x, clientY: coords.y, [key]: true };
      canvas._setCursorFromEvent(e, target);
      assert.equal(canvas.upperCanvasEl.style.cursor, expectedLockSkewingX[corner], `${corner} is ${expectedLockSkewingX[corner]} for lockSkewingX`);
    });
  });

  QUnit.test('text editing manager', async function (assert) {
    const canvas = new fabric.Canvas();
    const manager = canvas.textEditingManager;
    assert.ok(manager, 'should exist');
    assert.deepEqual(manager.targets, [], 'should be empty');

    const a = new fabric.IText('test');
    const b = new fabric.IText('test');
    const e = { clientX: 30, clientY: 40, which: 1, target: canvas.upperCanvasEl };

    canvas.add(a);
    assert.deepEqual(manager.targets, [a]);
    canvas.remove(a);
    assert.deepEqual(manager.targets, []);
    canvas.add(a);
    assert.deepEqual(manager.targets, [a]);
    canvas.add(b);
    assert.deepEqual(manager.targets, [a, b]);
    a.enterEditing();
    assert.ok(a.isEditing);
    b.enterEditing();
    assert.ok(b.isEditing);
    assert.ok(!a.isEditing, 'should have called exit editing');
    manager.register(b);
    manager.exitTextEditing();
    assert.ok(!manager.target, 'should unregister b');
    assert.ok(!b.isEditing, 'b should exit editing');
    b.enterEditing();
    b.fire('mousedown', { e, pointer: new fabric.Point(30, 40) });
    assert.ok(manager.target === b, 'should register b');
    const called = [];
    a.updateSelectionOnMouseMove = () => called.push(a);
    b.updateSelectionOnMouseMove = () => called.push(b);
    canvas.__onMouseMove(e);
    assert.deepEqual(called, [b], 'manager is called from mouse move');
    manager.unregister(a);
    assert.ok(manager.target === b, 'should not unregister b');
    a.fire('mouseup', { e, pointer: new fabric.Point(30, 40) });
    assert.ok(manager.target === b, 'should not unregister b');
    canvas.__onMouseUp(e);
    assert.ok(!manager.target, 'should unregister b');
    manager.register(a);
    assert.ok(manager.target === a, 'should register a');
    canvas.remove(a);
    assert.ok(!manager.target, 'should unregister a');
    manager.dispose();
    assert.ok(!manager.target, 'should have disposed ref');
    assert.deepEqual(manager.targets, [], 'should have disposed refs');
    const g = new fabric.Group([a]);
    canvas.add(g);
    assert.deepEqual(manager.targets, [a], 'should register an existing nested instance');
    g.add(b);
    assert.deepEqual(manager.targets, [a, b], 'should register an added nested instance');
    manager.register(b);
    assert.ok(manager.target === b, 'should register b');
    g.remove(b);
    assert.ok(!manager.target, 'should unregister b');
    assert.deepEqual(manager.targets, [a], 'should unregister a nested instance upon removal');
    manager.register(a);
    assert.ok(manager.target === a, 'should register a');
    canvas.remove(g);
    assert.ok(!manager.target, 'should unregister a');
    assert.deepEqual(manager.targets, [], 'should unregister nested instances upon group removal');
    canvas.add(b);
    assert.deepEqual(manager.targets, [b], 'should register instance');
    canvas.clear();
    assert.deepEqual(manager.targets, [], 'clear should clear instances');
    canvas.add(b);
    assert.deepEqual(manager.targets, [b], 'should register instance');
    manager.register(b);
    assert.ok(manager.target === b, 'should register b');
    await canvas.dispose();
    assert.deepEqual(manager.targets, [], 'dispose should clear instances');
    assert.ok(!manager.target, 'should unregister b');
  });
})();
