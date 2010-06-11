function init() {
  
  var canvas = this.canvas = new Canvas.Element('test');
  var canvasEl = $('test');
  
  new Test.Unit.Runner({
    teardown: function() {
      canvas.clear();
      canvas.setActiveGroup(null);
      canvas.backgroundColor = Canvas.Element.prototype.backgroundColor;
      canvas.calcOffset();
    },
    
    testConstructor: function() {
      this.assert(typeof Canvas.Object == 'function');
      
      var cObj = new Canvas.Object();
      
      this.assert(cObj);
      this.assert(cObj instanceof Canvas.Object);
      this.assert(cObj.constructor === Canvas.Object);
      this.assertIdentical('object', cObj.type);
      this.assertIdentical(true, cObj.includeDefaultValues);
    },
    
    testGet: function() {
      var cObj = new Canvas.Object({ 
        left: 11, 
        top: 22, 
        width: 50, 
        height: 60, 
        opacity: 0.7 
      });
      
      this.assertIdentical(11, cObj.get('left'));
      this.assertIdentical(22, cObj.get('top'));
      this.assertIdentical(50, cObj.get('width'));
      this.assertIdentical(60, cObj.get('height'));
      this.assertIdentical(0.7, cObj.get('opacity'));
    },
    
    testSet: function() {
      var cObj = new Canvas.Object({ left: 11, top: 22, width: 50, height: 60, opacity: 0.7 });
      
      cObj.set('left', 12);
      cObj.set('top', 23);
      cObj.set('width', 51);
      cObj.set('height', 61);
      cObj.set('opacity', 0.5);
      
      this.assertIdentical(12, cObj.get('left'));
      this.assertIdentical(23, cObj.get('top'));
      this.assertIdentical(51, cObj.get('width'));
      this.assertIdentical(61, cObj.get('height'));
      this.assertIdentical(0.5, cObj.get('opacity'));
      
      this.assertIdentical(cObj, cObj.set('opacity', 0.5), 'chainable');
    },
    
    testSetSourcePath: function() {
      var cObj = new Canvas.Object();
      var SRC_PATH = 'http://example.com/';
      
      this.assertRespondsTo('setSourcePath', cObj);
      
      cObj.setSourcePath(SRC_PATH);
      this.assertIdentical(SRC_PATH, cObj.get('sourcePath'));
    },
    
    testStateProperties: function() {
      var cObj = new Canvas.Object();
      this.assert(cObj.stateProperties);
      this.assert(cObj.stateProperties.length > 0);
    },
    
    testOptions: function() {
      var cObj = new Canvas.Object();
      this.assert(typeof cObj.options == 'object');
    },
    
    testTransform: function() {
      var cObj = new Canvas.Object();
      this.assertRespondsTo('transform', cObj);
    },
    
    testToJSON: function() {
      var emptyObjectJSON = '{"type": "object", "left": 0, "top": 0, "width": 100, "height": 100, "fill": "rgb(0,0,0)",'+
        ' "overlayFill": null, "stroke": null, "strokeWidth": 1, "scaleX": 1, "scaleY": 1, "angle": 0,'+
        ' "flipX": false, "flipY": false, "opacity": 1}';
        
      var augmentedJSON =   '{"type": "object", "left": 0, "top": 0, "width": 122, "height": 100, "fill": "rgb(0,0,0)",'+
          ' "overlayFill": null, "stroke": null, "strokeWidth": 1, "scaleX": 1.3, "scaleY": 1, "angle": 0,'+
          ' "flipX": false, "flipY": true, "opacity": 0.88}';
        
      var cObj = new Canvas.Object();
      this.assertRespondsTo('toJSON', cObj);
      this.assertIdentical(emptyObjectJSON, cObj.toJSON());
      
      cObj.set('opacity', 0.88).set('scaleX', 1.3).set('width', 122).set('flipY', true);
      this.assertIdentical(augmentedJSON, cObj.toJSON());
    },
    
    testToObject: function() {
      var emptyObjectRepr = {
        'type': "object",
        'left': 0, 
        'top': 0, 
        'width': 100, 
        'height': 100, 
        'fill': 'rgb(0,0,0)',
        'overlayFill': null,
        'stroke': null, 
        'strokeWidth': 1, 
        'scaleX': 1, 
        'scaleY': 1, 
        'angle': 0, 
        'flipX': false, 
        'flipY': false, 
        'opacity': 1
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
        'opacity': 0.13
      }
      
      var cObj = new Canvas.Object();
      this.assertHashEqual(emptyObjectRepr, cObj.toObject());
      
      cObj.set('left', 10).set('top', 20).set('width', 30).set('height', 40).set('flipX', true).set('opacity', 0.13);
      this.assertHashEqual(augmentedObjectRepr, cObj.toObject());
      
      var fractionalValue = 166.66666666666666,
          testedProperties = 'left top width height'.split(' '),
          fractionDigitsDefault = 2;
          
      function testFractionDigits(fractionDigits, expectedValue) {
        
        Canvas.Object.prototype.NUM_FRACTION_DIGITS = fractionDigits;
        
        testedProperties.each(function(property) {
          cObj.set(property, fractionalValue);
          this.assertIdentical(expectedValue, cObj.toObject()[property], 
            'value of ' + property + ' should have ' + fractionDigits + ' fractional digits');
        }, this);
        
        Canvas.Object.prototype.NUM_FRACTION_DIGITS = fractionDigitsDefault;
      }
      
      testFractionDigits.call(this, 2, 166.67);
      testFractionDigits.call(this, 3, 166.667);
      testFractionDigits.call(this, 0, 167);
    },
    
    testToDatalessObject: function() {
      var cObj = new Canvas.Object();
      this.assertRespondsTo('toDatalessObject', cObj);
      this.assertHashEqual(cObj.toObject(), cObj.toDatalessObject());
    },
    
    testToObjectWithoutDefaultValues: function() {
      var cObj = new Canvas.Object();
      cObj.includeDefaultValues = false;
      this.assertHashEqual({ type: 'object' }, cObj.toObject());
    },
    
    testIsActive: function() {
      var cObj = new Canvas.Object();
      this.assertRespondsTo('isActive', cObj);
      this.assert(!cObj.isActive(), 'initially not active');
      cObj.setActive(true);
      this.assert(cObj.isActive());
    },
    
    testSetActive: function() {
      var cObj = new Canvas.Object();
      this.assertRespondsTo('setActive', cObj);
      this.assertIdentical(cObj, cObj.setActive(true), 'chainable?');
      this.assert(cObj.isActive());
      cObj.setActive(false);
      this.assert(!cObj.isActive());
    },
    
    testToString: function() {
      var cObj = new Canvas.Object();
      this.assertIdentical('#<Canvas.Object>', cObj.toString());
      cObj.type = 'moo';
      this.assertIdentical('#<Canvas.Moo>', cObj.toString());
    },
    
    testRender: function() {
      var cObj = new Canvas.Object();
      this.assertRespondsTo('render', cObj);
    },
    
    testGetWidth: function() {
      var cObj = new Canvas.Object();
      this.assertRespondsTo('getWidth', cObj);
      this.assertIdentical(100, cObj.getWidth());
      cObj.set('width', 123);
      this.assertIdentical(123, cObj.getWidth());
      cObj.set('scaleX', 2);
      this.assertIdentical(246, cObj.getWidth());
    },
    
    testGetHeight: function() {
      var cObj = new Canvas.Object();
      this.assertRespondsTo('getHeight', cObj);
      this.assertIdentical(100, cObj.getHeight());
      cObj.set('height', 123);
      this.assertIdentical(123, cObj.getHeight());
      cObj.set('scaleY', 2);
      this.assertIdentical(246, cObj.getHeight());
    },
    
    testRotate: function() {
      var cObj = new Canvas.Object();
      this.assertRespondsTo('rotate', cObj);
      this.assertIdentical(0, cObj.get('angle'));
      this.assertIdentical(cObj, cObj.rotate(45), 'chainable');
      this.assertIdentical(45, cObj.get('angle'));
    },
    
    testScale: function() {
      var cObj = new Canvas.Object();
      this.assertRespondsTo('scale', cObj);
      this.assertIdentical(1, cObj.get('scaleX'));
      this.assertIdentical(1, cObj.get('scaleY'));
      cObj.scale(1.5);
      this.assertIdentical(1.5, cObj.get('scaleX'));
      this.assertIdentical(1.5, cObj.get('scaleY'));
      this.assertIdentical(cObj, cObj.scale(2), 'chainable');
    },
    
    testScaleToWidth: function() {
      var cObj = new Canvas.Object({ width: 560 });
      this.assertRespondsTo('scaleToWidth', cObj);
      this.assertIdentical(cObj, cObj.scaleToWidth(100), 'chainable');
      this.assertIdentical(100, cObj.getWidth());
      this.assertIdentical(100/560, cObj.get('scaleX'));
    },
    
    testScaleToHeight: function() {
      var cObj = new Canvas.Object({ height: 560 });
      this.assertRespondsTo('scaleToHeight', cObj);
      this.assertIdentical(cObj, cObj.scaleToHeight(100), 'chainable');
      this.assertIdentical(100, cObj.getHeight());
      this.assertIdentical(100/560, cObj.get('scaleY'));
    },
    
    testSetOpacity: function() {
      var cObj = new Canvas.Object();
      this.assertRespondsTo('setOpacity', cObj);
      this.assertIdentical(1, cObj.get('opacity'));
      cObj.setOpacity(0.68);
      this.assertIdentical(0.68, cObj.get('opacity'));
      this.assertIdentical(cObj, cObj.setOpacity(1), 'chainable');
    },
    
    testGetAngle: function() {
      var cObj = new Canvas.Object();
      this.assertRespondsTo('getAngle', cObj);
      this.assertIdentical(0, cObj.getAngle());
      cObj.rotate(45);
      this.assertIdentical(45, cObj.getAngle());
    },
    
    testSetAngle: function() {
      var cObj = new Canvas.Object();
      this.assertRespondsTo('setAngle', cObj);
      this.assertIdentical(0, cObj.get('angle'));
      this.assertIdentical(cObj, cObj.setAngle(45), 'chainable');
      this.assertIdentical(45, cObj.get('angle'));
    },
    
    testSetCoords: function() {
      var cObj = new Canvas.Object({ left: 200, top: 200 });
      this.assertRespondsTo('setCoords', cObj);
      this.assertIdentical(cObj, cObj.setCoords(), 'chainable');
      
      cObj.set('left', 300).set('top', 300);
      
      // coords should still correspond to initial one, even after invoking `set`
      this.assertIdentical(150, cObj.oCoords.tl.x);
      this.assertIdentical(150, cObj.oCoords.tl.y);
      this.assertIdentical(250, cObj.oCoords.tr.x);
      this.assertIdentical(150, cObj.oCoords.tr.y);
      this.assertIdentical(150, cObj.oCoords.bl.x);
      this.assertIdentical(250, cObj.oCoords.bl.y);
      this.assertIdentical(250, cObj.oCoords.br.x);
      this.assertIdentical(250, cObj.oCoords.br.y);
      
      // recalculate coords
      cObj.setCoords();
      
      // check that coords are now updated
      this.assertIdentical(250, cObj.oCoords.tl.x);
      this.assertIdentical(250, cObj.oCoords.tl.y);
      this.assertIdentical(350, cObj.oCoords.tr.x);
      this.assertIdentical(250, cObj.oCoords.tr.y);
      this.assertIdentical(250, cObj.oCoords.bl.x);
      this.assertIdentical(350, cObj.oCoords.bl.y);
      this.assertIdentical(350, cObj.oCoords.br.x);
      this.assertIdentical(350, cObj.oCoords.br.y);
    },
    
    testDrawBorders: function() {
      var cObj = new Canvas.Object();
      var dummyContext = document.createElement('canvas').getContext('2d');
      this.assertRespondsTo('drawBorders', cObj);
      this.assertIdentical(cObj, cObj.drawBorders(dummyContext), 'chainable');
    },
    
    testDrawCorners: function() {
      var cObj = new Canvas.Object();
      var dummyContext = document.createElement('canvas').getContext('2d');
      this.assertRespondsTo('drawCorners', cObj);
      this.assertIdentical(cObj, cObj.drawCorners(dummyContext), 'chainable');
    },
    
    testClone: function() {
      var cObj = new Canvas.Object({ left: 123, top: 456, opacity: 0.66 });
      this.assertRespondsTo('clone', cObj);
      var clone = cObj.clone();
      
      this.assertIdentical(123, clone.get('left'));
      this.assertIdentical(456, clone.get('top'));
      this.assertIdentical(0.66, clone.get('opacity'));
      
      // augmenting clone properties should not affect original instance 
      clone.set('left', 12).set('scaleX', 2.5).setAngle(33);
      
      this.assertIdentical(123, cObj.get('left'));
      this.assertIdentical(1, cObj.get('scaleX'));
      this.assertIdentical(0, cObj.getAngle());
    
    },
    
    testCloneAsImage: function() {
      var cObj = new Canvas.Rect();
      this.assertRespondsTo('cloneAsImage', cObj);
      
      var image;
      var _this = this;
      this.wait(1000, function(i){
        _this.assert(image);
        _this.assert(image instanceof Canvas.Image);
      })
      cObj.cloneAsImage(function(i) {
        image = i;
      })
    },
    
    testToDataURL: function() {
      var data = 
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQA'+
        'AABkCAYAAABw4pVUAAAA+UlEQVR4nO3RoRHAQBDEsOu/6YR+B2s'+
        'gIO4Z3919pMwDMCRtHoAhafMADEmbB2BI2jwAQ9LmARiSNg/AkLR5AI'+
        'akzQMwJG0egCFp8wAMSZsHYEjaPABD0uYBGJI2D8CQtHkAhqTNAzAkbR'+
        '6AIWnzAAxJmwdgSNo8AEPS5gEYkjYPwJC0eQCGpM0DMCRtHoAhafMADEm'+
        'bB2BI2jwAQ9LmARiSNg/AkLR5AIakzQMwJG0egCFp8wAMSZsHYEjaPABD0'+
        'uYBGJI2D8CQtHkAhqTNAzAkbR6AIWnzAAxJmwdgSNo8AEPS5gEYkjYPw'+
        'JC0eQCGpM0DMCRtHsDjB5K06yueJFXJAAAAAElFTkSuQmCC';
      var cObj = new Canvas.Rect();
      this.assertRespondsTo('toDataURL', cObj);
      // this.assertIdentical(data, cObj.toDataURL());
      var dataURL = cObj.toDataURL();
      this.assertIdentical('string', typeof dataURL);
      this.assertIdentical('data:image/png;base64', dataURL.substring(0, 21));
    },
    
    testHasStateChanged: function() {
      var cObj = new Canvas.Object();
      this.assertRespondsTo('hasStateChanged', cObj);
      this.assert(!cObj.hasStateChanged());
      cObj.saveState();
      cObj.set('left', 123).set('top', 456);
      this.assert(cObj.hasStateChanged());
    },
    
    testSaveState: function() {
      var cObj = new Canvas.Object();
      this.assertRespondsTo('saveState', cObj);
      this.assertIdentical(cObj, cObj.saveState(), 'chainable');
      cObj.set('left', 123).set('top', 456);
      cObj.saveState();
      cObj.set('left', 223).set('top', 556);
      this.assertIdentical(123, cObj.originalState.left);
      this.assertIdentical(456, cObj.originalState.top);
    },
    
    testIntersectsWithRectangle: function() {
      var cObj = new Canvas.Object({ left: 100, top: 100, width: 100, height: 100 });
      this.assertRespondsTo('intersectsWithRect', cObj);
           
      var point1 = new Canvas.Point2D(110, 100),
          point2 = new Canvas.Point2D(210, 200),
          point3 = new Canvas.Point2D(0, 0),
          point4 = new Canvas.Point2D(10, 10);
      
      this.assert(cObj.intersectsWithRect(point1, point2));
      this.assert(!cObj.intersectsWithRect(point3, point4));
    },
    
    testIntersectsWithObject: function() {
      var cObj = new Canvas.Object({ left: 100, top: 100, width: 100, height: 100 });
      this.assertRespondsTo('intersectsWithObject', cObj);
      
      var cObj2 = new Canvas.Object({ left: 50, top: 50, width: 200, height: 200 });
      this.assert(cObj.intersectsWithObject(cObj2));
      this.assert(cObj2.intersectsWithObject(cObj));
      
      var cObj3 = new Canvas.Object({ left: 400, top: 356, width: 13, height: 33 });
      this.assert(!cObj.intersectsWithObject(cObj3));
      this.assert(!cObj3.intersectsWithObject(cObj));
    },
    
    testIsContainedWithinRect: function() {
      var cObj = new Canvas.Object({ left: 20, top: 20, width: 10, height: 10 });
      this.assertRespondsTo('isContainedWithinRect', cObj);
      
      // fully contained
      this.assert(cObj.isContainedWithinRect(new Canvas.Point2D(10,10), new Canvas.Point2D(100,100)));
      // only intersects
      this.assert(!cObj.isContainedWithinRect(new Canvas.Point2D(10,10), new Canvas.Point2D(25, 25)));
      // doesn't intersect
      this.assert(!cObj.isContainedWithinRect(new Canvas.Point2D(100,100), new Canvas.Point2D(110, 110)));
    },
    
    testIsType: function() {
      var cObj = new Canvas.Object();
      this.assertRespondsTo('isType', cObj);
      this.assert(cObj.isType('object'));
      this.assert(!cObj.isType('rect'));
      cObj = new Canvas.Rect();
      this.assert(cObj.isType('rect'));
      this.assert(!cObj.isType('object'));
    },
    
    testGetCenter: function() {
      var object = new Canvas.Object({ left: 100, top: 124, width: 210, height: 66 });
      this.assertRespondsTo('getCenter', object);
      this.assertObjectIdentical({ x: 205, y: 157 }, object.getCenter());
    },
    
    testToggle: function() {
      var object = new Canvas.Object({ left: 100, top: 124, width: 210, height: 66 });
      this.assertRespondsTo('toggle', object);
      
      object.set('flipX', false);
      this.assertIdentical(object, object.toggle('flipX'), 'should be chainable');
      this.assertIdentical(true, object.get('flipX'));
      object.toggle('flipX');
      this.assertIdentical(false, object.get('flipX'));
      
      object.set('left', 112.45);
      object.toggle('left');
      this.assertIdentical(112.45, object.get('left'), 'non boolean properties should not be affected');
    },
    
    testStraighten: function() {
      var object = new Canvas.Object({ left: 100, top: 124, width: 210, height: 66 });
      this.assertRespondsTo('straighten', object);
      
      object.setAngle(123.456);
      object.straighten();
      this.assertIdentical(90, object.get('angle'));
      
      object.setAngle(97.111);
      object.straighten();
      this.assertIdentical(90, object.get('angle'));
      
      object.setAngle(3.45);
      object.straighten();
      this.assertIdentical(0, object.get('angle'));
      
      object.setAngle(-157);
      object.straighten();
      this.assertIdentical(-180, object.get('angle'));
      
      object.setAngle(159);
      object.straighten();
      this.assertIdentical(180, object.get('angle'));
      
      object.setAngle(999);
      object.straighten();
      this.assertIdentical(360, object.get('angle'));
    },
    
    testGrayscale: function() {
      var object = new Canvas.Object({ left: 100, top: 124, width: 210, height: 66 });
      this.assertRespondsTo('toGrayscale', object);
      this.assertIdentical(object, object.toGrayscale(), 'should be chainable');
      
      object.set('fill', 'rgb(200,0,0)'); // set color to red
      object.toGrayscale();
      
      this.assertIdentical('rgb(60,60,60)', object.get('overlayFill'));
      this.assertIdentical('rgb(200,0,0)', object.get('fill'), 'toGrayscale should not overwrite original fill value');
      
      object.set('fill', '').set('overlayFill', '');
      object.toGrayscale();
      
      this.assertIdentical('', object.get('overlayFill'), 'Empty fill values should be left intact');
    },
    
    testFxRemove: function() {
      var object = new Canvas.Object({ left: 20, top: 30, width: 40, height: 50, opacity: 1 });
  
      var onCompleteFired = false;
      var onComplete = function(){ onCompleteFired = true; };
      
      var onChangeFired = false;
      var onChange = function(){ onChangeFired = true; };
      
      var callbacks = { onComplete: onComplete, onChange: onChange };
      
      this.assertRespondsTo('fxRemove', object);
      this.assertIdentical(object, object.fxRemove(callbacks), 'should be chainable');
      
      this.assertIdentical(1, object.get('opacity'));
      
      this.wait(1000, function(){
        
        this.assert(onCompleteFired);
        this.assert(onChangeFired);
        
        this.assertIdentical(0, object.get('opacity'), 'opacity should be set to 0 by the end of animation');
        
        this.assertIdentical(object, object.fxRemove(), 'should work without callbacks');
      });
    },
    
    testFxStraighten: function() {
      var object = new Canvas.Object({ left: 20, top: 30, width: 40, height: 50, angle: 43 });
  
      var onCompleteFired = false;
      var onComplete = function(){ onCompleteFired = true; };
      
      var onChangeFired = false;
      var onChange = function(){ onChangeFired = true; };
      
      var callbacks = { onComplete: onComplete, onChange: onChange };
      
      this.assertRespondsTo('fxStraighten', object);
      this.assertIdentical(object, object.fxStraighten(callbacks), 'should be chainable');
      
      this.assertIdentical(43, Canvas.util.toFixed(object.get('angle'), 0));
      
      this.wait(1000, function(){
        
        this.assert(onCompleteFired);
        this.assert(onChangeFired);
        
        this.assertIdentical(0, object.get('angle'), 'angle should be set to 0 by the end of animation');
        
        this.assertIdentical(object, object.fxStraighten(), 'should work without callbacks');
      });
    }
  });
}