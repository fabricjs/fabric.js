(function() {


  var EMPTY_JSON = '{"version":"' + fabric.version + '","objects":[]}';

  // var emptyImageCanvasData = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAfQAAAH0CAYAAADL1t+KAAAH7ElEQVR4nO3VMQ0AMAzAsPInvYHoMS2yEeTLHADge/M6AADYM3QACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIuMjH4b7osLFBAAAAAElFTkSuQmCC";

  var PATH_JSON = '{"version":"' + fabric.version + '","objects": [{"version":"' + fabric.version + '","type": "path", "originX": "left", "originY": "top", "left": 268, "top": 266, "width": 51, "height": 49,' +
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

  var PATH_WITHOUT_DEFAULTS_JSON = '{"version":"' + fabric.version + '","objects": [{"version":"' + fabric.version + '","type": "path", "left": 268, "top": 266, "width": 51, "height": 49, "path": [["M", 18.511, 13.99],' +
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

  var PATH_OBJ_JSON = '{"version":"' + fabric.version + '","type": "path", "originX": "left", "originY": "top", "left": 268, "top": 266, "width": 51, "height": 49,' +
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

  var PATH_DATALESS_JSON = '{"version":"' + fabric.version + '","objects":[{"type":"path","version":"' + fabric.version + '","originX":"left","originY":"top","left":99.5,"top":99.5,"width":200,"height":200,"fill":"rgb(0,0,0)",' +
                           '"stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,' +
                           '"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,' +
                           '"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","transformMatrix":null,"skewX":0,"skewY":0,"sourcePath":"http://example.com/"}]}';

  var RECT_JSON = '{"version":"' + fabric.version + '","objects":[{"type":"rect","version":"' + fabric.version + '","originX":"left","originY":"top","left":0,"top":0,"width":10,"height":10,"fill":"rgb(0,0,0)",' +
                  '"stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,' +
                  '"shadow":null,' +
                  '"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","transformMatrix":null,"skewX":0,"skewY":0,"rx":0,"ry":0}],"background":"#ff5555","overlay":"rgba(0,0,0,0.2)"}';

  function _createImageElement() {
    return fabric.document.createElement('img');
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

  var IMG_SRC = fabric.isLikelyNode ? ('file://' + __dirname + '/../fixtures/test_image.gif') : getAbsolutePath('../fixtures/test_image.gif');

  var canvas = this.canvas = new fabric.Canvas(null, {enableRetinaScaling: false, width: 600, height: 600});
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
    beforeEach: function() {
      upperCanvasEl.style.display = '';
      canvas.controlsAboveOverlay = fabric.Canvas.prototype.controlsAboveOverlay;
      canvas.preserveObjectStacking = fabric.Canvas.prototype.preserveObjectStacking;
    },
    afterEach: function() {
      canvas.viewportTransform = [1, 0, 0, 1, 0, 0];
      canvas.clear();
      canvas.cancelRequestedRender();
      canvas.backgroundColor = fabric.Canvas.prototype.backgroundColor;
      canvas.overlayColor = fabric.Canvas.prototype.overlayColor;
      canvas._collectObjects = fabric.Canvas.prototype._collectObjects;
      canvas.off();
      canvas.calcOffset();
      canvas.cancelRequestedRender();
      upperCanvasEl.style.display = 'none';
    }
  });

  QUnit.test('initialProperties', function(assert) {
    assert.ok('backgroundColor' in canvas);
    assert.equal(canvas.includeDefaultValues, true);
  });

  QUnit.test('getObjects', function(assert) {
    assert.ok(typeof canvas.getObjects === 'function', 'should respond to `getObjects` method');
    assert.deepEqual([], canvas.getObjects(), 'should return empty array for `getObjects` when empty');
    assert.equal(canvas.getObjects().length, 0, 'should have a 0 length when empty');
  });

  QUnit.test('getElement', function(assert) {
    assert.ok(typeof canvas.getElement === 'function', 'should respond to `getElement` method');
    assert.equal(canvas.getElement(), lowerCanvasEl, 'should return a proper element');
  });

  QUnit.test('item', function(assert) {
    var rect = makeRect();

    assert.ok(typeof canvas.item === 'function', 'should respond to item');
    canvas.add(rect);
    assert.equal(canvas.item(0), rect, 'should return proper item');
  });

  QUnit.test('preserveObjectStacking', function(assert) {
    assert.ok(typeof canvas.preserveObjectStacking == 'boolean');
    assert.ok(!canvas.preserveObjectStacking, 'default is false');
  });

  QUnit.test('uniScaleTransform', function(assert) {
    assert.ok(typeof canvas.uniScaleTransform == 'boolean');
    assert.ok(!canvas.uniScaleTransform, 'default is false');
  });

  QUnit.test('uniScaleKey', function(assert) {
    assert.ok(typeof canvas.uniScaleKey == 'string');
    assert.equal(canvas.uniScaleKey, 'shiftKey', 'default is shift');
  });

  QUnit.test('centeredScaling', function(assert) {
    assert.ok(typeof canvas.centeredScaling == 'boolean');
    assert.ok(!canvas.centeredScaling, 'default is false');
  });

  QUnit.test('centeredRotation', function(assert) {
    assert.ok(typeof canvas.centeredRotation == 'boolean');
    assert.ok(!canvas.centeredRotation, 'default is false');
  });

  QUnit.test('centeredKey', function(assert) {
    assert.ok(typeof canvas.centeredKey == 'string');
    assert.equal(canvas.centeredKey, 'altKey', 'default is alt');
  });

  QUnit.test('altActionKey', function(assert) {
    assert.ok(typeof canvas.altActionKey == 'string');
    assert.equal(canvas.altActionKey, 'shiftKey', 'default is shift');
  });

  QUnit.test('interactive', function(assert) {
    assert.ok(typeof canvas.interactive == 'boolean');
    assert.ok(canvas.interactive, 'default is true');
  });

  QUnit.test('selection', function(assert) {
    assert.ok(typeof canvas.selection == 'boolean');
    assert.ok(canvas.selection, 'default is true');
  });

  QUnit.test('_initInteractive', function(assert) {
    assert.ok(typeof canvas._initInteractive === 'function');
  });

  QUnit.test('renderTop', function(assert) {
    assert.ok(typeof canvas.renderTop === 'function');
    assert.equal(canvas, canvas.renderTop());
  });

  QUnit.test('_chooseObjectsToRender', function(assert) {
    assert.ok(typeof canvas._chooseObjectsToRender === 'function');
    var rect = makeRect(), rect2 = makeRect(), rect3 = makeRect();
    canvas.add(rect);
    canvas.add(rect2);
    canvas.add(rect3);
    var objs = canvas._chooseObjectsToRender();
    assert.equal(objs[0], rect);
    assert.equal(objs[1], rect2);
    assert.equal(objs[2], rect3);
    canvas.setActiveObject(rect);
    objs = canvas._chooseObjectsToRender();
    assert.equal(objs[0], rect2);
    assert.equal(objs[1], rect3);
    assert.equal(objs[2], rect);
    canvas.setActiveObject(rect2);
    canvas.preserveObjectStacking = true;
    objs = canvas._chooseObjectsToRender();
    assert.equal(objs[0], rect);
    assert.equal(objs[1], rect2);
    assert.equal(objs[2], rect3);
  });

  QUnit.test('calcOffset', function(assert) {
    assert.ok(typeof canvas.calcOffset === 'function', 'should respond to `calcOffset`');
    assert.equal(canvas.calcOffset(), canvas, 'should be chainable');
  });

  QUnit.test('add', function(assert) {
    var rect1 = makeRect(),
        rect2 = makeRect(),
        rect3 = makeRect(),
        rect4 = makeRect();

    assert.ok(typeof canvas.add === 'function');
    assert.equal(canvas.add(rect1), canvas, 'should be chainable');
    assert.strictEqual(canvas.item(0), rect1);

    canvas.add(rect2, rect3, rect4);
    assert.equal(canvas.getObjects().length, 4, 'should support multiple arguments');

    assert.strictEqual(canvas.item(1), rect2);
    assert.strictEqual(canvas.item(2), rect3);
    assert.strictEqual(canvas.item(3), rect4);
  });

  QUnit.test('insertAt', function(assert) {
    var rect1 = makeRect(),
        rect2 = makeRect();

    canvas.add(rect1, rect2);

    assert.ok(typeof canvas.insertAt === 'function', 'should respond to `insertAt` method');

    var rect = makeRect();
    canvas.insertAt(rect, 1);
    assert.strictEqual(canvas.item(1), rect);
    canvas.insertAt(rect, 2);
    assert.strictEqual(canvas.item(2), rect);
    assert.equal(canvas.insertAt(rect, 2), canvas, 'should be chainable');
  });

  QUnit.test('remove', function(assert) {
    var rect1 = makeRect(),
        rect2 = makeRect(),
        rect3 = makeRect(),
        rect4 = makeRect();

    canvas.add(rect1, rect2, rect3, rect4);

    assert.ok(typeof canvas.remove === 'function');
    assert.equal(canvas.remove(rect1), canvas, 'should be chainable');
    assert.strictEqual(canvas.item(0), rect2, 'should be second object');

    canvas.remove(rect2, rect3);
    assert.strictEqual(canvas.item(0), rect4);

    canvas.remove(rect4);
    assert.equal(canvas.isEmpty(), true, 'canvas should be empty');
  });

  QUnit.test('remove actual hovered target', function(assert) {
    var rect1 = makeRect();
    canvas.add(rect1);
    canvas._hoveredTarget = rect1;
    canvas.remove(rect1);
    assert.equal(canvas._hoveredTarget, null, 'reference to hovered target should be removed');
  });

  QUnit.test('before:selection:cleared', function(assert) {
    var isFired = false;
    canvas.on('before:selection:cleared', function( ) { isFired = true; });

    canvas.add(new fabric.Rect());
    canvas.remove(canvas.item(0));

    assert.equal(isFired, false, 'removing inactive object shouldnt fire "before:selection:cleared"');

    canvas.add(new fabric.Rect());
    canvas.setActiveObject(canvas.item(0));
    canvas.remove(canvas.item(0));

    assert.equal(isFired, true, 'removing active object should fire "before:selection:cleared"');
  });

  QUnit.test('before:selection:cleared gets target the active object', function(assert) {
    var passedTarget;
    canvas.on('before:selection:cleared', function(options) {
      passedTarget = options.target;
    });
    var rect = new fabric.Rect();
    canvas.add(rect);
    canvas.setActiveObject(rect);
    canvas.discardActiveObject();
    assert.equal(passedTarget, rect, 'options.target was the removed object');
    var rect1 = new fabric.Rect();
    var rect2 = new fabric.Rect();
    canvas.add(rect1, rect2);
    var activeSelection = new fabric.ActiveSelection([rect1, rect2], { canvas: canvas });
    canvas.setActiveObject(activeSelection);
    canvas.discardActiveObject();
    assert.equal(passedTarget, activeSelection, 'removing an activeSelection pass that as a target');
  });

  QUnit.test('selection:cleared', function(assert) {
    var isFired = false;
    canvas.on('selection:cleared', function( ) { isFired = true; });

    canvas.add(new fabric.Rect());
    canvas.remove(canvas.item(0));

    assert.equal(isFired, false, 'removing inactive object shouldnt fire "selection:cleared"');

    canvas.add(new fabric.Rect());
    canvas.setActiveObject(canvas.item(0));
    canvas.remove(canvas.item(0));

    assert.equal(isFired, true, 'removing active object should fire "selection:cleared"');
    canvas.off('selection:cleared');
  });

  QUnit.test('create active selection fires selection:created', function(assert) {
    var isFired = false;
    var rect1 = new fabric.Rect();
    var rect2 = new fabric.Rect();
    canvas.on('selection:created', function( ) { isFired = true; });
    canvas.setActiveObject(rect1);
    canvas._createActiveSelection(rect2, {});
    assert.equal(canvas._hoveredTarget, canvas.getActiveObject(), 'the created selection is also hovered');
    assert.equal(isFired, true, 'selection:created fired');
    canvas.off('selection:created');
  });

  QUnit.test('create active selection fires selected on new object', function(assert) {
    var isFired = false;
    var rect1 = new fabric.Rect();
    var rect2 = new fabric.Rect();
    rect2.on('selected', function( ) { isFired = true; });
    canvas.setActiveObject(rect1);
    canvas._createActiveSelection(rect2, {});
    assert.equal(isFired, true, 'selected fired on rect2');
  });

  QUnit.test('update active selection selection:updated', function(assert) {
    var isFired = false;
    var rect1 = new fabric.Rect();
    var rect2 = new fabric.Rect();
    var rect3 = new fabric.Rect();
    canvas.on('selection:updated', function( ) { isFired = true; });
    canvas.setActiveObject(new fabric.ActiveSelection([rect1, rect2]));
    canvas._updateActiveSelection(rect3, {});
    assert.equal(isFired, true, 'selection:updated fired');
    assert.equal(canvas._hoveredTarget, canvas.getActiveObject(), 'hovered target is updated');
    canvas.off('selection:updated');
  });

  QUnit.test('update active selection fires deselected on an object', function(assert) {
    var isFired = false;
    var rect1 = new fabric.Rect();
    var rect2 = new fabric.Rect();
    rect2.on('deselected', function( ) { isFired = true; });
    canvas.setActiveObject(new fabric.ActiveSelection([rect1, rect2]));
    canvas._updateActiveSelection(rect2, {});
    assert.equal(isFired, true, 'deselected on rect2 fired');
  });

  QUnit.test('update active selection fires selected on an object', function(assert) {
    var isFired = false;
    var rect1 = new fabric.Rect();
    var rect2 = new fabric.Rect();
    var rect3 = new fabric.Rect();
    rect3.on('selected', function( ) { isFired = true; });
    canvas.setActiveObject(new fabric.ActiveSelection([rect1, rect2]));
    canvas._updateActiveSelection(rect3, {});
    assert.equal(isFired, true, 'selected on rect3 fired');
  });

  QUnit.test('setActiveObject fires deselected', function(assert) {
    var isFired = false;
    var rect1 = new fabric.Rect();
    var rect2 = new fabric.Rect();
    rect1.on('deselected', function( ) { isFired = true; });

    canvas.setActiveObject(rect1);
    canvas.setActiveObject(rect2);
    assert.equal(isFired, true, 'switching active group fires deselected');
  });

  QUnit.test('_createGroup respect order of objects', function(assert) {
    var rect1 = new fabric.Rect();
    var rect2 = new fabric.Rect();
    canvas.add(rect1);
    canvas.add(rect2);
    canvas.setActiveObject(rect1);
    var selection = canvas._createGroup(rect2);
    assert.equal(selection.getObjects().indexOf(rect1), 0, 'rect1 is the first object in the active selection');
    assert.equal(selection.getObjects().indexOf(rect2), 1, 'rect2 is the second object in the active selection');
  });

  QUnit.test('_createGroup respect order of objects (inverted)', function(assert) {
    var rect1 = new fabric.Rect();
    var rect2 = new fabric.Rect();
    canvas.add(rect1);
    canvas.add(rect2);
    canvas.setActiveObject(rect2);
    var selection = canvas._createGroup(rect1);
    assert.equal(selection.getObjects().indexOf(rect1), 0, 'rect1 is the first object in the active selection');
    assert.equal(selection.getObjects().indexOf(rect2), 1, 'rect2 is the second object in the active selection');
  });

  QUnit.test('_groupSelectedObjects fires selected for objects', function(assert) {
    var fired = 0;
    var rect1 = new fabric.Rect();
    var rect2 = new fabric.Rect();
    var rect3 = new fabric.Rect();
    canvas._collectObjects = function() {
      return [rect1, rect2, rect3];
    };
    rect1.on('selected', function() { fired++; });
    rect2.on('selected', function() { fired++; });
    rect3.on('selected', function() { fired++; });
    canvas._groupSelectedObjects({});
    assert.equal(fired, 3, 'event fired for each of 3 rects');
    canvas._collectObjects = fabric.Canvas.prototype._collectObjects;
  });

  QUnit.test('_groupSelectedObjects fires selection:created if more than one object is returned', function(assert) {
    var isFired = false;
    var rect1 = new fabric.Rect();
    var rect2 = new fabric.Rect();
    var rect3 = new fabric.Rect();
    canvas._collectObjects = function() {
      return [rect1, rect2, rect3];
    };
    canvas.on('selection:created', function() { isFired = true; });
    canvas._groupSelectedObjects({});
    assert.equal(isFired, true, 'selection created fired');
    assert.equal(canvas.getActiveObject().type, 'activeSelection', 'an active selection is created');
    assert.equal(canvas.getActiveObjects()[2], rect1, 'rect1 is first object');
    assert.equal(canvas.getActiveObjects()[1], rect2, 'rect2 is second object');
    assert.equal(canvas.getActiveObjects()[0], rect3, 'rect3 is third object');
    assert.equal(canvas.getActiveObjects().length, 3, 'contains exactly 3 objects');
    canvas._collectObjects = fabric.Canvas.prototype._collectObjects;
  });

  QUnit.test('_groupSelectedObjects fires selection:created if one only object is returned', function(assert) {
    var isFired = false;
    var rect1 = new fabric.Rect();
    canvas._collectObjects = function() {
      return [rect1];
    };
    canvas.on('object:selected', function() { isFired = true; });
    canvas._groupSelectedObjects({});
    assert.equal(isFired, true, 'object:selected fired for _groupSelectedObjects');
    assert.equal(canvas.getActiveObject(), rect1, 'rect1 is set as activeObject');
  });

  QUnit.test('_collectObjects collects object contained in area', function(assert) {
    var rect1 = new fabric.Rect({ width: 10, height: 10, top: 0, left: 0 });
    var rect2 = new fabric.Rect({ width: 10, height: 10, top: 0, left: 10 });
    var rect3 = new fabric.Rect({ width: 10, height: 10, top: 10, left: 0 });
    var rect4 = new fabric.Rect({ width: 10, height: 10, top: 10, left: 10 });
    canvas.add(rect1, rect2, rect3, rect4);
    canvas._groupSelector = {
      top: 15,
      left: 15,
      ex: 1,
      ey: 1
    };
    var collected = canvas._collectObjects();
    assert.equal(collected.length, 4, 'a rect that contains all objects collects them all');
    assert.equal(collected[3], rect1, 'contains rect1 as last object');
    assert.equal(collected[2], rect2, 'contains rect2');
    assert.equal(collected[1], rect3, 'contains rect3');
    assert.equal(collected[0], rect4, 'contains rect4 as first object');
  });

  QUnit.test('_collectObjects do not collects object if area is outside', function(assert) {
    var rect1 = new fabric.Rect({ width: 10, height: 10, top: 0, left: 0 });
    var rect2 = new fabric.Rect({ width: 10, height: 10, top: 0, left: 10 });
    var rect3 = new fabric.Rect({ width: 10, height: 10, top: 10, left: 0 });
    var rect4 = new fabric.Rect({ width: 10, height: 10, top: 10, left: 10 });
    canvas.add(rect1, rect2, rect3, rect4);
    canvas._groupSelector = {
      top: 1,
      left: 1,
      ex: 24,
      ey: 24
    };
    var collected = canvas._collectObjects();
    assert.equal(collected.length, 0, 'a rect outside objects do not collect any of them');
  });

  QUnit.test('_collectObjects collect included objects that are not touched by the selection sides', function(assert) {
    var rect1 = new fabric.Rect({ width: 10, height: 10, top: 5, left: 5 });
    canvas.add(rect1);
    canvas._groupSelector = {
      top: 20,
      left: 20,
      ex: 1,
      ey: 1
    };
    var collected = canvas._collectObjects();
    assert.equal(collected.length, 1, 'a rect that contains all objects collects them all');
    assert.equal(collected[0], rect1, 'rect1 is collected');
  });

  QUnit.test('_collectObjects collect topmost object if no dragging occurs', function(assert) {
    var rect1 = new fabric.Rect({ width: 10, height: 10, top: 0, left: 0 });
    var rect2 = new fabric.Rect({ width: 10, height: 10, top: 0, left: 0 });
    var rect3 = new fabric.Rect({ width: 10, height: 10, top: 0, left: 0 });
    canvas.add(rect1, rect2, rect3);
    canvas._groupSelector = {
      top: 0,
      left: 0,
      ex: 1,
      ey: 1
    };
    var collected = canvas._collectObjects();
    assert.equal(collected.length, 1, 'a rect that contains all objects collects them all');
    assert.equal(collected[0], rect3, 'rect3 is collected');
  });

  QUnit.test('_collectObjects collect objects if the drag is inside the object', function(assert) {
    var rect1 = new fabric.Rect({ width: 10, height: 10, top: 0, left: 0 });
    var rect2 = new fabric.Rect({ width: 10, height: 10, top: 0, left: 0 });
    var rect3 = new fabric.Rect({ width: 10, height: 10, top: 0, left: 0 });
    canvas.add(rect1, rect2, rect3);
    canvas._groupSelector = {
      top: 2,
      left: 2,
      ex: 1,
      ey: 1
    };
    var collected = canvas._collectObjects();
    assert.equal(collected.length, 3, 'a rect that contains all objects collects them all');
    assert.equal(collected[0], rect3, 'rect3 is collected');
    assert.equal(collected[1], rect2, 'rect2 is collected');
    assert.equal(collected[2], rect1, 'rect1 is collected');
  });

  QUnit.test('_collectObjects collects object fully contained in area', function(assert) {
    canvas.selectionFullyContained = true;
    var rect1 = new fabric.Rect({ width: 10, height: 10, top: 0, left: 0 });
    var rect2 = new fabric.Rect({ width: 10, height: 10, top: 0, left: 10 });
    var rect3 = new fabric.Rect({ width: 10, height: 10, top: 10, left: 0 });
    var rect4 = new fabric.Rect({ width: 10, height: 10, top: 10, left: 10 });
    canvas.add(rect1, rect2, rect3, rect4);
    canvas._groupSelector = {
      top: 30,
      left: 30,
      ex: -1,
      ey: -1
    };
    var collected = canvas._collectObjects();
    assert.equal(collected.length, 4, 'a rect that contains all objects collects them all');
    assert.equal(collected[3], rect1, 'contains rect1 as last object');
    assert.equal(collected[2], rect2, 'contains rect2');
    assert.equal(collected[1], rect3, 'contains rect3');
    assert.equal(collected[0], rect4, 'contains rect4 as first object');
    canvas.selectionFullyContained = false;
  });

  QUnit.test('_collectObjects does not collect objects not fully contained', function(assert) {
    canvas.selectionFullyContained = true;
    var rect1 = new fabric.Rect({ width: 10, height: 10, top: 0, left: 0 });
    var rect2 = new fabric.Rect({ width: 10, height: 10, top: 0, left: 10 });
    var rect3 = new fabric.Rect({ width: 10, height: 10, top: 10, left: 0 });
    var rect4 = new fabric.Rect({ width: 10, height: 10, top: 10, left: 10 });
    canvas.add(rect1, rect2, rect3, rect4);
    canvas._groupSelector = {
      top: 20,
      left: 20,
      ex: 5,
      ey: 5
    };
    var collected = canvas._collectObjects();
    assert.equal(collected.length, 1, 'a rect intersecting objects does not collect those');
    assert.equal(collected[0], rect4, 'contains rect1 as only one fully contained');
    canvas.selectionFullyContained = false;
  });

  QUnit.test('_collectObjects does not collect objects that have onSelect returning true', function(assert) {
    canvas.selectionFullyContained = false;
    var rect1 = new fabric.Rect({ width: 10, height: 10, top: 2, left: 2 });
    rect1.onSelect = function() {
      return true;
    };
    var rect2 = new fabric.Rect({ width: 10, height: 10, top: 2, left: 2 });
    canvas.add(rect1, rect2);
    canvas._groupSelector = {
      top: 20,
      left: 20,
      ex: 1,
      ey: 1
    };
    var collected = canvas._collectObjects();
    assert.equal(collected.length, 1, 'objects are in the same position buy only one gets selected');
    assert.equal(collected[0], rect2, 'contains rect2 but not rect 1');
  });

  QUnit.test('_collectObjects does not call onSelect on objects that are not intersected', function(assert) {
    canvas.selectionFullyContained = false;
    var rect1 = new fabric.Rect({ width: 10, height: 10, top: 0, left: 0 });
    var rect2 = new fabric.Rect({ width: 10, height: 10, top: 0, left: 10 });
    var onSelectRect1CallCount = 0;
    var onSelectRect2CallCount = 0;
    rect1.onSelect = function() {
      onSelectRect1CallCount++;
      return false;
    };
    rect2.onSelect = function() {
      onSelectRect2CallCount++;
      return false;
    };
    canvas.add(rect1, rect2);
    // Intersects none
    canvas._groupSelector = {
      top: 1,
      left: 1,
      ex: 25,
      ey: 25
    };
    canvas._collectObjects();
    var onSelectCalls = onSelectRect1CallCount + onSelectRect2CallCount;
    assert.equal(onSelectCalls, 0, 'none of the onSelect methods was called');
    // Intersects one
    canvas._groupSelector = {
      top: 5,
      left: 5,
      ex: 0,
      ey: 0
    };
    canvas._collectObjects();
    assert.equal(onSelectRect1CallCount, 0, 'rect1 onSelect was not called. It will be called in _setActiveObject()');
    assert.equal(onSelectRect2CallCount, 0, 'rect2 onSelect was not called');
    // Intersects both
    canvas._groupSelector = {
      top: 5,
      left: 15,
      ex: 0,
      ey: 0
    };
    canvas._collectObjects();
    assert.equal(onSelectRect1CallCount, 1, 'rect1 onSelect was called');
    assert.equal(onSelectRect2CallCount, 1, 'rect2 onSelect was called');
  });

  QUnit.test('_shouldGroup return false if onSelect return true', function(assert) {
    var rect = new fabric.Rect();
    var rect2 = new fabric.Rect();
    rect.onSelect = function() {
      return true;
    };
    canvas._activeObject = rect2;
    var selectionKey = canvas.selectionKey;
    var event = {};
    event[selectionKey] = true;
    var returned = canvas._shouldGroup(event, rect);
    assert.equal(returned, false, 'if onSelect returns true, shouldGroup return false');
  });

  QUnit.test('_shouldGroup return true if onSelect return false and selectionKey is true', function(assert) {
    var rect = new fabric.Rect();
    var rect2 = new fabric.Rect();
    rect.onSelect = function() {
      return false;
    };
    canvas._activeObject = rect2;
    var selectionKey = canvas.selectionKey;
    var event = {};
    event[selectionKey] = true;
    var returned = canvas._shouldGroup(event, rect);
    assert.equal(returned, true, 'if onSelect returns false, shouldGroup return true');
  });

  QUnit.test('_shouldGroup return false if selectionKey is false', function(assert) {
    var rect = new fabric.Rect();
    var rect2 = new fabric.Rect();
    rect.onSelect = function() {
      return false;
    };
    canvas._activeObject = rect2;
    var selectionKey = canvas.selectionKey;
    var event = {};
    event[selectionKey] = false;
    var returned = canvas._shouldGroup(event, rect);
    assert.equal(returned, false, 'shouldGroup return false');
  });

  QUnit.test('_fireSelectionEvents fires multiple things', function(assert) {
    var rect1Deselected = false;
    var rect3Selected = false;
    var rect1 = new fabric.Rect();
    var rect2 = new fabric.Rect();
    var rect3 = new fabric.Rect();
    var activeSelection = new fabric.ActiveSelection([rect1, rect2]);
    canvas.setActiveObject(activeSelection);
    rect1.on('deselected', function( ) {
      rect1Deselected = true;
    });
    rect3.on('selected', function( ) {
      rect3Selected = true;
    });
    var currentObjects = canvas.getActiveObjects();
    activeSelection.removeWithUpdate(rect1);
    activeSelection.addWithUpdate(rect3);
    canvas._fireSelectionEvents(currentObjects, {});
    assert.ok(rect3Selected, 'rect 3 selected');
    assert.ok(rect1Deselected, 'rect 1 deselected');
  });

  QUnit.test('getContext', function(assert) {
    assert.ok(typeof canvas.getContext === 'function');
  });

  QUnit.test('clearContext', function(assert) {
    assert.ok(typeof canvas.clearContext === 'function');
    assert.equal(canvas.clearContext(canvas.getContext()), canvas, 'should be chainable');
  });

  QUnit.test('clear', function(assert) {
    assert.ok(typeof canvas.clear === 'function');

    assert.equal(canvas.clear(), canvas, 'should be chainable');
    assert.equal(canvas.getObjects().length, 0);
  });

  QUnit.test('renderAll', function(assert) {
    assert.ok(typeof canvas.renderAll === 'function');
    assert.equal(canvas, canvas.renderAll());
  });

  QUnit.test('_drawSelection', function(assert) {
    assert.ok(typeof canvas._drawSelection === 'function');
  });

  QUnit.test('findTarget', function(assert) {
    assert.ok(typeof canvas.findTarget === 'function');
    var rect = makeRect({ left: 0, top: 0 }), target;
    canvas.add(rect);
    target = canvas.findTarget({
      clientX: 5, clientY: 5
    });
    assert.equal(target, rect, 'Should return the rect');
    target = canvas.findTarget({
      clientX: 30, clientY: 30
    });
    assert.equal(target, null, 'Should not find target');
    canvas.remove(rect);
  });

  QUnit.test('findTarget preserveObjectStacking false', function(assert) {
    assert.ok(typeof canvas.findTarget === 'function');
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
    assert.equal(target, rect, 'Should return the rect');
  });

  QUnit.test('findTarget preserveObjectStacking true', function(assert) {
    assert.ok(typeof canvas.findTarget === 'function');
    canvas.preserveObjectStacking = true;
    var rect = makeRect({ left: 0, top: 0, width: 30, height: 30 }),
        rectOver = makeRect({ left: 0, top: 0, width: 30, height: 30 }),
        target,
        pointer = { clientX: 15, clientY: 15, 'shiftKey': true },
        pointer2 = { clientX: 4, clientY: 4 };
    canvas.add(rect);
    canvas.add(rectOver);
    target = canvas.findTarget(pointer);
    assert.equal(target, rectOver, 'Should return the rectOver, rect is not considered');
    canvas.setActiveObject(rect);
    target = canvas.findTarget(pointer);
    assert.equal(target, rectOver, 'Should still return rectOver because is above active object');
    target = canvas.findTarget(pointer2);
    assert.equal(target, rect, 'Should rect because a corner of the activeObject has been hit');
    canvas.altSelectionKey = 'shiftKey';
    target = canvas.findTarget(pointer);
    assert.equal(target, rect, 'Should rect because active and altSelectionKey is pressed');
    canvas.preserveObjectStacking = false;
  });

  QUnit.test('findTarget with subTargetCheck', function(assert) {
    var rect = makeRect({ left: 0, top: 0 }),
        rect2 = makeRect({ left: 30, top:  30}), target,
        group = new fabric.Group([rect, rect2]);

    canvas.add(group);
    target = canvas.findTarget({
      clientX: 5, clientY: 5
    }, true);
    assert.equal(target, group, 'Should return the group');
    assert.equal(canvas.targets[0], undefined, 'no subtarget should return');
    target = canvas.findTarget({
      clientX: 30, clientY: 30
    });
    assert.equal(target, group, 'Should return the group');
    group.subTargetCheck = true;
    target = canvas.findTarget({
      clientX: 5, clientY: 5
    });
    assert.equal(target, group, 'Should return the group');
    assert.equal(canvas.targets[0], rect, 'should return the rect');
    target = canvas.findTarget({
      clientX: 15, clientY: 15
    });
    assert.equal(target, group, 'Should return the group');
    assert.equal(canvas.targets[0], undefined, 'no subtarget should return');
    target = canvas.findTarget({
      clientX: 32, clientY: 32
    });
    assert.equal(target, group, 'Should return the group');
    assert.equal(canvas.targets[0], rect2, 'should return the rect2');
    canvas.remove(group);
  });

  QUnit.test('findTarget with subTargetCheck and canvas zoom', function(assert) {
    var rect3 = new fabric.Rect({
      width: 100,
      height: 100,
      fill: 'yellow'
    });
    var rect4 = new fabric.Rect({
      width: 100,
      height: 100,
      left: 100,
      top: 100,
      fill: 'purple'
    });
    var group3 = new fabric.Group(
      [rect3, rect4],
      { scaleX: 0.5, scaleY: 0.5, top: 100, left: 0 });
    group3.subTargetCheck = true;

    var rect1 = new fabric.Rect({
      width: 100,
      height: 100,
      fill: 'red'
    });
    var rect2 = new fabric.Rect({
      width: 100,
      height: 100,
      left: 100,
      top: 100,
      fill: 'blue'
    });
    var g = new fabric.Group([rect1, rect2, group3], { top: -150, left: -50 });
    g.subTargetCheck = true;
    canvas.viewportTransform = [0.1, 0, 0, 0.1, 100, 200];
    canvas.add(g);

    var target = canvas.findTarget({
      clientX: 96, clientY: 186
    }, true);
    assert.equal(target, g, 'Should return the group 96');
    assert.equal(canvas.targets[0], rect1, 'should find the target rect 96');
    canvas.targets = [];

    target = canvas.findTarget({
      clientX: 98, clientY: 188
    }, true);
    assert.equal(target, g, 'Should return the group 98');
    assert.equal(canvas.targets[0], rect1, 'should find the target rect1 98');
    canvas.targets = [];

    target = canvas.findTarget({
      clientX: 100, clientY: 190
    }, true);
    assert.equal(target, g, 'Should return the group 100');
    assert.equal(canvas.targets[0], rect1, 'should find the target rect1 100');
    canvas.targets = [];

    target = canvas.findTarget({
      clientX: 102, clientY: 192
    }, true);
    assert.equal(target, g, 'Should return the group 102');
    assert.equal(canvas.targets[0], rect1, 'should find the target rect 102');
    canvas.targets = [];

    target = canvas.findTarget({
      clientX: 104, clientY: 194
    }, true);
    assert.equal(target, g, 'Should return the group 104');
    assert.equal(canvas.targets[0], rect1, 'should find the target rect 104');
    canvas.targets = [];

    target = canvas.findTarget({
      clientX: 106, clientY: 196
    }, true);
    assert.equal(target, g, 'Should return the group 106');
    assert.equal(canvas.targets[0], rect2, 'should find the target rect2 106');
    canvas.targets = [];

  });

  QUnit.test('findTarget with subTargetCheck on activeObject', function(assert) {
    var rect = makeRect({ left: 0, top: 0 }),
        rect2 = makeRect({ left: 30, top:  30}), target,
        group = new fabric.Group([rect, rect2]);

    canvas.add(group);
    canvas.setActiveObject(group);
    group.subTargetCheck = true;
    target = canvas.findTarget({
      clientX: 9, clientY: 9
    });
    assert.equal(target, group, 'Should return the group');
    assert.equal(canvas.targets[0], rect, 'should return the rect');

    target = canvas.findTarget({
      clientX: 9, clientY: 9
    });

    target = canvas.findTarget({
      clientX: 9, clientY: 9
    });

    target = canvas.findTarget({
      clientX: 9, clientY: 9
    });

    assert.equal(canvas.targets.length, 1, 'multiple calls to subtarget should not add more to targets');

    canvas.remove(group);
  });

  QUnit.test('findTarget with subTargetCheck on activeObject and preserveObjectStacking true', function(assert) {
    var rect = makeRect({ left: 0, top: 0 }),
        rect2 = makeRect({ left: 30, top:  30}), target,
        group = new fabric.Group([rect, rect2]);
    canvas.preserveObjectStacking = true;
    canvas.add(group);
    canvas.setActiveObject(group);
    group.subTargetCheck = true;
    target = canvas.findTarget({
      clientX: 9, clientY: 9
    });
    assert.equal(target, group, 'Should return the group');
    assert.equal(canvas.targets[0], rect, 'should return the rect');

    target = canvas.findTarget({
      clientX: 9, clientY: 9
    });

    target = canvas.findTarget({
      clientX: 9, clientY: 9
    });

    target = canvas.findTarget({
      clientX: 9, clientY: 9
    });

    assert.equal(canvas.targets.length, 1, 'multiple calls to subtarget should not add more to targets');

    canvas.remove(group);
  });

  QUnit.test('findTarget with perPixelTargetFind', function(assert) {
    assert.ok(typeof canvas.findTarget === 'function');
    var triangle = makeTriangle({ left: 0, top: 0 }), target;
    canvas.add(triangle);
    target = canvas.findTarget({
      clientX: 5, clientY: 5
    });
    assert.equal(target, triangle, 'Should return the triangle by bounding box');
    //TODO find out why this stops the tests
    canvas.perPixelTargetFind = true;
    target = canvas.findTarget({
      clientX: 5, clientY: 5
    });
    assert.equal(target, null, 'Should return null because of transparency checks');
    target = canvas.findTarget({
      clientX: 15, clientY: 15
    });
    assert.equal(target, triangle, 'Should return the triangle now');
    canvas.perPixelTargetFind = false;
    canvas.remove(triangle);
  });

  QUnit.test('findTarget with perPixelTargetFind in nested group', function(assert) {
    assert.ok(typeof canvas.findTarget === 'function');
    var triangle = makeTriangle({ left: 0, top: 0, width: 30, height: 30, fill: 'yellow' }),
        triangle2 = makeTriangle({ left: 100, top: 120, width: 30, height: 30, angle: 100, fill: 'pink' }),
        circle = new fabric.Circle({ radius: 30, top: 0, left: 30, fill: 'blue' }),
        circle2 = new fabric.Circle({ scaleX: 2, scaleY: 2, radius: 10, top: 120, left: -20, fill: 'purple' }),
        rect = new fabric.Rect({ width: 100, height: 80, top: 50, left: 60, fill: 'green' }),
        rect2 = new fabric.Rect({ width: 50, height: 30, top: 10, left: 110, fill: 'red', skewX: 40, skewY: 20 }),
        group1 = new fabric.Group([triangle, circle, rect2], { subTargetCheck: true }),
        group2 = new fabric.Group([group1, circle2, rect, triangle2], { subTargetCheck: true }),
        group3 = new fabric.Group([group2], { subTargetCheck: true }),
        target;

    canvas.add(group3);
    canvas.perPixelTargetFind = true;
    target = canvas.findTarget({
      clientX: 5, clientY: 5
    });
    assert.equal(target, null, 'Should return null because of transparency checks case 1');
    target = canvas.findTarget({
      clientX: 21, clientY: 9
    });
    assert.equal(target, null, 'Should return null because of transparency checks case 2');
    target = canvas.findTarget({
      clientX: 37, clientY: 7
    });
    assert.equal(target, null, 'Should return null because of transparency checks case 3');
    target = canvas.findTarget({
      clientX: 89, clientY: 47
    });
    assert.equal(target, null, 'Should return null because of transparency checks case 4');
    target = canvas.findTarget({
      clientX: 16, clientY: 122
    });
    assert.equal(target, null, 'Should return null because of transparency checks case 5');
    target = canvas.findTarget({
      clientX: 127, clientY: 37
    });
    assert.equal(target, null, 'Should return null because of transparency checks case 6');
    target = canvas.findTarget({
      clientX: 87, clientY: 139
    });
    assert.equal(target, null, 'Should return null because of transparency checks case 7');
    target = canvas.findTarget({
      clientX: 15, clientY: 15
    });
    assert.equal(target, group3, 'Should return the group3 now');
    assert.equal(canvas.targets.length, 3, 'Subtargets length should be 3');
    assert.equal(canvas.targets[0], triangle, 'The deepest target should be triangle');
    target = canvas.findTarget({
      clientX: 50, clientY: 20
    });
    assert.equal(target, group3, 'Should return the group3 now');
    assert.equal(canvas.targets.length, 3, 'Subtargets length should be 3');
    assert.equal(canvas.targets[0], circle, 'The deepest target should be circle');
    target = canvas.findTarget({
      clientX: 117, clientY: 16
    });
    assert.equal(target, group3, 'Should return the group3 now');
    assert.equal(canvas.targets.length, 3, 'Subtargets length should be 2');
    assert.equal(canvas.targets[0], rect2, 'The deepest target should be rect2');
    target = canvas.findTarget({
      clientX: 100, clientY: 90
    });
    assert.equal(target, group3, 'Should return the group3 now');
    assert.equal(canvas.targets.length, 2, 'Subtargets length should be 2');
    assert.equal(canvas.targets[0], rect, 'The deepest target should be rect');
    target = canvas.findTarget({
      clientX: 9, clientY: 145
    });
    assert.equal(target, group3, 'Should return the group3 now');
    assert.equal(canvas.targets.length, 2, 'Subtargets length should be 2');
    assert.equal(canvas.targets[0], circle2, 'The deepest target should be circle2');
    target = canvas.findTarget({
      clientX: 66, clientY: 143
    });
    assert.equal(target, group3, 'Should return the group3 now');
    assert.equal(canvas.targets.length, 2, 'Subtargets length should be 2');
    assert.equal(canvas.targets[0], triangle2, 'The deepest target should be triangle2');
    canvas.perPixelTargetFind = false;
    canvas.remove(group3);
  });

  QUnit.test('findTarget on activegroup', function(assert) {
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
    assert.equal(target, group, 'Should return the activegroup');
    target = canvas.findTarget({
      clientX: 40, clientY: 15
    });
    assert.equal(target, null, 'Should miss the activegroup');
    target = canvas.findTarget({
      clientX: 5, clientY: 5
    }, true);
    assert.equal(target, rect1, 'Should return the rect inside activegroup');
    target = canvas.findTarget({
      clientX: 25, clientY: 5
    });
    assert.equal(target, group, 'Should return the activegroup');
    target = canvas.findTarget({
      clientX: 25, clientY: 5
    }, true);
    assert.equal(target, rect3, 'Should return the rect behind activegroup');
  });

  QUnit.test('findTarget on activegroup with perPixelTargetFind', function(assert) {
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
    assert.equal(target, group, 'Should return the activegroup');

    target = canvas.findTarget({
      clientX: 15, clientY: 15
    });
    assert.equal(target, null, 'Should miss the activegroup');
    canvas.perPixelTargetFind = false;
    canvas.preserveObjectStacking = false;
  });

  QUnit.test('ActiveSelection sendToBack', function(assert) {

    var rect1 = makeRect(),
        rect2 = makeRect(),
        rect3 = makeRect(),
        rect4 = makeRect();

    canvas.add(rect1, rect2, rect3, rect4);

    var activeSel = new fabric.ActiveSelection([rect3, rect4]);
    canvas.setActiveObject(activeSel);
    assert.equal(canvas._objects[0], rect1, 'rect1 should be last');
    assert.equal(canvas._objects[1], rect2, 'rect2 should be second');
    canvas.sendToBack(activeSel);
    assert.equal(canvas._objects[0], rect3, 'rect3 should be the new last');
    assert.equal(canvas._objects[1], rect4, 'rect3 should be the new second');
    assert.equal(canvas._objects[2], rect1, 'rect1 should be the third object');
    assert.equal(canvas._objects[3], rect2, 'rect2 should be on top now');
  });

  QUnit.test('activeGroup bringToFront', function(assert) {

    var rect1 = makeRect(),
        rect2 = makeRect(),
        rect3 = makeRect(),
        rect4 = makeRect();

    canvas.add(rect1, rect2, rect3, rect4);

    var activeSel = new fabric.ActiveSelection([rect1, rect2]);
    canvas.setActiveObject(activeSel);
    assert.equal(canvas._objects[0], rect1, 'rect1 should be last');
    assert.equal(canvas._objects[1], rect2, 'rect2 should be second');
    canvas.bringToFront(activeSel);
    assert.equal(canvas._objects[0], rect3, 'rect3 should be the new last');
    assert.equal(canvas._objects[1], rect4, 'rect3 should be the new second');
    assert.equal(canvas._objects[2], rect1, 'rect1 should be the third object');
    assert.equal(canvas._objects[3], rect2, 'rect2 should be on top now');
  });

  QUnit.test('activeGroup bringForward', function(assert) {

    var rect1 = makeRect(),
        rect2 = makeRect(),
        rect3 = makeRect(),
        rect4 = makeRect();

    canvas.add(rect1, rect2, rect3, rect4);

    var activeSel = new fabric.ActiveSelection([rect1, rect2]);
    canvas.setActiveObject(activeSel);
    assert.equal(canvas._objects[0], rect1, 'rect1 should be last');
    assert.equal(canvas._objects[1], rect2, 'rect2 should be second');
    canvas.bringForward(activeSel);
    assert.equal(canvas._objects[0], rect3, 'rect3 should be the new last');
    assert.equal(canvas._objects[1], rect1, 'rect1 should be the new second');
    assert.equal(canvas._objects[2], rect2, 'rect2 should be the third object');
    assert.equal(canvas._objects[3], rect4, 'rect4 did not move');
    canvas.bringForward(activeSel);
    assert.equal(canvas._objects[0], rect3, 'rect3 should be the new last');
    assert.equal(canvas._objects[1], rect4, 'rect4 should be the new second');
    assert.equal(canvas._objects[2], rect1, 'rect1 should be the third object');
    assert.equal(canvas._objects[3], rect2, 'rect2 is the new top');
    canvas.bringForward(activeSel);
    canvas.bringForward(activeSel);
    assert.equal(canvas._objects[0], rect3, 'rect3 should be the new last');
    assert.equal(canvas._objects[1], rect4, 'rect4 should be the new second');
    assert.equal(canvas._objects[2], rect1, 'rect1 is still third');
    assert.equal(canvas._objects[3], rect2, 'rect2 is still new top');
  });

  QUnit.test('activeGroup sendBackwards', function(assert) {
    var rect1 = makeRect(),
        rect2 = makeRect(),
        rect3 = makeRect(),
        rect4 = makeRect();

    canvas.add(rect1, rect2, rect3, rect4);

    var activeSel = new fabric.ActiveSelection([rect3, rect4]);
    canvas.setActiveObject(activeSel);
    assert.equal(canvas._objects[0], rect1, 'rect1 should be last');
    assert.equal(canvas._objects[1], rect2, 'rect2 should be second');
    canvas.sendBackwards(activeSel);
    assert.equal(canvas._objects[0], rect1, 'rect1 is still last');
    assert.equal(canvas._objects[1], rect3, 'rect3 should be shifted down by 1');
    assert.equal(canvas._objects[2], rect4, 'rect4 should be shifted down by 1');
    assert.equal(canvas._objects[3], rect2, 'rect2 is the new top');
    canvas.sendBackwards(activeSel);
    assert.equal(canvas._objects[0], rect3, 'rect3 is  last');
    assert.equal(canvas._objects[1], rect4, 'rect4 should be shifted down by 1');
    assert.equal(canvas._objects[2], rect1, 'rect1 should be shifted down by 1');
    assert.equal(canvas._objects[3], rect2, 'rect2 is still on top');
    canvas.sendBackwards(activeSel);
    canvas.sendBackwards(activeSel);
    assert.equal(canvas._objects[0], rect3, 'rect3 is still last');
    assert.equal(canvas._objects[1], rect4, 'rect4 should be steady');
    assert.equal(canvas._objects[2], rect1, 'rect1 should be steady');
    assert.equal(canvas._objects[3], rect2, 'rect2 is still on top');
  });

  QUnit.test('toDataURL', function(assert) {
    assert.ok(typeof canvas.toDataURL === 'function');
    var dataURL = canvas.toDataURL();
    // don't compare actual data url, as it is often browser-dependent
    // this.assertIdentical(emptyImageCanvasData, canvas.toDataURL('png'));
    assert.equal(typeof dataURL, 'string');
    assert.equal(dataURL.substring(0, 21), 'data:image/png;base64');
  });

  //  QUnit.test('getPointer', function(assert) {
  //    var done = assert.async();
  //    assert.ok(typeof canvas.getPointer === 'function');
  //
  //    fabric.util.addListener(upperCanvasEl, 'click', function(e) {
  //       canvas.calcOffset();
  //       var pointer = canvas.getPointer(e);
  //       assert.equal(pointer.x, 101, 'pointer.x should be correct');
  //       assert.equal(pointer.y, 102, 'pointer.y should be correct');
  //
  //       done();
  //   });

  //     setTimeout(function() {
  //       simulateEvent(upperCanvasEl, 'click', {
  //         pointerX: 101, pointerY: 102
  //       });
  //     }, 100);
  // });

  QUnit.test('getCenter', function(assert) {
    assert.ok(typeof canvas.getCenter === 'function');
    var center = canvas.getCenter();
    assert.equal(center.left, upperCanvasEl.width / 2);
    assert.equal(center.top, upperCanvasEl.height / 2);
  });

  QUnit.test('centerObjectH', function(assert) {
    assert.ok(typeof canvas.centerObjectH === 'function');
    var rect = makeRect({ left: 102, top: 202 });
    canvas.add(rect);
    assert.equal(canvas.centerObjectH(rect), canvas, 'should be chainable');
    assert.equal(rect.getCenterPoint().x, upperCanvasEl.width / 2, 'object\'s "left" property should correspond to canvas element\'s center');
  });

  QUnit.test('centerObjectV', function(assert) {
    assert.ok(typeof canvas.centerObjectV === 'function');
    var rect = makeRect({ left: 102, top: 202 });
    canvas.add(rect);
    assert.equal(canvas.centerObjectV(rect), canvas, 'should be chainable');
    assert.equal(rect.getCenterPoint().y, upperCanvasEl.height / 2, 'object\'s "top" property should correspond to canvas element\'s center');
  });

  QUnit.test('centerObject', function(assert) {
    assert.ok(typeof canvas.centerObject === 'function');
    var rect = makeRect({ left: 102, top: 202 });
    canvas.add(rect);
    assert.equal(canvas.centerObject(rect), canvas, 'should be chainable');

    assert.equal(rect.getCenterPoint().y, upperCanvasEl.height / 2, 'object\'s "top" property should correspond to canvas element\'s center');
    assert.equal(rect.getCenterPoint().x, upperCanvasEl.width / 2, 'object\'s "left" property should correspond to canvas element\'s center');
  });

  QUnit.test('straightenObject', function(assert) {
    assert.ok(typeof canvas.straightenObject === 'function');
    var rect = makeRect({ angle: 10 });
    canvas.add(rect);
    assert.equal(canvas.straightenObject(rect), canvas, 'should be chainable');
    assert.equal(rect.get('angle'), 0, 'angle should be coerced to 0 (from 10)');

    rect.rotate('60');
    canvas.straightenObject(rect);
    assert.equal(rect.get('angle'), 90, 'angle should be coerced to 90 (from 60)');

    rect.rotate('100');
    canvas.straightenObject(rect);
    assert.equal(rect.get('angle'), 90, 'angle should be coerced to 90 (from 100)');
  });

  QUnit.test('toJSON', function(assert) {
    assert.ok(typeof canvas.toJSON === 'function');
    assert.equal(JSON.stringify(canvas.toJSON()), EMPTY_JSON);
    canvas.backgroundColor = '#ff5555';
    canvas.overlayColor = 'rgba(0,0,0,0.2)';
    assert.equal(JSON.stringify(canvas.toJSON()), '{"version":"' + fabric.version + '","objects":[],"background":"#ff5555","overlay":"rgba(0,0,0,0.2)"}', '`background` and `overlayColor` value should be reflected in json');
    canvas.add(makeRect());
    assert.deepEqual(JSON.stringify(canvas.toJSON()), RECT_JSON);
  });

  QUnit.test('toJSON with active group', function(assert) {
    var rect = new fabric.Rect({ width: 50, height: 50, left: 100, top: 100 });
    var circle = new fabric.Circle({ radius: 50, left: 50, top: 50 });
    canvas.add(rect, circle);
    var json = JSON.stringify(canvas);

    canvas.setActiveObject(new fabric.ActiveSelection([rect, circle], { canvas: canvas }));
    var jsonWithActiveGroup = JSON.stringify(canvas);

    assert.equal(json, jsonWithActiveGroup);
  });

  QUnit.test('toDatalessJSON', function(assert) {
    var path = new fabric.Path('M 100 100 L 300 100 L 200 300 z', {
      sourcePath: 'http://example.com/'
    });
    canvas.add(path);
    assert.equal(JSON.stringify(canvas.toDatalessJSON()), PATH_DATALESS_JSON);
  });

  QUnit.test('toObject', function(assert) {
    assert.ok(typeof canvas.toObject === 'function');
    var expectedObject = {
      'version': fabric.version,
      objects: canvas.getObjects()
    };
    assert.deepEqual(expectedObject, canvas.toObject());

    var rect = makeRect();
    canvas.add(rect);

    assert.equal(canvas.toObject().objects[0].type, rect.type);
  });


  QUnit.test('toObject with clipPath', function(assert) {
    var clipPath = makeRect();
    var canvasWithClipPath = new fabric.Canvas(null, { clipPath: clipPath });
    var expectedObject = {
      'version': fabric.version,
      objects: canvasWithClipPath.getObjects(),
      clipPath: {
        type: 'rect',
        version: fabric.version,
        originX: 'left',
        originY: 'top',
        left: 0,
        top: 0,
        width: 10,
        height: 10,
        fill: 'rgb(0,0,0)',
        stroke: null,
        strokeWidth: 1,
        strokeDashArray: null,
        strokeLineCap: 'butt',
        strokeDashOffset: 0,
        strokeLineJoin: 'miter',
        strokeMiterLimit: 4,
        scaleX: 1,
        scaleY: 1,
        angle: 0,
        flipX: false,
        flipY: false,
        opacity: 1,
        shadow: null,
        visible: true,
        clipTo: null,
        backgroundColor: '',
        fillRule: 'nonzero',
        paintFirst: 'fill',
        globalCompositeOperation: 'source-over',
        transformMatrix: null,
        skewX: 0,
        skewY: 0,
        rx: 0,
        ry: 0
      }
    };

    assert.ok(typeof canvasWithClipPath.toObject === 'function');
    assert.deepEqual(expectedObject, canvasWithClipPath.toObject());

    var rect = makeRect();
    canvasWithClipPath.add(rect);

    assert.equal(canvasWithClipPath.toObject().objects[0].type, rect.type);
  });

  QUnit.test('toDatalessObject', function(assert) {
    assert.ok(typeof canvas.toDatalessObject === 'function');
    var expectedObject = {
      'version': fabric.version,
      objects: canvas.getObjects()
    };

    assert.deepEqual(expectedObject, canvas.toDatalessObject());

    var rect = makeRect();
    canvas.add(rect);

    assert.equal(canvas.toObject().objects[0].type, rect.type);
    // TODO (kangax): need to test this method with fabric.Path to ensure that path is not populated
  });

  QUnit.test('isEmpty', function(assert) {
    assert.ok(typeof canvas.isEmpty === 'function');
    assert.ok(canvas.isEmpty());
    canvas.add(makeRect());
    assert.ok(!canvas.isEmpty());
  });

  QUnit.test('loadFromJSON with json string Canvas', function(assert) {
    var done = assert.async();
    assert.ok(typeof canvas.loadFromJSON === 'function');
    canvas.loadFromJSON(PATH_JSON, function() {
      var obj = canvas.item(0);

      assert.ok(!canvas.isEmpty(), 'canvas is not empty');
      assert.equal(obj.type, 'path', 'first object is a path object');
      assert.equal(canvas.backgroundColor, '#ff5555', 'backgroundColor is populated properly');
      assert.equal(canvas.overlayColor, 'rgba(0,0,0,0.2)', 'overlayColor is populated properly');

      assert.equal(obj.get('left'), 268);
      assert.equal(obj.get('top'), 266);
      assert.equal(obj.get('width'), 49.803999999999995);
      assert.equal(obj.get('height'), 48.027);
      assert.equal(obj.get('fill'), 'rgb(0,0,0)');
      assert.strictEqual(obj.get('stroke'), null);
      assert.strictEqual(obj.get('strokeWidth'), 1);
      assert.strictEqual(obj.get('scaleX'), 1);
      assert.strictEqual(obj.get('scaleY'), 1);
      assert.strictEqual(obj.get('angle'), 0);
      assert.strictEqual(obj.get('flipX'), false);
      assert.strictEqual(obj.get('flipY'), false);
      assert.strictEqual(obj.get('opacity'), 1);
      assert.ok(obj.get('path').length > 0);
      done();
    });
  });

  QUnit.test('loadFromJSON with json object', function(assert) {
    var done = assert.async();
    canvas.loadFromJSON(JSON.parse(PATH_JSON), function(){
      var obj = canvas.item(0);

      assert.ok(!canvas.isEmpty(), 'canvas is not empty');
      assert.equal(obj.type, 'path', 'first object is a path object');
      assert.equal(canvas.backgroundColor, '#ff5555', 'backgroundColor is populated properly');
      assert.equal(canvas.overlayColor, 'rgba(0,0,0,0.2)', 'overlayColor is populated properly');

      assert.equal(obj.get('left'), 268);
      assert.equal(obj.get('top'), 266);
      assert.equal(obj.get('width'), 49.803999999999995);
      assert.equal(obj.get('height'), 48.027);
      assert.equal(obj.get('fill'), 'rgb(0,0,0)');
      assert.strictEqual(obj.get('stroke'), null);
      assert.strictEqual(obj.get('strokeWidth'), 1);
      assert.strictEqual(obj.get('scaleX'), 1);
      assert.strictEqual(obj.get('scaleY'), 1);
      assert.strictEqual(obj.get('angle'), 0);
      assert.strictEqual(obj.get('flipX'), false);
      assert.strictEqual(obj.get('flipY'), false);
      assert.strictEqual(obj.get('opacity'), 1);
      assert.ok(obj.get('path').length > 0);
      done();
    });
  });

  QUnit.test('loadFromJSON with json object without default values', function(assert) {
    var done = assert.async();
    canvas.loadFromJSON(JSON.parse(PATH_WITHOUT_DEFAULTS_JSON), function(){
      var obj = canvas.item(0);

      assert.ok(!canvas.isEmpty(), 'canvas is not empty');
      assert.equal(obj.type, 'path', 'first object is a path object');
      assert.equal(canvas.backgroundColor, '#ff5555', 'backgroundColor is populated properly');
      assert.equal(canvas.overlayColor, 'rgba(0,0,0,0.2)', 'overlayColor is populated properly');

      assert.equal(obj.get('originX'), 'left');
      assert.equal(obj.get('originY'), 'top');
      assert.equal(obj.get('left'), 268);
      assert.equal(obj.get('top'), 266);
      assert.equal(obj.get('width'), 49.803999999999995);
      assert.equal(obj.get('height'), 48.027);
      assert.equal(obj.get('fill'), 'rgb(0,0,0)');
      assert.strictEqual(obj.get('stroke'), null);
      assert.strictEqual(obj.get('strokeWidth'), 1);
      assert.strictEqual(obj.get('scaleX'), 1);
      assert.strictEqual(obj.get('scaleY'), 1);
      assert.strictEqual(obj.get('angle'), 0);
      assert.strictEqual(obj.get('flipX'), false);
      assert.strictEqual(obj.get('flipY'), false);
      assert.equal(obj.get('opacity'), 1);
      assert.ok(obj.get('path').length > 0);
      done();
    });
  });

  QUnit.test('loadFromJSON with reviver function', function(assert) {
    function reviver(obj, instance) {
      assert.deepEqual(obj, JSON.parse(PATH_OBJ_JSON));

      if (instance.type === 'path') {
        instance.customID = 'fabric_1';
      }
    }

    canvas.loadFromJSON(JSON.parse(PATH_JSON), function(){
      var done = assert.async();
      var obj = canvas.item(0);

      assert.ok(!canvas.isEmpty(), 'canvas is not empty');
      assert.equal(obj.type, 'path', 'first object is a path object');
      assert.equal(canvas.backgroundColor, '#ff5555', 'backgroundColor is populated properly');
      assert.equal(canvas.overlayColor, 'rgba(0,0,0,0.2)', 'overlayColor is populated properly');

      assert.equal(obj.get('left'), 268);
      assert.equal(obj.get('top'), 266);
      assert.equal(obj.get('width'), 49.803999999999995);
      assert.equal(obj.get('height'), 48.027);
      assert.equal(obj.get('fill'), 'rgb(0,0,0)');
      assert.strictEqual(obj.get('stroke'), null);
      assert.strictEqual(obj.get('strokeWidth'), 1);
      assert.strictEqual(obj.get('scaleX'), 1);
      assert.strictEqual(obj.get('scaleY'), 1);
      assert.strictEqual(obj.get('angle'), 0);
      assert.strictEqual(obj.get('flipX'), false);
      assert.strictEqual(obj.get('flipY'), false);
      assert.strictEqual(obj.get('opacity'), 1);
      assert.equal(obj.get('customID'), 'fabric_1');
      assert.ok(obj.get('path').length > 0);
      done();
    }, reviver);
  });

  QUnit.test('loadFromJSON with no objects', function(assert) {
    var done = assert.async();
    var canvas1 = fabric.document.createElement('canvas'),
        canvas2 = fabric.document.createElement('canvas'),
        c1 = new fabric.Canvas(canvas1, { backgroundColor: 'green', overlayColor: 'yellow' }),
        c2 = new fabric.Canvas(canvas2, { backgroundColor: 'red', overlayColor: 'orange' });

    var json = c1.toJSON();
    var fired = false;
    c2.loadFromJSON(json, function() {
      fired = true;

      assert.ok(fired, 'Callback should be fired even if no objects');
      assert.equal(c2.backgroundColor, 'green', 'Color should be set properly');
      assert.equal(c2.overlayColor, 'yellow', 'Color should be set properly');
      done();
    });
  });

  QUnit.test('loadFromJSON without "objects" property', function(assert) {
    var done = assert.async();
    var canvas1 = fabric.document.createElement('canvas'),
        canvas2 = fabric.document.createElement('canvas'),
        c1 = new fabric.Canvas(canvas1, { backgroundColor: 'green', overlayColor: 'yellow' }),
        c2 = new fabric.Canvas(canvas2, { backgroundColor: 'red', overlayColor: 'orange' });

    var json = c1.toJSON();
    var fired = false;

    delete json.objects;

    c2.loadFromJSON(json, function() {
      fired = true;

      assert.ok(fired, 'Callback should be fired even if no "objects" property exists');
      assert.equal(c2.backgroundColor, 'green', 'Color should be set properly');
      assert.equal(c2.overlayColor, 'yellow', 'Color should be set properly');
      done();
    });
  });

  QUnit.test('loadFromJSON with empty fabric.Group', function(assert) {
    var done = assert.async();
    var canvas1 = fabric.document.createElement('canvas'),
        canvas2 = fabric.document.createElement('canvas'),
        c1 = new fabric.Canvas(canvas1),
        c2 = new fabric.Canvas(canvas2),
        group = new fabric.Group();

    c1.add(group);
    assert.ok(!c1.isEmpty(), 'canvas is not empty');

    var json = c1.toJSON();
    var fired = false;
    c2.loadFromJSON(json, function() {
      fired = true;

      assert.ok(fired, 'Callback should be fired even if empty fabric.Group exists');
      done();
    });
  });

  QUnit.test('loadFromJSON with async content', function(assert) {
    var done = assert.async();
    var group = new fabric.Group([
      new fabric.Rect({ width: 10, height: 20 }),
      new fabric.Circle({ radius: 10 })
    ]);
    var rect = new fabric.Rect({ width: 20, height: 10 });
    var circle = new fabric.Circle({ radius: 25 });

    canvas.add(group, rect, circle);
    var json = JSON.stringify(canvas);
    canvas.clear();

    assert.equal(0, canvas.getObjects().length);

    canvas.loadFromJSON(json, function() {
      assert.equal(3, canvas.getObjects().length);

      done();
    });
  });

  QUnit.test('loadFromDatalessJSON with async content', function(assert) {
    var done = assert.async();

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

      assert.equal(2, canvas.getObjects().length);
      assert.equal('group', canvas.getObjects()[1].type);

      done();
    });
  });

  QUnit.test('loadFromJSON with custom properties on Canvas with no async object', function(assert) {
    var done = assert.async();
    var serialized = JSON.parse(PATH_JSON);
    serialized.controlsAboveOverlay = true;
    serialized.preserveObjectStacking = true;
    assert.equal(canvas.controlsAboveOverlay, fabric.Canvas.prototype.controlsAboveOverlay);
    assert.equal(canvas.preserveObjectStacking, fabric.Canvas.prototype.preserveObjectStacking);
    canvas.loadFromJSON(serialized, function() {
      assert.ok(!canvas.isEmpty(), 'canvas is not empty');
      assert.equal(canvas.controlsAboveOverlay, true);
      assert.equal(canvas.preserveObjectStacking, true);
      done();
    });
  });

  QUnit.test('loadFromJSON with custom properties on Canvas with image', function(assert) {
    var done = assert.async();
    var JSON_STRING = '{"objects":[{"type":"image","originX":"left","originY":"top","left":13.6,"top":-1.4,"width":3000,"height":3351,"fill":"rgb(0,0,0)","stroke":null,"strokeWidth":0,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":0.05,"scaleY":0.05,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","transformMatrix":null,"skewX":0,"skewY":0,"src":"' + IMG_SRC + '","filters":[],"crossOrigin":""}],'
+ '"background":"green"}';
    var serialized = JSON.parse(JSON_STRING);
    serialized.controlsAboveOverlay = true;
    serialized.preserveObjectStacking = true;
    assert.equal(canvas.controlsAboveOverlay, fabric.Canvas.prototype.controlsAboveOverlay);
    assert.equal(canvas.preserveObjectStacking, fabric.Canvas.prototype.preserveObjectStacking);
    canvas.loadFromJSON(serialized, function() {
      assert.ok(!canvas.isEmpty(), 'canvas is not empty');
      assert.equal(canvas.controlsAboveOverlay, true);
      assert.equal(canvas.preserveObjectStacking, true);
      done();
    });
    // before callback the properties are still false.
    assert.equal(canvas.controlsAboveOverlay, false);
    assert.equal(canvas.preserveObjectStacking, false);
  });


  QUnit.test('normalize pointer', function(assert) {
    assert.ok(typeof canvas._normalizePointer === 'function');
    var pointer = { x: 10, y: 20 },
        object = makeRect({ top: 10, left: 10, width: 50, height: 50, strokeWidth: 0}),
        normalizedPointer = canvas._normalizePointer(object, pointer);
    assert.equal(normalizedPointer.x, -25, 'should be in top left corner of rect');
    assert.equal(normalizedPointer.y, -15, 'should be in top left corner of rect');
    object.angle = 90;
    normalizedPointer = canvas._normalizePointer(object, pointer);
    assert.equal(normalizedPointer.x, -15, 'should consider angle');
    assert.equal(normalizedPointer.y, -25, 'should consider angle');
    object.angle = 0;
    object.scaleX = 2;
    object.scaleY = 2;
    normalizedPointer = canvas._normalizePointer(object, pointer);
    assert.equal(normalizedPointer.x, -25, 'should consider scale');
    assert.equal(normalizedPointer.y, -20, 'should consider scale');
    object.skewX = 60;
    normalizedPointer = canvas._normalizePointer(object, pointer);
    assert.equal(normalizedPointer.x.toFixed(2), -33.66, 'should consider skewX');
    assert.equal(normalizedPointer.y, -20, 'should not change');
  });

  QUnit.test('restorePointerVpt', function(assert) {
    assert.ok(typeof canvas.restorePointerVpt === 'function');
    var pointer = { x: 10, y: 20 },
        restoredPointer = canvas.restorePointerVpt(pointer);
    assert.equal(restoredPointer.x, pointer.x, 'no changes if not vpt is set');
    assert.equal(restoredPointer.y, pointer.y, 'no changes if not vpt is set');
    canvas.viewportTransform = [2, 0, 0, 2, 50, -60];
    restoredPointer = canvas.restorePointerVpt(pointer);
    assert.equal(restoredPointer.x, -20, 'vpt changes restored');
    assert.equal(restoredPointer.y, 40, 'vpt changes restored');
    canvas.viewportTransform = [1, 0, 0, 1, 0, 0];
  });

  // QUnit.test('loadFromJSON with backgroundImage', function(assert) {
  //   var done = assert.async();
  //   canvas.setBackgroundImage('../../assets/pug.jpg');
  //   var anotherCanvas = new fabric.Canvas();

  //   setTimeout(function() {

  //     var json = JSON.stringify(canvas);
  //     anotherCanvas.loadFromJSON(json);

  //     setTimeout(function() {

  //       assert.equal(JSON.stringify(anotherCanvas), json, 'backgrondImage and properties are initialized correctly');
  //       done();

  //     }, 1000);
  //   }, 1000);
  // });


  QUnit.test('sendToBack', function(assert) {
    assert.ok(typeof canvas.sendToBack === 'function');

    var rect1 = makeRect(),
        rect2 = makeRect(),
        rect3 = makeRect();

    canvas.add(rect1, rect2, rect3);

    canvas.sendToBack(rect3);
    assert.equal(canvas.item(0), rect3, 'third should now be the first one');

    canvas.sendToBack(rect2);
    assert.equal(canvas.item(0), rect2, 'second should now be the first one');

    canvas.sendToBack(rect2);
    assert.equal(canvas.item(0), rect2, 'second should *still* be the first one');
  });

  QUnit.test('bringToFront', function(assert) {
    assert.ok(typeof canvas.bringToFront === 'function');

    var rect1 = makeRect(),
        rect2 = makeRect(),
        rect3 = makeRect();

    canvas.add(rect1, rect2, rect3);

    canvas.bringToFront(rect1);
    assert.equal(canvas.item(2), rect1, 'first should now be the last one');

    canvas.bringToFront(rect2);
    assert.equal(canvas.item(2), rect2, 'second should now be the last one');

    canvas.bringToFront(rect2);
    assert.equal(canvas.item(2), rect2, 'second should *still* be the last one');
  });

  QUnit.test('sendBackwards', function(assert) {
    assert.ok(typeof canvas.sendBackwards === 'function');

    var rect1 = makeRect(),
        rect2 = makeRect(),
        rect3 = makeRect();

    canvas.add(rect1, rect2, rect3);

    // [ 1, 2, 3 ]
    assert.equal(canvas.item(0), rect1);
    assert.equal(canvas.item(1), rect2);
    assert.equal(canvas.item(2), rect3);

    canvas.sendBackwards(rect3);

    // moved 3 one level back — [1, 3, 2]
    assert.equal(canvas.item(0), rect1);
    assert.equal(canvas.item(2), rect2);
    assert.equal(canvas.item(1), rect3);

    canvas.sendBackwards(rect3);

    // moved 3 one level back — [3, 1, 2]
    assert.equal(canvas.item(1), rect1);
    assert.equal(canvas.item(2), rect2);
    assert.equal(canvas.item(0), rect3);

    canvas.sendBackwards(rect3);

    // 3 stays at the deepEqual position — [2, 3, 1]
    assert.equal(canvas.item(1), rect1);
    assert.equal(canvas.item(2), rect2);
    assert.equal(canvas.item(0), rect3);

    canvas.sendBackwards(rect2);

    assert.equal(canvas.item(2), rect1);
    assert.equal(canvas.item(1), rect2);
    assert.equal(canvas.item(0), rect3);

    canvas.sendBackwards(rect2);

    assert.equal(canvas.item(2), rect1);
    assert.equal(canvas.item(0), rect2);
    assert.equal(canvas.item(1), rect3);
  });

  QUnit.test('bringForward', function(assert) {
    assert.ok(typeof canvas.bringForward === 'function');

    var rect1 = makeRect(),
        rect2 = makeRect(),
        rect3 = makeRect();

    canvas.add(rect1, rect2, rect3);

    // initial position — [ 1, 2, 3 ]
    assert.equal(canvas.item(0), rect1);
    assert.equal(canvas.item(1), rect2);
    assert.equal(canvas.item(2), rect3);

    canvas.bringForward(rect1);

    // 1 moves one way up — [ 2, 1, 3 ]
    assert.equal(canvas.item(1), rect1);
    assert.equal(canvas.item(0), rect2);
    assert.equal(canvas.item(2), rect3);

    canvas.bringForward(rect1);

    // 1 moves one way up again — [ 2, 3, 1 ]
    assert.equal(canvas.item(2), rect1);
    assert.equal(canvas.item(0), rect2);
    assert.equal(canvas.item(1), rect3);

    canvas.bringForward(rect1);

    // 1 is already all the way on top and so doesn't change position — [ 2, 3, 1 ]
    assert.equal(canvas.item(2), rect1);
    assert.equal(canvas.item(0), rect2);
    assert.equal(canvas.item(1), rect3);

    canvas.bringForward(rect3);

    // 1 is already all the way on top and so doesn't change position — [ 2, 1, 3 ]
    assert.equal(canvas.item(1), rect1);
    assert.equal(canvas.item(0), rect2);
    assert.equal(canvas.item(2), rect3);
  });

  QUnit.test('setActiveObject', function(assert) {
    assert.ok(typeof canvas.setActiveObject === 'function');

    var rect1 = makeRect(),
        rect2 = makeRect();

    canvas.add(rect1, rect2);

    canvas.setActiveObject(rect1);
    assert.ok(rect1 === canvas._activeObject);

    canvas.setActiveObject(rect2);
    assert.ok(rect2 === canvas._activeObject);
  });

  QUnit.test('getActiveObject', function(assert) {
    assert.ok(typeof canvas.getActiveObject === 'function');
    assert.equal(canvas.getActiveObject(), null, 'should initially be null');
    var rect1 = makeRect(),
        rect2 = makeRect();

    canvas.add(rect1, rect2);

    canvas.setActiveObject(rect1);
    assert.equal(canvas.getActiveObject(), rect1);

    canvas.setActiveObject(rect2);
    assert.equal(canvas.getActiveObject(), rect2);
  });

  QUnit.test('getsetActiveObject', function(assert) {
    assert.equal(canvas.getActiveObject(), null, 'should initially be null');

    var group = new fabric.Group([
      makeRect({ left: 10, top: 10 }),
      makeRect({ left: 20, top: 20 })
    ]);

    assert.equal(canvas.setActiveObject(group), canvas, 'should be chainable');
    assert.equal(canvas.getActiveObject(), group);
  });

  QUnit.test('item', function(assert) {
    assert.ok(typeof canvas.item === 'function');

    var rect1 = makeRect(),
        rect2 = makeRect();

    canvas.add(rect1, rect2);

    assert.equal(canvas.item(0), rect1);
    assert.equal(canvas.item(1), rect2);

    canvas.remove(canvas.item(0));

    assert.equal(canvas.item(0), rect2);
  });

  QUnit.test('discardActiveObject on ActiveSelection', function(assert) {
    var group = new fabric.ActiveSelection([makeRect(), makeRect()]);
    canvas.setActiveObject(group);
    assert.equal(canvas.discardActiveObject(), canvas, 'should be chainable');
    assert.equal(canvas.getActiveObject(), null, 'removing active group sets it to null');
  });

  QUnit.test('_discardActiveObject', function(assert) {

    canvas.add(makeRect());
    canvas.setActiveObject(canvas.item(0));

    canvas._discardActiveObject();
    assert.ok(!canvas.item(0).active);
    assert.equal(canvas.getActiveObject(), null);
  });

  QUnit.test('discardActiveObject', function(assert) {
    assert.ok(typeof canvas.discardActiveObject === 'function');

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

    canvas.on('selection:cleared', function( ){
      eventsFired.selectionCleared = true;
    });

    canvas.discardActiveObject();
    assert.ok(!canvas.item(0).active);
    assert.equal(canvas.getActiveObject(), null);
    assert.equal(canvas.getActiveObject(), null);

    for (var prop in eventsFired) {
      assert.ok(eventsFired[prop]);
    }
  });

  QUnit.test('complexity', function(assert) {
    assert.ok(typeof canvas.complexity === 'function');
    assert.equal(canvas.complexity(), 0);

    canvas.add(makeRect());
    assert.equal(canvas.complexity(), 1);

    canvas.add(makeRect(), makeRect());
    assert.equal(canvas.complexity(), 3);
  });

  QUnit.test('toString', function(assert) {
    assert.ok(typeof canvas.toString === 'function');

    assert.equal(canvas.toString(), '#<fabric.Canvas (0): { objects: 0 }>');

    canvas.add(makeRect());
    assert.equal(canvas.toString(), '#<fabric.Canvas (1): { objects: 1 }>');
  });

  QUnit.test('toSVG with active group', function(assert) {
    var rect = new fabric.Rect({ width: 50, height: 50, left: 100, top: 100 });
    var circle = new fabric.Circle({ radius: 50, left: 50, top: 50 });
    canvas.add(rect, circle);
    var svg = canvas.toSVG();

    canvas.setActiveObject(new fabric.ActiveSelection([rect, circle]));
    var svgWithActiveGroup = canvas.toSVG();

    assert.equal(svg, svgWithActiveGroup);
  });

  QUnit.test('active group objects reordering', function(assert) {
    var rect1 = new fabric.Rect({ width: 30, height: 30, left: 130, top: 130 });
    var rect2 = new fabric.Rect({ width: 50, height: 50, left: 100, top: 100 });
    var circle1 = new fabric.Circle({ radius: 10, left: 60, top: 60 });
    var circle2 = new fabric.Circle({ radius: 50, left: 50, top: 50 });
    canvas.add(rect1, rect2, circle1, circle2);
    assert.equal(canvas._objects[0], rect1);
    assert.equal(canvas._objects[1], rect2);
    assert.equal(canvas._objects[2], circle1);
    assert.equal(canvas._objects[3], circle2);
    var aGroup = new fabric.ActiveSelection([rect2, circle2, rect1, circle1]);
    // before rendering objects are ordered in insert order
    assert.equal(aGroup._objects[0], rect2);
    assert.equal(aGroup._objects[1], circle2);
    assert.equal(aGroup._objects[2], rect1);
    assert.equal(aGroup._objects[3], circle1);
    canvas.setActiveObject(aGroup).renderAll();
    // after rendering objects are ordered in canvas stack order
    assert.equal(aGroup._objects[0], rect1);
    assert.equal(aGroup._objects[1], rect2);
    assert.equal(aGroup._objects[2], circle1);
    assert.equal(aGroup._objects[3], circle2);
  });

  QUnit.test('dispose', function(assert) {
    //made local vars to do not dispose the external canvas
    var el = fabric.document.createElement('canvas'),
        parentEl = fabric.document.createElement('div'),
        wrapperEl, lowerCanvasEl, upperCanvasEl;
    el.width = 200; el.height = 200;
    parentEl.className = 'rootNode';
    parentEl.appendChild(el);

    assert.equal(parentEl.firstChild, el, 'canvas should be appended at partentEl');
    assert.equal(parentEl.childNodes.length, 1, 'parentEl has 1 child only');

    var canvas = new fabric.Canvas(el, {enableRetinaScaling: false, renderOnAddRemove: false });
    wrapperEl = canvas.wrapperEl;
    lowerCanvasEl = canvas.lowerCanvasEl;
    upperCanvasEl = canvas.upperCanvasEl;
    assert.equal(parentEl.childNodes.length, 1, 'parentEl has still 1 child only');
    assert.equal(wrapperEl.childNodes.length, 2, 'wrapper should have 2 children');
    assert.equal(wrapperEl.tagName, 'DIV', 'We wrapped canvas with DIV');
    assert.equal(wrapperEl.className, canvas.containerClass, 'DIV class should be set');
    assert.equal(wrapperEl.childNodes[0], lowerCanvasEl, 'First child should be lowerCanvas');
    assert.equal(wrapperEl.childNodes[1], upperCanvasEl, 'Second child should be upperCanvas');
    if (!fabric.isLikelyNode) {
      assert.equal(parentEl.childNodes[0], wrapperEl, 'wrapperEl is appendend to rootNode');
    }
    //looks like i cannot use parentNode
    //equal(wrapperEl, lowerCanvasEl.parentNode, 'lowerCanvas is appended to wrapperEl');
    //equal(wrapperEl, upperCanvasEl.parentNode, 'upperCanvas is appended to wrapperEl');
    //equal(parentEl, wrapperEl.parentNode, 'wrapperEl is appendend to rootNode');
    assert.equal(parentEl.childNodes.length, 1, 'parent div should have 1 child');
    assert.notEqual(parentEl.firstChild, canvas.getElement(), 'canvas should not be parent div firstChild');
    assert.ok(typeof canvas.dispose === 'function');
    canvas.add(makeRect(), makeRect(), makeRect());
    canvas.dispose();
    canvas.cancelRequestedRender();
    assert.equal(canvas.getObjects().length, 0, 'dispose should clear canvas');
    assert.equal(parentEl.childNodes.length, 1, 'parent has always 1 child');
    if (!fabric.isLikelyNode) {
      assert.equal(parentEl.childNodes[0], lowerCanvasEl, 'canvas should be back to its firstChild place');
    }
    assert.equal(canvas.wrapperEl, null, 'wrapperEl should be deleted');
    assert.equal(canvas.upperCanvasEl, null, 'upperCanvas should be deleted');
    assert.equal(canvas.cacheCanvasEl, null, 'cacheCanvasEl should be deleted');
    assert.equal(canvas.contextTop, null, 'contextTop should be deleted');
    assert.equal(canvas.contextCache, null, 'contextCache should be deleted');
  });

  // QUnit.test('dispose', function(assert) {
  //   function invokeEventsOnCanvas() {
  //     // nextSibling because we need to invoke events on upper canvas
  //     simulateEvent(canvas.getElement().nextSibling, 'mousedown');
  //     simulateEvent(canvas.getElement().nextSibling, 'mouseup');
  //     simulateEvent(canvas.getElement().nextSibling, 'mousemove');
  //   }
  //   var assertInvocationsCount = function() {
  //     var message = 'event handler should not be invoked after `dispose`';
  //     assert.equal(handlerInvocationCounts.__onMouseDown, 1);
  //     assert.equal(handlerInvocationCounts.__onMouseUp, 1);
  //     assert.equal(handlerInvocationCounts.__onMouseMove, 1);
  //   };

  //   assert.ok(typeof canvas.dispose === 'function');
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
  //   assert.equal(canvas.getObjects().length, 0, 'dispose should clear canvas');

  //   invokeEventsOnCanvas();
  //   assertInvocationsCount();
  // });

  QUnit.test('clone', function(assert) {
    var done = assert.async();
    assert.ok(typeof canvas.clone === 'function');

    canvas.add(new fabric.Rect({ width: 100, height: 110, top: 120, left: 130, fill: 'rgba(0,1,2,0.3)' }));
    var canvasData = JSON.stringify(canvas);

    canvas.clone(function(clone) {
      assert.ok(clone instanceof fabric.Canvas);

      // alert(JSON.stringify(clone));
      assert.equal(canvasData, JSON.stringify(clone), 'data on cloned canvas should be identical');

      assert.equal(canvas.getWidth(), clone.getWidth());
      assert.equal(canvas.getHeight(), clone.getHeight());
      clone.renderAll();
      done();
    });
  });

  QUnit.test('cloneWithoutData', function(assert) {
    var done = assert.async();
    assert.ok(typeof canvas.cloneWithoutData === 'function');

    canvas.add(new fabric.Rect({ width: 100, height: 110, top: 120, left: 130, fill: 'rgba(0,1,2,0.3)' }));

    canvas.cloneWithoutData(function(clone) {

      assert.ok(clone instanceof fabric.Canvas);

      assert.equal(JSON.stringify(clone), EMPTY_JSON, 'data on cloned canvas should be empty');

      assert.equal(canvas.getWidth(), clone.getWidth());
      assert.equal(canvas.getHeight(), clone.getHeight());
      clone.renderAll();
      done();
    });
  });

  QUnit.test('getSetWidth', function(assert) {
    assert.ok(typeof canvas.getWidth === 'function');
    assert.equal(canvas.getWidth(), 600);
    assert.equal(canvas.setWidth(444), canvas, 'should be chainable');
    assert.equal(canvas.getWidth(), 444);
    assert.equal(canvas.lowerCanvasEl.style.width, 444 + 'px');
  });

  QUnit.test('getSetHeight', function(assert) {
    assert.ok(typeof canvas.getHeight === 'function');
    assert.equal(canvas.getHeight(), 600);
    assert.equal(canvas.setHeight(765), canvas, 'should be chainable');
    assert.equal(canvas.getHeight(), 765);
    assert.equal(canvas.lowerCanvasEl.style.height, 765 + 'px');
  });

  QUnit.test('setWidth css only', function(assert) {
    canvas.setWidth(123);
    canvas.setWidth('100%', { cssOnly: true });

    assert.equal(canvas.lowerCanvasEl.style.width, '100%', 'Should be as the css only value');
    assert.equal(canvas.upperCanvasEl.style.width, '100%', 'Should be as the css only value');
    assert.equal(canvas.wrapperEl.style.width, '100%', 'Should be as the css only value');
    assert.equal(canvas.getWidth(), 123, 'Should be as the none css only value');
  });

  QUnit.test('setHeight css only', function(assert) {
    canvas.setHeight(123);
    canvas.setHeight('100%', { cssOnly: true });

    assert.equal(canvas.lowerCanvasEl.style.height, '100%', 'Should be as the css only value');
    assert.equal(canvas.upperCanvasEl.style.height, '100%', 'Should be as the css only value');
    assert.equal(canvas.wrapperEl.style.height, '100%', 'Should be as the css only value');
    assert.equal(canvas.getWidth(), 123, 'Should be as the none css only value');
  });

  QUnit.test('setWidth backstore only', function(assert) {
    canvas.setWidth(123);
    canvas.setWidth(500, { backstoreOnly: true });

    assert.equal(canvas.lowerCanvasEl.style.width, 123 + 'px', 'Should be as none backstore only value + "px"');
    assert.equal(canvas.upperCanvasEl.style.width, 123 + 'px', 'Should be as none backstore only value + "px"');
    assert.equal(canvas.wrapperEl.style.width, 123 + 'px', 'Should be as none backstore only value + "px"');
    assert.equal(canvas.getWidth(), 500, 'Should be as the backstore only value');
  });

  QUnit.test('setHeight backstore only', function(assert) {
    canvas.setHeight(123);
    canvas.setHeight(500, { backstoreOnly: true });

    assert.equal(canvas.lowerCanvasEl.style.height, 123 + 'px', 'Should be as none backstore only value + "px"');
    assert.equal(canvas.upperCanvasEl.style.height, 123 + 'px', 'Should be as none backstore only value + "px"');
    assert.equal(canvas.wrapperEl.style.height, 123 + 'px', 'Should be as none backstore only value + "px"');
    assert.equal(canvas.getHeight(), 500, 'Should be as the backstore only value');
  });

  QUnit.test('containsPoint', function(assert) {
    assert.ok(typeof canvas.containsPoint === 'function');

    var rect = new fabric.Rect({ left: 75, top: 75, width: 50, height: 50 });
    canvas.add(rect);

    var canvasEl = canvas.getElement(),
        canvasOffset = fabric.util.getElementOffset(canvasEl);

    var eventStub = {
      clientX: canvasOffset.left + 100,
      clientY: canvasOffset.top + 100,
      target: rect
    };

    assert.ok(canvas.containsPoint(eventStub, rect), 'point at (100, 100) should be within area (75, 75, 125, 125)');

    eventStub = {
      clientX: canvasOffset.left + 200,
      clientY: canvasOffset.top + 200,
      target: rect
    };
    assert.ok(!canvas.containsPoint(eventStub, rect), 'point at (200, 200) should NOT be within area (75, 75, 125, 125)');

    rect.set('left', 175).set('top', 175).setCoords();
    assert.ok(canvas.containsPoint(eventStub, rect), 'on rect at (200, 200) should be within area (175, 175, 225, 225)');
  });

  QUnit.test('setupCurrentTransform', function(assert) {
    assert.ok(typeof canvas._setupCurrentTransform === 'function');

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
    assert.equal(t.target, rect, 'should have rect as a target');
    assert.equal(t.action, 'drag', 'should target inside rect and setup drag');
    assert.equal(t.corner, 0, 'no corner selected');
    assert.equal(t.originX, rect.originX, 'no origin change for drag');
    assert.equal(t.originY, rect.originY, 'no origin change for drag');

    eventStub = {
      clientX: canvasOffset.left + rect.oCoords.tl.corner.tl.x + 1,
      clientY: canvasOffset.top + rect.oCoords.tl.corner.tl.y + 1,
      target: rect
    };

    canvas._setupCurrentTransform(eventStub, rect, false);
    t = canvas._currentTransform;
    assert.equal(t.target, rect, 'should have rect as a target');
    assert.equal(t.action, 'drag', 'should setup drag since the object was not selected');
    assert.equal(t.corner, 'tl', 'tl selected');
    assert.equal(t.shiftKey, undefined, 'shift was not pressed');

    var alreadySelected = true;
    canvas._setupCurrentTransform(eventStub, rect, alreadySelected);
    t = canvas._currentTransform;
    assert.equal(t.target, rect, 'should have rect as a target');
    assert.equal(t.action, 'scale', 'should target a corner and setup scale');
    assert.equal(t.corner, 'tl', 'tl selected');
    assert.equal(t.originX, 'right', 'origin in opposite direction');
    assert.equal(t.originY, 'bottom', 'origin in opposite direction');
    assert.equal(t.shiftKey, undefined, 'shift was not pressed');

    eventStub = {
      clientX: canvasOffset.left + rect.left - 2,
      clientY: canvasOffset.top + rect.top + rect.height / 2,
      target: rect,
      shiftKey: true
    };
    canvas._setupCurrentTransform(eventStub, rect, alreadySelected);
    t = canvas._currentTransform;
    assert.equal(t.target, rect, 'should have rect as a target');
    assert.equal(t.action, 'skewY', 'should target a corner and setup skew');
    assert.equal(t.shiftKey, true, 'shift was pressed');
    assert.equal(t.corner, 'ml', 'ml selected');
    assert.equal(t.originX, 'right', 'origin in opposite direction');

    eventStub = {
      clientX: canvasOffset.left + rect.oCoords.mtr.x,
      clientY: canvasOffset.top + rect.oCoords.mtr.y,
      target: rect,
    };
    canvas._setupCurrentTransform(eventStub, rect, alreadySelected);
    t = canvas._currentTransform;
    assert.equal(t.target, rect, 'should have rect as a target');
    assert.equal(t.action, 'rotate', 'should target a corner and setup rotate');
    assert.equal(t.corner, 'mtr', 'mtr selected');
    assert.equal(t.originX, 'center', 'origin in center');
    assert.equal(t.originY, 'center', 'origin in center');
    canvas._currentTransform = false;
  });

  QUnit.test('_rotateObject', function(assert) {
    assert.ok(typeof canvas._rotateObject === 'function');
    var rect = new fabric.Rect({ left: 75, top: 75, width: 50, height: 50 });
    canvas.add(rect);
    var canvasEl = canvas.getElement(),
        canvasOffset = fabric.util.getElementOffset(canvasEl);
    var eventStub = {
      clientX: canvasOffset.left + rect.oCoords.mtr.x,
      clientY: canvasOffset.top + rect.oCoords.mtr.y,
      target: rect,
    };
    canvas._setupCurrentTransform(eventStub, rect);
    var rotated = canvas._rotateObject(30, 30, 'equally');
    assert.equal(rotated, true, 'return true if a rotation happened');
    rotated = canvas._rotateObject(30, 30);
    assert.equal(rotated, false, 'return true if no rotation happened');
  });

  QUnit.test('_rotateObject do not change origins', function(assert) {
    assert.ok(typeof canvas._rotateObject === 'function');
    var rect = new fabric.Rect({ left: 75, top: 75, width: 50, height: 50, originX: 'right', originY: 'bottom' });
    canvas.add(rect);
    var canvasEl = canvas.getElement(),
        canvasOffset = fabric.util.getElementOffset(canvasEl);
    var eventStub = {
      clientX: canvasOffset.left + rect.oCoords.mtr.x,
      clientY: canvasOffset.top + rect.oCoords.mtr.y,
      target: rect,
    };
    canvas._setupCurrentTransform(eventStub, rect);
    assert.equal(rect.originX, 'right');
    assert.equal(rect.originY, 'bottom');
  });

  QUnit.test('_scaleObject', function(assert) {
    assert.ok(typeof canvas._scaleObject === 'function');
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
    assert.equal(scaled, true, 'return true if scaling happened');
    scaled = canvas._scaleObject(30, 30, 'equally');
    assert.equal(scaled, false, 'return false if no movement happen');
  });

  QUnit.test('containsPoint in viewport transform', function(assert) {
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

    assert.ok(canvas.containsPoint(eventStub, rect), 'point at (250, 250) should be within area (75, 75, 125, 125)');
    canvas.viewportTransform = [1, 0, 0, 1, 0, 0];
  });

  QUnit.test('fxRemove', function(assert) {
    var done = assert.async();
    assert.ok(typeof canvas.fxRemove === 'function');

    var rect = new fabric.Rect();
    canvas.add(rect);

    var callbackFired = false;
    function onComplete() {
      callbackFired = true;
    }

    assert.equal(canvas.item(0), rect);
    assert.equal(canvas.fxRemove(rect, { onComplete: onComplete }), canvas, 'should be chainable');

    setTimeout(function() {
      assert.equal(canvas.item(0), undefined);
      assert.ok(callbackFired);
      done();
    }, 1000);
  });

  // QUnit.test('backgroundImage', function(assert) {
  //   var done = assert.async();
  //   assert.deepEqual('', canvas.backgroundImage);
  //   canvas.setBackgroundImage('../../assets/pug.jpg');

  //   setTimeout(function() {

  //     assert.ok(typeof canvas.backgroundImage == 'object');
  //     assert.ok(/pug\.jpg$/.test(canvas.backgroundImage.src));

  //     assert.deepEqual(canvas.toJSON(), {
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

  //     done();
  //   }, 1000);
  // });

  QUnit.test('clipTo', function(assert) {
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

    assert.ok(typeof error === 'undefined', 'renderAll with clipTo does not throw');
  });

  QUnit.test('isTargetTransparent', function(assert) {
    var rect = new fabric.Rect({
      width: 10,
      height: 10,
      strokeWidth: 4,
      stroke: 'red',
      fill: '',
      top: 0,
      left: 0,
      objectCaching: true,
    });
    canvas.add(rect);
    assert.equal(canvas.isTargetTransparent(rect, 0, 0), false, 'opaque on 0,0');
    assert.equal(canvas.isTargetTransparent(rect, 1, 1), false, 'opaque on 1,1');
    assert.equal(canvas.isTargetTransparent(rect, 2, 2), false, 'opaque on 2,2');
    assert.equal(canvas.isTargetTransparent(rect, 3, 3), false, 'opaque on 3,3');
    assert.equal(canvas.isTargetTransparent(rect, 4, 4), true, 'transparent on 4,4');
    assert.equal(canvas.isTargetTransparent(rect, 5, 5), true, 'transparent on 5, 5');
    assert.equal(canvas.isTargetTransparent(rect, 6, 6), true, 'transparent on 6, 6');
    assert.equal(canvas.isTargetTransparent(rect, 7, 7), true, 'transparent on 7, 7');
    assert.equal(canvas.isTargetTransparent(rect, 8, 8), true, 'transparent on 8, 8');
    assert.equal(canvas.isTargetTransparent(rect, 9, 9), true, 'transparent on 9, 9');
    assert.equal(canvas.isTargetTransparent(rect, 10, 10), false, 'opaque on 10, 10');
    assert.equal(canvas.isTargetTransparent(rect, 11, 11), false, 'opaque on 11, 11');
    assert.equal(canvas.isTargetTransparent(rect, 12, 12), false, 'opaque on 12, 12');
    assert.equal(canvas.isTargetTransparent(rect, 13, 13), false, 'opaque on 13, 13');
    assert.equal(canvas.isTargetTransparent(rect, 14, 14), true, 'transparent on 14, 14');
  });

  QUnit.test('isTargetTransparent without objectCaching', function(assert) {
    var rect = new fabric.Rect({
      width: 10,
      height: 10,
      strokeWidth: 4,
      stroke: 'red',
      fill: '',
      top: 0,
      left: 0,
      objectCaching: false,
    });
    canvas.add(rect);
    assert.equal(canvas.isTargetTransparent(rect, 0, 0), false, 'opaque on 0,0');
    assert.equal(canvas.isTargetTransparent(rect, 1, 1), false, 'opaque on 1,1');
    assert.equal(canvas.isTargetTransparent(rect, 2, 2), false, 'opaque on 2,2');
    assert.equal(canvas.isTargetTransparent(rect, 3, 3), false, 'opaque on 3,3');
    assert.equal(canvas.isTargetTransparent(rect, 4, 4), true, 'transparent on 4,4');
    assert.equal(canvas.isTargetTransparent(rect, 5, 5), true, 'transparent on 5, 5');
    assert.equal(canvas.isTargetTransparent(rect, 6, 6), true, 'transparent on 6, 6');
    assert.equal(canvas.isTargetTransparent(rect, 7, 7), true, 'transparent on 7, 7');
    assert.equal(canvas.isTargetTransparent(rect, 8, 8), true, 'transparent on 8, 8');
    assert.equal(canvas.isTargetTransparent(rect, 9, 9), true, 'transparent on 9, 9');
    assert.equal(canvas.isTargetTransparent(rect, 10, 10), false, 'opaque on 10, 10');
    assert.equal(canvas.isTargetTransparent(rect, 11, 11), false, 'opaque on 11, 11');
    assert.equal(canvas.isTargetTransparent(rect, 12, 12), false, 'opaque on 12, 12');
    assert.equal(canvas.isTargetTransparent(rect, 13, 13), false, 'opaque on 13, 13');
    assert.equal(canvas.isTargetTransparent(rect, 14, 14), true, 'transparent on 14, 14');
  });

  QUnit.test('isTargetTransparent as active object', function(assert) {
    var rect = new fabric.Rect({
      width: 20,
      height: 20,
      strokeWidth: 4,
      stroke: 'red',
      fill: '',
      top: 0,
      left: 0,
      objectCaching: true,
    });
    canvas.add(rect);
    canvas.setActiveObject(rect);
    assert.equal(canvas.isTargetTransparent(rect, 0, 0), false, 'opaque on 0,0');
    assert.equal(canvas.isTargetTransparent(rect, 1, 1), false, 'opaque on 1,1');
    assert.equal(canvas.isTargetTransparent(rect, 2, 2), false, 'opaque on 2,2');
    assert.equal(canvas.isTargetTransparent(rect, 3, 3), false, 'opaque on 3,3');
    assert.equal(canvas.isTargetTransparent(rect, 4, 4), false, 'opaque on 4,4');
    assert.equal(canvas.isTargetTransparent(rect, 5, 5), false, 'opaque on 5, 5');
    assert.equal(canvas.isTargetTransparent(rect, 6, 6), false, 'opaque on 6, 6');
    assert.equal(canvas.isTargetTransparent(rect, 7, 7), true, 'transparent on 7, 7');
    assert.equal(canvas.isTargetTransparent(rect, 8, 8), true, 'transparent on 8, 8');
    assert.equal(canvas.isTargetTransparent(rect, 9, 9), true, 'transparent on 9, 9');
    assert.equal(canvas.isTargetTransparent(rect, 10, 10), true, 'transparent 10, 10');
    assert.equal(canvas.isTargetTransparent(rect, 11, 11), true, 'transparent 11, 11');
    assert.equal(canvas.isTargetTransparent(rect, 12, 12), true, 'transparent 12, 12');
    assert.equal(canvas.isTargetTransparent(rect, 13, 13), true, 'transparent 13, 13');
    assert.equal(canvas.isTargetTransparent(rect, 14, 14), true, 'transparent 14, 14');
    assert.equal(canvas.isTargetTransparent(rect, 15, 15), true, 'transparent 15, 15');
    assert.equal(canvas.isTargetTransparent(rect, 16, 16), true, 'transparent 16, 16');
    assert.equal(canvas.isTargetTransparent(rect, 17, 17), false, 'opaque 17, 17');
    assert.equal(canvas.isTargetTransparent(rect, 18, 18), false, 'opaque 18, 18');
    assert.equal(canvas.isTargetTransparent(rect, 19, 19), false, 'opaque 19, 19');
    assert.equal(canvas.isTargetTransparent(rect, 20, 20), false, 'opaque 20, 20');
    assert.equal(canvas.isTargetTransparent(rect, 21, 21), false, 'opaque 21, 21');
    assert.equal(canvas.isTargetTransparent(rect, 22, 22), false, 'opaque 22, 22');
    assert.equal(canvas.isTargetTransparent(rect, 23, 23), false, 'opaque 23, 23');
    assert.equal(canvas.isTargetTransparent(rect, 24, 24), false, 'opaque 24, 24');
    assert.equal(canvas.isTargetTransparent(rect, 25, 25), false, 'opaque 25, 25');
    assert.equal(canvas.isTargetTransparent(rect, 26, 26), false, 'opaque 26, 26');
    assert.equal(canvas.isTargetTransparent(rect, 27, 27), false, 'opaque 27, 27');
    assert.equal(canvas.isTargetTransparent(rect, 28, 28), false, 'opaque 28, 28');
    assert.equal(canvas.isTargetTransparent(rect, 29, 29), false, 'opaque 29, 29');
    assert.equal(canvas.isTargetTransparent(rect, 30, 30), false, 'opaque 30, 30');
    assert.equal(canvas.isTargetTransparent(rect, 31, 31), true, 'transparent 31, 31');

  });

  QUnit.test('canvas inheritance', function(assert) {

    // this should not error out
    var InheritedCanvasClass = fabric.util.createClass(fabric.Canvas, {
      initialize: function() {

      }
    });

    assert.ok(typeof InheritedCanvasClass === 'function');
  });
})();
