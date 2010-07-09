(function(){
  this.canvas = new fabric.Element('testee0');
  
  canvas.add(new fabric.Line([10,10,40,50], { stroke: 'red' }));
  canvas.add(new fabric.Line([70,80,110,110], { stroke: 'green', strokeWidth: 7 }));
  canvas.add(new fabric.Line([120,40,50,170], { stroke: 'blue', strokeWidth: 3 }));
})();


(function(){
  this.canvas = new fabric.Element('testee1');
  
  var width = height = 40;
  
  canvas.add(new fabric.Rect({
    fill: 'red', left: 50, top: 50, width: width, height: height
  }));
  canvas.add(new fabric.Rect({
    fill: 'green', left: 100, top: 100, width: width, height: height
  }));
  canvas.add(new fabric.Rect({
    fill: 'blue', left:  150, top: 150, width: width, height: height
  }));
})();


(function(){
  this.canvas2 = new fabric.Element('testee2');
  
  var radius = 25;
  
  canvas2.add(new fabric.Circle({
    fill: 'red', left: 100, top: 100, radius: radius
  }));
  canvas2.add(new fabric.Circle({
    fill: 'green', left: 50, top: 50, radius: radius
  }));
  canvas2.add(new fabric.Circle({
    fill: 'blue', left: 150, top: 150, radius: radius
  }));
})();


(function(){
  this.canvas3 = new fabric.Element('testee3');
  
  var rx = 20,
      ry = 40;
  
  canvas3.add(new fabric.Ellipse({
    fill: 'red', left: 100, top: 100, rx: rx, ry: ry
  }));
  canvas3.add(new fabric.Ellipse({
    fill: 'green', left: 50, top: 50, rx: rx, ry: ry
  }));
  canvas3.add(new fabric.Ellipse({
    fill: 'blue', left: 150, top: 150, rx: rx, ry: ry
  }));
})();


(function(){
  this.canvas4 = new fabric.Element('testee4');
  
  var points = [
    {x:10,y:10},
    {x:15,y:15},
    {x:30,y:15},
    {x:40,y:10},
    {x:30,y:0},
    {x:-10,y:-10}
  ];
  
  canvas4.add(new fabric.Polygon(points, {
    fill: 'red', left: 100, top: 100
  }));
  canvas4.add(new fabric.Polygon(points, {
    fill: 'green', left: 50, top: 50
  }));
  canvas4.add(new fabric.Polygon(points, {
    fill: 'blue', left: 150, top: 150
  }));
})();


(function(){
  this.canvas5 = new fabric.Element('testee5');
  
  var points = [
    {x:10,y:10},
    {x:15,y:15},
    {x:30,y:15},
    {x:40,y:10},
    {x:30,y:0},
    {x:-10,y:-10}
  ];
  
  canvas5.add(new fabric.Polyline(points, {
    stroke: 'red', left: 100, top: 100
  }));
  canvas5.add(new fabric.Polyline(points, {
    stroke: 'green', left: 50, top: 50
  }));
  canvas5.add(new fabric.Polyline(points, {
    stroke: 'blue', left: 150, top: 150
  }));
})();


// using onload to ensure all images are loaded
window.onload = function() {
  
  var benchmarks = window.__benchmarks = [];
  var imgEls = document.getElementsByTagName('img');
  
  fabric.base.toArray(imgEls).forEach(function(imgElement, i) {
    if (typeof Ajax == 'undefined') return;
    new Ajax.Request('W3C_SVG_12_TinyTestSuite_beta/svg/' + imgElement.alt + '.svg', {
      method: 'get',
      onSuccess: function(r) {
        if (!r) return;
        if (!r.responseXML) return;
        var doc = r.responseXML.documentElement;
        if (!doc) return;
        
        var startTime = new Date();
        
        fabric.parseSVGDocument(doc, function(elements) {
          var dimensions = {
            width: imgElement.width,
            height: imgElement.height
          };
          var canvasElement = fabric.base.makeElement('canvas', dimensions);
          fabric.base.setStyle(canvasElement, {
            width: dimensions.width + 'px',
            height: dimensions.height + 'px'
          });
          imgElement.insert({
            after: canvasElement
          });
          var oCanvas = window.__canvas = new fabric.Element(canvasElement);
          elements.forEach(function(o) {
            ofabric.add(o);
          })
        });
        
        benchmarks.push(new Date() - startTime);
      }
    })
  });
};