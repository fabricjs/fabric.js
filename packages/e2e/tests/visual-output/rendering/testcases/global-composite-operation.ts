import type { FabricImage } from 'fabric';
import type { FabricNamespace, renderTestType } from '../../../types';

// based on https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation#operations
// source https://github.com/mdn/content/blob/main/files/en-us/web/api/canvas_api/tutorial/compositing/example/index.md

const OPERATIONS: GlobalCompositeOperation[] = [
  'color',
  'color-burn',
  'color-dodge',
  'copy',
  'darken',
  'destination-atop',
  'destination-in',
  'destination-out',
  'destination-over',
  'difference',
  'exclusion',
  'hard-light',
  'hue',
  'lighten',
  'lighter',
  'luminosity',
  'multiply',
  'overlay',
  'saturation',
  'screen',
  'soft-light',
  'source-atop',
  'source-in',
  'source-out',
  'source-over',
  'xor',
];

const radius = 100;

const size = {
  width: 320,
  height: 300,
};

/**
 * source https://github.com/mdn/content/blob/main/files/en-us/web/api/canvas_api/tutorial/compositing/example/index.md#utility-functions
 */
const colorSphere = (fabric: FabricNamespace, r: number) => {
  const c = fabric.util.createCanvasElement();
  c.width = c.height = r * 2;
  const ctx = c.getContext('2d')!;
  const rotate = (1 / 360) * Math.PI * 2; // per degree
  const oleft = 0;
  const otop = 0;

  for (let n = 0; n < 360; n++) {
    const gradient = ctx.createLinearGradient(
      oleft + r,
      otop,
      oleft + r,
      otop + r,
    );
    gradient.addColorStop(0, 'rgba(0,0,0,0)');
    gradient.addColorStop(0.7, `hsl(${(n + 300) % 360},100%,50%)`);
    gradient.addColorStop(1, 'rgba(255,255,255,1)');
    ctx.beginPath();
    ctx.moveTo(oleft + r, otop);
    ctx.lineTo(oleft + r, otop + r);
    ctx.lineTo(oleft + r + 6, otop);
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.translate(oleft + r, otop + r);
    ctx.rotate(rotate);
    ctx.translate(-(oleft + r), -(otop + r));
  }

  return c;
};

function createExisting(fabric: FabricNamespace): FabricImage {
  const centerPoint = new fabric.Point(size.width, size.height).scalarDivide(2);
  return new fabric.FabricImage(colorSphere(fabric, radius * 2), {
    left: centerPoint.x,
    top: centerPoint.y,
    originX: 'center',
    originY: 'center',
  });
}

function createNew(
  fabric: FabricNamespace,
  operation: GlobalCompositeOperation,
) {
  const centerPoint = new fabric.Point(size.width, size.height).scalarDivide(2);

  const circles = [
    {
      fill: 'rgb(255,0,0)',
      center: new fabric.Point(100, 200),
    },
    {
      fill: 'rgb(0,0,255)',
      center: new fabric.Point(220, 200),
    },
    {
      fill: 'rgb(0,255,0)',
      center: new fabric.Point(160, 100),
    },
  ].map(({ fill, center }) => {
    return new fabric.Circle({
      radius,
      globalCompositeOperation: 'lighter',
      fill,
      left: center.x,
      top: center.y,
      originX: 'center',
      originY: 'center',
    });
  });

  return new fabric.Group(circles, {
    left: centerPoint.x,
    top: centerPoint.y,
    originX: 'center',
    originY: 'center',
    globalCompositeOperation: operation,
    objectCaching: true,
  });
}

function createPreview(
  fabric: FabricNamespace,
  operation: GlobalCompositeOperation,
) {
  const r1 = new fabric.Rect({
    width: 30,
    height: 30,
    fill: 'blue',
    left: 15,
    top: 15,
  });

  const r2 = new fabric.Rect({
    width: 30,
    height: 30,
    fill: 'red',
    globalCompositeOperation: operation,
  });

  return new fabric.Group([r1, r2], { objectCaching: true });
}

function generateGlobalCompositeTests(): renderTestType[] {
  return OPERATIONS.map(
    (operation): renderTestType => ({
      title: `globalCompositeOperation: ${operation}`,
      golden: `${operation}.png`,
      snapshotSuffix: 'gco',
      percentage: 0.04,
      size: [size.width, size.height],
      async renderFunction(canvas, fabric) {
        // goldens are transparent
        canvas.backgroundColor = 'transparent';

        const bg = createExisting(fabric);
        bg.canvas = canvas;
        canvas.backgroundImage = bg;
        canvas.add(
          createPreview(fabric, operation),
          createNew(fabric, operation),
        );
        canvas.renderAll();
      },
    }),
  );
}

export const globalCompositeOperationTests = generateGlobalCompositeTests();
