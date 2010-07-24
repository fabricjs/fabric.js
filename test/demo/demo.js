(function() {

  var canvas = this.canvas = new fabric.Element('canvas');

  var rect = new fabric.Rect({
    fill: "red",
    left: 100,
    top: 100,
    width: 50,
    height: 60
  });

  var circle = new fabric.Circle({
    fill: 'green',
    radius: 30,
    left: 70,
    top: 120
  });
  
  var ellipse = new fabric.Ellipse({
    fill: 'blue',
    rx: 40,
    ry: 20,
    left: 150,
    top: 145,
    opacity: 0.5,
    angle: 15
  });
  
  fabric.Image.fromURL('http://www.google.com/intl/en_ALL/images/srpr/logo1w.png', function(image) {
    image.set('left', 300).set('top', 500).set('angle', -25).setCoords();
    canvas.add(image);
  });
  
  fabric.Image.fromURL('http://www.dooziedog.com/dog_breeds/pug/images/full/Pug-Puppy.jpg', function(image) {
    image.set('left', 450).set('top', 150).set('angle', -5).scale(0.3).setCoords();
    canvas.add(image);
  });

  canvas.add(rect).add(circle).add(ellipse.scale(2));

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
  
  document.getElementById('commands').onclick = function(ev) {
    ev.preventDefault();
    
    var className = ev.target.className,
        left = fabric.util.getRandomInt(100, 500),
        top = fabric.util.getRandomInt(100, 500);
    
    switch (className) {
      case 'rect':
        canvas.add(new fabric.Rect({ left: left, top: top, fill: 'rgb(255,0,0)', width: 50, height: 50, opacity: 0.8 }));
        break;
        
      case 'circle':
        canvas.add(new fabric.Circle({ left: left, top: top, fill: 'rgb(0,0,255)', radius: 50, opacity: 0.8 }));
        break;
      
      case 'triangle':
        canvas.add(new fabric.Triangle({ left: left, top: top, fill: 'rgb(0,255,0)', width: 50, height: 50, opacity: 0.8 }));
    }
  };

  loadSVGFromURL('assets/1.svg', function(objects) {
    var o = objects[0];
    o.set('left', 250).set('top', 300).setCoords();
    canvas.add(o)
  });
  
  
  loadSVGFromURL('assets/2.svg', function(objects) {
    var o = objects[0];
    o.set('left', 650).set('top', 380).setCoords();
    canvas.add(o)
  });

  /*
  loadSVGFromURL('assets/3.svg', function(objects, options) {
    var pathGroup = new fabric.PathGroup(objects, options);
    pathGroup.set('left', 550).set('top', 300).set('angle', 20).setCoords();
    canvas.add(pathGroup);
  });
  
  loadSVGFromURL('assets/5.svg', function(objects, options) {
    var pathGroup = new fabric.PathGroup(objects, options);
    pathGroup.set('left', 800).set('top', 200).set('angle', -3).setCoords();
    canvas.add(pathGroup);
  });
  */
  
})();