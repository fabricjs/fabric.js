function init() {
  
  var canvas = this.canvas = new Canvas.Element('test');
  var canvasEl = $('test');
  
  function makeGroupWith2Objects() {
    var rect1 = new Canvas.Rect({ top: 100, left: 100, width: 30, height: 10 }),
        rect2 = new Canvas.Rect({ top: 120, left: 50, width: 10, height: 40 });
        
    return new Canvas.Group([ rect1, rect2 ]);
  }
  
  new Test.Unit.Runner({
    teardown: function() {
      canvas.clear();
      canvas.setActiveGroup(null);
      canvas.backgroundColor = Canvas.Element.prototype.backgroundColor;
      canvas.calcOffset();
    },
    testConstructor: function() {
      var group = makeGroupWith2Objects();
      
      this.assert(group);
      this.assert(group instanceof Canvas.Group, 'should be instance of Canvas.Group');
    },
    testToString: function() {
      var group = makeGroupWith2Objects();
      this.assertIdentical('#<Canvas.Group: (2)>', group.toString(), 'should return proper representation');
    },
    testGetObjects: function() {
      var rect1 = new Canvas.Rect(),
          rect2 = new Canvas.Rect();

      var group = new Canvas.Group([ rect1, rect2 ]);
      
      this.assertRespondsTo('getObjects', group);
      this.assert(Object.isArray(group.getObjects()), 'should be an array');
      this.assertIdentical(2, group.getObjects().length, 'should have 2 items');
      this.assertEnumEqual([ rect1, rect2 ], group.getObjects(), 'should return same objects as those passed to constructor');
    },
    testAdd: function() {
      var group = makeGroupWith2Objects();
      var rect = new Canvas.Rect();
      
      this.assertRespondsTo('add', group);
      this.assertIdentical(group, group.add(rect), 'should be chainable');
      this.assertIdentical(rect, group.getObjects().last(), 'last object should be newly added one');
      this.assertIdentical(3, group.getObjects().length, 'there should be 3 objects');
    },
    testRemove: function() {
      var rect1 = new Canvas.Rect(),
          rect2 = new Canvas.Rect(),
          rect3 = new Canvas.Rect(),
          group = new Canvas.Group([ rect1, rect2, rect3 ]);
          
      this.assertRespondsTo('remove', group);
      this.assertIdentical(group, group.remove(rect2), 'should be chainable');
      this.assertEnumEqual([rect1, rect3], group.getObjects(), 'should remove object properly');
    },
    testSize: function() {
      var group = makeGroupWith2Objects();
      
      this.assertRespondsTo('size', group);
      this.assertIdentical(2, group.size());
      group.add(new Canvas.Rect());
      this.assertIdentical(3, group.size());
      group.remove(group.getObjects()[0]).remove(group.getObjects()[0]);
      this.assertIdentical(1, group.size());
    },
    testSet: function() {
      var group = makeGroupWith2Objects(),
          firstObject = group.getObjects()[0];
      
      this.assertRespondsTo('set', group);
      
      this.assertIdentical(group, group.set('opacity', 0.12345), 'should be chainable');
      this.assertIdentical(0.12345, group.get('opacity'), 'group\'s "own" property should be set properly');
      this.assertIdentical(0.12345, firstObject.get('opacity'), 'objects\' value should be set properly');
      
      group.set('left', 1234);
      this.assertIdentical(1234, group.get('left'), 'group\'s own "left" property should be set properly');
      this.assert(firstObject.get('left') !== 1234, 'objects\' value should not be affected');
      
      group.set('left', function(value){ return value + 1234; });
      this.assertIdentical(2468, group.get('left'), 'group\'s own "left" property should be set properly via function');
      this.assert(firstObject.get('left') !== 2468, 'objects\' value should not be affected when set via function');
    },
    testContains: function() {
      var rect1           = new Canvas.Rect(),
          rect2           = new Canvas.Rect(),
          notIncludedRect = new Canvas.Rect(),
          group           = new Canvas.Group([ rect1, rect2 ]);
      
      this.assertRespondsTo('contains', group);
      
      this.assert(group.contains(rect1), 'should contain first object');
      this.assert(group.contains(rect2), 'should contain second object');
      
      this.assert(!group.contains(notIncludedRect), 'should report not-included one properly');
    },
    testToObject: function() {
      var group = makeGroupWith2Objects();
      
      this.assertRespondsTo('toObject', group);
      
      var clone = group.toObject();
      var expectedObject = {
        'type': 'group', 
        'left': 80, 
        'top': 117.5, 
        'width': 70, 
        'height': 45, 
        'fill': 'rgb(0,0,0)',
        'overlayFill': null,
        'stroke': null, 
        'strokeWidth': 1, 
        'scaleX': 1, 
        'scaleY': 1, 
        'angle': 0, 
        'flipX': false, 
        'flipY': false, 
        'opacity': 1, 
        'objects': clone.objects
      }
      
      this.assertHashEqual(expectedObject, clone);
      this.assertNotIdentical(group, clone, 'should produce different object');
      this.assertNotIdentical(group.getObjects(), clone.objects, 'should produce different object array');
      this.assertNotIdentical(group.getObjects()[0], clone.objects[0], 'should produce different objects in array');
    },
    testRender: function() {
      var group = makeGroupWith2Objects();
      
      this.assertRespondsTo('render', group);
    },
    testItem: function() {
      var group = makeGroupWith2Objects();
      
      this.assertRespondsTo('item', group);
      this.assertIdentical(group.getObjects()[0], group.item(0));
      this.assertIdentical(group.getObjects()[1], group.item(1));
      this.assertUndefined(group.item(9999));
    },
    testComplexity: function() {
      var group = makeGroupWith2Objects();
      
      this.assertRespondsTo('complexity', group);
      this.assertIdentical(2, group.complexity());
    },
    testDestroy: function() {
      var group = makeGroupWith2Objects(),
          firstObject = group.item(0),
          initialLeftValue = 100,
          initialTopValue = 100;
      
      this.assertRespondsTo('destroy', group);
      
      this.assertNotIdentical(initialLeftValue, firstObject.get('left'));
      this.assertNotIdentical(initialTopValue, firstObject.get('top'));
      
      group.destroy();
      this.assertIdentical(initialLeftValue, firstObject.get('left'), 'should restore initial left value');
      this.assertIdentical(initialTopValue, firstObject.get('top'), 'should restore initial top value');
    },
    testSaveCoords: function() {
      var group = makeGroupWith2Objects();

      this.assertRespondsTo('saveCoords', group);
      this.assertIdentical(group, group.saveCoords(), 'should be chainable');
    },
    testHasMoved: function() {
      var group = makeGroupWith2Objects();
      
      this.assertRespondsTo('hasMoved', group);
      this.assertIdentical(false, group.hasMoved());
      
      function moveBy10(value) {
        return value + 10;
      }
      group.set('left', moveBy10);
      this.assertIdentical(true, group.hasMoved());
      group.saveCoords();
      this.assertIdentical(false, group.hasMoved());
      group.set('top', moveBy10);
      this.assertIdentical(true, group.hasMoved());
    },
    testSetObjectsCoords: function() {
      var group = makeGroupWith2Objects();
      
      this.assertRespondsTo('setObjectsCoords', group);
      
      var invokedObjects = [ ];
      group.forEachObject(function(groupObject){
        groupObject.setCoords = function() {
          invokedObjects.push(this);
        }
      }, this);
      
      this.assertIdentical(group, group.setObjectsCoords(), 'should be chainable');
      this.assertEnumEqualUnordered(invokedObjects, group.getObjects(), 'setObjectsCoords should call setCoords on all objects');
    },
    testActivateAllObjects: function() {
      var group = makeGroupWith2Objects();
      
      var assertAllObjectsActive = function() {
        group.forEachObject(function(groupObject) {
          this.assert(groupObject.isActive());
        }, this);
      }.bind(this);
      
      this.assertRespondsTo('activateAllObjects', group);
      this.assertIdentical(group, group.activateAllObjects(), 'should be chainable');
      
      assertAllObjectsActive();
      
      group.forEachObject(function(groupObject) {
        groupObject.setActive(false);
      });
      group.activateAllObjects();
      assertAllObjectsActive();
    },
    testContainsPoint: function() {
      var group = makeGroupWith2Objects();
      
      /*
        Rect #1     top: 100, left: 100, width: 30, height: 10
        Rect #2     top: 120, left: 50, width: 10, height: 40
      */
      this.assertRespondsTo('containsPoint', group);
      
      this.assert(group.containsPoint({ x: 50, y: 120 }));
      this.assert(group.containsPoint({ x: 100, y: 100 }));
      this.assert(!group.containsPoint({ x: 0, y: 0 }));
    },
    testForEachObject: function() {
      var group = makeGroupWith2Objects();
      
      this.assertRespondsTo('forEachObject', group);
      this.assertIdentical(group, group.forEachObject(function(){}), 'should be chainable');
      
      var iteratedObjects = [ ];
      group.forEachObject(function(groupObject) {
        iteratedObjects.push(groupObject);
      });
      
      this.assertEnumEqualUnordered(iteratedObjects, group.getObjects(), 'should iterate through all objects');
    },
    
    testSetActive: function() {
      var group = makeGroupWith2Objects();
      
      this.assertRespondsTo('setActive', group);
      
      group.setActive(false);
      this.assertEnumEqual([false, false], group.getObjects().invoke('isActive'));
      
      group.setActive(true);
      this.assertEnumEqual([true, true], group.getObjects().invoke('isActive'));
    },
    
    // test static methods
    testCanvasGroupFromObject: function() {
      var group = makeGroupWith2Objects();
      
      this.assertRespondsTo('fromObject', Canvas.Group);
      var groupObject = group.toObject();
      
      var newGroupFromObject = Canvas.Group.fromObject(groupObject);
      var objectFromOldGroup = group.toObject();
      var objectFromNewGroup = newGroupFromObject.toObject();
      
      this.assert(newGroupFromObject instanceof Canvas.Group);
      
      // delete `objects` arrays, since `assertHashEqual` fails to compare them for equality
      delete objectFromOldGroup.objects;
      delete objectFromNewGroup.objects;
      
      this.assertHashEqual(objectFromOldGroup, objectFromNewGroup);
    }
  });
}