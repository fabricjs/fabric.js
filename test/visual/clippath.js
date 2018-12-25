(function() {
  fabric.enableGLFiltering = false;
  fabric.isWebglSupported = false;
  fabric.Object.prototype.objectCaching = true;
  var visualTestLoop;
  if (fabric.isLikelyNode) {
    visualTestLoop = global.visualTestLoop;
  }
  else {
    visualTestLoop = window.visualTestLoop;
  }
  var fabricCanvas = this.canvas = new fabric.Canvas(null, {
    enableRetinaScaling: false, renderOnAddRemove: false, width: 200, height: 200,
  });

  var tests = [];

  function clipping0(canvas, callback) {
    var clipPath = new fabric.Circle({ radius: 100, strokeWidth: 0, top: -10, left: -10 });
    var obj = new fabric.Rect({ top: 0, left: 0, strokeWidth: 0, width: 200, height: 200, fill: 'rgba(0,255,0,0.5)'});
    obj.clipPath = clipPath;
    canvas.add(obj);
    canvas.renderAll();
    callback(canvas.lowerCanvasEl);
  }

  tests.push({
    test: 'Clip a rect with a circle, no zoom',
    code: clipping0,
    golden: 'clipping0.png',
    newModule: 'Clipping shapes',
    percentage: 0.06,
  });

  function clipping01(canvas, callback) {
    var clipPath = new fabric.Circle({ radius: 50, strokeWidth: 40, top: -50, left: -50, fill: 'transparent' });
    var obj = new fabric.Rect({ top: 0, left: 0, strokeWidth: 0, width: 200, height: 200, fill: 'rgba(0,255,0,0.5)'});
    obj.clipPath = clipPath;
    canvas.add(obj);
    canvas.renderAll();
    callback(canvas.lowerCanvasEl);
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
    canvas.renderAll();
    callback(canvas.lowerCanvasEl);
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
    canvas.renderAll();
    callback(canvas.lowerCanvasEl);
  }

  tests.push({
    test: 'Clip a group with a circle',
    code: clipping2,
    golden: 'clipping2.png',
    percentage: 0.06,
  });

  // function clipping3(canvas, callback) {
  //   var clipPath = new fabric.Circle({ radius: 100, top: -100, left: -100 });
  //   var small = new fabric.Circle({ radius: 50, top: -50, left: -50 });
  //   var small2 = new fabric.Rect({ width: 30, height: 30, top: -50, left: -50 });
  //   var group = new fabric.Group([
  //     new fabric.Rect({ strokeWidth: 0, width: 100, height: 100, fill: 'red', clipPath: small }),
  //     new fabric.Rect({ strokeWidth: 0, width: 100, height: 100, fill: 'yellow', left: 100 }),
  //     new fabric.Rect({ strokeWidth: 0, width: 100, height: 100, fill: 'blue', top: 100, clipPath: small2 }),
  //     new fabric.Rect({ strokeWidth: 0, width: 100, height: 100, fill: 'green', left: 100, top: 100 })
  //   ], { strokeWidth: 0 });
  //   group.clipPath = clipPath;
  //   canvas.add(group);
  //   canvas.renderAll();
  //   callback(canvas.lowerCanvasEl);
  // }

  // FIX ON NODE
  // tests.push({
  //   test: 'Isolation of clipPath of group and inner objects',
  //   code: clipping3,
  //   golden: 'clipping3.png',
  //   percentage: 0.06,
  // });

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
    canvas.renderAll();
    callback(canvas.lowerCanvasEl);
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
    canvas.renderAll();
    callback(canvas.lowerCanvasEl);
  }

  tests.push({
    test: 'ClipPath can be a group with many objects',
    code: clipping5,
    golden: 'clipping5.png',
    percentage: 0.06,
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
    canvas.renderAll();
    callback(canvas.lowerCanvasEl);
  }

  tests.push({
    test: 'ClipPath can be inverted, it will clip what is outside the clipPath',
    code: clipping6,
    golden: 'clipping6.png',
    percentage: 0.06,
  });

  // function clipping7(canvas, callback) {
  //   var clipPath = new fabric.Circle({ radius: 30, strokeWidth: 0, top: -30, left: -30, skewY: 45 });
  //   var obj1 = new fabric.Rect({ top: 0, left: 100, strokeWidth: 0, width: 100, height: 100, fill: 'rgba(0,255,0,0.8)'});
  //   var obj2 = new fabric.Rect({ top: 0, left: 0, strokeWidth: 0, width: 100, height: 100, fill: 'rgba(255,255,0,0.8)'});
  //   var obj3 = new fabric.Rect({ top: 100, left: 0, strokeWidth: 0, width: 100, height: 100, fill: 'rgba(0,255,255,0.8)'});
  //   var obj4 = new fabric.Rect({ top: 100, left: 100, strokeWidth: 0, width: 100, height: 100, fill: 'rgba(255,0,0,0.8)'});
  //   obj1.clipPath = clipPath;
  //   obj2.clipPath = clipPath;
  //   obj3.clipPath = clipPath;
  //   obj4.clipPath = clipPath;
  //   canvas.add(obj1);
  //   canvas.add(obj2);
  //   canvas.add(obj3);
  //   canvas.add(obj4);
  //   canvas.renderAll();
  //   callback(canvas.lowerCanvasEl);
  // }

  // FIX ON NODE
  // tests.push({
  //   test: 'Many Objects can share the same clipPath',
  //   code: clipping7,
  //   golden: 'clipping7.png',
  //   percentage: 0.06,
  // });

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
    canvas.renderAll();
    callback(canvas.lowerCanvasEl);
  }

  tests.push({
    test: 'an absolute positioned clipPath, shared',
    code: clipping8,
    golden: 'clipping8.png',
    percentage: 0.06,
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
    canvas.renderAll();
    callback(canvas.lowerCanvasEl);
  }

  tests.push({
    test: 'a clipPath on the canvas',
    code: clipping9,
    golden: 'clipping9.png',
    percentage: 0.06,
  });

  function clipping10(canvas, callback) {
    var jsonData = '{"version":"2.4.5","objects":[{"type":"path","version":"2.4.5","originX":"left","originY":"top","left":12.844238038518533,"top":75.97237569060775,"width":50.4,"height":25.4,"fill":"#b8d783","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":2.07,"scaleY":2.07,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","transformMatrix":null,"skewX":0,"skewY":0,"clipPath":{"type":"circle","version":"2.4.5","originX":"left","originY":"top","left":-31.1,"top":-48.7,"width":61.2,"height":61.2,"fill":"rgb(0,0,0)","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","paintFirst":"fill","globalCompositeOperation":"source-over","transformMatrix":null,"skewX":0,"skewY":0,"radius":30.6,"startAngle":0,"endAngle":6.283185307179586,"inverted":false,"absolutePositioned":false},"path":[["M",31.8,36.8],["c",-10.7,0,-25.2,6.8,-25.1,25.4],["L",57.1,62],["C",57.1,43.5,42.6,36.8,31.8,36.8],["z"]]},{"type":"circle","version":"2.4.5","originX":"left","originY":"top","left":38.95,"top":28.53,"width":25.6,"height":25.6,"fill":"#d7b047","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":2.07,"scaleY":2.07,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","transformMatrix":null,"skewX":0,"skewY":0,"clipPath":{"type":"circle","version":"2.4.5","originX":"left","originY":"top","left":-31.3,"top":-25.9,"width":61.2,"height":61.2,"fill":"rgb(0,0,0)","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","paintFirst":"fill","globalCompositeOperation":"source-over","transformMatrix":null,"skewX":0,"skewY":0,"radius":30.6,"startAngle":0,"endAngle":6.283185307179586,"inverted":false,"absolutePositioned":false},"radius":12.8,"startAngle":0,"endAngle":6.283185307179586},{"type":"circle","version":"2.4.5","originX":"left","originY":"top","left":0.1,"top":2.87,"width":61.2,"height":61.2,"fill":"transparent","stroke":"#567bde","strokeWidth":2.5,"strokeDashArray":null,"strokeLineCap":"round","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":2.06,"scaleY":2.06,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","transformMatrix":null,"skewX":0,"skewY":0,"radius":30.6,"startAngle":0,"endAngle":6.283185307179586}]}';
    canvas.loadFromJSON(jsonData, function() {
      canvas.renderAll();
      callback(canvas.lowerCanvasEl);
    });
  }

  tests.push({
    test: 'clipPath with a path on a simple elements',
    code: clipping10,
    golden: 'clipping10.png',
    percentage: 0.06,
  });

  tests.forEach(visualTestLoop(fabricCanvas, QUnit));
})();
