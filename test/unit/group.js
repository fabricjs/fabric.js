(function() {
  var canvas = this.canvas = new fabric.StaticCanvas(null, {enableRetinaScaling: false, width: 600, height: 600});

  function makeGroupWith2Objects() {
    var rect1 = new fabric.Rect({ top: 100, left: 100, width: 30, height: 10, strokeWidth: 0 }),
        rect2 = new fabric.Rect({ top: 120, left: 50, width: 10, height: 40, strokeWidth: 0 });

    return new fabric.Group([rect1, rect2], {strokeWidth: 0});
  }

  function makeGroupWith2ObjectsWithOpacity() {
    var rect1 = new fabric.Rect({ top: 100, left: 100, width: 30, height: 10, strokeWidth: 0, opacity: 0.5 }),
        rect2 = new fabric.Rect({ top: 120, left: 50, width: 10, height: 40, strokeWidth: 0, opacity: 0.8 });

    return new fabric.Group([rect1, rect2], {strokeWidth: 0});
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
      fabric.Object.__uid = 0;
      canvas.clear();
      canvas.backgroundColor = fabric.Canvas.prototype.backgroundColor;
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
    assert.equal(group.toString(), '#<fabric.Group: (2)>', 'should return proper representation');
  });

  QUnit.test('getObjects', function(assert) {
    var rect1 = new fabric.Rect(),
        rect2 = new fabric.Rect();

    var group = new fabric.Group([rect1, rect2]);

    assert.ok(typeof group.getObjects === 'function');
    assert.ok(Object.prototype.toString.call(group.getObjects()) == '[object Array]', 'should be an array');
    assert.equal(group.getObjects().length, 2, 'should have 2 items');
    assert.deepEqual(group.getObjects(), [rect1, rect2], 'should return deepEqual objects as those passed to constructor');
  });

  QUnit.test('getObjects with type', function(assert) {
    var rect = new fabric.Rect({ width: 10, height: 20 }),
        circle = new fabric.Circle({ radius: 30 });

    var group = new fabric.Group([rect, circle]);

    assert.equal(group.size(), 2, 'should have length=2 initially');

    assert.deepEqual(group.getObjects('rect'), [rect], 'should return rect only');
    assert.deepEqual(group.getObjects('circle'), [circle], 'should return circle only');
  });

  QUnit.test('add', function(assert) {
    var group = makeGroupWith2Objects();
    var rect1 = new fabric.Rect(),
        rect2 = new fabric.Rect(),
        rect3 = new fabric.Rect();

    assert.ok(typeof group.add === 'function');
    assert.equal(group.add(rect1), group, 'should be chainable');
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
        group = new fabric.Group([rect1, rect2, rect3]);

    assert.ok(typeof group.remove === 'function');
    assert.equal(group.remove(rect2), group, 'should be chainable');
    assert.deepEqual(group.getObjects(), [rect1, rect3], 'should remove object properly');

    group.remove(rect1, rect3);
    assert.equal(group.isEmpty(), true, 'group should be empty');
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

    assert.equal(group.set('opacity', 0.12345), group, 'should be chainable');
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
      type:                     'group',
      originX:                  'left',
      originY:                  'top',
      left:                     50,
      top:                      100,
      width:                    80,
      height:                   60,
      fill:                     'rgb(0,0,0)',
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
      strokeUniform:            false
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
      type: 'rect',
      left: 10,
      top: -30,
      width: 30,
      height: 10,
      strokeWidth: 0
    }, {
      version: fabric.version,
      type: 'rect',
      left: -40,
      top: -10,
      width: 10,
      height: 40,
      strokeWidth: 0
    }];
    var expectedObject = {
      version: fabric.version,
      type: 'group',
      left: 50,
      top: 100,
      width: 80,
      height: 60,
      objects: objects
    };
    assert.deepEqual(clone, expectedObject);
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

  QUnit.test('moveTo', function(assert) {
    var group = makeGroupWith4Objects(),
        groupEl1 = group.getObjects()[0],
        groupEl2 = group.getObjects()[1],
        groupEl3 = group.getObjects()[2],
        groupEl4 = group.getObjects()[3];

    assert.ok(typeof group.item(0).moveTo === 'function');

    // [ 1, 2, 3, 4 ]
    assert.equal(group.item(0), groupEl1);
    assert.equal(group.item(1), groupEl2);
    assert.equal(group.item(2), groupEl3);
    assert.equal(group.item(3), groupEl4);
    assert.equal(group.item(9999), undefined);

    group.item(0).moveTo(3);

    // moved 1 to level 3 — [2, 3, 4, 1]
    assert.equal(group.item(3), groupEl1);
    assert.equal(group.item(0), groupEl2);
    assert.equal(group.item(1), groupEl3);
    assert.equal(group.item(2), groupEl4);
    assert.equal(group.item(9999), undefined);

    group.item(0).moveTo(2);

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

  QUnit.test('destroy', function(assert) {
    var group = makeGroupWith2Objects(),
        firstObject = group.item(0),
        initialLeftValue = 100,
        initialTopValue = 100;

    assert.ok(typeof group.destroy === 'function');

    assert.ok(initialLeftValue !== firstObject.get('left'));
    assert.ok(initialTopValue !== firstObject.get('top'));

    group.destroy();
    assert.equal(firstObject.get('left'), initialLeftValue, 'should restore initial left value');
    assert.equal(firstObject.get('top'), initialTopValue, 'should restore initial top value');
  });

  QUnit.test('setObjectCoords', function(assert) {
    var group = makeGroupWith2Objects();

    assert.ok(typeof group.setObjectsCoords === 'function');

    var invokedObjects = [];
    group.forEachObject(function(groupObject){
      groupObject.setCoords = function() {
        invokedObjects.push(this);
      };
    }, this);

    assert.equal(group.setObjectsCoords(), group, 'should be chainable');
    // this.assertEnumEqualUnordered(invokedObjects, group.getObjects(), 'setObjectsCoords should call setCoords on all objects');
  });

  QUnit.test('containsPoint', function(assert) {

    var group = makeGroupWith2Objects();
    group.set({ originX: 'center', originY: 'center' }).setCoords();

    //  Rect #1     top: 100, left: 100, width: 30, height: 10
    //  Rect #2     top: 120, left: 50, width: 10, height: 40

    assert.ok(typeof group.containsPoint === 'function');

    assert.ok(!group.containsPoint({ x: 0, y: 0 }));

    group.scale(2);
    assert.ok(group.containsPoint({ x: 50, y: 120 }));
    assert.ok(group.containsPoint({ x: 100, y: 160 }));
    assert.ok(!group.containsPoint({ x: 0, y: 0 }));

    group.scale(1);
    group.padding = 30;
    group.setCoords();
    assert.ok(group.containsPoint({ x: 50, y: 120 }));
    assert.ok(!group.containsPoint({ x: 100, y: 170 }));
    assert.ok(!group.containsPoint({ x: 0, y: 0 }));
  });

  QUnit.test('forEachObject', function(assert) {
    var group = makeGroupWith2Objects();

    assert.ok(typeof group.forEachObject === 'function');
    assert.equal(group.forEachObject(function(){}), group, 'should be chainable');

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

    fabric.Group.fromObject(groupObject, function(newGroupFromObject) {

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

    fabric.Group.fromObject(groupToObject, function(newGroupFromObject) {

      var objectFromNewGroup = newGroupFromObject.toObject();

      assert.ok(newGroupFromObject instanceof fabric.Group);
      assert.ok(newGroupFromObject.clipPath instanceof fabric.Rect, 'clipPath has been restored');
      assert.deepEqual(objectFromNewGroup, groupToObject, 'double serialization gives same results');

      done();
    });
  });

  QUnit.test('fromObject restores oCoords', function(assert) {
    var done = assert.async();
    var group = makeGroupWith2ObjectsWithOpacity();

    var groupObject = group.toObject();

    fabric.Group.fromObject(groupObject, function(newGroupFromObject) {
      assert.ok(newGroupFromObject._objects[0].lineCoords.tl, 'acoords 0 are restored');
      assert.ok(newGroupFromObject._objects[1].lineCoords.tl, 'acoords 1 are restored');

      done();
    });
  });

  QUnit.test('fromObject does not delete objects from source', function(assert) {
    var done = assert.async();
    var group = makeGroupWith2ObjectsWithOpacity();
    var groupObject = group.toObject();

    fabric.Group.fromObject(groupObject, function(newGroupFromObject) {
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
    fabric.Group.fromObject(groupObject, function(newGroupFromObject) {
      assert.equal(newGroupFromObject.sourcePath, url, 'the url is copied in sourcePath');
      assert.equal(newGroupFromObject._objects.length, 2, '2 objects are created');
      done();
    });
  });

  QUnit.test('toSVG', function(assert) {
    var group = makeGroupWith2Objects();
    assert.ok(typeof group.toSVG === 'function');
    var expectedSVG = '<g transform=\"matrix(1 0 0 1 90 130)\"  >\n<g style=\"\"   >\n\t\t<g transform=\"matrix(1 0 0 1 25 -25)\"  >\n<rect style=\"stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;\"  x=\"-15\" y=\"-5\" rx=\"0\" ry=\"0\" width=\"30\" height=\"10\" />\n</g>\n\t\t<g transform=\"matrix(1 0 0 1 -35 10)\"  >\n<rect style=\"stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;\"  x=\"-5\" y=\"-20\" rx=\"0\" ry=\"0\" width=\"10\" height=\"40\" />\n</g>\n</g>\n</g>\n';
    assert.equal(group.toSVG(), expectedSVG);
  });

  QUnit.test('toSVG with a clipPath', function(assert) {
    var group = makeGroupWith2Objects();
    group.clipPath = new fabric.Rect({ width: 100, height: 100 });
    var expectedSVG = '<g transform=\"matrix(1 0 0 1 90 130)\" clip-path=\"url(#CLIPPATH_0)\"  >\n<clipPath id=\"CLIPPATH_0\" >\n\t<rect transform=\"matrix(1 0 0 1 50.5 50.5)\" x=\"-50\" y=\"-50\" rx=\"0\" ry=\"0\" width=\"100\" height=\"100\" />\n</clipPath>\n<g style=\"\"   >\n\t\t<g transform=\"matrix(1 0 0 1 25 -25)\"  >\n<rect style=\"stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;\"  x=\"-15\" y=\"-5\" rx=\"0\" ry=\"0\" width=\"30\" height=\"10\" />\n</g>\n\t\t<g transform=\"matrix(1 0 0 1 -35 10)\"  >\n<rect style=\"stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;\"  x=\"-5\" y=\"-20\" rx=\"0\" ry=\"0\" width=\"10\" height=\"40\" />\n</g>\n</g>\n</g>\n';
    assert.equal(group.toSVG(), expectedSVG);
  });

  QUnit.test('toSVG with a clipPath absolutePositioned', function(assert) {
    var group = makeGroupWith2Objects();
    group.clipPath = new fabric.Rect({ width: 100, height: 100 });
    group.clipPath.absolutePositioned = true;
    var expectedSVG = '<g clip-path=\"url(#CLIPPATH_0)\"  >\n<g transform=\"matrix(1 0 0 1 90 130)\"  >\n<clipPath id=\"CLIPPATH_0\" >\n\t<rect transform=\"matrix(1 0 0 1 50.5 50.5)\" x=\"-50\" y=\"-50\" rx=\"0\" ry=\"0\" width=\"100\" height=\"100\" />\n</clipPath>\n<g style=\"\"   >\n\t\t<g transform=\"matrix(1 0 0 1 25 -25)\"  >\n<rect style=\"stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;\"  x=\"-15\" y=\"-5\" rx=\"0\" ry=\"0\" width=\"30\" height=\"10\" />\n</g>\n\t\t<g transform=\"matrix(1 0 0 1 -35 10)\"  >\n<rect style=\"stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;\"  x=\"-5\" y=\"-20\" rx=\"0\" ry=\"0\" width=\"10\" height=\"40\" />\n</g>\n</g>\n</g>\n</g>\n';
    assert.equal(group.toSVG(), expectedSVG);
  });

  QUnit.test('toSVG with a group as a clipPath', function(assert) {
    var group = makeGroupWith2Objects();
    group.clipPath = makeGroupWith2Objects();
    var expectedSVG = '<g transform=\"matrix(1 0 0 1 90 130)\" clip-path=\"url(#CLIPPATH_0)\"  >\n<clipPath id=\"CLIPPATH_0\" >\n\t\t<rect transform=\"matrix(1 0 0 1 115 105)\" x=\"-15\" y=\"-5\" rx=\"0\" ry=\"0\" width=\"30\" height=\"10\" />\n\t\t<rect transform=\"matrix(1 0 0 1 55 140)\" x=\"-5\" y=\"-20\" rx=\"0\" ry=\"0\" width=\"10\" height=\"40\" />\n</clipPath>\n<g style=\"\"   >\n\t\t<g transform=\"matrix(1 0 0 1 25 -25)\"  >\n<rect style=\"stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;\"  x=\"-15\" y=\"-5\" rx=\"0\" ry=\"0\" width=\"30\" height=\"10\" />\n</g>\n\t\t<g transform=\"matrix(1 0 0 1 -35 10)\"  >\n<rect style=\"stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;\"  x=\"-5\" y=\"-20\" rx=\"0\" ry=\"0\" width=\"10\" height=\"40\" />\n</g>\n</g>\n</g>\n';
    assert.equal(group.toSVG(), expectedSVG);
  });

  QUnit.test('cloning group with 2 objects', function(assert) {
    var done = assert.async();
    var group = makeGroupWith2Objects();
    group.clone(function(clone) {

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

  QUnit.test('z-index methods with group objects', function(assert) {

    var textBg = new fabric.Rect({
      fill: '#abc',
      width: 100,
      height: 100
    });

    var text = new fabric.Text('text');
    var group = new fabric.Group([textBg, text]);

    canvas.add(group);

    assert.ok(group.getObjects()[0] === textBg);
    assert.ok(group.getObjects()[1] === text);

    textBg.bringToFront();

    assert.ok(group.getObjects()[0] === text);
    assert.ok(group.getObjects()[1] === textBg);

    textBg.sendToBack();

    assert.ok(group.getObjects()[0] === textBg);
    assert.ok(group.getObjects()[1] === text);
  });

  QUnit.test('group reference on an object', function(assert) {
    var group = makeGroupWith2Objects();
    var firstObjInGroup = group.getObjects()[0];
    var secondObjInGroup = group.getObjects()[1];

    assert.equal(firstObjInGroup.group, group);
    assert.equal(secondObjInGroup.group, group);

    group.remove(firstObjInGroup);
    assert.ok(typeof firstObjInGroup.group === 'undefined');
  });

  QUnit.test('insertAt', function(assert) {
    var rect1 = new fabric.Rect(),
        rect2 = new fabric.Rect(),
        group = new fabric.Group();

    group.add(rect1, rect2);

    assert.ok(typeof group.insertAt === 'function', 'should respond to `insertAt` method');

    group.insertAt(rect1, 1);
    assert.equal(group.item(1), rect1);
    group.insertAt(rect2, 2);
    assert.equal(group.item(2), rect2);
    assert.equal(group.insertAt(rect1, 2), group, 'should be chainable');
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

  QUnit.test('dirty flag propagation from children up with', function(assert) {
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
        group = new fabric.Group([rect1, rect2], {opacity: 1, fill: 'blue', strokeWidth: 0, objectCaching: false}),
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

  QUnit.test('group toDatalessObject', function(assert) {
    var rect1 = new fabric.Rect({ top: 1, left: 1, width: 2, height: 2, strokeWidth: 0, fill: 'red', opacity: 1, objectCaching: false}),
        rect2 = new fabric.Rect({ top: 5, left: 5, width: 2, height: 2, strokeWidth: 0, fill: 'red', opacity: 1, objectCaching: false}),
        pathGroup = new fabric.Group([rect1, rect2], { sourcePath: 'sourcePath'}),
        group = new fabric.Group([pathGroup]),
        dataless = group.toDatalessObject();

    assert.equal(dataless.objects[0].objects, 'sourcePath', 'the paths have been changed with the sourcePath');
  });

  QUnit.test('group addWithUpdate', function(assert) {
    var rect1 = new fabric.Rect({ top: 1, left: 1, width: 2, height: 2, strokeWidth: 0, fill: 'red', opacity: 1, objectCaching: false}),
        rect2 = new fabric.Rect({ top: 5, left: 5, width: 2, height: 2, strokeWidth: 0, fill: 'red', opacity: 1, objectCaching: false}),
        group = new fabric.Group([rect1]);

    var coords = group.oCoords;
    group.addWithUpdate(rect2);
    var newCoords = group.oCoords;
    assert.notEqual(coords, newCoords, 'object coords have been recalculated - add');
  });

  QUnit.test('group removeWithUpdate', function(assert) {
    var rect1 = new fabric.Rect({ top: 1, left: 1, width: 2, height: 2, strokeWidth: 0, fill: 'red', opacity: 1, objectCaching: false}),
        rect2 = new fabric.Rect({ top: 5, left: 5, width: 2, height: 2, strokeWidth: 0, fill: 'red', opacity: 1, objectCaching: false}),
        group = new fabric.Group([rect1, rect2]);

    var coords = group.oCoords;
    group.removeWithUpdate(rect2);
    var newCoords = group.oCoords;
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

  QUnit.test('useSetOnGroup', function(assert) {
    var rect1 = new fabric.Rect({ top: 1, left: 1, width: 2, height: 2, strokeWidth: 0, fill: 'red', opacity: 1, objectCaching: true}),
        rect2 = new fabric.Rect({ top: 5, left: 5, width: 2, height: 2, strokeWidth: 0, fill: 'red', opacity: 1, objectCaching: true}),
        group = new fabric.Group([rect1, rect2]);

    var count = 0;
    var inspectKey = '';
    var inspectValue = '';
    rect1.setOnGroup = function(key, value) {
      count++;
      inspectKey = key;
      inspectValue = value;
    };

    group.set('fill', 'red');
    assert.equal(count, 0, 'setOnGroup has not been called');
    assert.equal(inspectKey, '', 'setOnGroup has not been called');
    assert.equal(inspectValue, '', 'setOnGroup has not been called');
    group.useSetOnGroup = true;
    group.set('fill', 'red');
    assert.equal(count, 1, 'setOnGroup has been called');
    assert.equal(inspectKey, 'fill', 'setOnGroup has been called');
    assert.equal(inspectValue, 'red', 'setOnGroup has been called');
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
    group.addWithUpdate(rect2);
    assert.equal(group._objects[1].canvas, canvas, 'canvas has been set on object 0');
  });

  QUnit.test('addWithUpdate and coordinates', function(assert) {
    var rect1 = new fabric.Rect({ top: 1, left: 1, width: 3, height: 2, strokeWidth: 0, fill: 'red' }),
        rect2 = new fabric.Rect({ top: 5, left: 5, width: 2, height: 6, angle: 90, strokeWidth: 0, fill: 'red' }),
        group = new fabric.Group([]);
    group.addWithUpdate(rect1);
    group.addWithUpdate(rect2);
    group.left = 5;
    group.top = 5;
    group.scaleX = 3;
    group.scaleY = 2;
    group.destroy();
    assert.equal(rect1.top, 5, 'top has been moved');
    assert.equal(rect1.left, 11, 'left has been moved');
    assert.equal(rect1.scaleX, 3, 'scaleX has been scaled');
    assert.equal(rect1.scaleY, 2, 'scaleY has been scaled');
    assert.equal(rect2.top, 13, 'top has been moved');
    assert.equal(rect2.left, 23, 'left has been moved');
    assert.equal(rect2.scaleX, 2, 'scaleX has been scaled inverted because of angle 90');
    assert.equal(rect2.scaleY, 3, 'scaleY has been scaled inverted because of angle 90');
  });

  QUnit.test('addWithUpdate and coordinates with nested groups', function(assert) {
    var rect1 = new fabric.Rect({ top: 1, left: 1, width: 3, height: 2, strokeWidth: 0, fill: 'red' }),
        rect2 = new fabric.Rect({ top: 5, left: 5, width: 2, height: 6, angle: 90, strokeWidth: 0, fill: 'red' }),
        group0 = new fabric.Group([rect1, rect2]),
        rect3 = new fabric.Rect({ top: 2, left: 9, width: 3, height: 2, strokeWidth: 0, fill: 'red' }),
        rect4 = new fabric.Rect({ top: 3, left: 5, width: 2, height: 6, angle: 90, strokeWidth: 0, fill: 'red' }),
        group1 = new fabric.Group([rect3, rect4], { scaleX: 3, scaleY: 4 }),
        group = new fabric.Group([group0, group1], { angle: 90, scaleX: 2, scaleY: 0.5 }),
        rect5 = new fabric.Rect({ top: 1, left: 1, width: 3, height: 2, strokeWidth: 0, fill: 'red' });

    group1.addWithUpdate(rect5);
    assert.equal(rect5.top, -5.5, 'top has been moved');
    assert.equal(rect5.left, -19.5, 'left has been moved');
    assert.equal(rect5.scaleX, 2, 'scaleX has been scaled');
    assert.equal(rect5.scaleY, 0.5, 'scaleY has been scaled');
    group.destroy();
    group1.destroy();
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
