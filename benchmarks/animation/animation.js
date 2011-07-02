(function() {
  
  // polyfill by @paulirish
  if (!window.requestAnimationFrame ) {
    window.requestAnimationFrame = (function() {
      return window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element ) {
        window.setTimeout( callback, 1000 / 60 );
      };
    })();
  }
  
  var canvas = new fabric.Canvas('test'),
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
  
  var angle = 0; 
  function animate() {
    angle += 2;
    if (angle === 360) {
      angle = 0;
    }
    canvas.item(0).setAngle(angle);
    canvas.item(1).setAngle(angle);
    canvas.item(2).setAngle(angle);
    canvas.item(3).setAngle(angle);
    
    canvas.renderAll();
    
    if (!shouldAbort) {
      window.requestAnimationFrame(animate, canvas.upperCanvasEl);
    }
  }
  
  function loadShape() {
    for (var i = coords.length; i--; ) {
      (function(i){
        loadSVGFromURL('../../demos/kitchensink/assets/' + shapePath, function(objects, options) {
          var pathGroup = new fabric.PathGroup(objects, options);

          pathGroup.set({
            left: coords[i].x,
            top: coords[i].y,
            angle: 30,
            fill: '#ff5555'
          });
          pathGroup.scale(scaleObjectEl.value).setCoords();

          canvas.add(pathGroup);

          canvasObjects = canvas.getObjects();
          if (canvasObjects.length === 4) {
            animate();
          }
          setTimeout(function() {
            complexityEl.innerHTML = canvas.complexity();
          }, 50);
        });
      })(i);
    }
  }
  
  loadShape();
  
})();