import type { renderTestType } from '../../../types';

const generic1: renderTestType = {
  title: 'Rect with strokeUniform: true',
  golden: 'generic1.png',
  percentage: 0.09,
  size: [150, 60],
  async renderFunction(canvas, fabric) {
    const rect = new fabric.Rect({
      width: 20,
      height: 40,
      strokeWidth: 2,
      scaleX: 6,
      scaleY: 0.5,
      strokeUniform: true,
      fill: '',
      stroke: 'red',
    });

    const rect2 = new fabric.Rect({
      width: 60,
      height: 60,
      top: 4,
      left: 4,
      strokeWidth: 2,
      scaleX: 2,
      scaleY: 0.5,
      strokeUniform: false,
      fill: '',
      stroke: 'blue',
    });

    canvas.add(rect);
    canvas.add(rect2);
    canvas.renderAll();
  },
};

const renderStrokeWithNegativeScale: renderTestType = {
  title: 'Rect with strokeUniform: true and negative scaling',
  golden: 'strokeNegativeScale.png',
  percentage: 0.011,
  disabled: 'node',
  size: [100, 100],
  async renderFunction(canvas, fabric) {
    const rect = new fabric.Rect({
      width: 10,
      height: 10,
      fill: 'transparent',
      stroke: 'blue',
      strokeWidth: 15,
      strokeUniform: true,
      strokeDashArray: [2, 2],
      top: 65,
      left: 30,
    });

    // do not do this at init time or they will be positive
    rect.scaleX = -2;
    rect.scaleY = -4;

    const rect2 = new fabric.Rect({
      width: 10,
      height: 10,
      fill: 'transparent',
      stroke: 'red',
      strokeWidth: 15,
      scaleX: -2,
      scaleY: -4,
      strokeDashArray: [2, 2],
      strokeUniform: true,
      top: 10,
      left: 55,
    });

    canvas.add(rect, rect2);
    canvas.renderAll();
  },
};

const shadownonscaling: renderTestType = {
  title: 'Rect DropShadow with nonScaling: true',
  golden: 'shadownonscaling.png',
  percentage: 0.09,
  size: [150, 60],
  async renderFunction(canvas, fabric) {
    const obj = new fabric.Rect();
    obj.set({
      width: 10,
      height: 10,
      scaleX: 12,
      scaleY: 3,
      top: 10,
      left: 5,
      fill: '#f55',
    });
    obj.set(
      'shadow',
      new fabric.Shadow({
        color: 'rgba(0,100,0,0.9)',
        blur: 5,
        offsetX: 8,
        offsetY: 8,
        nonScaling: true,
      }),
    );

    canvas.add(obj);
    canvas.renderAll();
  },
};

const polygonWithStroke: renderTestType = {
  title: 'polygon position independently from strokeWidth and origin',
  golden: 'polygonWithStroke.png',
  percentage: 0.09,
  size: [210, 210],
  async renderFunction(canvas, fabric) {
    canvas.set({ backgroundColor: '#AAAA77' });

    const p1 = new fabric.Polygon(
      [
        { x: 0, y: 216 },
        { x: 125, y: 433 },
        { x: 375, y: 433 },
        { x: 500, y: 216 },
        { x: 375, y: 0 },
        { x: 125, y: 0 },
      ],
      {
        fill: 'white',
      },
    );

    canvas.add(p1);

    const p2 = new fabric.Polygon(
      [
        { x: 0, y: 216 },
        { x: 125, y: 433 },
        { x: 375, y: 433 },
        { x: 500, y: 216 },
        { x: 375, y: 0 },
        { x: 125, y: 0 },
      ],
      {
        fill: 'transparent',
        stroke: '#00AAFFAA',
        strokeWidth: 15,
        originX: 'center',
        originY: 'center',
      },
    );

    canvas.add(p2);
    canvas.setZoom(0.4);
    canvas.renderAll();
  },
};

