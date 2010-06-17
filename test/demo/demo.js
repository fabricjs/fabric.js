(function(){
  
  var el = document.createElement('canvas');
  el.id = 'canvas';
  el.width = 800;
  el.height = 600;
  document.body.appendChild(el);

  var canvas = this.canvas = new Canvas.Element('canvas');

  var rect = new Canvas.Rect({
    fill: "red",
    left: 100,
    top: 100,
    width: 50,
    height: 60
  });

  var circle = new Canvas.Circle({
    fill: 'green',
    radius: 30,
    left: 70,
    top: 120
  });

  canvas.add(rect).add(circle);

  function loadSVGFromURL(url, callback) {
    var r = new Ajax.Request(url, {
      method: 'get',
      onComplete: function(r) {
        var xml = r.responseXML;
        if (!xml) return;
        var doc = xml.documentElement;
        if (!doc) return;
        Canvas.parseSVGDocument(doc, callback);
      }
    })
  }

  /*loadSVGFromURL('assets/1.svg', function(objects) {
    var o = objects[0];
    o.set('left', 250).set('top', 300).setCoords();
    canvas.add(o)
  });

  loadSVGFromURL('assets/2.svg', function(objects) {
    var o = objects[0];
    o.set('left', 350).set('top', 80).setCoords();
    canvas.add(o)
  });

  loadSVGFromURL('assets/3.svg', function(objects, options) {
    var pathGroup = new Canvas.PathGroup(objects, options);
    pathGroup.set('left', 550).set('top', 300).set('angle', 20).setCoords();
    canvas.add(pathGroup);
  });*/
  
  Canvas.Image.fromURL('http://www.google.com/intl/en_ALL/images/srpr/logo1w.png', function(image) {
    image.set('left', 300).set('top', 500).set('angle', -25).setCoords();
    canvas.add(image);
  });
  
  /*loadSVGFromURL('assets/5.svg', function(objects, options) {
    var pathGroup = new Canvas.PathGroup(objects, options);
    pathGroup.set('left', 800).set('top', 200).set('angle', -3).setCoords();
    canvas.add(pathGroup);
  });*/
  
})();