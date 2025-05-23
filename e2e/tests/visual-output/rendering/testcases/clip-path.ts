import { renderTestType } from '../../../types';

export const clipPathRenderingTests: renderTestType[] = [
  {
    title: 'ClipPath - Clip a rect with a circle, no zoom',
    golden: 'clipping0.png',
    percentage: 0.06,
    size: [200, 200],
    async renderFunction(canvas, fabric) {
      const clipPath = new fabric.Circle({
        radius: 100,
        strokeWidth: 0,
        top: -10,
        left: -10,
      });

      const obj = new fabric.Rect({
        top: 0,
        left: 0,
        strokeWidth: 0,
        width: 200,
        height: 200,
        fill: 'rgba(0,255,0,0.5)',
      });

      obj.clipPath = clipPath;
      canvas.add(obj);
    },
  },

  {
    title: 'A clippath ignores fill and stroke for drawing, not positioning',
    golden: 'clipping01.png',
    percentage: 0.06,
    size: [200, 200],
    async renderFunction(canvas, fabric) {
      const clipPath = new fabric.Circle({
        radius: 50,
        strokeWidth: 40,
        top: -50,
        left: -50,
        fill: 'transparent',
      });

      const obj = new fabric.Rect({
        top: 0,
        left: 0,
        strokeWidth: 0,
        width: 200,
        height: 200,
        fill: 'rgba(0,255,0,0.5)',
      });

      obj.clipPath = clipPath;
      canvas.add(obj);
    },
  },

  {
    title: 'Falsy values for fill are handled',
    golden: 'clipping01.png',
    percentage: 0.06,
    size: [200, 200],
    async renderFunction(canvas, fabric) {
      const clipPath = new fabric.Circle({
        radius: 50,
        strokeWidth: 40,
        top: -50,
        left: -50,
        fill: '',
      });

      const obj = new fabric.Rect({
        top: 0,
        left: 0,
        strokeWidth: 0,
        width: 200,
        height: 200,
        fill: 'rgba(0,255,0,0.5)',
      });

      obj.clipPath = clipPath;
      canvas.add(obj);
    },
  },

  {
    title: 'ClipPath - Clip a rect with a circle, with zoom',
    golden: 'clipping1.png',
    percentage: 0.06,
    size: [200, 200],
    async renderFunction(canvas, fabric) {
      const zoom = 20;
      canvas.setZoom(zoom);

      const clipPath = new fabric.Circle({
        radius: 5,
        strokeWidth: 0,
        top: -2,
        left: -2,
      });

      const obj = new fabric.Rect({
        top: 0,
        left: 0,
        strokeWidth: 0,
        width: 10,
        height: 10,
        fill: 'rgba(255,0,0,0.5)',
      });

      obj.clipPath = clipPath;
      canvas.add(obj);
    },
  },

  {
    title: 'ClipPath - Clip a group with a circle',
    golden: 'clipping2.png',
    percentage: 0.06,
    size: [200, 200],
    async renderFunction(canvas, fabric) {
      const clipPath = new fabric.Circle({
        radius: 100,
        top: -100,
        left: -100,
      });

      const group = new fabric.Group(
        [
          new fabric.Rect({
            strokeWidth: 0,
            width: 100,
            height: 100,
            fill: 'red',
          }),
          new fabric.Rect({
            strokeWidth: 0,
            width: 100,
            height: 100,
            fill: 'yellow',
            left: 100,
          }),
          new fabric.Rect({
            strokeWidth: 0,
            width: 100,
            height: 100,
            fill: 'blue',
            top: 100,
          }),
          new fabric.Rect({
            strokeWidth: 0,
            width: 100,
            height: 100,
            fill: 'green',
            left: 100,
            top: 100,
          }),
        ],
        { strokeWidth: 0, clipPath },
      );

      canvas.add(group);
    },
  },

  {
    title: 'ClipPath - Isolation of clipPath of group and inner objects',
    golden: 'clipping3.png',
    percentage: 0.06,
    size: [200, 200],
    async renderFunction(canvas, fabric) {
      const clipPath = new fabric.Circle({
        radius: 100,
        top: -100,
        left: -100,
      });
      const small = new fabric.Circle({ radius: 50, top: -50, left: -50 });
      const small2 = new fabric.Rect({
        width: 30,
        height: 30,
        top: -50,
        left: -50,
      });

      const group = new fabric.Group(
        [
          new fabric.Rect({
            strokeWidth: 0,
            width: 100,
            height: 100,
            fill: 'red',
            clipPath: small,
          }),
          new fabric.Rect({
            strokeWidth: 0,
            width: 100,
            height: 100,
            fill: 'yellow',
            left: 100,
          }),
          new fabric.Rect({
            strokeWidth: 0,
            width: 100,
            height: 100,
            fill: 'blue',
            top: 100,
            clipPath: small2,
          }),
          new fabric.Rect({
            strokeWidth: 0,
            width: 100,
            height: 100,
            fill: 'green',
            left: 100,
            top: 100,
          }),
        ],
        { strokeWidth: 0, clipPath },
      );

      canvas.add(group);
    },
  },

  {
    title: 'ClipPath - ClipPath can be transformed',
    golden: 'clipping4.png',
    percentage: 0.06,
    size: [200, 200],
    async renderFunction(canvas, fabric) {
      const clipPath = new fabric.Circle({
        radius: 20,
        strokeWidth: 0,
        top: -10,
        left: -10,
        scaleX: 2,
        skewY: 45,
      });

      const obj = new fabric.Rect({
        top: 0,
        left: 0,
        strokeWidth: 0,
        width: 200,
        height: 200,
        fill: 'rgba(0,255,0,0.5)',
      });

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
          },
        ],
      });

      obj.clipPath = clipPath;
      canvas.add(obj);
    },
  },

  {
    title: 'ClipPath - ClipPath can be a group with many objects',
    golden: 'clipping5.png',
    percentage: 0.06,
    size: [200, 200],
    async renderFunction(canvas, fabric) {
      const clipPath = new fabric.Circle({
        radius: 20,
        strokeWidth: 0,
        top: -10,
        left: -10,
        scaleX: 2,
        skewY: 45,
      });

      const clipPath1 = new fabric.Circle({
        radius: 15,
        rotate: 45,
        strokeWidth: 0,
        top: -100,
        left: -50,
        scaleX: 2,
        skewY: 45,
      });

      const clipPath2 = new fabric.Circle({
        radius: 10,
        strokeWidth: 0,
        top: -20,
        left: -20,
        scaleY: 2,
        skewX: 45,
      });

      const group = new fabric.Group([clipPath, clipPath1, clipPath2]);

      const obj = new fabric.Rect({
        top: 0,
        left: 0,
        strokeWidth: 0,
        width: 200,
        height: 200,
        fill: 'rgba(0,255,0,0.5)',
      });

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
          },
        ],
      });

      obj.clipPath = group;
      canvas.add(obj);
    },
  },

  {
    title:
      'ClipPath can be inverted, it will clip what is outside the clipPath',
    golden: 'clipping6.png',
    percentage: 0.06,
    size: [200, 200],
    async renderFunction(canvas, fabric) {
      const clipPath = new fabric.Circle({
        radius: 20,
        strokeWidth: 0,
        top: -10,
        left: -10,
        scaleX: 2,
        skewY: 45,
      });

      const clipPath1 = new fabric.Circle({
        radius: 15,
        rotate: 45,
        strokeWidth: 0,
        top: -100,
        left: -50,
        scaleX: 2,
        skewY: 45,
      });

      const clipPath2 = new fabric.Circle({
        radius: 10,
        strokeWidth: 0,
        top: -20,
        left: -20,
        scaleY: 2,
        skewX: 45,
      });

      const group = new fabric.Group([clipPath, clipPath1, clipPath2]);

      const obj = new fabric.Rect({
        top: 0,
        left: 0,
        strokeWidth: 0,
        width: 200,
        height: 200,
        fill: 'rgba(0,255,0,0.5)',
      });

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
          },
        ],
      });

      obj.clipPath = group;
      group.inverted = true;

      canvas.add(obj);
    },
  },

  {
    title: 'Many Objects can share the same clipPath',
    golden: 'clipping7.png',
    percentage: 0.06,
    size: [200, 200],
    async renderFunction(canvas, fabric) {
      const clipPath = new fabric.Circle({
        radius: 30,
        strokeWidth: 0,
        top: -30,
        left: -30,
        skewY: 45,
      });

      const obj1 = new fabric.Rect({
        top: 0,
        left: 100,
        strokeWidth: 0,
        width: 100,
        height: 100,
        fill: 'rgba(0,255,0,0.8)',
      });

      const obj2 = new fabric.Rect({
        top: 0,
        left: 0,
        strokeWidth: 0,
        width: 100,
        height: 100,
        fill: 'rgba(255,255,0,0.8)',
      });

      const obj3 = new fabric.Rect({
        top: 100,
        left: 0,
        strokeWidth: 0,
        width: 100,
        height: 100,
        fill: 'rgba(0,255,255,0.8)',
      });

      const obj4 = new fabric.Rect({
        top: 100,
        left: 100,
        strokeWidth: 0,
        width: 100,
        height: 100,
        fill: 'rgba(255,0,0,0.8)',
      });

      obj1.clipPath = clipPath;
      obj2.clipPath = clipPath;
      obj3.clipPath = clipPath;
      obj4.clipPath = clipPath;

      canvas.add(obj1);
      canvas.add(obj2);
      canvas.add(obj3);
      canvas.add(obj4);
    },
  },

  {
    title: 'ClipPath - An absolute positioned clipPath, shared',
    golden: 'clipping8.png',
    percentage: 0.06,
    size: [200, 200],
    async renderFunction(canvas, fabric) {
      const clipPath = new fabric.Circle({
        radius: 60,
        strokeWidth: 0,
        top: 40,
        left: 40,
        absolutePositioned: true,
      });

      const obj1 = new fabric.Rect({
        top: 0,
        left: 100,
        strokeWidth: 0,
        width: 100,
        height: 100,
        fill: 'rgba(0,255,0,0.8)',
      });

      const obj2 = new fabric.Rect({
        top: 0,
        left: 0,
        strokeWidth: 0,
        width: 100,
        height: 100,
        fill: 'rgba(255,255,0,0.8)',
      });

      const obj3 = new fabric.Rect({
        top: 100,
        left: 0,
        strokeWidth: 0,
        width: 100,
        height: 100,
        fill: 'rgba(0,255,255,0.8)',
      });

      const obj4 = new fabric.Rect({
        top: 100,
        left: 100,
        strokeWidth: 0,
        width: 100,
        height: 100,
        fill: 'rgba(255,0,0,0.8)',
      });

      obj1.clipPath = clipPath;
      obj2.clipPath = clipPath;
      obj3.clipPath = clipPath;

      canvas.add(obj1);
      canvas.add(obj2);
      canvas.add(obj3);
      canvas.add(obj4);
    },
  },

  {
    title: 'ClipPath - A clipPath on the canvas',
    golden: 'clipping9.png',
    percentage: 0.06,
    size: [200, 200],
    async renderFunction(canvas, fabric) {
      const clipPath = new fabric.Circle({
        radius: 60,
        strokeWidth: 0,
        top: 10,
        left: 10,
      });

      const obj1 = new fabric.Rect({
        top: 0,
        left: 100,
        strokeWidth: 0,
        width: 100,
        height: 100,
        fill: 'rgba(0,255,0,0.8)',
      });

      const obj2 = new fabric.Rect({
        top: 0,
        left: 0,
        strokeWidth: 0,
        width: 100,
        height: 100,
        fill: 'rgba(255,255,0,0.8)',
      });

      const obj3 = new fabric.Rect({
        top: 100,
        left: 0,
        strokeWidth: 0,
        width: 100,
        height: 100,
        fill: 'rgba(0,255,255,0.8)',
      });

      const obj4 = new fabric.Rect({
        top: 100,
        left: 100,
        strokeWidth: 0,
        width: 100,
        height: 100,
        fill: 'rgba(255,0,0,0.8)',
      });

      canvas.add(obj1);
      canvas.add(obj2);
      canvas.add(obj3);
      canvas.add(obj4);

      canvas.clipPath = clipPath;
    },
  },

  {
    title: 'ClipPath with a path on a simple elements',
    golden: 'clipping10.png',
    percentage: 0.06,
    size: [200, 200],
    async renderFunction(canvas, fabric) {
      const jsonData =
        '{"version":"2.4.5","objects":[{"type":"Path","version":"2.4.5","originX":"left","originY":"top","left":12.844238038518533,"top":75.97237569060775,"width":50.4,"height":25.4,"fill":"#b8d783","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":2.07,"scaleY":2.07,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"clipPath":{"type":"Circle","version":"2.4.5","originX":"left","originY":"top","left":-31.1,"top":-48.7,"width":61.2,"height":61.2,"fill":"rgb(0,0,0)","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"radius":30.6,"startAngle":0,"endAngle":360,"inverted":false,"absolutePositioned":false},"path":[["M",31.8,36.8],["c",-10.7,0,-25.2,6.8,-25.1,25.4],["L",57.1,62],["C",57.1,43.5,42.6,36.8,31.8,36.8],["z"]]},{"type":"Circle","version":"2.4.5","originX":"left","originY":"top","left":38.95,"top":28.53,"width":25.6,"height":25.6,"fill":"#d7b047","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":2.07,"scaleY":2.07,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"clipPath":{"type":"Circle","version":"2.4.5","originX":"left","originY":"top","left":-31.3,"top":-25.9,"width":61.2,"height":61.2,"fill":"rgb(0,0,0)","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"radius":30.6,"startAngle":0,"endAngle":360,"inverted":false,"absolutePositioned":false},"radius":12.8,"startAngle":0,"endAngle":360},{"type":"Circle","version":"2.4.5","originX":"left","originY":"top","left":0.1,"top":2.87,"width":61.2,"height":61.2,"fill":"transparent","stroke":"#567bde","strokeWidth":2.5,"strokeDashArray":null,"strokeLineCap":"round","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":2.06,"scaleY":2.06,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"radius":30.6,"startAngle":0,"endAngle":360}]}';

      await canvas.loadFromJSON(jsonData);
    },
  },

  {
    title: 'ClipPath made of polygons and paths',
    golden: 'clippath-9.png',
    percentage: 0.06,
    size: [400, 400],
    async renderFunction(canvas, fabric) {
      const jsonData =
        '{"version":"2.4.5","objects":[{"type":"Group","version":"2.4.5","originX":"left","originY":"top","left":-1,"top":0,"width":400,"height":400,"fill":"rgb(0,0,0)","stroke":null,"strokeWidth":0,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"objects":[{"type":"Circle","version":"2.4.5","originX":"left","originY":"top","left":-618.26087,"top":-618.26087,"width":600,"height":600,"fill":"#396","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":1.73913,"scaleY":1.73913,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"clipPath":{"type":"Group","version":"2.4.5","originX":"left","originY":"top","left":-50.026294,"top":-16.249678,"width":318.906599,"height":295.383789,"fill":"rgb(0,0,0)","stroke":null,"strokeWidth":0,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":0.575,"scaleY":0.575,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"objects":[{"type":"Polygon","version":"2.4.5","originX":"left","originY":"top","left":-125.590179,"top":-145.137671,"width":148,"height":146,"fill":"#D8CB3F","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":1.913043,"scaleY":1.913043,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"points":[{"x":245.45,"y":333.29},{"x":313.95,"y":405.79},{"x":393.45,"y":318.29},{"x":316.95,"y":259.79}]},{"type":"Polygon","version":"2.4.5","originX":"left","originY":"top","left":-145.600613,"top":-4.528975,"width":78.96,"height":78.57,"fill":"#8E8029","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":1.913043,"scaleY":1.913043,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"points":[{"x":234.99,"y":339.36},{"x":245.45,"y":333.29},{"x":313.95,"y":405.79},{"x":303.49,"y":411.86}]},{"type":"Polygon","version":"2.4.5","originX":"left","originY":"top","left":-145.600613,"top":-145.137671,"width":81.96,"height":79.57,"fill":"#8E8029","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":1.913043,"scaleY":1.913043,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"points":[{"x":305.6,"y":264.97},{"x":316.95,"y":259.79},{"x":245.45,"y":333.29},{"x":234.99,"y":339.36}]},{"type":"Path","version":"2.4.5","originX":"left","originY":"top","left":-152.94670044656436,"top":-106.34114919417823,"width":29.46,"height":35.71,"fill":"#D8CB3F","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":1.913043,"scaleY":1.913043,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"path":[["M",231.15,283.42],["c",1.18,2.07,2.56,4.26,4.14,6.57],["l",10.62,13.65],["c",3.39,3.94,7.17,8.01,11.29,12.14],["l",3.41,-3.41],["c",0,0,-16.5,-17.25,-26.11,-32.3],["L",231.15,283.42],["z"]]},{"type":"Path","version":"2.4.5","originX":"left","originY":"top","left":-159.45329955343573,"top":-147.691894284083,"width":68.811177,"height":29.095162,"fill":"#D8CB3F","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":1.913043,"scaleY":1.913043,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"path":[["M",229.7,259.54],["c",-1.9,1.43,-2.31,3.86,-1.67,6.91],["l",0.08,0.15],["c",3.5,-2.53,11.03,-1.57,19.8,0.98],["h",0],["l",0,0],["c",20.02,5.83,46.53,19.97,46.53,19.97],["l",2.12,-3.62],["C",267.45,266.79,236.17,254.67,229.7,259.54],["z"]]}],"inverted":false,"absolutePositioned":false},"radius":300,"startAngle":0,"endAngle":360},{"type":"Circle","version":"2.4.5","originX":"left","originY":"top","left":-148.695652,"top":-148.695652,"width":660,"height":660,"fill":"#900","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":1.73913,"scaleY":1.73913,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"clipPath":{"type":"Group","version":"2.4.5","originX":"left","originY":"top","left":-350.026294,"top":-316.249678,"width":318.906599,"height":295.383789,"fill":"rgb(0,0,0)","stroke":null,"strokeWidth":0,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":0.575,"scaleY":0.575,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"objects":[{"type":"Polygon","version":"2.4.5","originX":"left","originY":"top","left":-125.590179,"top":-145.137671,"width":148,"height":146,"fill":"#D8CB3F","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":1.913043,"scaleY":1.913043,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"points":[{"x":245.45,"y":333.29},{"x":313.95,"y":405.79},{"x":393.45,"y":318.29},{"x":316.95,"y":259.79}]},{"type":"Polygon","version":"2.4.5","originX":"left","originY":"top","left":-145.600613,"top":-4.528975,"width":78.96,"height":78.57,"fill":"#8E8029","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":1.913043,"scaleY":1.913043,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"points":[{"x":234.99,"y":339.36},{"x":245.45,"y":333.29},{"x":313.95,"y":405.79},{"x":303.49,"y":411.86}]},{"type":"Polygon","version":"2.4.5","originX":"left","originY":"top","left":-145.600613,"top":-145.137671,"width":81.96,"height":79.57,"fill":"#8E8029","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":1.913043,"scaleY":1.913043,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"points":[{"x":305.6,"y":264.97},{"x":316.95,"y":259.79},{"x":245.45,"y":333.29},{"x":234.99,"y":339.36}]},{"type":"Path","version":"2.4.5","originX":"left","originY":"top","left":-152.94670044656436,"top":-106.34114919417823,"width":29.46,"height":35.71,"fill":"#D8CB3F","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":1.913043,"scaleY":1.913043,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"path":[["M",231.15,283.42],["c",1.18,2.07,2.56,4.26,4.14,6.57],["l",10.62,13.65],["c",3.39,3.94,7.17,8.01,11.29,12.14],["l",3.41,-3.41],["c",0,0,-16.5,-17.25,-26.11,-32.3],["L",231.15,283.42],["z"]]},{"type":"Path","version":"2.4.5","originX":"left","originY":"top","left":-159.45329955343573,"top":-147.691894284083,"width":68.811177,"height":29.095162,"fill":"#D8CB3F","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":1.913043,"scaleY":1.913043,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"path":[["M",229.7,259.54],["c",-1.9,1.43,-2.31,3.86,-1.67,6.91],["l",0.08,0.15],["c",3.5,-2.53,11.03,-1.57,19.8,0.98],["h",0],["l",0,0],["c",20.02,5.83,46.53,19.97,46.53,19.97],["l",2.12,-3.62],["C",267.45,266.79,236.17,254.67,229.7,259.54],["z"]]}],"inverted":false,"absolutePositioned":false},"radius":330,"startAngle":0,"endAngle":360},{"type":"Circle","version":"2.4.5","originX":"left","originY":"top","left":-183.478261,"top":-1070.434783,"width":700,"height":700,"fill":"#009","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":1.73913,"scaleY":1.73913,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"clipPath":{"type":"Group","version":"2.4.5","originX":"left","originY":"top","left":-350.026294,"top":193.750322,"width":318.906599,"height":295.383789,"fill":"rgb(0,0,0)","stroke":null,"strokeWidth":0,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":0.575,"scaleY":0.575,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"objects":[{"type":"Polygon","version":"2.4.5","originX":"left","originY":"top","left":-125.590179,"top":-145.137671,"width":148,"height":146,"fill":"#D8CB3F","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":1.913043,"scaleY":1.913043,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"points":[{"x":245.45,"y":333.29},{"x":313.95,"y":405.79},{"x":393.45,"y":318.29},{"x":316.95,"y":259.79}]},{"type":"Polygon","version":"2.4.5","originX":"left","originY":"top","left":-145.600613,"top":-4.528975,"width":78.96,"height":78.57,"fill":"#8E8029","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":1.913043,"scaleY":1.913043,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"points":[{"x":234.99,"y":339.36},{"x":245.45,"y":333.29},{"x":313.95,"y":405.79},{"x":303.49,"y":411.86}]},{"type":"Polygon","version":"2.4.5","originX":"left","originY":"top","left":-145.600613,"top":-145.137671,"width":81.96,"height":79.57,"fill":"#8E8029","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":1.913043,"scaleY":1.913043,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"points":[{"x":305.6,"y":264.97},{"x":316.95,"y":259.79},{"x":245.45,"y":333.29},{"x":234.99,"y":339.36}]},{"type":"Path","version":"2.4.5","originX":"left","originY":"top","left":-152.94670044656436,"top":-106.34114919417823,"width":29.46,"height":35.71,"fill":"#D8CB3F","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":1.913043,"scaleY":1.913043,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"path":[["M",231.15,283.42],["c",1.18,2.07,2.56,4.26,4.14,6.57],["l",10.62,13.65],["c",3.39,3.94,7.17,8.01,11.29,12.14],["l",3.41,-3.41],["c",0,0,-16.5,-17.25,-26.11,-32.3],["L",231.15,283.42],["z"]]},{"type":"Path","version":"2.4.5","originX":"left","originY":"top","left":-159.45329955343573,"top":-147.691894284083,"width":68.811177,"height":29.095162,"fill":"#D8CB3F","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":1.913043,"scaleY":1.913043,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"path":[["M",229.7,259.54],["c",-1.9,1.43,-2.31,3.86,-1.67,6.91],["l",0.08,0.15],["c",3.5,-2.53,11.03,-1.57,19.8,0.98],["h",0],["l",0,0],["c",20.02,5.83,46.53,19.97,46.53,19.97],["l",2.12,-3.62],["C",267.45,266.79,236.17,254.67,229.7,259.54],["z"]]}],"inverted":false,"absolutePositioned":false},"radius":350,"startAngle":0,"endAngle":360}]}]}';

      await canvas.loadFromJSON(jsonData);
    },
  },
];