const backgroundWithGradient: renderTestType = {
  title: 'canvas can have a gradient background',
  golden: 'backgroundWithGradient.png',
  percentage: 0.09,
  size: [300, 300],
  async renderFunction(canvas, fabric) {
    const g = new fabric.Gradient({
      type: 'linear',
      gradientTransform: [0.4, -0.4, 0.2, 0.1, 3, 5],
      coords: {
        x1: 0,
        y1: 0,
        x2: 200,
        y2: 0,
      },
      colorStops: [
        {
          offset: 0,
          color: 'green',
        },
        {
          offset: 0.5,
          color: 'white',
        },
        {
          offset: 1,
          color: 'blue',
        },
      ],
    });

    canvas.set({ backgroundColor: g });
    canvas.renderAll();
  },
};

const backgroundWithGradientZoom: renderTestType = {
  title: 'canvas can have a gradient background and being zoomed',
  golden: 'backgroundWithGradientZoom.png',
  percentage: 0.09,
  size: [300, 300],
  async renderFunction(canvas, fabric) {
    canvas.setZoom(0.1);

    const g = new fabric.Gradient({
      type: 'linear',
      gradientTransform: [0.4, -0.4, 0.2, 0.1, 3, 5],
      coords: {
        x1: 0,
        y1: 0,
        x2: 300,
        y2: 0,
      },
      colorStops: [
        {
          offset: 0,
          color: 'green',
        },
        {
          offset: 0.5,
          color: 'white',
        },
        {
          offset: 1,
          color: 'blue',
        },
      ],
    });

    canvas.set({ backgroundColor: g });
    canvas.renderAll();
  },
};

const backgroundWithGradientNoVpt: renderTestType = {
  title: 'canvas can have a gradient background with zoom but being unaffected',
  golden: 'backgroundWithGradient.png',
  percentage: 0.09,
  size: [300, 300],
  async renderFunction(canvas, fabric) {
    canvas.setZoom(0.1);
    canvas.backgroundVpt = false;

    const g = new fabric.Gradient({
      type: 'linear',
      gradientTransform: [0.4, -0.4, 0.2, 0.1, 3, 5],
      coords: {
        x1: 0,
        y1: 0,
        x2: 200,
        y2: 0,
      },
      colorStops: [
        {
          offset: 0,
          color: 'green',
        },
        {
          offset: 0.5,
          color: 'white',
        },
        {
          offset: 1,
          color: 'blue',
        },
      ],
    });

    canvas.set({ backgroundColor: g });
    canvas.renderAll();
  },
};

const objectsInActiveSelections: renderTestType = {
  title: 'objects in activeSelection toCanvasElement',
  golden: 'objectsInActiveSelections.png',
  percentage: 0.09,
  size: [300, 300],
  async renderFunction(canvas, fabric) {
    canvas.setZoom(0.1);

    const rect1 = new fabric.Rect({
      fill: 'purple',
      top: 30,
      left: 50,
      width: 30,
      height: 100,
      angle: 10,
    });

    const rect2 = new fabric.Rect({
      fill: 'green',
      top: 150,
      left: 10,
      width: 300,
      height: 30,
      angle: -10,
    });

    new fabric.ActiveSelection([rect1, rect2]);

    const canvasEl = rect1.toCanvasElement();

    return canvasEl.toDataURL('image/png');
  },
};

const canvasPattern: renderTestType = {
  title: 'canvas with background pattern and export',
  golden: 'canvasPattern.png',
  percentage: 0.09,
  size: [500, 500],
  async renderFunction(canvas, fabric) {
    const img = await globalThis.getImage(fabric, 'diet.jpeg');

    canvas.backgroundColor = new fabric.Pattern({
      source: img,
      repeat: 'repeat',
      offsetX: -120,
      offsetY: 50,
    });
    canvas.renderAll();
  },
};

