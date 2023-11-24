(function() {
  var canvas = this.canvas = new fabric.StaticCanvas(null, {enableRetinaScaling: false, width: 600, height: 600});

  function makeGroupWith2Objects() {
    var rect1 = new fabric.Rect({ top: 100, left: 100, width: 30, height: 10, strokeWidth: 0 }),
        rect2 = new fabric.Rect({ top: 120, left: 50, width: 10, height: 40, strokeWidth: 0 });

    return new fabric.Group([rect1, rect2], { strokeWidth: 0 });
  }

  function makeGroupWith2ObjectsWithOpacity() {
    var rect1 = new fabric.Rect({ top: 100, left: 100, width: 30, height: 10, strokeWidth: 0, opacity: 0.5 }),
        rect2 = new fabric.Rect({ top: 120, left: 50, width: 10, height: 40, strokeWidth: 0, opacity: 0.8 });

    return new fabric.Group([rect1, rect2], {strokeWidth: 0});
  }

  function makeGroupWith2ObjectsAndNoExport() {
    var rect1 = new fabric.Rect({ top: 100, left: 100, width: 30, height: 10, strokeWidth: 0 }),
      rect2 = new fabric.Rect({ top: 120, left: 50, width: 10, height: 40, strokeWidth: 0, excludeFromExport: true });

    return new fabric.Group([rect1, rect2], { strokeWidth: 0 });
  }

  function makeGroupWith4Objects() {
    var rect1 = new fabric.Rect({ top: 100, left: 100, width: 30, height: 10 }),
        rect2 = new fabric.Rect({ top: 120, left: 50, width: 10, height: 40 }),
        rect3 = new fabric.Rect({ top: 40, left: 0, width: 20, height: 40 }),
        rect4 = new fabric.Rect({ top: 75, left: 75, width: 40, height: 40 });

    return new fabric.Group([rect1, rect2, rect3, rect4]);
  }

  QUnit.module('fabric.Group', {
    afterEach: function() {
      canvas.clear();
      canvas.backgroundColor = fabric.Canvas.getDefaults().backgroundColor;
      canvas.calcOffset();
    }
  });

  QUnit.test('constructor', function(assert) {
    var group = makeGroupWith2Objects();

    assert.ok(group);
    assert.ok(group instanceof fabric.Group, 'should be instance of fabric.Group');
  });

  QUnit.test('toString', function(assert) {
    var group = makeGroupWith2Objects();
    assert.equal(group.toString(), '#<Group: (2)>', 'should return proper representation');
  });

  QUnit.test('getObjects', function(assert) {
    var rect1 = new fabric.Rect(),
        rect2 = new fabric.Rect();

    var group = new fabric.Group([rect1, rect2]);

    assert.ok(typeof group.getObjects === 'function');
    assert.ok(Array.isArray(group.getObjects()), 'should be an array');
    assert.equal(group.getObjects().length, 2, 'should have 2 items');
    assert.deepEqual(group.getObjects(), [rect1, rect2], 'should return deepEqual objects as those passed to constructor');
  });

  QUnit.test('add', function(assert) {
    var group = makeGroupWith2Objects();
    var rect1 = new fabric.Rect(),
        rect2 = new fabric.Rect(),
        rect3 = new fabric.Rect();

    assert.ok(typeof group.add === 'function');
    group.add(rect1);
    assert.strictEqual(group.item(group.size() - 1), rect1, 'last object should be newly added one');
    assert.equal(group.getObjects().length, 3, 'there should be 3 objects');

    group.add(rect2, rect3);
    assert.strictEqual(group.item(group.size() - 1), rect3, 'last object should be last added one');
    assert.equal(group.size(), 5, 'there should be 5 objects');
  });

  QUnit.test('remove', function(assert) {
    var rect1 = new fabric.Rect(),
        rect2 = new fabric.Rect(),
        rect3 = new fabric.Rect(),
        group = new fabric.Group([rect1, rect2, rect3]),
        fired = false, targets = [];

    assert.ok(typeof group.remove === 'function');
    assert.ok(rect1.group === group, 'group should be referenced');
    assert.ok(rect1.parent === group, 'parent should be referenced');
    group.on('object:removed', (opt) => {
      targets.push(opt.target);
    });
    rect1.on('removed', (opt) => {
      assert.equal(opt.target, group);
      assert.ok(rect1.group === undefined, 'group should not be referenced');
      assert.ok(rect1.parent === undefined, 'parent should not be referenced');
      fired = true;
    });
    var removed = group.remove(rect2);
    assert.deepEqual(removed, [rect2], 'should return removed objects');
    assert.deepEqual(group.getObjects(), [rect1, rect3], 'should remove object properly');

    var removed = group.remove(rect1, rect3);
    assert.deepEqual(removed, [rect1, rect3], 'should return removed objects');
    assert.equal(group.isEmpty(), true, 'group should be empty');
    assert.ok(fired, 'should have fired removed event on rect1');
    //assert.deepEqual(targets, [rect2, rect1, rect3], 'should contain removed objects');
  });

  QUnit.test('size', function(assert) {
    var group = makeGroupWith2Objects();

    assert.ok(typeof group.size === 'function');
    assert.equal(group.size(), 2);
    group.add(new fabric.Rect());
    assert.equal(group.size(), 3);
    group.remove(group.getObjects()[0]);
    group.remove(group.getObjects()[0]);
    assert.equal(group.size(), 1);
  });

  QUnit.test('set', function(assert) {
    var group = makeGroupWith2Objects(),
        firstObject = group.getObjects()[0];

    assert.ok(typeof group.set === 'function');

    group.set('opacity', 0.12345);
    assert.equal(group.get('opacity'), 0.12345, 'group\'s "own" property should be set properly');
    assert.equal(firstObject.get('opacity'), 1, 'objects\' value of non delegated property should stay same');

    group.set('left', 1234);
    assert.equal(group.get('left'), 1234, 'group\'s own "left" property should be set properly');
    assert.ok(firstObject.get('left') !== 1234, 'objects\' value should not be affected');

    group.set({ left: 888, top: 999 });
    assert.equal(group.get('left'), 888, 'group\'s own "left" property should be set properly via object');
    assert.equal(group.get('top'), 999, 'group\'s own "top" property should be set properly via object');
  });

  QUnit.test('contains', function(assert) {
    var rect1           = new fabric.Rect(),
        rect2           = new fabric.Rect(),
        notIncludedRect = new fabric.Rect(),
        group           = new fabric.Group([rect1, rect2]);

    assert.ok(typeof group.contains === 'function');

    assert.ok(group.contains(rect1), 'should contain first object');
    assert.ok(group.contains(rect2), 'should contain second object');

    assert.ok(!group.contains(notIncludedRect), 'should report not-included one properly');
  });

  QUnit.test('toObject', function(assert) {
    var group = makeGroupWith2Objects();

    assert.ok(typeof group.toObject === 'function');

    var clone = group.toObject();

    var expectedObject = {
      version: fabric.version,
      type:                     'Group',
      originX:                  'left',
      originY:                  'top',
      left:                     50,
      top:                      100,
      width:                    80,
      height:                   60,
      fill:                     'rgb(0,0,0)',
      // layout:                   'fit-content',
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

    assert.ok(group !== clone, 'should produce different object');
    assert.ok(group.getObjects() !== clone.objects, 'should produce different object array');
    assert.ok(group.getObjects()[0] !== clone.objects[0], 'should produce different objects in array');
  });

  QUnit.test('toObject without default values', function(assert) {
    var group = makeGroupWith2Objects();
    group.includeDefaultValues = false;
    var clone = group.toObject();
    var objects = [{
      version: fabric.version,
      type: 'Rect',
      left: 10,
      top: -30,
      width: 30,
      height: 10,
      strokeWidth: 0,
    }, {
      version: fabric.version,
      type: 'Rect',
      left: -40,
      top: -10,
      width: 10,
      height: 40,
      strokeWidth: 0,
    }];
    var expectedObject = {
      version: fabric.version,
      type: 'Group',
      left: 50,
      top: 100,
      width: 80,
      height: 60,
      objects: objects,
    };
    assert.deepEqual(clone, expectedObject);
  });


  QUnit.test('toObject with excludeFromExport set on an object', function (assert) {
    var group = makeGroupWith2Objects();
    var group2 = makeGroupWith2ObjectsAndNoExport();
    var clone = group.toObject();
    var clone2 = group2.toObject();
    assert.deepEqual(clone2.objects, group2._objects.filter(obj => !obj.excludeFromExport).map(obj => obj.toObject()));
    delete clone.objects;
    delete clone2.objects;
    assert.deepEqual(clone, clone2);
  });

  QUnit.test('render', function(assert) {
    var group = makeGroupWith2Objects();
    assert.ok(typeof group.render === 'function');
  });

  QUnit.test('item', function(assert) {
    var group = makeGroupWith2Objects();

    assert.ok(typeof group.item === 'function');
    assert.equal(group.item(0), group.getObjects()[0]);
    assert.equal(group.item(1), group.getObjects()[1]);
    assert.equal(group.item(9999), undefined);
  });

  QUnit.test('moveObjectTo', function(assert) {
    var group = makeGroupWith4Objects(),
        groupEl1 = group.getObjects()[0],
        groupEl2 = group.getObjects()[1],
        groupEl3 = group.getObjects()[2],
        groupEl4 = group.getObjects()[3];

    // [ 1, 2, 3, 4 ]
    assert.equal(group.item(0), groupEl1);
    assert.equal(group.item(1), groupEl2);
    assert.equal(group.item(2), groupEl3);
    assert.equal(group.item(3), groupEl4);
    assert.equal(group.item(9999), undefined);

    group.moveObjectTo(group.item(0), 3);

    // moved 1 to level 3 — [2, 3, 4, 1]
    assert.equal(group.item(3), groupEl1);
    assert.equal(group.item(0), groupEl2);
    assert.equal(group.item(1), groupEl3);
    assert.equal(group.item(2), groupEl4);
    assert.equal(group.item(9999), undefined);

    group.moveObjectTo(group.item(0), 2);

    // moved 2 to level 2 — [3, 4, 2, 1]
    assert.equal(group.item(3), groupEl1);
    assert.equal(group.item(2), groupEl2);
    assert.equal(group.item(0), groupEl3);
    assert.equal(group.item(1), groupEl4);
    assert.equal(group.item(9999), undefined);
  });

  QUnit.test('complexity', function(assert) {
    var group = makeGroupWith2Objects();

    assert.ok(typeof group.complexity === 'function');
    assert.equal(group.complexity(), 2);
  });

  QUnit.test('removeAll', function(assert) {
    var group = makeGroupWith2Objects(),
        firstObject = group.item(0),
        initialLeftValue = 100,
        initialTopValue = 100;

    assert.ok(typeof group.removeAll === 'function');

    assert.ok(initialLeftValue !== firstObject.get('left'));
    assert.ok(initialTopValue !== firstObject.get('top'));

    var objects = group.getObjects();
    assert.deepEqual(group.removeAll(), objects, 'should remove all objects');
    assert.equal(firstObject.get('left'), initialLeftValue, 'should restore initial left value');
    assert.equal(firstObject.get('top'), initialTopValue, 'should restore initial top value');
  });

  QUnit.test('containsPoint', function(assert) {

    var group = makeGroupWith2Objects();
    group.set({ originX: 'center', originY: 'center' }).setCoords();

    //  Rect #1     top: 100, left: 100, width: 30, height: 10
    //  Rect #2     top: 120, left: 50, width: 10, height: 40

    assert.ok(typeof group.containsPoint === 'function');

    assert.ok(!group.containsPoint(new fabric.Point( 0, 0 )));

    group.scale(2);
    assert.ok(group.containsPoint(new fabric.Point( 50, 120 )));
    assert.ok(group.containsPoint(new fabric.Point( 100, 160 )));
    assert.ok(!group.containsPoint(new fabric.Point( 0, 0 )));

    group.scale(1);
    group.padding = 30;
    group.setCoords();
    assert.ok(group.containsPoint(new fabric.Point( 50, 120 )));
    assert.ok(!group.containsPoint(new fabric.Point( 100, 170 )));
    assert.ok(!group.containsPoint(new fabric.Point( 0, 0 )));
  });

  QUnit.test('forEachObject', function(assert) {
    var group = makeGroupWith2Objects();

    assert.ok(typeof group.forEachObject === 'function');

    var iteratedObjects = [];
    group.forEachObject(function(groupObject) {
      iteratedObjects.push(groupObject);
    });

    assert.equal(iteratedObjects[0], group.getObjects()[0], 'iteration give back objects in same order');
    assert.equal(iteratedObjects[1], group.getObjects()[1], 'iteration give back objects in same order');
  });

  QUnit.test('fromObject', function(assert) {
    var done = assert.async();
    var group = makeGroupWith2ObjectsWithOpacity();

    assert.ok(typeof fabric.Group.fromObject === 'function');
    var groupObject = group.toObject();

    fabric.Group.fromObject(groupObject).then(function(newGroupFromObject) {

      var objectFromOldGroup = group.toObject();
      var objectFromNewGroup = newGroupFromObject.toObject();

      assert.ok(newGroupFromObject instanceof fabric.Group);

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

    var groupObject = new fabric.Group([
      new fabric.Rect({ width: 100, height: 100, fill: 'red' }),
      new fabric.Rect({ width: 100, height: 100, fill: 'yellow', left: 100 }),
      new fabric.Rect({ width: 100, height: 100, fill: 'blue', top: 100 }),
      new fabric.Rect({ width: 100, height: 100, fill: 'green', left: 100, top: 100 })
    ]);
    groupObject.clipPath = clipPath;

    var groupToObject = groupObject.toObject();

    fabric.Group.fromObject(groupToObject).then(function(newGroupFromObject) {

      var objectFromNewGroup = newGroupFromObject.toObject();

      assert.ok(newGroupFromObject instanceof fabric.Group);
      assert.ok(newGroupFromObject.clipPath instanceof fabric.Rect, 'clipPath has been restored');
      assert.deepEqual(objectFromNewGroup, groupToObject, 'double serialization gives same results');

      done();
    });
  });

  QUnit.test('fromObject restores aCoords', function(assert) {
    var done = assert.async();
    var group = makeGroupWith2ObjectsWithOpacity();

    var groupObject = group.toObject();
    groupObject.subTargetCheck = true;

    fabric.Group.fromObject(groupObject).then(function(newGroupFromObject) {
      assert.ok(newGroupFromObject._objects[0].aCoords.tl, 'acoords 0 are restored');
      assert.ok(newGroupFromObject._objects[1].aCoords.tl, 'acoords 1 are restored');
      done();
    });
  });

  QUnit.test('fromObject does not delete objects from source', function(assert) {
    var done = assert.async();
    var group = makeGroupWith2ObjectsWithOpacity();
    var groupObject = group.toObject();

    fabric.Group.fromObject(groupObject).then(function(newGroupFromObject) {
      assert.equal(newGroupFromObject.objects, undefined, 'the objects array has not been pulled in');
      assert.notEqual(groupObject.objects, undefined, 'the objects array has not been deleted from object source');
      done();
    });
  });

  QUnit.test('toSVG', function(assert) {
    var group = makeGroupWith2Objects();
    assert.ok(typeof group.toSVG === 'function');
    var expectedSVG = '<g transform=\"matrix(1 0 0 1 90 130)\"  >\n<g style=\"\"   >\n\t\t<g transform=\"matrix(1 0 0 1 25 -25)\"  >\n<rect style=\"stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;\"  x=\"-15\" y=\"-5\" rx=\"0\" ry=\"0\" width=\"30\" height=\"10\" />\n</g>\n\t\t<g transform=\"matrix(1 0 0 1 -35 10)\"  >\n<rect style=\"stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;\"  x=\"-5\" y=\"-20\" rx=\"0\" ry=\"0\" width=\"10\" height=\"40\" />\n</g>\n</g>\n</g>\n';
    assert.equalSVG(group.toSVG(), expectedSVG);
  });

  QUnit.test('toSVG with a clipPath', function(assert) {
    var group = makeGroupWith2Objects();
    group.clipPath = new fabric.Rect({ width: 100, height: 100 });
    var expectedSVG = '<g transform=\"matrix(1 0 0 1 90 130)\" clip-path=\"url(#CLIPPATH_0)\"  >\n<clipPath id=\"CLIPPATH_0\" >\n\t<rect transform=\"matrix(1 0 0 1 50.5 50.5)\" x=\"-50\" y=\"-50\" rx=\"0\" ry=\"0\" width=\"100\" height=\"100\" />\n</clipPath>\n<g style=\"\"   >\n\t\t<g transform=\"matrix(1 0 0 1 25 -25)\"  >\n<rect style=\"stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;\"  x=\"-15\" y=\"-5\" rx=\"0\" ry=\"0\" width=\"30\" height=\"10\" />\n</g>\n\t\t<g transform=\"matrix(1 0 0 1 -35 10)\"  >\n<rect style=\"stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;\"  x=\"-5\" y=\"-20\" rx=\"0\" ry=\"0\" width=\"10\" height=\"40\" />\n</g>\n</g>\n</g>\n';
    assert.equalSVG(group.toSVG(), expectedSVG);
  });

  QUnit.test('toSVG with a clipPath absolutePositioned', function(assert) {
    var group = makeGroupWith2Objects();
    group.clipPath = new fabric.Rect({ width: 100, height: 100 });
    group.clipPath.absolutePositioned = true;
    var expectedSVG = '<g clip-path=\"url(#CLIPPATH_0)\"  >\n<g transform=\"matrix(1 0 0 1 90 130)\"  >\n<clipPath id=\"CLIPPATH_0\" >\n\t<rect transform=\"matrix(1 0 0 1 50.5 50.5)\" x=\"-50\" y=\"-50\" rx=\"0\" ry=\"0\" width=\"100\" height=\"100\" />\n</clipPath>\n<g style=\"\"   >\n\t\t<g transform=\"matrix(1 0 0 1 25 -25)\"  >\n<rect style=\"stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;\"  x=\"-15\" y=\"-5\" rx=\"0\" ry=\"0\" width=\"30\" height=\"10\" />\n</g>\n\t\t<g transform=\"matrix(1 0 0 1 -35 10)\"  >\n<rect style=\"stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;\"  x=\"-5\" y=\"-20\" rx=\"0\" ry=\"0\" width=\"10\" height=\"40\" />\n</g>\n</g>\n</g>\n</g>\n';
    assert.equalSVG(group.toSVG(), expectedSVG);
  });

  QUnit.test('toSVG with a group as a clipPath', function(assert) {
    var group = makeGroupWith2Objects();
    group.clipPath = makeGroupWith2Objects();
    var expectedSVG = '<g transform=\"matrix(1 0 0 1 90 130)\" clip-path=\"url(#CLIPPATH_0)\"  >\n<clipPath id=\"CLIPPATH_0\" >\n\t\t<rect transform=\"matrix(1 0 0 1 115 105)\" x=\"-15\" y=\"-5\" rx=\"0\" ry=\"0\" width=\"30\" height=\"10\" />\n\t\t<rect transform=\"matrix(1 0 0 1 55 140)\" x=\"-5\" y=\"-20\" rx=\"0\" ry=\"0\" width=\"10\" height=\"40\" />\n</clipPath>\n<g style=\"\"   >\n\t\t<g transform=\"matrix(1 0 0 1 25 -25)\"  >\n<rect style=\"stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;\"  x=\"-15\" y=\"-5\" rx=\"0\" ry=\"0\" width=\"30\" height=\"10\" />\n</g>\n\t\t<g transform=\"matrix(1 0 0 1 -35 10)\"  >\n<rect style=\"stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;\"  x=\"-5\" y=\"-20\" rx=\"0\" ry=\"0\" width=\"10\" height=\"40\" />\n</g>\n</g>\n</g>\n';
    assert.equalSVG(group.toSVG(), expectedSVG);
  });

  QUnit.test('cloning group with 2 objects', function(assert) {
    var done = assert.async();
    var group = makeGroupWith2Objects();
    group.clone().then(function(clone) {
      assert.ok(clone !== group);
      assert.deepEqual(clone.toObject(), group.toObject());
      done();
    });
  });

  QUnit.test('get with locked objects', function(assert) {
    var group = makeGroupWith2Objects();

    assert.equal(group.get('lockMovementX'), false);

    // TODO acitveGroup
    // group.getObjects()[0].lockMovementX = true;
    // assert.equal(group.get('lockMovementX'), true);
    //
    // group.getObjects()[0].lockMovementX = false;
    // assert.equal(group.get('lockMovementX'), false);

    group.set('lockMovementX', true);
    assert.equal(group.get('lockMovementX'), true);

    // group.set('lockMovementX', false);
    // group.getObjects()[0].lockMovementY = true;
    // group.getObjects()[1].lockRotation = true;
    //
    // assert.equal(group.get('lockMovementY'), true);
    // assert.equal(group.get('lockRotation'), true);
  });

  QUnit.test('object stacking methods with group objects', function (assert) {

    var textBg = new fabric.Rect({
      fill: '#abc',
      width: 100,
      height: 100
    });

    var text = new fabric.Text('text');
    var obj = new fabric.Object();
    var group = new fabric.Group([textBg, text, obj]);

    assert.ok(typeof group.sendObjectToBack === 'function');
    assert.ok(typeof group.bringObjectToFront === 'function');
    assert.ok(typeof group.sendObjectBackwards === 'function');
    assert.ok(typeof group.bringObjectForward === 'function');
    assert.ok(typeof group.moveObjectTo === 'function');

    canvas.add(group);

    assert.deepEqual(group.getObjects(), [textBg, text, obj]);

    group.dirty = false;
    group.bringObjectToFront(textBg);
    assert.deepEqual(group.getObjects(), [text, obj, textBg]);
    assert.ok(group.dirty, 'should invalidate group');

    group.dirty = false;
    group.sendObjectToBack(textBg);
    assert.deepEqual(group.getObjects(), [textBg, text, obj]);
    assert.ok(group.dirty, 'should invalidate group');

    group.dirty = false;
    group.bringObjectToFront(textBg);
    assert.deepEqual(group.getObjects(), [text, obj, textBg]);
    assert.ok(group.dirty, 'should invalidate group');

    group.dirty = false;
    group.bringObjectToFront(textBg);
    assert.deepEqual(group.getObjects(), [text, obj, textBg], 'has no effect');
    assert.ok(group.dirty === false, 'should not invalidate group');

    group.dirty = false;
    group.sendObjectToBack(textBg);
    assert.deepEqual(group.getObjects(), [textBg, text, obj]);
    assert.ok(group.dirty, 'should invalidate group');

    group.dirty = false;
    group.sendObjectToBack(textBg);
    assert.deepEqual(group.getObjects(), [textBg, text, obj], 'has no effect');
    assert.ok(group.dirty === false, 'should not invalidate group');

    group.dirty = false;
    group.sendObjectBackwards(obj);
    assert.deepEqual(group.getObjects(), [textBg, obj, text]);
    assert.ok(group.dirty, 'should invalidate group');

    group.dirty = false;
    group.bringObjectForward(text);
    assert.deepEqual(group.getObjects(), [textBg, obj, text], 'has no effect');
    assert.ok(group.dirty === false, 'should not invalidate group');

    group.dirty = false;
    group.bringObjectForward(obj);
    assert.deepEqual(group.getObjects(), [textBg, text, obj]);
    assert.ok(group.dirty, 'should invalidate group');

    group.dirty = false;
    group.bringObjectForward(textBg);
    assert.deepEqual(group.getObjects(), [text, textBg, obj]);
    assert.ok(group.dirty, 'should invalidate group');

    group.dirty = false;
    group.moveObjectTo(obj, 2);
    assert.deepEqual(group.getObjects(), [text, textBg, obj], 'has no effect');
    assert.ok(group.dirty === false, 'should not invalidate group');

    group.dirty = false;
    group.moveObjectTo(obj, 0);
    assert.deepEqual(group.getObjects(), [obj, text, textBg]);
  });

  QUnit.test('group reference on an object', function(assert) {
    var group = makeGroupWith2Objects();
    var firstObjInGroup = group.getObjects()[0];
    var secondObjInGroup = group.getObjects()[1];

    assert.equal(firstObjInGroup.group, group);
    assert.equal(secondObjInGroup.group, group);
    assert.equal(firstObjInGroup.parent, group);
    assert.equal(secondObjInGroup.parent, group);

    group.remove(firstObjInGroup);
    assert.ok(typeof firstObjInGroup.group === 'undefined');
    assert.ok(typeof firstObjInGroup.parent === 'undefined');
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
      group = new fabric.Group(),
      control = [],
      fired = [],
      firingControl = [];

    group.add(rect1, rect2);
    control.push(rect1, rect2);

    assert.ok(typeof group.insertAt === 'function', 'should respond to `insertAt` method');

    const equalsControl = (description) => {
      assert.deepEqual(group.getObjects().map(o => o.id), control.map(o => o.id), 'should equal control array ' + description);
      assert.deepEqual(group.getObjects(), control, 'should equal control array ' + description);
      assert.deepEqual(fired.map(o => o.id), firingControl.map(o => o.id), 'fired events should equal control array ' + description);
      assert.deepEqual(fired, firingControl, 'fired events should equal control array ' + description);
    }

    assert.ok(typeof group._onObjectAdded === 'function', 'has a standard _onObjectAdded method');
    [rect1, rect2, rect3, rect4, rect5, rect6, rect7, rect8].forEach(obj => {
      obj.on('added', e => {
        assert.equal(e.target, group);
        fired.push(obj);
      });
    });

    group.insertAt(1, rect3);
    control.splice(1, 0, rect3);
    firingControl.push(rect3);
    equalsControl('rect3');
    group.insertAt(0, rect4);
    control.splice(0, 0, rect4);
    firingControl.push(rect4);
    equalsControl('rect4');
    group.insertAt(2, rect5);
    control.splice(2, 0, rect5);
    firingControl.push(rect5);
    equalsControl('rect5');
    group.insertAt(2, rect6);
    control.splice(2, 0, rect6);
    firingControl.push(rect6);
    equalsControl('rect6');
    group.insertAt(3, rect7, rect8);
    control.splice(3, 0, rect7, rect8);
    firingControl.push(rect7, rect8);
    equalsControl('rect7');
  });

  QUnit.test('dirty flag propagation from children up', function(assert) {
    var g1 = makeGroupWith4Objects();
    var obj = g1.item(0);
    g1.dirty = false;
    obj.dirty = false;
    g1.ownCaching = true;
    assert.equal(g1.dirty, false, 'Group has no dirty flag set');
    obj.set('fill', 'red');
    assert.equal(obj.dirty, true, 'Obj has dirty flag set');
    assert.equal(g1.dirty, true, 'Group has dirty flag set');
  });

  QUnit.test('dirty flag propagation from children up is stopped if group is not caching', function(assert) {
    var g1 = makeGroupWith4Objects();
    var obj = g1.item(0);
    g1.dirty = false;
    obj.dirty = false;
    g1.ownCaching = false;
    assert.equal(g1.dirty, false, 'Group has no dirty flag set');
    obj.set('fill', 'red');
    assert.equal(obj.dirty, true, 'Obj has dirty flag set');
    assert.equal(g1.dirty, false, 'Group has no dirty flag set');
  });

  QUnit.test('dirty flag propagation from children up does not happen if value does not change really', function(assert) {
    var g1 = makeGroupWith4Objects();
    var obj = g1.item(0);
    obj.fill = 'red';
    g1.dirty = false;
    obj.dirty = false;
    g1.ownCaching = true;
    assert.equal(obj.dirty, false, 'Obj has no dirty flag set');
    assert.equal(g1.dirty, false, 'Group has no dirty flag set');
    obj.set('fill', 'red');
    assert.equal(obj.dirty, false, 'Obj has no dirty flag set');
    assert.equal(g1.dirty, false, 'Group has no dirty flag set');
  });

  QUnit.test('dirty flag propagation from children up with', function (assert) {
    var g1 = makeGroupWith4Objects();
    var obj = g1.item(0);
    g1.dirty = false;
    obj.dirty = false;
    // specify that the group is caching or the test will fail under node since the
    // object caching is disabled by default
    g1.ownCaching = true;
    assert.equal(g1.dirty, false, 'Group has no dirty flag set');
    obj.set('angle', 5);
    assert.equal(obj.dirty, false, 'Obj has dirty flag still false');
    assert.equal(g1.dirty, true, 'Group has dirty flag set');
  });

  QUnit.test('_getCacheCanvasDimensions returns dimensions and zoom for cache canvas are influenced by group', function(assert) {
    var g1 = makeGroupWith4Objects();
    var obj = g1.item(0);
    var dims = obj._getCacheCanvasDimensions();
    g1.scaleX = 2;
    var dims2 = obj._getCacheCanvasDimensions();
    assert.equal((dims2.width - 2), (dims.width - 2) * g1.scaleX, 'width of cache has increased with group scale');
  });

  QUnit.test('test group - pixels.', function(assert) {
    var rect1 = new fabric.Rect({ top: 1, left: 1, width: 2, height: 2, strokeWidth: 0, fill: 'red', opacity: 1, objectCaching: false}),
        rect2 = new fabric.Rect({ top: 5, left: 5, width: 2, height: 2, strokeWidth: 0, fill: 'red', opacity: 1, objectCaching: false}),
        group = new fabric.Group([rect1, rect2], {opacity: 1, fill: '', strokeWidth: 0, objectCaching: false}),
        isTransparent = fabric.util.isTransparent,
        ctx = canvas.contextContainer;
    canvas.add(group);
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

  QUnit.test('group add', function(assert) {
    var rect1 = new fabric.Rect({ top: 1, left: 1, width: 2, height: 2, strokeWidth: 0, fill: 'red', opacity: 1, objectCaching: false}),
        rect2 = new fabric.Rect({ top: 5, left: 5, width: 2, height: 2, strokeWidth: 0, fill: 'red', opacity: 1, objectCaching: false}),
        group = new fabric.Group([rect1], { layoutManager: new fabric.LayoutManager() });

    var coords = group.aCoords;
    group.add(rect2);
    var newCoords = group.aCoords;
    assert.notEqual(coords, newCoords, 'object coords have been recalculated - add');
  });

  QUnit.test('group add edge cases', function (assert) {
    var rect1 = new fabric.Rect({ top: 1, left: 1, width: 2, height: 2, strokeWidth: 0, fill: 'red', opacity: 1, objectCaching: false }),
      rect2 = new fabric.Rect({ top: 5, left: 5, width: 2, height: 2, strokeWidth: 0, fill: 'red', opacity: 1, objectCaching: false }),
      group = new fabric.Group([rect1]);

    //  duplicate
    assert.notOk(group.canEnterGroup(rect1));
    group.add(rect1);
    assert.deepEqual(group.getObjects(), [rect1], 'objects should not have changed');
    //  duplicate on same call
    assert.ok(group.canEnterGroup(rect2));
    group.add(rect2, rect2);
    assert.deepEqual(group.getObjects(), [rect1, rect2], '`rect2` should have entered once');
    //  adding self
    assert.notOk(group.canEnterGroup(group));
    group.insertAt(0, group);
    assert.deepEqual(group.getObjects(), [rect1, rect2], 'objects should not have changed');
    //  nested object should be removed from group
    var nestedGroup = new fabric.Group([rect1]);
    assert.ok(group.canEnterGroup(nestedGroup));
    group.add(nestedGroup);
    assert.deepEqual(group.getObjects(), [rect2, nestedGroup], '`rect1` was removed from group once it entered `nestedGroup`');
    //  circular group
    var circularGroup = new fabric.Group([group]);
    assert.notOk(group.canEnterGroup(circularGroup), 'circular group should be denied entry');
    group.add(circularGroup);
    assert.deepEqual(group.getObjects(), [rect2, nestedGroup], 'objects should not have changed');
  });

  QUnit.test('group remove', function(assert) {
    var rect1 = new fabric.Rect({ top: 1, left: 1, width: 2, height: 2, strokeWidth: 0, fill: 'red', opacity: 1, objectCaching: false}),
        rect2 = new fabric.Rect({ top: 5, left: 5, width: 2, height: 2, strokeWidth: 0, fill: 'red', opacity: 1, objectCaching: false}),
        group = new fabric.Group([rect1, rect2], { layoutManager: new fabric.LayoutManager() });

    var coords = group.aCoords;
    group.remove(rect2);
    var newCoords = group.aCoords;
    assert.notEqual(coords, newCoords, 'object coords have been recalculated - remove');
  });

  QUnit.test('group willDrawShadow', function(assert) {
    var rect1 = new fabric.Rect({ top: 1, left: 1, width: 2, height: 2, strokeWidth: 0, fill: 'red', opacity: 1, objectCaching: false}),
        rect2 = new fabric.Rect({ top: 5, left: 5, width: 2, height: 2, strokeWidth: 0, fill: 'red', opacity: 1, objectCaching: false}),
        rect3 = new fabric.Rect({ top: 5, left: 5, width: 2, height: 2, strokeWidth: 0, fill: 'red', opacity: 1, objectCaching: false}),
        rect4 = new fabric.Rect({ top: 5, left: 5, width: 2, height: 2, strokeWidth: 0, fill: 'red', opacity: 1, objectCaching: false}),
        group = new fabric.Group([rect1, rect2]),
        group2 = new fabric.Group([rect3, rect4]),
        group3 = new fabric.Group([group, group2]);

    assert.equal(group3.willDrawShadow(), false, 'group will not cast shadow because objects do not have it');
    group3.shadow = { offsetX: 1, offsetY: 2, };
    assert.equal(group3.willDrawShadow(), true, 'group will cast shadow because group itself has shadow');
    delete group3.shadow;
    group2.shadow = { offsetX: 1, offsetY: 2, };
    assert.equal(group3.willDrawShadow(), true, 'group will cast shadow because inner group2 has shadow');
    delete group2.shadow;
    rect1.shadow = { offsetX: 1, offsetY: 2, };
    assert.equal(group3.willDrawShadow(), true, 'group will cast shadow because inner rect1 has shadow');
    assert.equal(group.willDrawShadow(), true, 'group will cast shadow because inner rect1 has shadow');
    assert.equal(group2.willDrawShadow(), false, 'group will not cast shadow because no child has shadow');
  });

  QUnit.test('group willDrawShadow with no offsets', function(assert) {
    var rect1 = new fabric.Rect({ top: 1, left: 1, width: 2, height: 2, strokeWidth: 0, fill: 'red', opacity: 1, objectCaching: false}),
        rect2 = new fabric.Rect({ top: 5, left: 5, width: 2, height: 2, strokeWidth: 0, fill: 'red', opacity: 1, objectCaching: false}),
        rect3 = new fabric.Rect({ top: 5, left: 5, width: 2, height: 2, strokeWidth: 0, fill: 'red', opacity: 1, objectCaching: false}),
        rect4 = new fabric.Rect({ top: 5, left: 5, width: 2, height: 2, strokeWidth: 0, fill: 'red', opacity: 1, objectCaching: false}),
        group = new fabric.Group([rect1, rect2]),
        group2 = new fabric.Group([rect3, rect4]),
        group3 = new fabric.Group([group, group2]);

    assert.equal(group3.willDrawShadow(), false, 'group will not cast shadow because objects do not have it');
    group3.shadow = { offsetX: 0, offsetY: 0 };
    assert.equal(group3.willDrawShadow(), false, 'group will NOT cast shadow because group itself has shadow but not offsets');
    group3.shadow = { offsetX: 2, offsetY: 0 };
    assert.equal(group3.willDrawShadow(), true, 'group will cast shadow because group itself has shadow and one offsetX different than 0');
    group3.shadow = { offsetX: 0, offsetY: 2 };
    assert.equal(group3.willDrawShadow(), true, 'group will cast shadow because group itself has shadow and one offsetY different than 0');
    group3.shadow = { offsetX: -2, offsetY: 0 };
    assert.equal(group3.willDrawShadow(), true, 'group will cast shadow because group itself has shadow and one offsetX different than 0');
    group3.shadow = { offsetX: 0, offsetY: -2 };
    assert.equal(group3.willDrawShadow(), true, 'group will cast shadow because group itself has shadow and one offsetY different than 0');
    rect1.shadow = { offsetX: 1, offsetY: 2, };
    group3.shadow = { offsetX: 0, offsetY: 0 };
    assert.equal(group3.willDrawShadow(), true, 'group will cast shadow because group itself will not, but rect 1 will');

  });

  QUnit.test('group shouldCache', function(assert) {
    var rect1 = new fabric.Rect({ top: 1, left: 1, width: 2, height: 2, strokeWidth: 0, fill: 'red', opacity: 1, objectCaching: true}),
        rect2 = new fabric.Rect({ top: 5, left: 5, width: 2, height: 2, strokeWidth: 0, fill: 'red', opacity: 1, objectCaching: true}),
        rect3 = new fabric.Rect({ top: 5, left: 5, width: 2, height: 2, strokeWidth: 0, fill: 'red', opacity: 1, objectCaching: true}),
        rect4 = new fabric.Rect({ top: 5, left: 5, width: 2, height: 2, strokeWidth: 0, fill: 'red', opacity: 1, objectCaching: true}),
        group = new fabric.Group([rect1, rect2], { objectCaching: true}),
        group2 = new fabric.Group([rect3, rect4], { objectCaching: true}),
        group3 = new fabric.Group([group, group2], { objectCaching: true});

    assert.equal(group3.shouldCache(), true, 'group3 will cache because no child has shadow');
    assert.equal(group2.shouldCache(), false, 'group2 will not cache because is drawing on parent group3 cache');
    assert.equal(rect3.shouldCache(), false, 'rect3 will not cache because is drawing on parent2 group cache');

    group2.shadow = { offsetX: 2, offsetY: 0 };
    rect1.shadow = { offsetX: 0, offsetY: 2 };

    assert.equal(group3.shouldCache(), false, 'group3 will cache because children have shadow');
    assert.equal(group2.shouldCache(), true, 'group2 will cache because is not drawing on parent group3 cache and no children have shadow');
    assert.equal(group.shouldCache(), false, 'group will not cache because even if is not drawing on parent group3 cache children have shadow');

    assert.equal(rect1.shouldCache(), true, 'rect1 will cache because none of its parent is caching');
    assert.equal(rect3.shouldCache(), false, 'rect3 will not cache because group2 is caching');

  });

  QUnit.test('canvas prop propagation with set', function(assert) {
    var rect1 = new fabric.Rect({ top: 1, left: 1, width: 2, height: 2, strokeWidth: 0, fill: 'red', opacity: 1, objectCaching: true}),
        rect2 = new fabric.Rect({ top: 5, left: 5, width: 2, height: 2, strokeWidth: 0, fill: 'red', opacity: 1, objectCaching: true}),
        group = new fabric.Group([rect1, rect2]);

    group.set('canvas', 'a-canvas');
    assert.equal(group.canvas, 'a-canvas', 'canvas has been set');
    assert.equal(group._objects[0].canvas, 'a-canvas', 'canvas has been set on object 0');
    assert.equal(group._objects[1].canvas, 'a-canvas', 'canvas has been set on object 1');
  });

  QUnit.test('canvas prop propagation with add', function(assert) {
    var rect1 = new fabric.Rect({ top: 1, left: 1, width: 2, height: 2, strokeWidth: 0, fill: 'red', opacity: 1, objectCaching: true}),
        rect2 = new fabric.Rect({ top: 5, left: 5, width: 2, height: 2, strokeWidth: 0, fill: 'red', opacity: 1, objectCaching: true}),
        group = new fabric.Group([rect1, rect2]);

    canvas.add(group);
    assert.equal(group.canvas, canvas, 'canvas has been set');
    assert.equal(group._objects[0].canvas, canvas, 'canvas has been set on object 0');
    assert.equal(group._objects[1].canvas, canvas, 'canvas has been set on object 1');
  });

  QUnit.test('canvas prop propagation with add to group', function(assert) {
    var rect1 = new fabric.Rect({ top: 1, left: 1, width: 2, height: 2, strokeWidth: 0, fill: 'red', opacity: 1, objectCaching: true}),
        rect2 = new fabric.Rect({ top: 5, left: 5, width: 2, height: 2, strokeWidth: 0, fill: 'red', opacity: 1, objectCaching: true}),
        group = new fabric.Group();

    canvas.add(group);
    assert.equal(group.canvas, canvas, 'canvas has been set');
    group.add(rect1);
    assert.equal(group._objects[0].canvas, canvas, 'canvas has been set on object 0');
    group.add(rect2);
    assert.equal(group._objects[1].canvas, canvas, 'canvas has been set on object 0');
  });

  QUnit.test('add and coordinates', function(assert) {
    var rect1 = new fabric.Rect({ top: 1, left: 1, width: 3, height: 2, strokeWidth: 0, fill: 'red' }),
        rect2 = new fabric.Rect({ top: 5, left: 5, width: 2, height: 6, angle: 90, strokeWidth: 0, fill: 'red' }),
        group = new fabric.Group([], { layoutManager: new fabric.LayoutManager() });
    group.add(rect1);
    group.add(rect2);
    group.left = 5;
    group.top = 5;
    group.scaleX = 3;
    group.scaleY = 2;
    group.removeAll();
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
        group0 = new fabric.Group([rect1, rect2]),
        rect3 = new fabric.Rect({ top: 2, left: 9, width: 3, height: 2, strokeWidth: 0, fill: 'red' }),
        rect4 = new fabric.Rect({ top: 3, left: 5, width: 2, height: 6, angle: 90, strokeWidth: 0, fill: 'red' }),
        group1 = new fabric.Group([rect3, rect4], { scaleX: 3, scaleY: 4 }),
        group = new fabric.Group([group0, group1], { angle: 90, scaleX: 2, scaleY: 0.5 }),
        rect5 = new fabric.Rect({ top: 1, left: 1, width: 3, height: 2, strokeWidth: 0, fill: 'red' });

    group1.addRelativeToGroup(rect5);
    var t = group1.calcTransformMatrix();
    fabric.util.transformPoint(new fabric.Point(rect5.left, rect5.top), t);
    assert.equal(rect5.top, -5.5, 'top has been moved');
    assert.equal(rect5.left, -19.5, 'left has been moved');
    assert.equal(rect5.scaleX, 2, 'scaleX has been scaled');
    assert.equal(rect5.scaleY, 0.5, 'scaleY has been scaled');
    group.removeAll();
    group1.removeAll();
    assert.equal(rect5.top, 1, 'top is back to original minus rounding errors');
    assert.equal(rect5.left, 1, 'left is back to original');
    assert.equal(rect5.scaleX, 1, 'scaleX is back to original');
    assert.equal(rect5.scaleY, 1, 'scaleY is back to original');
  });

  // QUnit.test('cloning group with image', function(assert) {
  //   var done = assert.async();
  //   var rect = new fabric.Rect({ top: 100, left: 100, width: 30, height: 10 }),
  //       img = new fabric.Image(_createImageElement()),
  //       group = new fabric.Group([ rect, img ]);

  //   img.src = 'foo.png';

  //   group.clone(function(clone) {
  //     assert.ok(clone !== group);
  //     assert.deepEqual(clone.toObject(), group.toObject());

  //     done();
  //   });
  // });

})();
