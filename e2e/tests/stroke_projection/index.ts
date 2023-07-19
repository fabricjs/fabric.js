import * as fabric from 'fabric';
import { beforeAll } from '../test';
import type { TestSpec } from './spec/util';

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

      target.controls = {};
      canvas.add(target);
      canvas.setActiveObject(target);
      canvas.viewportCenterObject(target);
      target.setCoords();
      canvas.renderAll();

      const { tl: _tl, br: _br } = target.aCoords;
      const tl = _tl.min(_br);
      const br = _tl.max(_br);
      const w = Math.ceil(br.x - tl.x) + d * 2;
      const h = Math.ceil(br.y - tl.y) + d * 2;
      const ctx = canvas
        .getElement()
        .getContext('2d', { willReadFrequently: true });
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
    };
  },
  { enableRetinaScaling: false, width: 600, height: 900 }
);
