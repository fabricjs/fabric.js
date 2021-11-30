(function() {
  var canvas = this.canvas = new fabric.StaticCanvas(null, { enableRetinaScaling: false, width: 600, height: 600 });
  
  /**
   * 
   * @returns {[fabric.Rect, fabric.Rect]}
   */
  function get2Objects() {
    return [
      new fabric.Rect({ top: 100, left: 100, width: 30, height: 10, strokeWidth: 0 }),
      new fabric.Rect({ top: 120, left: 50, width: 10, height: 40, strokeWidth: 0 })
    ];
  }

  function get2ObjectsWithOpacity() {
    return [
      new fabric.Rect({ top: 100, left: 100, width: 30, height: 10, strokeWidth: 0, opacity: 0.5 }),
      new fabric.Rect({ top: 120, left: 50, width: 10, height: 40, strokeWidth: 0, opacity: 0.8 })
    ];
  }

  function get4Objects() {
    return [
      new fabric.Rect({ top: 100, left: 100, width: 30, height: 10 }),
      new fabric.Rect({ top: 120, left: 50, width: 10, height: 40 }),
      new fabric.Rect({ top: 40, left: 0, width: 20, height: 40 }),
      new fabric.Rect({ top: 75, left: 75, width: 40, height: 40 })
    ];
  }

  function makeCollectionWith2Objects() {
    return new fabric.ICollection(get2Objects(), {strokeWidth: 0});
  }

  function makeCollectionWith2ObjectsWithOpacity() {
    return new fabric.ICollection(get2ObjectsWithOpacity(), {strokeWidth: 0,opacity:0.7});
  }

  function makeCollectionWith2ObjectsAndNoExport() {
    var objects = get2Objects();
    objects[1].excludeFromExport = true;
    return new fabric.ICollection(objects, { strokeWidth: 0 });
  }

  function makeCollectionWith4Objects() {
    return new fabric.ICollection(get4Objects());
  }

  function serializeObjects(arg, includeDefaultValues = false) {
    if (arg._objects) {
      var defaults = arg.includeDefaultValues;
      arg.includeDefaultValues = includeDefaultValues;
      var data = arg.toObject().objects;
      arg.includeDefaultValues = defaults;
      return data;
    }
    else if (Array.isArray(arg)) {
      return arg.map(o => {
        var defaults = o.includeDefaultValues;
        o.includeDefaultValues = includeDefaultValues;
        var data = o.toObject();
        o.includeDefaultValues = defaults;
        delete data.version;
        return data;
      });
    }
    throw new Error('bad input, can\'t serialize');
  }

  QUnit.module('fabric.ICollection', {
    afterEach: function() {
      fabric.Object.__uid = 0;
      canvas.clear();
      canvas.backgroundColor = fabric.Canvas.prototype.backgroundColor;
      canvas.calcOffset();
    }
  });

  QUnit.test('constructor', function(assert) {
    var collection = makeCollectionWith2Objects();

    assert.ok(collection);
    assert.ok(collection instanceof fabric.ICollection, 'should be instance of fabric.ICollection');
  });

  QUnit.test('toString', function(assert) {
    var collection = makeCollectionWith2Objects();
    assert.equal(collection.toString(), '#<fabric.ICollection: (2)>', 'should return proper representation');
  });

  QUnit.test('getObjects', function(assert) {
    var rect1 = new fabric.Rect(),
        rect2 = new fabric.Rect();

    var collection = new fabric.ICollection([rect1, rect2]);

    assert.ok(typeof collection.getObjects === 'function');
    assert.ok(Object.prototype.toString.call(collection.getObjects()) == '[object Array]', 'should be an array');
    assert.equal(collection.getObjects().length, 2, 'should have 2 items');
    assert.deepEqual(collection.getObjects(), [rect1, rect2], 'should return deepEqual objects as those passed to constructor');
  });

  QUnit.test('getObjects with type', function(assert) {
    var rect = new fabric.Rect({ width: 10, height: 20 }),
        circle = new fabric.Circle({ radius: 30 });

    var collection = new fabric.ICollection([rect, circle]);

    assert.equal(collection.size(), 2, 'should have length=2 initially');

    assert.deepEqual(collection.getObjects('rect'), [rect], 'should return rect only');
    assert.deepEqual(collection.getObjects('circle'), [circle], 'should return circle only');
  });

  QUnit.test('add', function(assert) {
    var collection = makeCollectionWith2Objects();
    var fired = [];
    var rect1 = new fabric.Rect(),
        rect2 = new fabric.Rect(),
        rect3 = new fabric.Rect();
    
    collection.getObjects()
      .concat(rect1, rect2, rect3).forEach(rect => rect.on('added', ({ target }) => {
        assert.equal(target, collection);
        fired.push(rect);
      }));

    assert.ok(typeof collection.add === 'function');
    assert.equal(collection.add(rect1), collection, 'should be chainable');
    assert.strictEqual(collection.item(collection.size() - 1), rect1, 'last object should be newly added one');
    assert.equal(collection.getObjects().length, 3, 'there should be 3 objects');
    assert.deepEqual(fired, [rect1]);

    collection.add(rect2, rect3);
    assert.strictEqual(collection.item(collection.size() - 1), rect3, 'last object should be last added one');
    assert.equal(collection.size(), 5, 'there should be 5 objects');
    assert.deepEqual(fired, [rect1, rect2, rect3]);
  });

  QUnit.test('insertAt', function (assert) {
    var rect1 = new fabric.Rect(),
      rect2 = new fabric.Rect(),
      collection = new fabric.ICollection();

    collection.add(rect1, rect2);

    assert.ok(typeof collection.insertAt === 'function', 'should respond to `insertAt` method');

    collection.insertAt(rect1, 1);
    assert.equal(collection.item(1), rect1);
    collection.insertAt(rect2, 2);
    assert.equal(collection.item(2), rect2);
    assert.equal(collection.insertAt(rect1, 2), collection, 'should be chainable');
  });

  QUnit.test('remove', function(assert) {
    var rect1 = new fabric.Rect(),
      rect2 = new fabric.Rect(),
      rect3 = new fabric.Rect(),
      rect4 = new fabric.Rect(),
      collection = new fabric.ICollection([rect1, rect2, rect3, rect4]),
      fired = [];

    collection.getObjects()
      .forEach(rect => rect.on('removed', ({ target }) => {
        assert.equal(target, collection);
        fired.push(rect);
      }));
    
    assert.ok(typeof collection.remove === 'function');
    assert.equal(collection.remove(rect2), collection, 'should be chainable');
    assert.deepEqual(collection.getObjects(), [rect1, rect3, rect4], 'should remove object properly');
    assert.deepEqual(fired, [rect2]);

    collection.remove(rect1, rect3);
    assert.deepEqual(collection.getObjects(), [rect4], 'should remove object properly');
    assert.deepEqual(fired, [rect2, rect1, rect3]);

    collection.remove(rect4);
    assert.equal(collection.isEmpty(), true, 'collection should be empty');
  });

  QUnit.test('removeAll', function (assert) {
    var rect1 = new fabric.Rect(),
      rect2 = new fabric.Rect(),
      rect3 = new fabric.Rect(),
      rect4 = new fabric.Rect(),
      collection = new fabric.ICollection([rect1, rect2, rect3, rect4]),
      fired = [];

    collection.getObjects()
      .forEach(rect => rect.on('removed', ({ target }) => {
        assert.equal(target, collection);
        fired.push(rect);
      }));

    assert.ok(typeof collection.removeAll === 'function');
    collection.removeAll();
    assert.deepEqual(fired, [rect1, rect2, rect3, rect4]);
    assert.equal(collection.isEmpty(), true, 'collection should be empty');
  });

  QUnit.test('size', function(assert) {
    var collection = makeCollectionWith2Objects();

    assert.ok(typeof collection.size === 'function');
    assert.equal(collection.size(), 2);
    collection.add(new fabric.Rect());
    assert.equal(collection.size(), 3);
    collection.remove(collection.getObjects()[0]);
    collection.remove(collection.getObjects()[0]);
    assert.equal(collection.size(), 1);
  });

  QUnit.test('set', function(assert) {
    var collection = makeCollectionWith2Objects(),
        firstObject = collection.getObjects()[0];

    assert.ok(typeof collection.set === 'function');

    assert.equal(collection.set('opacity', 0.12345), collection, 'should be chainable');
    assert.equal(collection.get('opacity'), 0.12345, 'collection\'s "own" property should be set properly');
    assert.equal(firstObject.get('opacity'), 1, 'objects\' value of non delegated property should stay same');

    collection.set('left', 1234);
    assert.equal(collection.get('left'), 1234, 'collection\'s own "left" property should be set properly');
    assert.ok(firstObject.get('left') !== 1234, 'objects\' value should not be affected');

    collection.set({ left: 888, top: 999 });
    assert.equal(collection.get('left'), 888, 'collection\'s own "left" property should be set properly via object');
    assert.equal(collection.get('top'), 999, 'collection\'s own "top" property should be set properly via object');
  });

  QUnit.test('contains', function(assert) {
    var rect1 = new fabric.Rect(),
      rect2 = new fabric.Rect(),
      deepRect = new fabric.Rect(),
      notIncludedRect = new fabric.Rect(),
      subCollection = new fabric.ICollection([deepRect]),
      collection = new fabric.ICollection([rect1, rect2, subCollection]);

    assert.ok(typeof collection.contains === 'function');

    assert.ok(collection.contains(rect1), 'should contain first object');
    assert.ok(collection.contains(rect2), 'should contain second object');
    assert.ok(collection.contains(subCollection), 'should contain second object');
    assert.ok(collection.contains(deepRect) === false, 'should not pass shallow contains');
    assert.ok(collection.contains(deepRect, true), 'should deep contain object');
    assert.ok(!collection.contains(notIncludedRect), 'should report not-included one properly');
  });

  QUnit.test('toObject', function(assert) {
    var collection = makeCollectionWith2Objects();

    assert.ok(typeof collection.toObject === 'function');

    var clone = collection.toObject();

    var expectedObject = {
      version:                  fabric.version,
      type:                     'iCollection',
      layout:                   'fit-content',
      originX:                  'left',
      originY:                  'top',
      left:                     50,
      top:                      100,
      width:                    80,
      height:                   60,
      fill:                     '',
      stroke:                   null,
      strokeWidth:              0,
      strokeDashArray:          null,
      strokeLineCap:            'butt',
      strokeDashOffset:         0,
      strokeLineJoin:           'miter',
      strokeMiterLimit:         4,
      scaleX:                   1,
      scaleY:                   1,
      shadow:                   null,
      visible:                  true,
      backgroundColor:          '',
      angle:                    0,
      flipX:                    false,
      flipY:                    false,
      opacity:                  1,
      fillRule:                 'nonzero',
      paintFirst:               'fill',
      globalCompositeOperation: 'source-over',
      skewX:                    0,
      skewY:                    0,
      objects:                  serializeObjects(collection, true),
      strokeUniform:            false
    };

    assert.deepEqual(clone, expectedObject);

    assert.ok(collection !== clone, 'should produce different object');
    assert.ok(collection.getObjects() !== clone.objects, 'should produce different object array');
    assert.ok(collection.getObjects()[0] !== clone.objects[0], 'should produce different objects in array');
  });

  QUnit.test('toObject without default values', function(assert) {
    var collection = makeCollectionWith2Objects();
    collection.includeDefaultValues = false;
    var clone = collection.toObject();
    var expectedObject = {
      version: fabric.version,
      type: 'iCollection',
      left: 50,
      top: 100,
      width: 80,
      height: 60,
      objects: serializeObjects(get2Objects())
    };
    assert.deepEqual(clone, expectedObject);
  });

  QUnit.test('toObject with excludeFromExport set on an object', function (assert) {
    var c1 = makeCollectionWith2Objects();
    var c2 = makeCollectionWith2ObjectsAndNoExport();
    assert.deepEqual(serializeObjects(c2), serializeObjects(c2._objects.filter(obj => !obj.excludeFromExport)));
    var clone = c1.toObject();
    var clone2 = c2.toObject();
    delete clone.objects;
    delete clone2.objects;
    assert.deepEqual(clone, clone2);
  });

  QUnit.test('Collection does not mutate objects', function (assert) {
    assert.deepEqual(serializeObjects(makeCollectionWith2Objects()), serializeObjects(get2Objects()), 'should return deepEqual objects as those passed to constructor');
    assert.deepEqual(serializeObjects(makeCollectionWith2ObjectsWithOpacity()), serializeObjects(get2ObjectsWithOpacity()), 'should return deepEqual objects as those passed to constructor');
    assert.deepEqual(serializeObjects(makeCollectionWith4Objects()), serializeObjects(get4Objects()), 'should return deepEqual objects as those passed to constructor');
  });

  QUnit.test('render', function(assert) {
    var collection = makeCollectionWith2Objects();
    assert.ok(typeof collection.render === 'function');
  });

  QUnit.test('item', function(assert) {
    var collection = makeCollectionWith2Objects();

    assert.ok(typeof collection.item === 'function');
    assert.equal(collection.item(0), collection.getObjects()[0]);
    assert.equal(collection.item(1), collection.getObjects()[1]);
    assert.equal(collection.item(9999), undefined);
  });

  QUnit.test('moveTo', function(assert) {
    var collection = makeCollectionWith4Objects(),
        groupEl1 = collection.getObjects()[0],
        groupEl2 = collection.getObjects()[1],
        groupEl3 = collection.getObjects()[2],
        groupEl4 = collection.getObjects()[3];

    assert.ok(typeof collection.item(0).moveTo === 'function');

    // [ 1, 2, 3, 4 ]
    assert.equal(collection.item(0), groupEl1);
    assert.equal(collection.item(1), groupEl2);
    assert.equal(collection.item(2), groupEl3);
    assert.equal(collection.item(3), groupEl4);
    assert.equal(collection.item(9999), undefined);

    collection.item(0).moveTo(3);

    // moved 1 to level 3 — [2, 3, 4, 1]
    assert.equal(collection.item(3), groupEl1);
    assert.equal(collection.item(0), groupEl2);
    assert.equal(collection.item(1), groupEl3);
    assert.equal(collection.item(2), groupEl4);
    assert.equal(collection.item(9999), undefined);

    collection.item(0).moveTo(2);

    // moved 2 to level 2 — [3, 4, 2, 1]
    assert.equal(collection.item(3), groupEl1);
    assert.equal(collection.item(2), groupEl2);
    assert.equal(collection.item(0), groupEl3);
    assert.equal(collection.item(1), groupEl4);
    assert.equal(collection.item(9999), undefined);
  });

  QUnit.test('complexity', function(assert) {
    var collection = makeCollectionWith2Objects();

    assert.ok(typeof collection.complexity === 'function');
    assert.equal(collection.complexity(), 2);
  });

  QUnit.test('containsPoint', function(assert) {

    var collection = makeCollectionWith2Objects();
    collection.set({ originX: 'center', originY: 'center' }).setCoords();

    //  Rect #1     top: 100, left: 100, width: 30, height: 10
    //  Rect #2     top: 120, left: 50, width: 10, height: 40

    assert.ok(typeof collection.containsPoint === 'function');

    assert.ok(!collection.containsPoint({ x: 0, y: 0 }));

    collection.scale(2);
    assert.ok(collection.containsPoint({ x: 50, y: 120 }));
    assert.ok(collection.containsPoint({ x: 100, y: 160 }));
    assert.ok(!collection.containsPoint({ x: 0, y: 0 }));

    collection.scale(1);
    collection.padding = 30;
    collection.setCoords();
    assert.ok(collection.containsPoint({ x: 50, y: 120 }));
    assert.ok(!collection.containsPoint({ x: 100, y: 170 }));
    assert.ok(!collection.containsPoint({ x: 0, y: 0 }));
  });

  QUnit.test('forEachObject', function(assert) {
    var collection = makeCollectionWith2Objects();

    assert.ok(typeof collection.forEachObject === 'function');
    assert.equal(collection.forEachObject(function(){}), collection, 'should be chainable');

    var iteratedObjects = [];
    collection.forEachObject(function(groupObject) {
      iteratedObjects.push(groupObject);
    });

    assert.equal(iteratedObjects[0], collection.getObjects()[0], 'iteration give back objects in same order');
    assert.equal(iteratedObjects[1], collection.getObjects()[1], 'iteration give back objects in same order');
  });

  QUnit.test('fromObject', function(assert) {
    var done = assert.async();
    var collection = makeCollectionWith2ObjectsWithOpacity();

    assert.ok(typeof fabric.ICollection.fromObject === 'function');
    var groupObject = collection.toObject();

    fabric.ICollection.fromObject(groupObject, function(newGroupFromObject) {

      var objectFromOldGroup = collection.toObject();
      var objectFromNewGroup = newGroupFromObject.toObject();

      assert.ok(newGroupFromObject instanceof fabric.ICollection);

      assert.deepEqual(objectFromOldGroup.objects[0], objectFromNewGroup.objects[0]);
      assert.deepEqual(objectFromOldGroup.objects[1], objectFromNewGroup.objects[1]);

      // delete `objects` arrays, since `assertHashEqual` fails to compare them for equality
      delete objectFromOldGroup.objects;
      delete objectFromNewGroup.objects;

      assert.deepEqual(objectFromOldGroup, objectFromNewGroup);

      done();
    });
  });

  QUnit.test('fromObject with clipPath', function(assert) {
    var done = assert.async();
    var clipPath = new fabric.Rect({
      width: 500,
      height: 250,
      top: 0,
      left: 0,
      absolutePositioned: true
    });

    var groupObject = new fabric.ICollection([
      new fabric.Rect({ width: 100, height: 100, fill: 'red' }),
      new fabric.Rect({ width: 100, height: 100, fill: 'yellow', left: 100 }),
      new fabric.Rect({ width: 100, height: 100, fill: 'blue', top: 100 }),
      new fabric.Rect({ width: 100, height: 100, fill: 'green', left: 100, top: 100 })
    ]);
    groupObject.clipPath = clipPath;

    var groupToObject = groupObject.toObject();

    fabric.ICollection.fromObject(groupToObject, function(newGroupFromObject) {

      var objectFromNewGroup = newGroupFromObject.toObject();

      assert.ok(newGroupFromObject instanceof fabric.ICollection);
      assert.ok(newGroupFromObject.clipPath instanceof fabric.Rect, 'clipPath has been restored');
      assert.deepEqual(objectFromNewGroup, groupToObject, 'double serialization gives same results');

      done();
    });
  });

  QUnit.test('fromObject does not delete objects from source', function(assert) {
    var done = assert.async();
    var collection = makeCollectionWith2ObjectsWithOpacity();
    var groupObject = collection.toObject();

    fabric.ICollection.fromObject(groupObject, function(newGroupFromObject) {
      assert.equal(newGroupFromObject.objects, undefined, 'the objects array has not been pulled in');
      assert.notEqual(groupObject.objects, undefined, 'the objects array has not been deleted from object source');
      done();
    });
  });

  QUnit.test('fromObject with svg url', function(assert) {
    var done = assert.async();
    var url = 'data:image/svg+xml,%3csvg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="612px" height="502.174px" viewBox="0 65.326 612 502.174" enable-background="new 0 65.326 612 502.174" xml:space="preserve"%3e %3cellipse fill="%23C6C6C6" cx="283.5" cy="487.5" rx="259" ry="80"/%3e %3cpath id="bird" d="M210.333%2c65.331C104.367%2c66.105-12.349%2c150.637%2c1.056%2c276.449c4.303%2c40.393%2c18.533%2c63.704%2c52.171%2c79.03 c36.307%2c16.544%2c57.022%2c54.556%2c50.406%2c112.954c-9.935%2c4.88-17.405%2c11.031-19.132%2c20.015c7.531-0.17%2c14.943-0.312%2c22.59%2c4.341 c20.333%2c12.375%2c31.296%2c27.363%2c42.979%2c51.72c1.714%2c3.572%2c8.192%2c2.849%2c8.312-3.078c0.17-8.467-1.856-17.454-5.226-26.933 c-2.955-8.313%2c3.059-7.985%2c6.917-6.106c6.399%2c3.115%2c16.334%2c9.43%2c30.39%2c13.098c5.392%2c1.407%2c5.995-3.877%2c5.224-6.991 c-1.864-7.522-11.009-10.862-24.519-19.229c-4.82-2.984-0.927-9.736%2c5.168-8.351l20.234%2c2.415c3.359%2c0.763%2c4.555-6.114%2c0.882-7.875 c-14.198-6.804-28.897-10.098-53.864-7.799c-11.617-29.265-29.811-61.617-15.674-81.681c12.639-17.938%2c31.216-20.74%2c39.147%2c43.489 c-5.002%2c3.107-11.215%2c5.031-11.332%2c13.024c7.201-2.845%2c11.207-1.399%2c14.791%2c0c17.912%2c6.998%2c35.462%2c21.826%2c52.982%2c37.309 c3.739%2c3.303%2c8.413-1.718%2c6.991-6.034c-2.138-6.494-8.053-10.659-14.791-20.016c-3.239-4.495%2c5.03-7.045%2c10.886-6.876 c13.849%2c0.396%2c22.886%2c8.268%2c35.177%2c11.218c4.483%2c1.076%2c9.741-1.964%2c6.917-6.917c-3.472-6.085-13.015-9.124-19.18-13.413 c-4.357-3.029-3.025-7.132%2c2.697-6.602c3.905%2c0.361%2c8.478%2c2.271%2c13.908%2c1.767c9.946-0.925%2c7.717-7.169-0.883-9.566 c-19.036-5.304-39.891-6.311-61.665-5.225c-43.837-8.358-31.554-84.887%2c0-90.363c29.571-5.132%2c62.966-13.339%2c99.928-32.156 c32.668-5.429%2c64.835-12.446%2c92.939-33.85c48.106-14.469%2c111.903%2c16.113%2c204.241%2c149.695c3.926%2c5.681%2c15.819%2c9.94%2c9.524-6.351 c-15.893-41.125-68.176-93.328-92.13-132.085c-24.581-39.774-14.34-61.243-39.957-91.247 c-21.326-24.978-47.502-25.803-77.339-17.365c-23.461%2c6.634-39.234-7.117-52.98-31.273C318.42%2c87.525%2c265.838%2c64.927%2c210.333%2c65.331 z M445.731%2c203.01c6.12%2c0%2c11.112%2c4.919%2c11.112%2c11.038c0%2c6.119-4.994%2c11.111-11.112%2c11.111s-11.038-4.994-11.038-11.111 C434.693%2c207.929%2c439.613%2c203.01%2c445.731%2c203.01z"/%3e %3c/svg%3e';
    var groupObject = {
      left: 10,
      top: 10,
      objects: url
    };
    fabric.ICollection.fromObject(groupObject, function(newGroupFromObject) {
      assert.equal(newGroupFromObject.sourcePath, url, 'the url is copied in sourcePath');
      assert.equal(newGroupFromObject._objects.length, 2, '2 objects are created');
      done();
    });
  });

  QUnit.test('toSVG', function (assert) {
    var collection = makeCollectionWith2Objects();
    assert.ok(typeof collection.toSVG === 'function');
    var expectedSVG = '<g transform=\"matrix(1 0 0 1 90 130)\"  >\n<g style=\"stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: none; fill-rule: nonzero; opacity: 1;\"   >\n<g transform=\"matrix(1 0 0 1 -90 -130)\">\n\t\t<g transform=\"matrix(1 0 0 1 115 105)\"  >\n<rect style=\"stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;\"  x=\"-15\" y=\"-5\" rx=\"0\" ry=\"0\" width=\"30\" height=\"10\" />\n</g>\n\t\t<g transform=\"matrix(1 0 0 1 55 140)\"  >\n<rect style=\"stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;\"  x=\"-5\" y=\"-20\" rx=\"0\" ry=\"0\" width=\"10\" height=\"40\" />\n</g>\n</g>\n</g>\n</g>\n';
    assert.equal(collection.toSVG(), expectedSVG);
  });

  QUnit.test('toSVG with unapplied matrix diff', function (assert) {
    var collection = makeCollectionWith2Objects();
    collection.subTargetCheck = false;
    collection.set({ scaleX: 2 });
    collection.calcOwnMatrix();
    collection._applyMatrixDiff();
    var expectedSVG = '<g transform=\"matrix(2 0 0 1 130 130)\"  >\n<g style=\"stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: none; fill-rule: nonzero; opacity: 1;\"   >\n<g transform=\"matrix(0.5 0 0 1 -65 -130)\">\n\t\t<g transform=\"matrix(1 0 0 1 115 105)\"  >\n<rect style=\"stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;\"  x=\"-15\" y=\"-5\" rx=\"0\" ry=\"0\" width=\"30\" height=\"10\" />\n</g>\n\t\t<g transform=\"matrix(1 0 0 1 55 140)\"  >\n<rect style=\"stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;\"  x=\"-5\" y=\"-20\" rx=\"0\" ry=\"0\" width=\"10\" height=\"40\" />\n</g>\n</g>\n</g>\n</g>\n';
    assert.equal(collection.toSVG(), expectedSVG);
  });

  QUnit.test('toSVG with a clipPath', function(assert) {
    var collection = makeCollectionWith2Objects();
    collection.clipPath = new fabric.Rect({ width: 100, height: 100 });
    var expectedSVG = '<g transform=\"matrix(1 0 0 1 90 130)\" clip-path=\"url(#CLIPPATH_0)\"  >\n<clipPath id=\"CLIPPATH_0\" >\n\t<rect transform=\"matrix(1 0 0 1 50.5 50.5)\" x=\"-50\" y=\"-50\" rx=\"0\" ry=\"0\" width=\"100\" height=\"100\" />\n</clipPath>\n<g style=\"stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: none; fill-rule: nonzero; opacity: 1;\"   >\n<g transform=\"matrix(1 0 0 1 -90 -130)\">\n\t\t<g transform=\"matrix(1 0 0 1 115 105)\"  >\n<rect style=\"stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;\"  x=\"-15\" y=\"-5\" rx=\"0\" ry=\"0\" width=\"30\" height=\"10\" />\n</g>\n\t\t<g transform=\"matrix(1 0 0 1 55 140)\"  >\n<rect style=\"stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;\"  x=\"-5\" y=\"-20\" rx=\"0\" ry=\"0\" width=\"10\" height=\"40\" />\n</g>\n</g>\n</g>\n</g>\n';
    assert.equal(collection.toSVG(), expectedSVG);
  });

  QUnit.test('toSVG with a clipPath absolutePositioned', function(assert) {
    var collection = makeCollectionWith2Objects();
    collection.clipPath = new fabric.Rect({ width: 100, height: 100 });
    collection.clipPath.absolutePositioned = true;
    var expectedSVG = '<g clip-path=\"url(#CLIPPATH_0)\"  >\n<g transform=\"matrix(1 0 0 1 90 130)\"  >\n<clipPath id=\"CLIPPATH_0\" >\n\t<rect transform=\"matrix(1 0 0 1 50.5 50.5)\" x=\"-50\" y=\"-50\" rx=\"0\" ry=\"0\" width=\"100\" height=\"100\" />\n</clipPath>\n<g style=\"stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: none; fill-rule: nonzero; opacity: 1;\"   >\n<g transform=\"matrix(1 0 0 1 -90 -130)\">\n\t\t<g transform=\"matrix(1 0 0 1 115 105)\"  >\n<rect style=\"stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;\"  x=\"-15\" y=\"-5\" rx=\"0\" ry=\"0\" width=\"30\" height=\"10\" />\n</g>\n\t\t<g transform=\"matrix(1 0 0 1 55 140)\"  >\n<rect style=\"stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;\"  x=\"-5\" y=\"-20\" rx=\"0\" ry=\"0\" width=\"10\" height=\"40\" />\n</g>\n</g>\n</g>\n</g>\n</g>\n';
    assert.equal(collection.toSVG(), expectedSVG);
  });

  QUnit.test('toSVG with a collection as a clipPath', function(assert) {
    var collection = makeCollectionWith2Objects();
    collection.clipPath = makeCollectionWith2Objects();
    var expectedSVG = '<g transform=\"matrix(1 0 0 1 90 130)\" clip-path=\"url(#CLIPPATH_0)\"  >\n<clipPath id=\"CLIPPATH_0\" >\n\t\t<rect transform=\"matrix(1 0 0 1 115 105)\" x=\"-15\" y=\"-5\" rx=\"0\" ry=\"0\" width=\"30\" height=\"10\" />\n\t\t<rect transform=\"matrix(1 0 0 1 55 140)\" x=\"-5\" y=\"-20\" rx=\"0\" ry=\"0\" width=\"10\" height=\"40\" />\n</clipPath>\n<g style=\"stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: none; fill-rule: nonzero; opacity: 1;\"   >\n<g transform=\"matrix(1 0 0 1 -90 -130)\">\n\t\t<g transform=\"matrix(1 0 0 1 115 105)\"  >\n<rect style=\"stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;\"  x=\"-15\" y=\"-5\" rx=\"0\" ry=\"0\" width=\"30\" height=\"10\" />\n</g>\n\t\t<g transform=\"matrix(1 0 0 1 55 140)\"  >\n<rect style=\"stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;\"  x=\"-5\" y=\"-20\" rx=\"0\" ry=\"0\" width=\"10\" height=\"40\" />\n</g>\n</g>\n</g>\n</g>\n';
    assert.equal(collection.toSVG(), expectedSVG);
  });

  QUnit.test('cloning collection with 2 objects', function(assert) {
    var done = assert.async();
    var collection = makeCollectionWith2Objects();
    collection.clone(function(clone) {

      assert.ok(clone !== collection);
      assert.deepEqual(clone.toObject(), collection.toObject());

      done();
    });
  });

  QUnit.test('z-index methods with collection objects', function(assert) {

    var textBg = new fabric.Rect({
      fill: '#abc',
      width: 100,
      height: 100
    });

    var text = new fabric.Text('text');
    var collection = new fabric.ICollection([textBg, text]);

    canvas.add(collection);

    assert.ok(collection.getObjects()[0] === textBg);
    assert.ok(collection.getObjects()[1] === text);

    textBg.bringToFront();

    assert.ok(collection.getObjects()[0] === text);
    assert.ok(collection.getObjects()[1] === textBg);

    textBg.sendToBack();

    assert.ok(collection.getObjects()[0] === textBg);
    assert.ok(collection.getObjects()[1] === text);
  });

  QUnit.test('reference on an object', function(assert) {
    var collection = makeCollectionWith2Objects();
    var firstObjInGroup = collection.getObjects()[0];
    var secondObjInGroup = collection.getObjects()[1];

    assert.equal(firstObjInGroup.parent, collection);
    assert.equal(secondObjInGroup.parent, collection);

    collection.remove(firstObjInGroup);
    assert.ok(typeof firstObjInGroup.collection === 'undefined');
  });

  QUnit.test('dirty flag propagation from children up', function(assert) {
    var g1 = makeCollectionWith4Objects();
    var obj = g1.item(0);
    g1.dirty = false;
    obj.dirty = false;
    g1.ownCaching = true;
    assert.equal(g1.dirty, false, 'ICollection has no dirty flag set');
    obj.set('fill', 'red');
    assert.equal(obj.dirty, true, 'Obj has dirty flag set');
    assert.equal(g1.dirty, true, 'ICollection has dirty flag set');
  });

  QUnit.test('dirty flag propagation from children up is stopped if collection is not caching', function(assert) {
    var g1 = makeCollectionWith4Objects();
    var obj = g1.item(0);
    g1.dirty = false;
    obj.dirty = false;
    g1.ownCaching = false;
    assert.equal(g1.dirty, false, 'ICollection has no dirty flag set');
    obj.set('fill', 'red');
    assert.equal(obj.dirty, true, 'Obj has dirty flag set');
    assert.equal(g1.dirty, false, 'ICollection has no dirty flag set');
  });

  QUnit.test('dirty flag propagation from children up does not happen if value does not change really', function(assert) {
    var g1 = makeCollectionWith4Objects();
    var obj = g1.item(0);
    obj.fill = 'red';
    g1.dirty = false;
    obj.dirty = false;
    g1.ownCaching = true;
    assert.equal(obj.dirty, false, 'Obj has no dirty flag set');
    assert.equal(g1.dirty, false, 'ICollection has no dirty flag set');
    obj.set('fill', 'red');
    assert.equal(obj.dirty, false, 'Obj has no dirty flag set');
    assert.equal(g1.dirty, false, 'ICollection has no dirty flag set');
  });

  QUnit.test('dirty flag propagation from children up with', function(assert) {
    var g1 = makeCollectionWith4Objects();
    var obj = g1.item(0);
    g1.dirty = false;
    obj.dirty = false;
    // specify that the collection is caching or the test will fail under node since the
    // object caching is disabled by default
    g1.ownCaching = true;
    assert.equal(g1.dirty, false, 'ICollection has no dirty flag set');
    obj.set('angle', 5);
    assert.equal(obj.dirty, false, 'Obj has dirty flag still false');
    assert.equal(g1.dirty, true, 'ICollection has dirty flag set');
  });

  QUnit.test('_getCacheCanvasDimensions returns dimensions and zoom for cache canvas are influenced by collection', function(assert) {
    var g1 = makeCollectionWith4Objects();
    var obj = g1.item(0);
    var dims = obj._getCacheCanvasDimensions();
    g1.scaleX = 2;
    var dims2 = obj._getCacheCanvasDimensions();
    g1._applyMatrixDiff();
    assert.deepEqual(dims, dims2, 'width of cache has increased with collection scale');
  });

  QUnit.test('test collection - pixels.', function(assert) {
    var rect1 = new fabric.Rect({ top: 1, left: 1, width: 2, height: 2, strokeWidth: 0, fill: 'red', opacity: 1, objectCaching: false}),
        rect2 = new fabric.Rect({ top: 5, left: 5, width: 2, height: 2, strokeWidth: 0, fill: 'red', opacity: 1, objectCaching: false}),
        collection = new fabric.ICollection([rect1, rect2], {opacity: 1, fill: 'blue', strokeWidth: 0, objectCaching: false}),
        isTransparent = fabric.util.isTransparent,
        ctx = canvas.contextContainer;
    canvas.add(collection);
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

  QUnit.test('collection toDatalessObject', function(assert) {
    var rect1 = new fabric.Rect({ top: 1, left: 1, width: 2, height: 2, strokeWidth: 0, fill: 'red', opacity: 1, objectCaching: false}),
        rect2 = new fabric.Rect({ top: 5, left: 5, width: 2, height: 2, strokeWidth: 0, fill: 'red', opacity: 1, objectCaching: false}),
        pathGroup = new fabric.ICollection([rect1, rect2], { sourcePath: 'sourcePath'}),
        collection = new fabric.ICollection([pathGroup]),
        dataless = collection.toDatalessObject();

    assert.equal(dataless.objects[0].objects, 'sourcePath', 'the paths have been changed with the sourcePath');
  });

  QUnit.test('canvas prop propagation with set', function(assert) {
    var rect1 = new fabric.Rect({ top: 1, left: 1, width: 2, height: 2, strokeWidth: 0, fill: 'red', opacity: 1, objectCaching: true}),
        rect2 = new fabric.Rect({ top: 5, left: 5, width: 2, height: 2, strokeWidth: 0, fill: 'red', opacity: 1, objectCaching: true}),
        collection = new fabric.ICollection([rect1, rect2]);

    collection.set('canvas', 'a-canvas');
    assert.equal(collection.canvas, 'a-canvas', 'canvas has been set');
    assert.equal(collection._objects[0].canvas, 'a-canvas', 'canvas has been set on object 0');
    assert.equal(collection._objects[1].canvas, 'a-canvas', 'canvas has been set on object 1');
  });

  QUnit.test('canvas prop propagation with add', function(assert) {
    var rect1 = new fabric.Rect({ top: 1, left: 1, width: 2, height: 2, strokeWidth: 0, fill: 'red', opacity: 1, objectCaching: true}),
        rect2 = new fabric.Rect({ top: 5, left: 5, width: 2, height: 2, strokeWidth: 0, fill: 'red', opacity: 1, objectCaching: true}),
        rect3 = new fabric.Rect({ top: 9, left: 9, width: 2, height: 2, strokeWidth: 0, fill: 'red', opacity: 1, objectCaching: true}),
        rect4 = new fabric.Rect({ top: 13, left: 13, width: 2, height: 2, strokeWidth: 0, fill: 'red', opacity: 1, objectCaching: true}),
        collection = new fabric.ICollection([rect1, rect2]);

    canvas.add(collection);
    collection.add(rect3);
    collection.insertAt(rect4, 0);
    assert.equal(collection.canvas, canvas, 'canvas has been set');
    collection.forEachObject(obj => assert.equal(obj.canvas, canvas, 'canvas has been set on object'));
  });

  QUnit.test('apply matrix diff', function (assert) {
    var rect = new fabric.Rect({ width: 10, height: 10 });
    var rStart = rect.calcTransformMatrix();
    var collection = new fabric.ICollection([rect]);
    var cStart = collection.calcOwnMatrix();
    var transform = { scaleX: 2 };
    collection.set(transform);
    assert.deepEqual(rect.calcTransformMatrix(), rStart, 'object should not be transformed by diff');
    collection.calcOwnMatrix()
    collection._applyMatrixDiff();
    var expected = fabric.util.multiplyTransformMatrices(fabric.util.composeMatrix(transform), rStart);
    assert.deepEqual(rect.calcTransformMatrix(), expected, 'object should be transformed by diff');
    transform = { scaleX: 1, left: 50 };
    expected = fabric.util.multiplyTransformMatrices(fabric.util.composeMatrix(transform), expected);
    assert.deepEqual(rect.calcTransformMatrix(), expected, 'object should be transformed by diff');
    collection.set(transform);
    collection.calcOwnMatrix()
    collection._applyMatrixDiff();
    expected = rStart.concat();
    expected[4] += 50;
    assert.deepEqual(rect.calcTransformMatrix(), expected, 'object should be transformed by diff');
    transform = { scaleY: 0.5 };
    collection.subTargetCheck = false;
    collection.set(transform);
    assert.notDeepEqual(collection.calcOwnMatrix(), cStart, 'matrix should be different');
    collection._applyMatrixDiff();
    assert.deepEqual(rect.calcTransformMatrix(), expected, 'object should not be transformed by diff when `subTargetCheck = false`');
  });

  QUnit.test('object monitors', function (assert) {
    var collection = makeCollectionWith4Objects();
    var fired = false;
    collection.__objectMonitor = () => {
      fired = true;
    }
    collection.forEachObject(object => {
      assert.deepEqual(Object.keys(object.__eventListeners), ['modified', 'selected', 'deselected']);
    });
    var item = collection.item(0);
    collection.remove(item);
    item.fire('modified');
    assert.equal(fired, false, 'removed object should not trigger monitor');
    collection.add(item);
    item.fire('modified');
    assert.equal(fired, true, 'added object should trigger monitor');
  });

  QUnit.test('selection monitor', function (assert) {
    var collection = makeCollectionWith4Objects();
    var fireSelectionEvent = (type, target) => {
      target.fire(type, { target });
    }
    assert.deepEqual(collection._activeObjects, [], 'initial state');
    fireSelectionEvent('selected', collection.item(0));
    assert.equal(collection._activeObjects.length, 1, 'item(0) should be selected');
    assert.deepEqual(collection._activeObjects, [collection.item(0)], 'item(0) should be selected');
    fireSelectionEvent('deselected', collection.item(0));
    assert.deepEqual(collection._activeObjects, [], 'initial state');
    fireSelectionEvent('selected', collection.item(3));
    assert.deepEqual(collection._activeObjects, [collection.item(3)], 'item(3) should be selected');
    var removed = collection.item(3);
    collection.remove(removed);
    assert.deepEqual(collection._activeObjects, [], 'item(3) should not be selected');
    fireSelectionEvent('selected', removed);
    assert.deepEqual(collection._activeObjects, [], 'item(3) should not be selected');
    fireSelectionEvent('selected', collection.item(1));
    fireSelectionEvent('selected', collection.item(2));
    assert.equal(collection._activeObjects.length, collection._objects.slice(1).length, 'item(1) item(2) should be selected');
    assert.deepEqual(collection._activeObjects, collection._objects.slice(1), 'item(1) item(2) should be selected');
  });

  QUnit.test('render objects without selected objects', function (assert) {
    var collection = makeCollectionWith4Objects();
    var rendered = [],
      ctx = {
        transform() { },
        save() { },
        restore() { },
      };
    var fireSelectionEvent = (type, target) => {
      target.fire(type, { target });
    }
    collection.forEachObject(object => {
      object.render = () => rendered.push(object);
    });
    var render = () => {
      rendered = [];
      collection.render(ctx);
    }
    assert.deepEqual(rendered, [], 'initial state');
    render();
    assert.deepEqual(rendered, collection._objects, 'should render all objects');
    fireSelectionEvent('selected', collection.item(0));
    render();
    assert.deepEqual(rendered, collection._objects.slice(1), 'should render all objects except item(0)');
    fireSelectionEvent('deselected', collection.item(0));
    render();
    assert.deepEqual(rendered, collection._objects, 'should render all objects');
    fireSelectionEvent('selected', collection.item(1));
    render();
    var objects = collection._objects.slice();
    objects.splice(1, 1);
    assert.deepEqual(rendered, objects, 'should render all objects except item(1)');
    fireSelectionEvent('selected', collection.item(2));
    objects.splice(1, 1);
    render();
    assert.deepEqual(rendered, objects, 'should render all objects except item(1) & item(2)');
  });

})();
