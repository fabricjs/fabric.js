(function() {

  // var emptyImageCanvasData = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAfQAAAH0CAYAAADL1t+KAAAH7ElEQVR4nO3VMQ0AMAzAsPInvYHoMS2yEeTLHADge/M6AADYM3QACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIuMjH4b7osLFBAAAAAElFTkSuQmCC";

  var CANVAS_SVG = '<?xml version="1.0" encoding="UTF-8" standalone="no" ?>\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n' +
                   '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="600" height="600" viewBox="0 0 600 600" xml:space="preserve">\n<desc>Created with Fabric.js ' + fabric.version + '</desc>\n<defs>\n</defs>\n</svg>';

  var CANVAS_SVG_VIEWBOX = '<?xml version="1.0" encoding="UTF-8" standalone="no" ?>\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n' +
                           '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="600" height="600" viewBox="100 100 300 300" xml:space="preserve">\n<desc>Created with Fabric.js ' + fabric.version + '</desc>\n<defs>\n</defs>\n</svg>';

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
                  '13.99], ["z", null]]}], "background": "#ff5555", "overlay":"rgba(0,0,0,0.2)"}';

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

  var PATH_DATALESS_JSON = '{"objects":[{"type":"path","originX":"left","originY":"top","left":100,"top":100,"width":200,"height":200,"fill":"rgb(0,0,0)",' +
                           '"stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,' +
                           '"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,' +
                           '"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","transformMatrix":null,"skewX":0,"skewY":0,"pathOffset":{"x":200,"y":200},"path":"http://example.com/"}]}';

  var RECT_JSON = '{"objects":[{"type":"rect","originX":"left","originY":"top","left":0,"top":0,"width":10,"height":10,"fill":"rgb(0,0,0)",' +
                  '"stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,' +
                  '"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,' +
                  '"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","transformMatrix":null,"skewX":0,"skewY":0,"rx":0,"ry":0}],"background":"#ff5555","overlay":"rgba(0,0,0,0.2)"}';

  var RECT_JSON_WITH_PADDING = '{"objects":[{"type":"rect","originX":"left","originY":"top","left":0,"top":0,"width":10,"height":20,"fill":"rgb(0,0,0)",' +
                               '"stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,' +
                               '"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,' +
                               '"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","transformMatrix":null,"skewX":0,"skewY":0,"rx":0,"ry":0,"padding":123,"foo":"bar"}]}';

  function getAbsolutePath(path) {
    var isAbsolute = /^https?:/.test(path);
    if (isAbsolute) { return path; };
    var imgEl = _createImageElement();
    imgEl.src = path;
    var src = imgEl.src;
    imgEl = null;
    return src;
  }

  var IMG_SRC     = fabric.isLikelyNode ? (__dirname + '/../fixtures/test_image.gif') : getAbsolutePath('../fixtures/test_image.gif'),
      IMG_WIDTH   = 276,
      IMG_HEIGHT  = 110;

  var REFERENCE_IMG_OBJECT = {
    'type':                    'image',
    'originX':                 'left',
    'originY':                 'top',
    'left':                     0,
    'top':                      0,
    'width':                    IMG_WIDTH, // node-canvas doesn't seem to allow setting width/height on image objects
    'height':                   IMG_HEIGHT, // or does it now?
    'fill':                     'rgb(0,0,0)',
    'stroke':                   null,
    'strokeWidth':              0,
    'strokeDashArray':          null,
    'strokeLineCap':            'butt',
    'strokeLineJoin':           'miter',
    'strokeMiterLimit':         10,
    'scaleX':                   1,
    'scaleY':                   1,
    'angle':                    0,
    'flipX':                    false,
    'flipY':                    false,
    'opacity':                  1,
    'src':                      IMG_SRC,
    'shadow':                   null,
    'visible':                  true,
    'backgroundColor':          '',
    'clipTo':                   null,
    'filters':                  [],
    'resizeFilters':            [],
    'fillRule':                 'nonzero',
    'globalCompositeOperation': 'source-over',
    'transformMatrix':          null,
    'crossOrigin':              '',
    'skewX':                    0,
    'skewY':                    0,
    'alignX':                   'none',
    'alignY':                   'none',
    'meetOrSlice':              'meet'
  };

  function _createImageElement() {
    return fabric.isLikelyNode ? new (require('canvas').Image)() : fabric.document.createElement('img');
  }

  function _createImageObject(width, height, callback) {
    var elImage = _createImageElement();
    elImage.width = width;
    elImage.height = height;
    setSrc(elImage, IMG_SRC, function() {
      callback(new fabric.Image(elImage));
    });
  }

  function createImageObject(callback) {
    return _createImageObject(IMG_WIDTH, IMG_HEIGHT, callback);
  }

  function setSrc(img, src, callback) {
    if (fabric.isLikelyNode) {
      require('fs').readFile(src, function(err, imgData) {
        if (err) { throw err; };
        img.src = imgData;
        img._src = src;
        callback && callback();
      });
    }
    else {
      img.src = src;
      callback && callback();
    }
  }

  function fixImageDimension(imgObj) {
    // workaround for node-canvas sometimes producing images with width/height and sometimes not
    if (imgObj.width === 0) {
      imgObj.width = IMG_WIDTH;
    }
    if (imgObj.height === 0) {
      imgObj.height = IMG_HEIGHT;
    }
  }

  // force creation of static canvas
  // TODO: fix this
  var Canvas = fabric.Canvas;
  fabric.Canvas = null;
  var el = fabric.document.createElement('canvas');
  el.width = 600;
  el.height = 600;

  var canvas = this.canvas = fabric.isLikelyNode ? fabric.createCanvasForNode() : new fabric.StaticCanvas(el),
      canvas2 = this.canvas2 = fabric.isLikelyNode ? fabric.createCanvasForNode() : new fabric.StaticCanvas(el);
  fabric.Canvas = Canvas;

  var lowerCanvasEl = canvas.lowerCanvasEl;

  function makeRect(options) {
    var defaultOptions = { width: 10, height: 10 };
    return new fabric.Rect(fabric.util.object.extend(defaultOptions, options || { }));
  }

  QUnit.module('fabric.StaticCanvas', {
    setup: function() {
      canvas.clear();
      canvas.backgroundColor = fabric.StaticCanvas.prototype.backgroundColor;
      canvas.backgroundImage = fabric.StaticCanvas.prototype.backgroundImage;
      canvas.overlayColor = fabric.StaticCanvas.prototype.overlayColor;
      canvas.viewportTransform = [1, 0, 0, 1, 0, 0];
      canvas.calcOffset();
    }
  });

  test('initialProperties', function() {
    ok('backgroundColor' in canvas);
    ok('overlayColor' in canvas);
    ok('backgroundImage' in canvas);
    ok('overlayImage' in canvas);
    ok('clipTo' in canvas);
    ok('includeDefaultValues' in canvas);
    ok('stateful' in canvas);
    ok('renderOnAddRemove' in canvas);
    ok('controlsAboveOverlay' in canvas);
    ok('allowTouchScrolling' in canvas);
    ok('imageSmoothingEnabled' in canvas);
    ok('backgroundVpt' in canvas);
    ok('overlayVpt' in canvas);

    equal(canvas.includeDefaultValues, true);
    equal(canvas.stateful, false);
    equal(canvas.renderOnAddRemove, true);
    equal(canvas.controlsAboveOverlay, false);
    equal(canvas.allowTouchScrolling, false);
    equal(canvas.imageSmoothingEnabled, true);
    equal(canvas.backgroundVpt, true);
    equal(canvas.overlayVpt, true);

    notStrictEqual(canvas.viewportTransform, canvas2.viewportTransform);
  });

  test('getObjects', function() {
    ok(typeof canvas.getObjects == 'function', 'should respond to `getObjects` method');
    deepEqual([], canvas.getObjects(), 'should return empty array for `getObjects` when empty');
    equal(canvas.getObjects().length, 0, 'should have a 0 length when empty');
  });

  test('getObjects with type', function() {

    var rect = new fabric.Rect({ width: 10, height: 20 });
    var circle = new fabric.Circle({ radius: 30 });

    canvas.add(rect, circle);

    equal(canvas.getObjects().length, 2, 'should have length=2 initially');

    deepEqual(canvas.getObjects('rect'), [rect], 'should return rect only');
    deepEqual(canvas.getObjects('circle'), [circle], 'should return circle only');
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

  test('add renderOnAddRemove disabled', function() {
    var rect = makeRect(),
        originalRenderOnAddition,
        renderAllCount = 0;

    function countRenderAll() {
      renderAllCount++;
    }

    originalRenderOnAddition = canvas.renderOnAddRemove;
    canvas.renderOnAddRemove = false;

    canvas.on('after:render', countRenderAll);

    equal(canvas.add(rect), canvas, 'should be chainable');
    equal(renderAllCount, 0);

    equal(canvas.item(0), rect);

    canvas.add(makeRect(), makeRect(), makeRect());
    equal(canvas.getObjects().length, 4, 'should support multiple arguments');
    equal(renderAllCount, 0);

    canvas.renderAll();
    equal(renderAllCount, 1);

    canvas.off('after:render', countRenderAll);
    canvas.renderOnAddRemove = originalRenderOnAddition;
  });

  test('object:added', function() {
    var objectsAdded = [];

    canvas.on('object:added', function(e) {
      objectsAdded.push(e.target);
    });

    var rect = new fabric.Rect({ width: 10, height: 20 });
    canvas.add(rect);

    deepEqual(objectsAdded[0], rect);

    var circle1 = new fabric.Circle(),
        circle2 = new fabric.Circle();

    canvas.add(circle1, circle2);

    strictEqual(objectsAdded[1], circle1);
    strictEqual(objectsAdded[2], circle2);

    var circle3 = new fabric.Circle();
    canvas.insertAt(circle3, 2);

    strictEqual(objectsAdded[3], circle3);
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

  test('insertAt renderOnAddRemove disabled', function() {
    var rect1 = makeRect(),
        rect2 = makeRect(),
        originalRenderOnAddition,
        renderAllCount = 0;

    function countRenderAll() {
      renderAllCount++;
    }

    originalRenderOnAddition = canvas.renderOnAddRemove;
    canvas.renderOnAddRemove = false;

    canvas.on('after:render', countRenderAll);

    canvas.add(rect1, rect2);
    equal(renderAllCount, 0);

    var rect = makeRect();

    canvas.insertAt(rect, 1);
    equal(renderAllCount, 0);

    strictEqual(canvas.item(1), rect);
    canvas.insertAt(rect, 2);
    equal(renderAllCount, 0);

    canvas.renderAll();
    equal(renderAllCount, 1);

    canvas.off('after:render', countRenderAll);
    canvas.renderOnAddRemove = originalRenderOnAddition;
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

  test('remove renderOnAddRemove disabled', function() {
    var rect1 = makeRect(),
        rect2 = makeRect(),
        originalRenderOnAddition,
        renderAllCount = 0;

    function countRenderAll() {
      renderAllCount++;
    }

    originalRenderOnAddition = canvas.renderOnAddRemove;
    canvas.renderOnAddRemove = false;

    canvas.on('after:render', countRenderAll);

    canvas.add(rect1, rect2);
    equal(renderAllCount, 0);

    equal(canvas.remove(rect1), canvas, 'should be chainable');
    equal(renderAllCount, 0);
    strictEqual(canvas.item(0), rect2, 'only second object should be left');

    canvas.renderAll();
    equal(renderAllCount, 1);

    canvas.off('after:render', countRenderAll);
    canvas.renderOnAddRemove = originalRenderOnAddition;
  });

  test('object:removed', function() {
    var objectsRemoved = [];

    canvas.on('object:removed', function(e) {
      objectsRemoved.push(e.target);
    });

    var rect = new fabric.Rect({ width: 10, height: 20 }),
        circle1 = new fabric.Circle(),
        circle2 = new fabric.Circle();

    canvas.add(rect, circle1, circle2);

    strictEqual(canvas.item(0), rect);
    strictEqual(canvas.item(1), circle1);
    strictEqual(canvas.item(2), circle2);

    canvas.remove(rect);
    strictEqual(objectsRemoved[0], rect);

    canvas.remove(circle1, circle2);
    strictEqual(objectsRemoved[1], circle1);
    strictEqual(objectsRemoved[2], circle2);

    equal(canvas.isEmpty(), true, 'canvas should be empty');
  });

  test('clearContext', function() {
    ok(typeof canvas.clearContext == 'function');
    equal(canvas.clearContext(canvas.contextContainer), canvas, 'should be chainable');
  });

  test('clear', function() {
    ok(typeof canvas.clear == 'function');
    var bg = new fabric.Rect({ width: 10, height: 20 });
    canvas.backgroundColor = '#FF0000';
    canvas.overlayColor = '#FF0000';
    canvas.backgroundImage = bg;
    canvas.overlayImage = bg;
    equal(canvas.clear(), canvas, 'should be chainable');
    equal(canvas.getObjects().length, 0, 'clear remove all objects');
    equal(canvas.backgroundColor, '', 'clear remove background color');
    equal(canvas.overlayColor, '', 'clear remove overlay color');
    equal(canvas.backgroundImage, null, 'clear remove bg image');
    equal(canvas.overlayImage, null, 'clear remove overlay image');
  });

  test('renderAll', function() {
    ok(typeof canvas.renderAll == 'function');
    equal(canvas, canvas.renderAll());
  });

  test('toDataURL', function() {
    ok(typeof canvas.toDataURL == 'function');
    if (!fabric.Canvas.supports('toDataURL')) {
      window.alert('toDataURL is not supported by this environment. Some of the tests can not be run.');
    }
    else {
      var rect = new fabric.Rect({width: 100, height: 100, fill: 'red', top: 0, left: 0});
      canvas.add(rect);
      var dataURL = canvas.toDataURL();
      // don't compare actual data url, as it is often browser-dependent
      // this.assertIdentical(emptyImageCanvasData, canvas.toDataURL('png'));
      equal(typeof dataURL, 'string');
      equal(dataURL.substring(0, 21), 'data:image/png;base64');
      //we can just compare that the dataUrl generated differs from the dataURl of an empty canvas.
      equal(dataURL.substring(200, 210) != 'AAAAAAAAAA', true);
    }
  });

  test('toDataURL jpg', function() {
    if (!fabric.Canvas.supports('toDataURL')) {
      window.alert('toDataURL is not supported by this environment. Some of the tests can not be run.');
    }
    else {
      try {
        var dataURL = canvas.toDataURL({ format: 'jpg' });
        equal(dataURL.substring(0, 22), 'data:image/jpeg;base64');
      }
      // node-canvas does not support jpeg data urls
      catch (err) {
        ok(true);
      }
    }
  });

  test('toDataURL cropping', function() {
    ok(typeof canvas.toDataURL == 'function');
    if (!fabric.Canvas.supports('toDataURL')) {
      window.alert('toDataURL is not supported by this environment. Some of the tests can not be run.');
    }
    else {
      var croppingWidth = 75,
          croppingHeight = 50,
          dataURL = canvas.toDataURL({width: croppingWidth, height: croppingHeight});

      fabric.Image.fromURL(dataURL, function (img) {
        equal(img.width, croppingWidth, 'Width of exported image should correspond to cropping width');
        equal(img.height, croppingHeight, 'Height of exported image should correspond to cropping height');
      });
    }
  });

  test('centerObjectH', function() {
    ok(typeof canvas.centerObjectH == 'function');
    var rect = makeRect({ left: 102, top: 202 });
    canvas.add(rect);
    equal(canvas.centerObjectH(rect), canvas, 'should be chainable');
    equal(rect.getCenterPoint().x, canvas.width / 2, 'object\'s "center.y" property should correspond to canvas element\'s center');
    canvas.setZoom(4);
    equal(rect.getCenterPoint().x, canvas.height / 2, 'object\'s "center.x" property should correspond to canvas element\'s center when canvas is transformed');
    canvas.setZoom(1);
  });

  test('centerObjectV', function() {
    ok(typeof canvas.centerObjectV == 'function');
    var rect = makeRect({ left: 102, top: 202 });
    canvas.add(rect);
    equal(canvas.centerObjectV(rect), canvas, 'should be chainable');
    equal(rect.getCenterPoint().y, canvas.height / 2, 'object\'s "center.y" property should correspond to canvas element\'s center');
    canvas.setZoom(2);
    equal(rect.getCenterPoint().y, canvas.height / 2, 'object\'s "center.y" property should correspond to canvas element\'s center when canvas is transformed');

  });

  test('centerObject', function() {
    ok(typeof canvas.centerObject == 'function');
    var rect = makeRect({ left: 102, top: 202 });
    canvas.add(rect);
    equal(canvas.centerObject(rect), canvas, 'should be chainable');

    equal(rect.getCenterPoint().y, canvas.height / 2, 'object\'s "center.y" property should correspond to canvas element\'s center');
    equal(rect.getCenterPoint().x, canvas.height / 2, 'object\'s "center.x" property should correspond to canvas element\'s center');
    canvas.setZoom(4);
    equal(rect.getCenterPoint().y, canvas.height / 2, 'object\'s "center.y" property should correspond to canvas element\'s center when canvas is transformed');
    equal(rect.getCenterPoint().x, canvas.height / 2, 'object\'s "center.x" property should correspond to canvas element\'s center when canvas is transformed');
    canvas.setZoom(1);
  });

  test('viewportCenterObjectH', function() {
    ok(typeof canvas.viewportCenterObjectH == 'function');
    var rect = makeRect({ left: 102, top: 202 }), pan = 10;
    canvas.viewportTransform = [1, 0, 0, 1, 0, 0];
    canvas.add(rect);
    var oldY = rect.top;
    equal(canvas.viewportCenterObjectH(rect), canvas, 'should be chainable');
    equal(rect.getCenterPoint().x, canvas.width / 2, 'object\'s "center.x" property should correspond to canvas element\'s center when canvas is not transformed');
    equal(rect.top, oldY, 'object\'s "top" should not change');
    canvas.setZoom(2);
    canvas.viewportCenterObjectH(rect);
    equal(rect.getCenterPoint().x, canvas.width / (2 * canvas.getZoom()), 'object\'s "center.x" property should correspond to viewport center');
    equal(rect.top, oldY, 'object\'s "top" should not change');
    canvas.absolutePan({x: pan, y: pan});
    canvas.viewportCenterObjectH(rect);
    equal(rect.getCenterPoint().x, (canvas.width / 2 + pan) / canvas.getZoom(), 'object\'s "center.x" property should correspond to viewport center');
    equal(rect.top, oldY, 'object\'s "top" should not change');
  });

  test('viewportCenterObjectV', function() {
    ok(typeof canvas.viewportCenterObjectV == 'function');
    var rect = makeRect({ left: 102, top: 202 }), pan = 10;
    canvas.viewportTransform = [1, 0, 0, 1, 0, 0];
    canvas.add(rect);
    var oldX = rect.left;
    equal(canvas.viewportCenterObjectV(rect), canvas, 'should be chainable');
    equal(rect.getCenterPoint().y, canvas.height / 2, 'object\'s "center.y" property should correspond to canvas element\'s center when canvas is not transformed');
    equal(rect.left, oldX, 'x position did not change');
    canvas.setZoom(2);
    canvas.viewportCenterObjectV(rect);
    equal(rect.getCenterPoint().y, canvas.height / (2 * canvas.getZoom()), 'object\'s "center.y" property should correspond to viewport center');
    equal(rect.left, oldX, 'x position did not change');
    canvas.absolutePan({x: pan, y: pan});
    canvas.viewportCenterObjectV(rect);
    equal(rect.getCenterPoint().y, (canvas.height / 2 + pan) / canvas.getZoom(), 'object\'s "top" property should correspond to viewport center');
    equal(rect.left, oldX, 'x position did not change');
  });

  test('viewportCenterObject', function() {
    ok(typeof canvas.viewportCenterObject == 'function');
    var rect = makeRect({ left: 102, top: 202 }), pan = 10;
    canvas.viewportTransform = [1, 0, 0, 1, 0, 0];
    canvas.add(rect);
    equal(canvas.viewportCenterObject(rect), canvas, 'should be chainable');
    equal(rect.getCenterPoint().y, canvas.height / 2, 'object\'s "center.y" property should correspond to canvas element\'s center when canvas is not transformed');
    equal(rect.getCenterPoint().x, canvas.width / 2, 'object\'s "center.x" property should correspond to canvas element\'s center when canvas is not transformed');

    canvas.setZoom(2);
    canvas.viewportCenterObject(rect);
    equal(rect.getCenterPoint().y, canvas.height / (2 * canvas.getZoom()), 'object\'s "center.y" property should correspond to viewport center');
    equal(rect.getCenterPoint().x, canvas.width / (2 * canvas.getZoom()), 'object\'s "center.x" property should correspond to viewport center');

    canvas.absolutePan({x: pan, y: pan});
    canvas.viewportCenterObject(rect);
    equal(rect.getCenterPoint().y, (canvas.height / 2 + pan) / canvas.getZoom(), 'object\'s "center.y" property should correspond to viewport center');
    equal(rect.getCenterPoint().x, (canvas.width / 2 + pan) / canvas.getZoom(), 'object\'s "center.x" property should correspond to viewport center');
    canvas.viewportTransform = [1, 0, 0, 1, 0, 0];
  });

  test('straightenObject', function() {
    ok(typeof canvas.straightenObject == 'function');
    var rect = makeRect({ angle: 10 });
    canvas.add(rect);
    equal(canvas.straightenObject(rect), canvas, 'should be chainable');
    equal(rect.getAngle(), 0, 'angle should be coerced to 0 (from 10)');

    rect.setAngle('60');
    canvas.straightenObject(rect);
    equal(rect.getAngle(), 90, 'angle should be coerced to 90 (from 60)');

    rect.setAngle('100');
    canvas.straightenObject(rect);
    equal(rect.getAngle(), 90, 'angle should be coerced to 90 (from 100)');
  });

  test('toSVG', function() {
    ok(typeof canvas.toSVG == 'function');
    canvas.clear();
    canvas.viewportTransform = [1, 0, 0, 1, 0, 0];
    var svg = canvas.toSVG();
    equal(svg, CANVAS_SVG);
  });

  test('toSVG with different encoding (ISO-8859-1)', function() {
    ok(typeof canvas.toSVG == 'function');
    canvas.clear();
    canvas.viewportTransform = [1, 0, 0, 1, 0, 0];
    var svg = canvas.toSVG({encoding: 'ISO-8859-1'});
    var svgDefaultEncoding = canvas.toSVG();
    ok(svg != svgDefaultEncoding);
    equal(svg, CANVAS_SVG.replace('encoding="UTF-8"', 'encoding="ISO-8859-1"'));
  });

  test('toSVG without preamble', function() {
    ok(typeof canvas.toSVG == 'function');
    var withPreamble = canvas.toSVG();
    var withoutPreamble = canvas.toSVG({suppressPreamble: true});
    ok(withPreamble != withoutPreamble);
    equal(withoutPreamble.slice(0, 4), '<svg', 'svg should start with root node when premable is suppressed');
  });

  test('toSVG with viewBox', function() {
    ok(typeof canvas.toSVG == 'function');
    canvas.clear();

    var svg = canvas.toSVG({viewBox: {x: 100, y: 100, width: 300, height: 300}});
    equal(svg, CANVAS_SVG_VIEWBOX);
  });

  test('toSVG with reviver', function() {
    ok(typeof canvas.toSVG == 'function');
    canvas.clear();

    var circle = new fabric.Circle(),
        rect = new fabric.Rect(),
        path1 = new fabric.Path('M 100 100 L 300 100 L 200 300 z'),
        tria = new fabric.Triangle(),
        polygon = new fabric.Polygon([{x: 10, y: 12},{x: 20, y: 22}]),
        polyline = new fabric.Polyline([{x: 10, y: 12},{x: 20, y: 22}]),
        line = new fabric.Line(),
        text = new fabric.Text('Text'),
        group = new fabric.Group([text, line]),
        ellipse = new fabric.Ellipse(),
        image = new fabric.Image({width: 0, height: 0}),
        path2 = new fabric.Path('M 0 0 L 200 100 L 200 300 z'),
        path3 = new fabric.Path('M 50 50 L 100 300 L 400 400 z'),
        pathGroup = new fabric.PathGroup([path2, path3]);

    canvas.renderOnAddRemove = false;
    canvas.add(circle, rect, path1, tria, polygon, polyline, group, ellipse, image, pathGroup);

    var reviverCount = 0,
        len = canvas.size() + group.size() + pathGroup.paths.length;

    function reviver(svg) {
      reviverCount++;
      return svg;
    }

    canvas.toSVG(null, reviver);
    equal(reviverCount, len);

    canvas.renderOnAddRemove = true;
  });

  test('toSVG with reviver', function() {
    ok(typeof canvas.toSVG == 'function');
    canvas.clear();

    var circle = new fabric.Circle(),
        rect = new fabric.Rect(),
        path1 = new fabric.Path('M 100 100 L 300 100 L 200 300 z'),
        tria = new fabric.Triangle(),
        polygon = new fabric.Polygon([{x: 10, y: 12},{x: 20, y: 22}]),
        polyline = new fabric.Polyline([{x: 10, y: 12},{x: 20, y: 22}]),
        line = new fabric.Line(),
        text = new fabric.Text('Text'),
        group = new fabric.Group([text, line]),
        ellipse = new fabric.Ellipse(),
        image = new fabric.Image({width: 0, height: 0}),
        imageBG = new fabric.Image({width: 0, height: 0}),
        imageOL = new fabric.Image({width: 0, height: 0}),
        path2 = new fabric.Path('M 0 0 L 200 100 L 200 300 z'),
        path3 = new fabric.Path('M 50 50 L 100 300 L 400 400 z'),
        pathGroup = new fabric.PathGroup([path2, path3]);

    canvas.renderOnAddRemove = false;
    canvas.add(circle, rect, path1, tria, polygon, polyline, group, ellipse, image, pathGroup);
    canvas.setBackgroundImage(imageBG);
    canvas.setOverlayImage(imageOL);
    var reviverCount = 0,
        len = canvas.size() + group.size() + pathGroup.paths.length;

    function reviver(svg) {
      reviverCount++;
      return svg;
    }

    canvas.toSVG(null, reviver);
    equal(reviverCount, len + 2, 'reviver should include background and overlay image');
    canvas.setBackgroundImage(null);
    canvas.setOverlayImage(null);
    canvas.renderOnAddRemove = true;
  });

  test('toSVG with exclude from export', function() {
    ok(typeof canvas.toSVG == 'function');
    canvas.clear();

    var circle = new fabric.Circle({excludeFromExport: true}),
        rect = new fabric.Rect({excludeFromExport: true}),
        path1 = new fabric.Path('M 100 100 L 300 100 L 200 300 z'),
        tria = new fabric.Triangle(),
        polygon = new fabric.Polygon([{x: 10, y: 12},{x: 20, y: 22}]),
        polyline = new fabric.Polyline([{x: 10, y: 12},{x: 20, y: 22}]),
        line = new fabric.Line(),
        text = new fabric.Text('Text'),
        group = new fabric.Group([text, line]),
        ellipse = new fabric.Ellipse(),
        image = new fabric.Image({width: 0, height: 0}),
        path2 = new fabric.Path('M 0 0 L 200 100 L 200 300 z'),
        path3 = new fabric.Path('M 50 50 L 100 300 L 400 400 z'),
        pathGroup = new fabric.PathGroup([path2, path3]);

    canvas.renderOnAddRemove = false;
    canvas.add(circle, rect, path1, tria, polygon, polyline, group, ellipse, image, pathGroup);
    var reviverCount = 0,
        len = canvas.size() + group.size() + pathGroup.paths.length;

    function reviver(svg) {
      reviverCount++;
      return svg;
    }

    canvas.toSVG(null, reviver);
    equal(reviverCount, len - 2, 'reviver should not include objects with excludeFromExport');
    canvas.renderOnAddRemove = true;
  });

  test('toJSON', function() {
    ok(typeof canvas.toJSON == 'function');
    equal(JSON.stringify(canvas.toJSON()), '{"objects":[]}');
    canvas.backgroundColor = '#ff5555';
    canvas.overlayColor = 'rgba(0,0,0,0.2)';
    equal(JSON.stringify(canvas.toJSON()), '{"objects":[],"background":"#ff5555","overlay":"rgba(0,0,0,0.2)"}', '`background` and `overlay` value should be reflected in json');
    canvas.add(makeRect());
    deepEqual(JSON.stringify(canvas.toJSON()), RECT_JSON);
  });

  test('toJSON custom properties non-existence check', function() {
    var rect = new fabric.Rect({ width: 10, height: 20 });
    rect.padding = 123;
    canvas.add(rect);
    rect.foo = 'bar';

    canvas.bar = 456;

    var data = canvas.toJSON(['padding', 'foo', 'bar', 'baz']);
    ok('padding' in data.objects[0]);
    ok('foo' in data.objects[0], 'foo shouldn\'t be included if it\'s not in an object');
    ok(!('bar' in data.objects[0]), 'bar shouldn\'t be included if it\'s not in an object');
    ok(!('baz' in data.objects[0]), 'bar shouldn\'t be included if it\'s not in an object');
    ok(!('foo' in data));
    ok(!('baz' in data));
    ok('bar' in data);
  });

  asyncTest('toJSON backgroundImage', function() {
    createImageObject(function(image) {

      canvas.backgroundImage = image;

      var json = canvas.toJSON();

      fixImageDimension(json.backgroundImage);
      deepEqual(json.backgroundImage, REFERENCE_IMG_OBJECT);

      canvas.backgroundImage = null;

      start();
    });
  });

  asyncTest('toJSON backgroundImage with custom props', function() {
    createImageObject(function(image) {
      canvas.backgroundImage = image;
      image.custom = 'yes';
      var json = canvas.toJSON(['custom']);
      equal(json.backgroundImage.custom, 'yes');
      canvas.backgroundImage = null;
      start();
    });
  });

  asyncTest('toJSON overlayImage', function() {
    createImageObject(function(image) {

      canvas.overlayImage = image;

      var json = canvas.toJSON();

      fixImageDimension(json.overlayImage);
      deepEqual(json.overlayImage, REFERENCE_IMG_OBJECT);

      canvas.overlayImage = null;

      start();
    });
  });

  asyncTest('toJSON overlayImage with custom props', function() {
    createImageObject(function(image) {
      canvas.overlayImage = image;
      image.custom = 'yes';
      var json = canvas.toJSON(['custom']);
      equal(json.overlayImage.custom, 'yes');
      canvas.overlayImage = null;
      start();
    });
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

  test('toObject non includeDefaultValues', function() {
    canvas.includeDefaultValues = false;
    var rect = makeRect();
    canvas.add(rect);
    var cObject = canvas.toObject();
    var expectedRect = { type: 'rect', width: 10, height: 10 };
    deepEqual(cObject.objects[0], expectedRect, 'Rect should be exported withoud defaults');
    canvas.includeDefaultValues = true;
  });

  test('toObject excludeFromExport', function() {
    var rect = makeRect(), rect2 = makeRect(), rect3 = makeRect();
    canvas.clear();
    canvas.add(rect, rect2, rect3);
    equal(canvas.toObject().objects.length, 3, 'all objects get exported');
    rect.excludeFromExport = true;
    rect2.excludeFromExport = true;
    equal(canvas.toObject().objects.length, 1, 'only one object gets exported');
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

  test('toObject with additional properties', function() {

    canvas.freeDrawingColor = 'red';
    canvas.foobar = 123;

    var expectedObject = {
      objects: canvas.getObjects(),
      freeDrawingColor: 'red',
      foobar: 123
    };
    deepEqual(expectedObject, canvas.toObject(['freeDrawingColor', 'foobar']));

    var rect = makeRect();
    canvas.add(rect);

    ok(!('rotatingPointOffset' in canvas.toObject(['smthelse']).objects[0]));
    ok('rotatingPointOffset' in canvas.toObject(['rotatingPointOffset']).objects[0]);
  });

  test('isEmpty', function() {
    ok(typeof canvas.isEmpty == 'function');
    ok(canvas.isEmpty());
    canvas.add(makeRect());
    ok(!canvas.isEmpty());
  });

  asyncTest('loadFromJSON with json string staticCanvas', function() {
    ok(typeof canvas.loadFromJSON == 'function');

    canvas.loadFromJSON(PATH_JSON, function(){
      var obj = canvas.item(0);

      ok(!canvas.isEmpty(), 'canvas is not empty');
      equal(obj.type, 'path', 'first object is a path object');
      equal(canvas.backgroundColor, '#ff5555', 'backgroundColor is populated properly');

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
    ok(typeof canvas.loadFromJSON == 'function');

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
    ok(typeof canvas.loadFromJSON == 'function');

    canvas.loadFromJSON(JSON.parse(PATH_WITHOUT_DEFAULTS_JSON), function(){
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

  asyncTest('loadFromJSON with image background and color', function() {
    var serialized = JSON.parse(PATH_JSON);
    serialized.background = 'green';
    serialized.backgroundImage = JSON.parse('{"type":"image","originX":"left","originY":"top","left":13.6,"top":-1.4,"width":3000,"height":3351,"fill":"rgb(0,0,0)","stroke":null,"strokeWidth":0,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":0.05,"scaleY":0.05,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","transformMatrix":null,"skewX":0,"skewY":0,"src":"' + IMG_SRC + '","filters":[],"crossOrigin":"","alignX":"none","alignY":"none","meetOrSlice":"meet"}');
    canvas.loadFromJSON(serialized, function() {
      ok(!canvas.isEmpty(), 'canvas is not empty');
      equal(canvas.backgroundColor, 'green');
      ok(canvas.backgroundImage instanceof fabric.Image);
      start();
    });
  });

  asyncTest('loadFromJSON custom properties', function() {
    var rect = new fabric.Rect({ width: 10, height: 20 });
    rect.padding = 123;
    rect.foo = 'bar';

    canvas.add(rect);

    var jsonWithoutFoo = JSON.stringify(canvas.toJSON(['padding']));
    var jsonWithFoo = JSON.stringify(canvas.toJSON(['padding', 'foo']));

    equal(jsonWithFoo, RECT_JSON_WITH_PADDING);
    ok(jsonWithoutFoo !== RECT_JSON_WITH_PADDING);

    canvas.clear();
    canvas.loadFromJSON(jsonWithFoo, function() {
      var obj = canvas.item(0);

      equal(obj.padding, 123, 'padding on object is set properly');
      equal(obj.foo, 'bar', '"foo" property on object is set properly');
      start();
    });
  });

  asyncTest('loadFromJSON with text', function() {
    var json = '{"objects":[{"type":"text","left":150,"top":200,"width":128,"height":64.32,"fill":"#000000","stroke":"","strokeWidth":"","scaleX":0.8,"scaleY":0.8,"angle":0,"flipX":false,"flipY":false,"opacity":1,"text":"NAME HERE","fontSize":24,"fontWeight":"","fontFamily":"Delicious_500","fontStyle":"","lineHeight":"","textDecoration":"","textAlign":"center","path":"","strokeStyle":"","backgroundColor":""}],"background":"#ffffff"}';
    canvas.loadFromJSON(json, function() {

      canvas.renderAll();

      equal('text', canvas.item(0).type);
      equal(150, canvas.item(0).left);
      equal(200, canvas.item(0).top);
      equal('NAME HERE', canvas.item(0).text);

      start();
    });
  });

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

  test('moveTo', function() {
    ok(typeof canvas.moveTo == 'function');

    var rect1 = makeRect(),
        rect2 = makeRect(),
        rect3 = makeRect();

    canvas.add(rect1, rect2, rect3);

    // [ 1, 2, 3 ]
    equal(canvas.item(0), rect1);
    equal(canvas.item(1), rect2);
    equal(canvas.item(2), rect3);

    canvas.moveTo(rect3, 0);

    // moved 3 to level 0 — [3, 1, 2]
    equal(canvas.item(1), rect1);
    equal(canvas.item(2), rect2);
    equal(canvas.item(0), rect3);

    canvas.moveTo(rect3, 1);

    // moved 3 to level 1 — [1, 3, 2]
    equal(canvas.item(0), rect1);
    equal(canvas.item(2), rect2);
    equal(canvas.item(1), rect3);

    canvas.moveTo(rect3, 2);

    // moved 3 to level 2 — [1, 2, 3]
    equal(canvas.item(0), rect1);
    equal(canvas.item(1), rect2);
    equal(canvas.item(2), rect3);

    canvas.moveTo(rect3, 2);

    // moved 3 to same level 2 and so doesn't change position — [1, 2, 3]
    equal(canvas.item(0), rect1);
    equal(canvas.item(1), rect2);
    equal(canvas.item(2), rect3);

    canvas.moveTo(rect2, 0);

    // moved 2 to level 0 — [2, 1, 3]
    equal(canvas.item(1), rect1);
    equal(canvas.item(0), rect2);
    equal(canvas.item(2), rect3);

    canvas.moveTo(rect2, 2);

    // moved 2 to level 2 — [1, 3, 2]
    equal(canvas.item(0), rect1);
    equal(canvas.item(2), rect2);
    equal(canvas.item(1), rect3);
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

  test('dispose', function() {
    ok(typeof canvas.dispose == 'function');
    canvas.add(makeRect(), makeRect(), makeRect());
    canvas.dispose();
    equal(canvas.getObjects().length, 0, 'dispose should clear canvas');
  });

  test('clone', function() {
    ok(typeof canvas.clone == 'function');
    // TODO (kangax): test clone
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
    equal(canvas.getWidth(), 123, 'Should be as the none css only value');
  });

  test('setHeight css only', function() {
    canvas.setHeight(123);
    canvas.setHeight('100%', { cssOnly: true });

    equal(canvas.lowerCanvasEl.style.height, '100%', 'Should be as the css only value');
    equal(canvas.getWidth(), 123, 'Should be as the none css only value');
  });

  test('setWidth backstore only', function() {
    canvas.setWidth(123);
    canvas.setWidth(500, { backstoreOnly: true });

    equal(canvas.lowerCanvasEl.style.width, 123 + 'px', 'Should be as none backstore only value + "px"');
    equal(canvas.getWidth(), 500, 'Should be as the backstore only value');
  });

  test('setHeight backstore only', function() {
    canvas.setHeight(123);
    canvas.setHeight(500, { backstoreOnly: true });

    equal(canvas.lowerCanvasEl.style.height, 123 + 'px', 'Should be as none backstore only value + "px"');
    equal(canvas.getHeight(), 500, 'Should be as the backstore only value');
  });

  asyncTest('fxRemove', function() {
    ok(typeof canvas.fxRemove == 'function');

    var rect = new fabric.Rect();
    canvas.add(rect);

    var callbackFired = false;
    function onComplete(){
      callbackFired = true;
    }

    ok(canvas.item(0) === rect);
    equal(canvas.fxRemove(rect, { onComplete: onComplete }), canvas, 'should be chainable');

    setTimeout(function() {
      equal(canvas.item(0), undefined);
      ok(callbackFired);
      start();
    }, 1000);
  });

  asyncTest('options in setBackgroundImage from URL', function() {
    canvas.setBackgroundImage(IMG_SRC, function() {
      equal(canvas.backgroundImage.left, 50);
      equal(canvas.backgroundImage.originX, 'right');

      start();
    }, {
      left: 50,
      originX: 'right'
    });
  });

  test('setViewportTransform', function() {
    ok(typeof canvas.setViewportTransform == 'function');
    var vpt = [2, 0, 0, 2, 50, 50];
    canvas.viewportTransform = fabric.StaticCanvas.prototype.viewportTransform;
    deepEqual(canvas.viewportTransform, [1, 0, 0, 1, 0, 0], 'initial viewport is identity matrix');
    canvas.setViewportTransform(vpt);
    deepEqual(canvas.viewportTransform, vpt, 'viewport now is the set one');
    canvas.viewportTransform = fabric.StaticCanvas.prototype.viewportTransform;
  });

  test('getZoom', function() {
    ok(typeof canvas.getZoom == 'function');
    var vpt = [2, 0, 0, 2, 50, 50];
    canvas.viewportTransform = fabric.StaticCanvas.prototype.viewportTransform;
    deepEqual(canvas.getZoom(), 1, 'initial zoom is 1');
    canvas.setViewportTransform(vpt);
    deepEqual(canvas.getZoom(), 2, 'zoom is set to 2');
    canvas.viewportTransform = fabric.StaticCanvas.prototype.viewportTransform;
  });

  test('setZoom', function() {
    ok(typeof canvas.setZoom == 'function');
    deepEqual(canvas.getZoom(), 1, 'initial zoom is 1');
    canvas.setZoom(2);
    deepEqual(canvas.getZoom(), 2, 'zoom is set to 2');
    canvas.viewportTransform = fabric.StaticCanvas.prototype.viewportTransform;
  });

  test('zoomToPoint', function() {
    ok(typeof canvas.zoomToPoint == 'function');
    deepEqual(canvas.viewportTransform, [1, 0, 0, 1, 0, 0], 'initial viewport is identity matrix');
    var point = new fabric.Point(50, 50);
    canvas.zoomToPoint(point, 1);
    deepEqual(canvas.viewportTransform, [1, 0, 0, 1, 0, 0], 'viewport has no changes if not moving with zoom level');
    canvas.zoomToPoint(point, 2);
    deepEqual(canvas.viewportTransform, [2, 0, 0, 2, -50, -50], 'viewport has a translation effect and zoom');
    canvas.zoomToPoint(point, 3);
    deepEqual(canvas.viewportTransform, [3, 0, 0, 3, -100, -100], 'viewport has a translation effect and zoom');
    canvas.viewportTransform = fabric.StaticCanvas.prototype.viewportTransform;
  });

  test('absolutePan', function() {
    ok(typeof canvas.absolutePan == 'function');
    deepEqual(canvas.viewportTransform, [1, 0, 0, 1, 0, 0], 'initial viewport is identity matrix');
    var point = new fabric.Point(50, 50);
    canvas.absolutePan(point);
    deepEqual(canvas.viewportTransform, [1, 0, 0, 1, -point.x, -point.y], 'viewport has translation effect applied');
    canvas.absolutePan(point);
    deepEqual(canvas.viewportTransform, [1, 0, 0, 1, -point.x, -point.y], 'viewport has same translation effect applied');
    canvas.viewportTransform = fabric.StaticCanvas.prototype.viewportTransform;
  });

  test('relativePan', function() {
    ok(typeof canvas.relativePan === 'function');
    deepEqual(canvas.viewportTransform, [1, 0, 0, 1, 0, 0], 'initial viewport is identity matrix');
    var point = new fabric.Point(-50, -50);
    canvas.relativePan(point);
    deepEqual(canvas.viewportTransform, [1, 0, 0, 1, -50, -50], 'viewport has translation effect applied');
    canvas.relativePan(point);
    deepEqual(canvas.viewportTransform, [1, 0, 0, 1, -100, -100], 'viewport has translation effect applied on top of old one');
    canvas.viewportTransform = fabric.StaticCanvas.prototype.viewportTransform;
  });

  test('getContext', function() {
    ok(typeof canvas.getContext === 'function');
    var context = canvas.getContext();
    equal(context, canvas.contextContainer, 'should return the context container');
  });

  test('calcViewportBoundaries', function() {
    ok(typeof canvas.calcViewportBoundaries === 'function');
    canvas.calcViewportBoundaries();
    deepEqual(canvas.vptCoords.tl, new fabric.Point(0, 0), 'tl is 0,0');
    deepEqual(canvas.vptCoords.tr, new fabric.Point(canvas.getWidth(), 0), 'tr is width, 0');
    deepEqual(canvas.vptCoords.bl, new fabric.Point(0, canvas.getHeight()), 'bl is 0, height');
    deepEqual(canvas.vptCoords.br, new fabric.Point(canvas.getWidth(), canvas.getHeight()), 'tl is width, height');
  });

  test('calcViewportBoundaries with zoom', function() {
    ok(typeof canvas.calcViewportBoundaries === 'function');
    canvas.setViewportTransform([2, 0, 0, 2, 0, 0]);
    deepEqual(canvas.vptCoords.tl, new fabric.Point(0, 0), 'tl is 0,0');
    deepEqual(canvas.vptCoords.tr, new fabric.Point(canvas.getWidth() / 2, 0), 'tl is 0,0');
    deepEqual(canvas.vptCoords.bl, new fabric.Point(0, canvas.getHeight() / 2), 'tl is 0,0');
    deepEqual(canvas.vptCoords.br, new fabric.Point(canvas.getWidth() / 2, canvas.getHeight() / 2), 'tl is 0,0');
  });

  test('calcViewportBoundaries with zoom and translation', function() {
    ok(typeof canvas.calcViewportBoundaries === 'function');
    canvas.setViewportTransform([2, 0, 0, 2, -60, 60]);
    deepEqual(canvas.vptCoords.tl, new fabric.Point(30, -30), 'tl is 0,0');
    deepEqual(canvas.vptCoords.tr, new fabric.Point(30 + canvas.getWidth() / 2, -30), 'tl is 0,0');
    deepEqual(canvas.vptCoords.bl, new fabric.Point(30, canvas.getHeight() / 2 - 30), 'tl is 0,0');
    deepEqual(canvas.vptCoords.br, new fabric.Point(30 + canvas.getWidth() / 2, canvas.getHeight() / 2 - 30), 'tl is 0,0');
  });

  //how to test with an exception?
  /*asyncTest('options in setBackgroundImage from invalid URL', function() {
    canvas.backgroundImage = null;
    canvas.setBackgroundImage(IMG_SRC + '_not_exist', function() {
      equal(canvas.backgroundImage, null);
      start();
    }, {
      left: 50,
      originX: 'right'
    });
  });*/

  asyncTest('options in setBackgroundImage from image instance', function() {
    createImageObject(function(imageInstance) {
      canvas.setBackgroundImage(imageInstance, function() {
        equal(canvas.backgroundImage.left, 100);
        equal(canvas.backgroundImage.originX, 'center');

        start();
      }, {
        left: 100,
        originX: 'center'
      });
    });
  });

  // asyncTest('backgroundImage', function() {
  //   deepEqual('', canvas.backgroundImage);
  //   canvas.setBackgroundImage('../../assets/pug.jpg');

  //   setTimeout(function() {

  //     ok(typeof canvas.backgroundImage == 'object');
  //     ok(/pug\.jpg$/.test(canvas.backgroundImage.src));

  //     start();
  //   }, 1000);
  // });

  // asyncTest('setOverlayImage', function() {
  //   deepEqual(canvas.overlayImage, undefined);
  //   canvas.setOverlayImage('../../assets/pug.jpg');

  //   setTimeout(function() {

  //     ok(typeof canvas.overlayImage == 'object');
  //     ok(/pug\.jpg$/.test(canvas.overlayImage.src));

  //     start();
  //   }, 1000);
  // });

})();
