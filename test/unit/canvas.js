(function() {

  var EMPTY_JSON = '{"objects":[],"background":""}';

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

  var PATH_OBJ_JSON = '{"type": "path", "originX": "center", "originY": "center", "left": 268, "top": 266, "width": 51, "height": 49,'+
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
                      '13.99], ["z", null]]}';

  var PATH_DATALESS_JSON = '{"objects":[{"type":"path","originX":"center","originY":"center","left":200,"top":200,"width":200,"height":200,"fill":"rgb(0,0,0)",'+
                           '"overlayFill":null,"stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,'+
                           '"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,'+
                           '"shadow":null,"visible":true,"clipTo":null,"path":"http://example.com/","pathOffset":{"x":100,"y":100}}],"background":""}';

  var RECT_JSON = '{"objects":[{"type":"rect","originX":"center","originY":"center","left":0,"top":0,"width":10,"height":10,"fill":"rgb(0,0,0)","overlayFill":null,'+
                  '"stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,'+
                  '"shadow":null,'+
                  '"visible":true,"clipTo":null,"rx":0,"ry":0,"x":0,"y":0}],"background":"#ff5555"}';

  var el = fabric.document.createElement('canvas');
  el.width = 600; el.height = 600;

  var canvas = this.canvas = fabric.isLikelyNode ? fabric.createCanvasForNode() : new fabric.Canvas(el);
  var upperCanvasEl = canvas.upperCanvasEl;
  var lowerCanvasEl = canvas.lowerCanvasEl;

  function makeRect(options) {
    var defaultOptions = { width: 10, height: 10 };
    return new fabric.Rect(fabric.util.object.extend(defaultOptions, options || { }));
  }

  QUnit.module('fabric.Canvas', {
    setup: function() {
      upperCanvasEl.style.display = '';
    },
    teardown: function() {
      canvas.clear();
      canvas.setActiveGroup(null);
      canvas.backgroundColor = fabric.Canvas.prototype.backgroundColor;
      canvas.backgroundImage = '';
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

  test('getContext', function() {
    ok(typeof canvas.getContext == 'function');
  });

  test('clearContext', function() {
    ok(typeof canvas.clearContext == 'function');
    equal(canvas, canvas.clearContext(canvas.getContext()), 'chainable');
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

  test('findTarget', function() {
    ok(typeof canvas.findTarget == 'function');
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

  // asyncTest('getPointer', function() {
  //   ok(typeof canvas.getPointer == 'function');

  //   window.scroll(0, 0);

  //   fabric.util.addListener(upperCanvasEl, 'click', function(e) {
  //     canvas.calcOffset();
  //     var pointer = canvas.getPointer(e);
  //     equal(pointer.x, 101, 'pointer.x should be correct');
  //     equal(pointer.y, 102, 'pointer.y should be correct');

  //     start();
  //   });

  //   setTimeout(function() {
  //     simulateEvent(upperCanvasEl, 'click', {
  //       pointerX: 101, pointerY: 102
  //     });
  //   }, 100);
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
    equal(rect.get('left'), upperCanvasEl.width / 2, 'object\'s "left" property should correspond to canvas element\'s center');
  });

  test('centerObjectV', function() {
    ok(typeof canvas.centerObjectV == 'function');
    var rect = makeRect({ left: 102, top: 202 });
    canvas.add(rect);
    equal(canvas.centerObjectV(rect), canvas, 'should be chainable');
    equal(rect.get('top'), upperCanvasEl.height / 2, 'object\'s "top" property should correspond to canvas element\'s center');
  });

  test('centerObject', function() {
    ok(typeof canvas.centerObject == 'function');
    var rect = makeRect({ left: 102, top: 202 });
    canvas.add(rect);
    equal(canvas.centerObject(rect), canvas, 'should be chainable');

    equal(rect.get('top'), upperCanvasEl.height / 2, 'object\'s "top" property should correspond to canvas element\'s center');
    equal(rect.get('left'), upperCanvasEl.height / 2, 'object\'s "left" property should correspond to canvas element\'s center');
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

  test('toJSON', function() {
    ok(typeof canvas.toJSON == 'function');
    equal(JSON.stringify(canvas.toJSON()), EMPTY_JSON);
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

  test('toJSON with active group', function() {
    var rect = new fabric.Rect({ width: 50, height: 50, left: 100, top: 100 });
    var circle = new fabric.Circle({ radius: 50, left: 50, top: 50 });
    canvas.add(rect, circle);
    var json = JSON.stringify(canvas);

    canvas.setActiveGroup(new fabric.Group([ rect, circle ])).renderAll();
    var jsonWithActiveGroup = JSON.stringify(canvas);

    equal(json, jsonWithActiveGroup);
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

  test('loadFromJSON with reviver function', function() {
    ok(typeof canvas.loadFromJSON == 'function');

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
      equal(obj.get('customID'), 'fabric_1');
      ok(obj.get('path').length > 0);
    }, reviver);
  });

  asyncTest('loadFromJSON with no objects', function() {
    var c1 = new fabric.Canvas('c1', { backgroundColor: 'green' }),
        c2 = new fabric.Canvas('c2', { backgroundColor: 'red' });

    var json = c1.toJSON();
    var fired = false;
    c2.loadFromJSON(json, function() {
      fired = true;
    });

    setTimeout(function() {
      ok(fired, 'Callback should be fired even if no objects');
      equal(c2.backgroundColor, 'green', 'Color should be set properly');
      start();
    }, 500);
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

    canvas.deactivateAll();
    var json = JSON.stringify( canvas.toDatalessJSON() );
    canvas.clear();
    canvas.loadFromDatalessJSON(json, function() {

      equal(2, canvas.getObjects().length);
      equal('group', canvas.getObjects()[1].type);

      start();
    });
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

  test('setActiveObject', function() {
    ok(typeof canvas.setActiveObject == 'function');

    var rect1 = makeRect(),
        rect2 = makeRect();

    canvas.add(rect1, rect2);

    canvas.setActiveObject(rect1);
    ok(rect1.active);

    canvas.setActiveObject(rect2);
    ok(rect2.active);
  });

  test('getActiveObject', function() {
    ok(typeof canvas.getActiveObject == 'function');

    var rect1 = makeRect(),
        rect2 = makeRect();

    canvas.add(rect1, rect2);

    canvas.setActiveObject(rect1);
    equal(canvas.getActiveObject(), rect1);

    canvas.setActiveObject(rect2);
    equal(canvas.getActiveObject(), rect2);
  });

  test('getSetActiveGroup', function() {
    ok(typeof canvas.getActiveGroup == 'function');
    ok(typeof canvas.setActiveGroup == 'function');

    equal(canvas.getActiveGroup(), null, 'should initially be null');

    var group = new fabric.Group([
      makeRect({ left: 10, top: 10 }),
      makeRect({ left: 20, top: 20 })
    ]);

    equal(canvas.setActiveGroup(group), canvas, 'chainable');
    equal(canvas.getActiveGroup(), group);
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

  test('discardActiveGroup', function() {
    ok(typeof canvas.discardActiveGroup == 'function');
    var group = new fabric.Group([makeRect(), makeRect()]);
    canvas.setActiveGroup(group);
    equal(canvas.discardActiveGroup(), canvas, 'chainable');
    equal(canvas.getActiveGroup(), null, 'removing active group sets it to null');
  });

  test('deactivateAll', function() {
    ok(typeof canvas.deactivateAll == 'function');

    canvas.add(makeRect());
    canvas.setActiveObject(canvas.item(0));

    canvas.deactivateAll();
    ok(!canvas.item(0).active);
    equal(canvas.getActiveObject(), null);
    equal(canvas.getActiveGroup(), null);
  });

  test('deactivateAllWithDispatch', function() {
    ok(typeof canvas.deactivateAllWithDispatch == 'function');

    canvas.add(makeRect());
    canvas.setActiveObject(canvas.item(0));

    var group = new fabric.Group([
      makeRect({ left: 10, top: 10 }),
      makeRect({ left: 20, top: 20 })
    ]);

    canvas.setActiveGroup(group);

    var eventsFired = {
      selectionCleared: false
    };
    var target;

    canvas.on('selection:cleared', function(){
      eventsFired.selectionCleared = true;
    });

    canvas.deactivateAllWithDispatch();
    ok(!canvas.item(0).active);
    equal(canvas.getActiveObject(), null);
    equal(canvas.getActiveGroup(), null);

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

    canvas.setActiveGroup(new fabric.Group([ rect, circle ])).renderAll();
    var svgWithActiveGroup = canvas.toSVG();

    equal(svg, svgWithActiveGroup);
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
    equal(canvas.setWidth(444), canvas, 'chainable');
    equal(canvas.getWidth(), 444);
  });

  test('getSetHeight', function() {
    ok(typeof canvas.getHeight == 'function');
    equal(canvas.getHeight(), 600);
    equal(canvas.setHeight(765), canvas, 'chainable');
    equal(canvas.getHeight(), 765);
  });

  test('containsPoint', function() {
    ok(typeof canvas.containsPoint == 'function');

    var rect = new fabric.Rect({ left: 100, top: 100, width: 50, height: 50 });
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

    rect.set('left', 200).set('top', 200).setCoords();
    ok(canvas.containsPoint(eventStub, rect), 'point at (200, 200) should be within area (175, 175, 225, 225)');
  });

  test('toGrayscale', function() {
    ok(typeof fabric.Canvas.toGrayscale == 'function');

    if (!fabric.Canvas.supports('getImageData')) {
      console.log('getImageData is not supported by this environment. Some of the tests can not be run.');
      return;
    }

    var canvasEl = fabric.document.createElement('canvas'),
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
  //       "objects": [ ],
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

  test('selection:cleared', function() {
    var isFired = false;
    canvas.on('selection:cleared', function() { isFired = true });

    canvas.add(new fabric.Rect());
    canvas.remove(canvas.item(0));

    equal(isFired, false, 'removing inactive object shouldnt fire "selection:cleared"');

    canvas.add(new fabric.Rect());
    canvas.setActiveObject(canvas.item(0));
    canvas.remove(canvas.item(0));

    // TODO: find out why this is failing
    // equal(isFired, true, 'removing active object should fire "selection:cleared"');
  });

  test('clipTo', function() {
    canvas.clipTo = function(ctx) {
      ctx.arc(0, 0, 10, 0, Math.PI * 2, false);
    };

    var error;
    try {
      canvas.renderAll();
    }
    catch(err) {
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

})();
