(function() {
  var canvas = this.canvas = new fabric.StaticCanvas(null, { enableRetinaScaling: false, width: 600, height: 600 });
  var didLayoutLayer = false;
  var TGroup = fabric.util.createClass(fabric.Group, {
    onLayout: function () {
      didLayoutLayer = true;
    }
  })
  
  /**
   * 
   * @typedef {object} GroupTestOptions
   * @property {boolean} [performLayout]
   * @property {boolean} [subTargetCheck]
   * @property {boolean} [interactive]
   * 
   * 
   * @param {*} objects 
   * @param {*} options 
   * @param {GroupTestOptions} groupOptions 
   * @returns 
   */
  function createLayer(objects, options, groupOptions) {
    var layer = new fabric.Layer(objects, Object.assign({ strokeWidth: 0 }, options || {}));
    if (groupOptions && groupOptions.performLayout) {
      delete groupOptions.performLayout;
      new TGroup([layer], groupOptions);
    }
    return layer;
  }

  /**
   * 
   * @param {GroupTestOptions} groupOptions 
   * @returns 
   */
  function makeLayerWith2Objects(groupOptions) {
    var rect1 = new fabric.Rect({ top: 100, left: 100, width: 30, height: 10, strokeWidth: 0 }),
        rect2 = new fabric.Rect({ top: 120, left: 50, width: 10, height: 40, strokeWidth: 0 });

    return createLayer([rect1, rect2], null, groupOptions);
  }

  /**
   * 
   * @param {GroupTestOptions} groupOptions 
   * @returns 
   */
  function makeLayerWith2ObjectsWithOpacity(groupOptions) {
    var rect1 = new fabric.Rect({ top: 100, left: 100, width: 30, height: 10, strokeWidth: 0, opacity: 0.5 }),
        rect2 = new fabric.Rect({ top: 120, left: 50, width: 10, height: 40, strokeWidth: 0, opacity: 0.8 });

    return createLayer([rect1, rect2], null, groupOptions);
  }

  /**
   * 
   * @param {GroupTestOptions} groupOptions 
   * @returns 
   */
  function makeLayerWith2ObjectsAndNoExport(groupOptions) {
    var rect1 = new fabric.Rect({ top: 100, left: 100, width: 30, height: 10, strokeWidth: 0 }),
      rect2 = new fabric.Rect({ top: 120, left: 50, width: 10, height: 40, strokeWidth: 0, excludeFromExport: true });

    return createLayer([rect1, rect2], null, groupOptions);
  }

  /**
   * 
   * @param {GroupTestOptions} groupOptions 
   * @returns 
   */
  function makeLayerWith4Objects(groupOptions) {
    var rect1 = new fabric.Rect({ top: 100, left: 100, width: 30, height: 10 }),
        rect2 = new fabric.Rect({ top: 120, left: 50, width: 10, height: 40 }),
        rect3 = new fabric.Rect({ top: 40, left: 0, width: 20, height: 40 }),
        rect4 = new fabric.Rect({ top: 75, left: 75, width: 40, height: 40 });

    return createLayer([rect1, rect2, rect3, rect4], null, groupOptions);
  }

  QUnit.module('fabric.Layer', {
    afterEach: function() {
      fabric.Object.__uid = 0;
      canvas.clear();
      canvas.backgroundColor = fabric.Canvas.prototype.backgroundColor;
      canvas.calcOffset();
      didLayoutLayer = false;
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

  QUnit.test('remove - layout', function(assert) {
    var layer = makeLayerWith2Objects({ performLayout: true });

    assert.ok(typeof layer.remove === 'function');
    layer.remove(layer.item(1));
    var o = layer.item(0);
    assert.equal(layer.width, o.width);
    assert.equal(layer.height, o.height);
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

    layer = makeLayerWith2Objects({ performLayout: true });
    assert.ok(didLayoutLayer, 'should have layed out layer');
    assert.equal(layer.group.width, 80);
    assert.equal(layer.group.height, 60);
    clone = layer.toObject();

    Object.assign(expectedObject, { width: 80, height: 60 });
    assert.deepEqual(clone, expectedObject, 'should equal after layout');

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
    var layer = makeLayerWith2Objects({ performLayout: true }),
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

  QUnit.test('containsPoint', function(assert) {
    var layer = makeLayerWith2Objects({ performLayout: true });
    layer.group.setCoords();

    //  Rect #1     top: 100, left: 100, width: 30, height: 10
    //  Rect #2     top: 120, left: 50, width: 10, height: 40

    assert.ok(typeof layer.containsPoint === 'function');

    function containsPoint(p) {
      return layer.group.containsPoint(p);
    }

    assert.ok(!containsPoint({ x: 0, y: 0 }));

    assert.ok(containsPoint({ x: 50, y: 120 }));
    assert.ok(containsPoint({ x: 100, y: 160 }));
    assert.ok(!containsPoint({ x: 0, y: 0 }));

    layer.group.padding = 30;
    layer.group.triggerLayout();
    assert.ok(containsPoint({ x: 50, y: 120 }));
    assert.ok(!containsPoint({ x: 100, y: 170 }));
    assert.ok(!containsPoint({ x: 0, y: 0 }));
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
    var layer = makeLayerWith2ObjectsWithOpacity({ performLayout: true });

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
    var layer = makeLayerWith2ObjectsWithOpacity({ performLayout: true });

    var groupObject = layer.toObject();
    groupObject.subTargetCheck = true;

    fabric.Layer.fromObject(groupObject).then(function(newGroupFromObject) {
      assert.ok(newGroupFromObject._objects[0].lineCoords.tl, 'acoords 0 are restored');
      assert.ok(newGroupFromObject._objects[1].lineCoords.tl, 'acoords 1 are restored');
      done();
    });
  });

  QUnit.test('toSVG', function(assert) {
    var layer = makeLayerWith2Objects({ performLayout: true });
    assert.ok(typeof layer.toSVG === 'function');
    var expectedSVG = '<g transform=\"matrix(1 0 0 1 90 130)\"  >\n<g style=\"\"   >\n\t\t<g transform=\"matrix(1 0 0 1 0 0)\"  >\n<g style=\"\"   >\n\t\t<g transform=\"matrix(1 0 0 1 25 -25)\"  >\n<rect style=\"stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;\"  x=\"-15\" y=\"-5\" rx=\"0\" ry=\"0\" width=\"30\" height=\"10\" />\n</g>\n\t\t<g transform=\"matrix(1 0 0 1 -35 10)\"  >\n<rect style=\"stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;\"  x=\"-5\" y=\"-20\" rx=\"0\" ry=\"0\" width=\"10\" height=\"40\" />\n</g>\n</g>\n</g>\n</g>\n</g>\n';
    assert.equal(layer.group.toSVG(), expectedSVG);
  });

  QUnit.test('toSVG with a clipPath', function(assert) {
    var layer = makeLayerWith2Objects({ performLayout: true });
    layer.clipPath = new fabric.Rect({ width: 100, height: 100 });
    var expectedSVG = '<g transform=\"matrix(1 0 0 1 90 130)\"  >\n<g style=\"\"   >\n\t\t<g transform=\"matrix(1 0 0 1 0 0)\" clip-path=\"url(#CLIPPATH_0)\"  >\n<clipPath id=\"CLIPPATH_0\" >\n\t<rect transform=\"matrix(1 0 0 1 50.5 50.5)\" x=\"-50\" y=\"-50\" rx=\"0\" ry=\"0\" width=\"100\" height=\"100\" />\n</clipPath>\n<g style=\"\"   >\n\t\t<g transform=\"matrix(1 0 0 1 25 -25)\"  >\n<rect style=\"stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;\"  x=\"-15\" y=\"-5\" rx=\"0\" ry=\"0\" width=\"30\" height=\"10\" />\n</g>\n\t\t<g transform=\"matrix(1 0 0 1 -35 10)\"  >\n<rect style=\"stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;\"  x=\"-5\" y=\"-20\" rx=\"0\" ry=\"0\" width=\"10\" height=\"40\" />\n</g>\n</g>\n</g>\n</g>\n</g>\n';
    assert.equal(layer.group.toSVG(), expectedSVG);
  });

  QUnit.test('toSVG with a clipPath absolutePositioned', function(assert) {
    var layer = makeLayerWith2Objects({ performLayout: true });
    layer.clipPath = new fabric.Rect({ width: 100, height: 100 });
    layer.clipPath.absolutePositioned = true;
    console.log(JSON.stringify(layer.group.toSVG()))
    var expectedSVG = '<g clip-path=\"url(#CLIPPATH_0)\"  >\n<g transform=\"matrix(1 0 0 1 90 130)\"  >\n<clipPath id=\"CLIPPATH_0\" >\n\t<rect transform=\"matrix(1 0 0 1 50.5 50.5)\" x=\"-50\" y=\"-50\" rx=\"0\" ry=\"0\" width=\"100\" height=\"100\" />\n</clipPath>\n<g style=\"\"   >\n\t\t<g transform=\"matrix(1 0 0 1 25 -25)\"  >\n<rect style=\"stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;\"  x=\"-15\" y=\"-5\" rx=\"0\" ry=\"0\" width=\"30\" height=\"10\" />\n</g>\n\t\t<g transform=\"matrix(1 0 0 1 -35 10)\"  >\n<rect style=\"stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;\"  x=\"-5\" y=\"-20\" rx=\"0\" ry=\"0\" width=\"10\" height=\"40\" />\n</g>\n</g>\n</g>\n</g>\n';
    assert.equal(layer.toSVG(), expectedSVG);
  });

  QUnit.test('toSVG with a layer as a clipPath', function(assert) {
    var layer = makeLayerWith2Objects({ performLayout: true });
    layer.clipPath = makeLayerWith2Objects();
    var expectedSVG = '<g transform=\"matrix(1 0 0 1 90 130)\" clip-path=\"url(#CLIPPATH_0)\"  >\n<clipPath id=\"CLIPPATH_0\" >\n\t\t<rect transform=\"matrix(1 0 0 1 115 105)\" x=\"-15\" y=\"-5\" rx=\"0\" ry=\"0\" width=\"30\" height=\"10\" />\n\t\t<rect transform=\"matrix(1 0 0 1 55 140)\" x=\"-5\" y=\"-20\" rx=\"0\" ry=\"0\" width=\"10\" height=\"40\" />\n</clipPath>\n<g style=\"\"   >\n\t\t<g transform=\"matrix(1 0 0 1 25 -25)\"  >\n<rect style=\"stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;\"  x=\"-15\" y=\"-5\" rx=\"0\" ry=\"0\" width=\"30\" height=\"10\" />\n</g>\n\t\t<g transform=\"matrix(1 0 0 1 -35 10)\"  >\n<rect style=\"stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;\"  x=\"-5\" y=\"-20\" rx=\"0\" ry=\"0\" width=\"10\" height=\"40\" />\n</g>\n</g>\n</g>\n';
    assert.equal(layer.toSVG(), expectedSVG);
  });

  QUnit.test('cloning layer with 2 objects', function(assert) {
    var done = assert.async();
    var layer = makeLayerWith2Objects({ performLayout: true });
    layer.clone().then(function(clone) {
      assert.ok(clone !== layer);
      assert.deepEqual(clone.toObject(), layer.toObject());
      done();
    });
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

  QUnit.test('layer add - coords are kept', function(assert) {
    var rect1 = new fabric.Rect({ top: 1, left: 1, width: 2, height: 2, strokeWidth: 0, fill: 'red', opacity: 1, objectCaching: false }),
        rect2 = new fabric.Rect({ top: 5, left: 5, width: 2, height: 2, strokeWidth: 0, fill: 'red', opacity: 1, objectCaching: false }),
        layer = new fabric.Layer([rect1]),
        //  perform layout
        group = new fabric.Group([layer], { subTargetCheck: true });

    var coords = layer.oCoords;
    layer.add(rect2);
    var newCoords = layer.oCoords;
    assert.equal(coords, newCoords, 'object coords have been recalculated - add');
  });

  QUnit.test('layer remove - coords are kept', function(assert) {
    var rect1 = new fabric.Rect({ top: 1, left: 1, width: 2, height: 2, strokeWidth: 0, fill: 'red', opacity: 1, objectCaching: false}),
        rect2 = new fabric.Rect({ top: 5, left: 5, width: 2, height: 2, strokeWidth: 0, fill: 'red', opacity: 1, objectCaching: false}),
        layer = new fabric.Layer([rect1, rect2]),
        //  perform layout
        group = new fabric.Group([layer], { subTargetCheck: true });

    var coords = layer.oCoords;
    layer.remove(rect2);
    var newCoords = layer.oCoords;
    assert.equal(coords, newCoords, 'object coords have been recalculated - remove');
  });

  QUnit.test('add and coordinates', function(assert) {
    var rect1 = new fabric.Rect({ top: 1, left: 1, width: 3, height: 2, strokeWidth: 0, fill: 'red' }),
        rect2 = new fabric.Rect({ top: 5, left: 5, width: 2, height: 6, angle: 90, strokeWidth: 0, fill: 'red' }),
        layer = new fabric.Layer([]),
        group = new fabric.Group([layer]);
    layer.add(rect1);
    layer.add(rect2);
    group.left = 5;
    group.top = 5;
    group.scaleX = 3;
    group.scaleY = 2;
    group.triggerLayout();
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

})();