const canvasPatternMultiplier: renderTestType = {
  title: 'canvas with background pattern and multiplier',
  golden: 'canvasPatternMultiplier.png',
  percentage: 0.09,
  size: [500, 500],
  async renderFunction(canvas, fabric) {
    const img = await globalThis.getImage(fabric, 'diet.jpeg');

    canvas.backgroundColor = new fabric.Pattern({
      source: img,
      repeat: 'repeat',
      offsetX: -120,
      offsetY: 50,
    });

    return canvas.toCanvasElement(0.3).toDataURL();
  },
};

const imageSmoothing: renderTestType = {
  title: 'fabric.Image with imageSmoothing false',
  golden: 'imageSoothingOnObject.png',
  percentage: 0.09,
  size: [800, 400],
  async renderFunction(canvas, fabric) {
    const img = await globalThis.getImage(fabric, 'greyfloral.png');

    const fImg = new fabric.FabricImage(img, {
      imageSmoothing: false,
      scaleX: 10,
      scaleY: 10,
    });

    const fImg2 = new fabric.FabricImage(img, {
      left: 400,
      scaleX: 10,
      scaleY: 10,
    });

    canvas.add(fImg);
    canvas.add(fImg2);
    canvas.renderAll();
  },
};

const toCanvasElementAndControls: renderTestType = {
  title: 'fabric.Canvas will not export controls',
  golden: 'toCanvasElementAndControls.png',
  percentage: 0.02,
  size: [300, 300],
  async renderFunction(canvas, fabric) {
    const rect = new fabric.Rect({
      width: 200,
      height: 200,
      left: 50,
      top: 50,
      fill: 'yellow',
    });

    canvas.add(rect);
    canvas.setActiveObject(rect);
    canvas.renderAll();
  },
};

const pathWithGradient: renderTestType = {
  title: 'gradient should be applied to path',
  golden: 'pathWithGradient.png',
  percentage: 0.06,
  size: [100, 100],
  async renderFunction(canvas, fabric) {
    const pathWithGradient = new fabric.Path(
      'M 0 0 L 0 100 L 100 100 L 100 0 Z',
      {
        fill: new fabric.Gradient({
          gradientUnits: 'percentage',
          coords: { x1: 0, y1: 0, x2: 0, y2: 1 },
          colorStops: [
            { offset: 0, color: 'red' },
            { offset: 1, color: 'black' },
          ],
        }),
        height: 100,
        width: 100,
        top: 0,
        left: 0,
      },
    );

    canvas.add(pathWithGradient);
    canvas.renderAll();
  },
};

const gradientStroke: renderTestType = {
  title: 'Use the gradient strokeStyle for line(other shape is ok)',
  golden: 'gradientStroke.png',
  percentage: 0.04,
  size: [300, 300],
  async renderFunction(canvas, fabric) {
    const line = new fabric.Line([10, 10, 200, 200], {
      stroke: new fabric.Gradient({
        type: 'linear',
        coords: {
          x1: 20,
          y1: 0,
          x2: 80,
          y2: 0,
        },
        colorStops: [
          {
            offset: 0,
            color: 'green',
          },
          {
            offset: 0.4,
            color: 'cyan',
          },
          {
            offset: 1,
            color: 'red',
          },
        ],
        gradientTransform: [1, 0, 0, 1, 50, 0],
      }),
      strokeWidth: 20,
    });

    canvas.add(line);
    canvas.renderAll();
  },
};

const textGradientFill: renderTestType = {
  title: 'Use the gradient fillStyle for text',
  golden: 'textGradientFill.png',
  percentage: 0.04,
  size: [300, 100],
  async renderFunction(canvas, fabric) {
    const text = new fabric.FabricText('Some Text', {
      fontSize: 40,
      left: 25,
      top: -25,
      fontWeight: 'bold',
      fill: new fabric.Gradient({
        type: 'radial',
        coords: {
          x1: 0,
          y1: 0,
          r1: 100,
          x2: 0,
          y2: 0,
          r2: 50,
        },
        colorStops: [
          {
            offset: 0,
            color: 'white',
          },
          {
            offset: 0.5,
            color: 'indianred',
          },
          {
            offset: 1,
            color: 'green',
          },
        ],
        gradientTransform: [1, 0, 0, 1, 50, 50],
      }),
    });

    canvas.add(text);
    canvas.renderAll();
  },
};

