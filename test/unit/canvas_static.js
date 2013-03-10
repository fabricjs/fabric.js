(function() {

  var emptyImageCanvasData = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAfQAAAH0CAYAAADL1t+KAAAH7ElEQVR4nO3VMQ0AMAzAsPInvYHoMS2yEeTLHADge/M6AADYM3QACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIuMjH4b7osLFBAAAAAElFTkSuQmCC";

  var PATH_JSON = '{"objects": [{"type": "path", "originX": "center", "originY": "center", "left": 268, "top": 266, "width": 51, "height": 49,'+
                  ' "fill": "rgb(0,0,0)", "overlayFill": null, "stroke": null, "strokeWidth": 1, "scaleX": 1, "scaleY": 1, '+
                  '"angle": 0, "flipX": false, "flipY": false, "opacity": 1, "path": [["M", 18.511, 13.99],'+
                  ' ["c", 0, 0, -2.269, -4.487, -12.643, 4.411], ["c", 0, 0, 4.824, -14.161, 19.222, -9.059],'+
                  ' ["l", 0.379, -2.1], ["c", -0.759, -0.405, -1.375, -1.139, -1.645, -2.117], ["c", -0.531, '+
                  '-1.864, 0.371, -3.854, 1.999, -4.453], ["c", 0.312, -0.118, 0.633, -0.169, 0.953, -0.169], '+
                  '["c", 1.299, 0, 2.514, 0.953, 2.936, 2.455], ["c", 0.522, 1.864, -0.372, 3.854, -1.999, '+
                  '4.453], ["c", -0.229, 0.084, -0.464, 0.127, -0.692, 0.152], ["l", -0.379, 2.37], ["c", '+
                  '1.146, 0.625, 2.024, 1.569, 2.674, 2.758], ["c", 3.213, 2.514, 8.561, 4.184, 11.774, -8.232],'+
                  ' ["c", 0, 0, 0.86, 16.059, -12.424, 14.533], ["c", 0.008, 2.859, 0.615, 5.364, -0.076, 8.224],'+
                  ' ["c", 8.679, 3.146, 15.376, 14.389, 17.897, 18.168], ["l", 2.497, -2.151], ["l", 1.206, 1.839],'+
                  ' ["l", -3.889, 3.458], ["C", 46.286, 48.503, 31.036, 32.225, 22.72, 35.81], ["c", -1.307, 2.851,'+
                  ' -3.56, 6.891, -7.481, 8.848], ["c", -4.689, 2.336, -9.084, -0.802, -11.277, -2.868], ["l",'+
                  ' -1.948, 3.104], ["l", -1.628, -1.333], ["l", 3.138, -4.689], ["c", 0.025, 0, 9, 1.932, 9, 1.932], '+
                  '["c", 0.877, -9.979, 2.893, -12.905, 4.942, -15.621], ["C", 17.878, 21.775, 18.713, 17.397, 18.511, '+
                  '13.99], ["z", null]]}], "background": "#ff5555"}';

  var PATH_DATALESS_JSON = '{"objects":[{"type":"path","originX":"center","originY":"center","left":200,"top":200,"width":200,"height":200,"fill":"rgb(0,0,0)",'+
                           '"overlayFill":null,"stroke":null,"strokeWidth":1,"strokeDashArray":null,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,'+
                           '"flipY":false,"opacity":1,"selectable":true,"hasControls":true,"hasBorders":true,"hasRotatingPoint":true,"transparentCorners":true,'+
                           '"perPixelTargetFind":false,"shadow":null,"visible":true,"path":"http://example.com/"}],"background":""}';

  var RECT_JSON = '{"objects":[{"type":"rect","originX":"center","originY":"center","left":0,"top":0,"width":10,"height":10,"fill":"rgb(0,0,0)","overlayFill":null,'+
                  '"stroke":null,"strokeWidth":1,"strokeDashArray":null,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"selectable":true,'+
                  '"hasControls":true,"hasBorders":true,"hasRotatingPoint":true,"transparentCorners":true,"perPixelTargetFind":false,"shadow":null,"visible":true,"rx":0,"ry":0}],'+
                  '"background":"#ff5555"}';

  var RECT_JSON_WITH_PADDING = '{"objects":[{"type":"rect","originX":"center","originY":"center","left":0,"top":0,"width":10,"height":20,"fill":"rgb(0,0,0)","overlayFill":null,'+
                               '"stroke":null,"strokeWidth":1,"strokeDashArray":null,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"selectable":true,'+
                               '"hasControls":true,"hasBorders":true,"hasRotatingPoint":true,"transparentCorners":true,"perPixelTargetFind":false,"shadow":null,"visible":true,"padding":123,"foo":"bar","rx":0,"ry":0}],'+
                               '"background":""}';

  // force creation of static canvas
  // TODO: fix this
  var Canvas = fabric.Canvas;
  fabric.Canvas = null;
  var el = fabric.document.createElement('canvas');
  el.width = 600; el.height = 600;

  var canvas = this.canvas = fabric.isLikelyNode ? fabric.createCanvasForNode() : new fabric.StaticCanvas(el);
  fabric.Canvas = Canvas;

  var lowerCanvasEl = canvas.lowerCanvasEl;

  function makeRect(options) {
    var defaultOptions = { width: 10, height: 10 };
    return new fabric.Rect(fabric.util.object.extend(defaultOptions, options || { }));
  }

  QUnit.module('fabric.StaticCanvas', {
    teardown: function() {
      canvas.clear();
      canvas.backgroundColor = fabric.StaticCanvas.prototype.backgroundColor;
      canvas.calcOffset();
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

  test('calcOffset', function() {
    ok(typeof canvas.calcOffset == 'function', 'should respond to `calcOffset`');
    equal(canvas, canvas.calcOffset());
  });

  test('add', function() {
    var rect = makeRect();

    ok(typeof canvas.add == 'function');
    ok(canvas === canvas.add(rect), 'should be chainable');
    equal(canvas.item(0), rect);

    canvas.add(makeRect(), makeRect(), makeRect());
    equal(canvas.getObjects().length, 4, 'should support multiple arguments');
  });

  test('insertAt', function() {
    var rect1 = makeRect(),
        rect2 = makeRect();

    canvas.add(rect1, rect2);

    ok(typeof canvas.insertAt == 'function', 'should respond to `insertAt` method');

    var rect = makeRect();
    canvas.insertAt(rect, 1);
    equal(canvas.item(1), rect);
    canvas.insertAt(rect, 2);
    equal(canvas.item(2), rect);
    equal(canvas, canvas.insertAt(rect, 2), 'should be chainable');
  });

  test('clearContext', function() {
    ok(typeof canvas.clearContext == 'function');
    equal(canvas, canvas.clearContext(canvas.contextContainer), 'chainable');
  });

  test('clear', function() {
    ok(typeof canvas.clear == 'function');

    equal(canvas, canvas.clear());
    equal(canvas.getObjects().length, 0);
  });

  test('renderAll', function() {
    ok(typeof canvas.renderAll == 'function');
    equal(canvas, canvas.renderAll());
  });

  test('renderTop', function() {
    ok(typeof canvas.renderTop == 'function');
    equal(canvas, canvas.renderTop());
  });

  test('toDataURL', function() {
    ok(typeof canvas.toDataURL == 'function');
    if (!fabric.Canvas.supports('toDataURL')) {
      alert("toDataURL is not supported by this environment. Some of the tests can not be run.");
    }
    else {
      var dataURL = canvas.toDataURL();
      // don't compare actual data url, as it is often browser-dependent
      // this.assertIdentical(emptyImageCanvasData, canvas.toDataURL('png'));
      equal(typeof dataURL, 'string');
      equal(dataURL.substring(0, 21), 'data:image/png;base64');
    }
  });

  test('centerObjectH', function() {
    ok(typeof canvas.centerObjectH == 'function');
    var rect = makeRect({ left: 102, top: 202 });
    canvas.add(rect);
    equal(canvas.centerObjectH(rect), canvas, 'should be chainable');
    equal(rect.get('left'), lowerCanvasEl.width / 2, 'object\'s "left" property should correspond to canvas element\'s center');
  });

  test('centerObjectV', function() {
    ok(typeof canvas.centerObjectV == 'function');
    var rect = makeRect({ left: 102, top: 202 });
    canvas.add(rect);
    equal(canvas.centerObjectV(rect), canvas, 'should be chainable');
    equal(rect.get('top'), lowerCanvasEl.height / 2, 'object\'s "top" property should correspond to canvas element\'s center');
  });

  test('centerObject', function() {
    ok(typeof canvas.centerObject == 'function');
    var rect = makeRect({ left: 102, top: 202 });
    canvas.add(rect);
    equal(canvas.centerObject(rect), canvas, 'should be chainable');

    equal(rect.get('top'), lowerCanvasEl.height / 2, 'object\'s "top" property should correspond to canvas element\'s center');
    equal(rect.get('left'), lowerCanvasEl.height / 2, 'object\'s "left" property should correspond to canvas element\'s center');
  });

  test('straightenObject', function() {
    ok(typeof canvas.straightenObject == 'function');
    var rect = makeRect({ angle: 10 })
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

  test('toSVG without preamble', function() {
    ok(typeof canvas.toSVG == 'function');
    var withPreamble = canvas.toSVG();
    var withoutPreamble = canvas.toSVG({suppressPreamble: true});
    ok(withPreamble != withoutPreamble);
    equal(withoutPreamble.slice(0, 4), '<svg', 'svg should start with root node when premable is suppressed');
  });


  test('toJSON', function() {
    ok(typeof canvas.toJSON == 'function');
    equal(JSON.stringify(canvas.toJSON()), '{"objects":[],"background":""}');
    canvas.backgroundColor = '#ff5555';
    equal(JSON.stringify(canvas.toJSON()), '{"objects":[],"background":"#ff5555"}', '`background` value should be reflected in json');
    canvas.add(makeRect());
    deepEqual(JSON.stringify(canvas.toJSON()), RECT_JSON);
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
      background: canvas.backgroundColor,
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
      background: canvas.backgroundColor,
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
      background: canvas.backgroundColor,
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

  test('loadFromJSON with json string', function() {
    ok(typeof canvas.loadFromJSON == 'function');

    canvas.loadFromJSON(PATH_JSON, function(){
      var obj = canvas.item(0);

      ok(!canvas.isEmpty(), 'canvas is not empty');
      equal(obj.type, 'path', 'first object is a path object');
      equal(canvas.backgroundColor, '#ff5555', 'backgroundColor is populated properly');

      equal(obj.get('left'), 268);
      equal(obj.get('top'), 266);
      equal(obj.get('width'), 51);
      equal(obj.get('height'), 49);
      equal(obj.get('fill'), 'rgb(0,0,0)');
      equal(obj.get('stroke'), null);
      equal(obj.get('strokeWidth'), 1);
      equal(obj.get('scaleX'), 1);
      equal(obj.get('scaleY'), 1);
      equal(obj.get('angle'), 0);
      equal(obj.get('flipX'), false);
      equal(obj.get('flipY'), false);
      equal(obj.get('opacity'), 1);

      ok(obj.get('path').length > 0);
    });
  });

  test('loadFromJSON with json object', function() {
    ok(typeof canvas.loadFromJSON == 'function');

    canvas.loadFromJSON(JSON.parse(PATH_JSON), function(){
      var obj = canvas.item(0);

      ok(!canvas.isEmpty(), 'canvas is not empty');
      equal(obj.type, 'path', 'first object is a path object');
      equal(canvas.backgroundColor, '#ff5555', 'backgroundColor is populated properly');

      equal(obj.get('left'), 268);
      equal(obj.get('top'), 266);
      equal(obj.get('width'), 51);
      equal(obj.get('height'), 49);
      equal(obj.get('fill'), 'rgb(0,0,0)');
      equal(obj.get('stroke'), null);
      equal(obj.get('strokeWidth'), 1);
      equal(obj.get('scaleX'), 1);
      equal(obj.get('scaleY'), 1);
      equal(obj.get('angle'), 0);
      equal(obj.get('flipX'), false);
      equal(obj.get('flipY'), false);
      equal(obj.get('opacity'), 1);

      ok(obj.get('path').length > 0);
    });
  });

  test('loadFromJSON custom properties', function() {
    var rect = new fabric.Rect({ width: 10, height: 20 });
    rect.padding = 123;
    rect.foo = "bar";

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
    });
  });

  test('remove', function() {
    ok(typeof canvas.remove == 'function');
    var rect1 = makeRect(),
        rect2 = makeRect();
    canvas.add(rect1, rect2);
    equal(canvas.remove(rect1), rect1, 'should return removed object');
    equal(canvas.item(0), rect2, 'only second object should be left');
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
    equal(canvas.setWidth(444), canvas, 'chainable');
    equal(canvas.getWidth(), 444);
  });

  test('getSetHeight', function() {
    ok(typeof canvas.getHeight == 'function');
    equal(canvas.getHeight(), 600);
    equal(canvas.setHeight(765), canvas, 'chainable');
    equal(canvas.getHeight(), 765);
  });

  test('toGrayscale', function() {
    ok(typeof fabric.Canvas.toGrayscale == 'function');

    if (!fabric.Canvas.supports('getImageData')) {
      alert('getImageData is not supported by this environment. Some of the tests can not be run.');
      return;
    }

    var canvasEl = fabric.isLikelyNode ? new (require('canvas')) : fabric.document.createElement('canvas'),
        context = canvasEl.getContext('2d');

    canvasEl.width = canvasEl.height = 10;

    context.fillStyle = 'rgb(255,0,0)'; // red
    context.fillRect(0, 0, 10, 10);

    var imageData = context.getImageData(0, 0, 10, 10),
        data = imageData.data,
        firstPixelData = [data[0], data[1], data[2], data[3]];

    deepEqual([255, 0, 0, 255], firstPixelData);

    fabric.Canvas.toGrayscale(canvasEl);

    imageData = context.getImageData(0, 0, 10, 10);
    data = imageData.data;
    firstPixelData = [data[0], data[1], data[2], data[3]];

    deepEqual([85, 85, 85, 255], firstPixelData);
  });

  // asyncTest('resizeImageToFit', function() {
  //   ok(typeof canvas._resizeImageToFit == 'function');

  //   var imgEl = fabric.util.makeElement('img', { src: '../fixtures/very_large_image.jpg' }),
  //       ORIGINAL_WIDTH = 3888,
  //       ORIGINAL_HEIGHT = 2592;

  //   setTimeout(function() {
  //     equal(imgEl.width, ORIGINAL_WIDTH);
  //     equal(imgEl.height, ORIGINAL_HEIGHT);

  //     canvas._resizeImageToFit(imgEl);

  //     ok(imgEl.width < ORIGINAL_WIDTH);

  //     start();
  //   }, 2000);
  // });

  asyncTest('fxRemove', function() {
    ok(typeof canvas.fxRemove == 'function');

    var rect = new fabric.Rect();
    canvas.add(rect);

    var callbackFired = false;
    function onComplete(){
      callbackFired = true;
    }

    ok(canvas.item(0) === rect);
    ok(canvas.fxRemove(rect, { onComplete: onComplete }) === canvas, 'should be chainable');

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

    deepEqual(objectsAdded[1], circle1);
    deepEqual(objectsAdded[2], circle2);

    var circle3 = new fabric.Circle();
    canvas.insertAt(circle3, 2);

    deepEqual(objectsAdded[3], circle3);
  });

  asyncTest('loadFromJSON with text', function() {
    var json = '{"objects":[{"type":"text","left":150,"top":200,"width":128,"height":64.32,"fill":"#000000","overlayFill":"","stroke":"","strokeWidth":"","scaleX":0.8,"scaleY":0.8,"angle":0,"flipX":false,"flipY":false,"opacity":1,"selectable":true,"text":"NAME HERE","fontSize":24,"fontWeight":"","fontFamily":"Delicious_500","fontStyle":"","lineHeight":"","textDecoration":"","textShadow":"","textAlign":"center","path":"","strokeStyle":"","backgroundColor":""}],"background":"#ffffff"}';
    canvas.loadFromJSON(json, function() {

      canvas.renderAll();

      equal('text', canvas.item(0).type);
      equal(150, canvas.item(0).left);
      equal(200, canvas.item(0).top)
      equal('NAME HERE', canvas.item(0).text);

      start();
    });
  });

})();
