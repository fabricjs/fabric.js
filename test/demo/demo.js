(function() {
  
  var getRandomInt = fabric.util.getRandomInt;
  function getRandomColor() {
    return getRandomInt(0, 255).toString(16) 
      + getRandomInt(0, 255).toString(16) 
      + getRandomInt(0, 255).toString(16);
  }
  function getRandomNum(min, max) {
    return Math.random() * (max - min) + min;
  }
  function loadSVGFromURL(url, callback) {
    var req = new fabric.util.request(url, {
      method: 'get',
      onComplete: function(r) {
        var xml = r.responseXML;
        if (!xml) return;
        var doc = xml.documentElement;
        if (!doc) return;
        fabric.parseSVGDocument(doc, callback);
      }
    })
  }
  
  var canvas = this.canvas = new fabric.Element('canvas');
  
  document.getElementById('commands').onclick = function(ev) {
    ev.preventDefault();
    
    var element = ev.target || ev.srcElement,
        className = element.className,
        offset = 50,
        left = fabric.util.getRandomInt(0 + offset, 700 - offset),
        top = fabric.util.getRandomInt(0 + offset, 500 - offset),
        angle = fabric.util.getRandomInt(-20, 40),
        width = fabric.util.getRandomInt(30, 50),
        opacity = (function(min, max){ return Math.random() * (max - min) + min; })(0.5, 1);
    
    switch (className) {
      case 'rect':
        canvas.add(new fabric.Rect({ 
          left: left, 
          top: top, 
          fill: '#' + getRandomColor(), 
          width: 50, 
          height: 50, 
          opacity: 0.8 
        }));
        break;
        
      case 'circle':
        canvas.add(new fabric.Circle({ 
          left: left, 
          top: top, 
          fill: '#' + getRandomColor(), 
          radius: 50, 
          opacity: 0.8 
        }));
        break;
      
      case 'triangle':
        canvas.add(new fabric.Triangle({ 
          left: left, 
          top: top, 
          fill: '#' + getRandomColor(), 
          width: 50, 
          height: 50, 
          opacity: 0.8 
        }));
        break;
      
      case 'image1':
        fabric.Image.fromURL('http://www.dooziedog.com/dog_breeds/pug/images/full/Pug-Puppy.jpg', function(image) {
          image.set('left', left).set('top', top).set('angle', angle).scale(getRandomNum(0.05, 0.25)).setCoords();
          canvas.add(image);
        });
        break;
      
      case 'image2':
        fabric.Image.fromURL('http://www.google.com/intl/en_ALL/images/srpr/logo1w.png', function(image) {
          image.set('left', left).set('top', top).set('angle', angle).scale(getRandomNum(0.1, 1)).setCoords();
          canvas.add(image);
        });
        break;
      
      case 'shape':
        var id = element.id, match;
        if (match = /\d+$/.exec(id)) {
          loadSVGFromURL('assets/' + match[0] + '.svg', function(objects, options) {
            var pathGroup = new fabric.PathGroup(objects, options);
            pathGroup
              .set('left', left)
              .set('top', top)
              .set('angle', angle)
              .set('fill', '#' + getRandomColor())
              .scale(getRandomNum(0.75, 1.25))
              .setCoords();
              
            canvas.add(pathGroup);
          });
        }
        break;
      
      case 'clear':
        if (confirm('Are you sure?')) {
          canvas.clear();
        }
    }
  };
  
  document.getElementById('execute').onclick = function() {
    var code = document.getElementById('canvas-console').value;
    if (!(/^\s+$/).test(code)) {
      eval(code);
    }
  };
  
  document.getElementById('rasterize').onclick = function() {
    window.open(canvas.toDataURL('png'));
  };
  
})();