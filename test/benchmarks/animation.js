(function() {
  
  var canvas = new fabric.Element('test'),
      fpsEl = document.getElementById('fps'),
      complexityEl = document.getElementById('complexity'),
      changeShapeEl = document.forms[0],
      shapePathEl = document.getElementById('shape-path'),
      scaleObjectEl = document.getElementById('scale-object'),
      scaleObjectOutputEl = document.getElementById('scale-object-output'),
      scaleCanvasEl = document.getElementById('scale-canvas'),
      scaleCanvasOutputEl = document.getElementById('scale-canvas-output'),
      canvasObjects,
      shapePath = '1.svg',
      coords = [{ x: 150, y: 150 }, { x: 450, y: 150 }, { x: 150, y: 450 }, { x: 450, y: 450 }],
      interval,
      shouldAbort = false;
      
  canvas.onFpsUpdate = function(value) {
    fpsEl.innerHTML = value;
  };
  
  changeShapeEl.onsubmit = function() {
    if (shapePathEl.value) {
      shapePath = shapePathEl.value;
    }
    shouldAbort = true;
    canvas.clear();
    
    setTimeout(function() {
      loadShape();
      shouldAbort = false;
    }, 100);
    
    return false;
  };
  
  function scaleObjects() {
    scaleObjectOutputEl.firstChild.nodeValue = fabric.util.toFixed(scaleObjectEl.value, 2);
    for (var canvasObjects = canvas.getObjects(), i = canvasObjects.length; i--; ) {
      canvasObjects[i].scaleX = scaleObjectEl.value;
      canvasObjects[i].scaleY = scaleObjectEl.value;
    }
  }
  
  scaleObjectEl.onchange = scaleObjects;
  
  scaleCanvasEl.onchange = function() {
    var scaleValue = fabric.util.toFixed(scaleCanvasEl.value, 2);
    scaleCanvasOutputEl.firstChild.nodeValue = scaleValue;
    
    canvas.setWidth(scaleValue).setHeight(scaleValue);
    canvas.renderAll();
  };
  
  function loadSVGFromURL(url, callback) {
    new fabric.util.request(url, {
      method: 'get',
      onComplete: function(r) {
        var xml = r.responseXML;
        if (!xml) return;
        var doc = xml.documentElement;
        if (!doc) return;
        fabric.parseSVGDocument(doc, callback);
      }
    });
  }
  
  function animate() {
    fabric.util.animate({
      startValue: 0,
      endValue: 360,
      duration: 3000,
      easing: function(value) { 
        return value;
      },
      onChange: function(value) {
        if (canvas._objects.length) {
          canvas._objects[0].setAngle(value);
          canvas._objects[1].setAngle(value);
          canvas._objects[2].setAngle(value);
          canvas._objects[3].setAngle(value);
        }
        canvas.renderAll();
      },
      onComplete: function() {
        if (!shouldAbort) {
          animate();
        }
      },
      abort: function() {
        return shouldAbort;
      }
    });
  }
  
  function loadShape() {
    for (var i = coords.length; i--; ) {
      (function(i){
        loadSVGFromURL('../demo/assets/' + shapePath, function(objects, options) {
          var pathGroup = new fabric.PathGroup(objects, options);

          pathGroup
            .set('left', coords[i].x)
            .set('top', coords[i].y)
            .set('angle', 30)
            .set('fill', '#ff5555')
            .scale(scaleObjectEl.value)
            .setCoords();

          canvas.add(pathGroup);

          if (i === 0) {
            canvasObjects = canvas.getObjects();
            if (canvasObjects.length > 0) {
              animate();
            }
            setTimeout(function() {
              complexityEl.innerHTML = canvas.complexity();
            }, 50);
          }
        });
      })(i);
    }
  }
  
  loadShape();
  
})();