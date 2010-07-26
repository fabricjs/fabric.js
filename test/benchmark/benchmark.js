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

  function addResult(title, result) {
    var el = fabric.util.getById('results');
    el.innerHTML += ('<h3 style="display:inline-block;">' + title + '</h3><p style="margin-left:1em;margin-right:1em;display:inline-block">' + result + '</p>');
  }

  this.c = new fabric.Element('test');

  var t1, t2, lim = 50, offset = 50;

  var t = new Date();
  for (var i = lim; i--; ) {
    c.add(new fabric.Rect({
      width: getRandomInt(10, 50),
      height: getRandomInt(10, 50),
      fill: '#' + getRandomColor(),
      opacity: getRandomNum(0.5, 1),
      angle: getRandomInt(0, 180),
      top: getRandomInt(0 + offset, c._oConfig.height - offset),
      left: getRandomInt(0 + offset, c._oConfig.width - offset)
    }));
    
    c.add(new fabric.Circle({
      radius: getRandomInt(10, 50),
      fill: '#' + getRandomColor(),
      opacity: getRandomNum(0.5, 1),
      top: getRandomInt(0 + offset, c._oConfig.height - offset),
      left: getRandomInt(0 + offset, c._oConfig.width - offset)
    }));
    
    c.add(new fabric.Triangle({
      width: getRandomInt(10, 50),
      height: getRandomInt(10, 50),
      fill: '#' + getRandomColor(),
      opacity: getRandomNum(0.5, 1),
      angle: getRandomInt(0, 180),
      top: getRandomInt(0 + offset, c._oConfig.height - offset),
      left: getRandomInt(0 + offset, c._oConfig.width - offset)
    }));
  }
  
  addResult('Initialization: ', (t1 = new Date() - t) + 'ms');

  t = new Date();
  for (var i = 50; i--; ) {
    c.renderAll();
  }
  
  addResult('Rendering: ', (t2 = new Date() - t) + 'ms');
  
  addResult('Total time: ', (t1 + t2) + 'ms');

  c.calcOffset();
  
})();