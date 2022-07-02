(function() {
  fabric.enableGLFiltering = false;
  fabric.isWebglSupported = false;
  var visualTestLoop;
  var getAssetName;
  if (fabric.isLikelyNode) {
    visualTestLoop = global.visualTestLoop;
    getAssetName = global.getAssetName;
  }
  else {
    visualTestLoop = window.visualTestLoop;
    getAssetName = window.getAssetName;
  }

  function svgToDataURL(svgStr) {
    var encoded = encodeURIComponent(svgStr)
      .replace(/'/g, '%27')
      .replace(/"/g, '%22');
    return 'data:image/svg+xml,' + encoded;
  }

  function toSVGCanvas(canvas, callback) {
    var svg = canvas.toSVG();
    var dataUrl = svgToDataURL(svg);
    var image = fabric.document.createElement('img');
    image.onload = function() {
      var newCanvas = fabric.util.createCanvasElement();
      newCanvas.width = canvas.width;
      newCanvas.height = canvas.height;
      newCanvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
      callback(newCanvas);
    };
    image.onerror = console.log;
    if (fabric.isLikelyNode) {
      image.src = dataUrl;
    }
    else {
      image.src = dataUrl;
    }
  }

  var tests = [];

  function clipping0(canvas, callback) {
    var clipPath = new fabric.Circle({ radius: 100, strokeWidth: 0, top: -10, left: -10 });
    var obj = new fabric.Rect({ top: 0, left: 0, strokeWidth: 0, width: 200, height: 200, fill: 'rgba(0,255,0,0.5)'});
    obj.clipPath = clipPath;
    canvas.add(obj);
    toSVGCanvas(canvas, callback);
  }

  tests.push({
    test: 'Clip a rect with a circle, no zoom',
    code: clipping0,
    golden: 'clipping0.png',
    newModule: 'Export clippaths to SVG',
    percentage: 0.06,
    beforeEachHandler: function() {
      fabric.Object.NUM_FRACTION_DIGITS = 4;
      fabric.Object.prototype.objectCaching = false;
    }
  });

  function clipping01(canvas, callback) {
    var clipPath = new fabric.Circle({ radius: 50, strokeWidth: 40, top: -50, left: -50, fill: 'transparent' });
    var obj = new fabric.Rect({ top: 0, left: 0, strokeWidth: 0, width: 200, height: 200, fill: 'rgba(0,255,0,0.5)'});
    obj.clipPath = clipPath;
    canvas.add(obj);
    toSVGCanvas(canvas, callback);
  }

  tests.push({
    test: 'A clippath ignores fill and stroke for drawing, not positioning',
    code: clipping01,
    golden: 'clipping01.png',
    percentage: 0.06,
  });

  function clipping1(canvas, callback) {
    var zoom = 20;
    canvas.setZoom(zoom);
    var clipPath = new fabric.Circle({ radius: 5, strokeWidth: 0, top: -2, left: -2 });
    var obj = new fabric.Rect({ top: 0, left: 0, strokeWidth: 0, width: 10, height: 10, fill: 'rgba(255,0,0,0.5)'});
    obj.clipPath = clipPath;
    canvas.add(obj);
    toSVGCanvas(canvas, callback);
  }

  tests.push({
    test: 'Clip a rect with a circle, with zoom',
    code: clipping1,
    golden: 'clipping1.png',
    percentage: 0.06,
  });

  function clipping2(canvas, callback) {
    var clipPath = new fabric.Circle({
      radius: 100,
      top: -100,
      left: -100
    });
    var group = new fabric.Group([
      new fabric.Rect({ strokeWidth: 0, width: 100, height: 100, fill: 'red' }),
      new fabric.Rect({ strokeWidth: 0, width: 100, height: 100, fill: 'yellow', left: 100 }),
      new fabric.Rect({ strokeWidth: 0, width: 100, height: 100, fill: 'blue', top: 100 }),
      new fabric.Rect({ strokeWidth: 0, width: 100, height: 100, fill: 'green', left: 100, top: 100 })
    ], { strokeWidth: 0 });
    group.clipPath = clipPath;
    canvas.add(group);
    toSVGCanvas(canvas, callback);
  }

  tests.push({
    test: 'Clip a group with a circle',
    code: clipping2,
    golden: 'clipping2.png',
    percentage: 0.06,
  });

  function clipping3(canvas, callback) {
    var clipPath = new fabric.Circle({ radius: 100, top: -100, left: -100 });
    var small = new fabric.Circle({ radius: 50, top: -50, left: -50 });
    var small2 = new fabric.Rect({ width: 30, height: 30, top: -50, left: -50 });
    var group = new fabric.Group([
      new fabric.Rect({ strokeWidth: 0, width: 100, height: 100, fill: 'red', clipPath: small }),
      new fabric.Rect({ strokeWidth: 0, width: 100, height: 100, fill: 'yellow', left: 100 }),
      new fabric.Rect({ strokeWidth: 0, width: 100, height: 100, fill: 'blue', top: 100, clipPath: small2 }),
      new fabric.Rect({ strokeWidth: 0, width: 100, height: 100, fill: 'green', left: 100, top: 100 })
    ], { strokeWidth: 0 });
    group.clipPath = clipPath;
    canvas.add(group);
    toSVGCanvas(canvas, callback);
  }

  tests.push({
    test: 'Isolation of clipPath of group and inner objects',
    code: clipping3,
    golden: 'clipping3.png',
    percentage: 0.06,
    disabled: false,
  });

  function clipping4(canvas, callback) {
    var clipPath = new fabric.Circle({ radius: 20, strokeWidth: 0, top: -10, left: -10, scaleX: 2, skewY: 45 });
    var obj = new fabric.Rect({ top: 0, left: 0, strokeWidth: 0, width: 200, height: 200, fill: 'rgba(0,255,0,0.5)'});
    obj.fill = new fabric.Gradient({
      type: 'linear',
      coords: {
        x1: 0,
        y1: 0,
        x2: 200,
        y2: 200,
      },
      colorStops: [
        {
          offset: 0,
          color: 'red',
        },
        {
          offset: 1,
          color: 'blue',
        }
      ]
    });
    obj.clipPath = clipPath;
    canvas.add(obj);
    toSVGCanvas(canvas, callback);
  }

  tests.push({
    test: 'ClipPath can be transformed',
    code: clipping4,
    golden: 'clipping4.png',
    percentage: 0.06,
  });

  function clipping5(canvas, callback) {
    var clipPath = new fabric.Circle({ radius: 20, strokeWidth: 0, top: -10, left: -10, scaleX: 2, skewY: 45 });
    var clipPath1 = new fabric.Circle({ radius: 15, rotate: 45, strokeWidth: 0, top: -100, left: -50, scaleX: 2, skewY: 45 });
    var clipPath2 = new fabric.Circle({ radius: 10, strokeWidth: 0, top: -20, left: -20, scaleY: 2, skewX: 45 });
    var group = new fabric.Group([clipPath, clipPath1, clipPath2]);
    var obj = new fabric.Rect({ top: 0, left: 0, strokeWidth: 0, width: 200, height: 200, fill: 'rgba(0,255,0,0.5)'});
    obj.fill = new fabric.Gradient({
      type: 'linear',
      coords: {
        x1: 0,
        y1: 0,
        x2: 200,
        y2: 200,
      },
      colorStops: [
        {
          offset: 0,
          color: 'red',
        },
        {
          offset: 1,
          color: 'blue',
        }
      ]
    });
    obj.clipPath = group;
    canvas.add(obj);
    toSVGCanvas(canvas, callback);
  }

  tests.push({
    test: 'ClipPath can be a group with many objects',
    code: clipping5,
    golden: 'clipping5.png',
    percentage: 0.06,
    disabled: false,
  });

  function clipping6(canvas, callback) {
    var clipPath = new fabric.Circle({ radius: 20, strokeWidth: 0, top: -10, left: -10, scaleX: 2, skewY: 45 });
    var clipPath1 = new fabric.Circle({ radius: 15, rotate: 45, strokeWidth: 0, top: -100, left: -50, scaleX: 2, skewY: 45 });
    var clipPath2 = new fabric.Circle({ radius: 10, strokeWidth: 0, top: -20, left: -20, scaleY: 2, skewX: 45 });
    var group = new fabric.Group([clipPath, clipPath1, clipPath2]);
    var obj = new fabric.Rect({ top: 0, left: 0, strokeWidth: 0, width: 200, height: 200, fill: 'rgba(0,255,0,0.5)'});
    obj.fill = new fabric.Gradient({
      type: 'linear',
      coords: {
        x1: 0,
        y1: 0,
        x2: 200,
        y2: 200,
      },
      colorStops: [
        {
          offset: 0,
          color: 'red',
        },
        {
          offset: 1,
          color: 'blue',
        }
      ]
    });
    obj.clipPath = group;
    group.inverted = true;
    canvas.add(obj);
    toSVGCanvas(canvas, callback);
  }

  tests.push({
    test: 'ClipPath can be inverted, it will clip what is outside the clipPath',
    code: clipping6,
    golden: 'clipping6.png',
    percentage: 0.06,
    disabled: true,
  });

  function clipping7(canvas, callback) {
    var clipPath = new fabric.Circle({ radius: 30, strokeWidth: 0, top: -30, left: -30, skewY: 45 });
    var obj1 = new fabric.Rect({ top: 0, left: 100, strokeWidth: 0, width: 100, height: 100, fill: 'rgba(0,255,0,0.8)'});
    var obj2 = new fabric.Rect({ top: 0, left: 0, strokeWidth: 0, width: 100, height: 100, fill: 'rgba(255,255,0,0.8)'});
    var obj3 = new fabric.Rect({ top: 100, left: 0, strokeWidth: 0, width: 100, height: 100, fill: 'rgba(0,255,255,0.8)'});
    var obj4 = new fabric.Rect({ top: 100, left: 100, strokeWidth: 0, width: 100, height: 100, fill: 'rgba(255,0,0,0.8)'});
    obj1.clipPath = clipPath;
    obj2.clipPath = clipPath;
    obj3.clipPath = clipPath;
    obj4.clipPath = clipPath;
    canvas.add(obj1);
    canvas.add(obj2);
    canvas.add(obj3);
    canvas.add(obj4);
    toSVGCanvas(canvas, callback);
  }

  tests.push({
    test: 'Many Objects can share the same clipPath',
    code: clipping7,
    golden: 'clipping7.png',
    percentage: 0.06,
    disabled: false,
  });

  function clipping8(canvas, callback) {
    var clipPath = new fabric.Circle({ radius: 60, strokeWidth: 0, top: 40, left: 40, absolutePositioned: true });
    var obj1 = new fabric.Rect({ top: 0, left: 100, strokeWidth: 0, width: 100, height: 100, fill: 'rgba(0,255,0,0.8)'});
    var obj2 = new fabric.Rect({ top: 0, left: 0, strokeWidth: 0, width: 100, height: 100, fill: 'rgba(255,255,0,0.8)'});
    var obj3 = new fabric.Rect({ top: 100, left: 0, strokeWidth: 0, width: 100, height: 100, fill: 'rgba(0,255,255,0.8)'});
    var obj4 = new fabric.Rect({ top: 100, left: 100, strokeWidth: 0, width: 100, height: 100, fill: 'rgba(255,0,0,0.8)'});
    obj1.clipPath = clipPath;
    obj2.clipPath = clipPath;
    obj3.clipPath = clipPath;
    canvas.add(obj1);
    canvas.add(obj2);
    canvas.add(obj3);
    canvas.add(obj4);
    toSVGCanvas(canvas, callback);
  }

  tests.push({
    test: 'an absolute positioned clipPath, shared',
    code: clipping8,
    golden: 'clipping8.png',
    percentage: 0.06,
    disabled: false,
  });

  function clipping9(canvas, callback) {
    var clipPath = new fabric.Circle({ radius: 60, strokeWidth: 0, top: 10, left: 10 });
    var obj1 = new fabric.Rect({ top: 0, left: 100, strokeWidth: 0, width: 100, height: 100, fill: 'rgba(0,255,0,0.8)'});
    var obj2 = new fabric.Rect({ top: 0, left: 0, strokeWidth: 0, width: 100, height: 100, fill: 'rgba(255,255,0,0.8)'});
    var obj3 = new fabric.Rect({ top: 100, left: 0, strokeWidth: 0, width: 100, height: 100, fill: 'rgba(0,255,255,0.8)'});
    var obj4 = new fabric.Rect({ top: 100, left: 100, strokeWidth: 0, width: 100, height: 100, fill: 'rgba(255,0,0,0.8)'});
    canvas.add(obj1);
    canvas.add(obj2);
    canvas.add(obj3);
    canvas.add(obj4);
    canvas.clipPath = clipPath;
    toSVGCanvas(canvas, callback);
  }

  tests.push({
    test: 'a clipPath on the canvas',
    code: clipping9,
    golden: 'clipping9.png',
    percentage: 0.06,
    disabled: false,
  });

  function clipping10(canvas, callback) {
    var jsonData = '{"version":"2.4.5","objects":[{"type":"path","version":"2.4.5","originX":"left","originY":"top","left":12.844238038518533,"top":75.97237569060775,"width":50.4,"height":25.4,"fill":"#b8d783","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":2.07,"scaleY":2.07,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"clipPath":{"type":"circle","version":"2.4.5","originX":"left","originY":"top","left":-31.1,"top":-48.7,"width":61.2,"height":61.2,"fill":"rgb(0,0,0)","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"radius":30.6,"startAngle":0,"endAngle":360,"inverted":false,"absolutePositioned":false},"path":[["M",31.8,36.8],["c",-10.7,0,-25.2,6.8,-25.1,25.4],["L",57.1,62],["C",57.1,43.5,42.6,36.8,31.8,36.8],["z"]]},{"type":"circle","version":"2.4.5","originX":"left","originY":"top","left":38.95,"top":28.53,"width":25.6,"height":25.6,"fill":"#d7b047","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":2.07,"scaleY":2.07,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"clipPath":{"type":"circle","version":"2.4.5","originX":"left","originY":"top","left":-31.3,"top":-25.9,"width":61.2,"height":61.2,"fill":"rgb(0,0,0)","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"radius":30.6,"startAngle":0,"endAngle":360,"inverted":false,"absolutePositioned":false},"radius":12.8,"startAngle":0,"endAngle":360},{"type":"circle","version":"2.4.5","originX":"left","originY":"top","left":0.1,"top":2.87,"width":61.2,"height":61.2,"fill":"transparent","stroke":"#567bde","strokeWidth":2.5,"strokeDashArray":null,"strokeLineCap":"round","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":2.06,"scaleY":2.06,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"radius":30.6,"startAngle":0,"endAngle":360}]}';
    canvas.loadFromJSON(jsonData).then(function() {
      toSVGCanvas(canvas, callback);
    });
  }

  tests.push({
    test: 'clipPath with a path on a simple elements',
    code: clipping10,
    golden: 'clipping10.png',
    percentage: 0.06,
  });

  function clipping11(canvas, callback) {
    var jsonData = '{"version":"2.4.5","objects":[{"type":"group","version":"2.4.5","originX":"left","originY":"top","left":-1,"top":0,"width":400,"height":400,"fill":"rgb(0,0,0)","stroke":null,"strokeWidth":0,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"objects":[{"type":"circle","version":"2.4.5","originX":"left","originY":"top","left":-618.26087,"top":-618.26087,"width":600,"height":600,"fill":"#396","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":1.73913,"scaleY":1.73913,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"clipPath":{"type":"group","version":"2.4.5","originX":"left","originY":"top","left":-50.026294,"top":-16.249678,"width":318.906599,"height":295.383789,"fill":"rgb(0,0,0)","stroke":null,"strokeWidth":0,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":0.575,"scaleY":0.575,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"objects":[{"type":"polygon","version":"2.4.5","originX":"left","originY":"top","left":-125.590179,"top":-145.137671,"width":148,"height":146,"fill":"#D8CB3F","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":1.913043,"scaleY":1.913043,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"points":[{"x":245.45,"y":333.29},{"x":313.95,"y":405.79},{"x":393.45,"y":318.29},{"x":316.95,"y":259.79}]},{"type":"polygon","version":"2.4.5","originX":"left","originY":"top","left":-145.600613,"top":-4.528975,"width":78.96,"height":78.57,"fill":"#8E8029","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":1.913043,"scaleY":1.913043,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"points":[{"x":234.99,"y":339.36},{"x":245.45,"y":333.29},{"x":313.95,"y":405.79},{"x":303.49,"y":411.86}]},{"type":"polygon","version":"2.4.5","originX":"left","originY":"top","left":-145.600613,"top":-145.137671,"width":81.96,"height":79.57,"fill":"#8E8029","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":1.913043,"scaleY":1.913043,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"points":[{"x":305.6,"y":264.97},{"x":316.95,"y":259.79},{"x":245.45,"y":333.29},{"x":234.99,"y":339.36}]},{"type":"path","version":"2.4.5","originX":"left","originY":"top","left":-152.94670044656436,"top":-106.34114919417823,"width":29.46,"height":35.71,"fill":"#D8CB3F","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":1.913043,"scaleY":1.913043,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"path":[["M",231.15,283.42],["c",1.18,2.07,2.56,4.26,4.14,6.57],["l",10.62,13.65],["c",3.39,3.94,7.17,8.01,11.29,12.14],["l",3.41,-3.41],["c",0,0,-16.5,-17.25,-26.11,-32.3],["L",231.15,283.42],["z"]]},{"type":"path","version":"2.4.5","originX":"left","originY":"top","left":-159.45329955343573,"top":-147.691894284083,"width":68.811177,"height":29.095162,"fill":"#D8CB3F","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":1.913043,"scaleY":1.913043,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"path":[["M",229.7,259.54],["c",-1.9,1.43,-2.31,3.86,-1.67,6.91],["l",0.08,0.15],["c",3.5,-2.53,11.03,-1.57,19.8,0.98],["h",0],["l",0,0],["c",20.02,5.83,46.53,19.97,46.53,19.97],["l",2.12,-3.62],["C",267.45,266.79,236.17,254.67,229.7,259.54],["z"]]}],"inverted":false,"absolutePositioned":false},"radius":300,"startAngle":0,"endAngle":360},{"type":"circle","version":"2.4.5","originX":"left","originY":"top","left":-148.695652,"top":-148.695652,"width":660,"height":660,"fill":"#900","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":1.73913,"scaleY":1.73913,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"clipPath":{"type":"group","version":"2.4.5","originX":"left","originY":"top","left":-350.026294,"top":-316.249678,"width":318.906599,"height":295.383789,"fill":"rgb(0,0,0)","stroke":null,"strokeWidth":0,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":0.575,"scaleY":0.575,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"objects":[{"type":"polygon","version":"2.4.5","originX":"left","originY":"top","left":-125.590179,"top":-145.137671,"width":148,"height":146,"fill":"#D8CB3F","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":1.913043,"scaleY":1.913043,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"points":[{"x":245.45,"y":333.29},{"x":313.95,"y":405.79},{"x":393.45,"y":318.29},{"x":316.95,"y":259.79}]},{"type":"polygon","version":"2.4.5","originX":"left","originY":"top","left":-145.600613,"top":-4.528975,"width":78.96,"height":78.57,"fill":"#8E8029","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":1.913043,"scaleY":1.913043,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"points":[{"x":234.99,"y":339.36},{"x":245.45,"y":333.29},{"x":313.95,"y":405.79},{"x":303.49,"y":411.86}]},{"type":"polygon","version":"2.4.5","originX":"left","originY":"top","left":-145.600613,"top":-145.137671,"width":81.96,"height":79.57,"fill":"#8E8029","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":1.913043,"scaleY":1.913043,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"points":[{"x":305.6,"y":264.97},{"x":316.95,"y":259.79},{"x":245.45,"y":333.29},{"x":234.99,"y":339.36}]},{"type":"path","version":"2.4.5","originX":"left","originY":"top","left":-152.94670044656436,"top":-106.34114919417823,"width":29.46,"height":35.71,"fill":"#D8CB3F","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":1.913043,"scaleY":1.913043,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"path":[["M",231.15,283.42],["c",1.18,2.07,2.56,4.26,4.14,6.57],["l",10.62,13.65],["c",3.39,3.94,7.17,8.01,11.29,12.14],["l",3.41,-3.41],["c",0,0,-16.5,-17.25,-26.11,-32.3],["L",231.15,283.42],["z"]]},{"type":"path","version":"2.4.5","originX":"left","originY":"top","left":-159.45329955343573,"top":-147.691894284083,"width":68.811177,"height":29.095162,"fill":"#D8CB3F","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":1.913043,"scaleY":1.913043,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"path":[["M",229.7,259.54],["c",-1.9,1.43,-2.31,3.86,-1.67,6.91],["l",0.08,0.15],["c",3.5,-2.53,11.03,-1.57,19.8,0.98],["h",0],["l",0,0],["c",20.02,5.83,46.53,19.97,46.53,19.97],["l",2.12,-3.62],["C",267.45,266.79,236.17,254.67,229.7,259.54],["z"]]}],"inverted":false,"absolutePositioned":false},"radius":330,"startAngle":0,"endAngle":360},{"type":"circle","version":"2.4.5","originX":"left","originY":"top","left":-183.478261,"top":-1070.434783,"width":700,"height":700,"fill":"#009","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":1.73913,"scaleY":1.73913,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"clipPath":{"type":"group","version":"2.4.5","originX":"left","originY":"top","left":-350.026294,"top":193.750322,"width":318.906599,"height":295.383789,"fill":"rgb(0,0,0)","stroke":null,"strokeWidth":0,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":0.575,"scaleY":0.575,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"objects":[{"type":"polygon","version":"2.4.5","originX":"left","originY":"top","left":-125.590179,"top":-145.137671,"width":148,"height":146,"fill":"#D8CB3F","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":1.913043,"scaleY":1.913043,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"points":[{"x":245.45,"y":333.29},{"x":313.95,"y":405.79},{"x":393.45,"y":318.29},{"x":316.95,"y":259.79}]},{"type":"polygon","version":"2.4.5","originX":"left","originY":"top","left":-145.600613,"top":-4.528975,"width":78.96,"height":78.57,"fill":"#8E8029","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":1.913043,"scaleY":1.913043,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"points":[{"x":234.99,"y":339.36},{"x":245.45,"y":333.29},{"x":313.95,"y":405.79},{"x":303.49,"y":411.86}]},{"type":"polygon","version":"2.4.5","originX":"left","originY":"top","left":-145.600613,"top":-145.137671,"width":81.96,"height":79.57,"fill":"#8E8029","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":1.913043,"scaleY":1.913043,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"points":[{"x":305.6,"y":264.97},{"x":316.95,"y":259.79},{"x":245.45,"y":333.29},{"x":234.99,"y":339.36}]},{"type":"path","version":"2.4.5","originX":"left","originY":"top","left":-152.94670044656436,"top":-106.34114919417823,"width":29.46,"height":35.71,"fill":"#D8CB3F","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":1.913043,"scaleY":1.913043,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"path":[["M",231.15,283.42],["c",1.18,2.07,2.56,4.26,4.14,6.57],["l",10.62,13.65],["c",3.39,3.94,7.17,8.01,11.29,12.14],["l",3.41,-3.41],["c",0,0,-16.5,-17.25,-26.11,-32.3],["L",231.15,283.42],["z"]]},{"type":"path","version":"2.4.5","originX":"left","originY":"top","left":-159.45329955343573,"top":-147.691894284083,"width":68.811177,"height":29.095162,"fill":"#D8CB3F","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":1.913043,"scaleY":1.913043,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"path":[["M",229.7,259.54],["c",-1.9,1.43,-2.31,3.86,-1.67,6.91],["l",0.08,0.15],["c",3.5,-2.53,11.03,-1.57,19.8,0.98],["h",0],["l",0,0],["c",20.02,5.83,46.53,19.97,46.53,19.97],["l",2.12,-3.62],["C",267.45,266.79,236.17,254.67,229.7,259.54],["z"]]}],"inverted":false,"absolutePositioned":false},"radius":350,"startAngle":0,"endAngle":360}]}]}';
    canvas.loadFromJSON(jsonData).then(function() {
      toSVGCanvas(canvas, callback);
    });
  }

  tests.push({
    test: 'clipPath made of polygons and paths',
    code: clipping11,
    golden: 'clippath-9.png',
    percentage: 0.06,
    width: 400,
    height: 400,
  });

  function clipping12(canvas, callback) {
    var jsonData = '{"version":"2.4.6","objects":[{"type":"ellipse","version":"2.4.6","left":2.5,"top":-56.5,"width":220,"height":300,"fill":{"type":"radial","coords":{"x1":110.00000000000001,"y1":110.00000000000001,"x2":110.00000000000001,"y2":110.00000000000001,"r1":0,"r2":110.00000000000001},"colorStops":[{"offset":1,"color":"rgb(0,0,255)","opacity":1},{"offset":0.6,"color":"rgb(0,153,153)","opacity":0.5},{"offset":0.3,"color":"rgb(0,0,255)","opacity":1},{"offset":0,"color":"rgb(255,0,0)","opacity":0.8}],"offsetX":0,"offsetY":0,"gradientTransform":[1,0,0,1.3636363636363635,0,0]},"scaleX":0.69,"scaleY":1.07,"skewY":-32.03,"rx":110,"ry":150}]}';
    canvas.loadFromJSON(jsonData).then(function() {
      toSVGCanvas(canvas, callback);
    });
  }

  tests.push({
    test: 'Export a radial svg with scaling',
    code: clipping12,
    golden: 'clipping12.png',
    percentage: 0.06,
    width: 220,
    height: 300,
  });

  function clipping13(canvas, callback) {
    var jsonData =  '{"version":"5.1.0","objects":[{"type":"group","version":"5.1.0","originX":"left","originY":"top","left":-28.49,"top":-28.49,"width":337.3916,"height":413.6066,"fill":"rgb(0,0,0)","stroke":null,"strokeWidth":0,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"layout":"fit-content","subTargetCheck":false,"interactive":false,"objects":[{"type":"path","version":"5.1.0","originX":"left","originY":"top","left":-55.572,"top":206.8033,"width":3.1427,"height":10.443,"fill":{"type":"linear","coords":{"x1":481.066,"y1":785.465,"x2":480.953,"y2":793.102},"colorStops":[{"offset":1,"color":"rgb(160,137,44)","opacity":1},{"offset":0.9,"color":"rgb(85,68,0)","opacity":1},{"offset":0.78,"color":"rgb(80,68,22)","opacity":1},{"offset":0.607,"color":"rgb(160,137,44)","opacity":1},{"offset":0.467,"color":"rgb(255,255,255)","opacity":1},{"offset":0.299,"color":"rgb(200,171,55)","opacity":1},{"offset":0.24,"color":"rgb(160,137,44)","opacity":1},{"offset":0.096,"color":"rgb(120,103,33)","opacity":1},{"offset":0,"color":"rgb(211,188,95)","opacity":1}],"offsetX":-439.1113425994523,"offsetY":-783.951,"gradientUnits":"pixels","gradientTransform":[-1,0,0,1,921.58,0]},"stroke":"","strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":9.32,"scaleY":10.58,"angle":-90,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"path":[["M",442.142,794.394],["L",439.55899999999997,792.934],["C",438.91499999999996,790.544,439.04699999999997,787.93,439.44599999999997,785.241],["L",442.25399999999996,783.951]]},{"type":"path","version":"5.1.0","originX":"left","originY":"top","left":-64.4041,"top":137.1995,"width":2.7626,"height":12.3327,"fill":{"type":"linear","coords":{"x1":473.934,"y1":792.821,"x2":473.822,"y2":784.005},"colorStops":[{"offset":1,"color":"rgb(211,188,95)","opacity":1},{"offset":0.904,"color":"rgb(120,103,33)","opacity":1},{"offset":0.76,"color":"rgb(160,137,44)","opacity":1},{"offset":0.701,"color":"rgb(200,171,55)","opacity":1},{"offset":0.533,"color":"rgb(255,255,255)","opacity":1},{"offset":0.393,"color":"rgb(160,137,44)","opacity":1},{"offset":0.22,"color":"rgb(80,68,22)","opacity":1},{"offset":0.1,"color":"rgb(85,68,0)","opacity":1},{"offset":0,"color":"rgb(160,137,44)","opacity":1}],"offsetX":-446.578,"offsetY":-783.115958749821,"gradientUnits":"pixels","gradientTransform":[-1,0,0,1,921.58,0]},"stroke":"","strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":9.32,"scaleY":10.58,"angle":-90,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"path":[["M",448.32,783.332],["L",448.993,785.352],["C",448.108,786.5939999999999,448.163,788.304,448.918,793.2719999999999],["L",447.758,794.842],["L",446.578,790.352],["L",446.748,784.679],["z"]]},{"type":"path","version":"5.1.0","originX":"left","originY":"top","left":-59.9006,"top":191.9376,"width":6.9652,"height":7.8907,"fill":{"type":"linear","coords":{"x1":475.081,"y1":785.381,"x2":479.3,"y2":788.975},"colorStops":[{"offset":1,"color":"rgb(120,103,33)","opacity":1},{"offset":0,"color":"rgb(200,171,55)","opacity":1}],"offsetX":-440.70594607384373,"offsetY":-783.5421461913462,"gradientUnits":"pixels","gradientTransform":[-1,0,0,1,921.58,0]},"stroke":"","strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":9.32,"scaleY":10.58,"angle":-90,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"path":[["M",447.365,784.68],["L",441.749,784.68],["C",441.15700000000004,786.55,440.937,788.423,441.24300000000005,790.295],["L",447.19500000000005,790.351],["C",447.85300000000007,788.375,447.749,786.508,447.36500000000007,784.681],["z"]]},{"type":"path","version":"5.1.0","originX":"left","originY":"top","left":1.4031,"top":190.1394,"width":7.4814,"height":6.2775,"fill":{"type":"linear","coords":{"x1":476.181,"y1":791.235,"x2":477.099,"y2":794.257},"colorStops":[{"offset":1,"color":"rgb(120,103,33)","opacity":1},{"offset":0,"color":"rgb(200,171,55)","opacity":1}],"offsetX":-440.8988611577768,"offsetY":-789.3386038208589,"gradientUnits":"pixels","gradientTransform":[-1,0,0,1,921.58,0]},"stroke":"","strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":9.32,"scaleY":10.58,"angle":-90,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"path":[["M",447.196,790.248],["C",447.593,791.74,447.809,793.388,447.75800000000004,794.731],["L",442.25500000000005,794.675],["C",441.28100000000006,792.822,441.29800000000006,791.5469999999999,441.18800000000005,790.269],["z"]]},{"type":"path","version":"5.1.0","originX":"left","originY":"top","left":-67.4486,"top":184.3337,"width":6.8373,"height":2.4714,"fill":{"type":"linear","coords":{"x1":473.32,"y1":784.06,"x2":479.896,"y2":784.06},"colorStops":[{"offset":1,"color":"rgb(200,171,55)","opacity":1},{"offset":0,"color":"rgb(120,103,33)","opacity":1}],"offsetX":-441.5216681728531,"offsetY":-782.828220356729,"gradientUnits":"pixels","gradientTransform":[-1,0,0,1,921.58,0]},"stroke":"","strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":9.32,"scaleY":10.58,"angle":-90,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"path":[["M",447.196,784.68],["C",447.97900000000004,784.25,447.911,783.818,448.151,783.3879999999999],["L",442.481,783.612],["C",442.173,783.9549999999999,441.777,784.252,441.751,784.735],["z"]]},{"type":"path","version":"5.1.0","originX":"left","originY":"top","left":55.503,"top":85.9516,"width":2.9869,"height":8.776,"fill":{"type":"linear","coords":{"x1":481.066,"y1":785.465,"x2":480.953,"y2":793.102},"colorStops":[{"offset":1,"color":"rgb(160,137,44)","opacity":1},{"offset":0.9,"color":"rgb(85,68,0)","opacity":1},{"offset":0.78,"color":"rgb(80,68,22)","opacity":1},{"offset":0.607,"color":"rgb(160,137,44)","opacity":1},{"offset":0.467,"color":"rgb(255,255,255)","opacity":1},{"offset":0.299,"color":"rgb(200,171,55)","opacity":1},{"offset":0.24,"color":"rgb(160,137,44)","opacity":1},{"offset":0.096,"color":"rgb(120,103,33)","opacity":1},{"offset":0,"color":"rgb(211,188,95)","opacity":1}],"offsetX":-228.298,"offsetY":-835.244,"gradientUnits":"pixels","gradientTransform":[0.9334,0,0,0.8563,-219.064,163.965]},"stroke":"","strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":9.32,"scaleY":10.58,"angle":90,"flipX":false,"flipY":true,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"path":[["M",228.298,844.02],["L",230.868,842.937],["C",231.468,840.889,231.345,838.652,230.972,836.35],["L",228.352,835.244]]},{"type":"circle","version":"5.1.0","originX":"left","originY":"top","left":-168.6958,"top":-206.8033,"width":4.642,"height":4.642,"fill":{"type":"radial","coords":{"x1":193.676,"y1":141.252,"x2":193.676,"y2":141.252,"r1":0,"r2":4.082},"colorStops":[{"offset":1,"color":"rgb(0,0,0)","opacity":1},{"offset":0.9689999999999999,"color":"rgb(0,0,0)","opacity":1},{"offset":0.904,"color":"rgb(236,236,236)","opacity":1},{"offset":0.8740000000000001,"color":"rgb(77,77,77)","opacity":1},{"offset":0.8370000000000001,"color":"rgb(237,237,237)","opacity":1},{"offset":0.8169999999999998,"color":"rgb(0,0,0)","opacity":1},{"offset":0,"color":"rgb(0,0,0)","opacity":1}],"offsetX":2.321,"offsetY":2.321,"gradientUnits":"pixels","gradientTransform":[0.3487,0.4048,-0.4034,0.3475,-10.56,-127.518]},"stroke":"","strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":59.8,"scaleY":59.8,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"radius":2.321,"startAngle":0,"endAngle":360},{"type":"circle","version":"5.1.0","originX":"left","originY":"top","left":-107.9658,"top":-147.8833,"width":3.578,"height":3.578,"fill":{"type":"linear","coords":{"x1":195.171,"y1":143.461,"x2":191.574,"y2":138.568},"colorStops":[{"offset":1,"color":"rgb(204,204,204)","opacity":1},{"offset":0.687,"color":"rgb(255,255,255)","opacity":1},{"offset":0,"color":"rgb(255,255,255)","opacity":1}],"offsetX":1.789,"offsetY":1.789,"gradientUnits":"pixels","gradientTransform":[0.5287,0,0,0.5287,-102.306,-74.736]},"stroke":"rgb(179,179,179)","strokeWidth":0.02,"strokeDashArray":null,"strokeLineCap":"round","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":59.8,"scaleY":59.8,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"radius":1.789,"startAngle":0,"endAngle":360},{"type":"circle","version":"5.1.0","originX":"left","originY":"top","left":-14.2958,"top":-54.2033,"width":0.46,"height":0.46,"fill":{"type":"linear","coords":{"x1":656.429,"y1":320.934,"x2":506.429,"y2":131.648},"colorStops":[{"offset":1,"color":"rgb(242,242,242)","opacity":1},{"offset":0,"color":"rgb(102,102,102)","opacity":1}],"offsetX":0.23,"offsetY":0.23,"gradientUnits":"pixels","gradientTransform":[0.0017,0,0,0.0017,-0.966,-0.368]},"stroke":"rgb(153,153,153)","strokeWidth":0,"strokeDashArray":null,"strokeLineCap":"round","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":59.8,"scaleY":59.8,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"radius":0.23,"startAngle":0,"endAngle":360}]}]}';
    canvas.loadFromJSON(jsonData).then(function() {
      toSVGCanvas(canvas, callback);
    });
  }

  tests.push({
    test: 'Export complex gradients',
    code: clipping13,
    golden: 'clipping13.png',
    percentage: 0.06,
    width: 290,
    height: 400,
  });

  function group1(canvas, callback) {
    var jsonData = '{"version":"3.1.0","objects":[{"type":"group","version":"3.1.0","left":3,"top":2,"width":250,"height":250,"scaleX":0.9,"scaleY":0.9,"opacity":0.7,"shadow":{"color":"rgba(0,0,0,0.3)","blur":10,"offsetX":10,"offsetY":10,"affectStroke":false,"nonScaling":false},"objects":[{"type":"polygon","version":"3.1.0","left":-74.5,"top":67.46,"width":148,"height":54.92,"fill":{"type":"linear","coords":{"x1":175,"y1":111.8719,"x2":175,"y2":-135.0812},"colorStops":[{"offset":1,"color":"rgb(0,38,57)","opacity":1},{"offset":0,"color":"rgb(0,46,59)","opacity":1}],"offsetX":-51,"offsetY":-192.962,"gradientTransform":[1,0,0,-1,-50,111]},"stroke":{"type":"linear","coords":{"x1":175,"y1":111.8719,"x2":175,"y2":-135.0812},"colorStops":[{"offset":1,"color":"rgb(0,38,57)","opacity":1},{"offset":0,"color":"rgb(0,46,59)","opacity":1}],"offsetX":-51,"offsetY":-192.962,"gradientTransform":[1,0,0,-1,-50,111]},"shadow":{"color":"red","blur":10,"offsetX":0,"offsetY":0,"affectStroke":false,"nonScaling":false},"points":[{"x":124.913,"y":210.751},{"x":89.063,"y":193.264},{"x":89.103,"y":193.245},{"x":89.093,"y":193.24},{"x":51,"y":211.82},{"x":124.941,"y":247.884},{"x":199,"y":211.9},{"x":160.771,"y":192.962}]},{"type":"polygon","version":"3.1.0","left":-74.41,"top":31.4,"width":74.36,"height":55.04,"fill":{"type":"radial","coords":{"x1":63.3041,"y1":235.6129,"x2":63.3041,"y2":235.6129,"r1":0,"r2":219.7985},"colorStops":[{"offset":1,"color":"rgb(20,157,145)","opacity":1},{"offset":0,"color":"rgb(0,188,133)","opacity":1}],"offsetX":-51.091,"offsetY":-156.903},"stroke":{"type":"radial","coords":{"x1":63.3041,"y1":235.6129,"x2":63.3041,"y2":235.6129,"r1":0,"r2":219.7985},"colorStops":[{"offset":1,"color":"rgb(20,157,145)","opacity":1},{"offset":0,"color":"rgb(0,188,133)","opacity":1}],"offsetX":-51.091,"offsetY":-156.903},"opacity":0.2,"points":[{"x":51.091,"y":211.945},{"x":51.091,"y":174.781},{"x":87.749,"y":156.903},{"x":125.455,"y":175.5}]},{"type":"polygon","version":"3.1.0","left":-0.89,"top":-87.38,"width":74.39,"height":118.38,"fill":{"type":"radial","coords":{"x1":186.8275,"y1":123.7814,"x2":186.8275,"y2":123.7814,"r1":0,"r2":265.5574},"colorStops":[{"offset":1,"color":"rgb(20,157,145)","opacity":1},{"offset":0,"color":"rgb(0,188,133)","opacity":1}],"offsetX":-124.611,"offsetY":-38.123,"gradientTransform":[1,0,0,-1,-50,111]},"stroke":{"type":"radial","coords":{"x1":186.8275,"y1":123.7814,"x2":186.8275,"y2":123.7814,"r1":0,"r2":265.5574},"colorStops":[{"offset":1,"color":"rgb(20,157,145)","opacity":1},{"offset":0,"color":"rgb(0,188,133)","opacity":1}],"offsetX":-124.611,"offsetY":-38.123,"gradientTransform":[1,0,0,-1,-50,111]},"points":[{"x":165.596,"y":58.995},{"x":165.596,"y":117.758},{"x":165.596,"y":117.758},{"x":165.596,"y":117.758},{"x":124.611,"y":137.737},{"x":162.301,"y":156.506},{"x":198.996,"y":138.632},{"x":198.996,"y":38.123}]},{"type":"polygon","version":"3.1.0","left":-74.4,"top":-87.41,"width":147.9,"height":173.82,"fill":{"type":"radial","coords":{"x1":118.0562,"y1":143.2378,"x2":118.0562,"y2":143.2378,"r1":0,"r2":507.5908},"colorStops":[{"offset":1,"color":"rgb(0,52,95)","opacity":1},{"offset":0,"color":"rgb(0,68,115)","opacity":1}],"offsetX":-51.096,"offsetY":-38.088,"gradientTransform":[1,0,0,-1,-50,111]},"stroke":{"type":"radial","coords":{"x1":118.0562,"y1":143.2378,"x2":118.0562,"y2":143.2378,"r1":0,"r2":507.5908},"colorStops":[{"offset":1,"color":"rgb(0,52,95)","opacity":1},{"offset":0,"color":"rgb(0,68,115)","opacity":1}],"offsetX":-51.096,"offsetY":-38.088,"gradientTransform":[1,0,0,-1,-50,111]},"points":[{"x":199,"y":211.912},{"x":199,"y":211.912},{"x":199,"y":174.746},{"x":84.498,"y":117.723},{"x":84.498,"y":58.96},{"x":51.096,"y":38.088},{"x":51.096,"y":138.597}]},{"type":"polygon","version":"3.1.0","left":-74.5,"top":-123.52,"width":147.84,"height":56.93,"fill":{"type":"linear","coords":{"x1":174.922,"y1":110.6136,"x2":174.922,"y2":-135.0903},"colorStops":[{"offset":1,"color":"rgb(0,38,57)","opacity":1},{"offset":0,"color":"rgb(0,46,59)","opacity":1}],"offsetX":-51,"offsetY":-1.985,"gradientTransform":[1,0,0,-1,-50,111]},"stroke":{"type":"linear","coords":{"x1":174.922,"y1":110.6136,"x2":174.922,"y2":-135.0903},"colorStops":[{"offset":1,"color":"rgb(0,38,57)","opacity":1},{"offset":0,"color":"rgb(0,46,59)","opacity":1}],"offsetX":-51,"offsetY":-1.985,"gradientTransform":[1,0,0,-1,-50,111]},"points":[{"x":84.396,"y":58.904},{"x":84.396,"y":58.892},{"x":124.939,"y":39.118},{"x":165.485,"y":58.892},{"x":198.844,"y":38.046},{"x":124.912,"y":1.985},{"x":51,"y":38.035},{"x":51,"y":38.067},{"x":84.368,"y":58.918}]}]}]}';
    canvas.loadFromJSON(jsonData).then(function() {
      toSVGCanvas(canvas, callback);
    });
  }

  tests.push({
    test: 'Group with opacity and shadow',
    code: group1,
    golden: 'group-svg-1.png',
    percentage: 0.06,
    width: 210,
    height: 230,
  });

  function multipleGradients(canvas, callback) {
    fabric.loadSVGFromURL(getAssetName('svg_linear_9'), function(objects) {
      var group = fabric.util.groupSVGElements(objects);
      canvas.add(group);
      toSVGCanvas(canvas, callback);
    });
  }

  tests.push({
    test: 'Multiple gradients import',
    code: multipleGradients,
    golden: 'multipleGradients.png',
    percentage: 0.06,
    width: 760,
    height: 760,
  });

  function pathWithGradientSvg(canvas, callback) {
    var pathWithGradient = new fabric.Path('M 0 0 L 0 100 L 100 100 L 100 0 Z', {
      fill: new fabric.Gradient({
        gradientUnits: 'percentage',
        coords: { x1: 0, y1: 0, x2: 0, y2: 1 },
        colorStops: [
          { offset: 0, color: 'red' },
          { offset: 1, color: 'black' }
        ]
      }),
      height: 100,
      width: 100,
      top: 0,
      left: 0
    });
    canvas.add(pathWithGradient);
    toSVGCanvas(canvas, callback);
  }

  tests.push({
    test: 'gradient should be applied to path in svg',
    code: pathWithGradientSvg,
    golden: 'pathWithGradientSvg.png',
    percentage: 0.06,
    width: 100,
    height: 100,
  });
  tests.forEach(visualTestLoop(QUnit));
})();
