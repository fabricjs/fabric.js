(function() {


  var EMPTY_JSON = '{"objects":[]}';

  // var emptyImageCanvasData = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAfQAAAH0CAYAAADL1t+KAAAH7ElEQVR4nO3VMQ0AMAzAsPInvYHoMS2yEeTLHADge/M6AADYM3QACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIuMjH4b7osLFBAAAAAElFTkSuQmCC";

  var PATH_JSON = '{"objects": [{"type": "path", "originX": "left", "originY": "top", "left": 268, "top": 266, "width": 51, "height": 49,' +
                  ' "fill": "rgb(0,0,0)", "stroke": null, "strokeWidth": 1, "scaleX": 1, "scaleY": 1, ' +
                  '"angle": 0, "flipX": false, "flipY": false, "opacity": 1, "path": [["M", 18.511, 13.99],' +
                  ' ["c", 0, 0, -2.269, -4.487, -12.643, 4.411], ["c", 0, 0, 4.824, -14.161, 19.222, -9.059],' +
                  ' ["l", 0.379, -2.1], ["c", -0.759, -0.405, -1.375, -1.139, -1.645, -2.117], ["c", -0.531, ' +
                  '-1.864, 0.371, -3.854, 1.999, -4.453], ["c", 0.312, -0.118, 0.633, -0.169, 0.953, -0.169], ' +
                  '["c", 1.299, 0, 2.514, 0.953, 2.936, 2.455], ["c", 0.522, 1.864, -0.372, 3.854, -1.999, ' +
                  '4.453], ["c", -0.229, 0.084, -0.464, 0.127, -0.692, 0.152], ["l", -0.379, 2.37], ["c", ' +
                  '1.146, 0.625, 2.024, 1.569, 2.674, 2.758], ["c", 3.213, 2.514, 8.561, 4.184, 11.774, -8.232],' +
                  ' ["c", 0, 0, 0.86, 16.059, -12.424, 14.533], ["c", 0.008, 2.859, 0.615, 5.364, -0.076, 8.224],' +
                  ' ["c", 8.679, 3.146, 15.376, 14.389, 17.897, 18.168], ["l", 2.497, -2.151], ["l", 1.206, 1.839],' +
                  ' ["l", -3.889, 3.458], ["C", 46.286, 48.503, 31.036, 32.225, 22.72, 35.81], ["c", -1.307, 2.851,' +
                  ' -3.56, 6.891, -7.481, 8.848], ["c", -4.689, 2.336, -9.084, -0.802, -11.277, -2.868], ["l",' +
                  ' -1.948, 3.104], ["l", -1.628, -1.333], ["l", 3.138, -4.689], ["c", 0.025, 0, 9, 1.932, 9, 1.932], ' +
                  '["c", 0.877, -9.979, 2.893, -12.905, 4.942, -15.621], ["C", 17.878, 21.775, 18.713, 17.397, 18.511, ' +
                  '13.99], ["z", null]]}], "background": "#ff5555","overlay": "rgba(0,0,0,0.2)"}';

  var PATH_WITHOUT_DEFAULTS_JSON = '{"objects": [{"type": "path", "left": 268, "top": 266, "width": 51, "height": 49, "path": [["M", 18.511, 13.99],' +
                  ' ["c", 0, 0, -2.269, -4.487, -12.643, 4.411], ["c", 0, 0, 4.824, -14.161, 19.222, -9.059],' +
                  ' ["l", 0.379, -2.1], ["c", -0.759, -0.405, -1.375, -1.139, -1.645, -2.117], ["c", -0.531, ' +
                  '-1.864, 0.371, -3.854, 1.999, -4.453], ["c", 0.312, -0.118, 0.633, -0.169, 0.953, -0.169], ' +
                  '["c", 1.299, 0, 2.514, 0.953, 2.936, 2.455], ["c", 0.522, 1.864, -0.372, 3.854, -1.999, ' +
                  '4.453], ["c", -0.229, 0.084, -0.464, 0.127, -0.692, 0.152], ["l", -0.379, 2.37], ["c", ' +
                  '1.146, 0.625, 2.024, 1.569, 2.674, 2.758], ["c", 3.213, 2.514, 8.561, 4.184, 11.774, -8.232],' +
                  ' ["c", 0, 0, 0.86, 16.059, -12.424, 14.533], ["c", 0.008, 2.859, 0.615, 5.364, -0.076, 8.224],' +
                  ' ["c", 8.679, 3.146, 15.376, 14.389, 17.897, 18.168], ["l", 2.497, -2.151], ["l", 1.206, 1.839],' +
                  ' ["l", -3.889, 3.458], ["C", 46.286, 48.503, 31.036, 32.225, 22.72, 35.81], ["c", -1.307, 2.851,' +
                  ' -3.56, 6.891, -7.481, 8.848], ["c", -4.689, 2.336, -9.084, -0.802, -11.277, -2.868], ["l",' +
                  ' -1.948, 3.104], ["l", -1.628, -1.333], ["l", 3.138, -4.689], ["c", 0.025, 0, 9, 1.932, 9, 1.932], ' +
                  '["c", 0.877, -9.979, 2.893, -12.905, 4.942, -15.621], ["C", 17.878, 21.775, 18.713, 17.397, 18.511, ' +
                  '13.99], ["z", null]]}], "background": "#ff5555","overlay": "rgba(0,0,0,0.2)"}';

  var PATH_OBJ_JSON = '{"type": "path", "originX": "left", "originY": "top", "left": 268, "top": 266, "width": 51, "height": 49,' +
                      ' "fill": "rgb(0,0,0)", "stroke": null, "strokeWidth": 1, "scaleX": 1, "scaleY": 1, ' +
                      '"angle": 0, "flipX": false, "flipY": false, "opacity": 1, "path": [["M", 18.511, 13.99],' +
                      ' ["c", 0, 0, -2.269, -4.487, -12.643, 4.411], ["c", 0, 0, 4.824, -14.161, 19.222, -9.059],' +
                      ' ["l", 0.379, -2.1], ["c", -0.759, -0.405, -1.375, -1.139, -1.645, -2.117], ["c", -0.531, ' +
                      '-1.864, 0.371, -3.854, 1.999, -4.453], ["c", 0.312, -0.118, 0.633, -0.169, 0.953, -0.169], ' +
                      '["c", 1.299, 0, 2.514, 0.953, 2.936, 2.455], ["c", 0.522, 1.864, -0.372, 3.854, -1.999, ' +
                      '4.453], ["c", -0.229, 0.084, -0.464, 0.127, -0.692, 0.152], ["l", -0.379, 2.37], ["c", ' +
                      '1.146, 0.625, 2.024, 1.569, 2.674, 2.758], ["c", 3.213, 2.514, 8.561, 4.184, 11.774, -8.232],' +
                      ' ["c", 0, 0, 0.86, 16.059, -12.424, 14.533], ["c", 0.008, 2.859, 0.615, 5.364, -0.076, 8.224],' +
                      ' ["c", 8.679, 3.146, 15.376, 14.389, 17.897, 18.168], ["l", 2.497, -2.151], ["l", 1.206, 1.839],' +
                      ' ["l", -3.889, 3.458], ["C", 46.286, 48.503, 31.036, 32.225, 22.72, 35.81], ["c", -1.307, 2.851,' +
                      ' -3.56, 6.891, -7.481, 8.848], ["c", -4.689, 2.336, -9.084, -0.802, -11.277, -2.868], ["l",' +
                      ' -1.948, 3.104], ["l", -1.628, -1.333], ["l", 3.138, -4.689], ["c", 0.025, 0, 9, 1.932, 9, 1.932], ' +
                      '["c", 0.877, -9.979, 2.893, -12.905, 4.942, -15.621], ["C", 17.878, 21.775, 18.713, 17.397, 18.511, ' +
                      '13.99], ["z", null]]}';

  var PATH_DATALESS_JSON = '{"objects":[{"type":"path","originX":"left","originY":"top","left":100,"top":100,"width":200,"height":200,"fill":"rgb(0,0,0)",' +
                           '"stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,' +
                           '"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,' +
                           '"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","transformMatrix":null,"skewX":0,"skewY":0,"sourcePath":"http://example.com/"}]}';

  var RECT_JSON = '{"objects":[{"type":"rect","originX":"left","originY":"top","left":0,"top":0,"width":10,"height":10,"fill":"rgb(0,0,0)",' +
                  '"stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,' +
                  '"shadow":null,' +
                  '"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","transformMatrix":null,"skewX":0,"skewY":0,"rx":0,"ry":0}],"background":"#ff5555","overlay":"rgba(0,0,0,0.2)"}';

  function _createImageElement() {
    return fabric.isLikelyNode ? new (require(fabric.canvasModule).Image)() : fabric.document.createElement('img');
  }

  function getAbsolutePath(path) {
    var isAbsolute = /^https?:/.test(path);
    if (isAbsolute) { return path; };
    var imgEl = _createImageElement();
    imgEl.src = path;
    var src = imgEl.src;
    imgEl = null;
    return src;
  }

  var IMG_SRC = fabric.isLikelyNode ? (__dirname + '/../fixtures/test_image.gif') : getAbsolutePath('../fixtures/test_image.gif');

  var el = fabric.document.createElement('canvas');
  el.width = 600; el.height = 600;

  var canvas = this.canvas = fabric.isLikelyNode ? fabric.createCanvasForNode() : new fabric.Canvas(el);
  var upperCanvasEl = canvas.upperCanvasEl;
  var lowerCanvasEl = canvas.lowerCanvasEl;

  function makeRect(options) {
    var defaultOptions = { width: 10, height: 10 };
    return new fabric.Rect(fabric.util.object.extend(defaultOptions, options || { }));
  }

  function makeTriangle(options) {
    var defaultOptions = { width: 30, height: 30 };
    return new fabric.Triangle(fabric.util.object.extend(defaultOptions, options || { }));
  }

  QUnit.module('fabric.Canvas', {
    setup: function() {
      upperCanvasEl.style.display = '';
      canvas.controlsAboveOverlay = fabric.Canvas.prototype.controlsAboveOverlay;
      canvas.preserveObjectStacking = fabric.Canvas.prototype.preserveObjectStacking;
    },
    teardown: function() {
      canvas.clear();
      canvas.backgroundColor = fabric.Canvas.prototype.backgroundColor;
      canvas.overlayColor = fabric.Canvas.prototype.overlayColor;
      canvas.calcOffset();
      upperCanvasEl.style.display = 'none';
    }
  });

  test('initialProperties', function() {
    ok('backgroundColor' in canvas);
    equal(canvas.includeDefaultValues, true);
  });

  test('getObjects', function() {
    ok(typeof canvas.getObjects == 'function', 'should respond to `getObjects` method');
    deepEqual([], canvas.getObjects(), 'should return empty array for `getObjects` when empty');
    equal(canvas.getObjects().length, 0, 'should have a 0 length when empty');
  });

  test('getElement', function() {
    ok(typeof canvas.getElement == 'function', 'should respond to `getElement` method');
    equal(canvas.getElement(), lowerCanvasEl, 'should return a proper element');
  });

  test('item', function() {
    var rect = makeRect();

    ok(typeof canvas.item == 'function', 'should respond to item');
    canvas.add(rect);
    equal(canvas.item(0), rect, 'should return proper item');
  });

  test('preserveObjectStacking', function() {
    ok(typeof canvas.preserveObjectStacking == 'boolean');
    ok(!canvas.preserveObjectStacking, 'default is false');
  });

  test('uniScaleTransform', function() {
    ok(typeof canvas.uniScaleTransform == 'boolean');
    ok(!canvas.uniScaleTransform, 'default is false');
  });

  test('uniScaleKey', function() {
    ok(typeof canvas.uniScaleKey == 'string');
    equal(canvas.uniScaleKey, 'shiftKey', 'default is shift');
  });

  test('centeredScaling', function() {
    ok(typeof canvas.centeredScaling == 'boolean');
    ok(!canvas.centeredScaling, 'default is false');
  });

  test('centeredRotation', function() {
    ok(typeof canvas.centeredRotation == 'boolean');
    ok(!canvas.centeredRotation, 'default is false');
  });

  test('centeredKey', function() {
    ok(typeof canvas.centeredKey == 'string');
    equal(canvas.centeredKey, 'altKey', 'default is alt');
  });

  test('altActionKey', function() {
    ok(typeof canvas.altActionKey == 'string');
    equal(canvas.altActionKey, 'shiftKey', 'default is shift');
  });

  test('interactive', function() {
    ok(typeof canvas.interactive == 'boolean');
    ok(canvas.interactive, 'default is true');
  });

  test('selection', function() {
    ok(typeof canvas.selection == 'boolean');
    ok(canvas.selection, 'default is true');
  });

  test('_initInteractive', function() {
    ok(typeof canvas._initInteractive == 'function');
  });

  test('renderTop', function() {
    ok(typeof canvas.renderTop == 'function');
    equal(canvas, canvas.renderTop());
  });

  test('_chooseObjectsToRender', function() {
    ok(typeof canvas._chooseObjectsToRender == 'function');
    var rect = makeRect(), rect2 = makeRect(), rect3 = makeRect();
    canvas.add(rect);
    canvas.add(rect2);
    canvas.add(rect3);
    var objs = canvas._chooseObjectsToRender();
    equal(objs[0], rect);
    equal(objs[1], rect2);
    equal(objs[2], rect3);
    canvas.setActiveObject(rect);
    objs = canvas._chooseObjectsToRender();
    equal(objs[0], rect2);
    equal(objs[1], rect3);
    equal(objs[2], rect);
    canvas.setActiveObject(rect2);
    canvas.preserveObjectStacking = true;
    objs = canvas._chooseObjectsToRender();
    equal(objs[0], rect);
    equal(objs[1], rect2);
    equal(objs[2], rect3);
  });

  test('calcOffset', function() {
    ok(typeof canvas.calcOffset == 'function', 'should respond to `calcOffset`');
    equal(canvas.calcOffset(), canvas, 'should be chainable');
  });

  test('add', function() {
    var rect1 = makeRect(),
        rect2 = makeRect(),
        rect3 = makeRect(),
        rect4 = makeRect();

    ok(typeof canvas.add == 'function');
    equal(canvas.add(rect1), canvas, 'should be chainable');
    strictEqual(canvas.item(0), rect1);

    canvas.add(rect2, rect3, rect4);
    equal(canvas.getObjects().length, 4, 'should support multiple arguments');

    strictEqual(canvas.item(1), rect2);
    strictEqual(canvas.item(2), rect3);
    strictEqual(canvas.item(3), rect4);
  });

  test('insertAt', function() {
    var rect1 = makeRect(),
        rect2 = makeRect();

    canvas.add(rect1, rect2);

    ok(typeof canvas.insertAt == 'function', 'should respond to `insertAt` method');

    var rect = makeRect();
    canvas.insertAt(rect, 1);
    strictEqual(canvas.item(1), rect);
    canvas.insertAt(rect, 2);
    strictEqual(canvas.item(2), rect);
    equal(canvas.insertAt(rect, 2), canvas, 'should be chainable');
  });

  test('remove', function() {
    var rect1 = makeRect(),
        rect2 = makeRect(),
        rect3 = makeRect(),
        rect4 = makeRect();

    canvas.add(rect1, rect2, rect3, rect4);

    ok(typeof canvas.remove == 'function');
    equal(canvas.remove(rect1), canvas, 'should be chainable');
    strictEqual(canvas.item(0), rect2, 'should be second object');

    canvas.remove(rect2, rect3);
    strictEqual(canvas.item(0), rect4);

    canvas.remove(rect4);
    equal(canvas.isEmpty(), true, 'canvas should be empty');
  });

  test('remove actual hovered target', function() {
    var rect1 = makeRect();
    canvas.add(rect1);
    canvas._hoveredTarget = rect1;
    canvas.remove(rect1);
    equal(canvas._hoveredTarget, null, 'reference to hovered target should be removed');
  });

  test('before:selection:cleared', function() {
    var isFired = false;
    canvas.on('before:selection:cleared', function() { isFired = true; });

    canvas.add(new fabric.Rect());
    canvas.remove(canvas.item(0));

    equal(isFired, false, 'removing inactive object shouldnt fire "before:selection:cleared"');

    canvas.add(new fabric.Rect());
    canvas.setActiveObject(canvas.item(0));
    canvas.remove(canvas.item(0));

    equal(isFired, true, 'removing active object should fire "before:selection:cleared"');
  });

  test('selection:cleared', function() {
    var isFired = false;
    canvas.on('selection:cleared', function() { isFired = true; });

    canvas.add(new fabric.Rect());
    canvas.remove(canvas.item(0));

    equal(isFired, false, 'removing inactive object shouldnt fire "selection:cleared"');

    canvas.add(new fabric.Rect());
    canvas.setActiveObject(canvas.item(0));
    canvas.remove(canvas.item(0));

    equal(isFired, true, 'removing active object should fire "selection:cleared"');
  });

  test('setActiveObject fires deselected', function() {
    var isFired = false;
    var rect1 = new fabric.Rect();
    var rect2 = new fabric.Rect();
    rect1.on('deselected', function() { isFired = true; });

    canvas.setActiveObject(rect1);
    canvas.setActiveObject(rect2);
    equal(isFired, true, 'switching active group fires deselected');
  });

  test('getContext', function() {
    ok(typeof canvas.getContext == 'function');
  });

  test('clearContext', function() {
    ok(typeof canvas.clearContext == 'function');
    equal(canvas.clearContext(canvas.getContext()), canvas, 'should be chainable');
  });

  test('clear', function() {
    ok(typeof canvas.clear == 'function');

    equal(canvas.clear(), canvas, 'should be chainable');
    equal(canvas.getObjects().length, 0);
  });

  test('renderAll', function() {
    ok(typeof canvas.renderAll == 'function');
    equal(canvas, canvas.renderAll());
  });

  test('_drawSelection', function() {
    ok(typeof canvas._drawSelection == 'function');
  });

  test('findTarget', function() {
    ok(typeof canvas.findTarget == 'function');
    var rect = makeRect({ left: 0, top: 0 }), target;
    canvas.add(rect);
    target = canvas.findTarget({
      clientX: 5, clientY: 5
    });
    equal(target, rect, 'Should return the rect');
    target = canvas.findTarget({
      clientX: 30, clientY: 30
    });
    equal(target, null, 'Should not find target');
    canvas.remove(rect);
  });

  test('findTarget preserveObjectStacking false', function() {
    ok(typeof canvas.findTarget == 'function');
    canvas.preserveObjectStacking = false;
    var rect = makeRect({ left: 0, top: 0 }),
        rectOver = makeRect({ left: 0, top: 0 }),
        target,
        pointer = { clientX: 5, clientY: 5 };
    canvas.add(rect);
    canvas.add(rectOver);
    canvas.setActiveObject(rect);
    canvas.renderAll();
    target = canvas.findTarget(pointer);
    equal(target, rect, 'Should return the rect');
  });

  test('findTarget preserveObjectStacking true', function() {
    ok(typeof canvas.findTarget == 'function');
    canvas.preserveObjectStacking = true;
    var rect = makeRect({ left: 0, top: 0, width: 30, height: 30 }),
        rectOver = makeRect({ left: 0, top: 0, width: 30, height: 30 }),
        target,
        pointer = { clientX: 15, clientY: 15, 'shiftKey': true },
        pointer2 = { clientX: 4, clientY: 4 };
    canvas.add(rect);
    canvas.add(rectOver);
    target = canvas.findTarget(pointer);
    equal(target, rectOver, 'Should return the rectOver, rect is not considered');
    canvas.setActiveObject(rect);
    target = canvas.findTarget(pointer);
    equal(target, rectOver, 'Should still return rectOver because is above active object');
    target = canvas.findTarget(pointer2);
    equal(target, rect, 'Should rect because a corner of the activeObject has been hit');
    canvas.altSelectionKey = 'shiftKey';
    target = canvas.findTarget(pointer);
    equal(target, rect, 'Should rect because active and altSelectionKey is pressed');
    canvas.preserveObjectStacking = false;
  });

  test('findTarget with subTargetCheck', function() {
    var rect = makeRect({ left: 0, top: 0 }),
        rect2 = makeRect({ left: 30, top:  30}), target,
        group = new fabric.Group([rect, rect2]);

    canvas.add(group);
    target = canvas.findTarget({
      clientX: 5, clientY: 5
    }, true);
    equal(target, group, 'Should return the group');
    equal(canvas.targets[0], undefined, 'no subtarget should return');
    target = canvas.findTarget({
      clientX: 30, clientY: 30
    });
    equal(target, group, 'Should return the group');
    group.subTargetCheck = true;
    target = canvas.findTarget({
      clientX: 5, clientY: 5
    });
    equal(target, group, 'Should return the group');
    equal(canvas.targets[0], rect, 'should return the rect');
    target = canvas.findTarget({
      clientX: 15, clientY: 15
    });
    equal(target, group, 'Should return the group');
    equal(canvas.targets[0], undefined, 'no subtarget should return');
    target = canvas.findTarget({
      clientX: 32, clientY: 32
    });
    equal(target, group, 'Should return the group');
    equal(canvas.targets[0], rect2, 'should return the rect2');
    canvas.remove(group);
  });

  test('findTarget with subTargetCheck on activeObject', function() {
    var rect = makeRect({ left: 0, top: 0 }),
        rect2 = makeRect({ left: 30, top:  30}), target,
        group = new fabric.Group([rect, rect2]);

    canvas.add(group);
    canvas.setActiveObject(group);
    group.subTargetCheck = true;
    target = canvas.findTarget({
      clientX: 9, clientY: 9
    });
    equal(target, group, 'Should return the group');
    equal(canvas.targets[0], rect, 'should return the rect');

    target = canvas.findTarget({
      clientX: 9, clientY: 9
    });

    target = canvas.findTarget({
      clientX: 9, clientY: 9
    });

    target = canvas.findTarget({
      clientX: 9, clientY: 9
    });

    equal(canvas.targets.length, 1, 'multiple calls to subtarget should not add more to targets');

    canvas.remove(group);
  });

  test('findTarget with perPixelTargetFind', function() {
    ok(typeof canvas.findTarget == 'function');
    var triangle = makeTriangle({ left: 0, top: 0 }), target;
    canvas.add(triangle);
    target = canvas.findTarget({
      clientX: 5, clientY: 5
    });
    equal(target, triangle, 'Should return the triangle by bounding box');
    //TODO find out why this stops the tests
    canvas.perPixelTargetFind = true;
    target = canvas.findTarget({
      clientX: 5, clientY: 5
    });
    equal(target, null, 'Should return null because of transparency checks');
    target = canvas.findTarget({
      clientX: 15, clientY: 15
    });
    equal(target, triangle, 'Should return the triangle now');
    canvas.perPixelTargetFind = false;
    canvas.remove(triangle);
  });

  test('findTarget on activegroup', function() {
    var rect1 = makeRect({ left: 0, top: 0 }), target;
    var rect2 = makeRect({ left: 20, top: 20 });
    var rect3 = makeRect({ left: 20, top: 0 });
    canvas.add(rect1);
    canvas.add(rect2);
    canvas.add(rect3);
    var group = new fabric.ActiveSelection([rect1, rect2]);
    canvas.setActiveObject(group);
    target = canvas.findTarget({
      clientX: 5, clientY: 5
    });
    equal(target, group, 'Should return the activegroup');
    target = canvas.findTarget({
      clientX: 40, clientY: 15
    });
    equal(target, null, 'Should miss the activegroup');
    target = canvas.findTarget({
      clientX: 5, clientY: 5
    }, true);
    equal(target, rect1, 'Should return the rect inside activegroup');
    target = canvas.findTarget({
      clientX: 25, clientY: 5
    });
    equal(target, group, 'Should return the activegroup');
    target = canvas.findTarget({
      clientX: 25, clientY: 5
    }, true);
    equal(target, rect3, 'Should return the rect behind activegroup');
  });

  test('findTarget on activegroup with perPixelTargetFind', function() {
    var rect1 = makeRect({ left: 0, top: 0 }), target;
    var rect2 = makeRect({ left: 20, top: 20 });
    canvas.perPixelTargetFind = true;
    canvas.preserveObjectStacking = true;
    canvas.add(rect1);
    canvas.add(rect2);
    var group = new fabric.ActiveSelection([rect1, rect2]);
    canvas.setActiveObject(group);
    target = canvas.findTarget({
      clientX: 8, clientY: 8
    });
    equal(target, group, 'Should return the activegroup');

    target = canvas.findTarget({
      clientX: 15, clientY: 15
    });
    equal(target, null, 'Should miss the activegroup');
    canvas.perPixelTargetFind = false;
    canvas.preserveObjectStacking = false;
  });

  test('ActiveSelection sendToBack', function() {

    var rect1 = makeRect(),
        rect2 = makeRect(),
        rect3 = makeRect(),
        rect4 = makeRect();

    canvas.add(rect1, rect2, rect3, rect4);

    var activeSel = new fabric.ActiveSelection([rect3, rect4]);
    canvas.setActiveObject(activeSel);
    equal(canvas._objects[0], rect1, 'rect1 should be last');
    equal(canvas._objects[1], rect2, 'rect2 should be second');
    canvas.sendToBack(activeSel);
    equal(canvas._objects[0], rect3, 'rect3 should be the new last');
    equal(canvas._objects[1], rect4, 'rect3 should be the new second');
    equal(canvas._objects[2], rect1, 'rect1 should be the third object');
    equal(canvas._objects[3], rect2, 'rect2 should be on top now');
  });

  test('activeGroup bringToFront', function() {

    var rect1 = makeRect(),
        rect2 = makeRect(),
        rect3 = makeRect(),
        rect4 = makeRect();

    canvas.add(rect1, rect2, rect3, rect4);

    var activeSel = new fabric.ActiveSelection([rect1, rect2]);
    canvas.setActiveObject(activeSel);
    equal(canvas._objects[0], rect1, 'rect1 should be last');
    equal(canvas._objects[1], rect2, 'rect2 should be second');
    canvas.bringToFront(activeSel);
    equal(canvas._objects[0], rect3, 'rect3 should be the new last');
    equal(canvas._objects[1], rect4, 'rect3 should be the new second');
    equal(canvas._objects[2], rect1, 'rect1 should be the third object');
    equal(canvas._objects[3], rect2, 'rect2 should be on top now');
  });

  test('activeGroup bringForward', function() {

    var rect1 = makeRect(),
        rect2 = makeRect(),
        rect3 = makeRect(),
        rect4 = makeRect();

    canvas.add(rect1, rect2, rect3, rect4);

    var activeSel = new fabric.ActiveSelection([rect1, rect2]);
    canvas.setActiveObject(activeSel);
    equal(canvas._objects[0], rect1, 'rect1 should be last');
    equal(canvas._objects[1], rect2, 'rect2 should be second');
    canvas.bringForward(activeSel);
    equal(canvas._objects[0], rect3, 'rect3 should be the new last');
    equal(canvas._objects[1], rect1, 'rect1 should be the new second');
    equal(canvas._objects[2], rect2, 'rect2 should be the third object');
    equal(canvas._objects[3], rect4, 'rect4 did not move');
    canvas.bringForward(activeSel);
    equal(canvas._objects[0], rect3, 'rect3 should be the new last');
    equal(canvas._objects[1], rect4, 'rect4 should be the new second');
    equal(canvas._objects[2], rect1, 'rect1 should be the third object');
    equal(canvas._objects[3], rect2, 'rect2 is the new top');
    canvas.bringForward(activeSel);
    canvas.bringForward(activeSel);
    equal(canvas._objects[0], rect3, 'rect3 should be the new last');
    equal(canvas._objects[1], rect4, 'rect4 should be the new second');
    equal(canvas._objects[2], rect1, 'rect1 is still third');
    equal(canvas._objects[3], rect2, 'rect2 is still new top');
  });

  test('activeGroup sendBackwards', function() {
    var rect1 = makeRect(),
        rect2 = makeRect(),
        rect3 = makeRect(),
        rect4 = makeRect();

    canvas.add(rect1, rect2, rect3, rect4);

    var activeSel = new fabric.ActiveSelection([rect3, rect4]);
    canvas.setActiveObject(activeSel);
    equal(canvas._objects[0], rect1, 'rect1 should be last');
    equal(canvas._objects[1], rect2, 'rect2 should be second');
    canvas.sendBackwards(activeSel);
    equal(canvas._objects[0], rect1, 'rect1 is still last');
    equal(canvas._objects[1], rect3, 'rect3 should be shifted down by 1');
    equal(canvas._objects[2], rect4, 'rect4 should be shifted down by 1');
    equal(canvas._objects[3], rect2, 'rect2 is the new top');
    canvas.sendBackwards(activeSel);
    equal(canvas._objects[0], rect3, 'rect3 is  last');
    equal(canvas._objects[1], rect4, 'rect4 should be shifted down by 1');
    equal(canvas._objects[2], rect1, 'rect1 should be shifted down by 1');
    equal(canvas._objects[3], rect2, 'rect2 is still on top');
    canvas.sendBackwards(activeSel);
    canvas.sendBackwards(activeSel);
    equal(canvas._objects[0], rect3, 'rect3 is still last');
    equal(canvas._objects[1], rect4, 'rect4 should be steady');
    equal(canvas._objects[2], rect1, 'rect1 should be steady');
    equal(canvas._objects[3], rect2, 'rect2 is still on top');
  });

  test('toDataURL', function() {
    ok(typeof canvas.toDataURL == 'function');
    if (!fabric.Canvas.supports('toDataURL')) {
      window.alert('toDataURL is not supported by this environment. Some of the tests can not be run.');
    }
    else {
      var dataURL = canvas.toDataURL();
      // don't compare actual data url, as it is often browser-dependent
      // this.assertIdentical(emptyImageCanvasData, canvas.toDataURL('png'));
      equal(typeof dataURL, 'string');
      equal(dataURL.substring(0, 21), 'data:image/png;base64');
    }
  });

//  asyncTest('getPointer', function() {
//    ok(typeof canvas.getPointer == 'function');
//
//    fabric.util.addListener(upperCanvasEl, 'click', function(e) {
//       canvas.calcOffset();
//       var pointer = canvas.getPointer(e);
//       equal(pointer.x, 101, 'pointer.x should be correct');
//       equal(pointer.y, 102, 'pointer.y should be correct');
//
//       start();
//   });

//     setTimeout(function() {
//       simulateEvent(upperCanvasEl, 'click', {
//         pointerX: 101, pointerY: 102
//       });
//     }, 100);
// });

  test('getCenter', function() {
    ok(typeof canvas.getCenter == 'function');
    var center = canvas.getCenter();
    equal(center.left, upperCanvasEl.width / 2);
    equal(center.top, upperCanvasEl.height / 2);
  });

  test('centerObjectH', function() {
    ok(typeof canvas.centerObjectH == 'function');
    var rect = makeRect({ left: 102, top: 202 });
    canvas.add(rect);
    equal(canvas.centerObjectH(rect), canvas, 'should be chainable');
    equal(rect.getCenterPoint().x, upperCanvasEl.width / 2, 'object\'s "left" property should correspond to canvas element\'s center');
  });

  test('centerObjectV', function() {
    ok(typeof canvas.centerObjectV == 'function');
    var rect = makeRect({ left: 102, top: 202 });
    canvas.add(rect);
    equal(canvas.centerObjectV(rect), canvas, 'should be chainable');
    equal(rect.getCenterPoint().y, upperCanvasEl.height / 2, 'object\'s "top" property should correspond to canvas element\'s center');
  });

  test('centerObject', function() {
    ok(typeof canvas.centerObject == 'function');
    var rect = makeRect({ left: 102, top: 202 });
    canvas.add(rect);
    equal(canvas.centerObject(rect), canvas, 'should be chainable');

    equal(rect.getCenterPoint().y, upperCanvasEl.height / 2, 'object\'s "top" property should correspond to canvas element\'s center');
    equal(rect.getCenterPoint().x, upperCanvasEl.width / 2, 'object\'s "left" property should correspond to canvas element\'s center');
  });

  test('straightenObject', function() {
    ok(typeof canvas.straightenObject == 'function');
    var rect = makeRect({ angle: 10 });
    canvas.add(rect);
    equal(canvas.straightenObject(rect), canvas, 'should be chainable');
    equal(rect.get('angle'), 0, 'angle should be coerced to 0 (from 10)');

    rect.rotate('60');
    canvas.straightenObject(rect);
    equal(rect.get('angle'), 90, 'angle should be coerced to 90 (from 60)');

    rect.rotate('100');
    canvas.straightenObject(rect);
    equal(rect.get('angle'), 90, 'angle should be coerced to 90 (from 100)');
  });

  test('toJSON', function() {
    ok(typeof canvas.toJSON == 'function');
    equal(JSON.stringify(canvas.toJSON()), EMPTY_JSON);
    canvas.backgroundColor = '#ff5555';
    canvas.overlayColor = 'rgba(0,0,0,0.2)';
    equal(JSON.stringify(canvas.toJSON()), '{"objects":[],"background":"#ff5555","overlay":"rgba(0,0,0,0.2)"}', '`background` and `overlayColor` value should be reflected in json');
    canvas.add(makeRect());
    deepEqual(JSON.stringify(canvas.toJSON()), RECT_JSON);
  });

  test('toJSON with active group', function() {
    var rect = new fabric.Rect({ width: 50, height: 50, left: 100, top: 100 });
    var circle = new fabric.Circle({ radius: 50, left: 50, top: 50 });
    canvas.add(rect, circle);
    var json = JSON.stringify(canvas);

    canvas.setActiveObject(new fabric.ActiveSelection([rect, circle], { canvas: canvas }));
    var jsonWithActiveGroup = JSON.stringify(canvas);

    equal(json, jsonWithActiveGroup);
  });

  test('toDatalessJSON', function() {
    var path = new fabric.Path('M 100 100 L 300 100 L 200 300 z', {
      sourcePath: 'http://example.com/'
    });
    canvas.add(path);
    equal(JSON.stringify(canvas.toDatalessJSON()), PATH_DATALESS_JSON);
  });

  test('toObject', function() {
    ok(typeof canvas.toObject == 'function');
    var expectedObject = {
      objects: canvas.getObjects()
    };
    deepEqual(expectedObject, canvas.toObject());

    var rect = makeRect();
    canvas.add(rect);

    equal(canvas.toObject().objects[0].type, rect.type);
  });

  test('toDatalessObject', function() {
    ok(typeof canvas.toDatalessObject == 'function');
    var expectedObject = {
      objects: canvas.getObjects()
    };
    deepEqual(expectedObject, canvas.toDatalessObject());

    var rect = makeRect();
    canvas.add(rect);

    equal(canvas.toObject().objects[0].type, rect.type);
    // TODO (kangax): need to test this method with fabric.Path to ensure that path is not populated
  });

  test('isEmpty', function() {
    ok(typeof canvas.isEmpty == 'function');
    ok(canvas.isEmpty());
    canvas.add(makeRect());
    ok(!canvas.isEmpty());
  });

  asyncTest('loadFromJSON with json string Canvas', function() {
    ok(typeof canvas.loadFromJSON == 'function');
    canvas.loadFromJSON(PATH_JSON, function() {
      var obj = canvas.item(0);

      ok(!canvas.isEmpty(), 'canvas is not empty');
      equal(obj.type, 'path', 'first object is a path object');
      equal(canvas.backgroundColor, '#ff5555', 'backgroundColor is populated properly');
      equal(canvas.overlayColor, 'rgba(0,0,0,0.2)', 'overlayColor is populated properly');

      equal(obj.get('left'), 268);
      equal(obj.get('top'), 266);
      equal(obj.get('width'), 49.803999999999995);
      equal(obj.get('height'), 48.027);
      equal(obj.get('fill'), 'rgb(0,0,0)');
      strictEqual(obj.get('stroke'), null);
      strictEqual(obj.get('strokeWidth'), 1);
      strictEqual(obj.get('scaleX'), 1);
      strictEqual(obj.get('scaleY'), 1);
      strictEqual(obj.get('angle'), 0);
      strictEqual(obj.get('flipX'), false);
      strictEqual(obj.get('flipY'), false);
      strictEqual(obj.get('opacity'), 1);
      ok(obj.get('path').length > 0);
      start();
    });
  });

  asyncTest('loadFromJSON with json object', function() {
    canvas.loadFromJSON(JSON.parse(PATH_JSON), function(){
      var obj = canvas.item(0);

      ok(!canvas.isEmpty(), 'canvas is not empty');
      equal(obj.type, 'path', 'first object is a path object');
      equal(canvas.backgroundColor, '#ff5555', 'backgroundColor is populated properly');
      equal(canvas.overlayColor, 'rgba(0,0,0,0.2)', 'overlayColor is populated properly');

      equal(obj.get('left'), 268);
      equal(obj.get('top'), 266);
      equal(obj.get('width'), 49.803999999999995);
      equal(obj.get('height'), 48.027);
      equal(obj.get('fill'), 'rgb(0,0,0)');
      strictEqual(obj.get('stroke'), null);
      strictEqual(obj.get('strokeWidth'), 1);
      strictEqual(obj.get('scaleX'), 1);
      strictEqual(obj.get('scaleY'), 1);
      strictEqual(obj.get('angle'), 0);
      strictEqual(obj.get('flipX'), false);
      strictEqual(obj.get('flipY'), false);
      strictEqual(obj.get('opacity'), 1);
      ok(obj.get('path').length > 0);
      start();
    });
  });

  asyncTest('loadFromJSON with json object without default values', function() {
    canvas.loadFromJSON(JSON.parse(PATH_WITHOUT_DEFAULTS_JSON), function(){
      var obj = canvas.item(0);

      ok(!canvas.isEmpty(), 'canvas is not empty');
      equal(obj.type, 'path', 'first object is a path object');
      equal(canvas.backgroundColor, '#ff5555', 'backgroundColor is populated properly');
      equal(canvas.overlayColor, 'rgba(0,0,0,0.2)', 'overlayColor is populated properly');

      equal(obj.get('originX'), 'left');
      equal(obj.get('originY'), 'top');
      equal(obj.get('left'), 268);
      equal(obj.get('top'), 266);
      equal(obj.get('width'), 49.803999999999995);
      equal(obj.get('height'), 48.027);
      equal(obj.get('fill'), 'rgb(0,0,0)');
      strictEqual(obj.get('stroke'), null);
      strictEqual(obj.get('strokeWidth'), 1);
      strictEqual(obj.get('scaleX'), 1);
      strictEqual(obj.get('scaleY'), 1);
      strictEqual(obj.get('angle'), 0);
      strictEqual(obj.get('flipX'), false);
      strictEqual(obj.get('flipY'), false);
      equal(obj.get('opacity'), 1);
      ok(obj.get('path').length > 0);
      start();
    });
  });

  asyncTest('loadFromJSON with reviver function', function() {
    function reviver(obj, instance) {
      deepEqual(obj, JSON.parse(PATH_OBJ_JSON));

      if (instance.type === 'path') {
        instance.customID = 'fabric_1';
      }
    }

    canvas.loadFromJSON(JSON.parse(PATH_JSON), function(){
      var obj = canvas.item(0);

      ok(!canvas.isEmpty(), 'canvas is not empty');
      equal(obj.type, 'path', 'first object is a path object');
      equal(canvas.backgroundColor, '#ff5555', 'backgroundColor is populated properly');
      equal(canvas.overlayColor, 'rgba(0,0,0,0.2)', 'overlayColor is populated properly');

      equal(obj.get('left'), 268);
      equal(obj.get('top'), 266);
      equal(obj.get('width'), 49.803999999999995);
      equal(obj.get('height'), 48.027);
      equal(obj.get('fill'), 'rgb(0,0,0)');
      strictEqual(obj.get('stroke'), null);
      strictEqual(obj.get('strokeWidth'), 1);
      strictEqual(obj.get('scaleX'), 1);
      strictEqual(obj.get('scaleY'), 1);
      strictEqual(obj.get('angle'), 0);
      strictEqual(obj.get('flipX'), false);
      strictEqual(obj.get('flipY'), false);
      strictEqual(obj.get('opacity'), 1);
      equal(obj.get('customID'), 'fabric_1');
      ok(obj.get('path').length > 0);
      start();
    }, reviver);
  });

  asyncTest('loadFromJSON with no objects', function() {
    var canvas1 = fabric.document.createElement('canvas'),
        canvas2 = fabric.document.createElement('canvas'),
        c1 = new fabric.Canvas(canvas1, { backgroundColor: 'green', overlayColor: 'yellow' }),
        c2 = new fabric.Canvas(canvas2, { backgroundColor: 'red', overlayColor: 'orange' });

    var json = c1.toJSON();
    var fired = false;
    c2.loadFromJSON(json, function() {
      fired = true;

      ok(fired, 'Callback should be fired even if no objects');
      equal(c2.backgroundColor, 'green', 'Color should be set properly');
      equal(c2.overlayColor, 'yellow', 'Color should be set properly');
      start();
    });
  });

  asyncTest('loadFromJSON without "objects" property', function() {
    var canvas1 = fabric.document.createElement('canvas'),
        canvas2 = fabric.document.createElement('canvas'),
        c1 = new fabric.Canvas(canvas1, { backgroundColor: 'green', overlayColor: 'yellow' }),
        c2 = new fabric.Canvas(canvas2, { backgroundColor: 'red', overlayColor: 'orange' });

    var json = c1.toJSON();
    var fired = false;

    delete json.objects;

    c2.loadFromJSON(json, function() {
      fired = true;

      ok(fired, 'Callback should be fired even if no "objects" property exists');
      equal(c2.backgroundColor, 'green', 'Color should be set properly');
      equal(c2.overlayColor, 'yellow', 'Color should be set properly');
      start();
    });
  });

  asyncTest('loadFromJSON with empty fabric.Group', function() {
    var canvas1 = fabric.document.createElement('canvas'),
        canvas2 = fabric.document.createElement('canvas'),
        c1 = new fabric.Canvas(canvas1),
        c2 = new fabric.Canvas(canvas2),
        group = new fabric.Group();

    c1.add(group);
    ok(!c1.isEmpty(), 'canvas is not empty');

    var json = c1.toJSON();
    var fired = false;
    c2.loadFromJSON(json, function() {
      fired = true;

      ok(fired, 'Callback should be fired even if empty fabric.Group exists');
      start();
    });
  });

  asyncTest('loadFromJSON with async content', function() {
    var group = new fabric.Group([
      new fabric.Rect({ width: 10, height: 20 }),
      new fabric.Circle({ radius: 10 })
    ]);
    var rect = new fabric.Rect({ width: 20, height: 10 });
    var circle = new fabric.Circle({ radius: 25 });

    canvas.add(group, rect, circle);
    var json = JSON.stringify(canvas);
    canvas.clear();

    equal(0, canvas.getObjects().length);

    canvas.loadFromJSON(json, function() {
      equal(3, canvas.getObjects().length);

      start();
    });
  });

  asyncTest('loadFromDatalessJSON with async content', function() {

    var circ1 = new fabric.Circle({ radius: 30, fill: '#55f', top: 0, left: 0 });
    var circ2 = new fabric.Circle({ radius: 30, fill: '#f55', top: 50, left: 50 });
    var circ3 = new fabric.Circle({ radius: 30, fill: '#5f5', top: 50, left: 50 });

    var arr = [circ1, circ2];
    var group = new fabric.Group(arr, { top: 150, left: 150 });

    canvas.add(circ3);
    canvas.add(group);
    canvas.renderAll();

    canvas._discardActiveObject();
    var json = JSON.stringify( canvas.toDatalessJSON() );
    canvas.clear();
    canvas.loadFromDatalessJSON(json, function() {

      equal(2, canvas.getObjects().length);
      equal('group', canvas.getObjects()[1].type);

      start();
    });
  });

  asyncTest('loadFromJSON with custom properties on Canvas with no async object', function() {
    var serialized = JSON.parse(PATH_JSON);
    serialized.controlsAboveOverlay = true;
    serialized.preserveObjectStacking = true;
    equal(canvas.controlsAboveOverlay, fabric.Canvas.prototype.controlsAboveOverlay);
    equal(canvas.preserveObjectStacking, fabric.Canvas.prototype.preserveObjectStacking);
    canvas.loadFromJSON(serialized, function() {
      ok(!canvas.isEmpty(), 'canvas is not empty');
      equal(canvas.controlsAboveOverlay, true);
      equal(canvas.preserveObjectStacking, true);
      start();
    });
  });

  asyncTest('loadFromJSON with custom properties on Canvas with image', function() {
    var JSON_STRING = '{"objects":[{"type":"image","originX":"left","originY":"top","left":13.6,"top":-1.4,"width":3000,"height":3351,"fill":"rgb(0,0,0)","stroke":null,"strokeWidth":0,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":0.05,"scaleY":0.05,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","transformMatrix":null,"skewX":0,"skewY":0,"src":"' + IMG_SRC + '","filters":[],"crossOrigin":""}],'
+ '"background":"green"}';
    var serialized = JSON.parse(JSON_STRING);
    serialized.controlsAboveOverlay = true;
    serialized.preserveObjectStacking = true;
    equal(canvas.controlsAboveOverlay, fabric.Canvas.prototype.controlsAboveOverlay);
    equal(canvas.preserveObjectStacking, fabric.Canvas.prototype.preserveObjectStacking);
    canvas.loadFromJSON(serialized, function() {
      ok(!canvas.isEmpty(), 'canvas is not empty');
      equal(canvas.controlsAboveOverlay, true);
      equal(canvas.preserveObjectStacking, true);
      start();
    });
    // before callback the properties are still false.
    equal(canvas.controlsAboveOverlay, false);
    equal(canvas.preserveObjectStacking, false);
  });


  test('normalize pointer', function(){
    ok(typeof canvas._normalizePointer == 'function');
    var pointer = { x: 10, y: 20 },
        object = makeRect({ top: 10, left: 10, width: 50, height: 50, strokeWidth: 0}),
        normalizedPointer = canvas._normalizePointer(object, pointer);
    equal(normalizedPointer.x, -25, 'should be in top left corner of rect');
    equal(normalizedPointer.y, -15, 'should be in top left corner of rect');
    object.angle = 90;
    normalizedPointer = canvas._normalizePointer(object, pointer);
    equal(normalizedPointer.x, -15, 'should consider angle');
    equal(normalizedPointer.y, -25, 'should consider angle');
    object.angle = 0;
    object.scaleX = 2;
    object.scaleY = 2;
    normalizedPointer = canvas._normalizePointer(object, pointer);
    equal(normalizedPointer.x, -25, 'should consider scale');
    equal(normalizedPointer.y, -20, 'should consider scale');
    object.skewX = 60;
    normalizedPointer = canvas._normalizePointer(object, pointer);
    equal(normalizedPointer.x.toFixed(2), -33.66, 'should consider skewX');
    equal(normalizedPointer.y, -20, 'should not change');
  });

  test('restorePointerVpt', function(){
    ok(typeof canvas.restorePointerVpt == 'function');
    var pointer = { x: 10, y: 20 },
        restoredPointer = canvas.restorePointerVpt(pointer);
    equal(restoredPointer.x, pointer.x, 'no changes if not vpt is set');
    equal(restoredPointer.y, pointer.y, 'no changes if not vpt is set');
    canvas.viewportTransform = [2, 0, 0, 2, 50, -60];
    restoredPointer = canvas.restorePointerVpt(pointer);
    equal(restoredPointer.x, -20, 'vpt changes restored');
    equal(restoredPointer.y, 40, 'vpt changes restored');
    canvas.viewportTransform = [1, 0, 0, 1, 0, 0];
  });

  // asyncTest('loadFromJSON with backgroundImage', function() {
  //   canvas.setBackgroundImage('../../assets/pug.jpg');
  //   var anotherCanvas = new fabric.Canvas();

  //   setTimeout(function() {

  //     var json = JSON.stringify(canvas);
  //     anotherCanvas.loadFromJSON(json);

  //     setTimeout(function() {

  //       equal(JSON.stringify(anotherCanvas), json, 'backgrondImage and properties are initialized correctly');
  //       start();

  //     }, 1000);
  //   }, 1000);
  // });


  test('sendToBack', function() {
    ok(typeof canvas.sendToBack == 'function');

    var rect1 = makeRect(),
        rect2 = makeRect(),
        rect3 = makeRect();

    canvas.add(rect1, rect2, rect3);

    canvas.sendToBack(rect3);
    equal(canvas.item(0), rect3, 'third should now be the first one');

    canvas.sendToBack(rect2);
    equal(canvas.item(0), rect2, 'second should now be the first one');

    canvas.sendToBack(rect2);
    equal(canvas.item(0), rect2, 'second should *still* be the first one');
  });

  test('bringToFront', function() {
    ok(typeof canvas.bringToFront == 'function');

    var rect1 = makeRect(),
        rect2 = makeRect(),
        rect3 = makeRect();

    canvas.add(rect1, rect2, rect3);

    canvas.bringToFront(rect1);
    equal(canvas.item(2), rect1, 'first should now be the last one');

    canvas.bringToFront(rect2);
    equal(canvas.item(2), rect2, 'second should now be the last one');

    canvas.bringToFront(rect2);
    equal(canvas.item(2), rect2, 'second should *still* be the last one');
  });

  test('sendBackwards', function() {
    ok(typeof canvas.sendBackwards == 'function');

    var rect1 = makeRect(),
        rect2 = makeRect(),
        rect3 = makeRect();

    canvas.add(rect1, rect2, rect3);

    // [ 1, 2, 3 ]
    equal(canvas.item(0), rect1);
    equal(canvas.item(1), rect2);
    equal(canvas.item(2), rect3);

    canvas.sendBackwards(rect3);

    // moved 3 one level back — [1, 3, 2]
    equal(canvas.item(0), rect1);
    equal(canvas.item(2), rect2);
    equal(canvas.item(1), rect3);

    canvas.sendBackwards(rect3);

    // moved 3 one level back — [3, 1, 2]
    equal(canvas.item(1), rect1);
    equal(canvas.item(2), rect2);
    equal(canvas.item(0), rect3);

    canvas.sendBackwards(rect3);

    // 3 stays at the deepEqual position — [2, 3, 1]
    equal(canvas.item(1), rect1);
    equal(canvas.item(2), rect2);
    equal(canvas.item(0), rect3);

    canvas.sendBackwards(rect2);

    equal(canvas.item(2), rect1);
    equal(canvas.item(1), rect2);
    equal(canvas.item(0), rect3);

    canvas.sendBackwards(rect2);

    equal(canvas.item(2), rect1);
    equal(canvas.item(0), rect2);
    equal(canvas.item(1), rect3);
  });

  test('bringForward', function() {
    ok(typeof canvas.bringForward == 'function');

    var rect1 = makeRect(),
        rect2 = makeRect(),
        rect3 = makeRect();

    canvas.add(rect1, rect2, rect3);

    // initial position — [ 1, 2, 3 ]
    equal(canvas.item(0), rect1);
    equal(canvas.item(1), rect2);
    equal(canvas.item(2), rect3);

    canvas.bringForward(rect1);

    // 1 moves one way up — [ 2, 1, 3 ]
    equal(canvas.item(1), rect1);
    equal(canvas.item(0), rect2);
    equal(canvas.item(2), rect3);

    canvas.bringForward(rect1);

    // 1 moves one way up again — [ 2, 3, 1 ]
    equal(canvas.item(2), rect1);
    equal(canvas.item(0), rect2);
    equal(canvas.item(1), rect3);

    canvas.bringForward(rect1);

    // 1 is already all the way on top and so doesn't change position — [ 2, 3, 1 ]
    equal(canvas.item(2), rect1);
    equal(canvas.item(0), rect2);
    equal(canvas.item(1), rect3);

    canvas.bringForward(rect3);

    // 1 is already all the way on top and so doesn't change position — [ 2, 1, 3 ]
    equal(canvas.item(1), rect1);
    equal(canvas.item(0), rect2);
    equal(canvas.item(2), rect3);
  });

  test('setActiveObject', function() {
    ok(typeof canvas.setActiveObject == 'function');

    var rect1 = makeRect(),
        rect2 = makeRect();

    canvas.add(rect1, rect2);

    canvas.setActiveObject(rect1);
    ok(rect1 === canvas._activeObject);

    canvas.setActiveObject(rect2);
    ok(rect2 === canvas._activeObject);
  });

  test('getActiveObject', function() {
    ok(typeof canvas.getActiveObject == 'function');
    equal(canvas.getActiveObject(), null, 'should initially be null');
    var rect1 = makeRect(),
        rect2 = makeRect();

    canvas.add(rect1, rect2);

    canvas.setActiveObject(rect1);
    equal(canvas.getActiveObject(), rect1);

    canvas.setActiveObject(rect2);
    equal(canvas.getActiveObject(), rect2);
  });

  test('getsetActiveObject', function() {
    equal(canvas.getActiveObject(), null, 'should initially be null');

    var group = new fabric.Group([
      makeRect({ left: 10, top: 10 }),
      makeRect({ left: 20, top: 20 })
    ]);

    equal(canvas.setActiveObject(group), canvas, 'should be chainable');
    equal(canvas.getActiveObject(), group);
  });

  test('item', function() {
    ok(typeof canvas.item == 'function');

    var rect1 = makeRect(),
        rect2 = makeRect();

    canvas.add(rect1, rect2);

    equal(canvas.item(0), rect1);
    equal(canvas.item(1), rect2);

    canvas.remove(canvas.item(0));

    equal(canvas.item(0), rect2);
  });

  test('discardActiveObject on ActiveSelection', function() {
    var group = new fabric.ActiveSelection([makeRect(), makeRect()]);
    canvas.setActiveObject(group);
    equal(canvas.discardActiveObject(), canvas, 'should be chainable');
    equal(canvas.getActiveObject(), null, 'removing active group sets it to null');
  });

  test('_discardActiveObject', function() {

    canvas.add(makeRect());
    canvas.setActiveObject(canvas.item(0));

    canvas._discardActiveObject();
    ok(!canvas.item(0).active);
    equal(canvas.getActiveObject(), null);
  });

  test('discardActiveObject', function() {
    ok(typeof canvas.discardActiveObject == 'function');

    canvas.add(makeRect());
    canvas.setActiveObject(canvas.item(0));

    var group = new fabric.Group([
      makeRect({ left: 10, top: 10 }),
      makeRect({ left: 20, top: 20 })
    ]);

    canvas.setActiveObject(group);

    var eventsFired = {
      selectionCleared: false
    };

    canvas.on('selection:cleared', function(){
      eventsFired.selectionCleared = true;
    });

    canvas.discardActiveObject();
    ok(!canvas.item(0).active);
    equal(canvas.getActiveObject(), null);
    equal(canvas.getActiveObject(), null);

    for (var prop in eventsFired) {
      ok(eventsFired[prop]);
    }
  });

  test('complexity', function() {
    ok(typeof canvas.complexity == 'function');
    equal(canvas.complexity(), 0);

    canvas.add(makeRect());
    equal(canvas.complexity(), 1);

    canvas.add(makeRect(), makeRect());
    equal(canvas.complexity(), 3);
  });

  test('toString', function() {
    ok(typeof canvas.toString == 'function');

    equal(canvas.toString(), '#<fabric.Canvas (0): { objects: 0 }>');

    canvas.add(makeRect());
    equal(canvas.toString(), '#<fabric.Canvas (1): { objects: 1 }>');
  });

  test('toSVG with active group', function() {
    var rect = new fabric.Rect({ width: 50, height: 50, left: 100, top: 100 });
    var circle = new fabric.Circle({ radius: 50, left: 50, top: 50 });
    canvas.add(rect, circle);
    var svg = canvas.toSVG();

    canvas.setActiveObject(new fabric.ActiveSelection([rect, circle]));
    var svgWithActiveGroup = canvas.toSVG();

    equal(svg, svgWithActiveGroup);
  });

  test('active group objects reordering', function() {
    var rect1 = new fabric.Rect({ width: 30, height: 30, left: 130, top: 130 });
    var rect2 = new fabric.Rect({ width: 50, height: 50, left: 100, top: 100 });
    var circle1 = new fabric.Circle({ radius: 10, left: 60, top: 60 });
    var circle2 = new fabric.Circle({ radius: 50, left: 50, top: 50 });
    canvas.add(rect1, rect2, circle1, circle2);
    equal(canvas._objects[0], rect1);
    equal(canvas._objects[1], rect2);
    equal(canvas._objects[2], circle1);
    equal(canvas._objects[3], circle2);
    var aGroup = new fabric.ActiveSelection([rect2, circle2, rect1, circle1]);
    // before rendering objects are ordered in insert order
    equal(aGroup._objects[0], rect2);
    equal(aGroup._objects[1], circle2);
    equal(aGroup._objects[2], rect1);
    equal(aGroup._objects[3], circle1);
    canvas.setActiveObject(aGroup).renderAll();
    // after rendering objects are ordered in canvas stack order
    equal(aGroup._objects[0], rect1);
    equal(aGroup._objects[1], rect2);
    equal(aGroup._objects[2], circle1);
    equal(aGroup._objects[3], circle2);
  });

  test('dispose', function() {
    //made local vars to do not dispose the external canvas
    var el = fabric.document.createElement('canvas'),
        parentEl = fabric.document.createElement('div'),
        wrapperEl, lowerCanvasEl, upperCanvasEl;
    el.width = 200; el.height = 200;
    parentEl.className = 'rootNode';
    parentEl.appendChild(el);

    equal(parentEl.firstChild, el, 'canvas should be appended at partentEl');
    equal(parentEl.childNodes.length, 1, 'parentEl has 1 child only');

    var canvas = fabric.isLikelyNode ? fabric.createCanvasForNode() : new fabric.Canvas(el);
    wrapperEl = canvas.wrapperEl;
    lowerCanvasEl = canvas.lowerCanvasEl;
    upperCanvasEl = canvas.upperCanvasEl;
    equal(parentEl.childNodes.length, 1, 'parentEl has still 1 child only');
    equal(wrapperEl.childNodes.length, 2, 'wrapper should have 2 children');
    equal(wrapperEl.tagName, 'DIV', 'We wrapped canvas with DIV');
    equal(wrapperEl.className, canvas.containerClass, 'DIV class should be set');
    equal(wrapperEl.childNodes[0], lowerCanvasEl, 'First child should be lowerCanvas');
    equal(wrapperEl.childNodes[1], upperCanvasEl, 'Second child should be upperCanvas');
    if (!fabric.isLikelyNode) {
      equal(parentEl.childNodes[0], wrapperEl, 'wrapperEl is appendend to rootNode');
    }
    //looks like i cannot use parentNode
    //equal(wrapperEl, lowerCanvasEl.parentNode, 'lowerCanvas is appended to wrapperEl');
    //equal(wrapperEl, upperCanvasEl.parentNode, 'upperCanvas is appended to wrapperEl');
    //equal(parentEl, wrapperEl.parentNode, 'wrapperEl is appendend to rootNode');
    equal(parentEl.childNodes.length, 1, 'parent div should have 1 child');
    notEqual(parentEl.firstChild, canvas.getElement(), 'canvas should not be parent div firstChild');
    ok(typeof canvas.dispose == 'function');
    canvas.add(makeRect(), makeRect(), makeRect());
    canvas.dispose();
    equal(canvas.getObjects().length, 0, 'dispose should clear canvas');
    equal(parentEl.childNodes.length, 1, 'parent has always 1 child');
    if (!fabric.isLikelyNode) {
      equal(parentEl.childNodes[0], lowerCanvasEl, 'canvas should be back to its firstChild place');
    }
    equal(canvas.wrapperEl, null, 'wrapperEl should be deleted');
    equal(canvas.upperCanvasEl, null, 'upperCanvas should be deleted');
  });

  // test('dispose', function() {
  //   function invokeEventsOnCanvas() {
  //     // nextSibling because we need to invoke events on upper canvas
  //     simulateEvent(canvas.getElement().nextSibling, 'mousedown');
  //     simulateEvent(canvas.getElement().nextSibling, 'mouseup');
  //     simulateEvent(canvas.getElement().nextSibling, 'mousemove');
  //   }
  //   var assertInvocationsCount = function() {
  //     var message = 'event handler should not be invoked after `dispose`';
  //     equal(handlerInvocationCounts.__onMouseDown, 1);
  //     equal(handlerInvocationCounts.__onMouseUp, 1);
  //     equal(handlerInvocationCounts.__onMouseMove, 1);
  //   };

  //   ok(typeof canvas.dispose == 'function');
  //   canvas.add(makeRect(), makeRect(), makeRect());

  //   var handlerInvocationCounts = {
  //     __onMouseDown: 0, __onMouseUp: 0, __onMouseMove: 0
  //   };

  //   // hijack event handlers
  //   canvas.__onMouseDown = function() {
  //     handlerInvocationCounts.__onMouseDown++;
  //   };
  //   canvas.__onMouseUp = function() {
  //     handlerInvocationCounts.__onMouseUp++;
  //   };
  //   canvas.__onMouseMove = function() {
  //     handlerInvocationCounts.__onMouseMove++;
  //   };

  //   invokeEventsOnCanvas();
  //   assertInvocationsCount();

  //   canvas.dispose();
  //   equal(canvas.getObjects().length, 0, 'dispose should clear canvas');

  //   invokeEventsOnCanvas();
  //   assertInvocationsCount();
  // });

  asyncTest('clone', function() {
    ok(typeof canvas.clone == 'function');

    canvas.add(new fabric.Rect({ width: 100, height: 110, top: 120, left: 130, fill: 'rgba(0,1,2,0.3)' }));
    var canvasData = JSON.stringify(canvas);

    canvas.clone(function(clone) {
      ok(clone instanceof fabric.Canvas);

      // alert(JSON.stringify(clone));
      equal(canvasData, JSON.stringify(clone), 'data on cloned canvas should be identical');

      equal(canvas.getWidth(), clone.getWidth());
      equal(canvas.getHeight(), clone.getHeight());

      start();
    });
  });

  asyncTest('cloneWithoutData', function() {
    ok(typeof canvas.cloneWithoutData == 'function');

    canvas.add(new fabric.Rect({ width: 100, height: 110, top: 120, left: 130, fill: 'rgba(0,1,2,0.3)' }));

    canvas.cloneWithoutData(function(clone) {

      ok(clone instanceof fabric.Canvas);

      equal(JSON.stringify(clone), EMPTY_JSON, 'data on cloned canvas should be empty');

      equal(canvas.getWidth(), clone.getWidth());
      equal(canvas.getHeight(), clone.getHeight());

      start();
    });
  });

  test('getSetWidth', function() {
    ok(typeof canvas.getWidth == 'function');
    equal(canvas.getWidth(), 600);
    equal(canvas.setWidth(444), canvas, 'should be chainable');
    equal(canvas.getWidth(), 444);
    equal(canvas.lowerCanvasEl.style.width, 444 + 'px');
  });

  test('getSetHeight', function() {
    ok(typeof canvas.getHeight == 'function');
    equal(canvas.getHeight(), 600);
    equal(canvas.setHeight(765), canvas, 'should be chainable');
    equal(canvas.getHeight(), 765);
    equal(canvas.lowerCanvasEl.style.height, 765 + 'px');
  });

  test('setWidth css only', function() {
    canvas.setWidth(123);
    canvas.setWidth('100%', { cssOnly: true });

    equal(canvas.lowerCanvasEl.style.width, '100%', 'Should be as the css only value');
    equal(canvas.upperCanvasEl.style.width, '100%', 'Should be as the css only value');
    equal(canvas.wrapperEl.style.width, '100%', 'Should be as the css only value');
    equal(canvas.getWidth(), 123, 'Should be as the none css only value');
  });

  test('setHeight css only', function() {
    canvas.setHeight(123);
    canvas.setHeight('100%', { cssOnly: true });

    equal(canvas.lowerCanvasEl.style.height, '100%', 'Should be as the css only value');
    equal(canvas.upperCanvasEl.style.height, '100%', 'Should be as the css only value');
    equal(canvas.wrapperEl.style.height, '100%', 'Should be as the css only value');
    equal(canvas.getWidth(), 123, 'Should be as the none css only value');
  });

  test('setWidth backstore only', function() {
    canvas.setWidth(123);
    canvas.setWidth(500, { backstoreOnly: true });

    equal(canvas.lowerCanvasEl.style.width, 123 + 'px', 'Should be as none backstore only value + "px"');
    equal(canvas.upperCanvasEl.style.width, 123 + 'px', 'Should be as none backstore only value + "px"');
    equal(canvas.wrapperEl.style.width, 123 + 'px', 'Should be as none backstore only value + "px"');
    equal(canvas.getWidth(), 500, 'Should be as the backstore only value');
  });

  test('setHeight backstore only', function() {
    canvas.setHeight(123);
    canvas.setHeight(500, { backstoreOnly: true });

    equal(canvas.lowerCanvasEl.style.height, 123 + 'px', 'Should be as none backstore only value + "px"');
    equal(canvas.upperCanvasEl.style.height, 123 + 'px', 'Should be as none backstore only value + "px"');
    equal(canvas.wrapperEl.style.height, 123 + 'px', 'Should be as none backstore only value + "px"');
    equal(canvas.getHeight(), 500, 'Should be as the backstore only value');
  });

  test('containsPoint', function() {
    ok(typeof canvas.containsPoint == 'function');

    var rect = new fabric.Rect({ left: 75, top: 75, width: 50, height: 50 });
    canvas.add(rect);

    var canvasEl = canvas.getElement(),
        canvasOffset = fabric.util.getElementOffset(canvasEl);

    var eventStub = {
      clientX: canvasOffset.left + 100,
      clientY: canvasOffset.top + 100,
      target: rect
    };

    ok(canvas.containsPoint(eventStub, rect), 'point at (100, 100) should be within area (75, 75, 125, 125)');

    eventStub = {
      clientX: canvasOffset.left + 200,
      clientY: canvasOffset.top + 200,
      target: rect
    };
    ok(!canvas.containsPoint(eventStub, rect), 'point at (200, 200) should NOT be within area (75, 75, 125, 125)');

    rect.set('left', 175).set('top', 175).setCoords();
    ok(canvas.containsPoint(eventStub, rect), 'on rect at (200, 200) should be within area (175, 175, 225, 225)');
  });

  test('setupCurrentTransform', function() {
    ok(typeof canvas._setupCurrentTransform == 'function');

    var rect = new fabric.Rect({ left: 75, top: 75, width: 50, height: 50 });
    canvas.add(rect);
    var canvasEl = canvas.getElement(),
        canvasOffset = fabric.util.getElementOffset(canvasEl);
    var eventStub = {
      clientX: canvasOffset.left + 100,
      clientY: canvasOffset.top + 100,
      target: rect
    };
    canvas.setActiveObject(rect);
    canvas._setupCurrentTransform(eventStub, rect);
    var t = canvas._currentTransform;
    equal(t.target, rect, 'should have rect as a target');
    equal(t.action, 'drag', 'should target inside rect and setup drag');
    equal(t.corner, 0, 'no corner selected');
    equal(t.originX, rect.originX, 'no origin change for drag');
    equal(t.originY, rect.originY, 'no origin change for drag');

    eventStub = {
      clientX: canvasOffset.left + rect.oCoords.tl.corner.tl.x + 1,
      clientY: canvasOffset.top + rect.oCoords.tl.corner.tl.y + 1,
      target: rect
    };
    canvas._setupCurrentTransform(eventStub, rect);
    t = canvas._currentTransform;
    equal(t.target, rect, 'should have rect as a target');
    equal(t.action, 'scale', 'should target a corner and setup scale');
    equal(t.corner, 'tl', 'tl selected');
    equal(t.originX, 'right', 'origin in opposite direction');
    equal(t.originY, 'bottom', 'origin in opposite direction');
    equal(t.shiftKey, undefined, 'shift was not pressed');

    eventStub = {
      clientX: canvasOffset.left + rect.left - 2,
      clientY: canvasOffset.top + rect.top + rect.height / 2,
      target: rect,
      shiftKey: true
    };
    canvas._setupCurrentTransform(eventStub, rect);
    t = canvas._currentTransform;
    equal(t.target, rect, 'should have rect as a target');
    equal(t.action, 'skewY', 'should target a corner and setup skew');
    equal(t.shiftKey, true, 'shift was pressed');
    equal(t.corner, 'ml', 'ml selected');
    equal(t.originX, 'right', 'origin in opposite direction');

    eventStub = {
      clientX: canvasOffset.left + rect.oCoords.mtr.x,
      clientY: canvasOffset.top + rect.oCoords.mtr.y,
      target: rect,
    };
    canvas._setupCurrentTransform(eventStub, rect);
    t = canvas._currentTransform;
    equal(t.target, rect, 'should have rect as a target');
    equal(t.action, 'rotate', 'should target a corner and setup rotate');
    equal(t.corner, 'mtr', 'mtr selected');
    canvas._currentTransform = false;
  });

  test('_scaleObject', function() {
    ok(typeof canvas._scaleObject == 'function');
    var rect = new fabric.Rect({ left: 75, top: 75, width: 50, height: 50 });
    canvas.add(rect);
    var canvasEl = canvas.getElement(),
        canvasOffset = fabric.util.getElementOffset(canvasEl);
    var eventStub = {
      clientX: canvasOffset.left + rect.oCoords.tl.corner.tl.x + 1,
      clientY: canvasOffset.top + rect.oCoords.tl.corner.tl.y + 1,
      target: rect
    };
    canvas._setupCurrentTransform(eventStub, rect);
    var scaled = canvas._scaleObject(30, 30, 'equally');
    equal(scaled, true, 'return true if scaling happened');
    scaled = canvas._scaleObject(30, 30, 'equally');
    equal(scaled, false, 'return false if no movement happen');
  });

  test('containsPoint in viewport transform', function() {
    canvas.viewportTransform = [2, 0, 0, 2, 50, 50];
    var rect = new fabric.Rect({ left: 75, top: 75, width: 50, height: 50 });
    canvas.add(rect);

    var canvasEl = canvas.getElement(),
        canvasOffset = fabric.util.getElementOffset(canvasEl);

    var eventStub = {
      clientX: canvasOffset.left + 250,
      clientY: canvasOffset.top + 250,
      target: rect
    };

    ok(canvas.containsPoint(eventStub, rect), 'point at (250, 250) should be within area (75, 75, 125, 125)');
    canvas.viewportTransform = [1, 0, 0, 1, 0, 0];
  });

  asyncTest('fxRemove', function() {
    ok(typeof canvas.fxRemove == 'function');

    var rect = new fabric.Rect();
    canvas.add(rect);

    var callbackFired = false;
    function onComplete() {
      callbackFired = true;
    }

    equal(canvas.item(0), rect);
    equal(canvas.fxRemove(rect, { onComplete: onComplete }), canvas, 'should be chainable');

    setTimeout(function() {
      equal(canvas.item(0), undefined);
      ok(callbackFired);
      start();
    }, 1000);
  });

  // asyncTest('backgroundImage', function() {
  //   deepEqual('', canvas.backgroundImage);
  //   canvas.setBackgroundImage('../../assets/pug.jpg');

  //   setTimeout(function() {

  //     ok(typeof canvas.backgroundImage == 'object');
  //     ok(/pug\.jpg$/.test(canvas.backgroundImage.src));

  //     deepEqual(canvas.toJSON(), {
  //       "objects": [],
  //       "background": "rgba(0, 0, 0, 0)",
  //       "backgroundImage": (fabric.document.location.protocol +
  //                           '//' +
  //                           fabric.document.location.hostname +
  //                           ((fabric.document.location.port === '' || parseInt(fabric.document.location.port, 10) === 80)
  //                               ? ''
  //                               : (':' + fabric.document.location.port)) +
  //                           '/assets/pug.jpg'),
  //       "backgroundImageOpacity": 1,
  //       "backgroundImageStretch": true
  //     });

  //     start();
  //   }, 1000);
  // });

  test('clipTo', function() {
    canvas.clipTo = function(ctx) {
      ctx.arc(0, 0, 10, 0, Math.PI * 2, false);
    };

    var error;
    try {
      canvas.renderAll();
    }
    catch (err) {
      error = err;
    }
    delete canvas.clipTo;

    ok(typeof error == 'undefined', 'renderAll with clipTo does not throw');
  });

  test('canvas inheritance', function() {

    // this should not error out
    var InheritedCanvasClass = fabric.util.createClass(fabric.Canvas, {
      initialize: function() {

      }
    });

    ok(typeof InheritedCanvasClass === 'function');
  });

  test('mouse:down with different buttons', function() {
    var clickCount = 0;
    function mouseHandler() {
      clickCount++;
    }
    canvas.on('mouse:down', mouseHandler);
    canvas.fireMiddleClick = false;
    canvas.fireRightClick = false;
    canvas._currentTransform = false;
    canvas.isDrawingMode = false;
    canvas.__onMouseDown({ which: 1 });
    equal(clickCount, 1, 'mouse down fired');
    clickCount = 0;
    canvas.__onMouseDown({ which: 3 });
    equal(clickCount, 0, 'rightclick did not fire a mouse:down event');
    canvas.fireRightClick = true;
    canvas.__onMouseDown({ which: 3 });
    equal(clickCount, 1, 'rightclick did fire a mouse:down event');
    clickCount = 0;
    canvas.__onMouseDown({ which: 2 });
    equal(clickCount, 0, 'middleClick did not fire a mouse:down event');
    canvas.fireMiddleClick = true;
    canvas.__onMouseDown({ which: 2 });
    equal(clickCount, 1, 'middleClick did fire a mouse:down event');
  });

  test('mouse:down and group selector', function() {
    var e = { clientX: 30, clientY: 30, which: 1 };
    var rect = new fabric.Rect({ width: 60, height: 60 });
    var expectedGroupSelector = { ex: 30, ey: 30, top: 0, left: 0 };
    canvas.__onMouseDown(e);
    deepEqual(canvas._groupSelector, expectedGroupSelector, 'a new groupSelector is created');
    canvas.add(rect);
    canvas.__onMouseUp(e);
    canvas.__onMouseDown(e);
    deepEqual(canvas._groupSelector, null, 'with object on target no groupSelector is started');
    rect.selectable = false;
    canvas.__onMouseUp(e);
    canvas.__onMouseDown(e);
    deepEqual(canvas._groupSelector, null, 'with object non selectable but already selected groupSelector is not started');
    canvas.__onMouseUp(e);
    canvas.discardActiveObject();
    rect.isEditing = true;
    canvas.__onMouseDown(e);
    deepEqual(canvas._groupSelector, null, 'with object editing, groupSelector is not started');
    canvas.__onMouseUp(e);
    canvas.discardActiveObject();
    rect.isEditing = false;
    canvas.__onMouseDown(e);
    deepEqual(canvas._groupSelector, expectedGroupSelector, 'a new groupSelector is created');
    canvas.__onMouseUp(e);
  });

  test('mouse:up isClick = true', function() {
    var e = { clientX: 30, clientY: 30, which: 1 };
    var isClick = false;
    canvas.on('mouse:up', function(opt) {
      isClick = opt.isClick;
    });
    canvas.__onMouseDown(e);
    canvas.__onMouseUp(e);
    equal(isClick, true, 'without moving the pointer, the click is true');
  });

  test('mouse:up isClick = false', function() {
    var e = { clientX: 30, clientY: 30, which: 1 };
    var e2 = { clientX: 31, clientY: 31, which: 1 };
    var isClick = true;
    canvas.on('mouse:up', function(opt) {
      isClick = opt.isClick;
    });
    canvas.__onMouseDown(e);
    canvas.__onMouseMove(e2);
    canvas.__onMouseUp(e2);
    equal(isClick, false, 'moving the pointer, the click is false');
  });

  test('avoid multiple bindings', function() {
    var el2 = fabric.document.createElement('canvas');
    var c = fabric.isLikelyNode ? fabric.createCanvasForNode() : new fabric.Canvas(el2);
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
      c._onContextMenu
    ];
    // initialize canvas more than once
    c.initialize(el2);
    c.initialize(el2);
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
      c._onContextMenu
    ];
    deepEqual(eventsArray, eventsArray2, 'after first initialize, functions do not change.');
  });

  test('avoid multiple registration - mousedown', function() {
    var el2 = fabric.document.createElement('canvas');
    var originalMouseDown = fabric.Canvas.prototype._onMouseDown;
    var counter = 0;
    fabric.Canvas.prototype._onMouseDown = function() {
      counter++;
    };
    var c = fabric.isLikelyNode ? fabric.createCanvasForNode() : new fabric.Canvas(el2);
    // initialize canvas more than once
    c.initialize(el2);
    c.initialize(el2);
    var event = fabric.document.createEvent('MouseEvent');
    event.initEvent('mousedown', true, true);
    c.upperCanvasEl.dispatchEvent(event);
    equal(counter, 1, 'listener executed once');
    fabric.Canvas.prototype._onMouseDown = originalMouseDown;
  });

  test('avoid multiple registration - mousemove', function() {
    var el2 = fabric.document.createElement('canvas');
    var originalMouseMove = fabric.Canvas.prototype._onMouseMove;
    var counter = 0;
    fabric.Canvas.prototype._onMouseMove = function() {
      counter++;
    };
    var c = fabric.isLikelyNode ? fabric.createCanvasForNode() : new fabric.Canvas(el2);
    // initialize canvas more than once
    c.initialize(el2);
    c.initialize(el2);
    var event = fabric.document.createEvent('MouseEvent');
    event.initEvent('mousemove', true, true);
    c.upperCanvasEl.dispatchEvent(event);
    equal(counter, 1, 'listener executed once');
    fabric.Canvas.prototype._onMouseMove = originalMouseMove;
  });

  asyncTest('avoid multiple registration - mouseup', function() {
    var el2 = fabric.document.createElement('canvas');
    var originalMouseUp = fabric.Canvas.prototype._onMouseUp;
    var counter = 0;
    fabric.Canvas.prototype._onMouseUp = function() {
      counter++;
    };
    var c = fabric.isLikelyNode ? fabric.createCanvasForNode() : new fabric.Canvas(el2);
    // initialize canvas more than once
    c.initialize(el2);
    c.initialize(el2);

    // a mouse down is necessary to register mouse up.
    var _event = fabric.document.createEvent('MouseEvent');
    _event.initEvent('mousedown', true, true);
    c.upperCanvasEl.dispatchEvent(_event);
    setTimeout(function() {
      var event = fabric.document.createEvent('MouseEvent');
      event.initEvent('mouseup', true, true);
      fabric.document.dispatchEvent(event);
      equal(counter, 1, 'listener executed once');
      fabric.Canvas.prototype._onMouseUp = originalMouseUp;
      start();
    }, 200);
  });

  test('avoid multiple registration - mouseout', function() {
    var el2 = fabric.document.createElement('canvas');
    var originalMouseOut = fabric.Canvas.prototype._onMouseOut;
    var counter = 0;
    fabric.Canvas.prototype._onMouseOut = function() {
      counter++;
    };
    var c = this.canvas = fabric.isLikelyNode ? fabric.createCanvasForNode() : new fabric.Canvas(el2);
    // initialize canvas more than once
    c.initialize(el2);
    c.initialize(el2);
    var event = fabric.document.createEvent('MouseEvent');
    event.initEvent('mouseout', true, true);
    c.upperCanvasEl.dispatchEvent(event);
    equal(counter, 1, 'listener executed once');
    fabric.Canvas.prototype._onMouseOut = originalMouseOut;
  });

  test('avoid multiple registration - mouseenter', function() {
    var el2 = fabric.document.createElement('canvas');
    var originalMouseEnter = fabric.Canvas.prototype._onMouseEnter;
    var counter = 0;
    fabric.Canvas.prototype._onMouseEnter = function() {
      counter++;
    };
    var c = this.canvas = fabric.isLikelyNode ? fabric.createCanvasForNode() : new fabric.Canvas(el2);
    // initialize canvas more than once
    c.initialize(el2);
    c.initialize(el2);
    var event = fabric.document.createEvent('MouseEvent');
    event.initEvent('mouseenter', true, true);
    c.upperCanvasEl.dispatchEvent(event);
    equal(counter, 1, 'listener executed once');
    fabric.Canvas.prototype._onMouseEnter = originalMouseEnter;
  });

  test('avoid multiple events on window', function() {
    var el2 = fabric.document.createElement('canvas');
    var originalResize = fabric.Canvas.prototype._onResize;
    var counter = 0;
    fabric.Canvas.prototype._onResize = function() {
      counter++;
    };
    var c = this.canvas = fabric.isLikelyNode ? fabric.createCanvasForNode() : new fabric.Canvas(el2);
    // initialize canvas more than once
    c.initialize(el2);
    c.initialize(el2);
    var event = fabric.document.createEvent('UIEvents');
    event.initUIEvent('resize', true, false, fabric.window, 0);
    fabric.window.dispatchEvent(event);
    equal(counter, 1, 'listener on window executed once');
    fabric.Canvas.prototype._onResize = originalResize;
  });


  test('actionIsDisabled ', function() {
    ok(typeof fabric.Canvas.prototype.actionIsDisabled === 'function', 'actionIsDisabled is a function');
    var key = canvas.altActionKey;
    var target = new fabric.Object();
    var e = { };
    e[key] = false;
    equal(!!canvas.actionIsDisabled('mt', target, e), false, 'action is not disabled');
    equal(!!canvas.actionIsDisabled('mb', target, e), false, 'action is not disabled');
    equal(!!canvas.actionIsDisabled('ml', target, e), false, 'action is not disabled');
    equal(!!canvas.actionIsDisabled('mr', target, e), false, 'action is not disabled');
    equal(!!canvas.actionIsDisabled('tl', target, e), false, 'action is not disabled');
    equal(!!canvas.actionIsDisabled('tr', target, e), false, 'action is not disabled');
    equal(!!canvas.actionIsDisabled('bl', target, e), false, 'action is not disabled');
    equal(!!canvas.actionIsDisabled('br', target, e), false, 'action is not disabled');
    equal(!!canvas.actionIsDisabled('mtr', target, e), false, 'action is not disabled');
    target = new fabric.Object();
    target.lockScalingX = true;

    equal(!!canvas.actionIsDisabled('mt', target, e), false, 'mt action is not disabled lockScalingX');
    equal(!!canvas.actionIsDisabled('mb', target, e), false, 'mb action is not disabled lockScalingX');
    equal(!!canvas.actionIsDisabled('ml', target, e), true, 'ml action is disabled lockScalingX');
    equal(!!canvas.actionIsDisabled('mr', target, e), true, 'mr action is disabled lockScalingX');
    equal(!!canvas.actionIsDisabled('tl', target, e), true, 'tl action is disabled lockScalingX');
    equal(!!canvas.actionIsDisabled('tr', target, e), true, 'tr action is disabled lockScalingX');
    equal(!!canvas.actionIsDisabled('bl', target, e), true, 'bl action is disabled lockScalingX');
    equal(!!canvas.actionIsDisabled('br', target, e), true, 'br action is disabled lockScalingX');
    equal(!!canvas.actionIsDisabled('mtr', target, e), false, 'mtr action is not disabled lockScalingX');
    target = new fabric.Object();
    target.lockScalingY = true;
    equal(!!canvas.actionIsDisabled('mt', target, e), true, 'mt action is disabled lockScalingY');
    equal(!!canvas.actionIsDisabled('mb', target, e), true, 'mb action is disabled lockScalingY');
    equal(!!canvas.actionIsDisabled('ml', target, e), false, 'ml action is not disabled lockScalingY');
    equal(!!canvas.actionIsDisabled('mr', target, e), false, 'mr action is not disabled lockScalingY');
    equal(!!canvas.actionIsDisabled('tl', target, e), true, 'tl action is not disabled lockScalingY');
    equal(!!canvas.actionIsDisabled('tr', target, e), true, 'tr action is not disabled lockScalingY');
    equal(!!canvas.actionIsDisabled('bl', target, e), true, 'bl action is not disabled lockScalingY');
    equal(!!canvas.actionIsDisabled('br', target, e), true, 'br action is not disabled lockScalingY');
    equal(!!canvas.actionIsDisabled('mtr', target, e), false, 'mtr action is not disabledlockScalingY');
    target = new fabric.Object();
    target.lockScalingY = true;
    target.lockScalingX = true;
    equal(!!canvas.actionIsDisabled('mt', target, e), true, 'mt action is disabled scaling locked');
    equal(!!canvas.actionIsDisabled('mb', target, e), true, 'mb action is disabled scaling locked');
    equal(!!canvas.actionIsDisabled('ml', target, e), true, 'ml action is disabled scaling locked');
    equal(!!canvas.actionIsDisabled('mr', target, e), true, 'mr action is disabled scaling locked');
    equal(!!canvas.actionIsDisabled('tl', target, e), true, 'tl action is disabled scaling locked');
    equal(!!canvas.actionIsDisabled('tr', target, e), true, 'tr action is disabled scaling locked');
    equal(!!canvas.actionIsDisabled('bl', target, e), true, 'bl action is disabled scaling locked');
    equal(!!canvas.actionIsDisabled('br', target, e), true, 'br action is disabled scaling locked');
    equal(!!canvas.actionIsDisabled('mtr', target, e), false, 'mtr action is not disabled scaling locked');
    target = new fabric.Object();
    target.lockRotation = true;
    equal(!!canvas.actionIsDisabled('mt', target, e), false, 'mt action is not disabled lockRotation');
    equal(!!canvas.actionIsDisabled('mb', target, e), false, 'mb action is not disabled lockRotation');
    equal(!!canvas.actionIsDisabled('ml', target, e), false, 'ml action is not disabled lockRotation');
    equal(!!canvas.actionIsDisabled('mr', target, e), false, 'mr action is not disabled lockRotation');
    equal(!!canvas.actionIsDisabled('tl', target, e), false, 'tl action is not disabled lockRotation');
    equal(!!canvas.actionIsDisabled('tr', target, e), false, 'tr action is not disabled lockRotation');
    equal(!!canvas.actionIsDisabled('bl', target, e), false, 'bl action is not disabled lockRotation');
    equal(!!canvas.actionIsDisabled('br', target, e), false, 'br action is not disabled lockRotation');
    equal(!!canvas.actionIsDisabled('mtr', target, e), true, 'mtr action is disabled lockRotation');
    target = new fabric.Object();
    target.lockSkewingX = true;
    target.lockSkewingY = true;
    equal(!!canvas.actionIsDisabled('mt', target, e), false, 'mt action is not disabled lockSkewing');
    equal(!!canvas.actionIsDisabled('mb', target, e), false, 'mb action is not disabled lockSkewing');
    equal(!!canvas.actionIsDisabled('ml', target, e), false, 'ml action is not disabled lockSkewing');
    equal(!!canvas.actionIsDisabled('mr', target, e), false, 'mr action is not disabled lockSkewing');
    equal(!!canvas.actionIsDisabled('tl', target, e), false, 'tl action is not disabled lockSkewing');
    equal(!!canvas.actionIsDisabled('tr', target, e), false, 'tr action is not disabled lockSkewing');
    equal(!!canvas.actionIsDisabled('bl', target, e), false, 'bl action is not disabled lockSkewing');
    equal(!!canvas.actionIsDisabled('br', target, e), false, 'br action is not disabled lockSkewing');
    equal(!!canvas.actionIsDisabled('mtr', target, e), false, 'mtr action is not disabled lockSkewing');
    e[key] = true;
    target = new fabric.Object();
    target.lockSkewingY = true;
    equal(!!canvas.actionIsDisabled('mt', target, e), false, 'mt action is not disabled lockSkewingY');
    equal(!!canvas.actionIsDisabled('mb', target, e), false, 'mb action is not disabled lockSkewingY');
    equal(!!canvas.actionIsDisabled('ml', target, e), true, 'ml action is disabled lockSkewingY');
    equal(!!canvas.actionIsDisabled('mr', target, e), true, 'mr action is disabled lockSkewingY');
    equal(!!canvas.actionIsDisabled('tl', target, e), false, 'tl action is not disabled lockSkewingY');
    equal(!!canvas.actionIsDisabled('tr', target, e), false, 'tr action is not disabled lockSkewingY');
    equal(!!canvas.actionIsDisabled('bl', target, e), false, 'bl action is not disabled lockSkewingY');
    equal(!!canvas.actionIsDisabled('br', target, e), false, 'br action is not disabled lockSkewingY');
    equal(!!canvas.actionIsDisabled('mtr', target, e), false, 'mtr action is not disabled lockSkewingY');

    e[key] = true;
    target = new fabric.Object();
    target.lockSkewingX = true;
    equal(!!canvas.actionIsDisabled('mt', target, e), true, 'mt action is disabled lockSkewingX');
    equal(!!canvas.actionIsDisabled('mb', target, e), true, 'mb action is disabled lockSkewingX');
    equal(!!canvas.actionIsDisabled('ml', target, e), false, 'ml action is not disabled lockSkewingX');
    equal(!!canvas.actionIsDisabled('mr', target, e), false, 'mr action is not disabled lockSkewingX');
    equal(!!canvas.actionIsDisabled('tl', target, e), false, 'tl action is not disabled lockSkewingX');
    equal(!!canvas.actionIsDisabled('tr', target, e), false, 'tr action is not disabled lockSkewingX');
    equal(!!canvas.actionIsDisabled('bl', target, e), false, 'bl action is not disabled lockSkewingX');
    equal(!!canvas.actionIsDisabled('br', target, e), false, 'br action is not disabled lockSkewingX');
    equal(!!canvas.actionIsDisabled('mtr', target, e), false, 'mtr action is not disabled lockSkewingX');
  });

  test('getCornerCursor ', function() {
    ok(typeof fabric.Canvas.prototype.getCornerCursor === 'function', 'actionIsDisabled is a function');
    var key = canvas.altActionKey;
    var key2 = canvas.uniScaleKey;
    var target = new fabric.Object();
    var e = { };
    e[key] = false;
    equal(canvas.getCornerCursor('mt', target, e), 'n-resize', 'action is not disabled');
    equal(canvas.getCornerCursor('mb', target, e), 's-resize', 'action is not disabled');
    equal(canvas.getCornerCursor('ml', target, e), 'w-resize', 'action is not disabled');
    equal(canvas.getCornerCursor('mr', target, e), 'e-resize', 'action is not disabled');
    equal(canvas.getCornerCursor('tl', target, e), 'nw-resize', 'action is not disabled');
    equal(canvas.getCornerCursor('tr', target, e), 'ne-resize', 'action is not disabled');
    equal(canvas.getCornerCursor('bl', target, e), 'sw-resize', 'action is not disabled');
    equal(canvas.getCornerCursor('br', target, e), 'se-resize', 'action is not disabled');
    equal(canvas.getCornerCursor('mtr', target, e), 'crosshair', 'action is not disabled');

    target = new fabric.Object();
    target.hasRotatingPoint = false;
    var e = { };
    e[key] = false;
    equal(canvas.getCornerCursor('mtr', target, e), 'default', 'action is not disabled');

    target = new fabric.Object();
    target.lockScalingX = true;
    equal(canvas.getCornerCursor('mt', target, e), 'n-resize', 'action is not disabled lockScalingX');
    equal(canvas.getCornerCursor('mb', target, e), 's-resize', 'action is not disabled lockScalingX');
    equal(canvas.getCornerCursor('ml', target, e), 'not-allowed', 'action is disabled lockScalingX');
    equal(canvas.getCornerCursor('mr', target, e), 'not-allowed', 'action is disabled lockScalingX');
    equal(canvas.getCornerCursor('tl', target, e), 'not-allowed', 'action is disabled lockScalingX');
    equal(canvas.getCornerCursor('tr', target, e), 'not-allowed', 'action is disabled lockScalingX');
    equal(canvas.getCornerCursor('bl', target, e), 'not-allowed', 'action is disabled lockScalingX');
    equal(canvas.getCornerCursor('br', target, e), 'not-allowed', 'action is disabled lockScalingX');
    equal(canvas.getCornerCursor('mtr', target, e), 'crosshair', 'action is not disabled lockScalingX');
    e[key2] = true;
    equal(canvas.getCornerCursor('tl', target, e), 'nw-resize', 'action is not disabled lockScalingX key2');
    equal(canvas.getCornerCursor('tr', target, e), 'ne-resize', 'action is not disabled lockScalingX key2');
    equal(canvas.getCornerCursor('bl', target, e), 'sw-resize', 'action is not disabled lockScalingX key2');
    equal(canvas.getCornerCursor('br', target, e), 'se-resize', 'action is not disabled lockScalingX key2');

    var e = { };
    target = new fabric.Object();
    target.lockScalingY = true;
    equal(canvas.getCornerCursor('mt', target, e), 'not-allowed', 'action is disabled lockScalingY');
    equal(canvas.getCornerCursor('mb', target, e), 'not-allowed', 'action is disabled lockScalingY');
    equal(canvas.getCornerCursor('ml', target, e), 'w-resize', 'action is not disabled lockScalingY');
    equal(canvas.getCornerCursor('mr', target, e), 'e-resize', 'action is not disabled lockScalingY');
    equal(canvas.getCornerCursor('tl', target, e), 'not-allowed', 'action is disabled lockScalingY');
    equal(canvas.getCornerCursor('tr', target, e), 'not-allowed', 'action is disabled lockScalingY');
    equal(canvas.getCornerCursor('bl', target, e), 'not-allowed', 'action is disabled lockScalingY');
    equal(canvas.getCornerCursor('br', target, e), 'not-allowed', 'action is disabled lockScalingY');
    equal(canvas.getCornerCursor('mtr', target, e), 'crosshair', 'action is not disabled lockScalingY');
    e[key2] = true;
    equal(canvas.getCornerCursor('tl', target, e), 'nw-resize', 'action is not disabled lockScalingY key2');
    equal(canvas.getCornerCursor('tr', target, e), 'ne-resize', 'action is not disabled lockScalingY key2');
    equal(canvas.getCornerCursor('bl', target, e), 'sw-resize', 'action is not disabled lockScalingY key2');
    equal(canvas.getCornerCursor('br', target, e), 'se-resize', 'action is not disabled lockScalingY key2');

    var e = { };
    target = new fabric.Object();
    target.lockScalingY = true;
    target.lockScalingX = true;
    equal(canvas.getCornerCursor('mt', target, e), 'not-allowed', 'action is disabled lockScaling');
    equal(canvas.getCornerCursor('mb', target, e), 'not-allowed', 'action is disabled lockScaling');
    equal(canvas.getCornerCursor('ml', target, e), 'not-allowed', 'action is disabled lockScaling');
    equal(canvas.getCornerCursor('mr', target, e), 'not-allowed', 'action is disabled lockScaling');
    equal(canvas.getCornerCursor('tl', target, e), 'not-allowed', 'action is disabled lockScaling');
    equal(canvas.getCornerCursor('tr', target, e), 'not-allowed', 'action is disabled lockScaling');
    equal(canvas.getCornerCursor('bl', target, e), 'not-allowed', 'action is disabled lockScaling');
    equal(canvas.getCornerCursor('br', target, e), 'not-allowed', 'action is disabled lockScaling');
    equal(canvas.getCornerCursor('mtr', target, e), 'crosshair', 'action is not disabled lockScaling');
    e[key2] = true;
    equal(canvas.getCornerCursor('tl', target, e), 'not-allowed', 'action is disabled lockScaling key2');
    equal(canvas.getCornerCursor('tr', target, e), 'not-allowed', 'action is disabled lockScaling key2');
    equal(canvas.getCornerCursor('bl', target, e), 'not-allowed', 'action is disabled lockScaling key2');
    equal(canvas.getCornerCursor('br', target, e), 'not-allowed', 'action is disabled lockScaling key2');

    var e = { };
    target = new fabric.Object();
    target.lockRotation = true;
    equal(canvas.getCornerCursor('mt', target, e), 'n-resize', 'action is not disabled lockRotation');
    equal(canvas.getCornerCursor('mb', target, e), 's-resize', 'action is not disabled lockRotation');
    equal(canvas.getCornerCursor('ml', target, e), 'w-resize', 'action is not disabled lockRotation');
    equal(canvas.getCornerCursor('mr', target, e), 'e-resize', 'action is not disabled lockRotation');
    equal(canvas.getCornerCursor('tl', target, e), 'nw-resize', 'action is not disabled lockRotation');
    equal(canvas.getCornerCursor('tr', target, e), 'ne-resize', 'action is not disabled lockRotation');
    equal(canvas.getCornerCursor('bl', target, e), 'sw-resize', 'action is not disabled lockRotation');
    equal(canvas.getCornerCursor('br', target, e), 'se-resize', 'action is not disabled lockRotation');
    equal(canvas.getCornerCursor('mtr', target, e), 'not-allowed', 'action is disabled lockRotation');

    target = new fabric.Object();
    target.lockSkewingX = true;
    target.lockSkewingY = true;
    equal(canvas.getCornerCursor('mt', target, e), 'n-resize', 'action is not disabled');
    equal(canvas.getCornerCursor('mb', target, e), 's-resize', 'action is not disabled');
    equal(canvas.getCornerCursor('ml', target, e), 'w-resize', 'action is not disabled');
    equal(canvas.getCornerCursor('mr', target, e), 'e-resize', 'action is not disabled');
    equal(canvas.getCornerCursor('tl', target, e), 'nw-resize', 'action is not disabled');
    equal(canvas.getCornerCursor('tr', target, e), 'ne-resize', 'action is not disabled');
    equal(canvas.getCornerCursor('bl', target, e), 'sw-resize', 'action is not disabled');
    equal(canvas.getCornerCursor('br', target, e), 'se-resize', 'action is not disabled');
    equal(canvas.getCornerCursor('mtr', target, e), 'crosshair', 'action is not disabled');

    e[key] = true;
    target = new fabric.Object();
    target.lockSkewingY = true;
    equal(canvas.getCornerCursor('mt', target, e), 'e-resize', 'action is not disabled');
    equal(canvas.getCornerCursor('mb', target, e), 'w-resize', 'action is not disabled');
    equal(canvas.getCornerCursor('ml', target, e), 'not-allowed', 'action is disabled');
    equal(canvas.getCornerCursor('mr', target, e), 'not-allowed', 'action is disabled');
    equal(canvas.getCornerCursor('tl', target, e), 'nw-resize', 'action is not disabled');
    equal(canvas.getCornerCursor('tr', target, e), 'ne-resize', 'action is not disabled');
    equal(canvas.getCornerCursor('bl', target, e), 'sw-resize', 'action is not disabled');
    equal(canvas.getCornerCursor('br', target, e), 'se-resize', 'action is not disabled');
    equal(canvas.getCornerCursor('mtr', target, e), 'crosshair', 'action is not disabled');

    e[key] = true;
    target = new fabric.Object();
    target.lockSkewingX = true;
    equal(canvas.getCornerCursor('mt', target, e), 'not-allowed', 'action is disabled');
    equal(canvas.getCornerCursor('mb', target, e), 'not-allowed', 'action is disabled');
    equal(canvas.getCornerCursor('ml', target, e), 'n-resize', 'action is not disabled');
    equal(canvas.getCornerCursor('mr', target, e), 's-resize', 'action is not disabled');
    equal(canvas.getCornerCursor('tl', target, e), 'nw-resize', 'action is not disabled');
    equal(canvas.getCornerCursor('tr', target, e), 'ne-resize', 'action is not disabled');
    equal(canvas.getCornerCursor('bl', target, e), 'sw-resize', 'action is not disabled');
    equal(canvas.getCornerCursor('br', target, e), 'se-resize', 'action is not disabled');
    equal(canvas.getCornerCursor('mtr', target, e), 'crosshair', 'action is not disabled');
  });
})();
