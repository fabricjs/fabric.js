(function(){
  
  var canvas = this.canvas = new fabric.Element('test'),
      canvasEl = document.getElementById('test');
  
  module('fabric.Object', {
    teardown: function() {
      canvas.clear();
      canvas.setActiveGroup(null);
      canvas.backgroundColor = fabric.Element.prototype.backgroundColor;
      canvas.calcOffset();
    }
  });
  
  test('constructor & properties', function() {
    ok(typeof fabric.Object == 'function');
    
    var cObj = new fabric.Object();
    
    ok(cObj);
    ok(cObj instanceof fabric.Object);
    ok(cObj.constructor === fabric.Object);
    
    equals(cObj.type, 'object');
    equals(cObj.includeDefaultValues, true);
    equals(cObj.selectable, true);
  });
  
  test('get', function() {
    var cObj = new fabric.Object({ 
      left: 11, 
      top: 22, 
      width: 50, 
      height: 60, 
      opacity: 0.7 
    });
    
    equals(cObj.get('left'), 11);
    equals(cObj.get('top'), 22);
    equals(cObj.get('width'), 50);
    equals(cObj.get('height'), 60);
    equals(cObj.get('opacity'), 0.7);
  });
  
  test('set', function() {
    var cObj = new fabric.Object({ left: 11, top: 22, width: 50, height: 60, opacity: 0.7 });
    
    cObj.set('left', 12);
    cObj.set('top', 23);
    cObj.set('width', 51);
    cObj.set('height', 61);
    cObj.set('opacity', 0.5);
    
    equals(cObj.get('left'), 12);
    equals(cObj.get('top'), 23);
    equals(cObj.get('width'), 51);
    equals(cObj.get('height'), 61);
    equals(cObj.get('opacity'), 0.5);
    
    equals(cObj.set('opacity', 0.5), cObj, 'chainable');
  });
  
  test('set with object of prop/values', function() {
    var cObj = new fabric.Object({  });
    
    equals(cObj, cObj.set({ width: 99, height: 88, fill: 'red' }), 'chainable');
    
    equals('red', cObj.get('fill'));
    equals(99, cObj.get('width'));
    equals(88, cObj.get('height'));
  });
  
  test('setSourcePath', function() {
    var cObj = new fabric.Object();
    var SRC_PATH = 'http://example.com/';
    
    ok(typeof cObj.setSourcePath == 'function');
    
    cObj.setSourcePath(SRC_PATH);
    equals(cObj.get('sourcePath'), SRC_PATH);
  });
  
  test('stateProperties', function() {
    var cObj = new fabric.Object();
    ok(cObj.stateProperties);
    ok(cObj.stateProperties.length > 0);
  });
  
  test('transform', function() {
    var cObj = new fabric.Object();
    ok(typeof cObj.transform == 'function');
  });
  
  test('toJSON', function() {
    var emptyObjectJSON = '{"type":"object","left":0,"top":0,"width":0,"height":0,"fill":"rgb(0,0,0)",'+
                          '"overlayFill":null,"stroke":null,"strokeWidth":1,"scaleX":1,"scaleY":1,"angle":0,'+
                          '"flipX":false,"flipY":false,"opacity":1,"selectable":true}';
      
    var augmentedJSON = '{"type":"object","left":0,"top":0,"width":122,"height":0,"fill":"rgb(0,0,0)",'+
                        '"overlayFill":null,"stroke":null,"strokeWidth":1,"scaleX":1.3,"scaleY":1,"angle":0,'+
                        '"flipX":false,"flipY":true,"opacity":0.88,"selectable":true}';
      
    var cObj = new fabric.Object();
    ok(typeof cObj.toJSON == 'function');
    equals(JSON.stringify(cObj.toJSON()), emptyObjectJSON);
    
    cObj.set('opacity', 0.88).set('scaleX', 1.3).set('width', 122).set('flipY', true);
    equals(JSON.stringify(cObj.toJSON()), augmentedJSON);
  });
  
  test('toObject', function() {
    var emptyObjectRepr = {
      'type': "object",
      'left': 0, 
      'top': 0, 
      'width': 0, 
      'height': 0, 
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
      'selectable': true
    }
    var augmentedObjectRepr = {
      'type': "object",
      'left': 10, 
      'top': 20, 
      'width': 30, 
      'height': 40, 
      'fill': 'rgb(0,0,0)',
      'overlayFill': null,
      'stroke': null, 
      'strokeWidth': 1, 
      'scaleX': 1, 
      'scaleY': 1, 
      'angle': 0, 
      'flipX': true, 
      'flipY': false, 
      'opacity': 0.13,
      'selectable': false
    }
    
    var cObj = new fabric.Object();
    same(emptyObjectRepr, cObj.toObject());
    
    cObj.set('left', 10)
        .set('top', 20)
        .set('width', 30)
        .set('height', 40)
        .set('flipX', true)
        .set('opacity', 0.13)
        .set('selectable', false);
        
    same(augmentedObjectRepr, cObj.toObject());
    
    var fractionalValue = 166.66666666666666,
        testedProperties = 'left top width height'.split(' '),
        fractionDigitsDefault = 2;
        
    function testFractionDigits(fractionDigits, expectedValue) {
      
      fabric.Object.prototype.NUM_FRACTION_DIGITS = fractionDigits;
      
      testedProperties.forEach(function(property) {
        cObj.set(property, fractionalValue);
        equals(cObj.toObject()[property], expectedValue, 
          'value of ' + property + ' should have ' + fractionDigits + ' fractional digits');
      }, this);
      
      fabric.Object.prototype.NUM_FRACTION_DIGITS = fractionDigitsDefault;
    }
    
    testFractionDigits.call(this, 2, 166.67);
    testFractionDigits.call(this, 3, 166.667);
    testFractionDigits.call(this, 0, 167);
  });
  
  test('toDatalessObject', function() {
    var cObj = new fabric.Object();
    ok(typeof cObj.toDatalessObject == 'function');
    same(cObj.toObject(), cObj.toDatalessObject());
  });
  
  test('isActive', function() {
    var cObj = new fabric.Object();
    ok(typeof cObj.isActive == 'function');
    ok(!cObj.isActive(), 'initially not active');
    cObj.setActive(true);
    ok(cObj.isActive());
  });
  
  test('setActive', function() {
    var cObj = new fabric.Object();
    ok(typeof cObj.setActive == 'function');
    equals(cObj.setActive(true), cObj, 'chainable?');
    ok(cObj.isActive());
    cObj.setActive(false);
    ok(!cObj.isActive());
  });
  
  test('toString', function() {
    var cObj = new fabric.Object();
    equals(cObj.toString(), '#<fabric.Object>');
    cObj.type = 'moo';
    equals(cObj.toString(), '#<fabric.Moo>');
  });
  
  test('render', function() {
    var cObj = new fabric.Object();
    ok(typeof cObj.render == 'function');
  });
  
  test('getWidth', function() {
    var cObj = new fabric.Object();
    ok(typeof cObj.getWidth == 'function');
    equals(cObj.getWidth(), 0);
    cObj.set('width', 123);
    equals(cObj.getWidth(), 123);
    cObj.set('scaleX', 2);
    equals(cObj.getWidth(), 246);
  });
  
  test('getHeight', function() {
    var cObj = new fabric.Object();
    ok(typeof cObj.getHeight == 'function');
    equals(cObj.getHeight(), 0);
    cObj.set('height', 123);
    equals(cObj.getHeight(), 123);
    cObj.set('scaleY', 2);
    equals(cObj.getHeight(), 246);
  });
  
  test('rotate', function() {
    var cObj = new fabric.Object();
    ok(typeof cObj.rotate == 'function');
    equals(cObj.get('angle'), 0);
    equals(cObj.rotate(45), cObj, 'chainable');
    equals(cObj.get('angle'), 45);
  });
  
  test('scale', function() {
    var cObj = new fabric.Object();
    ok(typeof cObj.scale == 'function');
    equals(cObj.get('scaleX'), 1);
    equals(cObj.get('scaleY'), 1);
    cObj.scale(1.5);
    equals(cObj.get('scaleX'), 1.5);
    equals(cObj.get('scaleY'), 1.5);
    equals(cObj.scale(2), cObj, 'chainable');
  });
  
  test('scaleToWidth', function() {
    var cObj = new fabric.Object({ width: 560 });
    ok(typeof cObj.scaleToWidth == 'function');
    equals(cObj.scaleToWidth(100), cObj, 'chainable');
    equals(cObj.getWidth(), 100);
    equals(cObj.get('scaleX'), 100/560);
  });
  
  test('scaleToHeight', function() {
    var cObj = new fabric.Object({ height: 560 });
    ok(typeof cObj.scaleToHeight == 'function');
    equals(cObj.scaleToHeight(100), cObj, 'chainable');
    equals(cObj.getHeight(), 100);
    equals(cObj.get('scaleY'), 100/560);
  });
  
  test('setOpacity', function() {
    var cObj = new fabric.Object();
    ok(typeof cObj.setOpacity == 'function');
    equals(cObj.get('opacity'), 1);
    cObj.setOpacity(0.68);
    equals(cObj.get('opacity'), 0.68);
    equals(cObj.setOpacity(1), cObj, 'chainable');
  });
  
  test('getAngle', function() {
    var cObj = new fabric.Object();
    ok(typeof cObj.getAngle == 'function');
    equals(cObj.getAngle(), 0);
    cObj.rotate(45);
    equals(cObj.getAngle(), 45);
  });
  
  test('setAngle', function() {
    var cObj = new fabric.Object();
    ok(typeof cObj.setAngle == 'function');
    equals(cObj.get('angle'), 0);
    equals(cObj.setAngle(45), cObj, 'chainable');
    equals(cObj.get('angle'), 45);
  });
  
  test('setCoords', function() {
    var cObj = new fabric.Object({ left: 200, top: 200, width: 100, height: 100 });
    ok(typeof cObj.setCoords == 'function');
    equals(cObj.setCoords(), cObj, 'chainable');
    
    cObj.set('left', 300).set('top', 300);
    
    // coords should still correspond to initial one, even after invoking `set`
    equals(cObj.oCoords.tl.x, 150);
    equals(cObj.oCoords.tl.y, 150);
    equals(cObj.oCoords.tr.x, 250);
    equals(cObj.oCoords.tr.y, 150);
    equals(cObj.oCoords.bl.x, 150);
    equals(cObj.oCoords.bl.y, 250);
    equals(cObj.oCoords.br.x, 250);
    equals(cObj.oCoords.br.y, 250);
    
    // recalculate coords
    cObj.setCoords();
    
    // check that coords are now updated
    equals(cObj.oCoords.tl.x, 250);
    equals(cObj.oCoords.tl.y, 250);
    equals(cObj.oCoords.tr.x, 350);
    equals(cObj.oCoords.tr.y, 250);
    equals(cObj.oCoords.bl.x, 250);
    equals(cObj.oCoords.bl.y, 350);
    equals(cObj.oCoords.br.x, 350);
    equals(cObj.oCoords.br.y, 350);
  });
  
  test('drawBorders', function() {
    var cObj = new fabric.Object();
    var dummyContext = document.createElement('canvas').getContext('2d');
    ok(typeof cObj.drawBorders == 'function');
    equals(cObj.drawBorders(dummyContext), cObj, 'chainable');
  });
  
  test('drawCorners', function() {
    var cObj = new fabric.Object();
    var dummyContext = document.createElement('canvas').getContext('2d');
    ok(typeof cObj.drawCorners == 'function');
    equals(cObj.drawCorners(dummyContext), cObj, 'chainable');
  });
  
  test('clone', function() {
    var cObj = new fabric.Object({ left: 123, top: 456, opacity: 0.66 });
    ok(typeof cObj.clone == 'function');
    var clone = cObj.clone();
    
    equals(clone.get('left'), 123);
    equals(clone.get('top'), 456);
    equals(clone.get('opacity'), 0.66);
    
    // augmenting clone properties should not affect original instance 
    clone.set('left', 12).set('scaleX', 2.5).setAngle(33);
    
    equals(cObj.get('left'), 123);
    equals(cObj.get('scaleX'), 1);
    equals(cObj.getAngle(), 0);
  });
  
  asyncTest('cloneAsImage', function() {
    var cObj = new fabric.Rect({ width: 100, height: 100, fill: 'red' });
    
    ok(typeof cObj.cloneAsImage == 'function');
    
    if (!fabric.Element.supports('toDataURL')) {
      alert('`toDataURL` is not supported by this environment; skipping `cloneAsImage` test (as it relies on `toDataURL`)');
      start();
    }
    else {
      var image;
      var _this = this;

      setTimeout(function() {
        ok(image);
        ok(image instanceof fabric.Image);
        start();
      }, 500);

      cObj.cloneAsImage(function(i) {
        image = i;
      });
    }
  });
  
  test('toDataURL', function() {
    var data = 
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQA'+
      'AABkCAYAAABw4pVUAAAA+UlEQVR4nO3RoRHAQBDEsOu/6YR+B2s'+
      'gIO4Z3919pMwDMCRtHoAhafMADEmbB2BI2jwAQ9LmARiSNg/AkLR5AI'+
      'akzQMwJG0egCFp8wAMSZsHYEjaPABD0uYBGJI2D8CQtHkAhqTNAzAkbR'+
      '6AIWnzAAxJmwdgSNo8AEPS5gEYkjYPwJC0eQCGpM0DMCRtHoAhafMADEm'+
      'bB2BI2jwAQ9LmARiSNg/AkLR5AIakzQMwJG0egCFp8wAMSZsHYEjaPABD0'+
      'uYBGJI2D8CQtHkAhqTNAzAkbR6AIWnzAAxJmwdgSNo8AEPS5gEYkjYPw'+
      'JC0eQCGpM0DMCRtHsDjB5K06yueJFXJAAAAAElFTkSuQmCC';
      
    var cObj = new fabric.Rect({
      width: 100, height: 100, fill: 'red'
    });
    
    ok(typeof cObj.toDataURL == 'function');
    
    if (!fabric.Element.supports('toDataURL')) {
      alert('toDataURL is not supported by this environment. Some of the tests can not be run.');
    }
    else {
      var dataURL = cObj.toDataURL();
      equals(typeof dataURL, 'string');
      equals(dataURL.substring(0, 21), 'data:image/png;base64');
    }
  });
  
  test('hasStateChanged', function() {
    var cObj = new fabric.Object();
    ok(typeof cObj.hasStateChanged == 'function');
    cObj.setupState();
    ok(!cObj.hasStateChanged());
    cObj.saveState();
    cObj.set('left', 123).set('top', 456);
    ok(cObj.hasStateChanged());
  });
  
  test('saveState', function() {
    var cObj = new fabric.Object();
    ok(typeof cObj.saveState == 'function');
    cObj.setupState();
    equals(cObj.saveState(), cObj, 'chainable');
    cObj.set('left', 123).set('top', 456);
    cObj.saveState();
    cObj.set('left', 223).set('top', 556);
    equals(cObj.originalState.left, 123);
    equals(cObj.originalState.top, 456);
  });
  
  test('intersectsWithRectangle', function() {
    var cObj = new fabric.Object({ left: 100, top: 100, width: 100, height: 100 });
    cObj.setCoords();
    ok(typeof cObj.intersectsWithRect == 'function');
         
    var point1 = new fabric.Point(110, 100),
        point2 = new fabric.Point(210, 200),
        point3 = new fabric.Point(0, 0),
        point4 = new fabric.Point(10, 10);
    
    ok(cObj.intersectsWithRect(point1, point2));
    ok(!cObj.intersectsWithRect(point3, point4));
  });
  
  test('intersectsWithObject', function() {
    var cObj = new fabric.Object({ left: 100, top: 100, width: 100, height: 100 });
    cObj.setCoords();
    ok(typeof cObj.intersectsWithObject == 'function');
    
    var cObj2 = new fabric.Object({ left: 50, top: 50, width: 200, height: 200 });
    cObj2.setCoords();
    ok(cObj.intersectsWithObject(cObj2));
    ok(cObj2.intersectsWithObject(cObj));
    
    var cObj3 = new fabric.Object({ left: 400, top: 356, width: 13, height: 33 });
    cObj3.setCoords();
    ok(!cObj.intersectsWithObject(cObj3));
    ok(!cObj3.intersectsWithObject(cObj));  
  });
  
  test('isContainedWithinRect', function() {
    var cObj = new fabric.Object({ left: 20, top: 20, width: 10, height: 10 });
    cObj.setCoords();
    ok(typeof cObj.isContainedWithinRect == 'function');
    
    // fully contained
    ok(cObj.isContainedWithinRect(new fabric.Point(10,10), new fabric.Point(100,100)));
    // only intersects
    ok(!cObj.isContainedWithinRect(new fabric.Point(10,10), new fabric.Point(25, 25)));
    // doesn't intersect
    ok(!cObj.isContainedWithinRect(new fabric.Point(100,100), new fabric.Point(110, 110)));
  });
  
  test('isType', function() {
    var cObj = new fabric.Object();
    ok(typeof cObj.isType == 'function');
    ok(cObj.isType('object'));
    ok(!cObj.isType('rect'));
    cObj = new fabric.Rect();
    ok(cObj.isType('rect'));
    ok(!cObj.isType('object'));
  });
  
  test('getCenter', function() {
    var object = new fabric.Object({ left: 100, top: 124, width: 210, height: 66 });
    ok(typeof object.getCenter == 'function');
    same({ x: 205, y: 157 }, object.getCenter());
  });
  
  test('toggle', function() {
    var object = new fabric.Object({ left: 100, top: 124, width: 210, height: 66 });
    ok(typeof object.toggle == 'function');
    
    object.set('flipX', false);
    equals(object.toggle('flipX'), object, 'should be chainable');
    equals(object.get('flipX'), true);
    object.toggle('flipX');
    equals(object.get('flipX'), false);
    
    object.set('left', 112.45);
    object.toggle('left');
    equals(object.get('left'), 112.45, 'non boolean properties should not be affected');
  });
  
  test('straighten', function() {
    var object = new fabric.Object({ left: 100, top: 124, width: 210, height: 66 });
    ok(typeof object.straighten == 'function');
    
    object.setAngle(123.456);
    object.straighten();
    equals(object.get('angle'), 90);
    
    object.setAngle(97.111);
    object.straighten();
    equals(object.get('angle'), 90);
    
    object.setAngle(3.45);
    object.straighten();
    equals(object.get('angle'), 0);
    
    object.setAngle(-157);
    object.straighten();
    equals(object.get('angle'), -180);
    
    object.setAngle(159);
    object.straighten();
    equals(object.get('angle'), 180);
    
    object.setAngle(999);
    object.straighten();
    equals(object.get('angle'), 360);
  });
  
  test('toGrayscale', function() {
    var object = new fabric.Object({ left: 100, top: 124, width: 210, height: 66 });
    ok(typeof object.toGrayscale == 'function');
    equals(object.toGrayscale(), object, 'should be chainable');
    
    object.set('fill', 'rgb(200,0,0)'); // set color to red
    
    object.toGrayscale();
    
    equals(object.get('overlayFill'), 'rgb(60,60,60)');
    equals(object.get('fill'), 'rgb(200,0,0)', 'toGrayscale should not overwrite original fill value');
    
    object.set('fill', '').set('overlayFill', '');
    object.toGrayscale();
    
    equals(object.get('overlayFill'), '', 'Empty fill values should be left intact');
  });
  
  asyncTest('fxRemove', function() {
    var object = new fabric.Object({ left: 20, top: 30, width: 40, height: 50, opacity: 1 });

    var onCompleteFired = false;
    var onComplete = function(){ onCompleteFired = true; };
    
    var onChangeFired = false;
    var onChange = function(){ onChangeFired = true; };
    
    var callbacks = { onComplete: onComplete, onChange: onChange };
    
    ok(typeof object.fxRemove == 'function');
    equals(object.fxRemove(callbacks), object, 'should be chainable');
    
    equals(object.get('opacity'), 1);
    
    setTimeout(function(){
      
      ok(onCompleteFired);
      ok(onChangeFired);
      
      equals(object.get('opacity'), 0, 'opacity should be set to 0 by the end of animation');
      equals(object.fxRemove(), object, 'should work without callbacks');
      
      start();
    }, 1000);
  });
  
  asyncTest('fxStraighten', function() {
    var object = new fabric.Object({ left: 20, top: 30, width: 40, height: 50, angle: 43 });

    var onCompleteFired = false;
    var onComplete = function(){ onCompleteFired = true; };
    
    var onChangeFired = false;
    var onChange = function(){ onChangeFired = true; };
    
    var callbacks = { onComplete: onComplete, onChange: onChange };
    
    ok(typeof object.fxStraighten == 'function');
    equals(object.fxStraighten(callbacks), object, 'should be chainable');
    
    equals(fabric.util.toFixed(object.get('angle'), 0), 43);
    
    setTimeout(function(){
      ok(onCompleteFired);
      ok(onChangeFired);
      
      equals(object.get('angle'), 0, 'angle should be set to 0 by the end of animation');
      equals(object.fxStraighten(), object, 'should work without callbacks');
      
      start();
    }, 1000);
  });
})();