const polygonAndPaths: renderTestType = {
  title: 'polygon and paths',
  golden: 'polygonAndPaths.png',
  percentage: 0.04,
  size: [300, 300],
  async renderFunction(canvas, fabric) {
    canvas.backgroundColor = 'yellow';

    for (let i = 0; i < 30; i++) {
      const line = new fabric.Line([i, 0, i, 30], {
        strokeWidth: 0.2,
        stroke: 'lightgrey',
        objectCaching: false,
      });

      const line2 = new fabric.Line([0, i, 30, i], {
        strokeWidth: 0.2,
        stroke: 'lightgrey',
        objectCaching: false,
      });

      canvas.add(line);
      canvas.add(line2);
    }

    const points = [
      {
        x: 2,
        y: 2,
      },
      {
        x: 10,
        y: 2,
      },
      {
        x: 9,
        y: 10,
      },
      {
        x: 4,
        y: 10,
      },
    ];

    const polygon = new fabric.Polygon(points, {
      strokeWidth: 2,
      opacity: 0.5,
      stroke: 'pink',
      originX: 'right',
      originY: 'top',
      fill: '',
      objectCaching: false,
    });

    const polygon2 = new fabric.Polygon(points, {
      strokeWidth: 0.2,
      stroke: 'black',
      originX: 'left',
      originY: 'bottom',
      fill: '',
      objectCaching: false,
    });

    const path = 'M 15 2 H 25 L 28 14 25 16 H 17 Z';

    const path1 = new fabric.Path(path, {
      strokeWidth: 2,
      opacity: 0.5,
      stroke: 'blue',
      originX: 'right',
      originY: 'top',
      fill: '',
      objectCaching: false,
    });

    const path2 = new fabric.Path(path, {
      strokeWidth: 0.2,
      stroke: 'black',
      originX: 'left',
      originY: 'bottom',
      fill: '',
      objectCaching: false,
    });

    const line1 = new fabric.Line([6, 22, 24, 22], {
      strokeWidth: 2,
      stroke: 'green',
      originX: 'right',
      originY: 'top',
      opacity: 0.5,
      objectCaching: false,
    });

    const line2 = new fabric.Line([6, 22, 24, 22], {
      strokeWidth: 0.2,
      stroke: 'black',
      objectCaching: false,
      originX: 'left',
      originY: 'bottom',
    });

    const line3 = new fabric.Line([6, 26, 24, 26], {
      strokeWidth: 2,
      stroke: 'blue',
      originX: 'right',
      originY: 'top',
      opacity: 0.5,
      strokeLineCap: 'round',
    });

    const line4 = new fabric.Line([6, 26, 24, 26], {
      strokeWidth: 0.2,
      stroke: 'black',
      objectCaching: false,
      originX: 'left',
      originY: 'bottom',
    });

    canvas.setZoom(10);
    canvas.add(polygon, polygon2, path1, path2, line1, line2, line3, line4);
    canvas.renderAll();
  },
};

export const genericRenderingTests = [
  generic1,
  renderStrokeWithNegativeScale,
  shadownonscaling,
  polygonWithStroke,
  backgroundWithGradient,
  backgroundWithGradientZoom,
  backgroundWithGradientNoVpt,
  objectsInActiveSelections,
  canvasPattern,
  canvasPatternMultiplier,
  imageSmoothing,
  toCanvasElementAndControls,
  pathWithGradient,
  gradientStroke,
  textGradientFill,
  polygonAndPaths,
];
