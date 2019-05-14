(function() {

  var canvas = this.canvas = new fabric.Canvas(null, {enableRetinaScaling: false, width: 600, height: 600});
  var upperCanvasEl = canvas.upperCanvasEl;

  QUnit.module('fabric.Canvas events mixin', {
    beforeEach: function() {
      canvas.cancelRequestedRender();
      canvas.viewportTransform = [1, 0, 0, 1, 0, 0];
      upperCanvasEl.style.display = '';
      canvas.controlsAboveOverlay = fabric.Canvas.prototype.controlsAboveOverlay;
      canvas.preserveObjectStacking = fabric.Canvas.prototype.preserveObjectStacking;
    },
    afterEach: function() {
      canvas.clear();
      canvas.backgroundColor = fabric.Canvas.prototype.backgroundColor;
      canvas.overlayColor = fabric.Canvas.prototype.overlayColor;
      canvas._collectObjects = fabric.Canvas.prototype._collectObjects;
      canvas.off();
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
    var _onBeforeScaleRotate = canvas.onBeforeScaleRotate;
    canvas.onBeforeScaleRotate = function (target) {
      t = target;
      counter++;
    };

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
    assert.equal(counter, corners.length, '_beforeTransform should trigger onBeforeScaleRotate for all corners');
    assert.equal(t, rect, 'onBeforeScaleRotate should receive correct target');

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
    assert.equal(counter, corners.length, '_beforeTransform should trigger onBeforeScaleRotate when canvas is zoomed');
    assert.equal(t, rect, 'onBeforeScaleRotate should receive correct target when canvas is zoomed');

    canvas.zoomToPoint({ x: 0, y: 0 }, 1);
    canvas.onBeforeScaleRotate = _onBeforeScaleRotate;
  });

  QUnit.test('cache and reset event properties', function(assert) {
    var e = { clientX: 30, clientY: 30, which: 1, target: canvas.upperCanvasEl };
    var rect = new fabric.Rect({ width: 60, height: 60 });
    canvas._currentTransform = null;
    canvas.add(rect);
    assert.equal(canvas._pointer, null);
    assert.equal(canvas._absolutePointer, null);
    assert.equal(canvas._target, null);
    canvas.viewportTransform = [2, 0, 0, 2, 0, 0];
    canvas._cacheTransformEventData(e);
    assert.deepEqual(canvas._pointer, { x: 30, y: 30 }, 'pointer has been cached');
    assert.deepEqual(canvas._absolutePointer, new fabric.Point(15, 15), 'absolute pointer has been cached');
    assert.ok(canvas._target === rect);
    canvas._resetTransformEventData();
    assert.equal(canvas._pointer, null);
    assert.equal(canvas._absolutePointer, null);
    assert.equal(canvas._target, null);
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
    canvas.__onMouseDown({ which: 1, target: canvas.upperCanvasEl  });
    assert.equal(clickCount, 1, 'mouse down fired');
    clickCount = 0;
    canvas.__onMouseDown({ which: 3, target: canvas.upperCanvasEl  });
    assert.equal(clickCount, 0, 'rightclick did not fire a mouse:down event');
    canvas.fireRightClick = true;
    canvas.__onMouseDown({ which: 3, target: canvas.upperCanvasEl  });
    assert.equal(clickCount, 1, 'rightclick did fire a mouse:down event');
    clickCount = 0;
    canvas.__onMouseDown({ which: 2, target: canvas.upperCanvasEl  });
    assert.equal(clickCount, 0, 'middleClick did not fire a mouse:down event');
    canvas.fireMiddleClick = true;
    canvas.__onMouseDown({ which: 2, target: canvas.upperCanvasEl  });
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
    var e = { clientX: 30, clientY: 30, which: 1, target: canvas.upperCanvasEl };
    var rect = new fabric.Rect({ width: 60, height: 60 });
    var expectedGroupSelector = { ex: 30, ey: 30, top: 0, left: 0 };
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

  QUnit.test('specific bug #5317 for shift+click and active selection', function(assert) {
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

  QUnit.test('mouse:up isClick = true', function(assert) {
    var e = { clientX: 30, clientY: 30, which: 1, target: canvas.upperCanvasEl  };
    var isClick = false;
    canvas.on('mouse:up', function(opt) {
      isClick = opt.isClick;
    });
    canvas.__onMouseDown(e);
    canvas.__onMouseUp(e);
    assert.equal(isClick, true, 'without moving the pointer, the click is true');
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

  QUnit.test('mouse:up isClick = false', function(assert) {
    var e = { clientX: 30, clientY: 30, which: 1 };
    var e2 = { clientX: 31, clientY: 31, which: 1 };
    var isClick = true;
    canvas.on('mouse:up', function(opt) {
      isClick = opt.isClick;
    });
    canvas.__onMouseDown(e);
    canvas.__onMouseMove(e2);
    canvas.__onMouseUp(e2);
    assert.equal(isClick, false, 'moving the pointer, the click is false');
  });

  QUnit.test('fires object:modified and object:moved', function(assert) {
    var e = { clientX: 30, clientY: 30, which: 1 };
    var e2 = { clientX: 31, clientY: 31, which: 1 };
    var rect = new fabric.Rect({ left: 0, top: 0, width: 50, height: 50 });
    canvas.add(rect);
    var count = 0;
    var count2 = 0;
    var opt;
    canvas.on('object:modified', function(_opt) {
      count++;
      opt = _opt;
    });
    canvas.on('object:moved', function(_opt) {
      count2++;
      opt = _opt;
    });
    canvas.__onMouseDown(e);
    canvas.__onMouseMove(e2);
    canvas.__onMouseUp(e2);
    assert.equal(count, 1, 'object:modified fired');
    assert.equal(opt.e, e2, 'options match model - event');
    assert.equal(opt.target, rect, 'options match model - target');
    assert.equal(opt.transform.action, 'drag', 'options match model - target');
    assert.equal(count2, 1, 'object:moved fired');
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
    var e = { clientX: 2, clientY: 2, which: 1 };
    var e1 = { clientX: -4, clientY: -4, which: 1 };
    var e2 = { clientX: -6, clientY: -6, which: 1 };
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

  QUnit.test('avoid multiple bindings', function(assert) {
    var c = new fabric.Canvas();
    var eventsArray = [
      c._onMouseDown,
      c._onMouseMove,
      c._onMouseUp,
      c._onResize,
      c._onGesture,
      c._onDrag,
      c._onShake,
      c._onLongPress,
      c._onOrientationChange,
      c._onMouseWheel,
      c._onMouseOut,
      c._onMouseEnter,
      c._onContextMenu,
      c._onDragOver,
      c._onDragEnter,
      c._onDragLeave,
      c._onDrop,
    ];
    // initialize canvas more than once
    c.initialize();
    c.initialize();
    var eventsArray2 = [
      c._onMouseDown,
      c._onMouseMove,
      c._onMouseUp,
      c._onResize,
      c._onGesture,
      c._onDrag,
      c._onShake,
      c._onLongPress,
      c._onOrientationChange,
      c._onMouseWheel,
      c._onMouseOut,
      c._onMouseEnter,
      c._onContextMenu,
      c._onDragOver,
      c._onDragEnter,
      c._onDragLeave,
      c._onDrop,
    ];
    assert.deepEqual(eventsArray, eventsArray2, 'after first initialize, functions do not change.');
  });

  ['DragEnter', 'DragLeave', 'DragOver', 'Drop'].forEach(function(eventType) {
    QUnit.test('avoid multiple registration - ' + eventType, function(assert) {
      var funcName = '_on' + eventType;
      var eventName = eventType.toLowerCase();
      var counter = 0;
      var c = new fabric.Canvas();
      c[funcName] = function() {
        counter++;
      };
      // initialize canvas more than once
      c.initialize(c.lowerCanvasEl);
      c.initialize(c.lowerCanvasEl);
      var event = fabric.document.createEvent('HTMLEvents');
      event.initEvent(eventName, true, true);
      c.upperCanvasEl.dispatchEvent(event);
      assert.equal(counter, 1, eventName + ' listener executed once');
    });
  });

  ['DragEnter', 'DragLeave', 'DragOver', 'Drop'].forEach(function(eventType) {
    QUnit.test('Fabric event fired - ' + eventType, function(assert) {
      var eventName = eventType.toLowerCase();
      var counter = 0;
      var c = new fabric.Canvas();
      c.on(eventName, function() {
        counter++;
      });
      var event = fabric.document.createEvent('HTMLEvents');
      event.initEvent(eventName, true, true);
      c.upperCanvasEl.dispatchEvent(event);
      assert.equal(counter, 1, eventName + ' fabric event fired');
    });
  });

  ['DragEnter', 'DragLeave', 'DragOver', 'Drop'].forEach(function(eventType) {
    QUnit.test('_simpleEventHandler fires on object and canvas' + eventType, function(assert) {
      var eventName = eventType.toLowerCase();
      var counter = 0;
      var target;
      var c = new fabric.Canvas();
      var rect = new fabric.Rect({ width: 10, height: 10 });
      c.add(rect);
      rect.on(eventName, function() {
        counter++;
      });
      c.on(eventName, function(opt) {
        target = opt.target;
      });
      var event = fabric.document.createEvent('HTMLEvents');
      event.initEvent(eventName, true, true);
      event.clientX = 5;
      event.clientY = 5;
      c.upperCanvasEl.dispatchEvent(event);
      assert.equal(counter, 1, eventName + ' fabric event fired on rect');
      assert.equal(target, rect, eventName + ' on canvas has rect as a target');
    });
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
      var event = fabric.document.createEvent('HTMLEvents');
      event.initEvent(eventType, true, true);
      event.clientX = 5;
      event.clientY = 5;
      c.upperCanvasEl.dispatchEvent(event);
      assert.equal(counter, 1, eventname + ' fabric event fired');
      assert.equal(target, rect, eventname + ' on canvas has rect as a target');
    });
  });

  ['mouseout', 'mouseenter'].forEach(function(eventType) {
    QUnit.test('Fabric event fired - ' + eventType, function(assert) {
      var eventname = eventType.slice(0, 5) + ':' + eventType.slice(5);
      if (eventType === 'mouseenter') {
        eventname = 'mouse:over';
      }
      var counter = 0;
      var c = new fabric.Canvas();
      c.on(eventname, function() {
        counter++;
      });
      var event = fabric.document.createEvent('HTMLEvents');
      event.initEvent(eventType, true, true);
      c.upperCanvasEl.dispatchEvent(event);
      assert.equal(counter, 1, eventname + ' fabric event fired');
    });
  });

  ['MouseDown', 'MouseMove', 'MouseOut', 'MouseEnter', 'MouseWheel', 'DoubleClick'].forEach(function(eventType) {
    QUnit.test('avoid multiple registration - ' + eventType, function(assert) {
      var funcName = '_on' + eventType;
      var eventName = eventType.toLowerCase();
      if (eventType === 'DoubleClick') {
        eventName = 'dblclick';
      }
      if (eventType === 'MouseWheel') {
        eventName = 'wheel';
      }
      var counter = 0;
      var c = new fabric.Canvas();
      c[funcName] = function() {
        counter++;
      };
      // initialize canvas more than once
      c.initialize(c.lowerCanvasEl);
      c.initialize(c.lowerCanvasEl);
      var event = fabric.document.createEvent('MouseEvent');
      event.initEvent(eventName, true, true);
      c.upperCanvasEl.dispatchEvent(event);
      assert.equal(counter, 1, eventName + ' listener executed once');
    });
  });

  QUnit.test('avoid multiple registration - mouseup', function(assert) {
    var done = assert.async();
    var originalMouseUp = fabric.Canvas.prototype._onMouseUp;
    var counter = 0;
    fabric.Canvas.prototype._onMouseUp = function() {
      counter++;
    };
    var c = new fabric.Canvas();
    // initialize canvas more than once
    c.initialize(c.lowerCanvasEl);
    c.initialize(c.lowerCanvasEl);

    // a mouse down is necessary to register mouse up.
    var _event = fabric.document.createEvent('MouseEvent');
    _event.initEvent('mousedown', true, true);
    c.upperCanvasEl.dispatchEvent(_event);
    setTimeout(function() {
      var event = fabric.document.createEvent('MouseEvent');
      event.initEvent('mouseup', true, true);
      fabric.document.dispatchEvent(event);
      assert.equal(counter, 1, 'listener executed once');
      fabric.Canvas.prototype._onMouseUp = originalMouseUp;
      c.cancelRequestedRender();
      done();
    }, 200);
  });

  QUnit.test('mouseEnter removes _hoveredTarget', function(assert) {
    var event = fabric.document.createEvent('MouseEvent');
    event.initEvent('mouseenter', true, true);
    var c = new fabric.Canvas();
    c._hoveredTarget = new fabric.Object();
    c.upperCanvasEl.dispatchEvent(event);
    assert.equal(c._hoveredTarget, null, '_hoveredTarget has been removed');
  });

  QUnit.test('mouseEnter does not remove _hoveredTarget if a transform is happening', function(assert) {
    var event = fabric.document.createEvent('MouseEvent');
    event.initEvent('mouseenter', true, true);
    var c = new fabric.Canvas();
    var obj = new fabric.Object();
    c._hoveredTarget = obj;
    c.currentTransform = {};
    c.upperCanvasEl.dispatchEvent(event);
    assert.equal(c._hoveredTarget, obj, '_hoveredTarget has been removed');
  });

  QUnit.test('mouseEnter removes __corner', function(assert) {
    var event = fabric.document.createEvent('MouseEvent');
    event.initEvent('mouseenter', true, true);
    var c = new fabric.Canvas();
    var obj = new fabric.Object({ top: 100, left: 100 });
    c.add(obj);
    c.setActiveObject(obj);
    obj.__corner = 'test';
    c.upperCanvasEl.dispatchEvent(event);
    assert.equal(obj.__corner, 0, '__corner has been resetted from activeObject');
  });

  QUnit.test('mouseEnter does not removes __corner if there is a transform', function(assert) {
    var event = fabric.document.createEvent('MouseEvent');
    event.initEvent('mouseenter', true, true);
    var c = new fabric.Canvas();
    var obj = new fabric.Object();
    c.currentTransform = {};
    c.setActiveObject(obj);
    obj.__corner = 'test';
    c.upperCanvasEl.dispatchEvent(event);
    assert.equal(obj.__corner, 'test', '__corner has not been reset');
  });

  QUnit.test('avoid multiple events on window', function(assert) {
    var originalResize = fabric.Canvas.prototype._onResize;
    var counter = 0;
    fabric.Canvas.prototype._onResize = function() {
      counter++;
    };
    var c = new fabric.Canvas();
    // initialize canvas more than once
    c.initialize(c.lowerCanvasEl);
    c.initialize(c.lowerCanvasEl);
    var event = fabric.document.createEvent('UIEvents');
    event.initUIEvent('resize', true, false, fabric.window, 0);
    fabric.window.dispatchEvent(event);
    assert.equal(counter, 1, 'listener on window executed once');
    fabric.Canvas.prototype._onResize = originalResize;
  });

  QUnit.test('actionIsDisabled ', function(assert) {
    assert.ok(typeof fabric.Canvas.prototype.actionIsDisabled === 'function', 'actionIsDisabled is a function');
    var key = canvas.altActionKey;
    var target = new fabric.Object();
    var e = { };
    e[key] = false;
    assert.equal(!!canvas.actionIsDisabled('mt', target, e), false, 'action is not disabled');
    assert.equal(!!canvas.actionIsDisabled('mb', target, e), false, 'action is not disabled');
    assert.equal(!!canvas.actionIsDisabled('ml', target, e), false, 'action is not disabled');
    assert.equal(!!canvas.actionIsDisabled('mr', target, e), false, 'action is not disabled');
    assert.equal(!!canvas.actionIsDisabled('tl', target, e), false, 'action is not disabled');
    assert.equal(!!canvas.actionIsDisabled('tr', target, e), false, 'action is not disabled');
    assert.equal(!!canvas.actionIsDisabled('bl', target, e), false, 'action is not disabled');
    assert.equal(!!canvas.actionIsDisabled('br', target, e), false, 'action is not disabled');
    assert.equal(!!canvas.actionIsDisabled('mtr', target, e), false, 'action is not disabled');
    target = new fabric.Object();
    target.lockScalingX = true;

    assert.equal(!!canvas.actionIsDisabled('mt', target, e), false, 'mt action is not disabled lockScalingX');
    assert.equal(!!canvas.actionIsDisabled('mb', target, e), false, 'mb action is not disabled lockScalingX');
    assert.equal(!!canvas.actionIsDisabled('ml', target, e), true, 'ml action is disabled lockScalingX');
    assert.equal(!!canvas.actionIsDisabled('mr', target, e), true, 'mr action is disabled lockScalingX');
    assert.equal(!!canvas.actionIsDisabled('tl', target, e), true, 'tl action is disabled lockScalingX');
    assert.equal(!!canvas.actionIsDisabled('tr', target, e), true, 'tr action is disabled lockScalingX');
    assert.equal(!!canvas.actionIsDisabled('bl', target, e), true, 'bl action is disabled lockScalingX');
    assert.equal(!!canvas.actionIsDisabled('br', target, e), true, 'br action is disabled lockScalingX');
    assert.equal(!!canvas.actionIsDisabled('mtr', target, e), false, 'mtr action is not disabled lockScalingX');
    target = new fabric.Object();
    target.lockScalingY = true;
    assert.equal(!!canvas.actionIsDisabled('mt', target, e), true, 'mt action is disabled lockScalingY');
    assert.equal(!!canvas.actionIsDisabled('mb', target, e), true, 'mb action is disabled lockScalingY');
    assert.equal(!!canvas.actionIsDisabled('ml', target, e), false, 'ml action is not disabled lockScalingY');
    assert.equal(!!canvas.actionIsDisabled('mr', target, e), false, 'mr action is not disabled lockScalingY');
    assert.equal(!!canvas.actionIsDisabled('tl', target, e), true, 'tl action is not disabled lockScalingY');
    assert.equal(!!canvas.actionIsDisabled('tr', target, e), true, 'tr action is not disabled lockScalingY');
    assert.equal(!!canvas.actionIsDisabled('bl', target, e), true, 'bl action is not disabled lockScalingY');
    assert.equal(!!canvas.actionIsDisabled('br', target, e), true, 'br action is not disabled lockScalingY');
    assert.equal(!!canvas.actionIsDisabled('mtr', target, e), false, 'mtr action is not disabledlockScalingY');
    target = new fabric.Object();
    target.lockScalingY = true;
    target.lockScalingX = true;
    assert.equal(!!canvas.actionIsDisabled('mt', target, e), true, 'mt action is disabled scaling locked');
    assert.equal(!!canvas.actionIsDisabled('mb', target, e), true, 'mb action is disabled scaling locked');
    assert.equal(!!canvas.actionIsDisabled('ml', target, e), true, 'ml action is disabled scaling locked');
    assert.equal(!!canvas.actionIsDisabled('mr', target, e), true, 'mr action is disabled scaling locked');
    assert.equal(!!canvas.actionIsDisabled('tl', target, e), true, 'tl action is disabled scaling locked');
    assert.equal(!!canvas.actionIsDisabled('tr', target, e), true, 'tr action is disabled scaling locked');
    assert.equal(!!canvas.actionIsDisabled('bl', target, e), true, 'bl action is disabled scaling locked');
    assert.equal(!!canvas.actionIsDisabled('br', target, e), true, 'br action is disabled scaling locked');
    assert.equal(!!canvas.actionIsDisabled('mtr', target, e), false, 'mtr action is not disabled scaling locked');
    target = new fabric.Object();
    target.lockRotation = true;
    assert.equal(!!canvas.actionIsDisabled('mt', target, e), false, 'mt action is not disabled lockRotation');
    assert.equal(!!canvas.actionIsDisabled('mb', target, e), false, 'mb action is not disabled lockRotation');
    assert.equal(!!canvas.actionIsDisabled('ml', target, e), false, 'ml action is not disabled lockRotation');
    assert.equal(!!canvas.actionIsDisabled('mr', target, e), false, 'mr action is not disabled lockRotation');
    assert.equal(!!canvas.actionIsDisabled('tl', target, e), false, 'tl action is not disabled lockRotation');
    assert.equal(!!canvas.actionIsDisabled('tr', target, e), false, 'tr action is not disabled lockRotation');
    assert.equal(!!canvas.actionIsDisabled('bl', target, e), false, 'bl action is not disabled lockRotation');
    assert.equal(!!canvas.actionIsDisabled('br', target, e), false, 'br action is not disabled lockRotation');
    assert.equal(!!canvas.actionIsDisabled('mtr', target, e), true, 'mtr action is disabled lockRotation');
    target = new fabric.Object();
    target.lockSkewingX = true;
    target.lockSkewingY = true;
    assert.equal(!!canvas.actionIsDisabled('mt', target, e), false, 'mt action is not disabled lockSkewing');
    assert.equal(!!canvas.actionIsDisabled('mb', target, e), false, 'mb action is not disabled lockSkewing');
    assert.equal(!!canvas.actionIsDisabled('ml', target, e), false, 'ml action is not disabled lockSkewing');
    assert.equal(!!canvas.actionIsDisabled('mr', target, e), false, 'mr action is not disabled lockSkewing');
    assert.equal(!!canvas.actionIsDisabled('tl', target, e), false, 'tl action is not disabled lockSkewing');
    assert.equal(!!canvas.actionIsDisabled('tr', target, e), false, 'tr action is not disabled lockSkewing');
    assert.equal(!!canvas.actionIsDisabled('bl', target, e), false, 'bl action is not disabled lockSkewing');
    assert.equal(!!canvas.actionIsDisabled('br', target, e), false, 'br action is not disabled lockSkewing');
    assert.equal(!!canvas.actionIsDisabled('mtr', target, e), false, 'mtr action is not disabled lockSkewing');
    e[key] = true;
    target = new fabric.Object();
    target.lockSkewingY = true;
    assert.equal(!!canvas.actionIsDisabled('mt', target, e), false, 'mt action is not disabled lockSkewingY');
    assert.equal(!!canvas.actionIsDisabled('mb', target, e), false, 'mb action is not disabled lockSkewingY');
    assert.equal(!!canvas.actionIsDisabled('ml', target, e), true, 'ml action is disabled lockSkewingY');
    assert.equal(!!canvas.actionIsDisabled('mr', target, e), true, 'mr action is disabled lockSkewingY');
    assert.equal(!!canvas.actionIsDisabled('tl', target, e), false, 'tl action is not disabled lockSkewingY');
    assert.equal(!!canvas.actionIsDisabled('tr', target, e), false, 'tr action is not disabled lockSkewingY');
    assert.equal(!!canvas.actionIsDisabled('bl', target, e), false, 'bl action is not disabled lockSkewingY');
    assert.equal(!!canvas.actionIsDisabled('br', target, e), false, 'br action is not disabled lockSkewingY');
    assert.equal(!!canvas.actionIsDisabled('mtr', target, e), false, 'mtr action is not disabled lockSkewingY');

    e[key] = true;
    target = new fabric.Object();
    target.lockSkewingX = true;
    assert.equal(!!canvas.actionIsDisabled('mt', target, e), true, 'mt action is disabled lockSkewingX');
    assert.equal(!!canvas.actionIsDisabled('mb', target, e), true, 'mb action is disabled lockSkewingX');
    assert.equal(!!canvas.actionIsDisabled('ml', target, e), false, 'ml action is not disabled lockSkewingX');
    assert.equal(!!canvas.actionIsDisabled('mr', target, e), false, 'mr action is not disabled lockSkewingX');
    assert.equal(!!canvas.actionIsDisabled('tl', target, e), false, 'tl action is not disabled lockSkewingX');
    assert.equal(!!canvas.actionIsDisabled('tr', target, e), false, 'tr action is not disabled lockSkewingX');
    assert.equal(!!canvas.actionIsDisabled('bl', target, e), false, 'bl action is not disabled lockSkewingX');
    assert.equal(!!canvas.actionIsDisabled('br', target, e), false, 'br action is not disabled lockSkewingX');
    assert.equal(!!canvas.actionIsDisabled('mtr', target, e), false, 'mtr action is not disabled lockSkewingX');
  });

  QUnit.test('getCornerCursor ', function(assert) {
    assert.ok(typeof fabric.Canvas.prototype.getCornerCursor === 'function', 'actionIsDisabled is a function');
    var key = canvas.altActionKey;
    var key2 = canvas.uniScaleKey;
    var target = new fabric.Object();
    var e = { };
    e[key] = false;
    assert.equal(canvas.getCornerCursor('mt', target, e), 'n-resize', 'action is not disabled');
    assert.equal(canvas.getCornerCursor('mb', target, e), 's-resize', 'action is not disabled');
    assert.equal(canvas.getCornerCursor('ml', target, e), 'w-resize', 'action is not disabled');
    assert.equal(canvas.getCornerCursor('mr', target, e), 'e-resize', 'action is not disabled');
    assert.equal(canvas.getCornerCursor('tl', target, e), 'nw-resize', 'action is not disabled');
    assert.equal(canvas.getCornerCursor('tr', target, e), 'ne-resize', 'action is not disabled');
    assert.equal(canvas.getCornerCursor('bl', target, e), 'sw-resize', 'action is not disabled');
    assert.equal(canvas.getCornerCursor('br', target, e), 'se-resize', 'action is not disabled');
    assert.equal(canvas.getCornerCursor('mtr', target, e), 'crosshair', 'action is not disabled');

    target = new fabric.Object();
    target.hasRotatingPoint = false;
    var e = { };
    e[key] = false;
    assert.equal(canvas.getCornerCursor('mtr', target, e), 'default', 'action is not disabled');

    target = new fabric.Object();
    target.lockScalingX = true;
    assert.equal(canvas.getCornerCursor('mt', target, e), 'n-resize', 'action is not disabled lockScalingX');
    assert.equal(canvas.getCornerCursor('mb', target, e), 's-resize', 'action is not disabled lockScalingX');
    assert.equal(canvas.getCornerCursor('ml', target, e), 'not-allowed', 'action is disabled lockScalingX');
    assert.equal(canvas.getCornerCursor('mr', target, e), 'not-allowed', 'action is disabled lockScalingX');
    assert.equal(canvas.getCornerCursor('tl', target, e), 'not-allowed', 'action is disabled lockScalingX');
    assert.equal(canvas.getCornerCursor('tr', target, e), 'not-allowed', 'action is disabled lockScalingX');
    assert.equal(canvas.getCornerCursor('bl', target, e), 'not-allowed', 'action is disabled lockScalingX');
    assert.equal(canvas.getCornerCursor('br', target, e), 'not-allowed', 'action is disabled lockScalingX');
    assert.equal(canvas.getCornerCursor('mtr', target, e), 'crosshair', 'action is not disabled lockScalingX');
    e[key2] = true;
    assert.equal(canvas.getCornerCursor('tl', target, e), 'nw-resize', 'action is not disabled lockScalingX key2');
    assert.equal(canvas.getCornerCursor('tr', target, e), 'ne-resize', 'action is not disabled lockScalingX key2');
    assert.equal(canvas.getCornerCursor('bl', target, e), 'sw-resize', 'action is not disabled lockScalingX key2');
    assert.equal(canvas.getCornerCursor('br', target, e), 'se-resize', 'action is not disabled lockScalingX key2');

    var e = { };
    target = new fabric.Object();
    target.lockScalingY = true;
    assert.equal(canvas.getCornerCursor('mt', target, e), 'not-allowed', 'action is disabled lockScalingY');
    assert.equal(canvas.getCornerCursor('mb', target, e), 'not-allowed', 'action is disabled lockScalingY');
    assert.equal(canvas.getCornerCursor('ml', target, e), 'w-resize', 'action is not disabled lockScalingY');
    assert.equal(canvas.getCornerCursor('mr', target, e), 'e-resize', 'action is not disabled lockScalingY');
    assert.equal(canvas.getCornerCursor('tl', target, e), 'not-allowed', 'action is disabled lockScalingY');
    assert.equal(canvas.getCornerCursor('tr', target, e), 'not-allowed', 'action is disabled lockScalingY');
    assert.equal(canvas.getCornerCursor('bl', target, e), 'not-allowed', 'action is disabled lockScalingY');
    assert.equal(canvas.getCornerCursor('br', target, e), 'not-allowed', 'action is disabled lockScalingY');
    assert.equal(canvas.getCornerCursor('mtr', target, e), 'crosshair', 'action is not disabled lockScalingY');
    e[key2] = true;
    assert.equal(canvas.getCornerCursor('tl', target, e), 'nw-resize', 'action is not disabled lockScalingY key2');
    assert.equal(canvas.getCornerCursor('tr', target, e), 'ne-resize', 'action is not disabled lockScalingY key2');
    assert.equal(canvas.getCornerCursor('bl', target, e), 'sw-resize', 'action is not disabled lockScalingY key2');
    assert.equal(canvas.getCornerCursor('br', target, e), 'se-resize', 'action is not disabled lockScalingY key2');

    var e = { };
    target = new fabric.Object();
    target.lockScalingY = true;
    target.lockScalingX = true;
    assert.equal(canvas.getCornerCursor('mt', target, e), 'not-allowed', 'action is disabled lockScaling');
    assert.equal(canvas.getCornerCursor('mb', target, e), 'not-allowed', 'action is disabled lockScaling');
    assert.equal(canvas.getCornerCursor('ml', target, e), 'not-allowed', 'action is disabled lockScaling');
    assert.equal(canvas.getCornerCursor('mr', target, e), 'not-allowed', 'action is disabled lockScaling');
    assert.equal(canvas.getCornerCursor('tl', target, e), 'not-allowed', 'action is disabled lockScaling');
    assert.equal(canvas.getCornerCursor('tr', target, e), 'not-allowed', 'action is disabled lockScaling');
    assert.equal(canvas.getCornerCursor('bl', target, e), 'not-allowed', 'action is disabled lockScaling');
    assert.equal(canvas.getCornerCursor('br', target, e), 'not-allowed', 'action is disabled lockScaling');
    assert.equal(canvas.getCornerCursor('mtr', target, e), 'crosshair', 'action is not disabled lockScaling');
    e[key2] = true;
    assert.equal(canvas.getCornerCursor('tl', target, e), 'not-allowed', 'action is disabled lockScaling key2');
    assert.equal(canvas.getCornerCursor('tr', target, e), 'not-allowed', 'action is disabled lockScaling key2');
    assert.equal(canvas.getCornerCursor('bl', target, e), 'not-allowed', 'action is disabled lockScaling key2');
    assert.equal(canvas.getCornerCursor('br', target, e), 'not-allowed', 'action is disabled lockScaling key2');

    var e = { };
    target = new fabric.Object();
    target.lockRotation = true;
    assert.equal(canvas.getCornerCursor('mt', target, e), 'n-resize', 'action is not disabled lockRotation');
    assert.equal(canvas.getCornerCursor('mb', target, e), 's-resize', 'action is not disabled lockRotation');
    assert.equal(canvas.getCornerCursor('ml', target, e), 'w-resize', 'action is not disabled lockRotation');
    assert.equal(canvas.getCornerCursor('mr', target, e), 'e-resize', 'action is not disabled lockRotation');
    assert.equal(canvas.getCornerCursor('tl', target, e), 'nw-resize', 'action is not disabled lockRotation');
    assert.equal(canvas.getCornerCursor('tr', target, e), 'ne-resize', 'action is not disabled lockRotation');
    assert.equal(canvas.getCornerCursor('bl', target, e), 'sw-resize', 'action is not disabled lockRotation');
    assert.equal(canvas.getCornerCursor('br', target, e), 'se-resize', 'action is not disabled lockRotation');
    assert.equal(canvas.getCornerCursor('mtr', target, e), 'not-allowed', 'action is disabled lockRotation');

    target = new fabric.Object();
    target.lockSkewingX = true;
    target.lockSkewingY = true;
    assert.equal(canvas.getCornerCursor('mt', target, e), 'n-resize', 'action is not disabled');
    assert.equal(canvas.getCornerCursor('mb', target, e), 's-resize', 'action is not disabled');
    assert.equal(canvas.getCornerCursor('ml', target, e), 'w-resize', 'action is not disabled');
    assert.equal(canvas.getCornerCursor('mr', target, e), 'e-resize', 'action is not disabled');
    assert.equal(canvas.getCornerCursor('tl', target, e), 'nw-resize', 'action is not disabled');
    assert.equal(canvas.getCornerCursor('tr', target, e), 'ne-resize', 'action is not disabled');
    assert.equal(canvas.getCornerCursor('bl', target, e), 'sw-resize', 'action is not disabled');
    assert.equal(canvas.getCornerCursor('br', target, e), 'se-resize', 'action is not disabled');
    assert.equal(canvas.getCornerCursor('mtr', target, e), 'crosshair', 'action is not disabled');

    e[key] = true;
    target = new fabric.Object();
    target.lockSkewingY = true;
    assert.equal(canvas.getCornerCursor('mt', target, e), 'e-resize', 'action is not disabled');
    assert.equal(canvas.getCornerCursor('mb', target, e), 'w-resize', 'action is not disabled');
    assert.equal(canvas.getCornerCursor('ml', target, e), 'not-allowed', 'action is disabled');
    assert.equal(canvas.getCornerCursor('mr', target, e), 'not-allowed', 'action is disabled');
    assert.equal(canvas.getCornerCursor('tl', target, e), 'nw-resize', 'action is not disabled');
    assert.equal(canvas.getCornerCursor('tr', target, e), 'ne-resize', 'action is not disabled');
    assert.equal(canvas.getCornerCursor('bl', target, e), 'sw-resize', 'action is not disabled');
    assert.equal(canvas.getCornerCursor('br', target, e), 'se-resize', 'action is not disabled');
    assert.equal(canvas.getCornerCursor('mtr', target, e), 'crosshair', 'action is not disabled');

    e[key] = true;
    target = new fabric.Object();
    target.lockSkewingX = true;
    assert.equal(canvas.getCornerCursor('mt', target, e), 'not-allowed', 'action is disabled');
    assert.equal(canvas.getCornerCursor('mb', target, e), 'not-allowed', 'action is disabled');
    assert.equal(canvas.getCornerCursor('ml', target, e), 'n-resize', 'action is not disabled');
    assert.equal(canvas.getCornerCursor('mr', target, e), 's-resize', 'action is not disabled');
    assert.equal(canvas.getCornerCursor('tl', target, e), 'nw-resize', 'action is not disabled');
    assert.equal(canvas.getCornerCursor('tr', target, e), 'ne-resize', 'action is not disabled');
    assert.equal(canvas.getCornerCursor('bl', target, e), 'sw-resize', 'action is not disabled');
    assert.equal(canvas.getCornerCursor('br', target, e), 'se-resize', 'action is not disabled');
    assert.equal(canvas.getCornerCursor('mtr', target, e), 'crosshair', 'action is not disabled');
  });
  QUnit.test('_addEventOptions return the correct event name', function(assert) {
    var opt = {};
    assert.equal(canvas._addEventOptions(opt, { action: 'scaleX' }), 'scaled', 'scaleX => scaled');
    assert.equal(opt.by, 'x', 'by => x');
    assert.equal(canvas._addEventOptions(opt, { action: 'scaleY' }), 'scaled', 'scaleY => scaled');
    assert.equal(opt.by, 'y', 'by => y');
    assert.equal(canvas._addEventOptions(opt, { action: 'scale' }), 'scaled', 'scale => scaled');
    assert.equal(opt.by, 'equally', 'by => equally');
    assert.equal(canvas._addEventOptions(opt, { action: 'skewX' }), 'skewed', 'skewX => skewed');
    assert.equal(opt.by, 'x', 'by => x');
    assert.equal(canvas._addEventOptions(opt, { action: 'skewY' }), 'skewed', 'skewY => skewed');
    assert.equal(opt.by, 'y', 'by => y');
    assert.equal(canvas._addEventOptions(opt, { action: 'rotate' }), 'rotated', 'rotate => rotated');
    assert.equal(opt.by, undefined, 'by => undefined');
    assert.equal(canvas._addEventOptions(opt, { action: 'drag' }), 'moved', 'drag => moved');
    assert.equal(opt.by, undefined, 'by => undefined');
  });
})();
