(function() {
  var canvas = this.canvas = new fabric.StaticCanvas(null, {enableRetinaScaling: false, width: 600, height: 600});

  function makeLayerWith2Objects(performLayout, subTargetCheck, interactive) {
    var rect1 = new fabric.Rect({ top: 100, left: 100, width: 30, height: 10, strokeWidth: 0 }),
        rect2 = new fabric.Rect({ top: 120, left: 50, width: 10, height: 40, strokeWidth: 0 });

    var layer = new fabric.Layer([rect1, rect2], { strokeWidth: 0 });
    if (performLayout) {
      new fabric.Group([layer], { subTargetCheck, interactive });
    }
    return layer;
  }

  function makeLayerWith2ObjectsWithOpacity(performLayout, subTargetCheck, interactive) {
    var rect1 = new fabric.Rect({ top: 100, left: 100, width: 30, height: 10, strokeWidth: 0, opacity: 0.5 }),
        rect2 = new fabric.Rect({ top: 120, left: 50, width: 10, height: 40, strokeWidth: 0, opacity: 0.8 });

    var layer = new fabric.Layer([rect1, rect2], { strokeWidth: 0 });
    if (performLayout) {
      new fabric.Group([layer], { subTargetCheck, interactive });
    }
    return layer;
  }

  function makeLayerWith2ObjectsAndNoExport(performLayout, subTargetCheck, interactive) {
    var rect1 = new fabric.Rect({ top: 100, left: 100, width: 30, height: 10, strokeWidth: 0 }),
      rect2 = new fabric.Rect({ top: 120, left: 50, width: 10, height: 40, strokeWidth: 0, excludeFromExport: true });

    var layer = new fabric.Layer([rect1, rect2], { strokeWidth: 0 });
    if (performLayout) {
      new fabric.Group([layer], { subTargetCheck, interactive });
    }
    return layer;
  }

  function makeLayerWith4Objects(performLayout, subTargetCheck, interactive) {
    var rect1 = new fabric.Rect({ top: 100, left: 100, width: 30, height: 10 }),
        rect2 = new fabric.Rect({ top: 120, left: 50, width: 10, height: 40 }),
        rect3 = new fabric.Rect({ top: 40, left: 0, width: 20, height: 40 }),
        rect4 = new fabric.Rect({ top: 75, left: 75, width: 40, height: 40 });

    var layer = new fabric.Layer([rect1, rect2, rect3, rect4]);
    if (performLayout) {
      new fabric.Group([layer], { subTargetCheck, interactive });
    }
    return layer;
  }

  QUnit.module('fabric.Layer', {
    afterEach: function() {
      fabric.Object.__uid = 0;
      canvas.clear();
      canvas.backgroundColor = fabric.Canvas.prototype.backgroundColor;
      canvas.calcOffset();
    }
  });

  QUnit.test('constructor', function(assert) {
    var layer = makeLayerWith2Objects();

    assert.ok(layer);
    assert.ok(layer instanceof fabric.Layer, 'should be instance of fabric.Layer');
  });

  QUnit.test('toString', function(assert) {
    var layer = makeLayerWith2Objects();
    assert.equal(layer.toString(), '#<fabric.Layer: (2)>', 'should return proper representation');
  });

  QUnit.test('getObjects', function(assert) {
    var rect1 = new fabric.Rect(),
        rect2 = new fabric.Rect();

    var layer = new fabric.Layer([rect1, rect2]);

    assert.ok(typeof layer.getObjects === 'function');
    assert.ok(Array.isArray(layer.getObjects()), 'should be an array');
    assert.equal(layer.getObjects().length, 2, 'should have 2 items');
    assert.deepEqual(layer.getObjects(), [rect1, rect2], 'should return deepEqual objects as those passed to constructor');
  });

  QUnit.test('getObjects with type', function(assert) {
    var rect = new fabric.Rect({ width: 10, height: 20 }),
        circle = new fabric.Circle({ radius: 30 });

    var layer = new fabric.Layer([rect, circle]);

    assert.equal(layer.size(), 2, 'should have length=2 initially');

    assert.deepEqual(layer.getObjects('rect'), [rect], 'should return rect only');
    assert.deepEqual(layer.getObjects('circle'), [circle], 'should return circle only');
    assert.deepEqual(layer.getObjects('circle', 'rect'), [rect, circle], 'should return circle and rect, in the same order they are');
  });

  QUnit.test('add', function(assert) {
    var layer = makeLayerWith2Objects();
    var rect1 = new fabric.Rect(),
        rect2 = new fabric.Rect(),
        rect3 = new fabric.Rect();

    assert.ok(typeof layer.add === 'function');
    layer.add(rect1);
    assert.strictEqual(layer.item(layer.size() - 1), rect1, 'last object should be newly added one');
    assert.equal(layer.getObjects().length, 3, 'there should be 3 objects');

    layer.add(rect2, rect3);
    assert.strictEqual(layer.item(layer.size() - 1), rect3, 'last object should be last added one');
    assert.equal(layer.size(), 5, 'there should be 5 objects');
  });

  QUnit.test('remove', function(assert) {
    var rect1 = new fabric.Rect(),
        rect2 = new fabric.Rect(),
        rect3 = new fabric.Rect(),
        layer = new fabric.Layer([rect1, rect2, rect3]);

    assert.ok(typeof layer.remove === 'function');
    layer.remove(rect2);
    assert.deepEqual(layer.getObjects(), [rect1, rect3], 'should remove object properly');

    layer.remove(rect1, rect3);
    assert.equal(layer.isEmpty(), true, 'layer should be empty');
  });

  QUnit.test('size', function(assert) {
    var layer = makeLayerWith2Objects();

    assert.ok(typeof layer.size === 'function');
    assert.equal(layer.size(), 2);
    layer.add(new fabric.Rect());
    assert.equal(layer.size(), 3);
    layer.remove(layer.getObjects()[0]);
    layer.remove(layer.getObjects()[0]);
    assert.equal(layer.size(), 1);
  });

  QUnit.test('set', function(assert) {
    var layer = makeLayerWith2Objects(),
        firstObject = layer.getObjects()[0];

    assert.ok(typeof layer.set === 'function');

    layer.set('opacity', 0.12345);
    assert.equal(layer.get('opacity'), 0.12345, 'layer\'s "own" property should be set properly');
    assert.equal(firstObject.get('opacity'), 1, 'objects\' value of non delegated property should stay same');

    layer.set('left', 1234);
    assert.equal(layer.get('left'), 1234, 'layer\'s own "left" property should be set properly');
    assert.ok(firstObject.get('left') !== 1234, 'objects\' value should not be affected');

    layer.set({ left: 888, top: 999 });
    assert.equal(layer.get('left'), 888, 'layer\'s own "left" property should be set properly via object');
    assert.equal(layer.get('top'), 999, 'layer\'s own "top" property should be set properly via object');
  });

  QUnit.test('contains', function(assert) {
    var rect1           = new fabric.Rect(),
        rect2           = new fabric.Rect(),
        notIncludedRect = new fabric.Rect(),
        layer           = new fabric.Layer([rect1, rect2]);

    assert.ok(typeof layer.contains === 'function');

    assert.ok(layer.contains(rect1), 'should contain first object');
    assert.ok(layer.contains(rect2), 'should contain second object');

    assert.ok(!layer.contains(notIncludedRect), 'should report not-included one properly');
  });

  QUnit.test('toObject', function(assert) {
    var layer = makeLayerWith2Objects();

    assert.ok(typeof layer.toObject === 'function');

    var clone = layer.toObject();

    var expectedObject = {
      version: fabric.version,
      type:                     'layer',
      originX:                  'center',
      originY:                  'center',
      left:                     0,
      top:                      0,
      width:                    0,
      height:                   0,
      fill:                     'rgb(0,0,0)',
      layout:                   'auto',
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
      objects:                  clone.objects,
      strokeUniform:            false,
      subTargetCheck:           false,
      interactive:              false,
    };

    assert.deepEqual(clone, expectedObject);

    assert.ok(layer !== clone, 'should produce different object');
    assert.ok(layer.getObjects() !== clone.objects, 'should produce different object array');
    assert.ok(layer.getObjects()[0] !== clone.objects[0], 'should produce different objects in array');

    // peform layout
    new fabric.Group([layer]);
    clone = layer.toObject();

    Object.assign(expectedObject, { width: 80, height: 60 });
    assert.deepEqual(clone, expectedObject);

    assert.ok(layer !== clone, 'should produce different object');
    assert.ok(layer.getObjects() !== clone.objects, 'should produce different object array');
    assert.ok(layer.getObjects()[0] !== clone.objects[0], 'should produce different objects in array');
  });

  QUnit.test('toObject without default values', function(assert) {
    var layer = makeLayerWith2Objects();
    layer.includeDefaultValues = false;
    var clone = layer.toObject();
    var objects = [{
      version: fabric.version,
      type: 'rect',
      left: 10,
      top: -30,
      width: 30,
      height: 10,
      strokeWidth: 0,
    }, {
      version: fabric.version,
      type: 'rect',
      left: -40,
      top: -10,
      width: 10,
      height: 40,
      strokeWidth: 0,
    }];
    var expectedObject = {
      version: fabric.version,
      type: 'layer',
      left: 0,
      top: 0,
      objects: objects,
    };
    assert.deepEqual(clone, expectedObject);
    // peform layout
    new fabric.Group([layer]);
    clone = layer.toObject();
    expectedObject = {
      version: fabric.version,
      type: 'layer',
      left: 0,
      top: 0,
      width: 80,
      height: 60,
      objects: objects,
    };
    assert.deepEqual(clone, expectedObject);
  });


  QUnit.test('toObject with excludeFromExport set on an object', function (assert) {
    var layer = makeLayerWith2Objects();
    var group2 = makeLayerWith2ObjectsAndNoExport();
    var clone = layer.toObject();
    var clone2 = group2.toObject();
    assert.deepEqual(clone2.objects, group2._objects.filter(obj => !obj.excludeFromExport).map(obj => obj.toObject()));
    delete clone.objects;
    delete clone2.objects;
    assert.deepEqual(clone, clone2);
  });

  QUnit.test('render', function(assert) {
    var layer = makeLayerWith2Objects();
    assert.ok(typeof layer.render === 'function');
  });

  QUnit.test('item', function(assert) {
    var layer = makeLayerWith2Objects();

    assert.ok(typeof layer.item === 'function');
    assert.equal(layer.item(0), layer.getObjects()[0]);
    assert.equal(layer.item(1), layer.getObjects()[1]);
    assert.equal(layer.item(9999), undefined);
  });

  QUnit.test('moveTo', function(assert) {
    var layer = makeLayerWith4Objects(),
        groupEl1 = layer.getObjects()[0],
        groupEl2 = layer.getObjects()[1],
        groupEl3 = layer.getObjects()[2],
        groupEl4 = layer.getObjects()[3];

    assert.ok(typeof layer.item(0).moveTo === 'function');

    // [ 1, 2, 3, 4 ]
    assert.equal(layer.item(0), groupEl1);
    assert.equal(layer.item(1), groupEl2);
    assert.equal(layer.item(2), groupEl3);
    assert.equal(layer.item(3), groupEl4);
    assert.equal(layer.item(9999), undefined);

    layer.item(0).moveTo(3);

    // moved 1 to level 3 — [2, 3, 4, 1]
    assert.equal(layer.item(3), groupEl1);
    assert.equal(layer.item(0), groupEl2);
    assert.equal(layer.item(1), groupEl3);
    assert.equal(layer.item(2), groupEl4);
    assert.equal(layer.item(9999), undefined);

    layer.item(0).moveTo(2);

    // moved 2 to level 2 — [3, 4, 2, 1]
    assert.equal(layer.item(3), groupEl1);
    assert.equal(layer.item(2), groupEl2);
    assert.equal(layer.item(0), groupEl3);
    assert.equal(layer.item(1), groupEl4);
    assert.equal(layer.item(9999), undefined);
  });

  QUnit.test('complexity', function(assert) {
    var layer = makeLayerWith2Objects();

    assert.ok(typeof layer.complexity === 'function');
    assert.equal(layer.complexity(), 2);
  });

  QUnit.test('removeAll', function(assert) {
    var layer = makeLayerWith2Objects(true),
        firstObject = layer.item(0),
        initialLeftValue = 100,
        initialTopValue = 100;

    assert.ok(typeof layer.removeAll === 'function');

    assert.ok(initialLeftValue !== firstObject.get('left'));
    assert.ok(initialTopValue !== firstObject.get('top'));

    layer.removeAll();
    assert.equal(firstObject.get('left'), initialLeftValue, 'should restore initial left value');
    assert.equal(firstObject.get('top'), initialTopValue, 'should restore initial top value');
  });

  QUnit.test.only('containsPoint', function(assert) {

    var layer = makeLayerWith2Objects(true, true, true);
    layer.group.setCoords();

    //  Rect #1     top: 100, left: 100, width: 30, height: 10
    //  Rect #2     top: 120, left: 50, width: 10, height: 40

    assert.ok(typeof layer.containsPoint === 'function');

    function containsPoint(p) {
      var localPoint = fabric.util.sendPointToPlane(p, null, layer.group.calcTransformMatrix());
      console.log(localPoint)
      return layer.containsPoint(localPoint);
    }

    assert.ok(!containsPoint({ x: 0, y: 0 }));

    layer.scale(2);
    assert.ok(containsPoint({ x: 50, y: 120 }));
    assert.ok(containsPoint({ x: 100, y: 160 }));
    assert.ok(!containsPoint({ x: 0, y: 0 }));

    layer.scale(1);
    layer.group.padding = 30;
    layer.group.triggerLayout();
    console.log(layer.width,layer.height)
    assert.ok(containsPoint({ x: 50, y: 120 }));
    assert.ok(!containsPoint({ x: 100, y: 170 }));
    assert.ok(!containsPoint({ x: 0, y: 0 }));
  });

  QUnit.test('forEachObject', function(assert) {
    var layer = makeLayerWith2Objects();

    assert.ok(typeof layer.forEachObject === 'function');

    var iteratedObjects = [];
    layer.forEachObject(function(groupObject) {
      iteratedObjects.push(groupObject);
    });

    assert.equal(iteratedObjects[0], layer.getObjects()[0], 'iteration give back objects in same order');
    assert.equal(iteratedObjects[1], layer.getObjects()[1], 'iteration give back objects in same order');
  });

  QUnit.test('fromObject', function(assert) {
    var done = assert.async();
    var layer = makeLayerWith2ObjectsWithOpacity();

    assert.ok(typeof fabric.Layer.fromObject === 'function');
    var groupObject = layer.toObject();

    fabric.Layer.fromObject(groupObject).then(function(newGroupFromObject) {

      var objectFromOldGroup = layer.toObject();
      var objectFromNewGroup = newGroupFromObject.toObject();

      assert.ok(newGroupFromObject instanceof fabric.Layer);

      assert.deepEqual(objectFromOldGroup.objects[0], objectFromNewGroup.objects[0]);
      assert.deepEqual(objectFromOldGroup.objects[1], objectFromNewGroup.objects[1]);

      // delete `objects` arrays, since `assertHashEqual` fails to compare them for equality
      delete objectFromOldGroup.objects;
      delete objectFromNewGroup.objects;

      assert.deepEqual(objectFromOldGroup, objectFromNewGroup);

      done();
    });
  });

  QUnit.test('fromObject after layout', function (assert) {
    var done = assert.async();
    var layer = makeLayerWith2ObjectsWithOpacity(true);

    assert.ok(typeof fabric.Layer.fromObject === 'function');
    var groupObject = layer.toObject();

    fabric.Layer.fromObject(groupObject).then(function (newGroupFromObject) {

      var objectFromOldGroup = layer.toObject();
      var objectFromNewGroup = newGroupFromObject.toObject();

      assert.ok(newGroupFromObject instanceof fabric.Layer);

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

    var groupObject = new fabric.Layer([
      new fabric.Rect({ width: 100, height: 100, fill: 'red' }),
      new fabric.Rect({ width: 100, height: 100, fill: 'yellow', left: 100 }),
      new fabric.Rect({ width: 100, height: 100, fill: 'blue', top: 100 }),
      new fabric.Rect({ width: 100, height: 100, fill: 'green', left: 100, top: 100 })
    ]);
    groupObject.clipPath = clipPath;

    var groupToObject = groupObject.toObject();

    fabric.Layer.fromObject(groupToObject).then(function(newGroupFromObject) {

      var objectFromNewGroup = newGroupFromObject.toObject();

      assert.ok(newGroupFromObject instanceof fabric.Layer);
      assert.ok(newGroupFromObject.clipPath instanceof fabric.Rect, 'clipPath has been restored');
      assert.deepEqual(objectFromNewGroup, groupToObject, 'double serialization gives same results');

      done();
    });
  });

  QUnit.test('fromObject restores oCoords', function(assert) {
    var done = assert.async();
    var layer = makeLayerWith2ObjectsWithOpacity(true);

    var groupObject = layer.toObject();
    groupObject.subTargetCheck = true;

    fabric.Layer.fromObject(groupObject).then(function(newGroupFromObject) {
      assert.ok(newGroupFromObject._objects[0].lineCoords.tl, 'acoords 0 are restored');
      assert.ok(newGroupFromObject._objects[1].lineCoords.tl, 'acoords 1 are restored');
      done();
    });
  });

  QUnit.test('fromObject does not delete objects from source', function(assert) {
    var done = assert.async();
    var layer = makeLayerWith2ObjectsWithOpacity();
    var groupObject = layer.toObject();

    fabric.Layer.fromObject(groupObject).then(function(newGroupFromObject) {
      assert.equal(newGroupFromObject.objects, undefined, 'the objects array has not been pulled in');
      assert.notEqual(groupObject.objects, undefined, 'the objects array has not been deleted from object source');
      done();
    });
  });

  QUnit.test('toSVG', function(assert) {
    var layer = makeLayerWith2Objects(true);
    assert.ok(typeof layer.toSVG === 'function');
    var expectedSVG = '<g transform=\"matrix(1 0 0 1 90 130)\"  >\n<g style=\"\"   >\n\t\t<g transform=\"matrix(1 0 0 1 25 -25)\"  >\n<rect style=\"stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;\"  x=\"-15\" y=\"-5\" rx=\"0\" ry=\"0\" width=\"30\" height=\"10\" />\n</g>\n\t\t<g transform=\"matrix(1 0 0 1 -35 10)\"  >\n<rect style=\"stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;\"  x=\"-5\" y=\"-20\" rx=\"0\" ry=\"0\" width=\"10\" height=\"40\" />\n</g>\n</g>\n</g>\n';
    assert.equal(layer.toSVG(), expectedSVG);
  });

  QUnit.test('toSVG with a clipPath', function(assert) {
    var layer = makeLayerWith2Objects(true);
    layer.clipPath = new fabric.Rect({ width: 100, height: 100 });
    var expectedSVG = '<g transform=\"matrix(1 0 0 1 90 130)\" clip-path=\"url(#CLIPPATH_0)\"  >\n<clipPath id=\"CLIPPATH_0\" >\n\t<rect transform=\"matrix(1 0 0 1 50.5 50.5)\" x=\"-50\" y=\"-50\" rx=\"0\" ry=\"0\" width=\"100\" height=\"100\" />\n</clipPath>\n<g style=\"\"   >\n\t\t<g transform=\"matrix(1 0 0 1 25 -25)\"  >\n<rect style=\"stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;\"  x=\"-15\" y=\"-5\" rx=\"0\" ry=\"0\" width=\"30\" height=\"10\" />\n</g>\n\t\t<g transform=\"matrix(1 0 0 1 -35 10)\"  >\n<rect style=\"stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;\"  x=\"-5\" y=\"-20\" rx=\"0\" ry=\"0\" width=\"10\" height=\"40\" />\n</g>\n</g>\n</g>\n';
    assert.equal(layer.toSVG(), expectedSVG);
  });

  QUnit.test('toSVG with a clipPath absolutePositioned', function(assert) {
    var layer = makeLayerWith2Objects(true);
    layer.clipPath = new fabric.Rect({ width: 100, height: 100 });
    layer.clipPath.absolutePositioned = true;
    var expectedSVG = '<g clip-path=\"url(#CLIPPATH_0)\"  >\n<g transform=\"matrix(1 0 0 1 90 130)\"  >\n<clipPath id=\"CLIPPATH_0\" >\n\t<rect transform=\"matrix(1 0 0 1 50.5 50.5)\" x=\"-50\" y=\"-50\" rx=\"0\" ry=\"0\" width=\"100\" height=\"100\" />\n</clipPath>\n<g style=\"\"   >\n\t\t<g transform=\"matrix(1 0 0 1 25 -25)\"  >\n<rect style=\"stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;\"  x=\"-15\" y=\"-5\" rx=\"0\" ry=\"0\" width=\"30\" height=\"10\" />\n</g>\n\t\t<g transform=\"matrix(1 0 0 1 -35 10)\"  >\n<rect style=\"stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;\"  x=\"-5\" y=\"-20\" rx=\"0\" ry=\"0\" width=\"10\" height=\"40\" />\n</g>\n</g>\n</g>\n</g>\n';
    assert.equal(layer.toSVG(), expectedSVG);
  });

  QUnit.test('toSVG with a layer as a clipPath', function(assert) {
    var layer = makeLayerWith2Objects(true);
    layer.clipPath = makeLayerWith2Objects();
    var expectedSVG = '<g transform=\"matrix(1 0 0 1 90 130)\" clip-path=\"url(#CLIPPATH_0)\"  >\n<clipPath id=\"CLIPPATH_0\" >\n\t\t<rect transform=\"matrix(1 0 0 1 115 105)\" x=\"-15\" y=\"-5\" rx=\"0\" ry=\"0\" width=\"30\" height=\"10\" />\n\t\t<rect transform=\"matrix(1 0 0 1 55 140)\" x=\"-5\" y=\"-20\" rx=\"0\" ry=\"0\" width=\"10\" height=\"40\" />\n</clipPath>\n<g style=\"\"   >\n\t\t<g transform=\"matrix(1 0 0 1 25 -25)\"  >\n<rect style=\"stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;\"  x=\"-15\" y=\"-5\" rx=\"0\" ry=\"0\" width=\"30\" height=\"10\" />\n</g>\n\t\t<g transform=\"matrix(1 0 0 1 -35 10)\"  >\n<rect style=\"stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;\"  x=\"-5\" y=\"-20\" rx=\"0\" ry=\"0\" width=\"10\" height=\"40\" />\n</g>\n</g>\n</g>\n';
    assert.equal(layer.toSVG(), expectedSVG);
  });

  QUnit.test('cloning layer with 2 objects', function(assert) {
    var done = assert.async();
    var layer = makeLayerWith2Objects(true);
    layer.clone().then(function(clone) {
      assert.ok(clone !== layer);
      assert.deepEqual(clone.toObject(), layer.toObject());
      done();
    });
  });

  QUnit.test('get with locked objects', function(assert) {
    var layer = makeLayerWith2Objects();

    assert.equal(layer.get('lockMovementX'), false);

    // TODO acitveGroup
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

  QUnit.test('z-index methods with layer objects', function(assert) {

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

  QUnit.test('layer reference on an object', function(assert) {
    var layer = makeLayerWith2Objects();
    var firstObjInGroup = layer.getObjects()[0];
    var secondObjInGroup = layer.getObjects()[1];

    assert.equal(firstObjInGroup.group, layer);
    assert.equal(secondObjInGroup.group, layer);

    layer.remove(firstObjInGroup);
    assert.ok(typeof firstObjInGroup.group === 'undefined');
  });

  QUnit.test('insertAt', function (assert) {
    var rect1 = new fabric.Rect({ id: 1 }),
      rect2 = new fabric.Rect({ id: 2 }),
      rect3 = new fabric.Rect({ id: 3 }),
      rect4 = new fabric.Rect({ id: 4 }),
      rect5 = new fabric.Rect({ id: 5 }),
      rect6 = new fabric.Rect({ id: 6 }),
      rect7 = new fabric.Rect({ id: 7 }),
      rect8 = new fabric.Rect({ id: 8 }),
      layer = new fabric.Layer(),
      control = [],
      fired = [],
      firingControl = [];

    layer.add(rect1, rect2);
    control.push(rect1, rect2);

    assert.ok(typeof layer.insertAt === 'function', 'should respond to `insertAt` method');

    const equalsControl = (description) => {
      assert.deepEqual(layer.getObjects().map(o => o.id), control.map(o => o.id), 'should equal control array ' + description);
      assert.deepEqual(layer.getObjects(), control, 'should equal control array ' + description);
      assert.deepEqual(fired.map(o => o.id), firingControl.map(o => o.id), 'fired events should equal control array ' + description);
      assert.deepEqual(fired, firingControl, 'fired events should equal control array ' + description);
    }

    assert.ok(typeof layer._onObjectAdded === 'function', 'has a standard _onObjectAdded method');
    [rect1, rect2, rect3, rect4, rect5, rect6, rect7, rect8].forEach(obj => {
      obj.on('added', e => {
        assert.equal(e.target, layer);
        fired.push(obj);
      });
    });

    layer.insertAt(rect3, 1);
    control.splice(1, 0, rect3);
    firingControl.push(rect3);
    equalsControl('rect3');
    layer.insertAt(rect4, 0);
    control.splice(0, 0, rect4);
    firingControl.push(rect4);
    equalsControl('rect4');
    layer.insertAt(rect5, 2);
    control.splice(2, 0, rect5);
    firingControl.push(rect5);
    equalsControl('rect5');
    layer.insertAt([rect6], 2);
    control.splice(2, 0, rect6);
    firingControl.push(rect6);
    equalsControl('rect6');
    layer.insertAt([rect7, rect8], 3);
    control.splice(3, 0, rect7, rect8);
    firingControl.push(rect7, rect8);
    equalsControl('rect7');
  });

  QUnit.test('dirty flag propagation from children up', function(assert) {
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

  QUnit.test('dirty flag propagation from children up is stopped if layer is not caching', function(assert) {
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

  QUnit.test('dirty flag propagation from children up does not happen if value does not change really', function(assert) {
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

  QUnit.test('_getCacheCanvasDimensions returns dimensions and zoom for cache canvas are influenced by layer', function(assert) {
    var g1 = makeLayerWith4Objects();
    var obj = g1.item(0);
    var dims = obj._getCacheCanvasDimensions();
    g1.scaleX = 2;
    var dims2 = obj._getCacheCanvasDimensions();
    assert.equal((dims2.width - 2), (dims.width - 2) * g1.scaleX, 'width of cache has increased with layer scale');
  });

  QUnit.test('test layer - pixels.', function(assert) {
    var rect1 = new fabric.Rect({ top: 1, left: 1, width: 2, height: 2, strokeWidth: 0, fill: 'red', opacity: 1, objectCaching: false}),
        rect2 = new fabric.Rect({ top: 5, left: 5, width: 2, height: 2, strokeWidth: 0, fill: 'red', opacity: 1, objectCaching: false}),
        layer = new fabric.Layer([rect1, rect2], {opacity: 1, fill: '', strokeWidth: 0, objectCaching: false}),
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

  QUnit.test('layer add', function(assert) {
    var rect1 = new fabric.Rect({ top: 1, left: 1, width: 2, height: 2, strokeWidth: 0, fill: 'red', opacity: 1, objectCaching: false}),
        rect2 = new fabric.Rect({ top: 5, left: 5, width: 2, height: 2, strokeWidth: 0, fill: 'red', opacity: 1, objectCaching: false}),
        layer = new fabric.Layer([rect1]);

    var coords = layer.oCoords;
    layer.add(rect2);
    var newCoords = layer.oCoords;
    assert.notEqual(coords, newCoords, 'object coords have been recalculated - add');
  });

  QUnit.test('layer remove', function(assert) {
    var rect1 = new fabric.Rect({ top: 1, left: 1, width: 2, height: 2, strokeWidth: 0, fill: 'red', opacity: 1, objectCaching: false}),
        rect2 = new fabric.Rect({ top: 5, left: 5, width: 2, height: 2, strokeWidth: 0, fill: 'red', opacity: 1, objectCaching: false}),
        layer = new fabric.Layer([rect1, rect2]);

    var coords = layer.oCoords;
    layer.remove(rect2);
    var newCoords = layer.oCoords;
    assert.notEqual(coords, newCoords, 'object coords have been recalculated - remove');
  });

  QUnit.test('layer willDrawShadow', function(assert) {
    var rect1 = new fabric.Rect({ top: 1, left: 1, width: 2, height: 2, strokeWidth: 0, fill: 'red', opacity: 1, objectCaching: false}),
        rect2 = new fabric.Rect({ top: 5, left: 5, width: 2, height: 2, strokeWidth: 0, fill: 'red', opacity: 1, objectCaching: false}),
        rect3 = new fabric.Rect({ top: 5, left: 5, width: 2, height: 2, strokeWidth: 0, fill: 'red', opacity: 1, objectCaching: false}),
        rect4 = new fabric.Rect({ top: 5, left: 5, width: 2, height: 2, strokeWidth: 0, fill: 'red', opacity: 1, objectCaching: false}),
        layer = new fabric.Layer([rect1, rect2]),
        group2 = new fabric.Layer([rect3, rect4]),
        group3 = new fabric.Layer([layer, group2]);

    assert.equal(group3.willDrawShadow(), false, 'layer will not cast shadow because objects do not have it');
    group3.shadow = { offsetX: 1, offsetY: 2, };
    assert.equal(group3.willDrawShadow(), true, 'layer will cast shadow because layer itself has shadow');
    delete group3.shadow;
    group2.shadow = { offsetX: 1, offsetY: 2, };
    assert.equal(group3.willDrawShadow(), true, 'layer will cast shadow because inner group2 has shadow');
    delete group2.shadow;
    rect1.shadow = { offsetX: 1, offsetY: 2, };
    assert.equal(group3.willDrawShadow(), true, 'layer will cast shadow because inner rect1 has shadow');
    assert.equal(layer.willDrawShadow(), true, 'layer will cast shadow because inner rect1 has shadow');
    assert.equal(group2.willDrawShadow(), false, 'layer will not cast shadow because no child has shadow');
  });

  QUnit.test('layer willDrawShadow with no offsets', function(assert) {
    var rect1 = new fabric.Rect({ top: 1, left: 1, width: 2, height: 2, strokeWidth: 0, fill: 'red', opacity: 1, objectCaching: false}),
        rect2 = new fabric.Rect({ top: 5, left: 5, width: 2, height: 2, strokeWidth: 0, fill: 'red', opacity: 1, objectCaching: false}),
        rect3 = new fabric.Rect({ top: 5, left: 5, width: 2, height: 2, strokeWidth: 0, fill: 'red', opacity: 1, objectCaching: false}),
        rect4 = new fabric.Rect({ top: 5, left: 5, width: 2, height: 2, strokeWidth: 0, fill: 'red', opacity: 1, objectCaching: false}),
        layer = new fabric.Layer([rect1, rect2]),
        group2 = new fabric.Layer([rect3, rect4]),
        group3 = new fabric.Layer([layer, group2]);

    assert.equal(group3.willDrawShadow(), false, 'layer will not cast shadow because objects do not have it');
    group3.shadow = { offsetX: 0, offsetY: 0 };
    assert.equal(group3.willDrawShadow(), false, 'layer will NOT cast shadow because layer itself has shadow but not offsets');
    group3.shadow = { offsetX: 2, offsetY: 0 };
    assert.equal(group3.willDrawShadow(), true, 'layer will cast shadow because layer itself has shadow and one offsetX different than 0');
    group3.shadow = { offsetX: 0, offsetY: 2 };
    assert.equal(group3.willDrawShadow(), true, 'layer will cast shadow because layer itself has shadow and one offsetY different than 0');
    group3.shadow = { offsetX: -2, offsetY: 0 };
    assert.equal(group3.willDrawShadow(), true, 'layer will cast shadow because layer itself has shadow and one offsetX different than 0');
    group3.shadow = { offsetX: 0, offsetY: -2 };
    assert.equal(group3.willDrawShadow(), true, 'layer will cast shadow because layer itself has shadow and one offsetY different than 0');
    rect1.shadow = { offsetX: 1, offsetY: 2, };
    group3.shadow = { offsetX: 0, offsetY: 0 };
    assert.equal(group3.willDrawShadow(), true, 'layer will cast shadow because layer itself will not, but rect 1 will');

  });

  QUnit.test('layer shouldCache', function(assert) {
    var rect1 = new fabric.Rect({ top: 1, left: 1, width: 2, height: 2, strokeWidth: 0, fill: 'red', opacity: 1, objectCaching: true}),
        rect2 = new fabric.Rect({ top: 5, left: 5, width: 2, height: 2, strokeWidth: 0, fill: 'red', opacity: 1, objectCaching: true}),
        rect3 = new fabric.Rect({ top: 5, left: 5, width: 2, height: 2, strokeWidth: 0, fill: 'red', opacity: 1, objectCaching: true}),
        rect4 = new fabric.Rect({ top: 5, left: 5, width: 2, height: 2, strokeWidth: 0, fill: 'red', opacity: 1, objectCaching: true}),
        layer = new fabric.Layer([rect1, rect2], { objectCaching: true}),
        group2 = new fabric.Layer([rect3, rect4], { objectCaching: true}),
        group3 = new fabric.Layer([layer, group2], { objectCaching: true});

    assert.equal(group3.shouldCache(), true, 'group3 will cache because no child has shadow');
    assert.equal(group2.shouldCache(), false, 'group2 will not cache because is drawing on parent group3 cache');
    assert.equal(rect3.shouldCache(), false, 'rect3 will not cache because is drawing on parent2 layer cache');

    group2.shadow = { offsetX: 2, offsetY: 0 };
    rect1.shadow = { offsetX: 0, offsetY: 2 };

    assert.equal(group3.shouldCache(), false, 'group3 will cache because children have shadow');
    assert.equal(group2.shouldCache(), true, 'group2 will cache because is not drawing on parent group3 cache and no children have shadow');
    assert.equal(layer.shouldCache(), false, 'layer will not cache because even if is not drawing on parent group3 cache children have shadow');

    assert.equal(rect1.shouldCache(), true, 'rect1 will cache because none of its parent is caching');
    assert.equal(rect3.shouldCache(), false, 'rect3 will not cache because group2 is caching');

  });

  QUnit.test('canvas prop propagation with set', function(assert) {
    var rect1 = new fabric.Rect({ top: 1, left: 1, width: 2, height: 2, strokeWidth: 0, fill: 'red', opacity: 1, objectCaching: true}),
        rect2 = new fabric.Rect({ top: 5, left: 5, width: 2, height: 2, strokeWidth: 0, fill: 'red', opacity: 1, objectCaching: true}),
        layer = new fabric.Layer([rect1, rect2]);

    layer.set('canvas', 'a-canvas');
    assert.equal(layer.canvas, 'a-canvas', 'canvas has been set');
    assert.equal(layer._objects[0].canvas, 'a-canvas', 'canvas has been set on object 0');
    assert.equal(layer._objects[1].canvas, 'a-canvas', 'canvas has been set on object 1');
  });

  QUnit.test('canvas prop propagation with add', function(assert) {
    var rect1 = new fabric.Rect({ top: 1, left: 1, width: 2, height: 2, strokeWidth: 0, fill: 'red', opacity: 1, objectCaching: true}),
        rect2 = new fabric.Rect({ top: 5, left: 5, width: 2, height: 2, strokeWidth: 0, fill: 'red', opacity: 1, objectCaching: true}),
        layer = new fabric.Layer([rect1, rect2]);

    canvas.add(layer);
    assert.equal(layer.canvas, canvas, 'canvas has been set');
    assert.equal(layer._objects[0].canvas, canvas, 'canvas has been set on object 0');
    assert.equal(layer._objects[1].canvas, canvas, 'canvas has been set on object 1');
  });

  QUnit.test('canvas prop propagation with add to layer', function(assert) {
    var rect1 = new fabric.Rect({ top: 1, left: 1, width: 2, height: 2, strokeWidth: 0, fill: 'red', opacity: 1, objectCaching: true}),
        rect2 = new fabric.Rect({ top: 5, left: 5, width: 2, height: 2, strokeWidth: 0, fill: 'red', opacity: 1, objectCaching: true}),
        layer = new fabric.Layer();

    canvas.add(layer);
    assert.equal(layer.canvas, canvas, 'canvas has been set');
    layer.add(rect1);
    assert.equal(layer._objects[0].canvas, canvas, 'canvas has been set on object 0');
    layer.add(rect2);
    assert.equal(layer._objects[1].canvas, canvas, 'canvas has been set on object 0');
  });

  QUnit.test('add and coordinates', function(assert) {
    var rect1 = new fabric.Rect({ top: 1, left: 1, width: 3, height: 2, strokeWidth: 0, fill: 'red' }),
        rect2 = new fabric.Rect({ top: 5, left: 5, width: 2, height: 6, angle: 90, strokeWidth: 0, fill: 'red' }),
        layer = new fabric.Layer([]);
    layer.add(rect1);
    layer.add(rect2);
    layer.left = 5;
    layer.top = 5;
    layer.scaleX = 3;
    layer.scaleY = 2;
    layer.removeAll();
    assert.equal(rect1.top, 5, 'top has been moved');
    assert.equal(rect1.left, 11, 'left has been moved');
    assert.equal(rect1.scaleX, 3, 'scaleX has been scaled');
    assert.equal(rect1.scaleY, 2, 'scaleY has been scaled');
    assert.equal(rect2.top, 13, 'top has been moved');
    assert.equal(rect2.left, 23, 'left has been moved');
    assert.equal(rect2.scaleX, 2, 'scaleX has been scaled inverted because of angle 90');
    assert.equal(rect2.scaleY, 3, 'scaleY has been scaled inverted because of angle 90');
  });

  QUnit.skip('addRelativeToGroup and coordinates with nested groups', function(assert) {
    var rect1 = new fabric.Rect({ top: 1, left: 1, width: 3, height: 2, strokeWidth: 0, fill: 'red' }),
        rect2 = new fabric.Rect({ top: 5, left: 5, width: 2, height: 6, angle: 90, strokeWidth: 0, fill: 'red' }),
        group0 = new fabric.Layer([rect1, rect2]),
        rect3 = new fabric.Rect({ top: 2, left: 9, width: 3, height: 2, strokeWidth: 0, fill: 'red' }),
        rect4 = new fabric.Rect({ top: 3, left: 5, width: 2, height: 6, angle: 90, strokeWidth: 0, fill: 'red' }),
        group1 = new fabric.Layer([rect3, rect4], { scaleX: 3, scaleY: 4 }),
        layer = new fabric.Layer([group0, group1], { angle: 90, scaleX: 2, scaleY: 0.5 }),
        rect5 = new fabric.Rect({ top: 1, left: 1, width: 3, height: 2, strokeWidth: 0, fill: 'red' });

    group1.addRelativeToGroup(rect5);
    var t = group1.calcTransformMatrix();
    var pos = fabric.util.transformPoint(new fabric.Point(rect5.left, rect5.top), t);
    assert.equal(rect5.top, -5.5, 'top has been moved');
    assert.equal(rect5.left, -19.5, 'left has been moved');
    assert.equal(rect5.scaleX, 2, 'scaleX has been scaled');
    assert.equal(rect5.scaleY, 0.5, 'scaleY has been scaled');
    layer.removeAll();
    group1.removeAll();
    assert.equal(rect5.top, 1, 'top is back to original minus rounding errors');
    assert.equal(rect5.left, 1, 'left is back to original');
    assert.equal(rect5.scaleX, 1, 'scaleX is back to original');
    assert.equal(rect5.scaleY, 1, 'scaleY is back to original');
  });


})();
