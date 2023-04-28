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

  var PATH_DATALESS_JSON = '{"version":"' + fabric.version + '","objects":[{"type":"Path","version":"' + fabric.version + '","originX":"left","originY":"top","left":99.5,"top":99.5,"width":200,"height":200,"fill":"rgb(0,0,0)",' +
                           '"stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,' +
                           '"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,' +
                           '"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"sourcePath":"http://example.com/"}]}';

  var RECT_JSON = '{"version":"' + fabric.version + '","objects":[{"type":"Rect","version":"' + fabric.version + '","originX":"left","originY":"top","left":0,"top":0,"width":10,"height":10,"fill":"rgb(0,0,0)",' +
                  '"stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,' +
                  '"shadow":null,' +
                  '"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"rx":0,"ry":0}],"background":"#ff5555","overlay":"rgba(0,0,0,0.2)"}';

  function _createImageElement() {
    return fabric.getDocument().createElement('img');
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

  var IMG_SRC = isNode() ? ('file://' + __dirname + '/../fixtures/test_image.gif') : getAbsolutePath('../fixtures/test_image.gif');

  let canvas, upperCanvasEl, lowerCanvasEl;

  function makeRect(options = {}) {
    var defaultOptions = { width: 10, height: 10 };
    return new fabric.Rect({ ...defaultOptions, ...options });
  }

  function makeTriangle(options = {}) {
    var defaultOptions = { width: 30, height: 30 };
    return new fabric.Triangle({ ...defaultOptions, ...options });
  }

  QUnit.module('fabric.Canvas', {
    beforeEach: function () {
      canvas = new fabric.Canvas(null, { enableRetinaScaling: false, width: 600, height: 600 });
      upperCanvasEl = canvas.upperCanvasEl;
      lowerCanvasEl = canvas.lowerCanvasEl;
    },
    afterEach: function () {
      fabric.config.restoreDefaults();
      return canvas.dispose();
    }
  });

  QUnit.test('prevent multiple canvas initialization', function (assert) {
    var canvas = new fabric.Canvas();
    assert.ok(canvas.lowerCanvasEl);
    assert.throws(() => new fabric.Canvas(canvas.lowerCanvasEl));
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
    assert.ok(typeof canvas.preserveObjectStacking === 'boolean');
    assert.ok(!canvas.preserveObjectStacking, 'default is false');
  });

  QUnit.test('uniformScaling', function(assert) {
    assert.ok(typeof canvas.uniformScaling === 'boolean');
    assert.ok(canvas.uniformScaling, 'default is true');
  });

  QUnit.test('uniScaleKey', function(assert) {
    assert.ok(typeof canvas.uniScaleKey === 'string');
    assert.equal(canvas.uniScaleKey, 'shiftKey', 'default is shift');
  });

  QUnit.test('centeredScaling', function(assert) {
    assert.ok(typeof canvas.centeredScaling === 'boolean');
    assert.ok(!canvas.centeredScaling, 'default is false');
  });

  QUnit.test('centeredRotation', function(assert) {
    assert.ok(typeof canvas.centeredRotation === 'boolean');
    assert.ok(!canvas.centeredRotation, 'default is false');
  });

  QUnit.test('centeredKey', function(assert) {
    assert.ok(typeof canvas.centeredKey === 'string');
    assert.equal(canvas.centeredKey, 'altKey', 'default is alt');
  });

  QUnit.test('altActionKey', function(assert) {
    assert.ok(typeof canvas.altActionKey === 'string');
    assert.equal(canvas.altActionKey, 'shiftKey', 'default is shift');
  });

  QUnit.test('interactive', function(assert) {
    assert.ok(typeof canvas.interactive === 'boolean');
    assert.ok(canvas.interactive, 'default is true');
  });

  QUnit.test('selection', function(assert) {
    assert.ok(typeof canvas.selection === 'boolean');
    assert.ok(canvas.selection, 'default is true');
  });

  QUnit.test('init', function(assert) {
    assert.equal(canvas.lowerCanvasEl.getAttribute('data-fabric'), 'main', 'el should be marked by canvas init');
    assert.equal(canvas.upperCanvasEl.getAttribute('data-fabric'), 'top', 'el should be marked by canvas init');
    assert.equal(canvas.wrapperEl.getAttribute('data-fabric'), 'wrapper', 'el should be marked by canvas init');
  });

  QUnit.test('renderTop', function(assert) {
    assert.ok(typeof canvas.renderTop === 'function');
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
    assert.deepEqual(canvas.calcOffset(), { left: 0, top: 0 }, 'should retrun offset');
  });

  QUnit.test('add', function(assert) {
    var rect1 = makeRect(),
        rect2 = makeRect(),
        rect3 = makeRect(),
        rect4 = makeRect();

    assert.ok(typeof canvas.add === 'function');
    assert.equal(canvas.add(rect1), 1, 'should return the new length of objects array');
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
    canvas.insertAt(1, rect);
    assert.strictEqual(canvas.item(1), rect);
    canvas.insertAt(2, rect);
    assert.strictEqual(canvas.item(2), rect);
  });

  QUnit.test('remove', function(assert) {
    var rect1 = makeRect(),
        rect2 = makeRect(),
        rect3 = makeRect(),
        rect4 = makeRect();

    canvas.add(rect1, rect2, rect3, rect4);

    assert.ok(typeof canvas.remove === 'function');
    assert.equal(canvas.remove(rect1)[0], rect1, 'should return the number of objects removed');
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
    var deselected;
    canvas.on('before:selection:cleared', function(options) {
      deselected = options.deselected;
    });
    var rect = new fabric.Rect();
    canvas.add(rect);
    canvas.setActiveObject(rect);
    canvas.discardActiveObject();
    assert.equal(deselected.length, 1, 'options.deselected was the removed object');
    assert.equal(deselected[0], rect, 'options.deselected was the removed object');
    var rect1 = new fabric.Rect();
    var rect2 = new fabric.Rect();
    canvas.add(rect1, rect2);
    var activeSelection = canvas.getActiveSelection();
    activeSelection.add(rect1, rect2);
    canvas.setActiveObject(activeSelection);
    canvas.discardActiveObject();
    assert.equal(deselected.length, 1, 'options.deselected was the removed object');
    assert.equal(deselected[0], activeSelection, 'removing an activeSelection pass that as a target');
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

  function initActiveSelection(canvas, activeObject, target, multiSelectionStacking) {
    const activeSelection = canvas.getActiveSelection();
    activeSelection.multiSelectionStacking = multiSelectionStacking;
    canvas.setActiveObject(activeObject);
    canvas.handleMultiSelection({ clientX: 0, clientY: 0, [canvas.selectionKey]: true }, target);
  }

  function updateActiveSelection(canvas, existing, target, multiSelectionStacking) {
    const activeSelection = canvas.getActiveSelection();
    activeSelection.multiSelectionStacking = multiSelectionStacking;
    activeSelection.add(...existing);
    canvas.setActiveObject(activeSelection);
    canvas.handleMultiSelection({ clientX: 1, clientY: 1, [canvas.selectionKey]: true }, target);
  }

  QUnit.test('create active selection fires selection:created', function(assert) {
    var isFired = false;
    var rect1 = new fabric.Rect();
    var rect2 = new fabric.Rect();
    canvas.add(rect1, rect2);
    canvas.on('selection:created', function( ) { isFired = true; });
    initActiveSelection(canvas, rect1, rect2, 'selection-order');
    assert.equal(canvas._hoveredTarget, canvas.getActiveObject(), 'the created selection is also hovered');
    assert.equal(isFired, true, 'selection:created fired');
    canvas.off('selection:created');
    canvas.clear();
  });

  QUnit.test('create active selection fires selected on new object', function(assert) {
    var isFired = false;
    var rect1 = new fabric.Rect();
    var rect2 = new fabric.Rect();
    canvas.add(rect1, rect2);
    rect2.on('selected', function( ) { isFired = true; });
    initActiveSelection(canvas, rect1, rect2, 'selection-order');
    const activeSelection = canvas.getActiveObjects();
    assert.equal(isFired, true, 'selected fired on rect2');
    assert.equal(activeSelection[0], rect1, 'first rec1');
    assert.equal(activeSelection[1], rect2, 'then rect2');
    canvas.clear();
  });

  QUnit.test('start multiselection: default', function(assert) {
    var rect1 = new fabric.Rect();
    var rect2 = new fabric.Rect();
    canvas.add(rect1, rect2);
    initActiveSelection(canvas, rect2, rect1, 'selection-order');
    const activeSelection = canvas.getActiveObjects();
    assert.equal(activeSelection[0], rect2, 'first rect2');
    assert.equal(activeSelection[1], rect1, 'then rect1');
  });

  QUnit.test('start multiselection: preserve', function (assert) {
    var rect1 = new fabric.Rect();
    var rect2 = new fabric.Rect();
    canvas.add(rect1, rect2);
    initActiveSelection(canvas, rect2, rect1, 'canvas-stacking');
    const activeSelection = canvas.getActiveObjects();
    assert.equal(activeSelection[0], rect1, 'first rect1');
    assert.equal(activeSelection[1], rect2, 'then rect2');
  });

  QUnit.test('update active selection selection:updated', function(assert) {
    var isFired = false;
    var rect1 = new fabric.Rect();
    var rect2 = new fabric.Rect();
    var rect3 = new fabric.Rect();
    canvas.add(rect1, rect2, rect3);
    canvas.on('selection:updated', function( ) { isFired = true; });
    updateActiveSelection(canvas, [rect1, rect2], rect3, 'selection-order');
    assert.equal(isFired, true, 'selection:updated fired');
    assert.equal(canvas._hoveredTarget, canvas.getActiveObject(), 'hovered target is updated');
  });

  QUnit.test('update active selection fires deselected on an object', function(assert) {
    var isFired = false;
    var rect1 = new fabric.Rect({ width: 10, height: 10 });
    var rect2 = new fabric.Rect({ width: 10, height: 10 });
    canvas.add(rect1, rect2);
    rect2.on('deselected', function( ) { isFired = true; });
    updateActiveSelection(canvas, [rect1, rect2], rect2, 'selection-order');
    assert.equal(isFired, true, 'deselected on rect2 fired');
  });

  QUnit.test('update active selection fires selected on an object', function(assert) {
    var isFired = false;
    var rect1 = new fabric.Rect();
    var rect2 = new fabric.Rect();
    var rect3 = new fabric.Rect();
    canvas.add(rect1, rect2, rect3);
    rect3.on('selected', function( ) { isFired = true; });
    updateActiveSelection(canvas, [rect1, rect2], rect3, 'selection-order');
    assert.equal(isFired, true, 'selected on rect3 fired');
  });


  QUnit.test('continuing multiselection respects order of objects', function (assert) {
    const rect1 = new fabric.Rect();
    const rect2 = new fabric.Rect();
    const rect3 = new fabric.Rect();
    canvas.add(rect1, rect2, rect3);
    function assertObjectsInOrder(init, added) {
      updateActiveSelection(canvas, init, added, 'canvas-stacking');
      assert.deepEqual(canvas.getActiveObjects(), [rect1, rect2, rect3], 'updated selection while preserving canvas stacking order');
      canvas.discardActiveObject();
      updateActiveSelection(canvas, init, added, 'selection-order');
      assert.deepEqual(canvas.getActiveObjects(), [...init, added], 'updated selection while preserving click order');
      canvas.discardActiveObject();
    }
    function assertObjectsInOrderOnCanvas(init, added) {
      assert.deepEqual(canvas.getObjects(), [rect1, rect2, rect3]);
      assertObjectsInOrder(init, added);
      assert.deepEqual(canvas.getObjects(), [rect1, rect2, rect3]);
    }
    assertObjectsInOrderOnCanvas([rect1, rect2], rect3);
    assertObjectsInOrderOnCanvas([rect1, rect3], rect2);
    assertObjectsInOrderOnCanvas([rect2, rect3], rect1);
    canvas.remove(rect2, rect3);
    const group = new fabric.Group([rect2, rect3], { subTargetCheck: true, interactive: true });
    canvas.add(group);
    function assertNestedObjectsInOrder(init, added) {
      assert.deepEqual(canvas.getObjects(), [rect1, group]);
      assert.deepEqual(group.getObjects(), [rect2, rect3]);
      assertObjectsInOrder(init, added);
      assert.deepEqual(canvas.getObjects(), [rect1, group]);
      assert.deepEqual(group.getObjects(), [rect2, rect3]);
    }
    assertNestedObjectsInOrder([rect1, rect2], rect3);
    assertNestedObjectsInOrder([rect1, rect3], rect2);
    assertNestedObjectsInOrder([rect2, rect3], rect1);
    canvas.remove(rect1);
    group.insertAt(0, rect1);
    group.remove(rect3);
    canvas.add(rect3);
    function assertNestedObjectsInOrder2(init, added) {
      assert.deepEqual(canvas.getObjects(), [group, rect3]);
      assert.deepEqual(group.getObjects(), [rect1, rect2]);
      assertObjectsInOrder(init, added);
      assert.deepEqual(canvas.getObjects(), [group, rect3]);
      assert.deepEqual(group.getObjects(), [rect1, rect2]);
    }
    assertNestedObjectsInOrder2([rect1, rect2], rect3);
    assertNestedObjectsInOrder2([rect1, rect3], rect2);
    assertNestedObjectsInOrder2([rect2, rect3], rect1);
  });

  QUnit.test('multiselection: toggle', assert => {
    const rect1 = new fabric.Rect();
    const rect2 = new fabric.Rect();
    const rect3 = new fabric.Rect();
    let isFired = false;
    rect2.on('deselected', () => { isFired = true; });
    canvas.add(rect1, rect2, rect3);
    updateActiveSelection(canvas, [rect1, rect2, rect3], rect2, 'selection-order');
    assert.deepEqual(canvas.getActiveObjects(), [rect1, rect3], 'rect2 was deselected');
    assert.ok(isFired, 'fired deselected');
  });

  QUnit.test('multiselection: clicking nested target of active selection toggles nested target', assert => {
    const rect1 = new fabric.Rect({ width: 10, height: 10 });
    const rect2 = new fabric.Rect({ width: 10, height: 10 });
    const rect3 = new fabric.Rect({ width: 10, height: 10 });
    let isFired = false;
    rect3.on('deselected', () => { isFired = true; });
    canvas.add(rect1, rect2, rect3);
    updateActiveSelection(canvas, [rect1, rect2, rect3], canvas.getActiveSelection(), 'selection-order');
    assert.deepEqual(canvas.getActiveObjects(), [rect1, rect2], 'rect3 was deselected');
    assert.ok(isFired, 'fired deselected');
  });

  QUnit.test('multiselection: clicking active selection does nothing', assert => {
    const rect1 = new fabric.Rect({ left: 10, width: 10, height: 10 });
    const rect2 = new fabric.Rect({ left: -10, width: 5, height: 5 });
    const rect3 = new fabric.Rect({ top: 10, width: 10, height: 10 });
    canvas.add(rect1, rect2, rect3);
    updateActiveSelection(canvas, [rect1, rect2, rect3], canvas.getActiveSelection(), 'selection-order');
    assert.deepEqual(canvas.getActiveObjects(), [rect1, rect2, rect3], 'nothing happened');
    assert.ok(canvas.getActiveSelection() === canvas.getActiveObject(), 'still selected');
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

  function setGroupSelector(canvas, { x = 0, y = 0, deltaX = 0, deltaY = 0 } = {}) {
    canvas._groupSelector = {
      x, y, deltaX, deltaY
    };
  }

  QUnit.test('group selected objects fires selected for objects', function(assert) {
    var fired = 0;
    var rect1 = new fabric.Rect({ width: 10, height: 10 });
    var rect2 = new fabric.Rect({ width: 10, height: 10 });
    var rect3 = new fabric.Rect({ width: 10, height: 10 });
    rect1.on('selected', function() { fired++; });
    rect2.on('selected', function() { fired++; });
    rect3.on('selected', function () { fired++; });
    canvas.add(rect1, rect2, rect3);
    setGroupSelector(canvas, {
      x: 1,
      y: 1,
      deltaX: 5,
      deltaY: 5
    });
    canvas.__onMouseUp({});
    assert.equal(fired, 3, 'event fired for each of 3 rects');
  });

  QUnit.test('group selected objects fires selection:created if more than one object is returned', function(assert) {
    var isFired = false;
    var rect1 = new fabric.Rect({ width: 10, height: 10 });
    var rect2 = new fabric.Rect({ width: 10, height: 10 });
    var rect3 = new fabric.Rect({ width: 10, height: 10 });
    canvas.on('selection:created', function () { isFired = true; });
    canvas.add(rect1, rect2, rect3);
    setGroupSelector(canvas, {
      x: 1,
      y: 1,
      deltaX: 5,
      deltaY: 5
    });
    canvas.__onMouseUp({});
    assert.equal(isFired, true, 'selection created fired');
    assert.equal(canvas.getActiveObject().constructor.name, 'ActiveSelection', 'an active selection is created');
    assert.equal(canvas.getActiveObjects()[0], rect1, 'rect1 is first object');
    assert.equal(canvas.getActiveObjects()[1], rect2, 'rect2 is second object');
    assert.equal(canvas.getActiveObjects()[2], rect3, 'rect3 is third object');
    assert.equal(canvas.getActiveObjects().length, 3, 'contains exactly 3 objects');
  });

  QUnit.test('group selected objects fires selection:created if one only object is returned', function(assert) {
    var isFired = false;
    var rect1 = new fabric.Rect({ width: 10, height: 10 });
    canvas.on('selection:created', function() { isFired = true; });
    canvas.add(rect1);
    setGroupSelector(canvas, {
      x: 1,
      y: 1,
      deltaX: 5,
      deltaY: 5
    });
    canvas.__onMouseUp({});
    assert.equal(isFired, true, 'selection:created fired');
    assert.equal(canvas.getActiveObject(), rect1, 'rect1 is set as activeObject');
  });

  QUnit.test('handleSelection collect topmost object if no dragging occurs', function (assert) {
    var rect1 = new fabric.Rect({ width: 10, height: 10, top: 0, left: 0 });
    var rect2 = new fabric.Rect({ width: 10, height: 10, top: 0, left: 0 });
    var rect3 = new fabric.Rect({ width: 10, height: 10, top: 0, left: 0 });
    canvas.add(rect1, rect2, rect3);
    setGroupSelector(canvas, { x: 1, y: 1, deltaX: 0, deltaY: 0 });
    assert.ok(canvas.handleSelection({}), 'selection occurred');
    assert.equal(canvas.getActiveObjects().length, 1, 'a rect that contains all objects collects them all');
    assert.equal(canvas.getActiveObjects()[0], rect3, 'rect3 is collected');
  });

  QUnit.test('handleSelection does not collect objects that have onSelect returning true', function(assert) {
    var rect1 = new fabric.Rect({ width: 10, height: 10, top: 2, left: 2 });
    rect1.onSelect = function() {
      return true;
    };
    var rect2 = new fabric.Rect({ width: 10, height: 10, top: 2, left: 2 });
    canvas.add(rect1, rect2);
    setGroupSelector(canvas, { x: 1, y: 1, deltaX: 20, deltaY: 20 });
    assert.ok(canvas.handleSelection({}), 'selection occurred');
    assert.equal(canvas.getActiveObjects().length, 1, 'objects are in the same position buy only one gets selected');
    assert.equal(canvas.getActiveObjects()[0], rect2, 'contains rect2 but not rect 1');
  });

  QUnit.test('handleSelection does not call onSelect on objects that are not intersected', function(assert) {
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
    setGroupSelector(canvas, { x: 25, y: 25, deltaX: 1, deltaY: 1 });
    assert.ok(canvas.handleSelection({}), 'selection occurred');
    var onSelectCalls = onSelectRect1CallCount + onSelectRect2CallCount;
    assert.equal(onSelectCalls, 0, 'none of the onSelect methods was called');
    // Intersects one
    setGroupSelector(canvas, { x: 0, y: 0, deltaX: 5, deltaY: 5 });
    assert.ok(canvas.handleSelection({}), 'selection occurred');
    assert.equal(canvas.getActiveObject(), rect1, 'rect1 was selected');
    assert.equal(onSelectRect1CallCount, 1, 'rect1 onSelect was called while setting active object');
    assert.equal(onSelectRect2CallCount, 0, 'rect2 onSelect was not called');
    // Intersects both
    setGroupSelector(canvas, { x: 0, y: 0, deltaX: 15, deltaY: 5 });
    assert.ok(canvas.handleSelection({}), 'selection occurred');
    assert.deepEqual(canvas.getActiveObjects(), [rect1, rect2], 'rect1 selected');
    assert.equal(onSelectRect1CallCount, 2, 'rect1 onSelect was called once when collectiong it and once when selecting it');
    assert.equal(onSelectRect2CallCount, 1, 'rect2 onSelect was called');
  });

  QUnit.test('handleMultiSelection return false if onSelect return true', function(assert) {
    var rect = new fabric.Rect();
    var rect2 = new fabric.Rect();
    rect.onSelect = function() {
      return true;
    };
    canvas._activeObject = rect2;
    var selectionKey = canvas.selectionKey;
    var event = {};
    event[selectionKey] = true;
    var returned = canvas.handleMultiSelection(event, rect);
    assert.equal(returned, false, 'if onSelect returns true, shouldGroup return false');
  });

  QUnit.test('handleMultiSelection return true if onSelect return false and selectionKey is true', function(assert) {
    var rect = new fabric.Rect();
    var rect2 = new fabric.Rect();
    rect.onSelect = function() {
      return false;
    };
    canvas._activeObject = rect2;
    var selectionKey = canvas.selectionKey;
    var event = {};
    event[selectionKey] = true;
    var returned = canvas.handleMultiSelection(event, rect);
    assert.equal(returned, true, 'if onSelect returns false, shouldGroup return true');
  });

  QUnit.test('handleMultiSelection return false if selectionKey is false', function(assert) {
    var rect = new fabric.Rect();
    var rect2 = new fabric.Rect();
    rect.onSelect = function() {
      return false;
    };
    canvas._activeObject = rect2;
    var selectionKey = canvas.selectionKey;
    var event = {};
    event[selectionKey] = false;
    var returned = canvas.handleMultiSelection(event, rect);
    assert.equal(returned, false, 'shouldGroup return false');
  });

  QUnit.test('_fireSelectionEvents fires multiple things', function(assert) {
    var rect1Deselected = false;
    var rect3Selected = false;
    var rect1 = new fabric.Rect();
    var rect2 = new fabric.Rect();
    var rect3 = new fabric.Rect();
    var activeSelection = canvas.getActiveSelection();
    activeSelection.add(rect1, rect2);
    canvas.setActiveObject(activeSelection);
    rect1.on('deselected', function( ) {
      rect1Deselected = true;
    });
    rect3.on('selected', function( ) {
      rect3Selected = true;
    });
    var currentObjects = canvas.getActiveObjects();
    activeSelection.remove(rect1);
    activeSelection.add(rect3);
    canvas._fireSelectionEvents(currentObjects, {});
    assert.ok(rect3Selected, 'rect 3 selected');
    assert.ok(rect1Deselected, 'rect 1 deselected');
  });

  QUnit.test('getContext', function(assert) {
    assert.ok(typeof canvas.getContext === 'function');
  });

  QUnit.test('clearContext', function(assert) {
    assert.ok(typeof canvas.clearContext === 'function');
    canvas.clearContext(canvas.getContext());
  });

  QUnit.test('clear', function(assert) {
    assert.ok(typeof canvas.clear === 'function');

    canvas.clear();
    assert.equal(canvas.getObjects().length, 0);
  });

  QUnit.test('renderAll', function(assert) {
    assert.ok(typeof canvas.renderAll === 'function');
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
        pointer = { clientX: 15, clientY: 15, shiftKey: true },
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
    });
    assert.equal(target, group, 'Should return the group');
    assert.equal(canvas.targets[0], undefined, 'no subtarget should return');

    target = canvas.findTarget({
      clientX: 30, clientY: 30
    });
    assert.equal(target, group, 'Should return the group');
    group.subTargetCheck = true;
    group.setCoords();
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
    group3.setCoords();
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
    });
    assert.equal(target, g, 'Should return the group 96');
    assert.equal(canvas.targets[0], rect1, 'should find the target rect 96');
    canvas.targets = [];

    target = canvas.findTarget({
      clientX: 98, clientY: 188
    });
    assert.equal(target, g, 'Should return the group 98');
    assert.equal(canvas.targets[0], rect1, 'should find the target rect1 98');
    canvas.targets = [];

    target = canvas.findTarget({
      clientX: 100, clientY: 190
    });
    assert.equal(target, g, 'Should return the group 100');
    assert.equal(canvas.targets[0], rect1, 'should find the target rect1 100');
    canvas.targets = [];

    target = canvas.findTarget({
      clientX: 102, clientY: 192
    });
    assert.equal(target, g, 'Should return the group 102');
    assert.equal(canvas.targets[0], rect1, 'should find the target rect 102');
    canvas.targets = [];

    target = canvas.findTarget({
      clientX: 104, clientY: 194
    });
    assert.equal(target, g, 'Should return the group 104');
    assert.equal(canvas.targets[0], rect1, 'should find the target rect 104');
    canvas.targets = [];

    target = canvas.findTarget({
      clientX: 106, clientY: 196
    });
    assert.equal(target, g, 'Should return the group 106');
    assert.equal(canvas.targets[0], rect2, 'should find the target rect2 106');
    canvas.targets = [];
  });

  QUnit.test('findTarget with subTargetCheck on activeObject', function(assert) {
    var rect = makeRect({ left: 0, top: 0 }),
        rect2 = makeRect({ left: 30, top:  30}), target,
        group = new fabric.Group([rect, rect2]);


    group.subTargetCheck = true;
    canvas.add(group);
    canvas.setActiveObject(group);
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
    group.subTargetCheck = true;
    canvas.add(group);
    canvas.setActiveObject(group);
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
    canvas.remove(group3);
  });

  QUnit.test('findTarget on active selection', function(assert) {
    var rect1 = makeRect({ left: 0, top: 0 }), target;
    var rect2 = makeRect({ left: 20, top: 20 });
    var rect3 = makeRect({ left: 20, top: 0 });
    canvas.add(rect1);
    canvas.add(rect2);
    canvas.add(rect3);
    const group = canvas.getActiveSelection();
    group.subTargetCheck = true;
    group.add(rect1, rect2);
    group.cornerSize = 2;
    group.setCoords();
    canvas.setActiveObject(group);
    target = canvas.findTarget({
      clientX: 5, clientY: 5
    });
    assert.equal(target, group, 'Should return the activegroup');
    target = canvas.findTarget({
      clientX: 40, clientY: 15
    });
    assert.equal(target, null, 'Should miss the activegroup');
    assert.ok(!group.__corner, 'not over control');
    target = canvas.findTarget({
      clientX: 0, clientY: 0
    });
    assert.equal(group.__corner, 'tl', 'over control');
    assert.ok(target, group, 'should return active selection if over control');
    target = canvas.findTarget({
      clientX: 5, clientY: 5
    });
    assert.ok(target, group, 'should return active selection');
    assert.equal(canvas.targets[0], rect1, 'Should return the rect inside active selection');
    target = canvas.findTarget({
      clientX: 25, clientY: 5
    });
    assert.equal(target, group, 'Should return the active selection');
    assert.deepEqual(canvas.targets, [], 'Should not return the rect behind active selection');
    canvas.discardActiveObject();
    target = canvas.findTarget({
      clientX: 25, clientY: 5
    });
    assert.equal(target, rect3, 'Should return the rect3 now that active selection has been cleared');
  });

  QUnit.test('findTarget on active selection with perPixelTargetFind', function(assert) {
    var rect1 = makeRect({ left: 0, top: 0 }), target;
    var rect2 = makeRect({ left: 20, top: 20 });
    canvas.perPixelTargetFind = true;
    canvas.preserveObjectStacking = true;
    canvas.add(rect1);
    canvas.add(rect2);
    const group = canvas.getActiveSelection();
    group.add(rect1, rect2);
    canvas.setActiveObject(group);
    target = canvas.findTarget({
      clientX: 8, clientY: 8
    });
    assert.equal(target, group, 'Should return the activegroup');

    target = canvas.findTarget({
      clientX: 15, clientY: 15
    });
    assert.equal(target, null, 'Should miss the activegroup');
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

  QUnit.test('getCenterPoint', function(assert) {
    assert.ok(typeof canvas.getCenterPoint === 'function');
    var center = canvas.getCenterPoint();
    assert.equal(center.x, upperCanvasEl.width / 2);
    assert.equal(center.y, upperCanvasEl.height / 2);
  });

  QUnit.test('centerObjectH', function(assert) {
    assert.ok(typeof canvas.centerObjectH === 'function');
    var rect = makeRect({ left: 102, top: 202 });
    canvas.add(rect);
    canvas.centerObjectH(rect);
    assert.equal(rect.getCenterPoint().x, upperCanvasEl.width / 2, 'object\'s "left" property should correspond to canvas element\'s center');
  });

  QUnit.test('centerObjectV', function(assert) {
    assert.ok(typeof canvas.centerObjectV === 'function');
    var rect = makeRect({ left: 102, top: 202 });
    canvas.add(rect);
    canvas.centerObjectV(rect);
    assert.equal(rect.getCenterPoint().y, upperCanvasEl.height / 2, 'object\'s "top" property should correspond to canvas element\'s center');
  });

  QUnit.test('centerObject', function(assert) {
    assert.ok(typeof canvas.centerObject === 'function');
    var rect = makeRect({ left: 102, top: 202 });
    canvas.add(rect);
    canvas.centerObject(rect);

    assert.equal(rect.getCenterPoint().y, upperCanvasEl.height / 2, 'object\'s "top" property should correspond to canvas element\'s center');
    assert.equal(rect.getCenterPoint().x, upperCanvasEl.width / 2, 'object\'s "left" property should correspond to canvas element\'s center');
  });

  QUnit.test('toJSON', function(assert) {
    assert.ok(typeof canvas.toJSON === 'function');
    assert.equal(JSON.stringify(canvas.toJSON()), EMPTY_JSON);
    canvas.backgroundColor = '#ff5555';
    canvas.overlayColor = 'rgba(0,0,0,0.2)';
    assert.deepEqual(canvas.toJSON(), { "version": fabric.version,"objects":[],"background":"#ff5555","overlay":"rgba(0,0,0,0.2)"}, '`background` and `overlayColor` value should be reflected in json');
    canvas.add(makeRect());
    assert.deepEqual(canvas.toJSON(), JSON.parse(RECT_JSON));
  });

  QUnit.test('toJSON with active group', function(assert) {
    var rect = new fabric.Rect({ width: 50, height: 50, left: 100, top: 100 });
    var circle = new fabric.Circle({ radius: 50, left: 50, top: 50 });
    canvas.add(rect, circle);
    var json = JSON.stringify(canvas);

    const activeSelection = canvas.getActiveSelection();
    activeSelection.add(rect, circle);
    canvas.setActiveObject(activeSelection);
    var jsonWithActiveGroup = JSON.stringify(canvas);

    assert.equal(json, jsonWithActiveGroup);
  });

  QUnit.test('toDatalessJSON', function(assert) {
    var path = new fabric.Path('M 100 100 L 300 100 L 200 300 z', {
      sourcePath: 'http://example.com/'
    });
    canvas.add(path);
    assert.deepEqual(canvas.toDatalessJSON(), JSON.parse(PATH_DATALESS_JSON));
  });

  QUnit.test('toObject', function(assert) {
    assert.ok(typeof canvas.toObject === 'function');
    var expectedObject = {
      version: fabric.version,
      objects: canvas.getObjects()
    };
    assert.deepEqual(expectedObject, canvas.toObject());

    var rect = makeRect();
    canvas.add(rect);

    assert.equal(canvas.toObject().objects[0].type, rect.constructor.name);
  });


  QUnit.test('toObject with clipPath', function(assert) {
    var clipPath = makeRect();
    var canvasWithClipPath = new fabric.Canvas(null, { clipPath: clipPath });
    var expectedObject = {
      version: fabric.version,
      objects: canvasWithClipPath.getObjects(),
      clipPath: {
        type: 'Rect',
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
        backgroundColor: '',
        fillRule: 'nonzero',
        paintFirst: 'fill',
        globalCompositeOperation: 'source-over',
        skewX: 0,
        skewY: 0,
        rx: 0,
        ry: 0,
        strokeUniform: false
      }
    };

    assert.ok(typeof canvasWithClipPath.toObject === 'function');
    assert.deepEqual(expectedObject, canvasWithClipPath.toObject());

    var rect = makeRect();
    canvasWithClipPath.add(rect);

    assert.equal(canvasWithClipPath.toObject().objects[0].type, rect.constructor.name);
  });

  QUnit.test('toDatalessObject', function(assert) {
    assert.ok(typeof canvas.toDatalessObject === 'function');
    var expectedObject = {
      version: fabric.version,
      objects: canvas.getObjects()
    };

    assert.deepEqual(expectedObject, canvas.toDatalessObject());

    var rect = makeRect();
    canvas.add(rect);

    assert.equal(canvas.toObject().objects[0].type, rect.constructor.name);
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
    canvas.loadFromJSON(PATH_JSON).then(function() {
      var obj = canvas.item(0);

      assert.ok(!canvas.isEmpty(), 'canvas is not empty');
      assert.equal(obj.constructor.name, 'Path', 'first object is a path object');
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
    canvas.loadFromJSON(JSON.parse(PATH_JSON)).then(function(){
      var obj = canvas.item(0);

      assert.ok(!canvas.isEmpty(), 'canvas is not empty');
      assert.equal(obj.constructor.name, 'Path', 'first object is a path object');
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
    canvas.loadFromJSON(JSON.parse(PATH_WITHOUT_DEFAULTS_JSON)).then(function(){
      var obj = canvas.item(0);

      assert.ok(!canvas.isEmpty(), 'canvas is not empty');
      assert.equal(obj.constructor.name, 'Path', 'first object is a path object');
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

      if (instance.constructor.name === 'Path') {
        instance.customID = 'fabric_1';
      }
    }
    var done = assert.async();
    canvas.loadFromJSON(JSON.parse(PATH_JSON), reviver).then(function(){
      var obj = canvas.item(0);

      assert.ok(!canvas.isEmpty(), 'canvas is not empty');
      assert.equal(obj.constructor.name, 'Path', 'first object is a path object');
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
    });
  });

  QUnit.test('loadFromJSON with no objects', function(assert) {
    var done = assert.async();
    var canvas1 = fabric.getDocument().createElement('canvas'),
        canvas2 = fabric.getDocument().createElement('canvas'),
        c1 = new fabric.Canvas(canvas1, { backgroundColor: 'green', overlayColor: 'yellow' }),
        c2 = new fabric.Canvas(canvas2, { backgroundColor: 'red', overlayColor: 'orange' });

    var json = c1.toJSON();
    var fired = false;
    c2.loadFromJSON(json).then(function() {
      fired = true;

      assert.ok(fired, 'Callback should be fired even if no objects');
      assert.equal(c2.backgroundColor, 'green', 'Color should be set properly');
      assert.equal(c2.overlayColor, 'yellow', 'Color should be set properly');
      done();
    });
  });

  QUnit.test('loadFromJSON without "objects" property', function(assert) {
    var done = assert.async();
    var canvas1 = fabric.getDocument().createElement('canvas'),
        canvas2 = fabric.getDocument().createElement('canvas'),
        c1 = new fabric.Canvas(canvas1, { backgroundColor: 'green', overlayColor: 'yellow' }),
        c2 = new fabric.Canvas(canvas2, { backgroundColor: 'red', overlayColor: 'orange' });

    var json = c1.toJSON();
    var fired = false;

    delete json.objects;

    c2.loadFromJSON(json).then(function() {
      fired = true;

      assert.ok(fired, 'Callback should be fired even if no "objects" property exists');
      assert.equal(c2.backgroundColor, 'green', 'Color should be set properly');
      assert.equal(c2.overlayColor, 'yellow', 'Color should be set properly');
      done();
    });
  });

  QUnit.test('loadFromJSON with empty fabric.Group', function(assert) {
    var done = assert.async();
    var canvas1 = fabric.getDocument().createElement('canvas'),
        canvas2 = fabric.getDocument().createElement('canvas'),
        c1 = new fabric.Canvas(canvas1),
        c2 = new fabric.Canvas(canvas2),
        group = new fabric.Group();

    c1.add(group);
    assert.ok(!c1.isEmpty(), 'canvas is not empty');

    var json = c1.toJSON();
    var fired = false;
    c2.loadFromJSON(json).then(function() {
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

    canvas.loadFromJSON(json).then(function() {
      assert.equal(3, canvas.getObjects().length);

      done();
    });
  });

  QUnit.test('loadFromJSON with custom properties on Canvas with no async object', function(assert) {
    var done = assert.async();
    var serialized = JSON.parse(PATH_JSON);
    serialized.controlsAboveOverlay = true;
    serialized.preserveObjectStacking = true;
    assert.equal(canvas.controlsAboveOverlay, fabric.Canvas.getDefaults().controlsAboveOverlay);
    assert.equal(canvas.preserveObjectStacking, fabric.Canvas.getDefaults().preserveObjectStacking);
    canvas.loadFromJSON(serialized).then(function() {
      assert.ok(!canvas.isEmpty(), 'canvas is not empty');
      assert.equal(canvas.controlsAboveOverlay, true);
      assert.equal(canvas.preserveObjectStacking, true);
      done();
    });
  });

  QUnit.test('loadFromJSON with custom properties on Canvas with image', function(assert) {
    var done = assert.async();
    var serialized = {
      "objects": [
        { "type": "image", "originX": "left", "originY": "top", "left": 13.6, "top": -1.4, "width": 3000, "height": 3351, "fill": "rgb(0,0,0)", "stroke": null, "strokeWidth": 0, "strokeDashArray": null, "strokeLineCap": "butt", "strokeDashOffset": 0, "strokeLineJoin": "miter", "strokeMiterLimit": 4, "scaleX": 0.05, "scaleY": 0.05, "angle": 0, "flipX": false, "flipY": false, "opacity": 1, "shadow": null, "visible": true, "backgroundColor": "", "fillRule": "nonzero", "globalCompositeOperation": "source-over", "skewX": 0, "skewY": 0, "src": IMG_SRC, "filters": [], "crossOrigin": "" }],
      "background": "green"
    };
    serialized.controlsAboveOverlay = true;
    serialized.preserveObjectStacking = true;
    assert.equal(canvas.controlsAboveOverlay, fabric.Canvas.getDefaults().controlsAboveOverlay);
    assert.equal(canvas.preserveObjectStacking, fabric.Canvas.getDefaults().preserveObjectStacking);
    // before callback the properties are still false.
    assert.equal(canvas.controlsAboveOverlay, false);
    assert.equal(canvas.preserveObjectStacking, false);
    canvas.loadFromJSON(serialized).then(function() {
      assert.ok(!canvas.isEmpty(), 'canvas is not empty');
      assert.equal(canvas.controlsAboveOverlay, true);
      assert.equal(canvas.preserveObjectStacking, true);
      done();
    });
  });


  QUnit.test('normalize pointer', function(assert) {
    assert.ok(typeof canvas._normalizePointer === 'function');
    var pointer = new fabric.Point({ x: 10, y: 20 }),
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
    var pointer = new fabric.Point({ x: 10, y: 20 }),
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


  QUnit.test('sendObjectToBack', function(assert) {
    assert.ok(typeof canvas.sendObjectToBack === 'function');

    var rect1 = makeRect(),
        rect2 = makeRect(),
        rect3 = makeRect();

    canvas.add(rect1, rect2, rect3);

    canvas.sendObjectToBack(rect3);
    assert.equal(canvas.item(0), rect3, 'third should now be the first one');

    canvas.sendObjectToBack(rect2);
    assert.equal(canvas.item(0), rect2, 'second should now be the first one');

    canvas.sendObjectToBack(rect2);
    assert.equal(canvas.item(0), rect2, 'second should *still* be the first one');
  });

  QUnit.test('bringObjectToFront', function(assert) {
    assert.ok(typeof canvas.bringObjectToFront === 'function');

    var rect1 = makeRect(),
        rect2 = makeRect(),
        rect3 = makeRect();

    canvas.add(rect1, rect2, rect3);

    canvas.bringObjectToFront(rect1);
    assert.equal(canvas.item(2), rect1, 'first should now be the last one');

    canvas.bringObjectToFront(rect2);
    assert.equal(canvas.item(2), rect2, 'second should now be the last one');

    canvas.bringObjectToFront(rect2);
    assert.equal(canvas.item(2), rect2, 'second should *still* be the last one');
  });

  QUnit.test('sendObjectBackwards', function(assert) {
    assert.ok(typeof canvas.sendObjectBackwards === 'function');

    var rect1 = makeRect(),
        rect2 = makeRect(),
        rect3 = makeRect();

    canvas.add(rect1, rect2, rect3);

    // [ 1, 2, 3 ]
    assert.equal(canvas.item(0), rect1);
    assert.equal(canvas.item(1), rect2);
    assert.equal(canvas.item(2), rect3);

    canvas.sendObjectBackwards(rect3);

    // moved 3 one level back — [1, 3, 2]
    assert.equal(canvas.item(0), rect1);
    assert.equal(canvas.item(2), rect2);
    assert.equal(canvas.item(1), rect3);

    canvas.sendObjectBackwards(rect3);

    // moved 3 one level back — [3, 1, 2]
    assert.equal(canvas.item(1), rect1);
    assert.equal(canvas.item(2), rect2);
    assert.equal(canvas.item(0), rect3);

    canvas.sendObjectBackwards(rect3);

    // 3 stays at the deepEqual position — [2, 3, 1]
    assert.equal(canvas.item(1), rect1);
    assert.equal(canvas.item(2), rect2);
    assert.equal(canvas.item(0), rect3);

    canvas.sendObjectBackwards(rect2);

    assert.equal(canvas.item(2), rect1);
    assert.equal(canvas.item(1), rect2);
    assert.equal(canvas.item(0), rect3);

    canvas.sendObjectBackwards(rect2);

    assert.equal(canvas.item(2), rect1);
    assert.equal(canvas.item(0), rect2);
    assert.equal(canvas.item(1), rect3);
  });

  QUnit.test('bringObjectForward', function(assert) {
    assert.ok(typeof canvas.bringObjectForward === 'function');

    var rect1 = makeRect(),
        rect2 = makeRect(),
        rect3 = makeRect();

    canvas.add(rect1, rect2, rect3);

    // initial position — [ 1, 2, 3 ]
    assert.equal(canvas.item(0), rect1);
    assert.equal(canvas.item(1), rect2);
    assert.equal(canvas.item(2), rect3);

    canvas.bringObjectForward(rect1);

    // 1 moves one way up — [ 2, 1, 3 ]
    assert.equal(canvas.item(1), rect1);
    assert.equal(canvas.item(0), rect2);
    assert.equal(canvas.item(2), rect3);

    canvas.bringObjectForward(rect1);

    // 1 moves one way up again — [ 2, 3, 1 ]
    assert.equal(canvas.item(2), rect1);
    assert.equal(canvas.item(0), rect2);
    assert.equal(canvas.item(1), rect3);

    canvas.bringObjectForward(rect1);

    // 1 is already all the way on top and so doesn't change position — [ 2, 3, 1 ]
    assert.equal(canvas.item(2), rect1);
    assert.equal(canvas.item(0), rect2);
    assert.equal(canvas.item(1), rect3);

    canvas.bringObjectForward(rect3);

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

    assert.ok(canvas.setActiveObject(rect1), 'selected');
    assert.ok(rect1 === canvas._activeObject);

    assert.ok(canvas.setActiveObject(rect2), 'selected');
    assert.ok(!canvas.setActiveObject(rect2), 'no effect');
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

    canvas.setActiveObject(group);
    assert.equal(canvas.getActiveObject(), group);
  });

  QUnit.test('getActiveSelection', function(assert) {
    assert.ok(canvas.getActiveSelection() === canvas._activeSelection, 'should equal');
    assert.ok(canvas.getActiveSelection() instanceof fabric.ActiveSelection, 'is active selection');
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
    canvas.discardActiveObject();
    assert.equal(canvas.getActiveObject(), null, 'removing active group sets it to null');
  });

  QUnit.test('_discardActiveObject', function(assert) {

    canvas.add(makeRect());
    canvas.setActiveObject(canvas.item(0));

    assert.ok(canvas._discardActiveObject(), 'discarded');
    assert.ok(!canvas._discardActiveObject(), 'no effect');
    assert.equal(canvas.getActiveObject(), null);
  });

  QUnit.test('_discardActiveObject - cleanup transform', function (assert) {
    var e = { clientX: 5, clientY: 5, which: 1, target: canvas.upperCanvasEl };
    var target = makeRect();
    canvas.add(target);
    canvas.setActiveObject(target);
    canvas._setupCurrentTransform(e, target, true);
    assert.ok(canvas._currentTransform, 'transform should be set');
    target.isMoving = true;
    canvas._discardActiveObject();
    assert.ok(!canvas._currentTransform, 'transform should be cleared');
    assert.ok(!target.isMoving, 'moving flag should have been negated');
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

    assert.ok(canvas.discardActiveObject(), 'deselected');
    assert.ok(!canvas.getActiveObject(), 'no active object');
    assert.ok(!canvas.discardActiveObject(), 'no effect');
    assert.equal(canvas.getActiveObject(), null);

    for (var prop in eventsFired) {
      assert.ok(eventsFired[prop]);
    }
  });

  QUnit.test('refuse discarding active object', function (assert) {
    const rect = makeRect();
    rect.onDeselect = () => true;
    canvas.setActiveObject(rect);
    assert.ok(!canvas.discardActiveObject(), 'no effect');
    assert.ok(canvas.getActiveObject() === rect, 'active object');
    canvas.clear();
    assert.ok(!canvas.getActiveObject(), 'cleared the stubborn ref');
  })

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

    assert.equal(canvas.toString(), '#<Canvas (0): { objects: 0 }>');

    canvas.add(makeRect());
    assert.equal(canvas.toString(), '#<Canvas (1): { objects: 1 }>');
  });

  QUnit.test('toSVG with active group', function(assert) {
    var rect = new fabric.Rect({ width: 50, height: 50, left: 100, top: 100 });
    var circle = new fabric.Circle({ radius: 50, left: 50, top: 50 });
    canvas.add(rect, circle);
    var svg = canvas.toSVG();
    const activeSelection = canvas.getActiveSelection();
    activeSelection.add(rect, circle);
    canvas.setActiveObject(activeSelection);
    var svgWithActiveGroup = canvas.toSVG();

    assert.equal(svg, svgWithActiveGroup);
  });

  [true, false].forEach(enableRetinaScaling => {
    QUnit.test(`set dimensions, enableRetinaScaling ${enableRetinaScaling}`, async function (assert) {
      var el = fabric.getDocument().createElement('canvas'),
        parentEl = fabric.getDocument().createElement('div');
      el.width = 200; el.height = 200;
      parentEl.className = 'rootNode';
      parentEl.appendChild(el);

      const dpr = 1.25;
      fabric.config.configure({ devicePixelRatio: dpr });

      assert.equal(parentEl.firstChild, el, 'canvas should be appended at partentEl');
      assert.equal(parentEl.childNodes.length, 1, 'parentEl has 1 child only');

      el.style.position = 'relative';
      var elStyle = el.style.cssText;
      assert.equal(elStyle, 'position: relative;', 'el style should not be empty');

      var canvas = new fabric.Canvas(el, { enableRetinaScaling, renderOnAddRemove: false });

      canvas.setDimensions({ width: 500, height: 500 });
      assert.equal(canvas._originalCanvasStyle, elStyle, 'saved original canvas style for disposal');
      assert.notEqual(el.style.cssText, canvas._originalCanvasStyle, 'canvas el style has been changed');
      assert.equal(el.width, 500 * (enableRetinaScaling ? dpr : 1), 'expected width');
      assert.equal(el.height, 500 * (enableRetinaScaling ? dpr : 1), 'expected height');
      assert.equal(canvas.upperCanvasEl.width, 500 * (enableRetinaScaling ? dpr : 1), 'expected width');
      assert.equal(canvas.upperCanvasEl.height, 500 * (enableRetinaScaling ? dpr : 1), 'expected height');

      await canvas.dispose();
      assert.equal(canvas._originalCanvasStyle, undefined, 'removed original canvas style');
      assert.equal(el.style.cssText, elStyle, 'restored original canvas style');
      assert.equal(el.width, 500, 'restored width');
      assert.equal(el.height, 500, 'restored height');

    });
  });


  QUnit.test('clone', function(assert) {
    var done = assert.async();
    assert.ok(typeof canvas.clone === 'function');

    canvas.add(new fabric.Rect({ width: 100, height: 110, top: 120, left: 130, fill: 'rgba(0,1,2,0.3)' }));
    var canvasData = JSON.stringify(canvas);

    canvas.clone().then(function(clone) {
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
    assert.ok(typeof canvas.cloneWithoutData === 'function');

    canvas.add(new fabric.Rect({ width: 100, height: 110, top: 120, left: 130, fill: 'rgba(0,1,2,0.3)' }));

    const clone = canvas.cloneWithoutData();

    assert.ok(clone instanceof fabric.Canvas);

    assert.equal(JSON.stringify(clone), EMPTY_JSON, 'data on cloned canvas should be empty');

    assert.equal(canvas.getWidth(), clone.getWidth());
    assert.equal(canvas.getHeight(), clone.getHeight());
    clone.renderAll();
  });

  QUnit.test('getSetWidth', function(assert) {
    assert.ok(typeof canvas.getWidth === 'function');
    assert.equal(canvas.getWidth(), 600);
    canvas.setWidth(444);
    assert.equal(canvas.getWidth(), 444);
    assert.equal(canvas.lowerCanvasEl.style.width, 444 + 'px');
  });

  QUnit.test('getSetHeight', function(assert) {
    assert.ok(typeof canvas.getHeight === 'function');
    assert.equal(canvas.getHeight(), 600);
    canvas.setHeight(765);
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
    assert.equal(canvas.getHeight(), 123, 'Should be as the none css only value');
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
    rect.__corner = rect._findTargetCorner(
      canvas.getPointer(eventStub, true)
    );
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
    rect.__corner = rect._findTargetCorner(
      canvas.getPointer(eventStub, true)
    );
    canvas._setupCurrentTransform(eventStub, rect, false);
    t = canvas._currentTransform;
    assert.equal(t.target, rect, 'should have rect as a target');
    assert.equal(t.action, 'drag', 'should setup drag since the object was not selected');
    assert.equal(t.corner, 'tl', 'tl selected');
    assert.equal(t.shiftKey, undefined, 'shift was not pressed');

    var alreadySelected = true;
    rect.__corner = rect._findTargetCorner(
      canvas.getPointer(eventStub, true)
    );
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
    rect.__corner = rect._findTargetCorner(
      canvas.getPointer(eventStub, true)
    );
    canvas._setupCurrentTransform(eventStub, rect, alreadySelected);
    t = canvas._currentTransform;
    assert.equal(t.target, rect, 'should have rect as a target');
    assert.equal(t.action, 'skewY', 'should target a corner and setup skew');
    assert.equal(t.shiftKey, true, 'shift was pressed');
    assert.equal(t.corner, 'ml', 'ml selected');
    assert.equal(t.originX, 'right', 'origin in opposite direction');

    // to be replaced with new api test
    // eventStub = {
    //   clientX: canvasOffset.left + rect.oCoords.mtr.x,
    //   clientY: canvasOffset.top + rect.oCoords.mtr.y,
    //   target: rect,
    // };
    // canvas._setupCurrentTransform(eventStub, rect, alreadySelected);
    // t = canvas._currentTransform;
    // assert.equal(t.target, rect, 'should have rect as a target');
    // assert.equal(t.action, 'mtr', 'should target a corner and setup rotate');
    // assert.equal(t.corner, 'mtr', 'mtr selected');
    // assert.equal(t.originX, 'center', 'origin in center');
    // assert.equal(t.originY, 'center', 'origin in center');
    // canvas._currentTransform = false;
  });

  // QUnit.test('_rotateObject', function(assert) {
  //   assert.ok(typeof canvas._rotateObject === 'function');
  //   var rect = new fabric.Rect({ left: 75, top: 75, width: 50, height: 50 });
  //   canvas.add(rect);
  //   var canvasEl = canvas.getElement(),
  //       canvasOffset = fabric.util.getElementOffset(canvasEl);
  //   var eventStub = {
  //     clientX: canvasOffset.left + rect.oCoords.mtr.x,
  //     clientY: canvasOffset.top + rect.oCoords.mtr.y,
  //     target: rect,
  //   };
  //   canvas._setupCurrentTransform(eventStub, rect);
  //   var rotated = canvas._rotateObject(30, 30, 'equally');
  //   assert.equal(rotated, true, 'return true if a rotation happened');
  //   rotated = canvas._rotateObject(30, 30);
  //   assert.equal(rotated, false, 'return true if no rotation happened');
  // });
  //
  // QUnit.test('_rotateObject do not change origins', function(assert) {
  //   assert.ok(typeof canvas._rotateObject === 'function');
  //   var rect = new fabric.Rect({ left: 75, top: 75, width: 50, height: 50, originX: 'right', originY: 'bottom' });
  //   canvas.add(rect);
  //   var canvasEl = canvas.getElement(),
  //       canvasOffset = fabric.util.getElementOffset(canvasEl);
  //   var eventStub = {
  //     clientX: canvasOffset.left + rect.oCoords.mtr.x,
  //     clientY: canvasOffset.top + rect.oCoords.mtr.y,
  //     target: rect,
  //   };
  //   canvas._setupCurrentTransform(eventStub, rect);
  //   assert.equal(rect.originX, 'right');
  //   assert.equal(rect.originY, 'bottom');
  // });

  QUnit.skip('fxRemove', function(assert) {
    var done = assert.async();
    assert.ok(typeof canvas.fxRemove === 'function');

    var rect = new fabric.Rect();
    canvas.add(rect);

    var callbackFired = false;
    function onComplete() {
      callbackFired = true;
    }

    assert.equal(canvas.item(0), rect);
    assert.ok(typeof canvas.fxRemove(rect, { onComplete: onComplete }).abort === 'function', 'should return animation abort function');

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
  //       "backgroundImage": (fabric.getDocument().location.protocol +
  //                           '//' +
  //                           fabric.getDocument().location.hostname +
  //                           ((fabric.getDocument().location.port === '' || parseInt(fabric.getDocument().location.port, 10) === 80)
  //                               ? ''
  //                               : (':' + fabric.getDocument().location.port)) +
  //                           '/assets/pug.jpg'),
  //       "backgroundImageOpacity": 1,
  //       "backgroundImageStretch": true
  //     });

  //     done();
  //   }, 1000);
  // });

  [true, false].forEach(objectCaching => {
    function testPixelDetection(assert, canvas, target, expectedHits) {
      function execute(context = '') {
        expectedHits.forEach(({ start, end, message, transparent }) => {
          // make less sensitive by skipping edges for firefox 110
          const round = 0;
          for (let index = start + round; index < end - round; index++) {
            assert.equal(
              canvas.isTargetTransparent(target, index, index),
              transparent,
              `checking transparency of (${index}, ${index}), expected to be ${transparent}, ${message}, ${context}`
            );
          }
        });
      }
      execute();
      canvas.setActiveObject(target);
      execute('target is selected');
    }

    QUnit.test(`isTargetTransparent, objectCaching ${objectCaching}`, function (assert) {
      var rect = new fabric.Rect({
        width: 10,
        height: 10,
        strokeWidth: 4,
        stroke: 'red',
        fill: '',
        top: 0,
        left: 0,
        objectCaching,
      });
      canvas.add(rect);
      testPixelDetection(assert, canvas, rect, [
        { start: -5, end: 0, message: 'outside', transparent: true },
        { start: 0, end: 4, message: 'stroke', transparent: false },
        { start: 4, end: 10, message: 'fill', transparent: true },
        { start: 10, end: 14, message: 'stroke', transparent: false },
        { start: 14, end: 20, message: 'outside', transparent: true },
      ]);
    });

    QUnit.test(`isTargetTransparent, vpt, objectCaching ${objectCaching}`, function (assert) {
      var rect = new fabric.Rect({
        width: 10,
        height: 10,
        strokeWidth: 4,
        stroke: 'red',
        fill: '',
        top: 0,
        left: 0,
        objectCaching,
      });
      canvas.add(rect);
      canvas.setViewportTransform([2, 0, 0, 2, 0, 0]);
      testPixelDetection(assert, canvas, rect, [
        { start: -5, end: 0, message: 'outside', transparent: true },
        { start: 0, end: 8, message: 'stroke', transparent: false },
        { start: 8, end: 20, message: 'fill', transparent: true },
        { start: 20, end: 28, message: 'stroke', transparent: false },
        { start: 28, end: 40, message: 'outside', transparent: true },
      ]);
    });

    QUnit.test(`isTargetTransparent, vpt, tolerance, objectCaching ${objectCaching}`, function (assert) {
      var rect = new fabric.Rect({
        width: 10,
        height: 10,
        strokeWidth: 4,
        stroke: 'red',
        fill: '',
        top: 0,
        left: 0,
        objectCaching,
      });
      canvas.add(rect);
      canvas.setTargetFindTolerance(5);
      canvas.setViewportTransform([2, 0, 0, 2, 0, 0]);
      testPixelDetection(assert, canvas, rect, [
        { start: -10, end: -5, message: 'outside', transparent: true },
        { start: -5, end: 0, message: 'stroke tolerance not affected by vpt', transparent: false },
        { start: 0, end: 8, message: 'stroke', transparent: false },
        { start: 8, end: 13, message: 'stroke tolerance not affected by vpt', transparent: false },
        { start: 13, end: 15, message: 'fill', transparent: true },
        { start: 15, end: 20, message: 'stroke tolerance not affected by vpt', transparent: false },
        { start: 20, end: 28, message: 'stroke', transparent: false },
        { start: 28, end: 33, message: 'stroke tolerance not affected by vpt', transparent: false },
        { start: 33, end: 40, message: 'outside', transparent: true },
      ]);
    });   
  });

  QUnit.test('canvas getTopContext', function(assert) {
    assert.ok(typeof canvas.getTopContext === 'function');
    assert.equal(canvas.getTopContext(), canvas.contextTop, 'it jsut returns contextTop');
  });

  QUnit.test('_shouldCenterTransform', function(assert) {
    assert.equal(
      canvas._shouldCenterTransform({}, 'someAction', false), false, 'a non standard action does not center scale');
    assert.equal(
      canvas._shouldCenterTransform({}, 'someAction', true), true,
      'a non standard action will center scale if altKey is true'
    );
    canvas.centeredScaling = true;
    ['scale', 'scaleX', 'scaleY', 'resizing'].forEach(function(action) {
      assert.equal(
        canvas._shouldCenterTransform({}, action, false), true,
        action + ' standard action will center scale if canvas.centeredScaling is true and no centeredKey pressed'
      );
    });
    ['scale', 'scaleX', 'scaleY', 'resizing'].forEach(function(action) {
      assert.equal(
        canvas._shouldCenterTransform({}, action, true), false,
        action + ' standard action will NOT center scale if canvas.centeredScaling is true and centeredKey is pressed'
      );
    });
    assert.equal(
      canvas._shouldCenterTransform({}, 'rotate', false), false,
      'rotate standard action will NOT center scale if canvas.centeredScaling is true'
    );
    canvas.centeredRotation = true;
    assert.equal(
      canvas._shouldCenterTransform({}, 'rotate', false), true,
      'rotate standard action will center scale if canvas.centeredRotation is true'
    );
  });
})();
