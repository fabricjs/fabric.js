(function () {
  var canvas = this.canvas = new fabric.StaticCanvas(null, { enableRetinaScaling: false, width: 600, height: 600 });

  function makeLayerWith2Objects() {
    var rect1 = new fabric.Rect({ top: 100, left: 100, width: 30, height: 10, strokeWidth: 0 }),
      rect2 = new fabric.Rect({ top: 120, left: 50, width: 10, height: 40, strokeWidth: 0 });

    return new fabric.Layer([rect1, rect2], { strokeWidth: 0 });
  }

  function makeLayerWith2ObjectsWithOpacity() {
    var rect1 = new fabric.Rect({ top: 100, left: 100, width: 30, height: 10, strokeWidth: 0, opacity: 0.5 }),
      rect2 = new fabric.Rect({ top: 120, left: 50, width: 10, height: 40, strokeWidth: 0, opacity: 0.8 });

    return new fabric.Layer([rect1, rect2], { strokeWidth: 0 });
  }

  function makeLayerWith2ObjectsAndNoExport() {
    var rect1 = new fabric.Rect({ top: 100, left: 100, width: 30, height: 10, strokeWidth: 0 }),
      rect2 = new fabric.Rect({ top: 120, left: 50, width: 10, height: 40, strokeWidth: 0, excludeFromExport: true });

    return new fabric.Layer([rect1, rect2], { strokeWidth: 0 });
  }

  function makeLayerWith4Objects() {
    var rect1 = new fabric.Rect({ top: 100, left: 100, width: 30, height: 10 }),
      rect2 = new fabric.Rect({ top: 120, left: 50, width: 10, height: 40 }),
      rect3 = new fabric.Rect({ top: 40, left: 0, width: 20, height: 40 }),
      rect4 = new fabric.Rect({ top: 75, left: 75, width: 40, height: 40 });

    return new fabric.Layer([rect1, rect2, rect3, rect4]);
  }

  QUnit.module('fabric.Layer', {
    afterEach: function () {
      fabric.Object.__uid = 0;
      canvas.clear();
      canvas.backgroundColor = fabric.Canvas.prototype.backgroundColor;
      canvas.calcOffset();
    }
  });

  QUnit.test('constructor', function (assert) {
    var layer = makeLayerWith2Objects();

    assert.ok(layer);
    assert.ok(layer instanceof fabric.Layer, 'should be instance of fabric.Layer');
  });

  QUnit.test('toString', function (assert) {
    var layer = makeLayerWith2Objects();
    assert.equal(layer.toString(), '#<fabric.Layer: (2)>', 'should return proper representation');
  });

  QUnit.test('getObjects', function (assert) {
    var rect1 = new fabric.Rect(),
      rect2 = new fabric.Rect();

    var layer = new fabric.Layer([rect1, rect2]);

    assert.ok(typeof layer.getObjects === 'function');
    assert.ok(Object.prototype.toString.call(layer.getObjects()) == '[object Array]', 'should be an array');
    assert.equal(layer.getObjects().length, 2, 'should have 2 items');
    assert.deepEqual(layer.getObjects(), [rect1, rect2], 'should return deepEqual objects as those passed to constructor');
  });

  QUnit.test('getObjects with type', function (assert) {
    var rect = new fabric.Rect({ width: 10, height: 20 }),
      circle = new fabric.Circle({ radius: 30 });

    var layer = new fabric.Layer([rect, circle]);

    assert.equal(layer.size(), 2, 'should have length=2 initially');

    assert.deepEqual(layer.getObjects('rect'), [rect], 'should return rect only');
    assert.deepEqual(layer.getObjects('circle'), [circle], 'should return circle only');
  });

  QUnit.test('add', function (assert) {
    var layer = makeLayerWith2Objects();
    var rect1 = new fabric.Rect(),
      rect2 = new fabric.Rect(),
      rect3 = new fabric.Rect();

    assert.ok(typeof layer.add === 'function');
    assert.equal(layer.add(rect1), layer, 'should be chainable');
    assert.strictEqual(layer.item(layer.size() - 1), rect1, 'last object should be newly added one');
    assert.equal(layer.getObjects().length, 3, 'there should be 3 objects');

    layer.add(rect2, rect3);
    assert.strictEqual(layer.item(layer.size() - 1), rect3, 'last object should be last added one');
    assert.equal(layer.size(), 5, 'there should be 5 objects');
  });

  QUnit.test('remove', function (assert) {
    var rect1 = new fabric.Rect(),
      rect2 = new fabric.Rect(),
      rect3 = new fabric.Rect(),
      layer = new fabric.Layer([rect1, rect2, rect3]);

    assert.ok(typeof layer.remove === 'function');
    assert.equal(layer.remove(rect2), layer, 'should be chainable');
    assert.deepEqual(layer.getObjects(), [rect1, rect3], 'should remove object properly');

    layer.remove(rect1, rect3);
    assert.equal(layer.isEmpty(), true, 'layer should be empty');
  });

  QUnit.test('size', function (assert) {
    var layer = makeLayerWith2Objects();

    assert.ok(typeof layer.size === 'function');
    assert.equal(layer.size(), 2);
    layer.add(new fabric.Rect());
    assert.equal(layer.size(), 3);
    layer.remove(layer.getObjects()[0]);
    layer.remove(layer.getObjects()[0]);
    assert.equal(layer.size(), 1);
  });

  QUnit.test('set', function (assert) {
    var layer = makeLayerWith2Objects(),
      firstObject = layer.getObjects()[0];

    assert.ok(typeof layer.set === 'function');

    assert.equal(layer.set('opacity', 0.12345), layer, 'should be chainable');
    assert.equal(layer.get('opacity'), 0.12345, 'layer\'s "own" property should be set properly');
    assert.equal(firstObject.get('opacity'), 1, 'objects\' value of non delegated property should stay same');

    layer.set('left', 1234);
    assert.equal(layer.get('left'), 1234, 'layer\'s own "left" property should be set properly');
    assert.ok(firstObject.get('left') !== 1234, 'objects\' value should not be affected');

    layer.set({ left: 888, top: 999 });
    assert.equal(layer.get('left'), 888, 'layer\'s own "left" property should be set properly via object');
    assert.equal(layer.get('top'), 999, 'layer\'s own "top" property should be set properly via object');
  });

  QUnit.test('contains', function (assert) {
    var rect1 = new fabric.Rect(),
      rect2 = new fabric.Rect(),
      notIncludedRect = new fabric.Rect(),
      layer = new fabric.Layer([rect1, rect2]);

    assert.ok(typeof layer.contains === 'function');

    assert.ok(layer.contains(rect1), 'should contain first object');
    assert.ok(layer.contains(rect2), 'should contain second object');

    assert.ok(!layer.contains(notIncludedRect), 'should report not-included one properly');
  });

  QUnit.test('toObject', function (assert) {
    var layer = makeLayerWith2Objects();

    assert.ok(typeof layer.toObject === 'function');

    var clone = layer.toObject();

    var expectedObject = {
      version: fabric.version,
      type: 'layer',
      originX: 'left',
      originY: 'top',
      left: 50,
      top: 100,
      width: 80,
      height: 60,
      fill: 'rgb(0,0,0)',
      stroke: null,
      strokeWidth: 0,
      strokeDashArray: null,
      strokeLineCap: 'butt',
      strokeDashOffset: 0,
      strokeLineJoin: 'miter',
      strokeMiterLimit: 4,
      scaleX: 1,
      scaleY: 1,
      shadow: null,
      visible: true,
      backgroundColor: '',
      angle: 0,
      flipX: false,
      flipY: false,
      opacity: 1,
      fillRule: 'nonzero',
      paintFirst: 'fill',
      globalCompositeOperation: 'source-over',
      skewX: 0,
      skewY: 0,
      objects: clone.objects,
      strokeUniform: false
    };

    assert.deepEqual(clone, expectedObject);

    assert.ok(layer !== clone, 'should produce different object');
    assert.ok(layer.getObjects() !== clone.objects, 'should produce different object array');
    assert.ok(layer.getObjects()[0] !== clone.objects[0], 'should produce different objects in array');
  });

  QUnit.test('toObject without default values', function (assert) {
    var layer = makeLayerWith2Objects();
    layer.includeDefaultValues = false;
    var clone = layer.toObject();
    var expectedObject = {
      version: fabric.version,
      type: 'layer',
      left: 50,
      top: 100,
      width: 80,
      height: 60,
      objects: layer.getObjects().map(obj => obj.set('includeDefaultValues', false).toObject())
    };
    assert.deepEqual(clone, expectedObject);
  });


  QUnit.test('toObject with excludeFromExport set on an object', function (assert) {
    var layer = makeLayerWith2Objects();
    var layer2 = makeLayerWith2ObjectsAndNoExport();
    var clone = layer.toObject();
    var clone2 = layer2.toObject();
    assert.deepEqual(clone2.objects, layer2._objects.filter(obj => !obj.excludeFromExport).map(obj => obj.toObject()));
    delete clone.objects;
    delete clone2.objects;
    assert.deepEqual(clone, clone2);
  });

  QUnit.test('render', function (assert) {
    var layer = makeLayerWith2Objects();
    assert.ok(typeof layer.render === 'function');
  });

  QUnit.test('item', function (assert) {
    var layer = makeLayerWith2Objects();

    assert.ok(typeof layer.item === 'function');
    assert.equal(layer.item(0), layer.getObjects()[0]);
    assert.equal(layer.item(1), layer.getObjects()[1]);
    assert.equal(layer.item(9999), undefined);
  });

  QUnit.test('moveTo', function (assert) {
    var layer = makeLayerWith4Objects(),
      layerEl1 = layer.getObjects()[0],
      layerEl2 = layer.getObjects()[1],
      layerEl3 = layer.getObjects()[2],
      layerEl4 = layer.getObjects()[3];

    layer.forEachObject((obj, index) => {
      obj.id = index + 1;
    })

    assert.ok(typeof layer.item(0).moveTo === 'function');

    // [ 1, 2, 3, 4 ]
    assert.equal(layer.item(0).id, layerEl1.id, 'wrong position');
    assert.equal(layer.item(1).id, layerEl2.id, 'wrong position');
    assert.equal(layer.item(2).id, layerEl3.id, 'wrong position');
    assert.equal(layer.item(3).id, layerEl4.id, 'wrong position');
    assert.equal(layer.item(9999), undefined);

    layer.item(0).moveTo(3);

    // moved 1 to level 3 — [2, 3, 4, 1]
    assert.equal(layer.item(3).id, layerEl1.id, 'wrong position');
    assert.equal(layer.item(0).id, layerEl2.id, 'wrong position');
    assert.equal(layer.item(1).id, layerEl3.id, 'wrong position');
    assert.equal(layer.item(2).id, layerEl4.id, 'wrong position');
    assert.equal(layer.item(9999), undefined);

    layer.item(0).moveTo(2);

    // moved 2 to level 2 — [3, 4, 2, 1]
    assert.equal(layer.item(3).id, layerEl1.id, 'wrong position');
    assert.equal(layer.item(2).id, layerEl2.id, 'wrong position');
    assert.equal(layer.item(0).id, layerEl3.id, 'wrong position');
    assert.equal(layer.item(1).id, layerEl4.id, 'wrong position');
    assert.equal(layer.item(9999), undefined);
  });

  QUnit.test('complexity', function (assert) {
    var layer = makeLayerWith2Objects();

    assert.ok(typeof layer.complexity === 'function');
    assert.equal(layer.complexity(), 2);
  });

  QUnit.test('containsPoint', function (assert) {

    var layer = makeLayerWith2Objects();
    layer.set({ originX: 'center', originY: 'center' }).setCoords();

    //  Rect #1     top: 100, left: 100, width: 30, height: 10
    //  Rect #2     top: 120, left: 50, width: 10, height: 40

    assert.ok(typeof layer.containsPoint === 'function');

    assert.ok(!layer.containsPoint({ x: 0, y: 0 }));

    layer.scale(2);
    assert.ok(layer.containsPoint({ x: 50, y: 120 }));
    assert.ok(layer.containsPoint({ x: 100, y: 160 }));
    assert.ok(!layer.containsPoint({ x: 0, y: 0 }));

    layer.scale(1);
    layer.padding = 30;
    layer.setCoords();
    assert.ok(layer.containsPoint({ x: 50, y: 120 }));
    assert.ok(!layer.containsPoint({ x: 100, y: 170 }));
    assert.ok(!layer.containsPoint({ x: 0, y: 0 }));
  });

  QUnit.test('forEachObject', function (assert) {
    var layer = makeLayerWith2Objects();

    assert.ok(typeof layer.forEachObject === 'function');
    assert.equal(layer.forEachObject(function () { }), layer, 'should be chainable');

    var iteratedObjects = [];
    layer.forEachObject(function (layerObject) {
      iteratedObjects.push(layerObject);
    });

    assert.equal(iteratedObjects[0], layer.getObjects()[0], 'iteration give back objects in same order');
    assert.equal(iteratedObjects[1], layer.getObjects()[1], 'iteration give back objects in same order');
  });

  QUnit.test('fromObject', function (assert) {
    var done = assert.async();
    var layer = makeLayerWith2ObjectsWithOpacity();

    assert.ok(typeof fabric.Layer.fromObject === 'function');
    var layerObject = layer.toObject();

    fabric.Layer.fromObject(layerObject, function (newLayerFromObject) {

      var objectFromOldLayer = layer.toObject();
      var objectFromNewLayer = newLayerFromObject.toObject();

      assert.ok(newLayerFromObject instanceof fabric.Layer);

      assert.deepEqual(objectFromOldLayer.objects[0], objectFromNewLayer.objects[0]);
      assert.deepEqual(objectFromOldLayer.objects[1], objectFromNewLayer.objects[1]);

      // delete `objects` arrays, since `assertHashEqual` fails to compare them for equality
      delete objectFromOldLayer.objects;
      delete objectFromNewLayer.objects;

      assert.deepEqual(objectFromOldLayer, objectFromNewLayer);

      done();
    });
  });

  QUnit.test('fromObject with clipPath', function (assert) {
    var done = assert.async();
    var clipPath = new fabric.Rect({
      width: 500,
      height: 250,
      top: 0,
      left: 0,
      absolutePositioned: true
    });

    var layerObject = new fabric.Layer([
      new fabric.Rect({ width: 100, height: 100, fill: 'red' }),
      new fabric.Rect({ width: 100, height: 100, fill: 'yellow', left: 100 }),
      new fabric.Rect({ width: 100, height: 100, fill: 'blue', top: 100 }),
      new fabric.Rect({ width: 100, height: 100, fill: 'green', left: 100, top: 100 })
    ]);
    layerObject.clipPath = clipPath;

    var layerToObject = layerObject.toObject();

    fabric.Layer.fromObject(layerToObject, function (newLayerFromObject) {

      var objectFromNewLayer = newLayerFromObject.toObject();

      assert.ok(newLayerFromObject instanceof fabric.Layer);
      assert.ok(newLayerFromObject.clipPath instanceof fabric.Rect, 'clipPath has been restored');
      assert.deepEqual(objectFromNewLayer, layerToObject, 'double serialization gives same results');

      done();
    });
  });

  QUnit.test('fromObject restores oCoords', function (assert) {
    var done = assert.async();
    var layer = makeLayerWith2ObjectsWithOpacity();

    var layerObject = layer.toObject();

    fabric.Layer.fromObject(layerObject, function (newLayerFromObject) {
      assert.ok(newLayerFromObject._objects[0].lineCoords.tl, 'acoords 0 are restored');
      assert.ok(newLayerFromObject._objects[1].lineCoords.tl, 'acoords 1 are restored');

      done();
    });
  });

  QUnit.test('fromObject does not delete objects from source', function (assert) {
    var done = assert.async();
    var layer = makeLayerWith2ObjectsWithOpacity();
    var layerObject = layer.toObject();

    fabric.Layer.fromObject(layerObject, function (newLayerFromObject) {
      assert.equal(newLayerFromObject.objects, undefined, 'the objects array has not been pulled in');
      assert.notEqual(layerObject.objects, undefined, 'the objects array has not been deleted from object source');
      done();
    });
  });

  QUnit.test('fromObject with svg url', function (assert) {
    var done = assert.async();
    var url = 'data:image/svg+xml,%3csvg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="612px" height="502.174px" viewBox="0 65.326 612 502.174" enable-background="new 0 65.326 612 502.174" xml:space="preserve"%3e %3cellipse fill="%23C6C6C6" cx="283.5" cy="487.5" rx="259" ry="80"/%3e %3cpath id="bird" d="M210.333%2c65.331C104.367%2c66.105-12.349%2c150.637%2c1.056%2c276.449c4.303%2c40.393%2c18.533%2c63.704%2c52.171%2c79.03 c36.307%2c16.544%2c57.022%2c54.556%2c50.406%2c112.954c-9.935%2c4.88-17.405%2c11.031-19.132%2c20.015c7.531-0.17%2c14.943-0.312%2c22.59%2c4.341 c20.333%2c12.375%2c31.296%2c27.363%2c42.979%2c51.72c1.714%2c3.572%2c8.192%2c2.849%2c8.312-3.078c0.17-8.467-1.856-17.454-5.226-26.933 c-2.955-8.313%2c3.059-7.985%2c6.917-6.106c6.399%2c3.115%2c16.334%2c9.43%2c30.39%2c13.098c5.392%2c1.407%2c5.995-3.877%2c5.224-6.991 c-1.864-7.522-11.009-10.862-24.519-19.229c-4.82-2.984-0.927-9.736%2c5.168-8.351l20.234%2c2.415c3.359%2c0.763%2c4.555-6.114%2c0.882-7.875 c-14.198-6.804-28.897-10.098-53.864-7.799c-11.617-29.265-29.811-61.617-15.674-81.681c12.639-17.938%2c31.216-20.74%2c39.147%2c43.489 c-5.002%2c3.107-11.215%2c5.031-11.332%2c13.024c7.201-2.845%2c11.207-1.399%2c14.791%2c0c17.912%2c6.998%2c35.462%2c21.826%2c52.982%2c37.309 c3.739%2c3.303%2c8.413-1.718%2c6.991-6.034c-2.138-6.494-8.053-10.659-14.791-20.016c-3.239-4.495%2c5.03-7.045%2c10.886-6.876 c13.849%2c0.396%2c22.886%2c8.268%2c35.177%2c11.218c4.483%2c1.076%2c9.741-1.964%2c6.917-6.917c-3.472-6.085-13.015-9.124-19.18-13.413 c-4.357-3.029-3.025-7.132%2c2.697-6.602c3.905%2c0.361%2c8.478%2c2.271%2c13.908%2c1.767c9.946-0.925%2c7.717-7.169-0.883-9.566 c-19.036-5.304-39.891-6.311-61.665-5.225c-43.837-8.358-31.554-84.887%2c0-90.363c29.571-5.132%2c62.966-13.339%2c99.928-32.156 c32.668-5.429%2c64.835-12.446%2c92.939-33.85c48.106-14.469%2c111.903%2c16.113%2c204.241%2c149.695c3.926%2c5.681%2c15.819%2c9.94%2c9.524-6.351 c-15.893-41.125-68.176-93.328-92.13-132.085c-24.581-39.774-14.34-61.243-39.957-91.247 c-21.326-24.978-47.502-25.803-77.339-17.365c-23.461%2c6.634-39.234-7.117-52.98-31.273C318.42%2c87.525%2c265.838%2c64.927%2c210.333%2c65.331 z M445.731%2c203.01c6.12%2c0%2c11.112%2c4.919%2c11.112%2c11.038c0%2c6.119-4.994%2c11.111-11.112%2c11.111s-11.038-4.994-11.038-11.111 C434.693%2c207.929%2c439.613%2c203.01%2c445.731%2c203.01z"/%3e %3c/svg%3e';
    var layerObject = {
      left: 10,
      top: 10,
      objects: url
    };
    fabric.Layer.fromObject(layerObject, function (newLayerFromObject) {
      assert.equal(newLayerFromObject.sourcePath, url, 'the url is copied in sourcePath');
      assert.equal(newLayerFromObject._objects.length, 2, '2 objects are created');
      done();
    });
  });

  function assertSVG(assert, layer) {
    var done = assert.async();
    fabric.loadSVGFromString(layer.toSVG(), function (result) {
      layer.includeDefaultValues = false;
      var object = layer.toObject();
      var options = fabric.util.object.clone(object);
      delete options.objects;
      options.includeDefaultValues = false;
      assert.deepEqual(object, new fabric.Layer(result, options).toObject());
      done();
    });
  }

  QUnit.test('toSVG', function (assert) {
    var layer = makeLayerWith2Objects();
    assert.ok(typeof layer.toSVG === 'function');
    assertSVG(assert, layer);
  });
  /*
    QUnit.test('toSVG with a clipPath', function (assert) {
      var layer = makeLayerWith2Objects();
      layer.clipPath = new fabric.Rect({ width: 100, height: 100 });
      assertSVG(assert, layer);
    });
  
    QUnit.test('toSVG with a clipPath absolutePositioned', function (assert) {
      var layer = makeLayerWith2Objects();
      layer.clipPath = new fabric.Rect({ width: 100, height: 100 });
      layer.clipPath.absolutePositioned = true;
      assertSVG(assert, layer);
    });
  
    QUnit.test('toSVG with a layer as a clipPath', function (assert) {
      var layer = makeLayerWith2Objects();
      layer.clipPath = makeLayerWith2Objects();
      assertSVG(assert, layer);
    });
  */
  QUnit.test('cloning layer with 2 objects', function (assert) {
    var done = assert.async();
    var layer = makeLayerWith2Objects();
    layer.clone(function (clone) {

      assert.ok(clone !== layer);
      assert.deepEqual(clone.toObject(), layer.toObject());

      done();
    });
  });

  QUnit.test('get with locked objects', function (assert) {
    var layer = makeLayerWith2Objects();

    assert.equal(layer.get('lockMovementX'), false);

    // TODO acitveLayer
    // layer.getObjects()[0].lockMovementX = true;
    // assert.equal(layer.get('lockMovementX'), true);
    //
    // layer.getObjects()[0].lockMovementX = false;
    // assert.equal(layer.get('lockMovementX'), false);

    layer.set('lockMovementX', true);
    assert.equal(layer.get('lockMovementX'), true);

    // layer.set('lockMovementX', false);
    // layer.getObjects()[0].lockMovementY = true;
    // layer.getObjects()[1].lockRotation = true;
    //
    // assert.equal(layer.get('lockMovementY'), true);
    // assert.equal(layer.get('lockRotation'), true);
  });

  QUnit.test('z-index methods with layer objects', function (assert) {

    var textBg = new fabric.Rect({
      fill: '#abc',
      width: 100,
      height: 100
    });

    var text = new fabric.Text('text');
    var layer = new fabric.Layer([textBg, text]);

    canvas.add(layer);

    assert.ok(layer.getObjects()[0] === textBg);
    assert.ok(layer.getObjects()[1] === text);

    textBg.bringToFront();

    assert.ok(layer.getObjects()[0] === text);
    assert.ok(layer.getObjects()[1] === textBg);

    textBg.sendToBack();

    assert.ok(layer.getObjects()[0] === textBg);
    assert.ok(layer.getObjects()[1] === text);
  });

  QUnit.test('layer reference on an object', function (assert) {
    var layer = makeLayerWith2Objects();
    var firstObjInLayer = layer.getObjects()[0];
    var secondObjInLayer = layer.getObjects()[1];

    assert.equal(firstObjInLayer.layer, layer);
    assert.equal(secondObjInLayer.layer, layer);

    layer.remove(firstObjInLayer);
    assert.ok(typeof firstObjInLayer.layer === 'undefined');
  });

  QUnit.test('insertAt', function (assert) {
    var rect1 = new fabric.Rect(),
      rect2 = new fabric.Rect(),
      layer = new fabric.Layer();

    layer.add(rect1, rect2);

    assert.ok(typeof layer.insertAt === 'function', 'should respond to `insertAt` method');

    layer.insertAt(rect1, 1);
    assert.equal(layer.item(1), rect1);
    layer.insertAt(rect2, 2);
    assert.equal(layer.item(2), rect2);
    assert.equal(layer.insertAt(rect1, 2), layer, 'should be chainable');
  });

  QUnit.test('dirty flag propagation from children up', function (assert) {
    var g1 = makeLayerWith4Objects();
    var obj = g1.item(0);
    g1.dirty = false;
    obj.dirty = false;
    g1.ownCaching = true;
    assert.equal(g1.dirty, false, 'Layer has no dirty flag set');
    obj.set('fill', 'red');
    assert.equal(obj.dirty, true, 'Obj has dirty flag set');
    assert.equal(g1.dirty, true, 'Layer has dirty flag set');
  });

  QUnit.test('dirty flag propagation from children up is stopped if layer is not caching', function (assert) {
    var g1 = makeLayerWith4Objects();
    var obj = g1.item(0);
    g1.dirty = false;
    obj.dirty = false;
    g1.ownCaching = false;
    assert.equal(g1.dirty, false, 'Layer has no dirty flag set');
    obj.set('fill', 'red');
    assert.equal(obj.dirty, true, 'Obj has dirty flag set');
    assert.equal(g1.dirty, false, 'Layer has no dirty flag set');
  });

  QUnit.test('dirty flag propagation from children up does not happen if value does not change really', function (assert) {
    var g1 = makeLayerWith4Objects();
    var obj = g1.item(0);
    obj.fill = 'red';
    g1.dirty = false;
    obj.dirty = false;
    g1.ownCaching = true;
    assert.equal(obj.dirty, false, 'Obj has no dirty flag set');
    assert.equal(g1.dirty, false, 'Layer has no dirty flag set');
    obj.set('fill', 'red');
    assert.equal(obj.dirty, false, 'Obj has no dirty flag set');
    assert.equal(g1.dirty, false, 'Layer has no dirty flag set');
  });

  QUnit.test('dirty flag propagation from children up with', function (assert) {
    var g1 = makeLayerWith4Objects();
    var obj = g1.item(0);
    g1.dirty = false;
    obj.dirty = false;
    // specify that the layer is caching or the test will fail under node since the
    // object caching is disabled by default
    g1.ownCaching = true;
    assert.equal(g1.dirty, false, 'Layer has no dirty flag set');
    obj.set('angle', 5);
    assert.equal(obj.dirty, false, 'Obj has dirty flag still false');
    assert.equal(g1.dirty, true, 'Layer has dirty flag set');
  });

  QUnit.test('_getCacheCanvasDimensions returns dimensions and zoom for cache canvas are influenced by layer', function (assert) {
    var g1 = makeLayerWith4Objects();
    var obj = g1.item(0);
    var dims = obj._getCacheCanvasDimensions();
    g1.scaleX = 2;
    var dims2 = obj._getCacheCanvasDimensions();
    assert.equal((dims2.width - 2), (dims.width - 2) * g1.scaleX, 'width of cache has increased with layer scale');
  });

  QUnit.test('test layer - pixels.', function (assert) {
    var rect1 = new fabric.Rect({ top: 1, left: 1, width: 2, height: 2, strokeWidth: 0, fill: 'red', opacity: 1, objectCaching: false }),
      rect2 = new fabric.Rect({ top: 5, left: 5, width: 2, height: 2, strokeWidth: 0, fill: 'red', opacity: 1, objectCaching: false }),
      layer = new fabric.Layer([rect1, rect2], { opacity: 1, fill: 'blue', strokeWidth: 0, objectCaching: false }),
      isTransparent = fabric.util.isTransparent,
      ctx = canvas.contextContainer;
    canvas.add(layer);
    canvas.renderAll();
    assert.equal(canvas.enableRetinaScaling, false, 'enable retina scaling is off');
    assert.equal(isTransparent(ctx, 0, 0, 0), true, '0,0 is transparent');
    assert.equal(isTransparent(ctx, 1, 1, 0), false, '1,1 is opaque');
    assert.equal(isTransparent(ctx, 2, 2, 0), false, '2,2 is opaque');
    assert.equal(isTransparent(ctx, 3, 3, 0), true, '3,3 is transparent');
    assert.equal(isTransparent(ctx, 4, 4, 0), true, '4,4 is transparent');
    assert.equal(isTransparent(ctx, 5, 5, 0), false, '5,5 is opaque');
    assert.equal(isTransparent(ctx, 6, 6, 0), false, '6,6 is opaque');
    assert.equal(isTransparent(ctx, 7, 7, 0), true, '7,7 is transparent');
  });

  QUnit.test('layer toDatalessObject', function (assert) {
    var rect1 = new fabric.Rect({ top: 1, left: 1, width: 2, height: 2, strokeWidth: 0, fill: 'red', opacity: 1, objectCaching: false }),
      rect2 = new fabric.Rect({ top: 5, left: 5, width: 2, height: 2, strokeWidth: 0, fill: 'red', opacity: 1, objectCaching: false }),
      pathLayer = new fabric.Layer([rect1, rect2], { sourcePath: 'sourcePath' }),
      layer = new fabric.Layer([pathLayer]),
      dataless = layer.toDatalessObject();

    assert.equal(dataless.objects[0].objects, 'sourcePath', 'the paths have been changed with the sourcePath');
  });

  QUnit.test('layer add', function (assert) {
    var rect1 = new fabric.Rect({ top: 1, left: 1, width: 2, height: 2, strokeWidth: 0, fill: 'red', opacity: 1, objectCaching: false }),
      rect2 = new fabric.Rect({ top: 5, left: 5, width: 2, height: 2, strokeWidth: 0, fill: 'red', opacity: 1, objectCaching: false }),
      layer = new fabric.Layer([rect1]);

    var coords = layer.oCoords;
    layer.add(rect2);
    var newCoords = layer.oCoords;
    assert.deepEqual(coords, newCoords, 'object coords have been recalculated - add');
  });

  QUnit.test('layer remove', function (assert) {
    var rect1 = new fabric.Rect({ top: 1, left: 1, width: 2, height: 2, strokeWidth: 0, fill: 'red', opacity: 1, objectCaching: false }),
      rect2 = new fabric.Rect({ top: 5, left: 5, width: 2, height: 2, strokeWidth: 0, fill: 'red', opacity: 1, objectCaching: false }),
      layer = new fabric.Layer([rect1, rect2]);

    var coords = layer.oCoords;
    layer.remove(rect2);
    var newCoords = layer.oCoords;
    assert.deepEqual(coords, newCoords, 'object coords have been recalculated - remove');
  });

  QUnit.test('layer willDrawShadow', function (assert) {
    var rect1 = new fabric.Rect({ top: 1, left: 1, width: 2, height: 2, strokeWidth: 0, fill: 'red', opacity: 1, objectCaching: false }),
      rect2 = new fabric.Rect({ top: 5, left: 5, width: 2, height: 2, strokeWidth: 0, fill: 'red', opacity: 1, objectCaching: false }),
      rect3 = new fabric.Rect({ top: 5, left: 5, width: 2, height: 2, strokeWidth: 0, fill: 'red', opacity: 1, objectCaching: false }),
      rect4 = new fabric.Rect({ top: 5, left: 5, width: 2, height: 2, strokeWidth: 0, fill: 'red', opacity: 1, objectCaching: false }),
      layer = new fabric.Layer([rect1, rect2]),
      layer2 = new fabric.Layer([rect3, rect4]),
      layer3 = new fabric.Layer([layer, layer2]);

    assert.equal(layer3.willDrawShadow(), false, 'layer will not cast shadow because objects do not have it');
    layer3.shadow = { offsetX: 1, offsetY: 2, };
    assert.equal(layer3.willDrawShadow(), true, 'layer will cast shadow because layer itself has shadow');
    delete layer3.shadow;
    layer2.shadow = { offsetX: 1, offsetY: 2, };
    assert.equal(layer3.willDrawShadow(), true, 'layer will cast shadow because inner layer2 has shadow');
    delete layer2.shadow;
    rect1.shadow = { offsetX: 1, offsetY: 2, };
    assert.equal(layer3.willDrawShadow(), true, 'layer will cast shadow because inner rect1 has shadow');
    assert.equal(layer.willDrawShadow(), true, 'layer will cast shadow because inner rect1 has shadow');
    assert.equal(layer2.willDrawShadow(), false, 'layer will not cast shadow because no child has shadow');
  });

  QUnit.test('layer willDrawShadow with no offsets', function (assert) {
    var rect1 = new fabric.Rect({ top: 1, left: 1, width: 2, height: 2, strokeWidth: 0, fill: 'red', opacity: 1, objectCaching: false }),
      rect2 = new fabric.Rect({ top: 5, left: 5, width: 2, height: 2, strokeWidth: 0, fill: 'red', opacity: 1, objectCaching: false }),
      rect3 = new fabric.Rect({ top: 5, left: 5, width: 2, height: 2, strokeWidth: 0, fill: 'red', opacity: 1, objectCaching: false }),
      rect4 = new fabric.Rect({ top: 5, left: 5, width: 2, height: 2, strokeWidth: 0, fill: 'red', opacity: 1, objectCaching: false }),
      layer = new fabric.Layer([rect1, rect2]),
      layer2 = new fabric.Layer([rect3, rect4]),
      layer3 = new fabric.Layer([layer, layer2]);

    assert.equal(layer3.willDrawShadow(), false, 'layer will not cast shadow because objects do not have it');
    layer3.shadow = { offsetX: 0, offsetY: 0 };
    assert.equal(layer3.willDrawShadow(), false, 'layer will NOT cast shadow because layer itself has shadow but not offsets');
    layer3.shadow = { offsetX: 2, offsetY: 0 };
    assert.equal(layer3.willDrawShadow(), true, 'layer will cast shadow because layer itself has shadow and one offsetX different than 0');
    layer3.shadow = { offsetX: 0, offsetY: 2 };
    assert.equal(layer3.willDrawShadow(), true, 'layer will cast shadow because layer itself has shadow and one offsetY different than 0');
    layer3.shadow = { offsetX: -2, offsetY: 0 };
    assert.equal(layer3.willDrawShadow(), true, 'layer will cast shadow because layer itself has shadow and one offsetX different than 0');
    layer3.shadow = { offsetX: 0, offsetY: -2 };
    assert.equal(layer3.willDrawShadow(), true, 'layer will cast shadow because layer itself has shadow and one offsetY different than 0');
    rect1.shadow = { offsetX: 1, offsetY: 2, };
    layer3.shadow = { offsetX: 0, offsetY: 0 };
    assert.equal(layer3.willDrawShadow(), true, 'layer will cast shadow because layer itself will not, but rect 1 will');

  });

  QUnit.test('layer shouldCache', function (assert) {
    var rect1 = new fabric.Rect({ top: 1, left: 1, width: 2, height: 2, strokeWidth: 0, fill: 'red', opacity: 1, objectCaching: true }),
      rect2 = new fabric.Rect({ top: 5, left: 5, width: 2, height: 2, strokeWidth: 0, fill: 'red', opacity: 1, objectCaching: true }),
      rect3 = new fabric.Rect({ top: 5, left: 5, width: 2, height: 2, strokeWidth: 0, fill: 'red', opacity: 1, objectCaching: true }),
      rect4 = new fabric.Rect({ top: 5, left: 5, width: 2, height: 2, strokeWidth: 0, fill: 'red', opacity: 1, objectCaching: true }),
      layer = new fabric.Layer([rect1, rect2], { objectCaching: true }),
      layer2 = new fabric.Layer([rect3, rect4], { objectCaching: true }),
      layer3 = new fabric.Layer([layer, layer2], { objectCaching: true });

    assert.equal(layer3.shouldCache(), true, 'layer3 will cache because no child has shadow');
    assert.equal(layer2.shouldCache(), false, 'layer2 will not cache because is drawing on parent layer3 cache');
    assert.equal(rect3.shouldCache(), false, 'rect3 will not cache because is drawing on parent2 layer cache');

    layer2.shadow = { offsetX: 2, offsetY: 0 };
    rect1.shadow = { offsetX: 0, offsetY: 2 };

    assert.equal(layer3.shouldCache(), false, 'layer3 will cache because children have shadow');
    assert.equal(layer2.shouldCache(), true, 'layer2 will cache because is not drawing on parent layer3 cache and no children have shadow');
    assert.equal(layer.shouldCache(), false, 'layer will not cache because even if is not drawing on parent layer3 cache children have shadow');

    assert.equal(rect1.shouldCache(), true, 'rect1 will cache because none of its parent is caching');
    assert.equal(rect3.shouldCache(), false, 'rect3 will not cache because layer2 is caching');

  });

  QUnit.test('canvas prop propagation with set', function (assert) {
    var rect1 = new fabric.Rect({ top: 1, left: 1, width: 2, height: 2, strokeWidth: 0, fill: 'red', opacity: 1, objectCaching: true }),
      rect2 = new fabric.Rect({ top: 5, left: 5, width: 2, height: 2, strokeWidth: 0, fill: 'red', opacity: 1, objectCaching: true }),
      layer = new fabric.Layer([rect1, rect2]);

    layer.set('canvas', 'a-canvas');
    assert.equal(layer.canvas, 'a-canvas', 'canvas has been set');
    assert.equal(layer._objects[0].canvas, 'a-canvas', 'canvas has been set on object 0');
    assert.equal(layer._objects[1].canvas, 'a-canvas', 'canvas has been set on object 1');
  });

  QUnit.test('canvas prop propagation with add', function (assert) {
    var rect1 = new fabric.Rect({ top: 1, left: 1, width: 2, height: 2, strokeWidth: 0, fill: 'red', opacity: 1, objectCaching: true }),
      rect2 = new fabric.Rect({ top: 5, left: 5, width: 2, height: 2, strokeWidth: 0, fill: 'red', opacity: 1, objectCaching: true }),
      layer = new fabric.Layer([rect1, rect2]);

    canvas.add(layer);
    assert.equal(layer.canvas, canvas, 'canvas has been set');
    assert.equal(layer._objects[0].canvas, canvas, 'canvas has been set on object 0');
    assert.equal(layer._objects[1].canvas, canvas, 'canvas has been set on object 1');
  });

  QUnit.test('canvas prop propagation with add to layer', function (assert) {
    var rect1 = new fabric.Rect({ top: 1, left: 1, width: 2, height: 2, strokeWidth: 0, fill: 'red', opacity: 1, objectCaching: true }),
      rect2 = new fabric.Rect({ top: 5, left: 5, width: 2, height: 2, strokeWidth: 0, fill: 'red', opacity: 1, objectCaching: true }),
      layer = new fabric.Layer();

    canvas.add(layer);
    assert.equal(layer.canvas, canvas, 'canvas has been set');
    layer.add(rect1);
    assert.equal(layer._objects[0].canvas, canvas, 'canvas has been set on object 0');
    layer.add(rect2);
    assert.equal(layer._objects[1].canvas, canvas, 'canvas has been set on object 0');
  });
  /*
    QUnit.test('add and coordinates', function (assert) {
      var rect1 = new fabric.Rect({ top: 1, left: 1, width: 3, height: 2, strokeWidth: 0, fill: 'red' }),
        rect2 = new fabric.Rect({ top: 5, left: 5, width: 2, height: 6, angle: 90, strokeWidth: 0, fill: 'red' }),
        layer = new fabric.Layer([]);
      layer.add(rect1);
      layer.add(rect2);
      layer.left = 5;
      layer.top = 5;
      layer.scaleX = 3;
      layer.scaleY = 2;
      layer.destroy();
      assert.equal(rect1.top, 5, 'top has been moved');
      assert.equal(rect1.left, 11, 'left has been moved');
      assert.equal(rect1.scaleX, 3, 'scaleX has been scaled');
      assert.equal(rect1.scaleY, 2, 'scaleY has been scaled');
      assert.equal(rect2.top, 13, 'top has been moved');
      assert.equal(rect2.left, 23, 'left has been moved');
      assert.equal(rect2.scaleX, 2, 'scaleX has been scaled inverted because of angle 90');
      assert.equal(rect2.scaleY, 3, 'scaleY has been scaled inverted because of angle 90');
    });
  
    QUnit.test('add and coordinates with nested layers', function (assert) {
      var rect1 = new fabric.Rect({ top: 1, left: 1, width: 3, height: 2, strokeWidth: 0, fill: 'red' }),
        rect2 = new fabric.Rect({ top: 5, left: 5, width: 2, height: 6, angle: 90, strokeWidth: 0, fill: 'red' }),
        layer0 = new fabric.Layer([rect1, rect2]),
        rect3 = new fabric.Rect({ top: 2, left: 9, width: 3, height: 2, strokeWidth: 0, fill: 'red' }),
        rect4 = new fabric.Rect({ top: 3, left: 5, width: 2, height: 6, angle: 90, strokeWidth: 0, fill: 'red' }),
        layer1 = new fabric.Layer([rect3, rect4], { scaleX: 3, scaleY: 4 }),
        layer = new fabric.Layer([layer0, layer1], { angle: 90, scaleX: 2, scaleY: 0.5 }),
        rect5 = new fabric.Rect({ top: 1, left: 1, width: 3, height: 2, strokeWidth: 0, fill: 'red' });
  
      layer1.add(rect5);
      assert.equal(rect5.top, -5.5, 'top has been moved');
      assert.equal(rect5.left, -19.5, 'left has been moved');
      assert.equal(rect5.scaleX, 2, 'scaleX has been scaled');
      assert.equal(rect5.scaleY, 0.5, 'scaleY has been scaled');
      layer.destroy();
      layer1.destroy();
      assert.equal(rect5.top, 1, 'top is back to original minus rounding errors');
      assert.equal(rect5.left, 1, 'left is back to original');
      assert.equal(rect5.scaleX, 1, 'scaleX is back to original');
      assert.equal(rect5.scaleY, 1, 'scaleY is back to original');
    });
  */
  // QUnit.test('cloning layer with image', function(assert) {
  //   var done = assert.async();
  //   var rect = new fabric.Rect({ top: 100, left: 100, width: 30, height: 10 }),
  //       img = new fabric.Image(_createImageElement()),
  //       layer = new fabric.Layer([ rect, img ]);

  //   img.src = 'foo.png';

  //   layer.clone(function(clone) {
  //     assert.ok(clone !== layer);
  //     assert.deepEqual(clone.toObject(), layer.toObject());

  //     done();
  //   });
  // });

})();
