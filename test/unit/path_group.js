(function(){

  var REFERENCE_PATH_GROUP_OBJECT = {
    'type':               'path-group',
    'originX':            'center',
    'originY':            'center',
    'left':               0,
    'top':                0,
    'width':              0,
    'height':             0,
    'fill':               '',
    'overlayFill':        null,
    'stroke':             null,
    'strokeWidth':        1,
    'strokeDashArray':    null,
    'scaleX':             1,
    'scaleY':             1,
    'angle':              0,
    'flipX':              false,
    'flipY':              false,
    'opacity':            1,
    'selectable':         true,
    'hasControls':        true,
    'hasBorders':         true,
    'hasRotatingPoint':   true,
    'transparentCorners': true,
    'perPixelTargetFind': false,
    'shadow':             null,
    'visible':            true,
    'paths':              getPathObjects()
  };

  function getPathElement(path) {
    var el = fabric.document.createElement('path');
    el.setAttribute('d', path);
    el.setAttribute('fill', 'rgb(255,0,0)');
    el.setAttribute('stroke', 'blue');
    el.setAttribute('troke-width', 3);
    return el;
  }

  function getPathObject(path) {
    return fabric.Path.fromElement(getPathElement(path));
  }

  function getPathObjects() {
    return [getPathObject("M 100 100 L 300 100 L 200 300 z"),
            getPathObject("M 200 200 L 100 200 L 400 50 z")];
  }

  function getPathGroupObject() {
    return new fabric.PathGroup(getPathObjects());
  }

  QUnit.module('fabric.PathGroup');

  test('constructor', function() {
    ok(fabric.PathGroup);
    var pathGroup = getPathGroupObject();

    ok(pathGroup instanceof fabric.PathGroup);
    ok(pathGroup instanceof fabric.Object);
    //this.assertHasMixin(Enumerable, pathGroup);

    equal(pathGroup.get('type'), 'path-group');
  });

  test('getObjects', function() {
    var paths = getPathObjects();
    var pathGroup = new fabric.PathGroup(paths);
    ok(typeof pathGroup.getObjects == 'function');

    // nulling group to avoid circular reference (qUnit goes into inifinite loop)
    paths[0].group = null;
    paths[1].group = null;

    deepEqual(paths, pathGroup.getObjects());
  });

  test('toObject', function() {
    var pathGroup = getPathGroupObject();
    ok(typeof pathGroup.toObject == 'function');
    var object = pathGroup.toObject();
  });

  test('complexity', function() {
    function sum(objects) {
      var i = objects.length, total = 0;
      while (i--) {
        total += objects[i];
      }
      return total;
    }
    var pathGroup = getPathGroupObject();

    ok(typeof pathGroup.complexity == 'function');

    var objectsTotalComplexity = pathGroup.getObjects().reduce(function(total, current) {
      total += current.complexity();
      return total;
    }, 0);

    equal(pathGroup.complexity(), objectsTotalComplexity);
  });

  test('toDatalessObject', function() {
    var pathGroup = getPathGroupObject();
    ok(typeof pathGroup.toDatalessObject == 'function');

    pathGroup.setSourcePath('http://example.com/');
    var expectedObject = fabric.util.object.extend(fabric.util.object.clone(REFERENCE_PATH_GROUP_OBJECT), {
      'paths': 'http://example.com/',
      'sourcePath': 'http://example.com/'
    });
    deepEqual(expectedObject, pathGroup.toDatalessObject());
  });

  test('toString', function() {
    var pathGroup = getPathGroupObject();
    ok(typeof pathGroup.toString == 'function');
    equal(pathGroup.toString(), '#<fabric.PathGroup (8): { top: 0, left: 0 }>');
  });

  test('isSameColor', function() {
    var pathGroup = getPathGroupObject();

    ok(typeof pathGroup.isSameColor == 'function');
    equal(pathGroup.isSameColor(), true);

    pathGroup.getObjects()[0].set('fill', 'black');
    equal(pathGroup.isSameColor(), false);
  });

  test('set', function() {
    var fillValue = 'rgb(100,200,100)';
    var pathGroup = getPathGroupObject();

    pathGroup.getObjects()[0].group = null;
    pathGroup.getObjects()[1].group = null;

    ok(typeof pathGroup.set == 'function');
    equal(pathGroup.set('fill', fillValue), pathGroup, 'should be chainable');

    pathGroup.getObjects().forEach(function(path) {
      equal(path.get('fill'), fillValue);
    }, this);

    equal(pathGroup.get('fill'), fillValue);

    // set different color to one of the paths
    pathGroup.getObjects()[1].set('fill', 'black');
    pathGroup.set('fill', 'rgb(255,255,255)');

    equal(pathGroup.getObjects()[0].get('fill'), 'rgb(100,200,100)',
      'when paths are of different fill, setting fill of a group should not change them');

    pathGroup.getObjects()[1].set('fill', 'red');

    pathGroup.set('left', 1234);
    ok(pathGroup.getObjects()[0].get('left') !== 1234);
    equal(pathGroup.get('left'), 1234);
  });

  test('grayscale', function() {

    var pathGroup = getPathGroupObject();

    pathGroup.getObjects()[0].group = null;
    pathGroup.getObjects()[1].group = null;

    ok(typeof pathGroup.toGrayscale == 'function');
    equal(pathGroup.toGrayscale(), pathGroup, 'should be chainable');
    var firstObject = pathGroup.getObjects()[0],
        secondObject = pathGroup.getObjects()[1];

    firstObject.set('overlayFill', null);
    secondObject.set('overlayFill', null);

    firstObject.set('fill', 'rgb(200,0,0)');
    secondObject.set('fill', '0000FF');

    pathGroup.toGrayscale();

    equal(firstObject.get('overlayFill'), 'rgb(60,60,60)');
    equal(secondObject.get('overlayFill'), 'rgb(28,28,28)');

    equal(firstObject.get('fill'), 'rgb(200,0,0)', 'toGrayscale should not change original fill value');
    equal(new fabric.Color(secondObject.get('fill')).toRgb(), 'rgb(0,0,255)', 'toGrayscale should not change original fill value');
  });
})();