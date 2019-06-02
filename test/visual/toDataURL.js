(function() {
  if (fabric.isLikelyNode) {
    if (process.env.launcher === 'Firefox') {
      fabric.browserShadowBlurConstant = 0.9;
    }
    if (process.env.launcher === 'Node') {
      fabric.browserShadowBlurConstant = 1;
    }
    if (process.env.launcher === 'Chrome') {
      fabric.browserShadowBlurConstant = 1.5;
    }
    if (process.env.launcher === 'Edge') {
      fabric.browserShadowBlurConstant = 1.75;
    }
  }
  else {
    if (navigator.userAgent.indexOf('Firefox') !== -1) {
      fabric.browserShadowBlurConstant = 0.9;
    }
    if (navigator.userAgent.indexOf('Chrome') !== -1) {
      fabric.browserShadowBlurConstant = 1.5;
    }
    if (navigator.userAgent.indexOf('Edge') !== -1) {
      fabric.browserShadowBlurConstant = 1.75;
    }
  }
  fabric.enableGLFiltering = false;
  fabric.isWebglSupported = false;
  fabric.Object.prototype.objectCaching = false;
  var visualTestLoop;
  if (fabric.isLikelyNode) {
    visualTestLoop = global.visualTestLoop;
  }
  else {
    visualTestLoop = window.visualTestLoop;
  }

  var canvasWithObjects = '{"version":"2.4.6","objects":[{"type":"rect","version":"2.4.6","left":-8,"top":-11,"width":50,"height":50,"fill":{"type":"linear","coords":{"x1":0,"y1":0,"x2":50,"y2":0},"colorStops":[{"offset":0,"color":"rgb(109,67,57)","opacity":1},{"offset":1,"color":"rgb(51,167,218)","opacity":1}],"offsetX":0,"offsetY":0},"scaleX":16,"scaleY":12.18,"opacity":0.8},{"type":"circle","version":"2.4.6","left":13.11,"top":130.77,"width":100,"height":100,"fill":"#0ec6ba","scaleX":0.57,"scaleY":0.57,"opacity":0.8,"radius":50,"startAngle":0,"endAngle":6.283185307179586},{"type":"triangle","version":"2.4.6","left":361.54,"top":236.84,"width":50,"height":50,"fill":"#b99503","scaleX":1.29,"scaleY":1.29,"opacity":0.8},{"type":"rect","version":"2.4.6","left":119.83,"top":97.98,"width":50,"height":50,"fill":{"type":"linear","coords":{"x1":0,"y1":0,"x2":0,"y2":50},"colorStops":[{"offset":0,"color":"rgb(12,101,114)","opacity":1},{"offset":1,"color":"rgb(206,164,109)","opacity":1}],"offsetX":0,"offsetY":0},"scaleX":1.29,"scaleY":1.29,"opacity":0.8},{"type":"polygon","version":"2.4.6","left":511.04,"top":115.36,"width":385,"height":245,"fill":{"type":"linear","coords":{"x1":0,"y1":0,"x2":385,"y2":0},"colorStops":[{"offset":0,"color":"rgb(151,164,232)","opacity":1},{"offset":1,"color":"rgb(68,30,248)","opacity":1}],"offsetX":0,"offsetY":0},"scaleX":0.49,"scaleY":0.49,"angle":-24.56,"points":[{"x":185,"y":0},{"x":250,"y":100},{"x":385,"y":170},{"x":0,"y":245}]},{"type":"line","version":"2.4.6","left":200.83,"top":101.84,"width":150,"height":100,"stroke":"#d11594","scaleX":0.46,"scaleY":0.46,"x1":-75,"x2":75,"y1":-50,"y2":50},{"type":"triangle","version":"2.4.6","left":178.97,"top":118.55,"width":50,"height":50,"fill":"#c560ff","scaleX":1.29,"scaleY":1.29,"opacity":0.8},{"type":"circle","version":"2.4.6","left":508.12,"top":23.41,"width":100,"height":100,"fill":"#033516","scaleX":0.62,"scaleY":0.62,"opacity":0.8,"radius":50,"startAngle":0,"endAngle":6.283185307179586},{"type":"rect","version":"2.4.6","left":108.25,"top":267.7,"width":50,"height":50,"fill":"#ceada8","scaleX":1.29,"scaleY":1.29,"opacity":0.8},{"type":"circle","version":"2.4.6","left":279.26,"top":124.34,"width":100,"height":100,"fill":"#439867","scaleX":0.52,"scaleY":0.52,"opacity":0.8,"radius":50,"startAngle":0,"endAngle":6.283185307179586},{"type":"triangle","version":"2.4.6","left":178.97,"top":213.7,"width":50,"height":50,"fill":"#a84956","scaleX":1.29,"scaleY":1.29,"opacity":0.8},{"type":"line","version":"2.4.6","left":139.11,"top":162.27,"width":150,"height":100,"stroke":"#06150b","scaleX":0.49,"scaleY":0.49,"x1":-75,"x2":75,"y1":-50,"y2":50},{"type":"polygon","version":"2.4.6","left":464.73,"top":108.91,"width":385,"height":245,"fill":"#78ef2e","stroke":"#4ea2d7","strokeWidth":3,"scaleX":0.54,"scaleY":0.54,"angle":33.18,"opacity":0.84,"points":[{"x":185,"y":0},{"x":250,"y":100},{"x":385,"y":170},{"x":0,"y":245}]},{"type":"line","version":"2.4.6","left":217.54,"top":289.56,"width":150,"height":100,"stroke":"#636d31","scaleX":0.98,"scaleY":0.98,"x1":-75,"x2":75,"y1":-50,"y2":50},{"type":"triangle","version":"2.4.6","left":229.11,"top":162.27,"width":50,"height":50,"fill":"#21fdd6","scaleX":1.29,"scaleY":1.29,"opacity":0.8},{"type":"circle","version":"2.4.6","left":6.68,"top":52.98,"width":100,"height":100,"fill":"#aff4ab","scaleX":0.38,"scaleY":0.38,"opacity":0.8,"radius":50,"startAngle":0,"endAngle":6.283185307179586},{"type":"rect","version":"2.4.6","left":434.83,"top":22.12,"width":50,"height":50,"fill":"#0004f0","scaleX":1.29,"scaleY":1.29,"opacity":0.8},{"type":"circle","version":"2.4.6","left":509.4,"top":94.13,"width":100,"height":100,"fill":"#d3abcf","scaleX":0.65,"scaleY":0.65,"opacity":0.8,"radius":50,"startAngle":0,"endAngle":6.283185307179586},{"type":"triangle","version":"2.4.6","left":105.68,"top":333.27,"width":50,"height":50,"fill":"#dd30e6","scaleX":1.29,"scaleY":1.29,"opacity":0.8},{"type":"line","version":"2.4.6","left":366.69,"top":209.9,"width":150,"height":100,"stroke":"#6f48ec","scaleX":0.98,"scaleY":0.98,"x1":-75,"x2":75,"y1":-50,"y2":50},{"type":"polygon","version":"2.4.6","left":50.4,"top":138.92,"width":385,"height":245,"fill":"#e5dc30","scaleX":0.27,"scaleY":0.27,"points":[{"x":185,"y":0},{"x":250,"y":100},{"x":385,"y":170},{"x":0,"y":245}]},{"type":"line","version":"2.4.6","left":177.8,"top":20.96,"width":150,"height":100,"stroke":"#b99297","scaleX":0.62,"scaleY":0.62,"angle":93.47,"x1":-75,"x2":75,"y1":-50,"y2":50},{"type":"triangle","version":"2.4.6","left":178.97,"top":285.7,"width":50,"height":50,"fill":"#34c5c9","scaleX":1.29,"scaleY":1.29,"opacity":0.8},{"type":"circle","version":"2.4.6","left":317.83,"top":214.98,"width":100,"height":100,"fill":"#b19c03","scaleX":0.59,"scaleY":0.59,"opacity":0.8,"radius":50,"startAngle":0,"endAngle":6.283185307179586},{"type":"rect","version":"2.4.6","left":245.83,"top":231.7,"width":50,"height":50,"fill":{"type":"linear","coords":{"x1":0,"y1":0,"x2":50,"y2":0},"colorStops":[{"offset":0,"color":"rgb(166,239,249)","opacity":1},{"offset":1,"color":"rgb(179,252,126)","opacity":1}],"offsetX":0,"offsetY":0},"scaleX":1.29,"scaleY":1.29,"opacity":0.8},{"type":"circle","version":"2.4.6","left":59.4,"top":91.55,"width":100,"height":100,"fill":"#e622ed","scaleX":0.52,"scaleY":0.52,"opacity":0.8,"radius":50,"startAngle":0,"endAngle":6.283185307179586},{"type":"triangle","version":"2.4.6","left":65.83,"top":194.41,"width":50,"height":50,"fill":"#27592d","scaleX":1.29,"scaleY":1.29,"opacity":0.8},{"type":"line","version":"2.4.6","left":329.4,"top":31.12,"width":150,"height":100,"stroke":"#2aad0c","scaleX":1.29,"scaleY":1.29,"x1":-75,"x2":75,"y1":-50,"y2":50},{"type":"polygon","version":"2.4.6","left":113.09,"top":31.26,"width":385,"height":245,"fill":"#9f018a","scaleX":0.28,"scaleY":0.28,"angle":103.34,"points":[{"x":185,"y":0},{"x":250,"y":100},{"x":385,"y":170},{"x":0,"y":245}]},{"type":"polygon","version":"2.4.6","left":277.69,"top":84.15,"width":385,"height":245,"fill":{"type":"linear","coords":{"x1":0,"y1":0,"x2":385,"y2":0},"colorStops":[{"offset":0,"color":"rgb(191,3,90)","opacity":1},{"offset":1,"color":"rgb(89,41,35)","opacity":1}],"offsetX":0,"offsetY":0},"scaleX":0.55,"scaleY":0.55,"opacity":0.78,"points":[{"x":185,"y":0},{"x":250,"y":100},{"x":385,"y":170},{"x":0,"y":245}]},{"type":"rect","version":"2.4.6","left":168.68,"top":35.62,"width":50,"height":50,"fill":"#2b14e3","scaleX":1.07,"scaleY":1.07,"opacity":0.8},{"type":"circle","version":"2.4.6","left":230.4,"top":20.84,"width":100,"height":100,"fill":"#d4a8de","scaleX":1.02,"scaleY":1.02,"opacity":0.8,"radius":50,"startAngle":0,"endAngle":6.283185307179586},{"type":"triangle","version":"2.4.6","left":112.81,"top":63.77,"width":50,"height":50,"fill":"#d9df91","scaleX":0.87,"scaleY":0.87,"angle":176.42,"opacity":0.8},{"type":"line","version":"2.4.6","left":9.25,"top":181.55,"width":150,"height":100,"stroke":"#54d6b2","scaleX":0.39,"scaleY":0.39,"x1":-75,"x2":75,"y1":-50,"y2":50},{"type":"polygon","version":"2.4.6","left":156.91,"top":335.97,"width":385,"height":245,"fill":{"type":"linear","coords":{"x1":0,"y1":0,"x2":385,"y2":245},"colorStops":[{"offset":0,"color":"rgb(227,86,178)","opacity":1},{"offset":1,"color":"rgb(229,227,6)","opacity":1}],"offsetX":0,"offsetY":0},"scaleX":0.39,"scaleY":0.39,"angle":142.19,"points":[{"x":185,"y":0},{"x":250,"y":100},{"x":385,"y":170},{"x":0,"y":245}]},{"type":"triangle","version":"2.4.6","left":6.68,"top":208.56,"width":50,"height":50,"fill":"#8eab91","scaleX":1.29,"scaleY":1.29,"opacity":0.8},{"type":"circle","version":"2.4.6","left":123.68,"top":191.2,"width":100,"height":100,"fill":"#85ddb5","scaleX":0.69,"scaleY":0.69,"opacity":0.8,"radius":50,"startAngle":0,"endAngle":6.283185307179586},{"type":"rect","version":"2.4.6","left":7.97,"top":18.27,"width":50,"height":50,"fill":"#794b0d","scaleX":0.63,"scaleY":0.63,"opacity":0.8},{"type":"text","version":"2.4.6","left":383.24,"top":307.83,"width":598.13,"height":359.79,"fill":"#96062c","scaleX":0.32,"scaleY":0.32,"angle":9,"text":"Lorem ipsum dolor sit amet,\\nconsectetur adipisicing elit,\\nsed do eiusmod tempor incididunt\\nut labore et dolore magna aliqua.\\nUt enim ad minim veniam,\\nquis nostrud exercitation ullamco\\nlaboris nisi ut ","fontWeight":"","fontFamily":"helvetica","styles":{}},{"type":"text","version":"2.4.6","left":617.41,"top":29.52,"width":598.13,"height":307.36,"fill":"#67586c","scaleX":0.23,"scaleY":0.23,"angle":-7,"text":"Lorem ipsum dolor sit amet,\\nconsectetur adipisicing elit,\\nsed do eiusmod tempor incididunt\\nut labore et dolore magna aliqua.\\nUt enim ad minim veniam,\\nquis nostrud exer","fontWeight":"","fontFamily":"helvetica","styles":{}},{"type":"rect","version":"2.4.6","left":238.11,"top":355.13,"width":50,"height":50,"fill":"#f1750c","scaleX":1.29,"scaleY":1.29,"opacity":0.8},{"type":"circle","version":"2.4.6","left":310.11,"top":299.2,"width":100,"height":100,"fill":"#b091e0","scaleX":0.53,"scaleY":0.53,"opacity":0.8,"radius":50,"startAngle":0,"endAngle":6.283185307179586},{"type":"text","version":"2.4.6","left":24.92,"top":399.49,"width":598.13,"height":202.5,"fill":"#1a11a8","scaleX":0.28,"scaleY":0.24,"angle":8,"text":"Lorem ipsum dolor sit amet,\\nconsectetur adipisicing elit,\\nsed do eiusmod tempor incididunt\\nut labore et","fontWeight":"","fontFamily":"helvetica","styles":{}},{"type":"triangle","version":"2.4.6","left":186.68,"top":357.7,"width":50,"height":50,"fill":"#312567","scaleX":0.63,"scaleY":1.29,"opacity":0.8},{"type":"group","version":"2.4.6","left":583.32,"top":203.28,"width":151,"height":151,"scaleX":0.41,"scaleY":0.41,"angle":7,"objects":[{"type":"path","version":"2.4.6","left":-75.68,"top":-75.56,"width":150.01,"height":150.01,"fill":"#5E0000","path":[["M",121.32,0],["L",44.58,0],["C",36.67,0,29.5,3.22,24.31,8.41],["c",-5.19,5.19,-8.41,12.37,-8.41,20.28],["c",0,15.82,12.87,28.69,28.69,28.69],["c",0,0,4.4,0,7.48,0],["C",36.66,72.78,8.4,101.04,8.4,101.04],["C",2.98,106.45,0,113.66,0,121.32],["c",0,7.66,2.98,14.87,8.4,20.29],["l",0,0],["c",5.42,5.42,12.62,8.4,20.28,8.4],["c",7.66,0,14.87,-2.98,20.29,-8.4],["c",0,0,28.26,-28.25,43.66,-43.66],["c",0,3.08,0,7.48,0,7.48],["c",0,15.82,12.87,28.69,28.69,28.69],["c",7.66,0,14.87,-2.99,20.29,-8.4],["c",5.42,-5.42,8.4,-12.62,8.4,-20.28],["l",0,-76.74],["c",0,-7.66,-2.98,-14.87,-8.4,-20.29],["C",136.19,2.98,128.98,0,121.32,0],["z"]]},{"type":"path","version":"2.4.6","left":-68.09,"top":-67.97,"width":134.83,"height":134.83,"fill":"#961B1E","path":[["M",142.42,105.43],["V",28.69],["c",0,-11.65,-9.45,-21.1,-21.1,-21.1],["H",44.58],["c",-11.65,0,-21.1,9.45,-21.1,21.1],["s",9.45,21.1,21.1,21.1],["h",25.79],["L",13.77,106.4],["c",-8.24,8.24,-8.24,21.6,0,29.84],["c",8.24,8.24,21.6,8.24,29.84,0],["l",56.61,-56.61],["v",25.79],["c",0,11.65,9.45,21.1,21.1,21.1],["C",132.97,126.53,142.42,117.08,142.42,105.43],["z"]]}]},{"type":"rect","version":"2.4.6","left":538.98,"top":308.2,"width":50,"height":50,"fill":"#f75873","scaleX":0.92,"scaleY":0.92,"opacity":0.8},{"type":"circle","version":"2.4.6","left":644.41,"top":153.27,"width":100,"height":100,"fill":"#66df30","scaleX":0.83,"scaleY":0.83,"opacity":0.8,"radius":50,"startAngle":0,"endAngle":6.283185307179586},{"type":"triangle","version":"2.4.6","left":297.26,"top":378.27,"width":50,"height":50,"fill":"#85d3e3","scaleX":1.29,"scaleY":1.29,"opacity":0.8},{"type":"triangle","version":"2.4.6","left":587.83,"top":267.7,"width":50,"height":50,"fill":"#99a934","scaleX":1.29,"scaleY":1.29,"opacity":0.8},{"type":"rect","version":"2.4.6","left":205.97,"top":430.99,"width":50,"height":50,"fill":"#d1ab33","scaleX":1.42,"scaleY":1.42,"opacity":0.8},{"type":"rect","version":"2.4.6","left":718.98,"top":88.98,"width":50,"height":50,"fill":"#649cf2","scaleX":1.29,"scaleY":1.29,"opacity":0.8},{"type":"circle","version":"2.4.6","left":63.25,"top":450.27,"width":100,"height":100,"fill":"#787bd8","scaleX":0.74,"scaleY":0.74,"opacity":0.8,"radius":50,"startAngle":0,"endAngle":6.283185307179586},{"type":"rect","version":"2.4.6","left":571.12,"top":362.84,"width":50,"height":50,"fill":"#1a7f06","scaleX":1.29,"scaleY":1.29,"opacity":0.8},{"type":"circle","version":"2.4.6","left":285.69,"top":450.27,"width":100,"height":100,"fill":{"type":"linear","coords":{"x1":0,"y1":0,"x2":0,"y2":100},"colorStops":[{"offset":0,"color":"rgb(103,118,26)","opacity":1},{"offset":1,"color":"rgb(164,77,104)","opacity":1}],"offsetX":0,"offsetY":0},"scaleX":0.67,"scaleY":0.67,"opacity":0.8,"radius":50,"startAngle":0,"endAngle":6.283185307179586},{"type":"polygon","version":"2.4.6","left":328.11,"top":433.39,"width":385,"height":245,"fill":"#ee833f","scaleX":0.43,"scaleY":0.43,"points":[{"x":185,"y":0},{"x":250,"y":100},{"x":385,"y":170},{"x":0,"y":245}]},{"type":"circle","version":"2.4.6","left":446.4,"top":432.27,"width":100,"height":100,"fill":"#4ac9fa","scaleX":0.5,"scaleY":0.5,"opacity":0.8,"radius":50,"startAngle":0,"endAngle":6.283185307179586},{"type":"textbox","version":"2.4.6","left":16.97,"top":538.99,"width":674.96,"height":48.82,"fill":"#722561","scaleX":1.19,"scaleY":1.19,"text":"Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut la","fontSize":20,"fontWeight":"","fontFamily":"helvetica","minWidth":20,"styles":{}},{"type":"rect","version":"2.4.6","left":500.4,"top":470.84,"width":50,"height":50,"fill":"#a51907","scaleX":1.29,"scaleY":1.29,"opacity":0.8},{"type":"circle","version":"2.4.6","left":652.12,"top":238.13,"width":100,"height":100,"fill":{"type":"linear","coords":{"x1":0,"y1":0,"x2":100,"y2":0},"colorStops":[{"offset":0,"color":"rgb(29,69,103)","opacity":1},{"offset":1,"color":"rgb(206,159,161)","opacity":1}],"offsetX":0,"offsetY":0},"scaleX":1.29,"scaleY":1.29,"opacity":0.8,"radius":50,"startAngle":0,"endAngle":6.283185307179586},{"type":"triangle","version":"2.4.6","left":727.98,"top":167.41,"width":50,"height":50,"fill":"#9f2237","scaleX":1.29,"scaleY":1.29,"opacity":0.8},{"type":"polygon","version":"2.4.6","left":568.55,"top":414.95,"width":385,"height":245,"fill":"#ba0975","scaleX":0.48,"scaleY":0.48,"points":[{"x":185,"y":0},{"x":250,"y":100},{"x":385,"y":170},{"x":0,"y":245}]},{"type":"circle","version":"2.4.6","left":558.26,"top":433.56,"width":100,"height":100,"fill":"#869412","scaleX":0.46,"scaleY":0.46,"opacity":0.8,"radius":50,"startAngle":0,"endAngle":6.283185307179586},{"type":"circle","version":"2.4.6","left":675.26,"top":377.63,"width":100,"height":100,"fill":"#1a6248","scaleX":0.75,"scaleY":0.75,"opacity":0.8,"radius":50,"startAngle":0,"endAngle":6.283185307179586},{"type":"triangle","version":"2.4.6","left":711.26,"top":472.13,"width":50,"height":50,"fill":"#6acbfa","scaleX":1.29,"scaleY":1.29,"opacity":0.8}]}';

  var tests = [];

  function toDataURL1(canvas, callback) {
    var text = new fabric.Text('Hi i m an image',
      { strokeWidth: 2, stroke: 'red', fontSize: 60, objectCaching: false }
    );
    callback(text.toDataURL());
  }

  tests.push({
    test: 'Text to DataURL',
    code: toDataURL1,
    golden: 'dataurl1.png',
    newModule: 'DataURL exports',
    percentage: 0.09,
  });

  function toDataURL2(canvas, callback) {
    var text = new fabric.Text('Hi i m an image',
      { strokeWidth: 0, fontSize: 60, objectCaching: false }
    );
    var shadow = new fabric.Shadow({
      color: 'purple',
      offsetX: 0,
      offsetY: 0,
      blur: 6,
    });
    text.shadow = shadow;
    callback(text.toDataURL());
  }

  tests.push({
    test: 'Text to DataURL with shadow no offset',
    code: toDataURL2,
    golden: 'dataurl2.png',
    percentage: 0.09,
  });

  function toDataURL3(canvas, callback) {
    var text = new fabric.Text('Hi i m an image',
      { strokeWidth: 0, fontSize: 60, objectCaching: false }
    );
    var shadow = new fabric.Shadow({
      color: 'purple',
      offsetX: -30,
      offsetY: +40,
      blur: 10,
    });
    text.shadow = shadow;
    callback(text.toDataURL());
  }

  tests.push({
    test: 'Text to DataURL with shadow large offset',
    code: toDataURL3,
    golden: 'dataurl3.png',
    percentage: 0.09,
  });

  function toDataURL31(canvas, callback) {
    var text = new fabric.Text('Hi i m an image',
      { strokeWidth: 0, fontSize: 60, objectCaching: false, flipX: true }
    );
    callback(text.toDataURL());
  }

  tests.push({
    test: 'a flipped text',
    code: toDataURL31,
    golden: 'dataurl31.png',
    percentage: 0.09,
  });
  //
  function toDataURL4(fabricCanvas, callback) {
    fabricCanvas.loadFromJSON(canvasWithObjects, function() {
      var dataUrl = fabricCanvas.toDataURL();
      callback(dataUrl);
    });
  }

  tests.push({
    test: 'Canvas toDataURL with objects',
    code: toDataURL4,
    golden: 'dataurl4.png',
    percentage: 0.09,
    width: 800,
    height: 600,
  });

  function toDataURL5(fabricCanvas, callback) {
    fabricCanvas.loadFromJSON(canvasWithObjects, function() {
      var dataurl = fabricCanvas.toDataURL({ multiplier: 0.3 });
      callback(dataurl);
    });
  }

  tests.push({
    test: 'Canvas toDataURL with objects and multiplier 0.3',
    code: toDataURL5,
    golden: 'dataurl5.png',
    percentage: 0.09,
    width: 800,
    height: 600,
  });

  function toDataURL6(fabricCanvas, callback) {
    // make so everything is smaller
    fabricCanvas.setZoom(0.1);
    fabricCanvas.loadFromJSON(canvasWithObjects, function() {
      var dataUrl = fabricCanvas.toDataURL({ multiplier: 4 });
      callback(dataUrl);
    });
  }

  tests.push({
    test: 'Canvas toDataURL with objects and multiplier 4',
    code: toDataURL6,
    golden: 'dataurl6.png',
    percentage: 0.09,
    width: 80,
    height: 60,
  });

  function toDataURL7(fabricCanvas, callback) {
    // make so everything is smaller
    fabricCanvas.setZoom(0.1);
    fabricCanvas.loadFromJSON(canvasWithObjects, function() {
      var dataUrl = fabricCanvas.toDataURL({ multiplier: 12, left: 20, top: 20, width: 20, height: 20 });
      callback(dataUrl);
    });
  }

  tests.push({
    test: 'Canvas toDataURL with objects and cropping and high multiplier',
    code: toDataURL7,
    golden: 'dataurl7.png',
    percentage: 0.09,
    width: 80,
    height: 60,
  });

  function toDataURL8(fabricCanvas, callback) {
    // make so everything is smaller
    fabricCanvas.loadFromJSON(canvasWithObjects, function() {
      var dataUrl = fabricCanvas.toDataURL({ multiplier: 1.2, left: 200, top: 200, width: 200, height: 200 });
      callback(dataUrl);
    });
  }

  tests.push({
    test: 'Canvas toDataURL with objects and cropping and high multiplier',
    code: toDataURL8,
    // use the same golden on purpose
    golden: 'dataurl7.png',
    percentage: 0.09,
    width: 800,
    height: 600,
  });

  function toDataURL9(fabricCanvas, callback) {
    // make so everything is smaller
    fabricCanvas.setZoom(3);
    fabricCanvas.loadFromJSON(canvasWithObjects, function() {
      var dataUrl = fabricCanvas.toDataURL({ multiplier: 0.4, left: 600, top: 600, width: 600, height: 600 });
      callback(dataUrl);
    });
  }

  tests.push({
    test: 'Canvas toDataURL with objects and cropping and small multiplier',
    code: toDataURL9,
    // use the same golden on purpose
    golden: 'dataurl7.png',
    percentage: 0.09,
    width: 2400,
    height: 1800,
  });

  function toDataURL10(fabricCanvas, callback) {
    fabricCanvas.enableRetinaScaling = true;
    fabric.devicePixelRatio = 2;
    fabricCanvas.setDimensions({
      width: 300,
      height: 300,
    });
    var shadow = {
      color: 'rgba(0,0,0,0.6)',
      blur: 1,
      offsetX: 50,
      offsetY: 10,
      opacity: 0.6,
    };

    var rect = new fabric.Rect({
      left: 10,
      top: 10,
      fill:  '#FF0000',
      stroke: '#000',
      width: 100,
      height: 100,
      strokeWidth: 10,
      opacity: .8
    });

    rect.setShadow(shadow);
    fabricCanvas.add(rect);
    var dataUrl = fabricCanvas.toDataURL({ multiplier: 0.5 });
    callback(dataUrl);
  }

  tests.push({
    test: 'shadow offsets dataUrl with retina',
    code: toDataURL10,
    // use the same golden on purpose
    golden: 'dataurl10.png',
    percentage: 0.09,
    width: 300,
    height: 300,
  });

  function toDataURL11(fabricCanvas, callback) {
    fabricCanvas.enableRetinaScaling = false;
    fabric.devicePixelRatio = 1;
    fabricCanvas.setDimensions({
      width: 300,
      height: 300,
    });
    var shadow = {
      color: 'rgba(0,0,0,0.6)',
      blur: 1,
      offsetX: 50,
      offsetY: 10,
      opacity: 0.6,
    };

    var rect = new fabric.Rect({
      left: 10,
      top: 10,
      fill:  '#FF0000',
      stroke: '#000',
      width: 100,
      height: 100,
      strokeWidth: 10,
      opacity: .8
    });

    rect.setShadow(shadow);
    fabricCanvas.add(rect);
    var dataUrl = fabricCanvas.toDataURL({ multiplier: 0.5 });
    callback(dataUrl);
  }

  tests.push({
    test: 'shadow offsets dataUrl without retina',
    code: toDataURL11,
    // use the same golden on purpose
    golden: 'dataurl10.png',
    percentage: 0.09,
    width: 300,
    height: 300,
  });

  function toDataURL12(fabricCanvas, callback) {
    fabricCanvas.enableRetinaScaling = 2;
    fabric.devicePixelRatio = 2;
    fabricCanvas.setDimensions({
      width: 300,
      height: 300,
    });
    var shadow = {
      color: 'rgba(0,0,0,0.6)',
      blur: 1,
      offsetX: 50,
      offsetY: 10,
      opacity: 0.6,
    };

    var rect = new fabric.Rect({
      left: 10,
      top: 10,
      fill:  '#FF0000',
      stroke: '#000',
      width: 100,
      height: 100,
      strokeWidth: 10,
      opacity: .8
    });

    rect.setShadow(shadow);
    fabricCanvas.add(rect);
    var dataUrl = fabricCanvas.toDataURL({ multiplier: 0.5, enableRetinaScaling: true });
    fabric.devicePixelRatio = 1;
    callback(dataUrl);
  }

  tests.push({
    test: 'shadow offsets dataUrl with retina and retinaScaling enable in export',
    code: toDataURL12,
    // use the same golden on purpose
    golden: 'dataurl12.png',
    percentage: 0.09,
    width: 300,
    height: 300,
  });


  function testWrapper(test) {
    var actualTest = test.code;
    test.code = function(fabricCanvas, callback) {
      actualTest(fabricCanvas, function(dataURL) {
        var img = fabric.document.createElement('img');
        var canvas = fabric.document.createElement('canvas');
        img.onload = function() {
          canvas.width = img.width;
          canvas.height = img.height;
          canvas.getContext('2d').drawImage(img, 0, 0);
          callback(canvas);
        };
        img.src = dataURL;
      });
    };
    visualTestLoop(QUnit)(test);
  }

  tests.forEach(testWrapper);
})();
