(function(){

  var REFERENCE_PATH_GROUP_OBJECT = {
    'type':                     'path-group',
    'originX':                  'left',
    'originY':                  'top',
    'left':                     0,
    'top':                      0,
    'width':                    0,
    'height':                   0,
    'fill':                     '',
    'stroke':                   null,
    'strokeWidth':              1,
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
    'shadow':                   null,
    'visible':                  true,
    'clipTo':                   null,
    'backgroundColor':          '',
    'fillRule':                 'nonzero',
    'globalCompositeOperation': 'source-over',    
    'paths':                    getPathObjects()
  };

  function getPathElement(path) {
    var el = fabric.document.createElement('path');
    el.setAttribute('d', path);
    el.setAttribute('fill', 'rgb(255,0,0)');
    el.setAttribute('stroke', 'blue');
    el.setAttribute('stroke-width', 3);
    return el;
  }

  function getPathObject(path, callback) {
    fabric.Path.fromElement(getPathElement(path), callback);
  }

  function getPathObjects(callback) {
    function onLoaded() {
      if (++numLoadedObjects === numTotalObjects) {
        if (callback) {
          callback(objects);
        }
      }
    }

    var objects = [ ],
        paths = ["M 100 100 L 300 100 L 200 300 z", "M 200 200 L 100 200 L 400 50 z"],
        numLoadedObjects = 0,
        numTotalObjects = paths.length;

    paths.forEach(function (o, index) {
      getPathObject(o, function(o) {
        objects[index] = o;
        onLoaded();
      });
    });
  }

  function getPathGroupObject(callback) {
    getPathObjects(function(objects) {
      callback(new fabric.PathGroup(objects));
    });
  }

  QUnit.module('fabric.PathGroup');

  asyncTest('constructor', function() {
    ok(fabric.PathGroup);
    getPathGroupObject(function(pathGroup) {

      ok(pathGroup instanceof fabric.PathGroup);
      ok(pathGroup instanceof fabric.Object);
      //this.assertHasMixin(Enumerable, pathGroup);

      equal(pathGroup.get('type'), 'path-group');
      start();
    });
  });

  asyncTest('getObjects', function() {
    getPathObjects(function(paths) {
      var pathGroup = new fabric.PathGroup(paths);
      ok(typeof pathGroup.getObjects == 'function');

      // nulling group to avoid circular reference (qUnit goes into inifinite loop)
      paths[0].group = null;
      paths[1].group = null;

      deepEqual(pathGroup.getObjects(), paths);
      start();
    });
  });

  asyncTest('toObject', function() {
    getPathGroupObject(function(pathGroup) {
      ok(typeof pathGroup.toObject == 'function');
      var object = pathGroup.toObject();
      start();
    });
  });

  asyncTest('complexity', function() {
    function sum(objects) {
      var i = objects.length, total = 0;
      while (i--) {
        total += objects[i];
      }
      return total;
    }
    getPathGroupObject(function(pathGroup) {

      ok(typeof pathGroup.complexity == 'function');

      var objectsTotalComplexity = pathGroup.getObjects().reduce(function(total, current) {
        total += current.complexity();
        return total;
      }, 0);

      equal(pathGroup.complexity(), objectsTotalComplexity);
      start();
    });
  });

  asyncTest('toDatalessObject', function() {
    getPathGroupObject(function(pathGroup) {
      ok(typeof pathGroup.toDatalessObject == 'function');

      pathGroup.setSourcePath('http://example.com/');
      var expectedObject = fabric.util.object.extend(fabric.util.object.clone(REFERENCE_PATH_GROUP_OBJECT), {
        'paths': 'http://example.com/',
        'sourcePath': 'http://example.com/'
      });
      deepEqual(pathGroup.toDatalessObject(), expectedObject);
      start();
    });
  });

  asyncTest('fromObject', function() {
    getPathGroupObject(function(pathGroup) {

      ok(typeof fabric.PathGroup.fromObject == 'function');
      var pathGroupObject = pathGroup.toObject();

      fabric.PathGroup.fromObject(pathGroupObject, function(newPathGroupFromObject) {

        var objectFromOldPathGroup = pathGroup.toObject();
        var objectFromNewPathGroup = newPathGroupFromObject.toObject();

        ok(newPathGroupFromObject instanceof fabric.PathGroup);

        deepEqual(objectFromNewPathGroup, objectFromOldPathGroup);

        start();
      });
    });
  });

  asyncTest('toString', function() {
    getPathGroupObject(function(pathGroup) {
      ok(typeof pathGroup.toString == 'function');
      equal(pathGroup.toString(), '#<fabric.PathGroup (8): { top: 0, left: 0 }>');
      start();
    });
  });

  asyncTest('isSameColor', function() {
    getPathGroupObject(function(pathGroup) {

      ok(typeof pathGroup.isSameColor == 'function');
      equal(pathGroup.isSameColor(), true);

      pathGroup.getObjects()[0].set('fill', 'black');
      equal(pathGroup.isSameColor(), false);

      // case
      pathGroup.getObjects()[0].set('fill', '#ff5555');
      pathGroup.getObjects()[1].set('fill', '#FF5555');
      equal(pathGroup.isSameColor(), true);

      start();
    });
  });

  asyncTest('set', function() {
    var fillValue = 'rgb(100,200,100)';
    getPathGroupObject(function(pathGroup) {

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
      start();
    });
  });
})();
