import { FabricNamespace, renderTestType } from '../../../types';
import { Canvas, Point } from 'fabric';

function toSVGCanvas(
  canvas: Canvas,
  callback: (canvas: HTMLCanvasElement) => void,
  fabric: FabricNamespace,
): void {
  const svg = canvas.toSVG();
  const dataUrl = svgToDataURL(svg);
  const image = fabric.getFabricDocument().createElement('img');
  image.onload = function () {
    const newCanvas = fabric.util.createCanvasElement();
    newCanvas.width = canvas.width;
    newCanvas.height = canvas.height;
    newCanvas
      .getContext('2d')!
      .drawImage(image, 0, 0, canvas.width, canvas.height);
    callback(newCanvas);
  };
  image.onerror = console.log;
  image.src = dataUrl;
}

function svgToDataURL(svgStr: string) {
  const encoded = encodeURIComponent(svgStr)
    .replace(/'/g, '%27')
    .replace(/"/g, '%22');
  return 'data:image/svg+xml,' + encoded;
}

export const zSvgExport: renderTestType[] = [
  {
    title: 'Clip a rect with a circle, no zoom',
    golden: 'clipping0-SVG.png',
    percentage: 0.06,
    size: [200, 200],
    async renderFunction(canvas, fabric) {
      const clip = new fabric.Circle({
        radius: 100,
        strokeWidth: 0,
        top: 90,
        left: 90,
      });

      const rect = new fabric.Rect({
        top: 100,
        left: 100,
        strokeWidth: 0,
        width: 200,
        height: 200,
        fill: 'rgba(0,255,0,0.5)',
      });
      rect.clipPath = clip;
      canvas.add(rect);
    },
  },
  {
    title: 'A clippath ignores fill and stroke for drawing',
    golden: 'clipping01_SVG.png',
    percentage: 0.06,
    size: [200, 200],
    async renderFunction(canvas, fabric) {
      const clip = new fabric.Circle({
        radius: 50,
        strokeWidth: 40,
        top: 20,
        left: 20,
        fill: 'transparent',
      });

      const rect = new fabric.Rect({
        top: 100,
        left: 100,
        strokeWidth: 0,
        width: 200,
        height: 200,
        fill: 'rgba(0,255,0,0.5)',
      });

      rect.clipPath = clip;
      canvas.add(rect);
    },
  },
  {
    title: 'Clip a rect with a circle, with zoom',
    golden: 'clipping1_SVG.png',
    percentage: 0.06,
    size: [200, 200],
    async renderFunction(canvas, fabric) {
      canvas.setZoom(20);
      const clip = new fabric.Circle({
        radius: 5,
        strokeWidth: 0,
        top: 3,
        left: 3,
      });

      const rect = new fabric.Rect({
        top: 5,
        left: 5,
        strokeWidth: 0,
        width: 10,
        height: 10,
        fill: 'rgba(255,0,0,0.5)',
      });

      rect.clipPath = clip;
      canvas.add(rect);
    },
  },
  {
    title: 'Clip a group with a circle',
    golden: 'clipping2_SVG.png',
    percentage: 0.06,
    size: [200, 200],
    async renderFunction(canvas, fabric) {
      const clipPath = new fabric.Circle({
        radius: 100,
        top: 0,
        left: 0,
      });

      const group = new fabric.Group(
        [
          new fabric.Rect({
            strokeWidth: 0,
            width: 100,
            height: 100,
            top: 50,
            left: 50,
            fill: 'red',
          }),
          new fabric.Rect({
            strokeWidth: 0,
            width: 100,
            height: 100,
            fill: 'yellow',
            top: 50,
            left: 150,
          }),
          new fabric.Rect({
            strokeWidth: 0,
            width: 100,
            height: 100,
            fill: 'blue',
            left: 50,
            top: 150,
          }),
          new fabric.Rect({
            strokeWidth: 0,
            width: 100,
            height: 100,
            fill: 'green',
            left: 150,
            top: 150,
          }),
        ],
        { strokeWidth: 0, clipPath },
      );
      canvas.add(group);
    },
  },
  {
    title: 'Isolation of clipPath of group and inner objects',
    golden: 'clipping3_SVG.png',
    percentage: 0.06,
    size: [200, 200],
    async renderFunction(canvas, fabric) {
      const clipPath = new fabric.Circle({
        radius: 100,
        top: 0,
        left: 0,
      });
      const small = new fabric.Circle({ radius: 50 });
      const small2 = new fabric.Rect({
        width: 30,
        height: 30,
      });

      const group = new fabric.Group(
        [
          new fabric.Rect({
            strokeWidth: 0,
            width: 100,
            height: 100,
            left: 50,
            top: 50,
            fill: 'red',
            clipPath: small,
          }),
          new fabric.Rect({
            strokeWidth: 0,
            width: 100,
            height: 100,
            fill: 'yellow',
            left: 150,
            top: 50,
          }),
          new fabric.Rect({
            strokeWidth: 0,
            width: 100,
            height: 100,
            fill: 'blue',
            top: 150,
            left: 50,
            clipPath: small2,
          }),
          new fabric.Rect({
            strokeWidth: 0,
            width: 100,
            height: 100,
            fill: 'green',
            left: 150,
            top: 150,
          }),
        ],
        { strokeWidth: 0, clipPath },
      );

      canvas.add(group);
    },
  },
  {
    title: 'ClipPath can be transformed',
    golden: 'clipping4_SVG.png',
    percentage: 0.06,
    size: [200, 200],
    async renderFunction(canvas, fabric) {
      const clip = new fabric.Circle({
        radius: 20,
        top: -10,
        left: -10,
        scaleX: 2,
        skewY: 45,
        strokeWidth: 0,
      });
      const rect = new fabric.Rect({ width: 200, height: 200, strokeWidth: 0 });
      rect.fill = new fabric.Gradient({
        type: 'linear',
        coords: { x1: 0, y1: 0, x2: 200, y2: 200 },
        colorStops: [
          { offset: 0, color: 'red' },
          { offset: 1, color: 'blue' },
        ],
      });
      rect.clipPath = clip;
      canvas.add(rect);
    },
  },
  {
    title: 'ClipPath can be a group with many objects',
    golden: 'clipping5_SVG.png',
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
      clipPath.setPositionByOrigin(new Point(-10, -10), 'left', 'top');

      const clipPath1 = new fabric.Circle({
        radius: 15,
        rotate: 45,
        strokeWidth: 0,
        top: -100,
        left: -50,
        scaleX: 2,
        skewY: 45,
      });
      clipPath1.setPositionByOrigin(new Point(-50, -100), 'left', 'top');

      const clipPath2 = new fabric.Circle({
        radius: 10,
        strokeWidth: 0,
        top: -20,
        left: -20,
        scaleY: 2,
        skewX: 45,
      });
      clipPath2.setPositionByOrigin(new Point(-20, -20), 'left', 'top');

      const group = new fabric.Group([clipPath, clipPath1, clipPath2]);

      const obj = new fabric.Rect({
        top: 100,
        left: 100,
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
    title: 'ClipPath can be inverted (outside area)',
    golden: 'clipping6_SVG.png',
    percentage: 0.06,
    size: [200, 200],
    disabled: true,
    async renderFunction(canvas, fabric) {
      const clip1 = new fabric.Circle({
        radius: 20,
        top: -10,
        left: -10,
        scaleX: 2,
        skewY: 45,
        strokeWidth: 0,
      });
      const clip2 = new fabric.Circle({
        radius: 15,
        top: -100,
        left: -50,
        scaleX: 2,
        skewY: 45,
        strokeWidth: 0,
        angle: 45,
      });
      const clip3 = new fabric.Circle({
        radius: 10,
        top: -20,
        left: -20,
        scaleY: 2,
        skewX: 45,
        strokeWidth: 0,
      });
      const groupClip = new fabric.Group([clip1, clip2, clip3]);
      groupClip.inverted = true;
      const rect = new fabric.Rect({ width: 200, height: 200, strokeWidth: 0 });
      rect.fill = new fabric.Gradient({
        type: 'linear',
        coords: { x1: 0, y1: 0, x2: 200, y2: 200 },
        colorStops: [
          { offset: 0, color: 'red' },
          { offset: 1, color: 'blue' },
        ],
      });
      rect.clipPath = groupClip;
      canvas.add(rect);
    },
  },
  {
    title: 'Many objects can share the same clipPath',
    golden: 'clipping7_SVG.png',
    percentage: 0.06,
    size: [200, 200],
    async renderFunction(canvas, fabric) {
      const clip = new fabric.Circle({
        radius: 30,
        top: 0,
        left: 0,
        skewY: 45,
        strokeWidth: 0,
      });
      clip.setPositionByOrigin(new Point(-30, -30), 'left', 'top');
      const makeRect = (top: number, left: number, fill: string) =>
        new fabric.Rect({
          top,
          left,
          width: 100,
          height: 100,
          fill,
          strokeWidth: 0,
        });
      const r1 = makeRect(50, 150, 'rgba(0,255,0,0.8)');
      const r2 = makeRect(50, 50, 'rgba(255,255,0,0.8)');
      const r3 = makeRect(150, 50, 'rgba(0,255,255,0.8)');
      const r4 = makeRect(150, 150, 'rgba(255,0,0,0.8)');
      [r1, r2, r3, r4].forEach((r) => (r.clipPath = clip) && canvas.add(r));
    },
  },
  {
    title: 'An absolute positioned clipPath, shared',
    golden: 'clipping8_SVG.png',
    percentage: 0.06,
    size: [200, 200],
    async renderFunction(canvas, fabric) {
      const clipPath = new fabric.Circle({
        radius: 60,
        strokeWidth: 0,
        top: 100,
        left: 100,
        absolutePositioned: true,
      });
      const makeRect = (top: number, left: number, fill: string) =>
        new fabric.Rect({
          top,
          left,
          width: 100,
          height: 100,
          fill,
          strokeWidth: 0,
        });
      const r1 = makeRect(50, 150, 'rgba(0,255,0,0.8)');
      const r2 = makeRect(50, 50, 'rgba(255,255,0,0.8)');
      const r3 = makeRect(150, 50, 'rgba(0,255,255,0.8)');
      const r4 = makeRect(150, 150, 'rgba(255,0,0,0.8)');
      [r1, r2, r3].forEach((r) => (r.clipPath = clipPath) && canvas.add(r));
      canvas.add(r4);
    },
  },
  {
    title: 'A clipPath on the canvas',
    golden: 'clipping9_SVG.png',
    percentage: 0.06,
    size: [200, 200],
    async renderFunction(canvas, fabric) {
      const clip = new fabric.Circle({
        radius: 60,
        top: 70,
        left: 70,
        strokeWidth: 0,
      });
      const makeRect = (top: number, left: number, fill: string) =>
        new fabric.Rect({
          top,
          left,
          width: 100,
          height: 100,
          fill,
          strokeWidth: 0,
        });
      canvas.add(makeRect(50, 150, 'rgba(0,255,0,0.8)'));
      canvas.add(makeRect(50, 50, 'rgba(255,255,0,0.8)'));
      canvas.add(makeRect(150, 50, 'rgba(0,255,255,0.8)'));
      canvas.add(makeRect(150, 150, 'rgba(255,0,0,0.8)'));
      canvas.clipPath = clip;
    },
  },
  {
    title: 'clipPath with a path on simple elements',
    golden: 'clipping10_SVG.png',
    percentage: 0.06,
    size: [200, 200],
    async renderFunction(canvas, fabric) {
      const jsonData =
        '{"version":"7.0.0-beta1","objects":[{"type":"Path","version":"7.0.0-beta1","originX":"center","originY":"center","left":66.0438,"top":103.2964,"width":50.4005,"height":25.4,"fill":"#b8d783","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":2.07,"scaleY":2.07,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"clipPath":{"radius":30.6,"startAngle":0,"endAngle":360,"counterClockwise":false,"inverted":false,"absolutePositioned":false,"type":"Circle","version":"7.0.0-beta1","originX":"center","originY":"center","left":0,"top":-17.6,"width":61.2,"height":61.2,"fill":"rgb(0,0,0)","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0},"path":[["M",31.8,36.8],["C",21.1,36.8,6.600000000000001,43.599999999999994,6.699999999999999,62.199999999999996],["L",57.1,62],["C",57.1,43.5,42.6,36.8,31.8,36.8],["Z"]]},{"radius":12.8,"startAngle":0,"endAngle":360,"counterClockwise":false,"type":"Circle","version":"7.0.0-beta1","originX":"center","originY":"center","left":66.481,"top":56.061,"width":25.6,"height":25.6,"fill":"#d7b047","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":2.07,"scaleY":2.07,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"clipPath":{"radius":30.6,"startAngle":0,"endAngle":360,"counterClockwise":false,"inverted":false,"absolutePositioned":false,"type":"Circle","version":"7.0.0-beta1","originX":"center","originY":"center","left":-0.2,"top":5.2,"width":61.2,"height":61.2,"fill":"rgb(0,0,0)","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0}},{"radius":30.6,"startAngle":0,"endAngle":360,"counterClockwise":false,"type":"Circle","version":"7.0.0-beta1","originX":"center","originY":"center","left":65.711,"top":68.481,"width":61.2,"height":61.2,"fill":"transparent","stroke":"#567bde","strokeWidth":2.5,"strokeDashArray":null,"strokeLineCap":"round","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":10,"scaleX":2.06,"scaleY":2.06,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0}]}';
      await canvas.loadFromJSON(jsonData);
    },
  },
  {
    title: 'clipPath made of polygons and paths',
    golden: 'clippath-9_SVG.png',
    percentage: 0.06,
    size: [400, 400],
    async renderFunction(canvas, fabric) {
      const jsonData =
        '{"version":"7.0.0-beta1","objects":[{"subTargetCheck":false,"interactive":false,"type":"Group","version":"7.0.0-beta1","originX":"center","originY":"center","left":199,"top":200,"width":400,"height":400,"fill":"rgb(0,0,0)","stroke":null,"strokeWidth":0,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"layoutManager":{"type":"layoutManager","strategy":"fit-content"},"objects":[{"radius":300,"startAngle":0,"endAngle":360,"counterClockwise":false,"type":"Circle","version":"7.0.0-beta1","originX":"center","originY":"center","left":-95.6523,"top":-95.6523,"width":600,"height":600,"fill":"#396","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1.7391,"scaleY":1.7391,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"clipPath":{"subTargetCheck":false,"interactive":false,"inverted":false,"absolutePositioned":false,"type":"Group","version":"7.0.0-beta1","originX":"center","originY":"center","left":41.6594,"top":68.6732,"width":318.9066,"height":295.3838,"fill":"rgb(0,0,0)","stroke":null,"strokeWidth":0,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":0.575,"scaleY":0.575,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"layoutManager":{"type":"layoutManager","strategy":"fit-content"},"objects":[{"inverted":false,"absolutePositioned":false,"type":"Polygon","version":"7.0.0-beta1","originX":"center","originY":"center","left":16.9315,"top":-4.529,"width":148,"height":146,"fill":"#D8CB3F","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1.913,"scaleY":1.913,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"points":[{"x":245.45,"y":333.29},{"x":313.95,"y":405.79},{"x":393.45,"y":318.29},{"x":316.95,"y":259.79}]},{"inverted":false,"absolutePositioned":false,"type":"Polygon","version":"7.0.0-beta1","originX":"center","originY":"center","left":-69.1172,"top":71.5814,"width":78.96,"height":78.57,"fill":"#8E8029","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1.913,"scaleY":1.913,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"points":[{"x":234.99,"y":339.36},{"x":245.45,"y":333.29},{"x":313.95,"y":405.79},{"x":303.49,"y":411.86}]},{"inverted":false,"absolutePositioned":false,"type":"Polygon","version":"7.0.0-beta1","originX":"center","originY":"center","left":-66.2476,"top":-68.0707,"width":81.96,"height":79.57,"fill":"#8E8029","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1.913,"scaleY":1.913,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"points":[{"x":305.6,"y":264.97},{"x":316.95,"y":259.79},{"x":245.45,"y":333.29},{"x":234.99,"y":339.36}]},{"inverted":false,"absolutePositioned":false,"type":"Path","version":"7.0.0-beta1","originX":"center","originY":"center","left":-123.8111,"top":-71.2272,"width":29.46,"height":35.71,"fill":"#D8CB3F","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1.913,"scaleY":1.913,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"path":[["M",231.15,283.42],["C",232.33,285.49,233.71,287.68,235.29,289.99],["L",245.91,303.64],["C",249.29999999999998,307.58,253.07999999999998,311.65,257.2,315.78],["L",260.61,312.36999999999995],["C",260.61,312.36999999999995,244.11,295.11999999999995,234.5,280.06999999999994],["L",231.15,283.42],["Z"]]},{"inverted":false,"absolutePositioned":false,"type":"Path","version":"7.0.0-beta1","originX":"center","originY":"center","left":-92.6774,"top":-118.9052,"width":68.8112,"height":29.0952,"fill":"#D8CB3F","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1.913,"scaleY":1.913,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"path":[["M",229.7,259.54],["C",227.79999999999998,260.97,227.39,263.40000000000003,228.03,266.45000000000005],["L",228.11,266.6],["C",231.61,264.07000000000005,239.14000000000001,265.03000000000003,247.91000000000003,267.58000000000004],["L",247.91000000000003,267.58000000000004],["L",247.91000000000003,267.58000000000004],["C",267.93,273.41,294.44000000000005,287.55000000000007,294.44000000000005,287.55000000000007],["L",296.56000000000006,283.93000000000006],["C",267.45,266.79,236.17,254.67,229.7,259.54],["Z"]]}]}},{"radius":330,"startAngle":0,"endAngle":360,"counterClockwise":false,"type":"Circle","version":"7.0.0-beta1","originX":"center","originY":"center","left":426.0868,"top":426.0868,"width":660,"height":660,"fill":"#900","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1.7391,"scaleY":1.7391,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"clipPath":{"subTargetCheck":false,"interactive":false,"inverted":false,"absolutePositioned":false,"type":"Group","version":"7.0.0-beta1","originX":"center","originY":"center","left":-258.3406,"top":-231.3268,"width":318.9066,"height":295.3838,"fill":"rgb(0,0,0)","stroke":null,"strokeWidth":0,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":0.575,"scaleY":0.575,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"layoutManager":{"type":"layoutManager","strategy":"fit-content"},"objects":[{"inverted":false,"absolutePositioned":false,"type":"Polygon","version":"7.0.0-beta1","originX":"center","originY":"center","left":16.9315,"top":-4.529,"width":148,"height":146,"fill":"#D8CB3F","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1.913,"scaleY":1.913,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"points":[{"x":245.45,"y":333.29},{"x":313.95,"y":405.79},{"x":393.45,"y":318.29},{"x":316.95,"y":259.79}]},{"inverted":false,"absolutePositioned":false,"type":"Polygon","version":"7.0.0-beta1","originX":"center","originY":"center","left":-69.1172,"top":71.5814,"width":78.96,"height":78.57,"fill":"#8E8029","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1.913,"scaleY":1.913,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"points":[{"x":234.99,"y":339.36},{"x":245.45,"y":333.29},{"x":313.95,"y":405.79},{"x":303.49,"y":411.86}]},{"inverted":false,"absolutePositioned":false,"type":"Polygon","version":"7.0.0-beta1","originX":"center","originY":"center","left":-66.2476,"top":-68.0707,"width":81.96,"height":79.57,"fill":"#8E8029","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1.913,"scaleY":1.913,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"points":[{"x":305.6,"y":264.97},{"x":316.95,"y":259.79},{"x":245.45,"y":333.29},{"x":234.99,"y":339.36}]},{"inverted":false,"absolutePositioned":false,"type":"Path","version":"7.0.0-beta1","originX":"center","originY":"center","left":-123.8111,"top":-71.2272,"width":29.46,"height":35.71,"fill":"#D8CB3F","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1.913,"scaleY":1.913,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"path":[["M",231.15,283.42],["C",232.33,285.49,233.71,287.68,235.29,289.99],["L",245.91,303.64],["C",249.29999999999998,307.58,253.07999999999998,311.65,257.2,315.78],["L",260.61,312.36999999999995],["C",260.61,312.36999999999995,244.11,295.11999999999995,234.5,280.06999999999994],["L",231.15,283.42],["Z"]]},{"inverted":false,"absolutePositioned":false,"type":"Path","version":"7.0.0-beta1","originX":"center","originY":"center","left":-92.6774,"top":-118.9052,"width":68.8112,"height":29.0952,"fill":"#D8CB3F","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1.913,"scaleY":1.913,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"path":[["M",229.7,259.54],["C",227.79999999999998,260.97,227.39,263.40000000000003,228.03,266.45000000000005],["L",228.11,266.6],["C",231.61,264.07000000000005,239.14000000000001,265.03000000000003,247.91000000000003,267.58000000000004],["L",247.91000000000003,267.58000000000004],["L",247.91000000000003,267.58000000000004],["C",267.93,273.41,294.44000000000005,287.55000000000007,294.44000000000005,287.55000000000007],["L",296.56000000000006,283.93000000000006],["C",267.45,266.79,236.17,254.67,229.7,259.54],["Z"]]}]}},{"radius":350,"startAngle":0,"endAngle":360,"counterClockwise":false,"type":"Circle","version":"7.0.0-beta1","originX":"center","originY":"center","left":426.0868,"top":-460.8697,"width":700,"height":700,"fill":"#009","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1.7391,"scaleY":1.7391,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"clipPath":{"subTargetCheck":false,"interactive":false,"inverted":false,"absolutePositioned":false,"type":"Group","version":"7.0.0-beta1","originX":"center","originY":"center","left":-258.3406,"top":278.6732,"width":318.9066,"height":295.3838,"fill":"rgb(0,0,0)","stroke":null,"strokeWidth":0,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":0.575,"scaleY":0.575,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"layoutManager":{"type":"layoutManager","strategy":"fit-content"},"objects":[{"inverted":false,"absolutePositioned":false,"type":"Polygon","version":"7.0.0-beta1","originX":"center","originY":"center","left":16.9315,"top":-4.529,"width":148,"height":146,"fill":"#D8CB3F","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1.913,"scaleY":1.913,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"points":[{"x":245.45,"y":333.29},{"x":313.95,"y":405.79},{"x":393.45,"y":318.29},{"x":316.95,"y":259.79}]},{"inverted":false,"absolutePositioned":false,"type":"Polygon","version":"7.0.0-beta1","originX":"center","originY":"center","left":-69.1172,"top":71.5814,"width":78.96,"height":78.57,"fill":"#8E8029","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1.913,"scaleY":1.913,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"points":[{"x":234.99,"y":339.36},{"x":245.45,"y":333.29},{"x":313.95,"y":405.79},{"x":303.49,"y":411.86}]},{"inverted":false,"absolutePositioned":false,"type":"Polygon","version":"7.0.0-beta1","originX":"center","originY":"center","left":-66.2476,"top":-68.0707,"width":81.96,"height":79.57,"fill":"#8E8029","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1.913,"scaleY":1.913,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"points":[{"x":305.6,"y":264.97},{"x":316.95,"y":259.79},{"x":245.45,"y":333.29},{"x":234.99,"y":339.36}]},{"inverted":false,"absolutePositioned":false,"type":"Path","version":"7.0.0-beta1","originX":"center","originY":"center","left":-123.8111,"top":-71.2272,"width":29.46,"height":35.71,"fill":"#D8CB3F","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1.913,"scaleY":1.913,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"path":[["M",231.15,283.42],["C",232.33,285.49,233.71,287.68,235.29,289.99],["L",245.91,303.64],["C",249.29999999999998,307.58,253.07999999999998,311.65,257.2,315.78],["L",260.61,312.36999999999995],["C",260.61,312.36999999999995,244.11,295.11999999999995,234.5,280.06999999999994],["L",231.15,283.42],["Z"]]},{"inverted":false,"absolutePositioned":false,"type":"Path","version":"7.0.0-beta1","originX":"center","originY":"center","left":-92.6774,"top":-118.9052,"width":68.8112,"height":29.0952,"fill":"#D8CB3F","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1.913,"scaleY":1.913,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"path":[["M",229.7,259.54],["C",227.79999999999998,260.97,227.39,263.40000000000003,228.03,266.45000000000005],["L",228.11,266.6],["C",231.61,264.07000000000005,239.14000000000001,265.03000000000003,247.91000000000003,267.58000000000004],["L",247.91000000000003,267.58000000000004],["L",247.91000000000003,267.58000000000004],["C",267.93,273.41,294.44000000000005,287.55000000000007,294.44000000000005,287.55000000000007],["L",296.56000000000006,283.93000000000006],["C",267.45,266.79,236.17,254.67,229.7,259.54],["Z"]]}]}}]}]}';
      await canvas.loadFromJSON(jsonData);
    },
  },
  {
    title: 'Export a radial svg with scaling',
    golden: 'export12_SVG.png',
    percentage: 0.06,
    size: [220, 300],
    async renderFunction(canvas, fabric) {
      const jsonData =
        '{"version":"7.0.0-beta1","objects":[{"rx":110,"ry":150,"type":"Ellipse","version":"7.0.0-beta1","left":78.745,"originX":"center", "originY":"center","top":178.5025,"width":220,"height":300,"fill":{"type":"radial","coords":{"x1":110.00000000000001,"y1":110.00000000000001,"x2":110.00000000000001,"y2":110.00000000000001,"r1":0,"r2":110.00000000000001},"colorStops":[{"offset":1,"color":"rgb(0,0,255)","opacity":1},{"offset":0.6,"color":"rgba(0,153,153,0.5)"},{"offset":0.3,"color":"rgb(0,0,255)","opacity":1},{"offset":0,"color":"rgba(255,0,0, 0.8)"}],"offsetX":0,"offsetY":0,"gradientUnits":"pixels","gradientTransform":[1,0,0,1.3636363636363635,0,0]},"scaleX":0.69,"scaleY":1.07,"skewY":-32.03}]}';
      await canvas.loadFromJSON(jsonData);
    },
  },
  {
    title: 'Export complex gradients',
    golden: 'export13_SVG.png',
    percentage: 0.06,
    size: [290, 400],
    async renderFunction(canvas, fabric) {
      const jsonData =
        '{"version":"7.0.0-beta1","objects":[{"type":"Path","version":"7.0.0-beta1","left":145.1673,"top":365.8115,"width":3.1427,"height":10.443,"fill":{"type":"linear","coords":{"x1":481.066,"y1":785.465,"x2":480.953,"y2":793.102},"colorStops":[{"offset":1,"color":"rgb(160,137,44)","opacity":1},{"offset":0.9,"color":"rgb(85,68,0)","opacity":1},{"offset":0.78,"color":"rgb(80,68,22)","opacity":1},{"offset":0.607,"color":"rgb(160,137,44)","opacity":1},{"offset":0.467,"color":"rgb(255,255,255)","opacity":1},{"offset":0.299,"color":"rgb(200,171,55)","opacity":1},{"offset":0.24,"color":"rgb(160,137,44)","opacity":1},{"offset":0.096,"color":"rgb(120,103,33)","opacity":1},{"offset":0,"color":"rgb(211,188,95)","opacity":1}],"offsetX":-439.1113425994523,"offsetY":-783.951,"gradientUnits":"pixels","gradientTransform":[-1,0,0,1,921.58,0]},"scaleX":9.32,"scaleY":10.58,"angle":-90,"path":[["M",442.142,794.394],["L",439.55899999999997,792.934],["C",438.91499999999996,790.544,439.04699999999997,787.93,439.44599999999997,785.241],["L",442.25399999999996,783.951]]},{"type":"Path","version":"7.0.0-beta1","left":144.2653,"top":299.5989,"width":2.415,"height":11.51,"fill":{"type":"linear","coords":{"x1":473.934,"y1":792.821,"x2":473.822,"y2":784.005},"colorStops":[{"offset":1,"color":"rgb(211,188,95)","opacity":1},{"offset":0.904,"color":"rgb(120,103,33)","opacity":1},{"offset":0.76,"color":"rgb(160,137,44)","opacity":1},{"offset":0.701,"color":"rgb(200,171,55)","opacity":1},{"offset":0.533,"color":"rgb(255,255,255)","opacity":1},{"offset":0.393,"color":"rgb(160,137,44)","opacity":1},{"offset":0.22,"color":"rgb(80,68,22)","opacity":1},{"offset":0.1,"color":"rgb(85,68,0)","opacity":1},{"offset":0,"color":"rgb(160,137,44)","opacity":1}],"offsetX":-446.578,"offsetY":-783.332,"gradientUnits":"pixels","gradientTransform":[-1,0,0,1,921.58,0]},"scaleX":9.32,"scaleY":10.58,"angle":-90,"path":[["M",448.32,783.332],["L",448.993,785.352],["C",448.108,786.5939999999999,448.163,788.304,448.918,793.2719999999999],["L",447.758,794.842],["L",446.578,790.352],["L",446.748,784.679],["Z"]]},{"type":"Path","version":"7.0.0-beta1","left":127.6333,"top":331.2713,"width":6.5657,"height":5.671,"fill":{"type":"linear","coords":{"x1":475.081,"y1":785.381,"x2":479.3,"y2":788.975},"colorStops":[{"offset":1,"color":"rgb(120,103,33)","opacity":1},{"offset":0,"color":"rgb(200,171,55)","opacity":1}],"offsetX":-441.1054336190674,"offsetY":-784.68,"gradientUnits":"pixels","gradientTransform":[-1,0,0,1,921.58,0]},"scaleX":9.32,"scaleY":10.58,"angle":-90,"path":[["M",447.365,784.68],["L",441.749,784.68],["C",441.15700000000004,786.55,440.937,788.423,441.24300000000005,790.295],["L",447.19500000000005,790.351],["C",447.85300000000007,788.375,447.749,786.508,447.36500000000007,784.681],["Z"]]},{"type":"Path","version":"7.0.0-beta1","left":180.2354,"top":330.4472,"width":6.5774,"height":4.483,"fill":{"type":"linear","coords":{"x1":476.181,"y1":791.235,"x2":477.099,"y2":794.257},"colorStops":[{"offset":1,"color":"rgb(120,103,33)","opacity":1},{"offset":0,"color":"rgb(200,171,55)","opacity":1}],"offsetX":-441.18800000000005,"offsetY":-790.248,"gradientUnits":"pixels","gradientTransform":[-1,0,0,1,921.58,0]},"scaleX":9.32,"scaleY":10.58,"angle":-90,"path":[["M",447.196,790.248],["C",447.593,791.74,447.809,793.388,447.75800000000004,794.731],["L",442.25500000000005,794.675],["C",441.28100000000006,792.822,441.29800000000006,791.5469999999999,441.18800000000005,790.269],["Z"]]},{"type":"Path","version":"7.0.0-beta1","left":91.0953,"top":326.0256,"width":6.4,"height":1.347,"fill":{"type":"linear","coords":{"x1":473.32,"y1":784.06,"x2":479.896,"y2":784.06},"colorStops":[{"offset":1,"color":"rgb(200,171,55)","opacity":1},{"offset":0,"color":"rgb(120,103,33)","opacity":1}],"offsetX":-441.751,"offsetY":-783.3879999999999,"gradientUnits":"pixels","gradientTransform":[-1,0,0,1,921.58,0]},"scaleX":9.32,"scaleY":10.58,"angle":-90,"path":[["M",447.196,784.68],["C",447.97900000000004,784.25,447.911,783.818,448.151,783.3879999999999],["L",442.481,783.612],["C",442.173,783.9549999999999,441.777,784.252,441.751,784.735],["Z"]]},{"type":"Path","version":"7.0.0-beta1","left":143.9938,"top":282.8443,"width":2.9869,"height":8.776,"fill":{"type":"linear","coords":{"x1":481.066,"y1":785.465,"x2":480.953,"y2":793.102},"colorStops":[{"offset":1,"color":"rgb(160,137,44)","opacity":1},{"offset":0.9,"color":"rgb(85,68,0)","opacity":1},{"offset":0.78,"color":"rgb(80,68,22)","opacity":1},{"offset":0.607,"color":"rgb(160,137,44)","opacity":1},{"offset":0.467,"color":"rgb(255,255,255)","opacity":1},{"offset":0.299,"color":"rgb(200,171,55)","opacity":1},{"offset":0.24,"color":"rgb(160,137,44)","opacity":1},{"offset":0.096,"color":"rgb(120,103,33)","opacity":1},{"offset":0,"color":"rgb(211,188,95)","opacity":1}],"offsetX":-228.298,"offsetY":-835.244,"gradientUnits":"pixels","gradientTransform":[0.93343,0,0,0.85628,-219.064,163.965]},"scaleX":9.32,"scaleY":10.58,"angle":90,"flipY":true,"path":[["M",228.298,844.02],["L",230.868,842.937],["C",231.468,840.889,231.345,838.652,230.972,836.35],["L",228.352,835.244]]},{"radius":2.321,"type":"Circle","version":"7.0.0-beta1","left":140.2058,"top":140.2058,"width":4.642,"height":4.642,"fill":{"type":"radial","coords":{"x1":193.676,"y1":141.252,"x2":193.676,"y2":141.252,"r1":0,"r2":4.082},"colorStops":[{"offset":1,"color":"rgb(0,0,0)","opacity":1},{"offset":0.969,"color":"rgb(0,0,0)","opacity":1},{"offset":0.904,"color":"rgb(236,236,236)","opacity":1},{"offset":0.874,"color":"rgb(77,77,77)","opacity":1},{"offset":0.837,"color":"rgb(237,237,237)","opacity":1},{"offset":0.817,"color":"rgb(0,0,0)","opacity":1},{"offset":0,"color":"rgb(0,0,0)","opacity":1}],"offsetX":-116.293,"offsetY":-166.167,"gradientUnits":"pixels","gradientTransform":[0.3487,0.40483,-0.40345,0.34752,108.054,40.97]},"scaleX":59.8,"scaleY":59.8},{"radius":1.789,"type":"Circle","version":"7.0.0-beta1","left":139.8202,"top":138.0102,"width":3.578,"height":3.578,"fill":{"type":"linear","coords":{"x1":195.171,"y1":143.461,"x2":191.574,"y2":138.568},"colorStops":[{"offset":1,"color":"rgb(204,204,204)","opacity":1},{"offset":0.687,"color":"rgb(255,255,255)","opacity":1},{"offset":0,"color":"rgb(255,255,255)","opacity":1}],"offsetX":-116.817,"offsetY":-166.661,"gradientUnits":"pixels","gradientTransform":[0.52872,0,0,0.52872,16.3,93.714]},"stroke":"#b3b3b3","strokeWidth":0.02,"strokeLineCap":"round","scaleX":59.8,"scaleY":59.8},{"radius":0.23,"type":"Circle","version":"7.0.0-beta1","left":139.664,"top":137.864,"width":0.46,"height":0.46,"fill":{"type":"linear","coords":{"x1":656.429,"y1":320.934,"x2":506.429,"y2":131.648},"colorStops":[{"offset":1,"color":"rgb(242,242,242)","opacity":1},{"offset":0,"color":"rgb(102,102,102)","opacity":1}],"offsetX":-118.37599999999999,"offsetY":-168.22,"gradientUnits":"pixels","gradientTransform":[0.0017,0,0,0.0017,117.64,168.082]},"stroke":"#999","strokeWidth":0,"strokeLineCap":"round","scaleX":59.8,"scaleY":59.8}]}';

      await canvas.loadFromJSON(jsonData);
    },
  },
  {
    title: 'Group with opacity and shadow',
    golden: 'group-svg-1.png',
    percentage: 0.06,
    size: [210, 230],
    async renderFunction(canvas, fabric) {
      const jsonData =
        '{"version":"7.0.0-beta1","objects":[{"type":"Group","version":"7.0.0-beta1","left":115.5,"top":114.5,"width":250,"height":250,"scaleX":0.9,"scaleY":0.9,"opacity":0.7,"shadow":{"color":"rgba(0,0,0,0.3)","blur":10,"offsetX":10,"offsetY":10,"affectStroke":false,"nonScaling":false,"type":"shadow"},"objects":[{"type":"Polygon","version":"7.0.0-beta1","left":0,"top":95.421,"width":148,"height":54.922,"fill":{"type":"linear","coords":{"x1":175,"y1":111.8719,"x2":175,"y2":-135.0812},"colorStops":[{"offset":1,"color":"rgb(0,38,57)","opacity":1},{"offset":0,"color":"rgb(0,46,59)","opacity":1}],"offsetX":-51,"offsetY":-192.962,"gradientUnits":"pixels","gradientTransform":[1,0,0,-1,-50,111]},"stroke":{"type":"linear","coords":{"x1":175,"y1":111.8719,"x2":175,"y2":-135.0812},"colorStops":[{"offset":1,"color":"rgb(0,38,57)","opacity":1},{"offset":0,"color":"rgb(0,46,59)","opacity":1}],"offsetX":-51,"offsetY":-192.962,"gradientUnits":"pixels","gradientTransform":[1,0,0,-1,-50,111]},"shadow":{"color":"red","blur":10,"offsetX":0,"offsetY":0,"affectStroke":false,"nonScaling":false,"type":"shadow"},"points":[{"x":124.913,"y":210.751},{"x":89.063,"y":193.264},{"x":89.103,"y":193.245},{"x":89.093,"y":193.24},{"x":51,"y":211.82},{"x":124.941,"y":247.884},{"x":199,"y":211.9},{"x":160.771,"y":192.962}]},{"type":"Polygon","version":"7.0.0-beta1","left":-36.728,"top":59.421,"width":74.364,"height":55.042,"fill":{"type":"radial","coords":{"x1":63.3041,"y1":235.6129,"x2":63.3041,"y2":235.6129,"r1":0,"r2":219.7985},"colorStops":[{"offset":1,"color":"rgb(20,157,145)","opacity":1},{"offset":0,"color":"rgb(0,188,133)","opacity":1}],"offsetX":-51.091,"offsetY":-156.903,"gradientUnits":"pixels"},"stroke":{"type":"radial","coords":{"x1":63.3041,"y1":235.6129,"x2":63.3041,"y2":235.6129,"r1":0,"r2":219.7985},"colorStops":[{"offset":1,"color":"rgb(20,157,145)","opacity":1},{"offset":0,"color":"rgb(0,188,133)","opacity":1}],"offsetX":-51.091,"offsetY":-156.903,"gradientUnits":"pixels"},"opacity":0.2,"points":[{"x":51.091,"y":211.945},{"x":51.091,"y":174.781},{"x":87.749,"y":156.903},{"x":125.455,"y":175.5}]},{"type":"Polygon","version":"7.0.0-beta1","left":36.8025,"top":-27.6885,"width":74.385,"height":118.383,"fill":{"type":"radial","coords":{"x1":186.8275,"y1":123.7814,"x2":186.8275,"y2":123.7814,"r1":0,"r2":265.5574},"colorStops":[{"offset":1,"color":"rgb(20,157,145)","opacity":1},{"offset":0,"color":"rgb(0,188,133)","opacity":1}],"offsetX":-124.611,"offsetY":-38.123,"gradientUnits":"pixels","gradientTransform":[1,0,0,-1,-50,111]},"stroke":{"type":"radial","coords":{"x1":186.8275,"y1":123.7814,"x2":186.8275,"y2":123.7814,"r1":0,"r2":265.5574},"colorStops":[{"offset":1,"color":"rgb(20,157,145)","opacity":1},{"offset":0,"color":"rgb(0,188,133)","opacity":1}],"offsetX":-124.611,"offsetY":-38.123,"gradientUnits":"pixels","gradientTransform":[1,0,0,-1,-50,111]},"points":[{"x":165.596,"y":58.995},{"x":165.596,"y":117.758},{"x":165.596,"y":117.758},{"x":165.596,"y":117.758},{"x":124.611,"y":137.737},{"x":162.301,"y":156.506},{"x":198.996,"y":138.632},{"x":198.996,"y":38.123}]},{"type":"Polygon","version":"7.0.0-beta1","left":0.052,"top":0.002,"width":147.904,"height":173.824,"fill":{"type":"radial","coords":{"x1":118.0562,"y1":143.2378,"x2":118.0562,"y2":143.2378,"r1":0,"r2":507.5908},"colorStops":[{"offset":1,"color":"rgb(0,52,95)","opacity":1},{"offset":0,"color":"rgb(0,68,115)","opacity":1}],"offsetX":-51.096,"offsetY":-38.088,"gradientUnits":"pixels","gradientTransform":[1,0,0,-1,-50,111]},"stroke":{"type":"radial","coords":{"x1":118.0562,"y1":143.2378,"x2":118.0562,"y2":143.2378,"r1":0,"r2":507.5908},"colorStops":[{"offset":1,"color":"rgb(0,52,95)","opacity":1},{"offset":0,"color":"rgb(0,68,115)","opacity":1}],"offsetX":-51.096,"offsetY":-38.088,"gradientUnits":"pixels","gradientTransform":[1,0,0,-1,-50,111]},"points":[{"x":199,"y":211.912},{"x":199,"y":211.912},{"x":199,"y":174.746},{"x":84.498,"y":117.723},{"x":84.498,"y":58.96},{"x":51.096,"y":38.088},{"x":51.096,"y":138.597}]},{"type":"Polygon","version":"7.0.0-beta1","left":-0.078,"top":-94.5535,"width":147.844,"height":56.933,"fill":{"type":"linear","coords":{"x1":174.922,"y1":110.6136,"x2":174.922,"y2":-135.0903},"colorStops":[{"offset":1,"color":"rgb(0,38,57)","opacity":1},{"offset":0,"color":"rgb(0,46,59)","opacity":1}],"offsetX":-51,"offsetY":-1.985,"gradientUnits":"pixels","gradientTransform":[1,0,0,-1,-50,111]},"stroke":{"type":"linear","coords":{"x1":174.922,"y1":110.6136,"x2":174.922,"y2":-135.0903},"colorStops":[{"offset":1,"color":"rgb(0,38,57)","opacity":1},{"offset":0,"color":"rgb(0,46,59)","opacity":1}],"offsetX":-51,"offsetY":-1.985,"gradientUnits":"pixels","gradientTransform":[1,0,0,-1,-50,111]},"points":[{"x":84.396,"y":58.904},{"x":84.396,"y":58.892},{"x":124.939,"y":39.118},{"x":165.485,"y":58.892},{"x":198.844,"y":38.046},{"x":124.912,"y":1.985},{"x":51,"y":38.035},{"x":51,"y":38.067},{"x":84.368,"y":58.918}]}]}]}';

      await canvas.loadFromJSON(jsonData);
    },
  },
  {
    title: 'Multiple gradients import',
    golden: 'multipleGradients.png',
    percentage: 0.06,
    size: [760, 760],
    async renderFunction(canvas, fabric) {
      const asset = await globalThis.getAsset('svg_linear_9.svg');
      const { objects } = await fabric.loadSVGFromString(asset);
      const nonNullObjects = objects.filter((obj) => !!obj);
      const group = fabric.util.groupSVGElements(nonNullObjects);
      canvas.add(group);
      await new Promise((resolve) => {
        toSVGCanvas(canvas, resolve, fabric);
      });
    },
  },
  {
    title: 'Gradient should be applied to path in svg',
    golden: 'pathWithGradientSvg.png',
    percentage: 0.06,
    size: [100, 100],
    async renderFunction(canvas, fabric) {
      const path = new fabric.Path('M 0 0 L 0 100 L 100 100 L 100 0 Z', {
        width: 100,
        height: 100,
        fill: new fabric.Gradient({
          gradientUnits: 'percentage',
          coords: { x1: 0, y1: 0, x2: 0, y2: 1 },
          colorStops: [
            { offset: 0, color: 'red' },
            { offset: 1, color: 'black' },
          ],
        }),
      });
      canvas.add(path);
    },
  },
];
