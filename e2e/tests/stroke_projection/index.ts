import * as fabric from 'fabric';
import { beforeAll } from '../test';
import type { TestSpec } from './spec/util';

function sampleBorders(
  ctx: CanvasRenderingContext2D,
  [a, b]: [fabric.Point, fabric.Point],
  d: number
) {
  const tl = a.min(b);
  const br = a.max(b);
  const w = Math.ceil(br.x - tl.x) + d * 2;
  const h = Math.ceil(br.y - tl.y) + d * 2;
  const left = ctx.getImageData(tl.x - d, tl.y - d, 1, h);
  const top = ctx.getImageData(tl.x - d, tl.y - d, w, 1);
  const right = ctx.getImageData(br.x + d, tl.y - d, 1, h);
  const bottom = ctx.getImageData(tl.x - d, br.y + d, w, 1);
  return {
    left: Array.from(left.data),
    top: Array.from(top.data),
    right: Array.from(right.data),
    bottom: Array.from(bottom.data),
    width: w,
    height: h,
  };
}

beforeAll(
  (canvas) => {
    window.testProjection = ({
      type,
      points,
      group,
      options,
      distanceFromEdge: d,
    }: TestSpec & {
      distanceFromEdge: number;
    }) => {
      const poly = new (type === 'polygon' ? fabric.Polygon : fabric.Polyline)(
        points,
        {
          fill: `rgb(255, 0, 0)`,
          strokeWidth: 10,
          stroke: 'rgb(120, 0, 0)',
          objectCaching: false,
          exactBoundingBox: true,
          ...options,
        }
      );
      let target: fabric.Polyline | fabric.Group = poly;
      if (group) {
        target = new fabric.Group([poly], {
          objectCaching: false,
          subTargetCheck: true,
        });
      }
      target.scaleX = 2;
      target.scaleY = 3;
      poly.setDimensions();

      canvas.clear();

      const ctx = canvas
        .getElement()
        .getContext('2d', { willReadFrequently: true });
      target.controls = {};
      canvas.add(target);
      canvas.viewportCenterObject(target);
      target.setCoords();
      canvas.renderAll();
      const { tl: a, br: b } = target.aCoords;
      const samples = {
        outer: sampleBorders(ctx, [a, b], d),
        inner: sampleBorders(ctx, [a, b], -d),
      };
      // this is for us humans to see what is going on
      // sampling is done without the borders
      canvas.setActiveObject(target);
      return samples;
    };
  },
  { enableRetinaScaling: false, width: 600, height: 900 }
);
