(function() {
  
  var canvas = new fabric.Element('test'),
      fpsEl = document.getElementById('fps'),
      complexityEl = document.getElementById('complexity'),
      canvasObjects;
      
  canvas.onFpsUpdate = function(value) {
    fpsEl.innerHTML = value;
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
  
  var coords = [{ x: 150, y: 150 }, { x: 450, y: 150 }, { x: 150, y: 450 }, { x: 450, y: 450 }];
  
  for (var i = coords.length; i--; ) {
    (function(i){
      loadSVGFromURL('../demo/assets/7.svg', function(objects, options) {
        var pathGroup = new fabric.PathGroup(objects, options);

        pathGroup
          .set('left', coords[i].x)
          .set('top', coords[i].y)
          .set('angle', 30)
          .set('fill', '#ff5555')
          .scale(0.5)
          .setCoords();

        canvas.add(pathGroup);
        
        if (i === 0) {
          canvasObjects = canvas.getObjects();
          animate();
          setTimeout(function() {
            complexityEl.innerHTML = canvas.complexity();
          }, 50);
        }
      });
    })(i);
    
    function animate() {
      fabric.util.animate({
        startValue: 0,
        endValue: 360,
        duration: 3000,
        easing: function(value) { 
          return value;
        },
        onChange: function(value) {
          canvasObjects[0].setAngle(value);
          canvasObjects[1].setAngle(value);
          canvasObjects[2].setAngle(value);
          canvasObjects[3].setAngle(value);
          canvas.renderAll();
        },
        onComplete: function() {
          animate();
        }
      });
    }
    
    animate();
  }
  
})();