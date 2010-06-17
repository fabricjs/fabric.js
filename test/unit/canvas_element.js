function init() {
  
  var emptyImageCanvasData = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAfQAAAH0CAYAAADL1t+KAAAH7ElEQVR4nO3VMQ0AMAzAsPInvYHoMS2yEeTLHADge/M6AADYM3QACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIMHQACDB0AAgwdAAIuMjH4b7osLFBAAAAAElFTkSuQmCC";  
  
  var PATH_JSON = '{"objects": [{"type": "path", "left": 268, "top": 266, "width": 51, "height": 49,'+
                  ' "fill": "rgb(0,0,0)", "overlayFill": null, "stroke": null, "strokeWidth": 1, "scaleX": 1, "scaleY": 1, '+
                  '"angle": 0, "flipX": false, "flipY": false, "opacity": 1, "path": [["M", 18.511, 13.99],'+
                  ' ["c", 0, 0, -2.269, -4.487, -12.643, 4.411], ["c", 0, 0, 4.824, -14.161, 19.222, -9.059],'+
                  ' ["l", 0.379, -2.1], ["c", -0.759, -0.405, -1.375, -1.139, -1.645, -2.117], ["c", -0.531, '+
                  '-1.864, 0.371, -3.854, 1.999, -4.453], ["c", 0.312, -0.118, 0.633, -0.169, 0.953, -0.169], '+
                  '["c", 1.299, 0, 2.514, 0.953, 2.936, 2.455], ["c", 0.522, 1.864, -0.372, 3.854, -1.999, '+
                  '4.453], ["c", -0.229, 0.084, -0.464, 0.127, -0.692, 0.152], ["l", -0.379, 2.37], ["c", '+
                  '1.146, 0.625, 2.024, 1.569, 2.674, 2.758], ["c", 3.213, 2.514, 8.561, 4.184, 11.774, -8.232],'+
                  ' ["c", 0, 0, 0.86, 16.059, -12.424, 14.533], ["c", 0.008, 2.859, 0.615, 5.364, -0.076, 8.224],'+
                  ' ["c", 8.679, 3.146, 15.376, 14.389, 17.897, 18.168], ["l", 2.497, -2.151], ["l", 1.206, 1.839],'+
                  ' ["l", -3.889, 3.458], ["C", 46.286, 48.503, 31.036, 32.225, 22.72, 35.81], ["c", -1.307, 2.851,'+
                  ' -3.56, 6.891, -7.481, 8.848], ["c", -4.689, 2.336, -9.084, -0.802, -11.277, -2.868], ["l",'+
                  ' -1.948, 3.104], ["l", -1.628, -1.333], ["l", 3.138, -4.689], ["c", 0.025, 0, 9, 1.932, 9, 1.932], '+
                  '["c", 0.877, -9.979, 2.893, -12.905, 4.942, -15.621], ["C", 17.878, 21.775, 18.713, 17.397, 18.511, '+
                  '13.99], ["z", null]]}], "background": "#ff5555"}';
  
  var PATH_DATALESS_JSON = '{"objects": [{"type": "path", "left": 100, "top": 100, "width": 200, '+
                    '"height": 200, "fill": "rgb(0,0,0)", "overlayFill": null, "stroke": null, "strokeWidth": 1, "scaleX": 1, '+
                    '"scaleY": 1, "angle": 0, "flipX": false, "flipY": false, "opacity": 1, '+
                    '"path": "http://example.com/"}], "background": "rgba(255,255,255,1)"}';
  
  var RECT_JSON = '{"objects": [{"type": "rect", "left": 0, "top": 0, "width": 10, "height": 10, "fill": '+
                  '"rgb(0,0,0)", "overlayFill": null, "stroke": null, "strokeWidth": 1, "scaleX": 1, "scaleY": 1, '+
                  '"angle": 0, "flipX": false, "flipY": false, "opacity": 1}], "background": "#ff5555"}';
  
  var canvas = this.canvas = new Canvas.Element('test');
  
  var canvasEl = $('test');
  var canvasContext = canvasEl.getContext('2d');
  
  function makeRect(options) {
    var defaultOptions = { width: 10, height: 10 };
    return new Canvas.Rect(Object.extend(defaultOptions, options || { }));
  }
  
  new Test.Unit.Runner({
    teardown: function() {
      canvas.clear();
      canvas.setActiveGroup(null);
      canvas.backgroundColor = Canvas.Element.prototype.backgroundColor;
      canvas.calcOffset();
    },
    
    testInitialProperties: function() {
      this.assert('backgroundColor' in canvas);
      this.assertIdentical(true, canvas.includeDefaultValues);
    },
    
    testGetObjects: function() {
      
      this.assertRespondsTo('getObjects', canvas, 'should respond to `getObjects` method');
      this.assertEnumEqual([], canvas.getObjects(), 'should return empty array for `getObjects` when empty');
      this.assertIdentical(0, canvas.getObjects().length, 'should have a 0 length when empty');
    },
    testGetElement: function() {
      this.assertRespondsTo('getElement', canvas, 'should respond to `getElement` method');
      this.assertIdentical(canvasEl, canvas.getElement(), 'should return a proper element');
    },
    testItem: function() {
      var rect = makeRect();
      
      this.assertRespondsTo('item', canvas, 'should respond to item');
      canvas.add(rect);
      this.assertIdentical(rect, canvas.item(0), 'should return proper item');
    },
    testCalcOffset: function() {
      this.assertRespondsTo('calcOffset', canvas, 'should respond to `calcOffset`');
      this.assertIsChainable('calcOffset', canvas);
    },
    testAdd: function() {
      var rect = makeRect();
      
      this.assertRespondsTo('add', canvas);
      this.assert(canvas === canvas.add(rect), 'should be chainable');
      this.assertIdentical(rect, canvas.item(0));
      
      canvas.add(makeRect(), makeRect(), makeRect());
      this.assertIdentical(4, canvas.getObjects().length, 'should support multiple arguments');
    },
    testInsertAt: function() {
      
      var rect1 = makeRect(),
          rect2 = makeRect();
      
      canvas.add(rect1, rect2);
      
      this.assertRespondsTo('insertAt', canvas, 'should respond to `insertAt` method');
      
      var rect = makeRect();
      canvas.insertAt(rect, 1);
      this.assertIdentical(rect, canvas.item(1));
      canvas.insertAt(rect, 2);
      this.assertIdentical(rect, canvas.item(2));
      this.assert(canvas === canvas.insertAt(rect, 2), 'should be chainable');
    },
    testGetContext: function() {
      this.assertRespondsTo('getContext', canvas);
      this.assertIdentical(canvasContext, canvas.getContext());
    },
    testClearContext: function() {
      this.assertRespondsTo('clearContext', canvas);
      this.assertIdentical(canvas, canvas.clearContext(canvas.getContext()), 'chainable');
    },
    testClear: function() {
      this.assertRespondsTo('clear', canvas);
      this.assertIsChainable('clear', canvas);
      this.assertIdentical(0, canvas.getObjects().length);
      canvas.add(makeRect({ left: 100, top: 100, fill: '#ff5555' }));
      
      if (Canvas.Element.supports('getImageData')) {
        this.assert(!assertSameColor(canvas._oContextContainer), 'a red rectangle should be rendered on canvas');
        canvas.clear();
        this.assert(assertSameColor(canvas._oContextContainer), 'color should be the same throughout canvas after clearing');
      }
    },
    testRenderAll: function() {
      this.assertRespondsTo('renderAll', canvas);
      this.assertIsChainable('renderAll', canvas);
    },
    testRenderTop: function() {
      this.assertRespondsTo('renderTop', canvas);
      this.assertIsChainable('renderTop', canvas);
    },
    testFindTarget: function() {
      this.assertRespondsTo('findTarget', canvas);
    },
    testToDataURL: function() {
      this.assertRespondsTo('toDataURL', canvas);
      if (!Canvas.Element.supports('toDataURL')) {
        this.warn("toDataURL is not supported by environment");
      }
      else {
        var dataURL = canvas.toDataURL('png');
        // don't compare actual data url, as it is often browser-dependent
        // this.assertIdentical(emptyImageCanvasData, canvas.toDataURL('png'));
        this.assertIdentical('string', typeof dataURL);
        this.assertIdentical('data:image/png;base64', dataURL.substring(0, 21));
      }
    },
    testGetPointer: function() {
      this.assertRespondsTo('getPointer', canvas);
      canvasEl.observe('click', function(e) {
        var pointer = canvas.getPointer(e);
        //this.assertIdentical(101, pointer.x, 'pointer.x should be correct');
        //this.assertIdentical(102, pointer.y, 'pointer.y should be correct');
      }.bind(this));
      Event.simulate(canvasEl, 'click', {
        pointerX: 101, pointerY: 102
      });
    },
    testGetCenter: function() {
      this.assertRespondsTo('getCenter', canvas);
      var center = canvas.getCenter();
      this.assertIdentical(canvasEl.width / 2, center.left);
      this.assertIdentical(canvasEl.height / 2, center.top);
    },
    testCenterObjectH: function() {
      this.assertRespondsTo('centerObjectH', canvas);
      var rect = makeRect({ left: 102, top: 202 });
      canvas.add(rect);
      this.assertIdentical(canvas, canvas.centerObjectH(rect), 'should be chainable');
      this.assertIdentical(canvasEl.width / 2, rect.get('left'), 'object\'s "left" property should correspond to canvas element\'s center');
    },
    testCenterObjectV: function() {
      this.assertRespondsTo('centerObjectV', canvas);
      var rect = makeRect({ left: 102, top: 202 });
      canvas.add(rect);
      this.assertIdentical(canvas, canvas.centerObjectV(rect), 'should be chainable');
      this.assertIdentical(canvasEl.height / 2, rect.get('top'), 'object\'s "top" property should correspond to canvas element\'s center');
    },
    testStraightenObject: function() {
      this.assertRespondsTo('straightenObject', canvas);
      var rect = makeRect({ angle: 10 })
      canvas.add(rect);
      this.assertIdentical(canvas, canvas.straightenObject(rect), 'should be chainable');
      this.assertIdentical(0, rect.getAngle(), 'angle should be coerced to 0 (from 10)');
      
      rect.setAngle('60');
      canvas.straightenObject(rect);
      this.assertIdentical(90, rect.getAngle(), 'angle should be coerced to 90 (from 60)');
      
      rect.setAngle('100');
      canvas.straightenObject(rect);
      this.assertIdentical(90, rect.getAngle(), 'angle should be coerced to 90 (from 100)');
    },
    testToJson: function() {
      this.assertRespondsTo('toJSON', canvas);
      this.assertIdentical('{"objects": [], "background": "rgba(255,255,255,1)"}', canvas.toJSON());
      canvas.backgroundColor = '#ff5555';
      this.assertIdentical('{"objects": [], "background": "#ff5555"}', canvas.toJSON(), '`background` value should be reflected in json');
      canvas.add(makeRect());
      this.assertIdentical(RECT_JSON, canvas.toJSON());
    },
    testToDatalessJSON: function() {
      this.assertRespondsTo('toDatalessJSON', canvas);
      this.assertIdentical('{"objects": [], "background": "rgba(255,255,255,1)"}', canvas.toDatalessJSON());
      canvas.backgroundColor = '#ff5555';
      this.assertIdentical('{"objects": [], "background": "#ff5555"}', 
        canvas.toDatalessJSON(), '`background` value should be reflected in json');
      canvas.add(makeRect());
      this.assertIdentical(RECT_JSON, canvas.toDatalessJSON());
    },
    testToDatalessJSON: function() {
      var path = new Canvas.Path('M 100 100 L 300 100 L 200 300 z', {
        sourcePath: 'http://example.com/'
      });
      canvas.add(path);
      this.assertIdentical(PATH_DATALESS_JSON, canvas.toDatalessJSON());
    },
    testToObject: function() {
      this.assertRespondsTo('toObject', canvas);
      var expectedObject = { 
        background: canvas.backgroundColor, 
        objects: canvas.getObjects()
      };
      this.assertHashEqual(expectedObject, canvas.toObject());
      
      var rect = makeRect();
      canvas.add(rect);
      
      this.assertIdentical(rect.type, canvas.toObject().objects[0].type);
    },
    testToDatalessObject: function() {
      this.assertRespondsTo('toDatalessObject', canvas);
      var expectedObject = { 
        background: canvas.backgroundColor, 
        objects: canvas.getObjects()
      };
      this.assertHashEqual(expectedObject, canvas.toDatalessObject());
      
      var rect = makeRect();
      canvas.add(rect);
      
      this.assertIdentical(rect.type, canvas.toObject().objects[0].type);
      // TODO (kangax): need to test this method with Canvas.Path to ensure that path is not populated
    },
    testIsEmpty: function() {
      this.assertRespondsTo('isEmpty', canvas);
      this.assert(canvas.isEmpty());
      canvas.add(makeRect());
      this.assert(!canvas.isEmpty());
    },
    testLoadFromJSON: function() {
      this.assertRespondsTo('loadFromJSON', canvas);
      canvas.loadFromJSON(PATH_JSON, function(){
        var obj = canvas.item(0);
        
        this.assert(!canvas.isEmpty(), 'canvas is not empty');
        this.assertIdentical('path', obj.type, 'first object is a path object');
        this.assertIdentical('#ff5555', canvas.backgroundColor, 'backgroundColor is populated properly');
        
        this.assertIdentical(268, obj.get('left'));
        this.assertIdentical(266, obj.get('top'));
        this.assertIdentical(51, obj.get('width'));
        this.assertIdentical(49, obj.get('height'));
        this.assertIdentical('rgb(0,0,0)', obj.get('fill'));
        this.assertIdentical(null, obj.get('stroke'));
        this.assertIdentical(1, obj.get('strokeWidth'));
        this.assertIdentical(1, obj.get('scaleX'));
        this.assertIdentical(1, obj.get('scaleY'));
        this.assertIdentical(0, obj.get('angle'));
        this.assertIdentical(false, obj.get('flipX'));
        this.assertIdentical(false, obj.get('flipY'));
        this.assertIdentical(1, obj.get('opacity'));
        this.assert(obj.get('path').length > 0);
        
      }.bind(this))
    },
    testRemove: function() {
      this.assertRespondsTo('remove', canvas);
      var rect1 = makeRect(),
          rect2 = makeRect();
      canvas.add(rect1, rect2);
      this.assertIdentical(rect1, canvas.remove(rect1), 'should return removed object');
      this.assertIdentical(rect2, canvas.item(0), 'only second object should be left');
    },
    testFxRemove: function() {
      this.assertRespondsTo('fxRemove', canvas);
      
      var rect = new Canvas.Rect();
      canvas.add(rect);
      
      var callbackFired = false;
      function onRemove(){
        callbackFired = true;
      }
      
      this.assertIdentical(rect, canvas.item(0));
      this.assertIdentical(canvas, canvas.fxRemove(rect, onRemove), 'should be chainable');
      
      this.wait(1000, function(){
        this.assertUndefined(canvas.item(0));
        this.assert(callbackFired);
      });
    },
    testSendToBack: function() {
      this.assertRespondsTo('sendToBack', canvas);
      
      var rect1 = makeRect(),
          rect2 = makeRect(),
          rect3 = makeRect();
      
      canvas.add(rect1, rect2, rect3);
      
      canvas.sendToBack(rect3);
      this.assertIdentical(rect3, canvas.item(0), 'third should now be the first one');
      
      canvas.sendToBack(rect2);
      this.assertIdentical(rect2, canvas.item(0), 'second should now be the first one');
      
      canvas.sendToBack(rect2);
      this.assertIdentical(rect2, canvas.item(0), 'second should *still* be the first one');
    },
    testBringToFront: function() {
      this.assertRespondsTo('bringToFront', canvas);
      
      var rect1 = makeRect(),
          rect2 = makeRect(),
          rect3 = makeRect();
      
      canvas.add(rect1, rect2, rect3);
      
      canvas.bringToFront(rect1);
      this.assertIdentical(rect1, canvas.item(2), 'first should now be the last one');
      
      canvas.bringToFront(rect2);
      this.assertIdentical(rect2, canvas.item(2), 'second should now be the last one');
      
      canvas.bringToFront(rect2);
      this.assertIdentical(rect2, canvas.item(2), 'second should *still* be the last one');
    },
    testSendBackwards: function() {
      this.assertRespondsTo('sendBackwards', canvas);
      
      var rect1 = makeRect(),
          rect2 = makeRect(),
          rect3 = makeRect();
      
      canvas.add(rect1, rect2, rect3);
      
      // [ 1, 2, 3 ]
      this.assertIdentical(rect1, canvas.item(0));
      this.assertIdentical(rect2, canvas.item(1));
      this.assertIdentical(rect3, canvas.item(2));
      
      canvas.sendBackwards(rect3);
      
      // moved 3 one level back — [1, 3, 2]
      this.assertIdentical(rect1, canvas.item(0));
      this.assertIdentical(rect2, canvas.item(2));
      this.assertIdentical(rect3, canvas.item(1));
      
      canvas.sendBackwards(rect3);
      
      // moved 3 one level back — [3, 1, 2]
      this.assertIdentical(rect1, canvas.item(1));
      this.assertIdentical(rect2, canvas.item(2));
      this.assertIdentical(rect3, canvas.item(0));
      
      canvas.sendBackwards(rect3);
      
      // 3 stays at the same position — [2, 3, 1]
      this.assertIdentical(rect1, canvas.item(1));
      this.assertIdentical(rect2, canvas.item(2));
      this.assertIdentical(rect3, canvas.item(0));
      
      canvas.sendBackwards(rect2);
      
      this.assertIdentical(rect1, canvas.item(2));
      this.assertIdentical(rect2, canvas.item(1));
      this.assertIdentical(rect3, canvas.item(0));
      
      canvas.sendBackwards(rect2);
      
      this.assertIdentical(rect1, canvas.item(2));
      this.assertIdentical(rect2, canvas.item(0));
      this.assertIdentical(rect3, canvas.item(1));
    },
    testBringForward: function() {
      this.assertRespondsTo('bringForward', canvas);
      
      var rect1 = makeRect(),
          rect2 = makeRect(),
          rect3 = makeRect();
      
      canvas.add(rect1, rect2, rect3);
      
      // initial position — [ 1, 2, 3 ]
      this.assertIdentical(rect1, canvas.item(0));
      this.assertIdentical(rect2, canvas.item(1));
      this.assertIdentical(rect3, canvas.item(2));
      
      canvas.bringForward(rect1);
      
      // 1 moves one way up — [ 2, 1, 3 ]
      this.assertIdentical(rect1, canvas.item(1));
      this.assertIdentical(rect2, canvas.item(0));
      this.assertIdentical(rect3, canvas.item(2));
      
      canvas.bringForward(rect1);
      
      // 1 moves one way up again — [ 2, 3, 1 ]
      this.assertIdentical(rect1, canvas.item(2));
      this.assertIdentical(rect2, canvas.item(0));
      this.assertIdentical(rect3, canvas.item(1));
      
      canvas.bringForward(rect1);
      
      // 1 is already all the way on top and so doesn't change position — [ 2, 3, 1 ]
      this.assertIdentical(rect1, canvas.item(2));
      this.assertIdentical(rect2, canvas.item(0));
      this.assertIdentical(rect3, canvas.item(1));
      
      canvas.bringForward(rect3);
      
      // 1 is already all the way on top and so doesn't change position — [ 2, 1, 3 ]
      this.assertIdentical(rect1, canvas.item(1));
      this.assertIdentical(rect2, canvas.item(0));
      this.assertIdentical(rect3, canvas.item(2));
    },
    testSetActiveObject: function() {
      this.assertRespondsTo('setActiveObject', canvas);
      
      var rect1 = makeRect(),
          rect2 = makeRect();
      
      canvas.add(rect1, rect2);
      
      canvas.setActiveObject(rect1);
      this.assert(rect1.isActive());
      
      canvas.setActiveObject(rect2);
      this.assert(rect2.isActive());
    },
    testGetActiveObject: function() {
      this.assertRespondsTo('getActiveObject', canvas);
      
      var rect1 = makeRect(),
          rect2 = makeRect();
          
      canvas.add(rect1, rect2);
      
      canvas.setActiveObject(rect1);
      //this.assertIdentical(rect1, canvas.getActiveObject());
      
      canvas.setActiveObject(rect2);
      //this.assertIdentical(rect2, canvas.getActiveObject());
      
    },
    testGetSetActiveGroup: function() {
      this.assertRespondsTo('getActiveGroup', canvas);
      this.assertRespondsTo('setActiveGroup', canvas);
      
      this.assertNull(canvas.getActiveGroup(), 'should initially be null');
      
      var group = new Canvas.Group([
        makeRect({ left: 10, top: 10 }), 
        makeRect({ left: 20, top: 20 })
      ]);
      
      this.assertIdentical(canvas, canvas.setActiveGroup(group), 'chainable');
      this.assertIdentical(group, canvas.getActiveGroup());
    },
    testItem: function() {
      this.assertRespondsTo('item', canvas);
      
      var rect1 = makeRect(),
          rect2 = makeRect();
      
      canvas.add(rect1, rect2);
      
      this.assertIdentical(rect1, canvas.item(0));
      this.assertIdentical(rect2, canvas.item(1));
      
      canvas.remove(canvas.item(0));
      
      this.assertIdentical(rect2, canvas.item(0));
    },
    testRemoveActiveGroup: function() {
      this.assertRespondsTo('removeActiveGroup', canvas);
      var group = new Canvas.Group([makeRect(), makeRect()]);
      canvas.setActiveGroup(group);
      this.assertIdentical(canvas, canvas.removeActiveGroup(), 'chainable');
      this.assertNull(canvas.getActiveGroup(), 'removing active group sets it to null');
    },
    testDeactivateAll: function() {
      this.assertRespondsTo('deactivateAll', canvas);
      
      canvas.add(makeRect());
      canvas.setActiveObject(canvas.item(0));

      canvas.deactivateAll();
      this.assert(!canvas.item(0).isActive());
      this.assertNull(canvas.getActiveObject());
      this.assertNull(canvas.getActiveGroup());
    },
    testDeactivateAllWithDispatch: function() {
      this.assertRespondsTo('deactivateAllWithDispatch', canvas);
      
      canvas.add(makeRect());
      canvas.setActiveObject(canvas.item(0));
      
      var group = new Canvas.Group([
        makeRect({ left: 10, top: 10 }), 
        makeRect({ left: 20, top: 20 })
      ]);
      
      canvas.setActiveGroup(group);
      
      var eventsFired = {
        beforeGroupDestroyed: false,
        afterGroupDestroyed: false,
        selectionCleared: false
      }
      var target;
      
      Canvas.base.observeEvent('before:group:destroyed', (function (e) {
        eventsFired.beforeGroupDestroyed = true;
        this.assertIdentical(canvas.getActiveGroup(), e.memo.target, 'event should have active group as its `target` property');
      }).bind(this));
      
      Canvas.base.observeEvent('after:group:destroyed', function(){
        eventsFired.afterGroupDestroyed = true;
      });
      
      Canvas.base.observeEvent('selection:cleared', function(){
        eventsFired.selectionCleared = true;
      });
      
      canvas.deactivateAllWithDispatch();
      this.assert(!canvas.item(0).isActive());
      this.assertNull(canvas.getActiveObject());
      this.assertNull(canvas.getActiveGroup());
      
      for (var prop in eventsFired) {
        this.assert(eventsFired[prop]);
      }
      
      eventsFired.beforeGroupDestroyed = false;
      eventsFired.afterGroupDestroyed = false;
      eventsFired.selectionCleared = false;
      
      canvas.deactivateAllWithDispatch();
      
      this.assert(!eventsFired.beforeGroupDestroyed, 'before:group:destroyed should only fire when there\'s an active group');
      this.assert(!eventsFired.afterGroupDestroyed, 'after:group:destroyed should only fire when there\'s an active group');
      
      this.assert(eventsFired.selectionCleared, 'selection:cleared is fired independent of active group existence');
    },
    testComplexity: function() {
      this.assertRespondsTo('complexity', canvas);
      this.assertIdentical(0, canvas.complexity());
      
      canvas.add(makeRect());
      this.assertIdentical(1, canvas.complexity());
      
      canvas.add(makeRect(), makeRect());
      this.assertIdentical(3, canvas.complexity());
    },
    testToString: function() {
      this.assertRespondsTo('toString', canvas);
      
      this.assertIdentical('#<Canvas.Element (0): { objects: 0 }>', canvas.toString());
      
      canvas.add(makeRect());
      this.assertIdentical('#<Canvas.Element (1): { objects: 1 }>', canvas.toString());
    },
    testDispose: function() {
      
      function invokeEventsOnCanvas() {
        Event.simulate(canvas.getElement(), 'mousedown');
        Event.simulate(canvas.getElement(), 'mouseup');
        Event.simulate(canvas.getElement(), 'mousemove');
      }
      var assertInvocationsCount = (function() {
        var message = 'event handler should not be invoked after `dispose`';
        this.assertIdentical(1, handlerInvocationCounts.__onMouseDown);
        this.assertIdentical(1, handlerInvocationCounts.__onMouseUp);
        this.assertIdentical(1, handlerInvocationCounts.__onMouseMove);
      }).bind(this);
      
      this.assertRespondsTo('dispose', canvas);
      canvas.add(makeRect(), makeRect(), makeRect());
      
      var handlerInvocationCounts = {
        __onMouseDown: 0, __onMouseUp: 0, __onMouseMove: 0
      }
      // hijack event handlers
      canvas.__onMouseDown = function() {
        handlerInvocationCounts.__onMouseDown++;
      };
      canvas.__onMouseUp = function() {
        handlerInvocationCounts.__onMouseUp++;
      };
      canvas.__onMouseMove = function() {
        handlerInvocationCounts.__onMouseMove++;
      };
      
      invokeEventsOnCanvas();
      assertInvocationsCount();
      
      canvas.dispose();
      this.assertIdentical(0, canvas.getObjects().length, 'dispose should clear canvas');
      
      invokeEventsOnCanvas();
      assertInvocationsCount();
    },
    testClone: function() {
      this.assertRespondsTo('clone', canvas);
      // TODO (kangax): test clone
    },
    testSetBgImage: function() {
      this.assertRespondsTo('setBgImage', canvas);
      this.assertIdentical(canvas, canvas.setBgImage(''), 'chainable');
    },
    testGetSetWidth: function() {
      this.assertRespondsTo('getWidth', canvas);
      this.assertIdentical(500, canvas.getWidth());
      this.assertIdentical(canvas, canvas.setWidth(444), 'chainable');
      this.assertIdentical(444, canvas.getWidth());
    },
    testGetHeight: function() {
      this.assertRespondsTo('getHeight', canvas);
      this.assertIdentical(500, canvas.getHeight());
      this.assertIdentical(canvas, canvas.setHeight(765), 'chainable');
      this.assertIdentical(765, canvas.getHeight());
    },
    testContainsPoint: function() {
      this.assertRespondsTo('containsPoint', canvas);
      
      var rect = new Canvas.Rect({ left: 100, top: 100, width: 50, height: 50 });
      canvas.add(rect);
      
      var canvasEl = canvas.getElement(),
          canvasOffset = Canvas.base.getElementOffset(canvasEl);
      
      var eventStub = { 
        pageX: canvasOffset.left + 100, 
        pageY: canvasOffset.top + 100 
      }
      
      this.assert(canvas.containsPoint(eventStub, rect), 'point at (100, 100) should be within area (75, 75, 125, 125)');
      
      eventStub = {
        pageX: canvasOffset.left + 200, 
        pageY: canvasOffset.top + 200
      }
      this.assert(!canvas.containsPoint(eventStub, rect), 'point at (200, 200) should NOT be within area (75, 75, 125, 125)');
      
      rect.set('left', 200).set('top', 200).setCoords();
      this.assert(canvas.containsPoint(eventStub, rect), 'point at (200, 200) should be within area (175, 175, 225, 225)');
      
    },
    testToGrayscale: function() {
      this.assertRespondsTo('toGrayscale', Canvas.Element);
      
      if (!Canvas.Element.supports('getImageData')) {
        this.warn('getImageData is not supported by environment. Some of the tests can not be run.');
        return;
      }
      
      var canvasEl = document.createElement('canvas'),
          context = canvasEl.getContext('2d');
          
      canvasEl.width = canvasEl.height = 10;
      
      context.fillStyle = 'rgb(255,0,0)'; // red
      context.fillRect(0, 0, 10, 10);
      
      var imageData = context.getImageData(0, 0, 10, 10),
          data = imageData.data,
          firstPixelData = [data[0], data[1], data[2], data[3]];
          
      this.assertObjectIdentical([255, 0, 0, 255], firstPixelData);
      
      Canvas.Element.toGrayscale(canvasEl);
      
      imageData = context.getImageData(0, 0, 10, 10);
      data = imageData.data;
      firstPixelData = [data[0], data[1], data[2], data[3]];
      
      this.assertObjectIdentical([85, 85, 85, 255], firstPixelData);
    },
    testResizeImageToFit: function() {
      this.assertRespondsTo('_resizeImageToFit', canvas);
      
      var imgEl = Canvas.base.makeElement('img', { src: '../fixtures/very_large_image.jpg' }),
          ORIGINAL_WIDTH = 3888,
          ORIGINAL_HEIGHT = 2592;
      
      this.wait(2000, function(){
        
        this.assertIdentical(ORIGINAL_WIDTH, imgEl.width);
        this.assertIdentical(ORIGINAL_HEIGHT, imgEl.height);
        
        canvas._resizeImageToFit(imgEl);
        
        this.assert(imgEl.width < ORIGINAL_WIDTH);
        this.assert(imgEl.height < ORIGINAL_HEIGHT);
      });
    },
    testCache: function() {
      this.assert(canvas.cache);
      
      this.assertRespondsTo('has', canvas.cache);
      this.assertRespondsTo('get', canvas.cache);
      this.assertRespondsTo('set', canvas.cache);
      
      var message = 'initially, `has` should always return false';
      
      var hasFoo, hasBarBaz, hasEmpty;
      
      canvas.cache.has('foo', function(v){
        hasFoo = v;
      });
      canvas.cache.has('bar baz moooo', function(v){
        hasBarBaz = v;
      });
      canvas.cache.has('', function(v){
        hasEmpty = v;
      });
      
      this.wait(500, function(){
        this.assertIdentical(false, hasFoo, message);
        this.assertIdentical(false, hasBarBaz, message);
        this.assertIdentical(false, hasEmpty, message);
      });
    },
    testLoadImageFromURL: function() {
      this.assertRespondsTo('loadImageFromURL', canvas);
      
      var callbackInvoked = false,
          objectPassedToCallback;
          
      canvas.loadImageFromURL('../fixtures/very_large_image.jpg', function(obj) {
        callbackInvoked = true;
        objectPassedToCallback = obj;
      });
      
      this.wait(2000, function(){
        this.assert(callbackInvoked, 'callback should be invoked');
        this.assertInstanceOf(Canvas.Image, objectPassedToCallback, 'object passed to callback should be an instance of `Canvas.Image`');
        this.assert(objectPassedToCallback.getSrc().endsWith('fixtures/very_large_image.jpg'), 'image should have correct src');
      });
      
    }
  });
}